import { Message, Shard } from "discord.js";
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


        if(this.repository.isChannelPartyChannel(message.channel.id)){
            this.handlePartyChannelCommand(message);
            return;
        }    

        let commandParts = this.seperateCommandParts(message.content);

        switch(commandParts.command) {
            case "createparty":
                let instance : CreatePartyCommand = new CreatePartyCommand(message);
                instance.execute();
                break;
        }
    }

    handlePartyChannelCommand(message: Message){
        
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


    
    extractSpotifyURI(spotifyLink: string): string {
        let searchString : string = "spotify:track:";
        let spotifyURI : string = spotifyLink.slice(spotifyLink.indexOf(searchString) + searchString.length);

        return spotifyURI;

    }

    //gets Spotify URI from a shared Link
    extractSpotifyURIShared(sharedLink :string): string{

        let spotifyURI : string = sharedLink.slice(sharedLink.lastIndexOf("/") + 1 , sharedLink.indexOf("?"));

        return  spotifyURI;
    }

    //returns true if a sharedLink contains the spotify.com domain
    checkForSpotifyURL(sharedLink : string): boolean{

        let spotifyDomain : string = "spotify.com";

        return sharedLink.includes(spotifyDomain);
    }

    
}

