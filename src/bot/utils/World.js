import { equipItem } from "./Inventory.js";
import AABB from "prismarine-physics/lib/aabb.js";
import {Vec3} from "vec3";

async function dig(instance, position) {
    const block = instance.bot.blockAt(position);

    if (!block || block.name === "air") return;

    equipItem(instance, "netherite_pickaxe", "hand");
    await instance.bot.dig(block, false);
}

async function instamine(instance, position, ticks, autoEquipTool = true) {
    const block = instance.bot.blockAt(position);
    const loc = { x: position.x, y: position.y, z: position.z };
    const bestTool = block.material.replace('mineable/', '')
    const tool = instance.bot.inventory.items().find(i => i.name.includes(('_' + bestTool) || bestTool + ''));

    if (bestTool && autoEquipTool) equipItem(instance, tool?.name || 'netherite_pickaxe', "hand");

    for (let i = 0; i < ticks; i++) {
        instance.bot._client.write('block_dig', { status: 0, location: loc, face: 1 });
        instance.bot._client.write('block_dig', { status: 2, location: loc, face: 1 });
        await instance.bot.waitForTicks(1);
    }
}

/**
 * Get entity bounding box at a given feet position
 */
function getEntityAABB(pos, width = 0.6, height = 1.8) {
    const half = width / 2;
    return new AABB(
        pos.x - half,
        pos.y,
        pos.z - half,
        pos.x + half,
        pos.y + height,
        pos.z + half
    );
}

/**
 * Tp pos check
 * @param {object} instance instance
 * @param {Vec3} pos target pos
 * @returns {boolean} true if position is free
 */
function canTeleport(instance, pos) {
    const bot = instance.bot;
    const bb = getEntityAABB(pos);

    const min = {
        x: Math.floor(bb.minX) - 1,
        y: Math.floor(bb.minY) - 1,
        z: Math.floor(bb.minZ) - 1
    };

    const max = {
        x: Math.floor(bb.maxX) + 1,
        y: Math.floor(bb.maxY) + 1,
        z: Math.floor(bb.maxZ) + 1
    };

    for (let x = min.x; x <= max.x; x++) {
        for (let y = min.y; y <= max.y; y++) {
            for (let z = min.z; z <= max.z; z++) {
                const block = bot.blockAt(new Vec3(x, y, z));
                if (!block) continue;

                const shapes = block.shapes || block.boundingBoxes || [];
                for (const shape of shapes) {
                    const blockBB = new AABB(
                        x + shape[0],
                        y + shape[1],
                        z + shape[2],
                        x + shape[3],
                        y + shape[4],
                        z + shape[5]
                    );
                    if (bb.intersects(blockBB)) {
                        return false;
                    }
                }
            }
        }
    }

    return true;
}

export { dig, instamine, canTeleport }