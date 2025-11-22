import { goto } from "../bot/utils/Movement.js";
import { mineflayer as viewer } from 'prismarine-viewer';
import TeleportTask from "../bot/utils/TeleportTask.js";
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import { Vec3 } from "vec3";
import { attack } from "../bot/utils/Attack.js";
import startPanelServer from "./Panel.js";
import mineflayerWebInventory from "mineflayer-web-inventory";
import {drawBlockSelection} from "../bot/utils/RenderUtils.js";

let wss = null;

export default function startViewer(i) {
    if (i.bot.viewer) return;
    try {
        viewer(i.bot, {port: 5001, viewDistance: 10, firstPerson: true});
        viewer(i.bot, { port: 5000, viewDistance: 10 });
        mineflayerWebInventory(i.bot, {port: 5002});

        wss = new WebSocketServer({port: 8080});

        setupPathVisualization(i);
        setupBlockClickHandler(i);
        setupWebSocketServer(i);
        startPanelServer()
    } catch (e) {
        i.logger.error('Error starting Viewer: ' + e.message)
    }
}

function setupPathVisualization(i) {
    i.bot.on('path_update', (r) => {
        const path = [i.bot.entity.position.offset(0, 0.5, 0)];
        for (const node of r.path) {
            path.push({ x: node.x, y: node.y + 0.5, z: node.z });
        }
        i.bot.viewer.drawLine('path', path, 0xfa9632);
    });

    i.bot.on('goal_reached', () => {
        i.bot.viewer.erase('path');
    });
}

function setupBlockClickHandler(i) {
    i.bot.viewer.on('blockClicked', async (block, face, button) => {
        const position = {
            x: block.position.x,
            y: block.position.y,
            z: block.position.z
        };

        broadcastToClients({ type: 'blockClicked', position });
        drawBlockSelection(i, position);
    });
}

function broadcastToClients(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function setupWebSocketServer(i) {
    wss.on('connection', (ws) => {
        const interval = setInterval(() => sendBotData(i, ws), 100);

        ws.on('message', async (message) => {
            const data = JSON.parse(message);

            if (data.type === 'consoleCommand') {
                handleConsoleCommand(i, data.command, ws);
                return;
            }

            await handleWebSocketMessage(i, message);
        });

        ws.on('close', () => clearInterval(interval));
    });
}

function handleConsoleCommand(i, command, ws) {
    if (!command) return;
    try {
        if (command.startsWith('!')) {
            import('../index.js').then(({ consoleCommands }) => {
                consoleCommands.executeConsoleCommand(command);
            });
        } else {
            i.bot.chat(command);
        }
    } catch (e) {
        ws.send(JSON.stringify({ type: 'consoleOutput', message: `Error: ${e.message}` }));
    }
}


function sendBotData(i, ws) {
    if (!i.bot || !i.bot.entity) return;

    const botData = {
        position: {
            x: i.bot.entity.position.x,
            y: i.bot.entity.position.y,
            z: i.bot.entity.position.z,
        },
        health: i.bot.health,
        food: i.bot.food,
        xp: i.bot.experience.points,
        nearbyPlayers: Object.values(i.bot.entities)
            .filter(entity => entity.type === 'player' && entity.username !== i.bot.username)
            .map(entity => ({
                username: entity.username,
                distance: Math.round(i.bot.entity.position.distanceTo(entity.position)),
                position: { x: entity.position.x, y: entity.position.y, z: entity.position.z }
            })),
        charge: 0,
    };
    ws.send(JSON.stringify(botData));
}

async function handleWebSocketMessage(i, message) {
    const data = JSON.parse(message);

    const handlers = {
        moveBot: () => handleMoveBot(i, data),
        activateBlock: () => handleActivateBlock(i, data),
        teleportBot: () => handleTeleportBot(i, data),
        testTeleportBot: () => handleTestTeleportBot(i, data),
        attackNearestPlayer: () => handleAttackNearestPlayer(i, data)
    };

    const handler = handlers[data.type];
    if (handler) await handler();
}

function handleMoveBot(i, data) {
    const position = new Vec3(data.position.x, data.position.y, data.position.z);
    goto(i, position);
}

async function handleActivateBlock(i, data) {
    const block = i.bot.blockAt(new Vec3(data.position.x, data.position.y, data.position.z));
    if (!block) return;

    try {
        await i.bot.activateBlock(block);
    } catch (error) {
        i.logger.error(`Failed to activate block: ${error.message}`);
    }
}

async function handleTeleportBot(i, data) {
    const position = new Vec3(data.position.x + 0.5, data.position.y, data.position.z + 0.5);

    const teleportTask = new TeleportTask(i, true, true);
    await teleportTask.fastTeleport(position);
}

async function handleTestTeleportBot(i, data) {
    const position = new Vec3(data.position.x + 0.5, data.position.y, data.position.z + 0.5);
    const currentPos = i.bot.entity.position;

    const height = currentPos.distanceTo(new Vec3(currentPos.x, 321, currentPos.z)) <
    currentPos.distanceTo(new Vec3(currentPos.x, -66, currentPos.z)) ? 321 : -66;

    const heightPos = new Vec3(currentPos.x, height, currentPos.z);
    const goalHeight = new Vec3(position.x, height, position.z);

    // await testicularTp(i, position, undefined, true);
}

async function handleAttackNearestPlayer(i, data) {
    const position = new Vec3(data.position.x + 0.5, data.position.y, data.position.z + 0.5);
    const nearbyPlayers = Object.values(i.bot.players)
        .filter(p => p.entity && p.username !== i.bot.username);

    if (nearbyPlayers.length === 0) return;

    const nearestPlayer = nearbyPlayers.reduce((nearest, player) => {
        const distance = position.distanceTo(player.entity.position);
        return distance < nearest.distance ? { player, distance } : nearest;
    }, { player: null, distance: Infinity }).player;

    if (nearestPlayer) {
        await attack(i, nearestPlayer, true, [35], true, true);
    }
}

export { wss };