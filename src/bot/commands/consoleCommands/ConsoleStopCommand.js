import {stopGoals} from "../../utils/Movement.js";
import ConsoleCommand from "./ConsoleCommand.js";
import {botInstances} from "../../../index.js";

export default class ConsoleStopCommand extends ConsoleCommand {
    constructor() {
        super("stop", "stop", ["stopfollow"]);
    }

    async execute(logger, aggsargs, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || targetUsername === i.bot.username) {
                stopGoals(i);
            }
        }
    }
}