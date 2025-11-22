import ConsoleCommand from '../ConsoleCommand.js';
import { consoleCommands } from '../../../index.js';

export default class ConsoleHelpCommand extends ConsoleCommand {
    constructor() {
        super('help', '!help <command> - Display help', ['commands']);
    }

    async execute(logger, args, targetUsername) {
        if (args.length > 1) {
            if (args.length > 1) {
                let cmd = args[1]
                if (cmd.startsWith('!')) cmd = cmd.substring(1);
                const commandInfo = consoleCommands.get(cmd)?.usage || undefined;
                if (commandInfo) {
                    logger.info(commandInfo);
                    logger.info('Arguments: <arg>: Required Argument, [arg] - Optional Argument');
                } else {
                    logger.info('Command "' + cmd + '" not found. Type !help for a list of commands.');
                }
                return;
            }
        }

        const availableCommands = consoleCommands.getAllCommands()
            .map(cmd => `!${cmd.name}`)
            .join(', ');

        logger.info(`Available commands [${availableCommands.split(', ').length}]: ${availableCommands}. Type !help <cmd> for help for a specific command`);
    }
}