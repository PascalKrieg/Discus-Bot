import { Message } from "discord.js";
import { EventAction } from "../model/commandFramework/eventAction";
import { Command, HttpHandler } from "../model/commandFramework/interfaces";

import * as fs from "fs"
import * as Logging from "../logging"
import { PluginDependencies } from "../dependencyInjection";
import { Plugin } from "../model/commandFramework/plugin";
import { Router } from "express";
let logger = Logging.buildLogger("pluginLoader");

const pluginList : Plugin[] = []

let commandConstructors: CommandConstructor[] = [];
let eventActionConstructors: EventActionConstructor[] = [];
let httpHandlerConstructors: HttpHandlerConstructor[] = []

export function loadPlugins(pluginFolderPath : string) {
    fs.readdirSync(pluginFolderPath).forEach((pluginName : string) => {
        commandConstructors = [];
        eventActionConstructors = [];
        httpHandlerConstructors = []
        try {
            const pluginImport = require(pluginFolderPath + "/" + pluginName);

            const commandCtors = [...commandConstructors]
            const eventActionCtors = [...eventActionConstructors]
            const httpHandlerCtors = [...httpHandlerConstructors]

            if (pluginImport.getPluginInfo === undefined || pluginImport.getPluginInfo() === undefined) {
                logger.error(`Failed to load plugin ${pluginName}! No plugin info provided.`);
                return;
            }

            if (httpHandlerCtors.length > 1) {
                logger.error(`Failed to load plugin ${pluginName}! Multiple Routers defined in this plugin.`);
                return;
            }

            let handler;
            if (httpHandlerCtors.length === 1) {
                handler = httpHandlerCtors[0]
            }

            let plugin = new Plugin(pluginImport.getPluginInfo(), commandCtors, eventActionCtors, handler)
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
    readonly prototype: EventAction;
}

export type HttpHandlerConstructor = {
    new(dependencies : PluginDependencies): HttpHandler;
    readonly prototype: HttpHandler;
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

export function RegisteredHttpHandler<T extends HttpHandlerConstructor>(ctor: T) {
    httpHandlerConstructors.push(ctor);
    return ctor;
}