import { DIContainer } from "./dependencyInjection";
import { TYPES } from "./dependencyInjection";
import { Repository } from "./model/data/repository";
import { SpotifyAPI } from "./model/pluginDependencies/spotify/spotifyApi";
import * as server from "./controller/httpController"
import * as path from "path";

import * as Logging from "./logging"
import { DiscordWrapper } from "./controller/discordWrapper";
let logger = Logging.buildLogger("index");

checkEnvironmentVariables();

let repository = DIContainer.get<Repository>(TYPES.Repository);
let spotifyApi = DIContainer.get<SpotifyAPI>(TYPES.SpotifyAPI);


let discord = DIContainer.get<DiscordWrapper>(TYPES.DiscordWrapper);
let pluginPath = path.join(__dirname, "/model/plugins");
discord.loadPlugins(pluginPath)
discord.startClient();

startHttpServer()


function checkEnvironmentVariables() {
    if (!process.env.DISCORD_TOKEN) {
        console.error("DISCORD_TOKEN not set.");
        process.exit(-1);
    }
}

function startHttpServer() {
    server.setDependencies(repository, spotifyApi);
    server.startListening();
}