import {dropItem, equipItem} from "../../utils/Inventory.js";
import ConsoleCommand from "../ConsoleCommand.js";
import {botInstances} from "../../../index.js";

export default class ConsoleDropCommand extends ConsoleCommand {
    constructor() {
        super("drop", "!drop <item> [amount] - Drop Items", ["throw"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || targetUsername === i.bot.username) {
                await dropItem(i, args[1], args[2] || 1);
            }
        }
    }
}