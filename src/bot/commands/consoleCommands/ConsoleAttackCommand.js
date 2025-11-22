import {attack} from "../../utils/Attack.js";
import ConsoleCommand from "../ConsoleCommand.js";
import {botInstances} from "../../../index.js";

export default class ConsoleAttackCommand extends ConsoleCommand {
    constructor() {
        super("attack", "!attack <username | entityID> [mace] [heights] - Attack an Entity", ["hit", "damage"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                const target = i.bot.players[args[1]];
                i.logger.debug(args[3])

                await attack(i, target, args[2] ===  'mace', parseInt(args[3]));
            }
        }
    }
}