/*      _______   _______
 *     ╱╱      ╱ ╱╱      ╱
 *    ╱╱       ╲╱╱       ╲
 *   ╱         ╱         ╱
 *   ╲________╱╲________╱
 * Brew Bot by Eglijohn & R3akeOn3_
 */


import chalk from "chalk";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {GRAY, PRIMARY} from "./utils/other/Colors.js";
import { ChatCommandRegistry } from "./bot/commands/chatCommands/ChatCommandRegistry.js";
import { ConsoleCommandRegistry } from "./bot/commands/consoleCommands/ConsoleCommandRegistry.js";
import Bot from "./bot/Bot.js";

// We live in a cruel world
import initConsoleInput from "./utils/console/Console.js";
import ChatHelpCommand from "./bot/commands/chatCommands/ChatHelpCommand.js";
import ChatSayCommand from "./bot/commands/chatCommands/ChatSayCommand.js";
import ChatQuitCommand from "./bot/commands/chatCommands/ChatQuitCommand.js";
import ChatInviteCommand from "./bot/commands/chatCommands/ChatInviteCommand.js";
import ChatTeleportCommand from "./bot/commands/chatCommands/ChatTeleportCommand.js";
import ChatPositionCommand from "./bot/commands/chatCommands/ChatPositionCommand.js";
import ConsoleHelpCommand from "./bot/commands/consoleCommands/ConsoleHelpCommand.js";
import ConsoleSayCommand from "./bot/commands/consoleCommands/ConsoleSayCommand.js";
import ConsoleQuitCommand from "./bot/commands/consoleCommands/ConsoleQuitCommand.js";
import ConsoleInviteCommand from "./bot/commands/consoleCommands/ConsoleInviteCommand.js";
import ConsoleTeleportCommand from "./bot/commands/consoleCommands/ConsoleTeleportCommand.js";
import ConsolePositionCommand from "./bot/commands/consoleCommands/ConsolePositionCommand.js";
import ChatAttackCommand from "./bot/commands/chatCommands/ChatAttackCommand.js";
import ConsoleAttackCommand from "./bot/commands/consoleCommands/ConsoleAttackCommand.js";
import ChatFollowCommand from "./bot/commands/chatCommands/ChatFollowCommand.js";
import ConsoleFollowCommand from "./bot/commands/consoleCommands/ConsoleFollowCommandd.js";
import ConsoleStopCommand from "./bot/commands/consoleCommands/ConsoleStopCommand.js";
import ChatStopCommand from "./bot/commands/chatCommands/ChatStopCommand.js";
import ConsoleGotoCommand from "./bot/commands/consoleCommands/ConsoleGotoCommand.js";
import ChatGotoCommand from "./bot/commands/chatCommands/ChatGotoCommand.js";
import ChatEquipCommand from "./bot/commands/chatCommands/ChatEquipCommand.js";
import ConsoleEquipCommand from "./bot/commands/consoleCommands/ConsoleEquipCommand.js";
import ConsoleInvseeCommand from "./bot/commands/consoleCommands/ConsoleInvseeCommand.js";
import ConsoleBotsCommand from "./bot/commands/consoleCommands/ConsoleBotsCommand.js";
import ChatNukerCommand from "./bot/commands/chatCommands/ChatNukerCommand.js";
import ChatRotateCommand from "./bot/commands/chatCommands/ChatRotateCommand.js";
import ConsoleToggleFlightCommand from "./bot/commands/consoleCommands/ConsoleToggleFlightCommand.js";
import ChatToggleFlightCommand from "./bot/commands/chatCommands/ChatToggleFlightCommand.js";
import ConsoleReloadConfigCommand from "./bot/commands/consoleCommands/ConsoleReloadConfigCommand.js";
import ChatReloadConfigCommand from "./bot/commands/chatCommands/ChatReloadConfigCommand.js";
import ChatDropCommand from "./bot/commands/chatCommands/ChatDropCommand.js";
import ConsoleDropCommand from "./bot/commands/consoleCommands/ConsoleDropCommand.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let config = await JSON.parse(readFileSync(join(__dirname, '..', 'config', 'config.json'), 'utf8'));
const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
const VERSION = packageJson.version;
const args = process.argv.slice(2);

const consoleCommands = new ConsoleCommandRegistry();
const chatCommands = new ChatCommandRegistry();

let onlinePlayers = [];
const botInstances = [];
const botOptions = {
    username: '',
    auth: '',
    host: 'localhost',
    version: '1.21',
    hideErrors: true
};

/* Arguments */
for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
        case '--username':
        case '-u':
            botOptions.username = args[++i];
            break;
        case '--host':
        case '-h':
            botOptions.host = args[++i];
            break;
        case '--port':
        case '-p':
            botOptions.port = parseInt(args[++i]);
            break;
        case '--version':
        case '-v':
            botOptions.version = args[++i];
            break;
        case '--hide-errors':
            botOptions.hideErrors = args[++i] !== 'false';
            break;
        case '--help':
            console.log('Usage: node index.js [options]');
            console.log('Options:');
            console.log('  --username, -u   Minecraft username (required)');
            console.log('  --host, -h       Server host (default: localhost)');
            console.log('  --port, -p       Server port (default: 6969)');
            console.log('  --version, -v    Minecraft version (default: 1.21.1)');
            console.log('  --help, -?       Show this help message');
            process.exit(0);
    }
}

console.log(
chalk.bold(chalk.hex(PRIMARY)(`    _______   _______   ${chalk.hex(PRIMARY)('Brew Bot')} ${chalk.hex(GRAY)('v' + VERSION + ' by Eglijohn')}
  ╱╱      ╱ ╱╱      ╱   ${chalk.hex(PRIMARY)('Host:')} ${chalk.hex(GRAY)(botOptions.host)}
 ╱╱       ╲╱╱       ╲   ${chalk.hex(PRIMARY)('Username:')} ${chalk.hex(GRAY)(botOptions.username)}
╱         ╱         ╱   ${chalk.hex(PRIMARY)('MQTT:')} ${chalk.hex(GRAY)('Unavailable')}      
╲________╱╲________╱           
`)));
console.log(config ? chalk.gray('Successfully loaded config') : chalk.red('Failed to load config'))
console.log(chalk.gray(`Chat commands: ${config.commands.chat}, Whisper commands: ${config.commands.whisper}, Commandline commands: ${config.commands.commandline}`))

initConsoleInput()

/* Register chat commands */
chatCommands.register(new ChatHelpCommand());
chatCommands.register(new ChatSayCommand());
chatCommands.register(new ChatQuitCommand());
chatCommands.register(new ChatInviteCommand());
chatCommands.register(new ChatTeleportCommand());
chatCommands.register(new ChatPositionCommand());
chatCommands.register(new ChatAttackCommand());
chatCommands.register(new ChatFollowCommand());
chatCommands.register(new ChatStopCommand());
chatCommands.register(new ChatGotoCommand());
chatCommands.register(new ChatEquipCommand());
chatCommands.register(new ChatNukerCommand());
chatCommands.register(new ChatRotateCommand());
chatCommands.register(new ChatToggleFlightCommand());
chatCommands.register(new ChatReloadConfigCommand());
chatCommands.register(new ChatDropCommand());

/* Register console commands */
consoleCommands.register(new ConsoleHelpCommand());
consoleCommands.register(new ConsoleSayCommand());
consoleCommands.register(new ConsoleQuitCommand());
consoleCommands.register(new ConsoleInviteCommand());
consoleCommands.register(new ConsoleTeleportCommand());
consoleCommands.register(new ConsolePositionCommand());
consoleCommands.register(new ConsoleAttackCommand());
consoleCommands.register(new ConsoleFollowCommand());
consoleCommands.register(new ConsoleStopCommand());
consoleCommands.register(new ConsoleGotoCommand());
consoleCommands.register(new ConsoleEquipCommand());
consoleCommands.register(new ConsoleInvseeCommand());
consoleCommands.register(new ConsoleBotsCommand());
consoleCommands.register(new ConsoleToggleFlightCommand());
consoleCommands.register(new ConsoleReloadConfigCommand());
consoleCommands.register(new ConsoleDropCommand());

// Start Bot
botInstances.push(new Bot(botOptions))

async function reloadConfig() {
    config = await JSON.parse(readFileSync(join(__dirname, '..', 'config', 'config.json'), 'utf8'));
}

export { config, botInstances, onlinePlayers, VERSION, chatCommands, consoleCommands, reloadConfig };