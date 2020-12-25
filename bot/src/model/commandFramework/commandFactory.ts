import { Message } from "discord.js";
import { PluginDependencies } from "../../dependencyInjection";
import { Command } from "./interfaces";

/**
 * Interface for a class that creates command instances based on the command string and discord message received.
 */
export interface CommandFactory {
    /**
     * Build a command instance that matches the type of the message provided. Can return undefined, 
     * @param command The command string sent by the user.
     * @param message The discord message object created when receiving the command message.
     * @returns Returns the command instance, if the command issued by the users exists, undefined otherwise.
     */
    build(command : string, message : Message, dependencies : PluginDependencies) : Command|undefined

    /**
     * Reloads commands.
     */
    reload() : void
}