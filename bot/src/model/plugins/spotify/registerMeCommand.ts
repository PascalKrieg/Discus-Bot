import { Message } from "discord.js";
import { Repository } from "../../data/repository";
import { SpotifyAPI } from "../../pluginDependencies/spotify/spotifyApi";
import { CommandInfo, RegisteredCommand } from "../../../commandFramework";
import * as crypto from "crypto";
import { PluginDependencies } from "../../../dependencyInjection";

@RegisteredCommand
export class RegisterMeCommand {
    message : Message;
    repository : Repository;
    spotifyAPI : SpotifyAPI;

    constructor(message : Message, dependencies : PluginDependencies) {
        this.message = message;
        this.repository = dependencies.repository;
        this.spotifyAPI = dependencies.spotifyApi;
    }

    getCommandInfo(): CommandInfo {
        return {
            command : "registerMe",
            aliases : [],
            helpText : ""
        }
    }

    async execute() {
        let state = this.produceState();
        let url = this.spotifyAPI.getRegisterUrl(state);
        if (await this.repository.isUserPresent(this.message.author.id) === false) {
            await this.repository.addUserAndCodeRequest(this.message.author, state);
        } else {
            await this.repository.addCodeRequest(this.message.author.id, state).catch(err => console.log("error 2"));
        }
        this.message.author.send("Click here to register: " + url);
    }

    private produceState() : string {
        let state = crypto.randomBytes(8).toString('hex');
        return state;
    }
}