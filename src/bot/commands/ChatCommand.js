export default class ChatCommand {
    constructor(name, usage, aliases = [], permissionLevel = 1) {
        this.name = name;
        this.usage = usage;
        this.aliases = aliases;
        this.permissionLevel = permissionLevel;
    }

    /**
     * Execute the command
     * @param {Object} instance Bot instance
     * @param {string} username Username who executed the command
     * @param {string[]} args ConsoleCommand arguments
     */
    async execute(instance, username, args) {
        throw new Error('Execute method must be implemented by subclass');
    }

    /**
     * Get command usage string
     */
    getUsage() {
        return `!${this.name}`;
    }
}