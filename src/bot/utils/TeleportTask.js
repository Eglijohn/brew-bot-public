import { canTeleport } from "./World.js";
import {drawTemporaryLine} from "./RenderUtils.js";
import {Vec3} from "vec3";

/**
 * Slave the teleports!
 *
 * Uses the LiveOverflow teleport exploit to teleport far distances.
 * The first position added has the stage 1.
 * @param instance Bot instance
 * @param setClientSided Set the client sided position after teleporting
 * @param log Log teleports
 * @param debug Debug mode
 */
export default class TeleportTask {
    constructor(instance, setClientSided = true, log = false, debug = false) {
        this.i = instance;
        this.bot = instance.bot;
        this.setClientSided = setClientSided;
        this.log = log;
        this.debug = debug;
        this.packetsRequired = 0;
    }

    /**
     * Fast teleport to a position
     * @param goal Vec3 goal
     * @param forceNormal force single packet (max. 10 blocks)
     * @param onGround on ground value
     * @returns {Promise<boolean>} Status
     */
    async fastTeleport(goal, forceNormal = false, onGround = false) {
        const distance = this.bot.entity.position.distanceTo(goal);
        const pr = Math.ceil(distance / 10) -1 ;
        if (pr > 20) {
            this.i.logger.error(`Too many packets required: ${pr}`);
            return false;
        }

        const sendPackets = async () => {
            const startPos = this.bot.entity.position.clone();

            // Spam the packets before teleporting
            for (let i = 0; i < pr; i++) {
                this.bot._client.write('position', {
                    x: startPos.x,
                    y: startPos.y,
                    z: startPos.z,
                    yaw: null,
                    pitch: null,
                    onGround: onGround
                });
            }

            // Send the final teleport packet
            this.bot._client.write('position', {
                x: goal.x,
                y: goal.y,
                z: goal.z,
                yaw: null,
                pitch: null,
                onGround: onGround
            });
            this.i.bot.entity.position = goal;
        };

        // Normal teleports instead of the Paperclip exploit
        const sendPacket = async () => {
            await this.bot._client.write('position', {
                x: goal.x,
                y: goal.y,
                z: goal.z,
                yaw: null,
                pitch: null,
                onGround: onGround
            });
            this.i.bot.entity.position = goal;
        };

        try {
            if (!canTeleport(this.i, goal)) {
                if (this.log) this.i.logger.error('Cannot teleport');
                return false;
            }

            if (this.log) this.i.logger.info('Teleporting ' + distance.toFixed(2) + 'm... (' + pr + ' packets)');
            forceNormal ? await sendPacket() : await sendPackets();
            if (this.setClientSided) this.bot.entity.position = goal;
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}
