import chalk from 'chalk';
import {GRAY, PRIMARY, PRIMARY_DARK} from "../other/Colors.js";
import * as util from "node:util";
import Webhook from "../other/Discord.js";
import {config} from "../../index.js";
import fs from "fs";
import {appendToFile, checkAndCreateFile, convertEmojis} from "../other/Data.js";

class Logger {
    constructor(username, webhook = false) {
        this.username = username;
        if (config.discord.webHook.enabled) {
            this.webhook = new Webhook(config.discord.webHook.url, username, webhook, username);
        }
        this.ansiEscape = /\x1b\[[0-9;]*m/g;
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

        const cmsg = `${chalk.hex(GRAY)(timestamp + ':')} ${chalk.hex(GRAY)('[') + chalk.hex(PRIMARY_DARK)(username) + chalk.hex(GRAY)(']')} ${messages.join(' ')}`;
        const fmsg = `${timestamp}: ${username} ${messages.map(m => m.replace(ansiEscape, '')).join(' ')}`;
        const consoleMessage = convertEmojis(cmsg);
        const fileMessage = convertEmojis(fmsg);

        checkAndCreateFile('./logs/log.txt');
        fs.appendFileSync('./logs/log.txt', fileMessage + '\n');
        console.log(consoleMessage);
    }

    /**
     * Logs an info message.
     * @param message Message to log
     */
    info(message) {
        this.log(chalk.hex(GRAY)('[') + chalk.green('info') + chalk.hex(GRAY)(']'), message);
        if (this.webhook && config.discord.webHook.logs.info) this.webhook.info(message.replace(this.ansiEscape, ''));
    }

    /**
     * Logs a warning message.
     * @param message Message to log
     */
    warn(message) {
        this.log(chalk.hex(GRAY)('[') + chalk.yellow('warn') + chalk.hex(GRAY)(']'), chalk.yellow(message));
        if (this.webhook && config.discord.webHook.logs.warn) this.webhook.warn(message.replace(this.ansiEscape, ''));
    }

    /**
     * Logs an error message.
     * @param message Message to log
     */
    error(message) {
        this.log(chalk.hex(GRAY)('[') + chalk.red('error') + chalk.hex(GRAY)(']'), chalk.red(message));
        if (this.webhook && config.discord.webHook.logs.error) this.webhook.err(message.replace(this.ansiEscape, ''));
    }

    /**
     * Logs a debug message.
     * @param message Message to log
     * @param object Object to inspect
     */
    debug(message, object = undefined) {
        this.log(chalk.hex(GRAY)('[') + chalk.blue('debug') + chalk.hex(GRAY)(']'), message, object instanceof Object ? util.inspect(object, {depth: 2, colors: true}) : '');
    }

    /**
     * Logs a chat message.
     * @param message Message to log
     */
    chat(message) {
        this.log(chalk.hex(GRAY)('[') + chalk.greenBright('chat') + chalk.hex(GRAY)(']'), chalk.white(message));
        if (this.webhook && config.discord.webHook.logs.chat) this.webhook.chat(message.replace(this.ansiEscape, ''));
    }
}

export default Logger;