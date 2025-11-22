import ChatCommand from "../ChatCommand.js";
import {follow} from "../../utils/Movement.js";

export default class ChatFollowCommand extends ChatCommand {
    constructor() {
        super("follow", "!follow - Follows You", [], 2);
    }

    async execute(instance, username, args) {
        const target = instance.bot.players[username];

        if (args[1] === "fly") {
            instance.followTarget.target = target;
        } else {
            follow(instance, target);
        }
    }
}