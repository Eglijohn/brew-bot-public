/**
 * Equip an item
 * @param instance Bot instance
 * @param itemName Item to equip
 * @param slot Slot ('hand', 'off-hand', 'head', 'torso', 'legs', 'feet')
 * @returns {boolean} Status
 */
function equipItem(instance, itemName, slot) {
    try {
        const item = instance.bot.inventory.items().find(i => i.name === itemName);
        const heldItem = instance.bot.heldItem;
        const offhandItem = instance.bot.inventory.slots[45];

        if (!item) return false;
        if (slot === 'hand' && (heldItem?.name === item?.name)) return false;
        if (slot === 'off-hand' && (offhandItem?.name === item?.name)) return false;


        instance.bot.equip(item, slot)
        return true;
    } catch (e) {
        console.error(e);
    }
}

/**
 * Function to automatically eat
 * @returns Status
 */
async function autoEat(instance) {
    if (instance.bot.food < 20 && !instance.bot.isEating) {
        const foodItem = instance.bot.inventory.items().find(item =>
            item.name === 'apple' ||
            item.name === 'cooked_beef' ||
            item.name === 'baked_potato' ||
            item.name === 'beef' ||
            item.name === 'beetroot' ||
            item.name === 'beetroot_soup' ||
            item.name === 'bread' ||
            item.name === 'carrot' ||
            item.name === 'chicken' ||
            item.name === 'chorus_fruit' ||
            item.name === 'cod' ||
            item.name === 'cookie' ||
            item.name === 'enchanted_golden_apple' ||
            item.name === 'fish' ||
            item.name === 'golden_apple' ||
            item.name === 'golden_carrot' ||
            item.name === 'honey_instance.bottle' ||
            item.name === 'melon' ||
            item.name === 'mushroom_stew' ||
            item.name === 'mutton' ||
            item.name === 'porkchop' ||
            item.name === 'potato' ||
            item.name === 'pufferfish' ||
            item.name === 'pumpkin_pie' ||
            item.name === 'rabbit' ||
            item.name === 'rabbit_stew' ||
            item.name === 'salmon' ||
            item.name === 'suspicious_stew' ||
            item.name === 'sweet_berries' ||
            item.name === 'tropical_fish')
        if (foodItem) {
            try {
                await instance.bot.equip(foodItem, 'hand');
                await instance.bot.consume();
                instance.logger.info(`Ate ${foodItem.displayName}`);
            } catch (err) {
                if (err.message === 'Consuming cancelled due to calling bot.consume() again') {
                    return;
                } else {
                    instance.logger.warn(`Failed to eat ${foodItem.displayName}: ${err.message}`);
                }
            }
        } else {
            return;
        }
    }
}

async function dropItem(instance, itemName, amount) {
    const item = instance.bot.inventory.items().find(i => i.name === itemName);
    if (!item) {
        instance.logger.error(`I don't have any ${itemName}.`);
        return;
    }

    const dropAmount = Math.min(amount, item.count);
    await instance.bot.toss(item.type, null, dropAmount);
    instance.logger.info(`Dropped ${dropAmount} ${itemName}(s).`);
}

export { equipItem, autoEat, dropItem };