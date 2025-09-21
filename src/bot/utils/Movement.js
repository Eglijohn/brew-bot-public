import {Vec3} from "vec3";
import pkg from 'mineflayer-pathfinder';
import minecraftData from 'minecraft-data';
import {config} from "../../index.js";
import {canTeleport} from "./World.js";

const { Movements, goals } = pkg;

/**
 * Teleport far distances using the LiveOverflow exploit
 * @param instance Bot instance
 * @param goal Vec3 goal
 * @param forceNormal force single packet (max. 10 Blocks)
 * @param onGround onGround value
 * @param log Log the tp
 * @returns {Promise<void|boolean>} Status
 */
async function teleport(instance, goal, forceNormal, onGround = true, log = false) {
    const distance = instance.bot.entity.position.distanceTo(goal);
    const packetsRequired = Math.ceil(distance / 10) - 1;
    if (packetsRequired > 20) {
        instance.logger.error(`Too many packets required: ${packetsRequired}/20`);
        return false;
    }

    const sendPackets = async () => {
        const startPos = instance.bot.entity.position;

        // Spam the packets before teleporting
        for (let i = 0; i < packetsRequired; i++) {
            await instance.bot._client.write('position', {
                x: startPos.x,
                y: startPos.y,
                z: startPos.z,
                yaw: null,
                pitch: null,
                onGround: onGround
            });
        }

        // Send the final teleport packet
        await instance.bot._client.write('position', {
            x: goal.x,
            y: goal.y,
            z: goal.z,
            yaw: null,
            pitch: null,
            onGround: onGround
        });
    };

    // Normal teleports instead of the Paperclip exploit
    const sendPacket = async () => {
        await instance.bot._client.write('position', {
            x: goal.x,
            y: goal.y,
            z: goal.z,
            yaw: null,
            pitch: null,
            onGround: onGround
        });
    };

    try {
        if (!canTeleport(instance, goal)) {
            instance.logger.error('Cannot teleport');
            return false;
        }
        if (log) instance.logger.info('Teleporting ' + distance.toFixed(2) + 'm...');
        forceNormal ? await sendPacket() : await sendPackets();
        instance.bot.entity.position = goal;
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * Function to walk to a block
 * @param instance Instance
 * @param {Vec3} goal Goal Vec3
 * @returns {boolean} Status
 */
function goto(instance, goal) {
    const mcData = minecraftData(instance.bot.version);
    const movements = new Movements(instance.bot, mcData);

    movements.canDig = config.pathfinder.canDig;
    movements.canPlace = config.pathfinder.canPlace;

    try {
        const g = new goals.GoalBlock(goal.x, goal.y, goal.z);
        instance.bot.pathfinder.setMovements(movements);
        instance.bot.pathfinder.setGoal(g);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}


/**
 * Function to follow a player
 * @param instance Instance
 * @param {Object} target Target entity
 * @returns {boolean} Status
 */
function follow(instance, target) {
    const mcData = minecraftData(instance.bot.version);
    const movements = new Movements(instance.bot, mcData);

    movements.canDig = config.pathfinder.canDig;
    movements.canPlace = config.pathfinder.canPlace;

    try {
        const g = new goals.GoalFollow(target?.entity || target, 1);
        instance.bot.pathfinder.setMovements(movements);
        instance.bot.pathfinder.setGoal(g, true);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}


/**
 * Function to stop all pathfinder goals
 * @returns {boolean} Status
 */
function stopGoals(instance) {
    instance.bot.pathfinder.setGoal(null);
    return true;
}

export { teleport, goto, follow, stopGoals, canTeleport };