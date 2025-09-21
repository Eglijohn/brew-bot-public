import ChatCommand from "./ChatCommand.js";
import {reloadConfig} from "../../../index.js";

export default class ChatReloadConfigCommand extends ChatCommand {
    constructor() {
        super("reloadconfig", "reloade", [], 1);
    }

    async execute(instance, username, args) {
        await reloadConfig();
    }
}