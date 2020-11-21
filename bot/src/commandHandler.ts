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
        let commandParts = this.seperateCommandParts(message.content);

        switch(commandParts.command) {
            case "createparty":
                let instance : CreatePartyCommand = new CreatePartyCommand(message, this.repository);
                instance.execute();
                break;
            case "registerme":
                this.spotifyApi.refreshToken(commandParts.parameters[0], message.author)
                break;
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

