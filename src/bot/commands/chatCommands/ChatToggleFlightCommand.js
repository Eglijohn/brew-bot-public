import ChatCommand from "../ChatCommand.js";

export default class ChatToggleFlightCommand extends ChatCommand {
    constructor() {
        super("tfly", "!tfly - Toggle Fly", ["fly", "togglefly", "flight", "toggleflight", "tflight"], 2);
    }

    async execute(instance, username, args) {
        instance.fly = !instance.fly;
    }
}