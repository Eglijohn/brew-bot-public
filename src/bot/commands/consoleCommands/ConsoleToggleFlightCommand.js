import ConsoleCommand from "./ConsoleCommand.js";
import {botInstances} from "../../../index.js";
import {Vec3} from "vec3";
import {teleport} from "../../utils/Movement.js";

export default class ConsoleToggleFlightCommand extends ConsoleCommand {
    constructor() {
        super("tfly", "toggle flight", ["fly", "togglefly", "flight", "toggleflight", "tflight"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                i.fly = !i.fly;
            }
        }
    }
}