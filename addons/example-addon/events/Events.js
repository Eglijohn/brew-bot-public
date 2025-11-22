export default function initEvents(i) {
    /* Example event, you can use every mineflayer event here */
    i.bot.on('spawn', () => {
        i.logger.info('Hello, World!');
    });
}