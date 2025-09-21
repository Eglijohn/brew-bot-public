import ChatCommand from "./ChatCommand.js";

export default class ChatRotateCommand extends ChatCommand {
    constructor() {
        super("rotate", "Rotate to face the nearest player", ["look"], 1);
    }

    async execute(instance, username, args) {
        await instance.bot.look(parseFloat(args[1]), parseFloat(args[2]), args[3] || false);
    }
}