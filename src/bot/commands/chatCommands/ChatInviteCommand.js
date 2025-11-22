import ChatCommand from "../ChatCommand.js";
import {botInstances} from "../../../index.js";
import Bot from "../../Bot.js";

export default class ChatInviteCommand extends ChatCommand {
    constructor() {
        super("invite", "!invite <username> - Invite a Bot", ["join", "pet"], 1);
    }

    async execute(instance, username, args) {
        if (instance.leader === false) return;

        const botOptions = {
            username: args[1],
            auth: '',
            host: instance.botOptions.host,
            version: instance.botOptions.version,
            hideErrors: instance.botOptions.hideErrors,
            port: instance.botOptions.port,
        };

        for (const b of botInstances) {
            if (b.bot.username === botOptions.username) {
                b.init()
                instance.logger.info(`Rejoining ${botOptions.username}...`);
                return;
            }
        }

        
        if (!botOptions.username) {
            instance.bot.whisper(username, 'You need to specify an username');
            return;
        }

        botInstances.push(new Bot(botOptions))
        instance.logger.info(`Inviting ${botOptions.username}...`);
    }
}