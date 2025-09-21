import chalk from "chalk";
import Logger from "../utils/console/Logger.js";
import {getAccount} from "../utils/other/Data.js";
import mineflayer from "mineflayer";
import initEvents from "./Events.js";
import {botInstances, chatCommands} from "../index.js";
import {BrewBotAddonRegistry} from "../utils/addon/BrewBotAddonRegistry.js";
import pkg from 'mineflayer-pathfinder';
import armorManager from 'mineflayer-armor-manager';

const { pathfinder } = pkg;

/**
 * The main bot class
 */
export default class Bot {
    constructor(options) {
        if (!options.username) {
            console.error(chalk.red('Error: Username is required. Use --username or -u to specify it.'));
            process.exit(1);
        }
        this.options = options;
        this.logger = new Logger(options.username);
        this.botOptions = options;
        this.fly = false;
        this.addonRegistry = new BrewBotAddonRegistry();

        this.init()
    }

    async executeChatCommand(username, message) {
        await chatCommands.executeChatCommand(this, username, message);
    }

    async init() {
        const account = await getAccount(this.options.username);
        this.options.auth = account.auth;

        this.bot = mineflayer.createBot(this.options);
        this.logger.info('Connecting to ' + this.options.host + ':' + this.options.port + "...");

        if (botInstances.length === 1) this.leader = true;

        await this.addonRegistry.autoRegisterAddons('../../../addons/');
        this.bot.loadPlugin(pathfinder);
        this.bot.loadPlugin(armorManager);

        this.bot.on('login', () => {
            this.logger.info(`Logged in as ${this.bot.username}${this.leader ? `, Leader` : ` `}`);

            initEvents(this);

            this.addonRegistry.registerAllEvents(this);
        });
    }
}