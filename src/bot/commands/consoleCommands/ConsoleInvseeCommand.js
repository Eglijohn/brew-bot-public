import ConsoleCommand from "../ConsoleCommand.js";
import {botInstances} from "../../../index.js";
import chalk from "chalk";
import {GRAY, PRIMARY_LIGHT} from "../../../utils/other/Colors.js";

export default class ConsoleInvseeCommand extends ConsoleCommand {
    constructor() {
        super("inv", "!invsee - See the Bot's inventory", ["invsee", "inventory"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || targetUsername === i.bot.username) {
                const heldItem = i.bot.heldItem;
                const offhandItem = i.bot.inventory.slots[45];
                const inventoryItems = i.bot.inventory.items().map(item => `${chalk.hex(PRIMARY_LIGHT)(item.displayName)} (x${chalk.hex(GRAY)(item.count)})`);
                i.logger.info(`Inventory: \n${inventoryItems.length > 0 ? inventoryItems.join(', ') : 'Inventory is empty'}`);
                if (offhandItem) {
                    i.logger.info(`Offhand Item: ${chalk.hex(PRIMARY_LIGHT)(offhandItem.displayName)} (x${chalk.hex(GRAY)(offhandItem.count)})`);
                }
                if (heldItem) {
                    i.logger.info(`Held Item: ${chalk.hex(PRIMARY_LIGHT)(heldItem.displayName)} (x${chalk.hex(GRAY)(heldItem.count)})`);
                } else {
                    i.logger.info('No item is currently held.');
                }
                break;
            }
        }
    }
}