import {hasPermissions} from "../../../utils/other/Data.js";
import ChatCommand from "./ChatCommand.js";
import Logger from "../../../utils/console/Logger.js";

class ChatCommandRegistry {
    constructor() {
        this.commands = new Map();
        this.aliases = new Map();
        this.logger = new Logger('System');
    }

    /**
     * Register a command
     * @param command Class
     */
    register(command) {
        if (!(command instanceof ChatCommand)) {
            throw new Error('ConsoleCommand must extend ConsoleCommand class');
        }

        this.commands.set(command.name.toLowerCase(), command);

        command.aliases.forEach(alias => {
            this.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
        });
    }

    /**
     * Get a command class
     * @param commandName Command name
     * @returns {any|null} Class
     */
    get(commandName) {
        const name = commandName.toLowerCase();
        const command = this.commands.get(name);
        if (command) return command;

        const aliasTarget = this.aliases.get(name);
        if (aliasTarget) {
            return this.commands.get(aliasTarget);
        }

        return null;
    }

    async executeChatCommand(instance, username, message) {
        if (!message.startsWith("!")) return;
        if (username === instance.bot.username) return;

        const command = message.substring(1);
        const args = command.split(' ');
        const commandName = args[0];

        const cmd = this.get(commandName);
        if (!cmd) {
            instance.bot.whisper(username, `Unknown command: ${commandName}. Type !help for a list of commands.`);
            return;
        }

        if (!hasPermissions(username, instance.bot.username, cmd.permissionLevel)) {
            instance.bot.whisper(username, 'You do not have permission to use this command. Required level: ' + cmd.permissionLevel);
            return;
        }

        try {
            await cmd.execute(instance, username, args);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            instance.bot.whisper(username, 'An error occurred while executing the command.');
        }
    }

    getAllCommands() {
        return Array.from(this.commands.values());
    }
}

export { ChatCommandRegistry };