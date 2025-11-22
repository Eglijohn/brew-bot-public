import {center} from "../../utils/Movement.js";
import ConsoleCommand from "../ConsoleCommand.js";
import {botInstances} from "../../../index.js";

export default class ConsoleCenterCommand extends ConsoleCommand {
    constructor() {
        super("center", "!center - Center on the Block the Bot standing on", []);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || targetUsername === i.bot.username) {
                center(i)
            }
        }
    }
}