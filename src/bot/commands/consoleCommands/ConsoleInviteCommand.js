import ConsoleCommand from "./ConsoleCommand.js";
import {botInstances} from "../../../index.js";
import Bot from "../../Bot.js";

export default class ConsoleInviteCommand extends ConsoleCommand {
    constructor() {
        super("invite", "Invite a new bot", ["join", "pet"]);
    }

    async execute(logger, args) {
        const leader = botInstances.find(i => i.leader === true);
        if (!leader) return;

        const botOptions = {
            username: args[1],
            auth: '',
            host: leader.botOptions.host,
            version: leader.botOptions.version,
            hideErrors: leader.botOptions.hideErrors,
            port: leader.botOptions.port,
        };

        for (const b of botInstances) {
            if (b.bot.username === botOptions.username) return;
        }

        botInstances.push(new Bot(botOptions))
        logger.info(`Inviting ${botOptions.username}...`);
    }
}