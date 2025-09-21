import ChatCommand from "./ChatCommand.js";

export default class ChatQuitCommand extends ChatCommand {
    constructor() {
        super("quit", "Quit the bot", ["end", "leave"], 2);
    }

    async execute(instance, message, args) {
        instance.bot.quit("Quit ChatCommand");
    }
}