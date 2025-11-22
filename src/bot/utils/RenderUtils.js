/**
 * Draw a line from an Array
 * @param i Instance
 * @param name Line name
 * @param points Points Array
 * @param color Color
 * @param duration Duration in ms
 */
function drawTemporaryLine(i, name, points, color, duration) {
    if (!i.bot.viewer) return
    i.bot.viewer.drawLine(name, points, color);
    setTimeout(() => i.bot.viewer.erase(name), duration);
}


/**
 * Draw a box around a Vec3
 * @param i Instance
 * @param name Line name
 * @param pos Position
 * @param size Size
 * @param color Color
 * @param duration Duration in ms
 */
function drawTemporaryVec3(i, name, pos, size, color, duration) {
    if (!i.bot.viewer) return
    const half = size / 2;

    const c = [
        { x: pos.x - half, y: pos.y - half, z: pos.z - half },
        { x: pos.x + half, y: pos.y - half, z: pos.z - half },
        { x: pos.x + half, y: pos.y + half, z: pos.z - half },
        { x: pos.x - half, y: pos.y + half, z: pos.z - half },
        { x: pos.x - half, y: pos.y - half, z: pos.z + half },
        { x: pos.x + half, y: pos.y - half, z: pos.z + half },
        { x: pos.x + half, y: pos.y + half, z: pos.z + half },
        { x: pos.x - half, y: pos.y + half, z: pos.z + half },
    ];

    const lines = [
        c[0], c[1], c[2], c[3], c[0],
        c[4], c[5], c[6], c[7], c[4],
        c[5], c[1], c[2], c[6], c[7], c[3], c[0], c[4]
    ];


    i.bot.viewer.drawLine(name, lines, color);
    setTimeout(() => i.bot.viewer.erase(name), duration);
}


function drawBlockSelection(i, position) {
    const selectedBlock = [
        { x: position.x, y: position.y + 1.01, z: position.z },
        { x: position.x + 1, y: position.y + 1.01, z: position.z },
        { x: position.x + 1, y: position.y + 1.01, z: position.z + 1 },
        { x: position.x, y: position.y + 1.01, z: position.z + 1 },
        { x: position.x, y: position.y + 1.01, z: position.z }
    ];

    const middleLine = [
        { x: position.x + 0.5, y: position.y + 1.01, z: position.z + 0.5 },
        { x: position.x + 0.5, y: position.y + 2.01, z: position.z + 0.5 }
    ];

    i.bot.viewer.drawLine('selectedBlock', selectedBlock, 0x3296fa);
    i.bot.viewer.drawLine('middleLine', middleLine, 0x3296fa);
}

export { drawTemporaryVec3, drawTemporaryLine, drawBlockSelection };