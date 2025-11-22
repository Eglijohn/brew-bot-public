import ChatCommand from '../ChatCommand.js';
import {formatUptime} from "../../../utils/other/File.js";

export default class ChatUptimeCommand extends ChatCommand {
    constructor() {
        super('uptime', '!uptime - Display Bots uptime', [], 3);
    }

    async execute(instance, username, args) {
        instance.bot.whisper(username, `Process Uptime: ${formatUptime(process.uptime())}, In-Game: ${instance.gameTicks}t, ${instance.gameTicks / 20}s`);
    }
}