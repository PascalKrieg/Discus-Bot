import { Message } from "discord.js";
import { Repository } from "../model/data/repository";
import { SpotifyAPI } from "../model/spotify/spotifyApi";
import { getTrackURIFromLink,  isSpotifyURL} from "../model/spotify/spotifyLinkUtil"

import * as Logging  from '../logging';
import { CommandFactory } from "../commandFramework";

export class CommandHandler {
    readonly commandPrefix = "$";
    readonly ignorePrefix = "//"
    commandFactory : CommandFactory;
    repository : Repository;
    spotifyApi : SpotifyAPI;
    logger = Logging.buildLogger("commandHandler");

    constructor(commandFactory : CommandFactory, repository : Repository, spotifyApi : SpotifyAPI) {
        this.commandFactory = commandFactory;
        this.repository = repository;
        this.spotifyApi = spotifyApi;
    }

    handleCommand = async (message : Message) => {
        if (message.content.startsWith(this.ignorePrefix)) {
            return;
        }

        this.logger.verbose("Read message in channel " + message.channel.id);
        try {
            if(await this.repository.isChannelPartyChannel(message.channel.id)){
                this.logger.verbose("Handling party channel message: " + message.content);
                this.handlePartyChannelCommand(message);
            }
            if (this.isMessageBotCommand(message)) {
                this.handleBotCommand(message);
                
            }
        } catch(err) {
            this.logger.error(err);
        }
    }

    isMessageBotCommand(message : Message) : boolean{
        return message.channel.type == "text" && message.content.slice(0, this.commandPrefix.length) == this.commandPrefix;
    }

    async handlePartyChannelCommand(message: Message) {
        try {
            let owner = await this.repository.getPartyChannelOwner(message.channel.id);

            let urls = message.content.split(" ").filter((value) => isSpotifyURL(value));
            
            if (urls.length == 0) {
                this.logger.verbose("No URLs found in party channel message");
                return
            }

            let trackURI = await getTrackURIFromLink(urls[0]);
            this.logger.debug(`trackURI ${trackURI} extracted`);
            this.logger.debug("Attempting to use token with expiration time " + owner.tokenPair.expirationTime)
            await this.spotifyApi.addToQueue(owner.tokenPair, trackURI);
        } catch(err) {
            this.logger.error(err)
            message.channel.send("// Failed to add song. " + err.message);
            throw err;
        }
    }

    handleBotCommand(message : Message) {
        try {
            let commandParts = this.seperateCommandParts(message.content);
            this.logger.debug(message.author.tag + " typed command: " + commandParts.command)

            this.commandFactory.build(commandParts.command, message)?.execute()

        } catch (err) {
            this.logger.error(err)
            throw err;
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
