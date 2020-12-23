import { Message } from "discord.js";
import { RegisteredCommand } from "../../../commandFramework";
import { PluginDependencies } from "../../../dependencyInjection";

@RegisteredCommand
export class PingCommand {

    message : Message;

    constructor(message : Message, dependencies : PluginDependencies) {
        this.message = message;
    }

    getCommandInfo() {
        return {
            command : "ping",
            aliases : [],
            helpText : ""
        }
    }

    async execute() {
        this.message.channel.send("Pong!")
    }
}