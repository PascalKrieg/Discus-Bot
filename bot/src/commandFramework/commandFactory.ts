import { Message } from "discord.js";
import { Command } from "./interfaces";

export interface CommandFactory {
    build(command : string, message : Message) : Command|undefined
}