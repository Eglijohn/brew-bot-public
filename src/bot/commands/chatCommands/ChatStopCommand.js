import ChatCommand from "../ChatCommand.js";
import {stopGoals} from "../../utils/Movement.js";

export default class ChatStopCommand extends ChatCommand {
    constructor() {
        super("stop", "!stop - Stop all pathfinder goals", ["stopfollow"], 2);
    }

    async execute(instance, username, args) {
        stopGoals(instance);
    }
}