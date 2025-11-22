import {Vec3} from "vec3";
import pkg from 'mineflayer-pathfinder';
import minecraftData from 'minecraft-data';
import {config} from "../../index.js";
import TeleportTask from "./TeleportTask.js";
import {canTeleport} from "./World.js";

const { Movements, goals } = pkg;

/**
 * Center on a block
 * @param instance instance
 */
async function center(instance) {
    const pos = instance.bot.entity.position;
    const t = new TeleportTask(instance, true, true);
    let centeredPos = new Vec3(Math.floor(pos.x) + 0.5, pos.y, Math.floor(pos.z) + 0.5);
    while (!canTeleport(instance, centeredPos)) {
        centeredPos = centeredPos.offset(0, 0.1, 0);
    }
    await t.fastTeleport(centeredPos);
}

/**
 * Function to walk to a block
 * @param instance Instance
 * @param {Vec3} goal Goal Vec3
 * @param range Range to goal
 * @returns {boolean} Status
 */
function goto(instance, goal, range = 0) {
    const mcData = minecraftData(instance.bot.version);
    const movements = new Movements(instance.bot, mcData);

    movements.canDig = config.pathfinder.canDig;
    movements.canPlace = config.pathfinder.canPlace;

    try {
        let g;
        if (range > 0) {
            g = new goals.GoalNear(goal.x, goal.y, goal.z, range);
        } else {
            g = new goals.GoalBlock(goal.x, goal.y, goal.z);
        }
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

export { goto, follow, stopGoals, center };