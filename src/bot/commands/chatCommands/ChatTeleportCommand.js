import ChatCommand from "./ChatCommand.js";
import {teleport} from "../../utils/Movement.js";
import {Vec3} from "vec3";

export default class ChatTeleportCommand extends ChatCommand {
    constructor() {
        super("teleport", "Teleport to a player", ["tp", "tpto"], 1);
    }

    async execute(instance, username, args) {
        let goal;

        if (args.length === 1) {
            goal = instance.bot.players[username].entity.position
        } else if (args.length === 2) {
            goal = instance.bot.players[args[1]].entity.position
        } else if (args.length === 4) {
            goal = new Vec3(parseFloat(args[1]), parseFloat(args[2]), parseFloat(args[3]));
        }

        await teleport(instance, goal, false, true, true);
    }
}