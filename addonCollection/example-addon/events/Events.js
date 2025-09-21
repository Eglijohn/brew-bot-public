export default function initEvents(instance) {
    /* Register Events as you would normally do */
    instance.bot.on('spawn', () => {
        instance.logger.info('Hello, World!');
    });
}