import "reflect-metadata";
import { inject, injectable } from "inversify";
import { CommandFactory } from "../model/commandFramework";
import { Repository } from "../model/data/repository";
import { SpotifyAPI } from "../model/services/spotify/spotifyApi";
import { PluginDependencies } from "./pluginDependencies";
import { TYPES } from "./types";

@injectable()
export class BasicPluginDependencies implements PluginDependencies {
    commandFactory : CommandFactory;
    repository: Repository;
    spotifyApi: SpotifyAPI;
    
    constructor(@inject(TYPES.CommandFactory) commandFactory : CommandFactory, 
                @inject(TYPES.Repository) repository : Repository, 
                @inject(TYPES.SpotifyAPI) spotifyApi : SpotifyAPI) {
        this.commandFactory = commandFactory;
        this.repository = repository;
        this.spotifyApi = spotifyApi;
    }
    clone(): PluginDependencies {
        return new BasicPluginDependencies(this.commandFactory, this.repository, this.spotifyApi);
    }
}