import ChatCommand from "../ChatCommand.js";
import {Vec3} from "vec3";
import TeleportTask from "../../utils/TeleportTask.js";

export default class ChatTeleportCommand extends ChatCommand {
    constructor() {
        super("teleport", "!teleport <player | x, y, z> - Teleport to a position or player", ["tp", "tpto"], 1);
    }

    async execute(instance, username, args) {
        let goal;
        const t = new TeleportTask(instance, true, true);

        if (args.length === 1) {
            goal = instance.bot.players[username].entity.position
        } else if (args.length === 2) {
            goal = instance.bot.players[args[1]].entity.position
        } else if (args.length === 4) {
            goal = new Vec3(parseFloat(args[1]), parseFloat(args[2]), parseFloat(args[3]));
        }

        await t.fastTeleport(goal, false);
    }
}