import ChatCommand from "../ChatCommand.js";

export default class ChatQuitCommand extends ChatCommand {
    constructor() {
        super("quit", "!quit - Leave the Server", ["end", "leave"], 1);
    }

    async execute(instance, message, args) {
        instance.bot.quit("Quit ChatCommand");
    }
}