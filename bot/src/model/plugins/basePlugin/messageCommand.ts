import { Message } from "discord.js";
import { EventActions, RegisteredEventAction } from "../../../commandFramework";

@RegisteredEventAction
export class MessageCommandAction extends EventActions.MessageAction {
    readonly commandPrefix = "$";
    readonly ignorePrefix = "//"

    action(message : Message): void {
        this.logger.info("Received message event")
        if (!message)
            return;

        this.logger.info(JSON.stringify(message))
        if (message.content.startsWith(this.ignorePrefix)) {
            return;
        }

        if (this.isMessageBotCommand(message)) {
            this.handleBotCommand(message);
        }
    }

    private isMessageBotCommand(message : Message) : boolean{
        return message.channel.type == "text" && message.content.slice(0, this.commandPrefix.length) == this.commandPrefix;
    }
    
    private handleBotCommand(message : Message) {
        try {
            let commandParts = this.seperateCommandParts(message.content);
            this.logger.debug(message.author.tag + " typed command: " + commandParts.command)

            this.dependencies.commandFactory.build(commandParts.command, message, this.dependencies)?.execute()

        } catch (err) {
            this.logger.error(err)
            throw err;
        }
    }

    private seperateCommandParts(fullComandString : String) {
        let parts = fullComandString.toLowerCase().split(" ");
        let command = parts[0].slice(this.commandPrefix.length, parts[0].length);
        let parameters = parts.slice(1, parts.length);

        let data = {command : command, parameters : parameters};
        return data
    }
}