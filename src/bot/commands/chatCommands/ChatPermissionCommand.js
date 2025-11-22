import ChatCommand from "../ChatCommand.js";
import {getPermissionLevel, hasPermissions} from "../../../utils/other/Data.js";
import {chatCommands} from "../../../index.js";

export default class ChatPermissionCommand extends ChatCommand {
    constructor() {
        super("permission", "!permission <command> - See if you can execute Commands", ["permissions", "perm", "perms"], 3);
    }

    async execute(instance, username, args) {
        const cmd = args[1].startsWith('!') ? args[1].substring(1) : args[1];
        const command = chatCommands.get(cmd)
        const permLevel = command.permissionLevel
        const userLevel = await getPermissionLevel(username, instance.bot.username)
        const hasPerms = await hasPermissions(username, instance.bot.username, permLevel);
        const levelToString = (lvl) => {
            switch (lvl) {
                case 1:
                    return 'Administrator';
                case 2:
                    return 'Moderator';
                case 3:
                    return 'User';
            }
        }

        instance.bot.whisper(username, `You ${hasPerms ? 'have' : 'dont have'} permission to run '!${cmd}'. Required Level: ${permLevel} [${levelToString(permLevel)}], Your Level: ${userLevel} [${levelToString(userLevel)}]`);
    }
}