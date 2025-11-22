export default class BrewBotAddon {
    constructor() {
        this.bot = null;
        this.logger = null;
    }

    initialize(logger, bot = null) {
        this.bot = bot;
        this.logger = logger;
    }

    registerEvents() {
        throw new Error('Initialize method must be implemented by subclass');
    }
}
