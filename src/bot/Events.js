import { config, onlinePlayers} from "../index.js";
import { autoEat, equipItem } from "./utils/Inventory.js";
import chalk from "chalk";
import { GRAY, PLAYER, PRIMARY } from "../utils/other/Colors.js";
import { getPermissionLevel } from "../utils/other/Data.js";
import { center } from "./utils/Movement.js";
import { attack } from "./utils/Attack.js";
import { Vec3 } from "vec3";
import { canTeleport } from "./utils/World.js";
import TeleportTask from "./utils/TeleportTask.js";
import { drawTemporaryLine, drawTemporaryVec3 } from "./utils/RenderUtils.js";

export default function initEvents(i) {
    const perm = async (username) => await getPermissionLevel(username, i.bot.username);
    let lastHealth;
    let isSneaking = false;

    i.bot.on('spawn', () => {
        i.logger.info('Spawned');
    });

    i.bot.on('respawn', () => {
        setTimeout(() => {
            const { x, y, z } = i.bot.entity.position;
            i.logger.info(`Respawned at X: ${x.toFixed(1)}, Y: ${y.toFixed(1)}, Z: ${z.toFixed(1)}`);
        }, 100);
    });

    i.bot.on('messagestr', (_, __, jsonMsg) => i.logger.chat(jsonMsg.toAnsi()));

    i.bot.on('chat', async (username, message) => {
        if (config.commands.chat && username !== i.bot.username) await i.executeChatCommand(username, message);
    });

    i.bot.on('whisper', async (username, message) => {
        if (config.commands.whisper && username !== i.bot.username && username !== 'me') await i.executeChatCommand(username, message);
    });

    i.bot.on('kicked', (reason) => {
        i.logger.warn('Kicked: ' + reason?.value?.translate?.value || JSON.stringify(reason, null, 2));
    });

    i.bot.on('end', (reason) => {
        i.logger.warn('Lost connection: ' + reason);
        i.gameTicks = 0;
        if (reason.includes('ReconnectCommand')) return;
        if (config.autoReconnect.enabled) setTimeout(() => i.init(), config.autoReconnect.timeout);
    });

    i.bot.on('physicsTick', async () => {
        if (i.bot.entity.velocity.y < -0.5 && config.noFall) {
            i.bot._client.write('position', {
                x: i.bot.entity.position.x,
                y: i.bot.entity.position.y,
                z: i.bot.entity.position.z,
                onGround: true
            });
        }

        const botPos = i.bot.entity.position;
        const nearbyPlayers = Object.values(i.bot.players).filter(p => p.entity && p.username !== i.bot.username);

        for (const p of nearbyPlayers) {
            const pPos = p.entity.position;
            const distance = botPos.distanceTo(pPos);
            if (distance > 400) continue;

            let color = distance > 50 ? 0x00ff00 : distance > 5 ? 0xf6ff00 : 0xff0000;
            if (config.friends.includes(p.username)) color = 0x3296fa;

            drawTemporaryLine(i, 'tracer' + p.username, [
                { x: pPos.x, y: pPos.y + 1.8, z: pPos.z },
                { x: botPos.x, y: botPos.y + 1.8, z: botPos.z }
            ], color, 50);

            drawTemporaryVec3(i, 'cube' + p.username, p.entity.position.offset(0, 1.8, 0), 0.5, color, 50);
        }

        if (config.antiVoid && botPos.y < -70) {
            let height = -62;
            while (!canTeleport(i, new Vec3(botPos.x, height, botPos.z))) height++;
            await new TeleportTask(i, true, true).fastTeleport(new Vec3(botPos.x, height, botPos.z), false);
            return;
        }

        i.gameTicks++;

        if (config.autoTotem) equipItem(i, 'totem_of_undying', 'off-hand', false);
        if (config.autoEat && !i.isEating) await autoEat(i);
        if (config.autoArmor) await i.bot.armorManager.equipAll();

        if (i.followTarget.target) {
            try {
                await new TeleportTask(i, true, false).fastTeleport(i.followTarget.target.entity.position, false);
            } catch {}
        }

        if (config.lookAtNearestPlayer && i.bot.pathfinder.goal === null && !i.notebot?.isPlaying && !i.bot.entity.sneaking) {
            const nearestPlayer = nearbyPlayers.reduce((nearest, player) => {
                const distance = botPos.distanceTo(player.entity.position);
                return distance < nearest.distance ? { player, distance } : nearest;
            }, { player: null, distance: Infinity }).player;

            if (nearestPlayer) {
                try {
                    await i.bot.lookAt(nearestPlayer.entity.position.offset(0, nearestPlayer.entity.height - 0.18, 0), false);
                } catch {}
            }
        }
    });


    i.bot._client.on('packet', async (data, metadata) => {
        if ((config.velocity || i.fly) && i.bot.pathfinder.goal === null) {
            i.bot.entity.velocity = new Vec3(0, i.fly ? 0 : i.bot.entity.velocity.y, 0);
            i.bot.physics.terminalVelocity = 0;
            i.bot.physics.gravity = i.fly ? 0 : 0.08;
        }

        switch (metadata.name) {
            case 'entity_metadata':
                if (!config.sneakAtPlayers) return;
                for (const meta of data.metadata) {
                    if (meta.type === 'pose' && meta.value === 5 && !isSneaking && !i.notebot?.isPlaying) {
                        const entity = i.bot.entities[data.entityId];
                        if (!entity || entity.type !== 'player' || entity.username === i.bot.username) return;
                        if (i.bot.entity.position.distanceTo(entity.position) > 10) return;
                        if (i.bot.pathfinder.goal !== null) return;

                        i.bot.setControlState('sneak', true);
                        isSneaking = true;
                        await i.bot.lookAt(entity.position.offset(0, entity.height - 0.18, 0), true);

                        setTimeout(() => {
                            i.bot.setControlState('sneak', false);
                            isSneaking = false;
                        }, 500);
                    }
                }
                break;

            case 'entity_status':
                if (data.entityStatus !== 35) return;
                const entity = i.bot.entities[data.entityId];
                if (!entity) return;
                i.logger.warn(`${entity.username || entity.id} popped a totem`);
                if (config.logOnTotemPop && entity.username === i.bot.username) i.bot.quit('AutoLog');
                break;

            case 'damage_event':
                const attacker = i.bot.entities[data.sourceCauseId - 1];
                const target = i.bot.entities[data.entityId];
                if (!target || target.type !== 'player') return;

                const attackerName = chalk.hex(PLAYER(attacker?.username))(attacker?.username || attacker?.displayName || 'Something');
                const targetName = chalk.hex(PLAYER(target?.username))(target?.username || target?.displayName || 'Undefined');

                if (target.username === i.bot.username) i.logger.warn(`${attackerName} attacked ${targetName}`);
                else i.logger.info(`${attackerName} attacked ${targetName}`);

                if (config.retaliate.enabled && !(config.retaliate.ignoreFriends && config.friends.includes(attacker?.username)) && attacker?.username !== i.bot.username && target.username === i.bot.username) {
                    await attack(i, attacker, true, [35]);
                }
                break;
        }
    });

    i.bot.on('playerJoined', async (player) => {
        if (onlinePlayers.includes(player.username)) return;
        onlinePlayers.push(player.username);

        const playerCount = onlinePlayers.length;
        const message = `${player.username};${playerCount}`;

        i.logger.log(chalk.gray('[') + chalk.green('+') + chalk.gray('] ') + chalk.hex(PLAYER(player.username))(player.username) + ' joined ' + chalk.gray(await perm(player.username)));
    });

    i.bot.on('playerLeft', async (player) => {
        const index = onlinePlayers.indexOf(player.username);
        if (index !== -1) onlinePlayers.splice(index, 1);

        const playerCount = onlinePlayers.length;
        const message = `${player.username};${playerCount}`;

        i.logger.log(chalk.gray('[') + chalk.redBright('-') + chalk.gray('] ') + chalk.hex(PLAYER(player.username))(player.username) + ' left ' + chalk.gray(await perm(player.username)));
    });

    i.bot.on('entitySpawn', (entity) => {
        if (entity.type === 'player' && entity.username !== i.bot.username) {
            i.logger.info(`${chalk.hex(PLAYER(entity.username))(entity.username)} has entered my view ${chalk.gray('[' + i.bot.entity.position.distanceTo(entity.position).toFixed(1) + 'm]')}`);
        }
    });

    i.bot.on('entityGone', (entity) => {
        if (entity.type === 'player' && entity.username !== i.bot.username) {
            i.logger.info(`${chalk.hex(PLAYER(entity.username))(entity.username)} has left my view ${chalk.gray('[' + i.bot.entity.position.distanceTo(entity.position).toFixed(1) + 'm]')}`);
        }
    });

    i.bot.on('health', () => {
        if (!canTeleport(i, i.bot.entity.position)) center(i);

        const currentHealth = Math.round(i.bot.health * 2) / 2;
        if (lastHealth !== currentHealth) {
            const logFn = i.bot.health > 10 ? i.logger.info.bind(i.logger) : i.logger.warn.bind(i.logger);
            logFn(`Health Update. Current health: ${chalk.hex(PRIMARY)(currentHealth)}`);
            lastHealth = currentHealth;
        }
    });
}
