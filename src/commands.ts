import { Message } from "discord.js";

import { PartyCommandInstance } from "./partyCommandInstance"

const commandPrefix = "$";

export function handleCommand(message : Message) {
    if (!isMessageBotCommand(message))
        return;

    let commandParts = seperateCommandParts(message.content);

    switch(commandParts.command) {
        case "createparty":
            let instance : PartyCommandInstance = new PartyCommandInstance(message);
            instance.execute();
            break;
    }

    seperateCommandParts(message.content);
}


function isMessageBotCommand(message : Message) {
    return message.channel.type == "text" || message.content.slice(0, commandPrefix.length - 1) == commandPrefix;
}

function seperateCommandParts(fullComandString : String) {
    let parts = fullComandString.toLowerCase().split(" ");
    let command = parts[0].slice(commandPrefix.length, parts[0].length);
    let parameters = parts.slice(1, parts.length);

    let data = {command : command, parameters : parameters};
    return data 
}