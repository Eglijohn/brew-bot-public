import ChatCommand from "./ChatCommand.js";
import {follow} from "../../utils/Movement.js";

export default class ChatFollowCommand extends ChatCommand {
    constructor() {
        super("follow", "Follow me!", [], 2);
    }

    async execute(instance, username, args) {
        const target = instance.bot.players[username];
        follow(instance, target);
    }
}