import {equipItem} from "../../utils/Inventory.js";
import ChatCommand from "./ChatCommand.js";

export default class ChatEquipCommand extends ChatCommand {
    constructor() {
        super("equip", "equip", ["hold"], 2);
    }

    async execute(instance, username, args) {
        equipItem(instance, args[1], args[2]);
    }
}