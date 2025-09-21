import {reloadConfig} from "../../../index.js";
import ConsoleCommand from "./ConsoleCommand.js";

export default class ConsoleReloadConfigCommand extends ConsoleCommand {
    constructor() {
        super("reloadconfig", "reloade", []);
    }

    async execute(logger, args, targetUsername) {
        await reloadConfig();
    }
}