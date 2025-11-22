import ConsoleCommand from "../ConsoleCommand.js";
import {botInstances} from "../../../index.js";
import {equipItem} from "../../utils/Inventory.js";

export default class ConsoleEquipCommand extends ConsoleCommand {
    constructor() {
        super("equip", "!equip <armor> <head | torso | legs | feet> - Equip an Item in the specified Spot", ["hold"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || targetUsername === i.bot.username) {
                equipItem(i, args[1], args[2]);
            }
        }
    }
}