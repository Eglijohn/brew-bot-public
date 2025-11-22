import ChatCommand from "../ChatCommand.js";
import {reloadConfig} from "../../../index.js";

export default class ChatReloadConfigCommand extends ChatCommand {
    constructor() {
        super("reloadconfig", "!reloadconfig - Reload the config file", [], 2);
    }

    async execute(instance, username, args) {
        await reloadConfig();
    }
}