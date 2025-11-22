import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const config = await JSON.parse(readFileSync(join(__dirname, '../../../', 'config', 'config.json'), 'utf8'));

const PRIMARY = config.console.theme.oldTheme ? '#fab400' : '#4084f9';
const PRIMARY_DARK = config.console.theme.oldTheme ? '#e1a000' : '#b28bd7';
const PRIMARY_LIGHT = config.console.theme.oldTheme ? '#ffcd65' : '#8adbe5';
const WHITE = config.console.theme.oldTheme ? '#fff6f0' : '#abbecc';
const GRAY = config.console.theme.oldTheme ? '#767676' : '#6f7488';
function PLAYER(username) {
    if (!config.friends.includes(username)) {
        return PRIMARY_LIGHT;
    } else {
        return PRIMARY;
    }
}

export { PRIMARY, GRAY, WHITE, PRIMARY_DARK, PRIMARY_LIGHT, PLAYER };