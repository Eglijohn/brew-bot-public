import {botInstances} from "../../../index.js";
import ConsoleCommand from "../ConsoleCommand.js";

export default class Template extends ConsoleCommand {
    constructor() {
        super("", "", []);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {

            }
        }
    }
}