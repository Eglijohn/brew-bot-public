export default class ConsoleCommand {
    constructor(name, description, aliases = []) {
        this.name = name;
        this.description = description;
        this.aliases = aliases;
    }

    /**
     * Execute the command
     * @param logger Logger instance
     * @param {string[]} args Command arguments
     * @param {string|null} targetUsername Target username (null if command applies to all bots)
     */
    async execute(logger, args, targetUsername = null) {
        throw new Error('Execute method must be implemented by subclass');
    }

    /**
     * Get command usage string
     */
    getUsage() {
        return `!${this.name}`;
    }
}