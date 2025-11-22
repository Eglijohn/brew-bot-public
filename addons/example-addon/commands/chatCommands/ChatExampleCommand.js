import ChatCommand from "../../../../src/bot/commands/ChatCommand.js";

export default class ChatExampleCommand extends ChatCommand {
    constructor() {
        super("examplecommand", "examplecommand - Do stuff", ["example"], 3); // command name, usage, aliases, permissionLevel
    }

    /* Method that is called when the command is executed */
    async execute(instance, username, args) { // Instance, username of executor, command arguments
        instance.bot.whisper(username, 'Hello, World!');
    }
}