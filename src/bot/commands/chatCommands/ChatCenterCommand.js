import ChatCommand from "../ChatCommand.js";
import {center} from "../../utils/Movement.js";

export default class ChatCenterCommand extends ChatCommand {
    constructor() {
        super("center", "!center - Center on the Block the Bot standing on", [], 2);
    }

    async execute(instance, username, args) {
        center(instance);
    }
}