import { Message } from "discord.js";
import { Command } from "../model/commands/command";
import { CreatePartyCommand } from "../model/commands/createPartyCommand"
import { RegisterMeCommand } from "../model/commands/registerMeCommand";
import { Repository } from "../model/data/repository";
import { SpotifyAPI } from "../model/spotifyApi";


export class CommandHandler {
    readonly commandPrefix = "$";
    repository : Repository;
    spotifyApi : SpotifyAPI;


    constructor(repository : Repository, spotifyApi : SpotifyAPI) {
        this.repository = repository;
        this.spotifyApi = spotifyApi;
    }

    handleCommand(message : Message) {
        if (this.isMessageBotCommand(message)) {
            this.handleBotCommand(message);
        }

        if(this.repository.isChannelPartyChannel(message.channel.id)){
            this.handlePartyChannelCommand(message);
            return;
        }
    }

    handlePartyChannelCommand(message: Message) {
        let owner = this.repository.getPartyChannelOwner(message.channel.id);
        let commandParts = this.seperateCommandParts(message.content);
        let urls = commandParts.parameters.filter((value) => this.spotifyApi.isSpotifyURL(value));
        if (urls.length == 0)
            return;

        this.spotifyApi.getTrackURIFromLink(urls[0]).then(trackURI => {
            this.spotifyApi.addToQueue(owner.userId, trackURI);
        });
    }

    handleBotCommand(message : Message) {
        try {
            let commandParts = this.seperateCommandParts(message.content);
    
            let instance : Command;
            switch(commandParts.command) {
                case "createparty":
                    instance = new CreatePartyCommand(message, this.repository);
                    instance.execute();
                    break;
                case "registerme":
                    instance = new RegisterMeCommand(message, this.repository, this.spotifyApi);
                    instance.execute();
                    break;
            }
        } catch (err) {
            console.error(err);
        }
    }

    isMessageBotCommand(message : Message) : boolean {
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

