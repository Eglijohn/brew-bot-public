import ConsoleCommand from "./ConsoleCommand.js";
import Logger from "../../utils/console/Logger.js";

class ConsoleCommandRegistry {
    constructor() {
        this.commands = new Map();
        this.aliases = new Map();
        this.logger = new Logger('System')
    }

    /**
     * Register a command
     * @param command Command class
     */
    register(command) {
        if (!(command instanceof ConsoleCommand)) {
            throw new Error('(' + command.name + ') ConsoleCommand must extend ConsoleCommand class');
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
        if (command) {
            return command;
        }

        const aliasTarget = this.aliases.get(name);
        if (aliasTarget) {
            const aliasCommand = this.commands.get(aliasTarget);
            return aliasCommand;
        }

        return null;
    }

    async executeConsoleCommand(message) {
        if (!message.startsWith("!")) return;

        const command = message.substring(1);
        const args = command.split(' ');
        const commandName = args[0];

        let actualArgs = args;
        let targetUsername = null;

        if (args[0] && args[0].startsWith(':')) {
            targetUsername = args[0].substring(1);
            let actualCommandName = args[1];
            if (!actualCommandName) {
                this.logger.error('No command specified after username target');
                return;
            }

            if (actualCommandName.startsWith('!')) {
                actualCommandName = actualCommandName.substring(1);
            }

            actualArgs = [actualCommandName, ...args.slice(2)];

            const cmd = this.get(actualCommandName);
            if (!cmd) {
                this.logger.error('Command "' + actualCommandName + '" doesn\'t exist');
                return;
            }

            try {
                await cmd.execute(this.logger, actualArgs, targetUsername);
            } catch (error) {
                this.logger.error(`Error executing command ${actualCommandName}:`, error);
            }
        } else {
            const cmd = this.get(commandName);
            if (!cmd) {
                this.logger.error('Command "' + commandName + '" doesn\'t exist');
                return;
            }

            try {
                await cmd.execute(this.logger, actualArgs, targetUsername);
            } catch (error) {
                console.error(`Error executing command ${commandName}:`, error);
            }
        }
    }

    getAllCommands() {
        return Array.from(this.commands.values());
    }
}

export { ConsoleCommandRegistry };