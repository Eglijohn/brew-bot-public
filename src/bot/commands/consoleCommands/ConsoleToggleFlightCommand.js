import ConsoleCommand from "../ConsoleCommand.js";
import {botInstances} from "../../../index.js";

export default class ConsoleToggleFlightCommand extends ConsoleCommand {
    constructor() {
        super("tfly", "!tfly - Toggle flight", ["fly", "togglefly", "flight", "toggleflight", "tflight"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                i.fly = !i.fly;
            }
        }
    }
}