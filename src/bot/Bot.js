import chalk from "chalk";
import Logger from "../utils/console/Logger.js";
import {getAccount} from "../utils/other/Data.js";
import mineflayer from "mineflayer";
import initEvents from "./Events.js";
import {botInstances, chatCommands} from "../index.js";
import {BrewBotAddonRegistry} from "../addon/BrewBotAddonRegistry.js";
import pkg from 'mineflayer-pathfinder';
import armorManager from 'mineflayer-armor-manager';
import PacketLogger from "./utils/PacketLogger.js";
import startViewer from "../panel/Viewer.js";

const { pathfinder } = pkg;

/**
 * The main bot class
 * @param options BotOptions
 */
export default class Bot {
    constructor(options, panel = false) {
        if (!options.username) {
            console.error(chalk.red('Error: Username is required. Use --username or -u to specify it.'));
            process.exit(1);
        }

        this.options = options;
        this.logger = new Logger(options.username, true);
        this.botOptions = options;
        this.followTarget = {
            target: undefined
        };
        this.addonRegistry = new BrewBotAddonRegistry();
        this.gameTicks = 0;

        this.leader = !botInstances.some(bot => bot.leader);
        this.didAlreadyInit = false;

        this.init();
    }

    async executeChatCommand(username, message) {
        await chatCommands.executeChatCommand(this, username, message);
    }

    async init() {
        this.logger.info('Initializing ' + this.options.username);

        const account = await getAccount(this.options.username);
        if (account?.auth !== undefined) {
            this.options.auth = account.auth;
        } else {
            this.options.auth = 'offline';
        }
        this.options.brand = 'Brew Bot';
        this.options.profilesFolder = 'tokens/' + this.botOptions.username;

        this.bot = mineflayer.createBot(this.options);
        this.logger.info('Connecting to ' + this.options.host + ':' + this.options.port + "...");

        await this.addonRegistry.autoRegisterAddons('../../addons/');
        this.bot.loadPlugin(pathfinder);
        this.bot.loadPlugin(armorManager);

        this.bot.on('login', () => {
            this.logger.info(`Logged in as ${this.bot.username}${this.leader ? ', Leader' : ''}`);

            PacketLogger(this);
            initEvents(this);
            // if (this.leader && !this.didAlreadyInit) startViewer(this);

            this.addonRegistry.registerAllEvents(this);
        });

        this.didAlreadyInit = true;
    }
}