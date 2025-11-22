import ConsoleCommand from '../ConsoleCommand.js';
import {formatUptime} from "../../../utils/other/File.js";
import {botInstances} from "../../../index.js";

export default class ConsoleUptimeCommand extends ConsoleCommand {
    constructor() {
        super('uptime', '!uptime - Display the bots uptime', []);
    }

    async execute(logger, args, targetUsername) {
        logger.info(`Process Uptime: ${formatUptime(process.uptime())}`);
        for (const i of botInstances) {
            if (!targetUsername || targetUsername === i.username) {
                i.logger.info(`In-Game: ${i.gameTicks}t, ${i.gameTicks / 20}s`)
            }
        }
    }
}