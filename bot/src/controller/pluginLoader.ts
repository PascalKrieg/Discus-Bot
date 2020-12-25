import { Message } from "discord.js";
import { EventAction } from "../model/commandFramework/eventAction";
import { Command } from "../model/commandFramework/interfaces";

import * as fs from "fs"
import * as Logging from "../logging"
import { PluginDependencies } from "../dependencyInjection";
import { Plugin } from "../model/commandFramework/plugin";
import { Router } from "express";
let logger = Logging.buildLogger("pluginLoader");

const pluginList : Plugin[] = []

let commandConstructors: CommandConstructor[] = [];
let eventActionConstructors: EventActionConstructor[] = [];

export function loadPlugins(pluginFolderPath : string) {
    fs.readdirSync(pluginFolderPath).forEach((pluginName : string) => {
        commandConstructors = [];
        eventActionConstructors = [];
        try {
            const pluginImport = require(pluginFolderPath + "/" + pluginName);

            const commandCtors = [...commandConstructors]
            const eventActionCtors = [...eventActionConstructors]
            let router : Router|undefined = undefined;

            if (pluginImport.getPluginInfo === undefined || pluginImport.getPluginInfo() === undefined) {
                logger.error(`Failed to load plugin ${pluginName}! No plugin info provided.`);
                return;
            }

            if (pluginImport.getExpressRouter !== undefined && pluginImport.getExpressRouter() !== undefined) {
                router = pluginImport.getExpressRouter();
            }
            

            let plugin = new Plugin(pluginImport.getPluginInfo(), commandCtors, eventActionCtors, router)
            pluginList.push(plugin);
            
        } catch {
            logger.error(`Failed to load plugin ${pluginName}!`);
        }
    });
}

export function getPlugins() {
    return pluginList;
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