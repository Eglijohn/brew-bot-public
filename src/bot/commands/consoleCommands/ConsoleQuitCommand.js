import ConsoleCommand from "../ConsoleCommand.js";
import {botInstances} from "../../../index.js";

export default class ConsoleQuitCommand extends ConsoleCommand {
    constructor() {
        super("quit", "!quit - Leave the game", ["end", "leave"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                i.bot.quit("Quit ConsoleCommand");
            }
        }
    }
}