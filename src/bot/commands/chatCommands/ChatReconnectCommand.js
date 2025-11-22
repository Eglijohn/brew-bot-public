import ChatCommand from "../ChatCommand.js";
import {config} from "../../../index.js";

export default class ChatReconnectCommand extends ChatCommand {
    constructor() {
        super("reconnect", "!reconnect [timeout] - Reconnect", ["rejoin"], 2);
    }

    async execute(instance, username, args) {
        instance.bot.end("Chat ReconnectCommand");
        setTimeout(() => {
            instance.init();
        }, parseInt(args[1]) || config.autoReconnect.timeout);
    }
}