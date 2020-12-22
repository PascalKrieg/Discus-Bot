import { Message } from "discord.js";
import { EventAction } from "./eventAction";
import { Command } from "./interfaces";

import * as Logging from "../logging"
import { PluginDependencies } from "../dependencyInjection";
let logger = Logging.buildLogger("pluginLoader");

const commandConstructors: CommandConstructor[] = [];
const eventActionConstructors: EventActionConstructor[] = [];

export function getCommandConstructors() {
    return commandConstructors;
}

export function getEventActionConstructors() {
    return eventActionConstructors;
}

export type CommandConstructor = {
    new(message : Message, pluginDependencies : PluginDependencies): Command;
    readonly prototype: Command;
}

export type EventActionConstructor = {
    new(dependencies : PluginDependencies): EventAction;
    readonly prototype: EventAction
}

/**
 * Annotates a class as command to be loaded at runtime. The class must implement the Command interface and must provide a fitting constructer.
 * @param ctor The constructor of the annotated class.
 */
export function RegisteredCommand<T extends CommandConstructor>(ctor: T) {
    commandConstructors.push(ctor);
    return ctor;
}

export function RegisteredEventAction<T extends EventActionConstructor>(ctor: T) {
    eventActionConstructors.push(ctor);
    return ctor;
}