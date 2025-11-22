import ChatCommand from "../ChatCommand.js";
import {botInstances} from "../../../index.js";

export default class ChatBotsCommand extends ChatCommand {
    constructor() {
        super("bots", "!bots - Display all Bot Instances", [], 2);
    }

    async execute(instance, username, args) {
        const botNames = [];
        for (const i of botInstances) {
            botNames.push(i.bot.username);
        }

        instance.bot.whisper(username, "Bot instances [" + botNames.length + "]: " + botNames.join(", "));
    }
}