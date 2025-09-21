import {config, onlinePlayers} from "../index.js";
import {autoEat, equipItem} from "./utils/Inventory.js";
import chalk from "chalk";
import {PLAYER} from "../utils/other/Colors.js";
import {getPermissionLevel} from "../utils/other/Data.js";
import {attack} from "./utils/Attack.js";
import {Vec3} from "vec3";

export default function initEvents(i) {
    const perm = async (username) => { return await getPermissionLevel(username, i.bot.username) };

    i.bot.on('spawn', () => {
        i.logger.info('Spawned');
    });

    i.bot.on('respawn', () => {
        setTimeout(() => {
            i.logger.info(`Respawned at X: ${i.bot.entity.position.x.toFixed(1)}, Y: ${i.bot.entity.position.y.toFixed(1)}, Z: ${i.bot.entity.position.z.toFixed(1)}`);
        }, 100)
    })

    i.bot.on('messagestr', async (message, messagePosition, jsonMsg) => {
        i.logger.chat(jsonMsg.toAnsi());
    });

    i.bot.on('chat', async (username, message) => {
        if (!config.commands.chat) return
        await i.executeChatCommand(username, message);
    })

    i.bot.on('kicked', (reason) => {
        i.logger.warn('Kicked: ' + reason.value.translate.value);
    });

    i.bot.on('end', (reason) => {
        i.logger.warn('Lost connection: ' + reason);
    });

    i.bot.on('whisper', async (username, message) => {
        if (!config.commands.whisper) return
        await i.executeChatCommand(username, message);
    });

    i.bot.on('physicsTick', async () => {
        if (config.autoTotem) equipItem(i, 'totem_of_undying', 'off-hand')
        if (i.bot.entity.velocity.y < -0.5 && config.noFall) i.bot._client.write('position', {x: i.bot.entity.position.x, y: i.bot.entity.position.y, z: i.bot.entity.position.z, onGround: true});
        if (config.autoEat) await autoEat(i);
        if (config.autoArmor) await i.bot.armorManager.equipAll();
        if (config.lookAtNearestPlayer && i.bot.pathfinder.goal === null) {
            const players = Object.values(i.bot.players).filter(player => player.entity && player.username !== i.bot.username);
            if (players.length === 0) return;

            const nearestPlayer = players.reduce((nearest, player) => {
                const distance = i.bot.entity.position.distanceTo(player.entity.position);
                return distance < nearest.distance ? { player, distance } : nearest;
            }, { player: null, distance: Infinity }).player;

            if (nearestPlayer) {
                try {
                    i.bot.lookAt(nearestPlayer.entity.position.offset(0, nearestPlayer.entity.height - 0.18, 0));
                } catch (err) {
                    i.logger.error(`Failed to look at ${nearestPlayer.username}: ${err.message}`);
                }
            }
        }
    });

    i.bot._client.on('packet', async (data, metadata) => {
        if((config.velocity || i.fly) && i.bot.pathfinder.goal === null) {
            i.bot.entity.velocity = new Vec3(0, !i.fly ? i.bot.entity.velocity.y : 0, 0);
            i.bot.physics.terminalVelocity = 0;
            i.fly ? i.bot.physics.gravity = 0 : i.bot.physics.gravity = 0.08
        }

        if (config.packetLogger.enabled && config.packetLogger.packets.includes(metadata.name)) {
            i.logger.info('Packet: ' + metadata.name + ": " + JSON.stringify(data, null, 2));
        }

        switch (metadata.name) {
            case 'entity_status':
                if (data.entityStatus !== 35) return;

                const entity = i.bot.entities[data.entityId];
                if (!entity) return;

                i.logger.warn(`${entity.username || entity.id} popped a totem!`)
                if (config.logOnTotemPop && entity?.username === i.bot.username) {
                    i.bot.quit('AutoLog');
                }
                break;

            case 'damage_event':
                const attacker = i.bot.entities[data.sourceCauseId - 1];
                const target = i.bot.entities[data.entityId]

                if (target?.type !== 'player') return;

                if (target?.username === i.bot.username) {
                    i.logger.warn(((chalk.hex(PLAYER(attacker?.username))(attacker?.username || attacker?.displayName || 'Something'))) + ' attacked ' + ((chalk.hex(PLAYER(target?.username))(target?.username)) || target?.displayName || 'Undefined'));
                } else {
                    i.logger.info(((chalk.hex(PLAYER(attacker?.username))(attacker?.username || attacker?.displayName || 'Something'))) + ' attacked ' + ((chalk.hex(PLAYER(target?.username))(target?.username)) || target?.displayName || 'Undefined'));
                }

                if (config.retaliate.enabled === true) {
                    if ((config.retaliate.ignoreFriends === true && config.friends.includes(attacker?.username)) || (attacker?.username === i.bot.username) || (target?.username !== i.bot.username)) return;
                    await attack(i, attacker, true, [10])
                }
                break;
        }
    });

    i.bot.on('playerJoined', async (player) => {
        if (onlinePlayers.includes(player.username)) return;
        onlinePlayers.push(player.username);
        i.logger.log(chalk.gray('[') + chalk.green('+') + chalk.gray('] ') + chalk.hex(PLAYER(player.username))(player.username) + ' joined ' + chalk.gray(await perm(player.username)))
    });

    i.bot.on('playerLeft', async (player) => {
        if (!onlinePlayers.includes(player.username)) return;
        const index = onlinePlayers.indexOf(player.username);
        if (index > -1) {
            onlinePlayers.splice(index, 1);
        }
        i.logger.log(chalk.gray('[') + chalk.redBright('-') + chalk.gray('] ') + chalk.hex(PLAYER(player.username))(player.username) + ' left '  + chalk.gray(await perm(player.username)))
    });

    i.bot.on('entitySpawn', (entity) => {
        if (entity.type !== 'player') return;
        if (entity?.username === i.bot.username) return;

        i.logger.info(`${chalk.hex(PLAYER(entity.username))(entity.username)} has entered my view ${chalk.gray('[' + i.bot.entity.position.distanceTo(entity.position).toFixed(1) + 'm]')}`);
    });

    i.bot.on('entityGone', (entity) => {
        if (entity.type !== 'player') return;
        if (entity?.username === i.bot.username) return;

        i.logger.info(`${chalk.hex(PLAYER(entity.username))(entity.username)} has left my view ${chalk.gray('[' + i.bot.entity.position.distanceTo(entity.position).toFixed(1) + 'm]')}`);
    });
}