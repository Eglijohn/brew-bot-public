import {reloadConfig} from "../../../index.js";
import ConsoleCommand from "../ConsoleCommand.js";

export default class ConsoleReloadConfigCommand extends ConsoleCommand {
    constructor() {
        super("reloadconfig", "!reloadconfig - Reload the config", []);
    }

    async execute(logger, args, targetUsername) {
        await reloadConfig();
    }
}