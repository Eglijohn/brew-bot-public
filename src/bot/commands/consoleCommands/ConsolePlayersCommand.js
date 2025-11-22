import {botInstances, onlinePlayers} from "../../../index.js";
import ConsoleCommand from "../ConsoleCommand.js";
import chalk from "chalk";
import {GRAY} from "../../../utils/other/Colors.js";

export default class ConsolePlayersCommand extends ConsoleCommand {
    constructor() {
        super("players", "!players [all | range] Display online/in range Players", []);
    }

    async execute(logger, args, targetUsername) {
        let players;
        players = 'Online Players [' + onlinePlayers.length + ']: \n' + onlinePlayers.join(', \n');

        if (args[1] === 'all' || !args[1]) {
            logger.info(players);
        } else {
            for (const i of botInstances) {
                if (!targetUsername || i.bot.username === targetUsername) {
                    const p = Object.values(i.bot.players).filter(player => player.entity && player.username !== i.bot.username).map(p => `${p.username} ${chalk.hex(GRAY)('[' + p.entity.position.distanceTo(i.bot.entity.position).toFixed(2) + 'm]')}`);
                    players = 'Players in Range [' + p.length + ']: \n' + p.join(',\n');
                    i.logger.info(players);
                }
            }
        }
    }
}