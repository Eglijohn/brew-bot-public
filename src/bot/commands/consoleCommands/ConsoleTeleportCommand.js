import ConsoleCommand from "../ConsoleCommand.js";
import {Vec3} from "vec3";
import {botInstances} from "../../../index.js";
import TeleportTask from "../../utils/TeleportTask.js";

export default class ConsoleTeleportCommand extends ConsoleCommand {
    constructor() {
        super("teleport", "!teleport <username | x, y, z> - Teleport to a Position/Player", ["tp", "tpto"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                let goal;
                const t = new TeleportTask(i, true, true)

                if (args.length === 2) {
                    goal = i.bot.players[args[1]].entity.position
                } else if (args.length === 4) {
                    goal = new Vec3(parseFloat(args[1]), parseFloat(args[2]), parseFloat(args[3]));
                }

                await t.fastTeleport(goal, false);
            }
        }
    }
}