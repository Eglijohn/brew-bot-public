import ChatCommand from './ChatCommand.js';
import { chatCommands, VERSION } from '../../../index.js';

export default class ChatHelpCommand extends ChatCommand {
    constructor() {
        super('help', 'Show help', ['commands'], 3);
    }

    async execute(instance, username, args) {
        instance.bot.whisper(username, `Brew Bot v${VERSION}+mc${instance.botOptions.version}`);

        const availableCommands = chatCommands.getAllCommands()
            .filter(cmd => cmd.permissionLevel <= 2)
            .map(cmd => `!${cmd.name}`)
            .join(', ');

        instance.bot.whisper(username, `Available commands: ${availableCommands}`);
    }
}