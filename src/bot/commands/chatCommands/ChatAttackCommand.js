import ChatCommand from "./ChatCommand.js";
import {attack} from "../../utils/Attack.js";

export default class ChatAttackCommand extends ChatCommand {
    constructor() {
        super("attack", "Attack somebody", ["hit", "damage"], 2);
    }

    async execute(instance, username, args){
        const target = instance.bot.players[args[1]];

        await attack(instance, target, args[2] ===  'mace', parseInt(args[3]));
    }
}