import ChatCommand from "../ChatCommand.js";
import {VERSION} from "../../../index.js";

export default class ChatAboutCommand extends ChatCommand {
    constructor() {
        super("about", "!about - Show info", ["info"], 3);
    }

    async execute(instance, username, args) {
        instance.bot.whisper(username, 'I am running Brew Bot v' + VERSION + ' by Eglijohn and R3akeOn3_. Type !help for help.');
    }
}