# Example Addon  
> An example addon for **BrewBot**, demonstrating how to register commands and events.
---

### How to use Commands
### `index.js`
In the main file of your addon you register your commands inside the `initialize` method:
```js
initialize(logger, bot = null) {
    super.initialize(logger, bot);

    this.consoleCommands.register(new ConsoleExampleCommand()); // Register your Chat Commands
    this.chatCommands.register(new ChatExampleCommand()); // Register your Console Commands
}
````

### Chat & Console commands:
In the constructor you define the command name, info how to use it (like ``!name <some needed arg> [some optional arg] - Do things``), aliases and the Permission Level

Permission Levels can be set in ``config/accounts.json``:
- 3: Everybody except banned
- 2: Moderator
- 1: Administrator

The `execute` method is called when the command is executed. 
The parameters are:
- `instance`: The Bot instance (that for example contains the logger and bot object)
- `username`: The username of the person who executed the command
- `args`: An array of arguments passed to the command
```js
// ChatExampleCommand.js
import ChatCommand from "../../../../src/bot/commands/ChatCommand.js";

export default class ChatExampleCommand extends ChatCommand {
    constructor() {
        super("examplecommand", "examplecommand - Do stuff", ["example"], 3); // command name, usage, aliases, permissionLevel
    }

    /* Method that is called when the command is executed */
    async execute(instance, username, args) { // Instance, username of executor, command arguments
        instance.bot.whisper(username, 'Hello, World!');
    }
}
```

Console commands are almost the same:
```js
// ConsoleExampleCommand.js
import ConsoleCommand from "../../../../src/bot/commands/ConsoleCommand.js";
import {botInstances} from "../../../../src/index.js";

export default class ConsoleExampleCommand extends ConsoleCommand {
    constructor() {
        super("examplecommand", "examplecommand - Do stuff", ["example"]); // command name, usage, aliases
    }

    async execute(logger, args, targetUsername) { // Logger, command arguments, target username (if any)
        for (const i of botInstances) {
            if (!targetUsername || i.bot.username === targetUsername) {
                i.logger.info('Hello, World!')
            }
        }
    }
}
```
But in the constructor you don't need to set a permission level.
The `execute` method parameters are also different:
- `logger`: The `[System]` logger instance to log stuff to the console
- `args`: An array of arguments passed to the command
- `targetUsername`: (optional) If specified, only the bot with this username will execute the command. The target username is the Bot specified in `!:TargetUsername someCommand`.

---
### Events:
In the `initialize` method you can also register event listeners:
```js
initialize(logger, bot = null) {
    super.initialize(logger, bot);
    if (this.bot) this.registerEvents();
}

registerEvents() {
    const eventHandlers = initEvents(this.bot);
    this.eventHandlers.push(eventHandlers);
}
```

The `initEvents` function can be defined in a separate file, for example `events/events.js`:
```js
export default function initEvents(i) {
    i.bot.on('spawn', () => {
        i.logger.info('Hello, World!');
    });
}
```
`i` is the Bot instance (logger, bot object etc.). You can now use every Mineflayer event as you would normally do.

---
### Manifest File
The addon manifest file has to be named like the directory of your addon, for example `example-addon.json` for an addon located in `addons/example-addon/`.
```json
{
  "name": "Example Addon",
  "version": "1.0.0",
  "author": "Eglijohn",
  "description": "An example addon for demonstration",
  "entry": "index.js"
}
```
The `entry` specifies the main file of your addon that gets loaded by Brew Bot. The other things should be self-explanatory.

---

### How to use Addons

1. Drop the addon folder inside your `addons/` directory.
2. Start BrewBot — it will auto-detect the addon.
3. The commands and events will be registered.
---