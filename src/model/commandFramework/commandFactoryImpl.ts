import "reflect-metadata";
import { Message } from "discord.js";
import { injectable } from "inversify";
import {Command, CommandInfo} from "."
import { PluginDependencies } from "../services/pluginDependencies";
import * as Logging from "../../logging";
import { CommandFactory } from "./commandFactory";
import { CommandConstructor, getPlugins } from "../../controller/pluginLoader";
import { Plugin } from "./plugin";

let logger = Logging.buildLogger("CommandFactoryImpl");

/**
 * Implementation of a command factory that creates command instances based on the command string and discord message received.
 * The list of available commands and the class constructors is taken from the command conctructor registry.
 */
@injectable()
export class CommandFactoryImpl implements CommandFactory {
    readonly commandMap : Map<string, CommandConstructor> = new Map<string, CommandConstructor>()
    readonly commandInfoMap : Map<string, CommandInfo> = new Map<string, CommandInfo>()


    reload() {
        logger.info("Starting to load commands")
        this.registerAllCommands();
    }

    build(command : string, message : Message, dependencies : PluginDependencies) : Command|undefined {
        let lowerCaseCommand = command.toLowerCase();
        
        let ctor = this.commandMap.get(lowerCaseCommand);
        if (ctor) {
            let command = new ctor(message, dependencies.clone());
            return command;
        } else {
            return undefined;
        }
    }

    private registerAllCommands() {
        let plugins = getPlugins();
        plugins.forEach((plugin : Plugin) => {
            let commandConstructors = plugin.getCommandConstructors()
            for (let i = 0; i < commandConstructors.length; i++) {
                let ctor = commandConstructors[i]
                let commandInfo = ctor.prototype.getCommandInfo()
                this.registerCommand(plugin, commandInfo, ctor)
            }
        })
    }

    private registerCommand(plugin : Plugin, commandInfo : CommandInfo, ctor : CommandConstructor) {
        let conflicts = this.getConflictingCommands(commandInfo);
            
        if (conflicts.length > 0) {
            conflicts.forEach(conflict => {
                logger.error(`ERROR: COMMAND COULD NOT BE ADDED: Command/alias ${conflict} of Command ${commandInfo.command} (aliases: ${commandInfo.aliases.toString()}) is conflicting with command ${conflict.conflictingInfo?.command} (aliase: ${conflict.conflictingInfo?.aliases.toString()})
                            Please make sure all commands and aliases are unique!`);
            })
            return;
        }

        this.commandMap.set(commandInfo.command.toLowerCase(), ctor);
        this.commandInfoMap.set(commandInfo.command.toLowerCase(), commandInfo);

        commandInfo.aliases.forEach(alias => {
            this.commandMap.set(alias.toLowerCase(), ctor);
            this.commandInfoMap.set(alias.toLowerCase(), commandInfo);
        })

        logger.verbose(`(${plugin.getInfo().name}) Registered command ${commandInfo.command} with aliases ${commandInfo.aliases.toString()}`);
    }

    private getConflictingCommands(commandInfo : CommandInfo) {
        let conflicts = []

        let commandAliases = commandInfo.aliases;
        let command = commandInfo.command;

        if (this.commandMap.has(command.toLowerCase())) {
            conflicts.push({
                command : command,
                conflictingInfo : this.commandInfoMap.get(command.toLowerCase())
            })
        }

        for (let aliasIndex in commandAliases) {
            let alias = commandAliases[aliasIndex]
            if (this.commandMap.has(alias.toLowerCase())) {
                conflicts.push({
                    command : alias,
                    conflictingInfo : this.commandInfoMap.get(alias.toLowerCase())
                })
            }
        }
        return conflicts;
    }
}
