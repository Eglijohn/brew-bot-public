import {botInstances, chatCommands, consoleCommands} from "../../../index.js";
import ConsoleCommand from "../ConsoleCommand.js";

export default class ConsoleCommandsCommand extends ConsoleCommand {
    constructor() {
        super("commands", "!commands [chat | console | all] - Display all available Commands", []);
    }

    async execute(logger, args, targetUsername) {
        const console = consoleCommands.getAllCommands().map(cmd => `!${cmd.name}`)
        const chat = chatCommands.getAllCommands().map(cmd => `!${cmd.name}`)

        if (args[1] === 'all' || !args[1]) {
            logger.info('Chat Commands [' + chat.length + ']: ' + chat.join(', '));
            logger.info('Console Commands [' + console.length + ']: ' + console.join(', '));
        } else if (args[1] === 'console') {
            logger.info('Console Commands [' + console.length + ']: ' + console.join(', '));
        } else if (args[1] === 'chat') {
            logger.info('Chat Commands [' + console.length + ']: ' + chat.join(', '));
        }
    }
}