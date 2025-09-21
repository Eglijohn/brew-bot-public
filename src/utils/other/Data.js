import * as fs from "node:fs";

/**
 * Fetch account details from accounts.json by username.
 * @param username Username of the account to fetch
 * @returns {Promise<Object|boolean>} Account object or false if not found/error
 */
async function getAccount(username) {
    try {
        const data = await fs.promises.readFile('config/accounts.json', 'utf8');
        const accounts = JSON.parse(data);
        
        if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
            return false;
        }
        
        const account = accounts.find(acc => acc.username === username);
        if (!account) {
            return false;
        }
        
        return account;
    } catch (error) {
        console.error('Error reading accounts.json:', error);
        return false;
    }
}


/**
 * Get the leader bot's username
 * @returns {Promise<*|boolean>} Status
 */
async function getLeader() {
    try {
        const data = await fs.promises.readFile('config/accounts.json', 'utf8');
        const accounts = JSON.parse(data);

        if (!accounts || accounts.length === 0) {
            return false;
        }

        const leader = accounts.find(acc => acc.leader === true);
        if (!leader) return false;
        return leader.username;
    } catch (error)  {
        return false;
    }
}


/**
 * Check if a user has the required permission level for an account.
 *
 * Level 1: Admin - Full access
 * Level 2: Moderator - Standard access
 * Level 3: Users - Basic access
 * @param username Username to check
 * @param accountName Account name to check against
 * @param requiredLevel Required permission level (1, 2, or 3)
 * @param accountsData The accounts data array
 * @returns {boolean}
 */
async function hasPermissions(username, accountName, requiredLevel) {
    const account = await getAccount(accountName);
    if (!account) return false;

    const usersGroup = account.permissions.find(perm => perm.level === 3);
    if (usersGroup && usersGroup.blacklisted && usersGroup.blacklisted.includes(username)) {
        return false;
    }

    let userLevel = null;

    for (const permission of account.permissions) {
        if (permission.players && permission.players.includes(username)) {
            userLevel = permission.level;
            break;
        }
    }

    if (userLevel === null) {
        userLevel = 3;
    }

    return userLevel <= requiredLevel;
}


/**
 * Get the permission level of a user for a specific account.
 * @param username Username to check
 * @param accountName Account name to check against  
 * @returns {Promise<number|null>} Permission level (1, 2, or 3) or null if not found
 */
async function getPermissionLevel(username, accountName) {
    const account = await getAccount(accountName);
    
    if (!account || !account.permissions || !Array.isArray(account.permissions)) {
        return null;
    }
    
    for (const permission of account.permissions) {
        if (permission.blacklisted && Array.isArray(permission.blacklisted) && permission.blacklisted.includes(username)) {
            return 4; 
        }
    }
    
    let userLevel = null;
    
    for (const permission of account.permissions) {
        if (permission.players && Array.isArray(permission.players) && permission.players.includes(username)) {
            if (userLevel === null || permission.level < userLevel) {
                userLevel = permission.level;
            }
        }
    }
    
    return userLevel !== null ? userLevel : 3;
}

/**
 * Determines if the username is the targeted bot (for the !:username cmd prefix)
 * @param args The command args
 * @param username The username to check
 * @returns {boolean} Status
 */
function isCommandTarget(args, username) {
    if (args[0] && args[0].startsWith('!:')) {
        const targetUsername = args[0].substring(2); // Remove !: prefix
        return targetUsername === username;
    }

    return true;
}

export { hasPermissions, getPermissionLevel, getAccount, getLeader, isCommandTarget };