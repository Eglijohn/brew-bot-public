import {config} from "../../index.js";
import chalk from "chalk";

export default function PacketLogger(i) {
    i.bot._client.writeOriginal = i.bot._client.writeOriginal || i.bot._client.write;
    i.bot._client.write = function (name, packet) {
        if (config.packetLogger.enabled && (config.packetLogger.packets.includes(name) || (config.packetLogger.all && !config.packetLogger.ignore.includes(name))) && !config.packetLogger.onlyS2C) {
            i.logger.debug(chalk.gray('⬆c2s | ') + name + ': ', packet);
        }

        this.writeOriginal(name, packet);
    };

    i.bot._client.on('packet', (data, metadata) => {
        if (config.packetLogger.enabled && (config.packetLogger.packets.includes(metadata.name) || (config.packetLogger.all && !config.packetLogger.ignore.includes(metadata.name))) && !config.packetLogger.onlyC2S) {
            i.logger.debug(chalk.gray('⬇s2c | ') + metadata.name + ': ', data);
        }
    })
}