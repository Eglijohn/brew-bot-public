import ChatCommand from "../ChatCommand.js";

export default class ChatSwingHandCommand extends ChatCommand {
    constructor() {
        super("swing", "!swing <arm> - Swing a arm", ["swingarm"], 2);
    }

    async execute(instance, username, args) {
        instance.bot.swingArm(args[1]);
    }
}