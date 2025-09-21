import ChatCommand from "./ChatCommand.js";
import {Vec3} from "vec3";
import {goto} from "../../utils/Movement.js";

export default class ChatGotoCommand extends ChatCommand {
    constructor() {
        super("goto", "goto", ["move"], 2);
    }

    async execute(instance, username, args) {
        const goal = new Vec3(parseInt(args[1]), parseInt(args[2]), parseInt(args[3]));

        goto(instance, goal);
    }
}