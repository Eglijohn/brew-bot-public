import {botInstances, config} from "../../../index.js";
import ConsoleCommand from "../ConsoleCommand.js";

export default class ConsoleReconnectCommand extends ConsoleCommand {
    constructor() {
        super("reconnect", "!reconnect [timeout] - Rejoin the Game", ["rejoin"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                i.bot.end("Console ReconnectCommand");
                setTimeout(() => {
                    i.init();
                }, parseInt(args[1]) || config.autoReconnect.timeout);
            }
        }
    }
}