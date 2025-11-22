import BrewBotAddon from "../../src/addon/BrewBotAddon.js";
import { chatCommands, consoleCommands } from "../../src/index.js";
import ChatExampleCommand from "./commands/chatCommands/ChatExampleCommand.js";
import ConsoleExampleCommand from "./commands/consoleCommands/ConsoleExampleCommand.js";
import initEvents from "./events/Events.js";

export default class ExampleAddon extends BrewBotAddon {
    constructor() {
        super();
        this.chatCommands = chatCommands;
        this.consoleCommands = consoleCommands;
        this.eventHandlers = [];
    }

    /* Initialize commands & events */
    initialize(logger, bot = null) {
        super.initialize(logger, bot);

        this.consoleCommands.register(new ConsoleExampleCommand()); // Register your Chat Commands
        this.chatCommands.register(new ChatExampleCommand()); // Register your Console Commands

        if (this.bot) this.registerEvents();
    }

    registerEvents() {
        const eventHandlers = initEvents(this.bot);
        this.eventHandlers.push(eventHandlers);
    }
}
