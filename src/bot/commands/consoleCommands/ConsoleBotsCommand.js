import { botInstances } from "../../../index.js";
import ConsoleCommand from "../ConsoleCommand.js";

export default class ConsoleBotsCommand extends ConsoleCommand {
    constructor() {
        super("bots", "!bots - Display Bot instances", ["botlist", "instances"]);
    };

    async execute(logger, args, targetUsername) {
        const botNames = [];
        for (const i of botInstances) {
            botNames.push(i.bot.username);
        }

        logger.info("Bot instances [" + botNames.length + "]: " + botNames.join(", "))
    }
}