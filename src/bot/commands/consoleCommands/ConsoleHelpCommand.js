import ConsoleCommand from './ConsoleCommand.js';
import { consoleCommands, VERSION } from '../../../index.js';

export default class ConsoleHelpCommand extends ConsoleCommand {
    constructor() {
        super('help', 'Show help', ['commands']);
    }

    async execute(logger, args) {
        logger.info(`Brew Bot v${VERSION}`);

        const availableCommands = consoleCommands.getAllCommands()
            .map(cmd => `!${cmd.name}`)
            .join(', ');

        logger.info(`Available commands: ${availableCommands}`);
    }
}