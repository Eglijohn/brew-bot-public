import {follow} from "../../utils/Movement.js";
import ConsoleCommand from "../ConsoleCommand.js";
import {botInstances} from "../../../index.js";

export default class ConsoleFollowCommand extends ConsoleCommand {
    constructor() {
        super("follow", "!follow <player> - Follow a player", []);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || targetUsername === i.bot.username) {
                const target = i.bot.players[args[1]];
                follow(i, target);
            }
        }
    }
}