import ChatCommand from "./ChatCommand.js";

export default class ChatToggleFlightCommand extends ChatCommand {
    constructor() {
        super("tfly", "toggle flight", ["fly", "togglefly", "flight", "toggleflight", "tflight"], 1);
    }

    async execute(instance, username, args) {
        instance.fly = !instance.fly;
    }
}