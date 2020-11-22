import { Message } from "discord.js";
import { Repository } from "../data/repository";
import { SpotifyAPI } from "../spotifyApi";
import { Command } from "./command";


export class RegisterMeCommand implements Command {
    message : Message;
    repository : Repository;
    spotifyAPI : SpotifyAPI;

    constructor(message : Message, repository : Repository, spotifyApi : SpotifyAPI) {
        this.message = message;
        this.repository = repository;
        this.spotifyAPI = spotifyApi;
    }

    execute(): void {
        if (this.repository.isUserRegistered(this.message.author.id)) {
            
        }
        let state = this.produceState();
        let url = this.spotifyAPI.getRegisterUrl(state);
        this.repository.addCodeRequest(this.message.author.id, state);
        this.message.author.dmChannel?.send("Click here to register: " + url);
    }

    private produceState() : string {
        let now = new Date();
        let state = encodeURIComponent(this.message.author.tag + now.toUTCString());
        return state;
    }
}