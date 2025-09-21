import chalk from 'chalk';
import {GRAY, PRIMARY, PRIMARY_DARK} from "../other/Colors.js";

class Logger {
    constructor(username) {
        this.username = username;
    }

    /**
     * Logs a message with a timestamp and username.
     * @param messages Messages to log
     */
    log(...messages) {
        const ansiEscape = /\x1b\[[0-9;]*m/g;
        const timestamp = new Date().toLocaleString('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const username = this.username || '-';

        const consoleMessage = `${chalk.hex(GRAY)( timestamp + ':')} ${chalk.hex(GRAY)('[') + chalk.hex(PRIMARY_DARK)(username) + chalk.hex(GRAY)(']')} ${messages.join(' ')}`;
        // const fileMessage = `${timestamp}: ${username} ${messages.map(m => m.replace(ansiEscape, '')).join(' ')}`;

        console.log(consoleMessage);
    }

    /**
     * Logs an info message.
     * @param message Message to log
     */
    info(message) {
        this.log(chalk.hex(GRAY)('[') + chalk.green('info') + chalk.hex(GRAY)(']'), message);
    }

    /**
     * Logs a warning message.
     * @param message Message to log
     */
    warn(message) {
        this.log(chalk.hex(GRAY)('[') + chalk.yellow('warn') + chalk.hex(GRAY)(']'), chalk.yellow(message));
    }

    /**
     * Logs an error message.
     * @param message Message to log
     */
    error(message) {
        this.log(chalk.hex(GRAY)('[') + chalk.red('error') + chalk.hex(GRAY)(']'), chalk.red(message));
    }

    /**
     * Logs a debug message.
     * @param message Message to log
     */
    debug(message) {
        this.log(chalk.hex(GRAY)('[') + chalk.blue('debug') + chalk.hex(GRAY)(']'), chalk.blueBright(message));
    }

    /**
     * Logs a chat message.
     * @param message Message to log
     */
    chat(message) {
        this.log(chalk.hex(GRAY)('[') + chalk.greenBright('chat') + chalk.hex(GRAY)(']'), chalk.white(message));
    }
}

export default Logger;