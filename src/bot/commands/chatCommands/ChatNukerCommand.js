import ChatCommand from "./ChatCommand.js";
import nuke from "../../modules/Nuker.js";

export default class ChatNukerCommand extends ChatCommand {
    constructor() {
        super("nuke", "nuker", ["nuker"], 1);
    }
    async execute(instance, username, args) {
        nuke(instance, !(args[1] === 'inf') ? args[1] : 'all', args[1] === 'inf' || args[2] === 'inf');
    }
}