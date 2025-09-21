# Brew Bot
A Minecraft Bot for the Drunks written in JavaScript with Mineflayer

**Requirements:**
- NodeJS

## Setup
1. Install all packages:
    ```bash
    npm i
    ```
2. Edit ```config/config.json```:
    ```json
   {
        "autoArmor": true,
        "autoEat": true,
        "autoTotem": true,
        "commands": { // Determines from where commands can get executed
            "chat": false,
            "commandline": true,
            "whisper": true
        },
        "console": {
            "sendChat": true, // Send messages in chat from command line
            "theme": {
                "oldTheme": false
            }
        },
        "friends": [],
        "logOnTotemPop": true, // Logoff on totem pop
        "lookAtNearestPlayer": true,
        "packetLogger": {
            "enabled": false,
            "packets": [] // Packets to log
        },
        "pathfinder": {
            "canDig": true,
            "canPlace": true
        },
        "retaliate": { // Attack the entity that attacked you
            "enabled": true,
            "ignoreFriends": true
        },
        "velocity": true, // Anti Knockback
        "noFall": true // No fall damage
   }
   ```
3. Edit ``config/accounts.json``:
   ```json
   [
       {
           "username": "Your Username",
           "auth": "Authentication Method (microsoft, offline)",
           "permissions": [
              {
                  "level": 1,
                  "name": "administrator",
                  "players": [
                      "Players with admin access"
                  ]
              },
              {
                  "level": 2,
                  "name": "moderator",
                  "players": [
                      "Players with mod access"
                  ]
              },
              {
                  "level": 3,
                  "name": "user",
                  "blacklisted": [
                      "Players that are blacklisted from every command"
                  ]
              }
           ]
       }
   ]
    ```
   
## Running the Bot
1. Display all arguments using
    ```bash
   node src/index.js --help
    ```
2. Start it with all required arguments: 
   - Example: I want my bot to join ``simpcraft.com`` as ``Eglijohn_Dev``:
     ```bash
     node src/index.js -h simpcraft.com -u Eglijohn_Dev
     ```
   - Example 2: I want my bot to join my LAN-World on port ``6969`` as ``BrewBot``:
     ```bash
     node src/index.js -p 6969 -u BrewBot
     ```
     
## Using the Bot
- You can see all console commands by typing '!help' in the console
- To see all chat commands, you can message the Bot '!help'

To let the Bot send a message in chat over console, you can just type what you want (without an '!' before, you can disable that in the config: ``console/sendChat: false``) and press enter, or use the !say command.

If you have multiple Bot-Instances, all bots will execute the same command when you enter it in the console. However, you can tell a specific bot to execute a command by using '!:Username command'. Example: '!:Eglijohn_Dev say Hello, World!'

## Addons
- To use an addon, simply drop the folder into ``addons/``
- For developers: there is an example addon in ``addonCollection/``