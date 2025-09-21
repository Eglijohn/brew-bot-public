import { dig, instamine } from "../utils/World.js";

export default async function nuke(instance, blocks = 'all', infinite = false) {
    const bot = instance.bot;
    const reach = 4;

    if (!infinite) {
        for (let y = reach; y >= -reach; y--) {
            for (let x = -reach; x <= reach; x++) {
                for (let z = -reach; z <= reach; z++) {
                    if (x === 0 && y === 0 && z === 0) continue;

                    const targetPos = bot.entity.position.offset(x, y, z).floored();

                    if (bot.entity.position.distanceTo(targetPos) <= reach) {
                        const block = bot.blockAt(targetPos);
                        if (block && block.name !== "air" && (blocks === 'all' || block.name === blocks)) {
                            await instamine(instance, targetPos, block.hardness);
                        }
                    }
                }
            }
        }
    } else {
        while (true) {
            for (let y = reach; y >= -reach; y--) {
                for (let x = -reach; x <= reach; x++) {
                    for (let z = -reach; z <= reach; z++) {
                        if (x === 0 && y === 0 && z === 0) continue;

                        const targetPos = bot.entity.position.offset(x, y, z).floored();

                        if (bot.entity.position.distanceTo(targetPos) <= reach) {
                            const block = bot.blockAt(targetPos);
                            if (block && block.name !== "air" && (blocks === 'all' || block.name === blocks)) {
                                await instamine(instance, targetPos, block.hardness);
                            }
                        }
                    }
                }
            }
            await instance.bot.waitForTicks(20);
        }
    }
}
