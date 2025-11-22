import ChatCommand from "../ChatCommand.js";

export default class ChatSayCommand extends ChatCommand {
    constructor() {
        super("say", "!say <message> - Send a message in chat", ["repeat", "chat"],1);
    }

    async execute(instance, username, args) {
        const msg = args.join(" ").replace('say ', '');

        instance.bot.chat(msg)
    }
}