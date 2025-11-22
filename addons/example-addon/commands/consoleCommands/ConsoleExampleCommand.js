import ConsoleCommand from "../../../../src/bot/commands/ConsoleCommand.js";
import {botInstances} from "../../../../src/index.js";

export default class ConsoleExampleCommand extends ConsoleCommand {
    constructor() {
        super("examplecommand", "examplecommand - Do stuff", ["example"]); // command name, usage, aliases
    }

    async execute(logger, args, targetUsername) { // Logger, command arguments, target username (if any)
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                i.logger.info('Hello, World!')
            }
        }
    }
}