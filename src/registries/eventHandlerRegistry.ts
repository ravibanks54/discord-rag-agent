import path from "path";
import fs from "fs";
import {Awaitable, Collection} from "discord.js";

const eventHandlers = new Collection<string, (...args: any) => Awaitable<void>>()

// The following doesn't work because of a Object/Function type mismatch. Should revisit in the future.
const eventHandlersPath = path.join(__dirname, '../events');
const eventHandlerFiles = fs.readdirSync(eventHandlersPath).filter(file => file.endsWith('.js'));

for (const file of eventHandlerFiles) {
    const eventName = file.replace('.js', '');

    const eventHandler = require(path.join(eventHandlersPath, file));
    eventHandlers.set(eventName, eventHandler.default);
}

export default eventHandlers;