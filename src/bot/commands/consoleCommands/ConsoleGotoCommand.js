import {Vec3} from "vec3";
import {goto} from "../../utils/Movement.js";
import ConsoleCommand from "./ConsoleCommand.js";
import {botInstances} from "../../../index.js";

export default class ConsoleGotoCommand extends ConsoleCommand {
    constructor() {
        super("goto", "goto", ["move"]);
    }

    async execute(logger, args, targetUsername) {
        const goal = new Vec3(parseInt(args[1]), parseInt(args[2]), parseInt(args[3]));

        for (const i of botInstances) {
            if (!targetUsername || targetUsername === i.bot.username) {
                goto(i, goal);
            }
        }
    }
}