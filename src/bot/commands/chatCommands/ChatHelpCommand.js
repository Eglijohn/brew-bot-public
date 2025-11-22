import ChatCommand from '../ChatCommand.js';
import { chatCommands, VERSION } from '../../../index.js';

export default class ChatHelpCommand extends ChatCommand {
    constructor() {
        super('help', '!help [command] - Get help', ['commands'], 3);
    }

    async execute(instance, username, args) {
        if (args.length > 1) {
            let cmd = args[1]
            if (cmd.startsWith('!')) cmd = cmd.substring(1);
            const commandInfo = chatCommands.get(cmd)?.usage || undefined;
            if (commandInfo) {
                instance.bot.whisper(username, commandInfo);
                instance.bot.whisper(username, '<arg>: Required Argument, [arg] - Optional Argument')
            } else {
                instance.bot.whisper(username, 'Command "' + cmd + '" not found. Type !help for a list of commands.');
            }
            return;
        }

        const availableCommands = chatCommands.getAllCommands()
            .map(cmd => `!${cmd.name}`)
            .join(', ');

        instance.bot.whisper(username, `Available commands [${availableCommands.split(', ').length}]: ${availableCommands}. Type !help <command> for help for a specific command`);
    }
}