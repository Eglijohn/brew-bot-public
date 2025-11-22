import ChatCommand from "../ChatCommand.js";

export default class ChatBasehuntCommand extends ChatCommand {
    constructor() {
        super("basehunt", "!basehunt <random ass args idk> - fouck u", [], 3);
    }

    async execute(instance, username, args) {
        instance.bot.whisper(username, 'Request Failed: Too Lazy');
    }
}