import ChatCommand from "../../../../src/bot/commands/chatCommands/ChatCommand.js";

export default class ChatExampleCommand extends ChatCommand {
    constructor() {
        super("examplecommand", "An example chat command", ["example"], 3); // command name, description, aliases, permissionLevel
    }

    async execute(instance, username, args) { // Code to execute (instance, executor's username, arguments)
        instance.bot.whisper(username, 'Hello, World!');
    }
}