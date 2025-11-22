import {botInstances} from "../../../index.js";
import ConsoleCommand from "../ConsoleCommand.js";

export default class ConsoleSwingHandCommand extends ConsoleCommand {
    constructor() {
        super("swing", "!swing <arm> - Swing an arm", ["swingarm"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                i.bot.swingArm(args[1]);
            }
        }
    }
}