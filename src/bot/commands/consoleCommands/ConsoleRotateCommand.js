import ConsoleCommand from "../ConsoleCommand.js";
import {botInstances} from "../../../index.js";

export default class ConsoleRotateCommand extends ConsoleCommand {
    constructor() {
        super("rotate", "!rotate <yaw> <pitch> [force] - Rotate the head", ["look"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                i.bot.look(parseFloat(args[1]), parseFloat(args[2]), args[3] || false);
            }
        }
    }
}