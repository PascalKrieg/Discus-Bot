import { Message } from "discord.js";
import { CreatePartyCommand } from "./createPartyCommand"
import { Repository } from "./data/repository";
import { SpotifyAPI } from "./spotify/spotifyApi";


export class CommandHandler {

    readonly commandPrefix = "$";
    repository : Repository;
    spotifyApi : SpotifyAPI;


    constructor(repository : Repository, spotifyApi : SpotifyAPI) {
        this.repository = repository;
        this.spotifyApi = spotifyApi;
    }

    handleCommand(message : Message) {
        if (!this.isMessageBotCommand(message))
            return;
    
        let commandParts = this.seperateCommandParts(message.content);
    
        switch(commandParts.command) {
            case "createparty":
                let instance : CreatePartyCommand = new CreatePartyCommand(message);
                instance.execute();
                break;
        }
    }
    

    isMessageBotCommand(message : Message) {
        return message.channel.type == "text" && message.content.slice(0, this.commandPrefix.length - 1) == this.commandPrefix;
    }

    seperateCommandParts(fullComandString : String) {
        let parts = fullComandString.toLowerCase().split(" ");
        let command = parts[0].slice(this.commandPrefix.length, parts[0].length);
        let parameters = parts.slice(1, parts.length);
    
        let data = {command : command, parameters : parameters};
        return data 
    }
}

