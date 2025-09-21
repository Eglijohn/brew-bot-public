import ConsoleCommand from "./ConsoleCommand.js";
import {botInstances} from "../../../index.js";
import {isCommandTarget} from "../../../utils/other/Data.js";

export default class ConsolePositionCommand extends ConsoleCommand {
    constructor() {
        super("position", "Show the bot's position", ["pos"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                i.logger.info(`X: ${i.bot.entity.position.x.toFixed(1)}, Y: ${i.bot.entity.position.y.toFixed(1)}, Z: ${i.bot.entity.position.z.toFixed(1)}`);
            }
        }
    }
}