import { botInstances } from "../../../index.js";
import ConsoleCommand from "./ConsoleCommand.js";

export default class ConsoleBotsCommand extends ConsoleCommand {
    constructor() {
        super("bots", "View all bots", ["botlist", "instances"]);
    };

    async execute(logger, args, targetUsername) {
        const botNames = [];
        for (const i of botInstances) {
            botNames.push(i.bot.username);
        };

        logger.info("Bot instances: " + botNames.join(", "))
    }
}