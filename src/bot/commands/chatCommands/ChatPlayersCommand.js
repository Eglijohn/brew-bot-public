import ChatCommand from "../ChatCommand.js";
import {onlinePlayers} from "../../../index.js";

export default class ChatPlayersCommand extends ChatCommand {
    constructor() {
        super("players", "!players [all | range] - Show online players / Players in range", [], 2);
    }

    async execute(instance, username, args) {
        let players;

        if (args[1] === 'all') {
            players = 'Online Players [' + onlinePlayers.length + ']: ' + onlinePlayers.join(', ');
        } else if ([args[1] === 'range']) {
            const p = Object.values(instance.bot.players).filter(player => player.entity && player.username !== instance.bot.username).map(p => p.username);
            players = 'Players in Range [' +  p.length + ']: ' + p.join(', ');
        } else {
            players = 'Online Players [' + onlinePlayers.length + ']: ' + onlinePlayers.join(', ');
        }

        instance.bot.whisper(username, players)
    }
}