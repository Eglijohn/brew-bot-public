import {equipItem} from "./Inventory.js";
import TeleportTask from "./TeleportTask.js";

/**
 * Attack an entity
 * @param instance Instance
 * @param target Entity
 * @param mace Mace hit
 * @param maceHeight Mace heights
 * @param log Log the attack
 * @returns {Promise<void>} Status
 */
export async function attack(instance, target, mace = false, maceHeight, log = false) {
    const entity = target?.entity || target;
    const position = entity?.position;

    if (!entity || !position) return;
    const targetName = entity.username || entity.displayName || entity.name || entity.id;

    try {
        if (log) instance.logger.warn(`Attacking ${targetName} ${mace ? `with mace at height: ${maceHeight.join(', ')}` : ''}`);
        const originalPos = instance.bot.entity.position;
        const t = new TeleportTask(instance, true, false);

        if (mace) {
            equipItem(instance, 'mace', 'hand', log);

            const attackPos = position.offset(0, maceHeight, 0);

            await t.fastTeleport(attackPos, false, false);
            await t.fastTeleport(position, false, false);
            await instance.bot.attack(entity);
        } else {
            await t.fastTeleport(position, false);
            await instance.bot.attack(entity);
        }

        await t.fastTeleport(originalPos, false);
    } catch (error) {
        console.error(error);
    }
}