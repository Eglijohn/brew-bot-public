import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from "../console/Logger.js";
import BrewBotAddon from "./BrewBotAddon.js";

class BrewBotAddonRegistry {
    constructor() {
        this.addons = new Map()
        this.logger = new Logger('Addon Registry')
    }

    register(addon, bot = null) {
        if (!(addon instanceof BrewBotAddon)) {
            throw new Error('Addon must extend BrewBotAddon class');
        }

        this.addons.set(addon.name, addon);
        addon.initialize(this.logger, bot);
    }

    async autoRegisterAddons(addonsDirectory = './addons', bot = null) {
        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const addonsPath = path.resolve(__dirname, addonsDirectory);

            if (!fs.existsSync(addonsPath)) {
                this.logger.warn(`Addons directory not found: ${addonsPath}`);
                return;
            }

            const addonFolders = fs.readdirSync(addonsPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);

            for (const folderName of addonFolders) {
                await this.loadAddon(addonsPath, folderName, bot);
            }

            if (this.addons.size === 0) return;
            this.logger.info(`Successfully loaded ${this.addons.size} addons`);
        } catch (error) {
            this.logger.error('Failed to auto-register addons:', error);
        }
    }

    async loadAddon(addonsPath, folderName, bot) {
        try {
            const possibleFiles = [
                `${folderName}.js`,
                `${folderName}Addon.js`,
                'index.js',
                'main.js'
            ];

            let addonFile = null;
            for (const fileName of possibleFiles) {
                const filePath = path.join(addonsPath, folderName, fileName);
                if (fs.existsSync(filePath)) {
                    addonFile = filePath;
                    break;
                }
            }

            if (!addonFile) {
                this.logger.warn(`No main addon file found in ${folderName}`);
                return;
            }

            const addonModule = await import(`file://${addonFile}`);
            const AddonClass = addonModule.default;

            if (!AddonClass) {
                this.logger.warn(`No default export found in ${folderName}`);
                return;
            }

            const addon = new AddonClass();
            this.register(addon, bot);
        } catch (error) {
            console.error(`Failed to load addon ${folderName}:`, error);
        }
    }

    registerAllEvents(bot) {
        for (const addon of this.addons.values()) {
            if (addon.bot !== bot) {
                addon.bot = bot;
                if (typeof addon.registerEvents === 'function') {
                    addon.registerEvents();
                }
            }
        }
    }

    get(addonName) {
        const addon = this.addons.get(addonName);
        if (addon) return addon;
        return null;
    }

    getAllAddons() {
        return Array.from(this.addons.values());
    }
}

export { BrewBotAddonRegistry };