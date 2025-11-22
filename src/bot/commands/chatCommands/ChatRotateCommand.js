import ChatCommand from "../ChatCommand.js";

export default class ChatRotateCommand extends ChatCommand {
    constructor() {
        super("rotate", "!rotate <yaw> <pitch> [force] - Rotate the Head", ["look"], 2);
    }

    async execute(instance, username, args) {
        await instance.bot.look(parseFloat(args[1]), parseFloat(args[2]), args[3] || false);
    }
}