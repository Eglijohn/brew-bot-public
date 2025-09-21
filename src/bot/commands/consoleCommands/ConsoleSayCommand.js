import ConsoleCommand from "./ConsoleCommand.js";
import {botInstances} from "../../../index.js";

export default class ConsoleSayCommand extends ConsoleCommand {
    constructor() {
        super("say", "Say a message/command in chat", ["repeat", "chat"]);
    }

    async execute(logger, args, targetUsername) {
        const message = args.slice(1).join(" ");

        if (!message.trim()) {
            logger.warn("No message provided to say command");
            return;
        }

        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                i.bot.chat(message);
            }
        }
    }
}