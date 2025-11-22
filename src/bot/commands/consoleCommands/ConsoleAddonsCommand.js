import {botInstances} from "../../../index.js";
import ConsoleCommand from "../ConsoleCommand.js";

export default class ConsoleAddonsCommand extends ConsoleCommand {
    constructor() {
        super("addons", "!addons - Display all loaded Addons", []);
    }

    async execute(logger, args, targetUsername) {
        const addons = botInstances[0].addonRegistry.getAllAddons().map(addon => addon.name);
        logger.info('Addons [' + addons.length + ']: ' + addons.join(', '));
    }
}