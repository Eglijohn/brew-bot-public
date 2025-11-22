import {botInstances} from "../../../index.js";
import ConsoleCommand from "../ConsoleCommand.js";
import TeleportTask from "../../utils/TeleportTask.js";
import {Vec3} from "vec3";

export default class ConsoleVclipCommand extends ConsoleCommand {
    constructor() {
        super("vclip", "!vclip <blocks> - Teleport Vertically", []);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                const t = new TeleportTask(i, true, true);
                const botPos = i.bot.entity.position;
                const pos = new Vec3(botPos.x, botPos.y + parseFloat(args[1]), botPos.z);

                await t.fastTeleport(pos, false)
            }
        }
    }
}