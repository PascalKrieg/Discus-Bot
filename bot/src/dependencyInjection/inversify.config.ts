import "reflect-metadata"
import { Container, interfaces } from "inversify"
import { TYPES } from "./types"

import { Repository } from "../model/data/repository"
import { RepositoryImpl } from "../model/data/repositoryImpl"
import { CommandFactory, CommandFactoryImpl } from "../commandFramework"
import { SpotifyAPI } from "../model/spotify/spotifyApi"
import { SpotifyAPIImpl } from "../model/spotify/spotifyApiImpl"

const DIContainer = new Container();
DIContainer.bind<Repository>(TYPES.Repository).to(RepositoryImpl);
DIContainer.bind<SpotifyAPI>(TYPES.SpotifyAPI).toDynamicValue((context : interfaces.Context) => {
    if (process.env.SPOTIFY_ID && process.env.SPOTIFY_SECRET && process.env.REDIRECT_URI) {
        return new SpotifyAPIImpl(process.env.SPOTIFY_ID, process.env.SPOTIFY_SECRET, process.env.REDIRECT_URI, context.container.get(TYPES.Repository));
    } else {
        throw new Error();
    }
    
})
DIContainer.bind<CommandFactory>(TYPES.CommandFactory).toDynamicValue((context : interfaces.Context) => {
    return new CommandFactoryImpl(context.container.get(TYPES.Repository), context.container.get(TYPES.SpotifyAPI));
})

export { DIContainer }