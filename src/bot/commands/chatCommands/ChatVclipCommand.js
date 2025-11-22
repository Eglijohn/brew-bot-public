import ChatCommand from "../ChatCommand.js";
import TeleportTask from "../../utils/TeleportTask.js";
import {Vec3} from "vec3";

export default class ChatVclipCommand extends ChatCommand {
    constructor() {
        super("vclip", "!vclip <blocks> - Teleport Vertically", [], 2);
    }

    async execute(instance, username, args) {
        const t = new TeleportTask(instance, true, true);
        const botPos = instance.bot.entity.position;
        const pos = new Vec3(botPos.x, botPos.y + parseFloat(args[1]), botPos.z);

        await t.fastTeleport(pos, false)
    }
}