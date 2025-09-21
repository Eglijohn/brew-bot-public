import {equipItem} from "./Inventory.js";
import {teleport} from "./Movement.js";

/**
 * Attack an entity
 * @param instance Instance
 * @param target Target entity
 * @param mace Mace Attack
 * @param maceHeight Height for mace attack (max 10)
 * @returns {Promise<void>} Status
 */
export async function attack(instance, target, mace = false, maceHeight) {
    const entity = target?.entity || target;
    const position = entity?.position;

    if (!entity || !position) return;

    const targetName = entity.username || entity.displayName || entity.name || entity.id;

    try {
        const originalPos = instance.bot.entity.position;

        if (mace) {
            instance.logger.warn(`Attacking ${targetName} with mace at height: ${maceHeight}`);

            equipItem(instance, 'mace', 'hand');

            const attackPos = position.offset(0, maceHeight, 0);

            await teleport(instance, attackPos, false);
            await teleport(instance, position, true);
            await instance.bot.attack(entity);
        } else {
            await teleport(instance, position, false);
            await instance.bot.attack(entity);
        }

        await teleport(instance, originalPos, false);
    } catch (error) {
        console.error(error);
    }
}