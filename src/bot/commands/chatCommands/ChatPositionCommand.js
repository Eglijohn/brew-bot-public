import ChatCommand from "./ChatCommand.js";

export default class ChatPositionCommand extends ChatCommand {
    constructor() {
        super("position", "Show the bot's position", ["pos"], 1);
    }

    async execute(instance, username, args) {
        instance.bot.whisper(username,`X: ${instance.bot.entity.position.x.toFixed(1)}, Y: ${instance.bot.entity.position.y.toFixed(1)}, Z: ${instance.bot.entity.position.z.toFixed(1)}`);
    }
}