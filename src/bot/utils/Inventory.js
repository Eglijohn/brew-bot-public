/**
 * Equip an item
 * @param instance Bot instance
 * @param itemName Item to equip
 * @param slot Slot ('hand', 'off-hand', 'head', 'torso', 'legs', 'feet')
 * @param log Log the equip
 * @returns {boolean} Status
 */
function equipItem(instance, itemName, slot, log = true) {
    try {
        const item = instance.bot.inventory.items().find(i => i.name === itemName);
        const heldItem = instance.bot.heldItem;
        const offhandItem = instance.bot.inventory.slots[45];

        if (!item) {
            if (log) instance.logger.error(`I don't have any ${itemName}.`);
            return false;
        }
        if (slot === 'hand' && (heldItem?.name === item?.name)) return false;
        if (slot === 'off-hand' && (offhandItem?.name === item?.name)) return false;

        const possibleSlots = ['hand', 'off-hand', 'head', 'torso', 'legs', 'feet'];
        if (!possibleSlots.includes(slot)) {
            if (log) instance.logger.error(`Invalid slot: ${slot}`);
            return false;
        } else {
            instance.bot.equip(item, slot)
            if (log) instance.logger.info(`Equipped ${item.displayName} to ${slot}.`);
            return true;
        }
    } catch (e) {
        console.error(e);
    }
}

/**
 * Function to automatically eat
 * @returns Status
 */
async function autoEat(instance) {
    if (instance.bot.food < 20 && !instance.isEating) {
        const heldItem = instance.bot.heldItem;
        instance.isEating = true;
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
                instance.isEating = false;
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


/**
 * Equip the best tool for a block
 * @param instance Instance
 * @param block Block
 * @returns {boolean} Does it return sth?
 */
function equipToolForBlock(instance, block) {
    const bestTool = block.material.replace('mineable/', '').replace('gourd;', '')
    const tool = instance.bot.inventory.items().find(i => i.name.includes(('_' + bestTool) || bestTool + ''));

    if (bestTool) return equipItem(instance, tool?.name || 'netherite_pickaxe', "hand");
}


/**
 * Drop an item
 * @param instance Instance
 * @param itemName item_name
 * @param amount amount
 * @returns {Promise<void>} Status
 */
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

export { equipItem, autoEat, dropItem, equipToolForBlock };