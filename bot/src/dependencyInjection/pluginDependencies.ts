import { CommandFactory } from "../model/commandFramework";
import { Repository } from "../model/data/repository";
import { SpotifyAPI } from "../model/pluginDependencies/spotify/spotifyApi";

export interface PluginDependencies {
    commandFactory : CommandFactory;
    repository : Repository;
    spotifyApi : SpotifyAPI;

    clone() : PluginDependencies
} 