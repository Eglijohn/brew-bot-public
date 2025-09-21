export default class BrewBotAddon {
    constructor(name) {
        this.name = name;
        this.bot = null;
    }

    initialize(logger, bot = null) {
        this.bot = bot;
        throw new Error('Execute method must be implemented by subclass');
    }

    registerEvents() {

    }
}