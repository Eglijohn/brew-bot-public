import ConsoleCommand from "../../../../src/bot/commands/consoleCommands/ConsoleCommand.js";
import {botInstances} from "../../../../src/index.js";

export default class ConsoleExampleCommand extends ConsoleCommand {
    constructor() {
        super("examplecommand", "An example console command", ["example"]); // command name, description, aliases
    }

    async execute(logger, args, targetUsername) { // Code to execute (logger, args, bot that should execute it [by using '!:Username command' in terminal])
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                i.logger.info('Hello, World!') // Execute the code for every bot that should execute it
            }
        }
    }
}