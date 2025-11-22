import ChatCommand from "../ChatCommand.js";

export default class Template extends ChatCommand {
    constructor() {
        super("", "", [], 1);
    }

    async execute(instance, username, args) {
    }
}