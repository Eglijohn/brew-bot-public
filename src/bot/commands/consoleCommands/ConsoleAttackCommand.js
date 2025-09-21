import {attack} from "../../utils/Attack.js";
import ConsoleCommand from "./ConsoleCommand.js";
import {botInstances} from "../../../index.js";
import {teleport} from "../../utils/Movement.js";

export default class ConsoleAttackCommand extends ConsoleCommand {
    constructor() {
        super("attack", "Attack somebody", ["hit", "damage"]);
    }

    async execute(logger, args, targetUsername) {
        for (const i of botInstances) {
            const target = i.bot.players[args[1]];
            const useMace = args[2] === 'mace';

            if (!targetUsername || i.bot.username === targetUsername) {
                await attack(i, target, useMace, parseInt(args[3]));
            }
        }
    }
}