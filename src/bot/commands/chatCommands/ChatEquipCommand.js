import {equipItem} from "../../utils/Inventory.js";
import ChatCommand from "../ChatCommand.js";

export default class ChatEquipCommand extends ChatCommand {
    constructor() {
        super("equip", "!equip <armor> <head | torso | legs | feet> - Equip an Item to the desired slot", ["hold"], 2);
    }

    async execute(instance, username, args) {
        equipItem(instance, args[1], args[2]);
    }
}