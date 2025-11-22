/**
 * A discord webhook
 * @param url Webhook endpoint
 * @param name Name
 */
export default class Webhook {
    constructor(url, name, customAvatar = false, avatarName = undefined) {
        this.url = url;
        this.name = name;
        this.customAvatar = customAvatar;
        this.avatarName = avatarName;
    }

    /**
     * Send an embed to the webhook
     * @param message Message
     * @returns {Promise<void>} Status
     */
    async sendEmbed(message) {
        try {
            const headers = { "Content-Type": "application/json" };

            const body = {
                username: this.name + " [Brew Bot]",
                embeds: [{
                    description: message,
                    color: 5814783,
                }],
            };

            if (this.customAvatar) {
                body.avatar_url = "https://mc-heads.net/avatar/" + this.avatarName;
            }

            const res = await fetch(this.url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
            });

            if (!res.ok && !res.status === 429) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
        } catch (err) {
            if (err.message === 'Error: HTTP error! Status: 429') return;
            console.error("Failed to send webhook:", err);
        }
    }

    /**
     * Send a message to the webhook
     * @param message Message
     * @returns {Promise<void>} Status
     */
    async sendMessage(message) {
        try {
            const headers = { "Content-Type": "application/json" };

            const body = {
                username: this.name + " [Brew Bot]",
                content: message
            };

            if (this.customAvatar) {
                body.avatar_url = "https://mc-heads.net/avatar/" + this.avatarName;
            }

            const res = await fetch(this.url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
            });

            if (!res.ok && !res.status === 429) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
        } catch (err) {
            console.error("Failed to send webhook:", err);
        }
    }

    /**
     * Send a [chat] message to the webhook
     * @param message Message
     * @returns {Promise<void>} Status
     */
    async chat(message) {
        await this.sendMessage('`🟢 chat:` ' + message);
    }

    /**
     * Send a [info] message to the webhook
     * @param message Message
     * @returns {Promise<void>} Status
     */
    async info(message) {
        await this.sendMessage('`🟢 info:` ' + message);
    }

    /**
     * Send a [warn] message to the webhook
     * @param message Message
     * @returns {Promise<void>} Status
     */
    async warn(message) {
        await this.sendMessage('`🟠 warn:` ' + message);
    }

    /**
     * Send an [error] message to the webhook
     * @param message Message
     * @returns {Promise<void>} Status
     */
    async err(message) {
        await this.sendMessage('`🔴 error:` ' + message);
    }
}
