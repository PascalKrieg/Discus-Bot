import { CommandFactory } from "../commandFramework";
import { Repository } from "../data/repository";
import { SpotifyAPI } from "./spotify/spotifyApi";

export interface PluginDependencies {
    commandFactory : CommandFactory;
    repository : Repository;
    spotifyApi : SpotifyAPI;

    clone() : PluginDependencies
} 