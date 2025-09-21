import BrewBotAddon from "../../src/utils/addon/BrewBotAddon.js";
import { chatCommands, consoleCommands } from "../../src/index.js";
import ChatExampleCommand from "./commands/chatCommands/ChatExampleCommand.js";
import ConsoleExampleCommand from "./commands/consoleCommands/ConsoleExampleCommand.js";
import initEvents from "./events/Events.js";

export default class ExampleAddon extends BrewBotAddon {
    constructor() {
        super("ExampleAddon"); // The addon's name
        this.chatCommands = chatCommands; 
        this.consoleCommands = consoleCommands;
        this.eventHandlers = [];
    }

    /* Initialize commands & events */
    initialize(logger, bot = null) {
        this.bot = bot;

        this.consoleCommands.register(new ConsoleExampleCommand()); // Register console commands
        this.chatCommands.register(new ChatExampleCommand()); // Register chat commands

        if (this.bot) {
            this.registerEvents();
        }
    }

    /* Register Events */
    registerEvents() {
        const eventHandlers = initEvents(this.bot);
        this.eventHandlers.push(eventHandlers);
    }
}
