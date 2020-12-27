import { Container, interfaces } from "inversify"
import { TYPES } from "./types"

import { Repository } from "../model/data/repository"
import { RepositoryImpl } from "../model/data/repositoryImpl"
import { CommandFactory, CommandFactoryImpl } from "../model/commandFramework"
import { SpotifyAPI } from "../model/services/spotify/spotifyApi"
import { SpotifyAPIImpl } from "../model/services/spotify/spotifyApiImpl"
import { PluginDependencies } from "../model/services/pluginDependencies"
import { BasicPluginDependencies } from "../model/services/basicPluginDependencies"
import { DiscordWrapper } from "../controller/discordWrapper"
import { DiscordWrapperImpl } from "../controller/discordWrapperImpl"
import { HttpController } from "../controller/httpController"
import { HttpControllerImpl } from "../controller/httpControllerImpl"

const DIContainer = new Container();

DIContainer.bind<Repository>(TYPES.Repository).to(RepositoryImpl);
DIContainer.bind<SpotifyAPI>(TYPES.SpotifyAPI).toDynamicValue((context : interfaces.Context) => {
    if (process.env.SPOTIFY_ID && process.env.SPOTIFY_SECRET && process.env.REDIRECT_URI) {
        return new SpotifyAPIImpl(process.env.SPOTIFY_ID, process.env.SPOTIFY_SECRET, process.env.REDIRECT_URI, context.container.get(TYPES.Repository));
    } else {
        throw new Error();
    }
})
DIContainer.bind<CommandFactory>(TYPES.CommandFactory).to(CommandFactoryImpl).inSingletonScope();
DIContainer.bind<PluginDependencies>(TYPES.PluginDependencies).to(BasicPluginDependencies);
DIContainer.bind<DiscordWrapper>(TYPES.DiscordWrapper).to(DiscordWrapperImpl);
DIContainer.bind<HttpController>(TYPES.HttpController).to(HttpControllerImpl);

export { DIContainer }