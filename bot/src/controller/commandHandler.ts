import { Message } from "discord.js";
import { Command } from "../model/commands/command";
import { CreatePartyCommand } from "../model/commands/createPartyCommand"
import { RegisterMeCommand } from "../model/commands/registerMeCommand";
import { Repository } from "../model/data/repository";
import { SpotifyAPI } from "../model/spotifyApi";
import { getTrackURIFromLink,  isSpotifyURL} from "../model/spotifyLinkUtil"

import * as Logging  from '../logging';

export class CommandHandler {
    readonly commandPrefix = "$";
    repository : Repository;
    spotifyApi : SpotifyAPI;
    logger = Logging.buildLogger("httpsController");

    constructor(repository : Repository, spotifyApi : SpotifyAPI) {
        this.repository = repository;
        this.spotifyApi = spotifyApi;
    }

    handleCommand = async (message : Message) => {
        try {
            if (this.isMessageBotCommand(message)) {
                this.handleBotCommand(message);
                if(await this.repository.isChannelPartyChannel(message.channel.id)){
                    this.handlePartyChannelCommand(message);
                }
            }
        } catch(err) {
            this.logger.error(err);
        }
    }

    isMessageBotCommand(message : Message) : boolean{
        return message.channel.type == "text" && message.content.slice(0, this.commandPrefix.length) == this.commandPrefix;
    }

    async handlePartyChannelCommand(message: Message) {
        let owner = await this.repository.getPartyChannelOwner(message.channel.id);
        let commandParts = this.seperateCommandParts(message.content);
        let urls = commandParts.parameters.filter((value) => isSpotifyURL(value));
        if (urls.length == 0)
            return;

        getTrackURIFromLink(urls[0]).then(trackURI => {
            this.spotifyApi.addToQueue(owner.tokenPair, trackURI);
        });
    }

    handleBotCommand(message : Message) {
        try {
            let commandParts = this.seperateCommandParts(message.content);
            this.logger.debug(message.author.tag + " typed command: " + commandParts.command)
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
                case "testdb":
                    this.repository.getPartyChannelIds();
                    break;
            }
        } catch (err) {
            console.error(err);
        }
    }

    seperateCommandParts(fullComandString : String) {
        let parts = fullComandString.toLowerCase().split(" ");
        let command = parts[0].slice(this.commandPrefix.length, parts[0].length);
        let parameters = parts.slice(1, parts.length);

        let data = {command : command, parameters : parameters};
        return data
    }
    
}

