import readline from "readline";
import chalk from "chalk";
import {GRAY, PRIMARY} from "../other/Colors.js";
import {botInstances, chatCommands, config, consoleCommands, VERSION} from "../../index.js";

export default function initConsoleInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk.hex(PRIMARY)('~') + chalk.hex(GRAY)('$ ')
    });

    rl.prompt();

    rl.on('line', async (line) => {
        const input = line.trim();

        if (input.startsWith('!')  && config.commands.commandline) {
            await executeConsoleCommand(input);
        } else {
            botInstances.forEach(instance => {
                if (instance && instance.bot && config.console.sendChat === true) {
                    instance.bot.chat(input);
                }
            });
        }

        rl.prompt();
    }).on('close', () => {
        console.log('Have a nice day!')
        process.exit(0);
    });

    const originalLog = console.log;
    console.log = (...args) => {
        rl.output.write('\x1b[2K\r');
        originalLog(...args);
        rl.prompt(true);
    };
}

async function executeConsoleCommand(message) {
    await consoleCommands.executeConsoleCommand(message);
}