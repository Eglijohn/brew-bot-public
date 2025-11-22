/*
 * Brew Bot Private by Eglijohn & R3akeOn3_
 * DO NOT SHARE
 */

import chalk from "chalk";
import fs, { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path, { dirname, join } from "path";
import Bot from "./bot/Bot.js";
import {GRAY, PRIMARY, PRIMARY_DARK} from "./utils/other/Colors.js";
import initConsoleInput from "./utils/console/Console.js";

// Registries
import { ChatCommandRegistry } from "./bot/commands/ChatCommandRegistry.js";
import { ConsoleCommandRegistry } from "./bot/commands/ConsoleCommandRegistry.js";

// Commands
import * as ChatCommands from "./bot/commands/chatCommands/Index.js";
import * as ConsoleCommands from "./bot/commands/consoleCommands/Index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let config = JSON.parse(readFileSync(join(__dirname, "..", "config", "config.json"), "utf8"));
const packageJson = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf8"));
const VERSION = packageJson.version;
const args = process.argv.slice(2);

// Registries
const consoleCommandRegistry = new ConsoleCommandRegistry();
const chatCommandRegistry = new ChatCommandRegistry();

// Bot stuff
let onlinePlayers = [];
const botInstances = [];
const botOptions = {
    username: "",
    auth: "",
    host: "localhost",
    version: "1.21",
    hideErrors: true,
    physicsEnabled: true
};
let panel = false;

// Parse Usernames
function parseUsernames(raw) {
    if (!raw) return "";
    raw = String(raw).trim();
    if (raw.startsWith("[") && raw.endsWith("]")) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed.map(s => String(s).trim()).filter(s => s.length > 0);
        } catch (e) {
            const inner = raw.slice(1, -1);
            return inner.split(",").map(s => s.trim()).filter(s => s.length > 0);
        }
    }
    if (raw.includes(",")) return raw.split(",").map(s => s.trim()).filter(s => s.length > 0);
    return raw;
}

// Cli stuff
function printHelp() {
    console.log("Usage: node src/index.js [options]");
    console.log("Options:");
    console.log("  --username, -u   Minecraft username (required)");
    console.log("  --host, -h       Server host (default: localhost)");
    console.log("  --port, -p       Server port (default: 6969)");
    console.log("  --version, -v    Minecraft version (default: 1.21.1)");
    console.log("  --hide-errors    Hide errors (default: true)");
    console.log("  --help, -?       Show this help message");
    console.log("  --panel          Start the bot with the Panel");
}

for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
        case "--username":
        case "-u":
            botOptions.username = parseUsernames(args[++i]);
            break;
        case "--host":
        case "-h":
            botOptions.host = args[++i];
            break;
        case "--port":
        case "-p":
            botOptions.port = parseInt(args[++i]);
            break;
        case "--version":
        case "-v":
            botOptions.version = args[++i];
            break;
        case "--hide-errors":
            botOptions.hideErrors = args[++i] !== "false";
            break;
        case "--panel":
            panel = true;
            break;
        case "--help":
        case "-?":
            printHelp();
            process.exit(0);
    }
}


console.log(
    chalk.bold(chalk.hex(PRIMARY)(
`    _______   _______   ${chalk.hex(PRIMARY)("Brew Bot")} ${chalk.hex(GRAY)("v" + VERSION + " by Eglijohn & R3akeOn3_")}
  ╱╱      ╱ ╱╱      ╱   ${chalk.hex(PRIMARY)("Host:")} ${chalk.hex(GRAY)(botOptions.host)}
 ╱╱       ╲╱╱       ╲   ${chalk.hex(PRIMARY)("Username:")} ${chalk.hex(GRAY)(Array.isArray(botOptions.username) ? botOptions.username.join(", ") : botOptions.username)}
╱         ╱         ╱    
╲________╱╲________╱          
            )} `
        )
    )
);

/*
console.log(chalk.gray(
`\n| "${chalk.hex(PRIMARY_DARK)(getRandomLine())}"
|     - End Poem \n`));
 */
console.log(config ? chalk.gray("Successfully loaded config") : chalk.red("Failed to load config"));
console.log(chalk.gray(`Chat commands: ${config.commands.chat}, Whisper commands: ${config.commands.whisper}, Commandline commands: ${config.commands.commandline}`));
initConsoleInput();

// Register all Chat Commands
Object.values(ChatCommands).forEach((Cmd) => chatCommandRegistry.register(new Cmd()));

// Register all Console Commands
Object.values(ConsoleCommands).forEach((Cmd) => consoleCommandRegistry.register(new Cmd()));

if (Array.isArray(botOptions.username)) {
    botOptions.username.forEach((uname) => {
        const opts = { ...botOptions, username: uname };
        botInstances.push(new Bot(opts, panel));
    });
} else if (botOptions.username && String(botOptions.username).length > 0) {
    botInstances.push(new Bot({ ...botOptions }, panel));
} else {
    botInstances.push(new Bot(botOptions, panel));
}


function getRandomLine() {
    const filePath = path.join(__dirname, "utils/other/splashtexts.txt");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== "");

    if (lines.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * lines.length);
    return lines[randomIndex];
}

async function reloadConfig() { config = JSON.parse(readFileSync(join(__dirname, "..", "config", "config.json"), "utf8")); }

// Exports
export {config, botInstances, onlinePlayers, VERSION, chatCommandRegistry as chatCommands, consoleCommandRegistry as consoleCommands, reloadConfig,};