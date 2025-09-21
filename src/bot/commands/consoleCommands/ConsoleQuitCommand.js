import ConsoleCommand from "./ConsoleCommand.js";
import {botInstances} from "../../../index.js";
import {isCommandTarget} from "../../../utils/other/Data.js";

export default class ConsoleQuitCommand extends ConsoleCommand {
    constructor() {
        super("quit", "Quit the bot", ["end", "leave"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                i.bot.quit("Quit ConsoleCommand");
            }
        }
    }
}