import ChatCommand from "../ChatCommand.js";
import {dropItem} from "../../utils/Inventory.js";

export default class ChatDropCommand extends ChatCommand {
    constructor() {
        super("drop", "!drop <item> <amount> - Drop an Item", ["throw"], 2);
    }

    async execute(instance, username, args) {
        await dropItem(instance, args[1], args[2] || 1);
    }
}