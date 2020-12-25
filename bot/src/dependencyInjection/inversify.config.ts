import "reflect-metadata"
import { Container, interfaces } from "inversify"
import { TYPES } from "./types"

import { Repository } from "../model/data/repository"
import { RepositoryImpl } from "../model/data/repositoryImpl"
import { CommandFactory, CommandFactoryImpl } from "../model/commandFramework"
import { SpotifyAPI } from "../model/pluginDependencies/spotify/spotifyApi"
import { SpotifyAPIImpl } from "../model/pluginDependencies/spotify/spotifyApiImpl"
import { PluginDependencies } from "./pluginDependencies"
import { BasicPluginDependencies } from "./basicPluginDependencies"
import { DiscordWrapper } from "../controller/discordWrapper"
import { DiscordWrapperImpl } from "../controller/discordWrapperImpl"

const DIContainer = new Container();

DIContainer.bind<Repository>(TYPES.Repository).to(RepositoryImpl);
DIContainer.bind<SpotifyAPI>(TYPES.SpotifyAPI).toDynamicValue((context : interfaces.Context) => {
    if (process.env.SPOTIFY_ID && process.env.SPOTIFY_SECRET && process.env.REDIRECT_URI) {
        return new SpotifyAPIImpl(process.env.SPOTIFY_ID, process.env.SPOTIFY_SECRET, process.env.REDIRECT_URI, context.container.get(TYPES.Repository));
    } else {
        throw new Error();
    }
})
DIContainer.bind<CommandFactory>(TYPES.CommandFactory).to(CommandFactoryImpl)
DIContainer.bind<PluginDependencies>(TYPES.PluginDependencies).to(BasicPluginDependencies)
DIContainer.bind<DiscordWrapper>(TYPES.DiscordWrapper).to(DiscordWrapperImpl);

export { DIContainer }