import Discord from "discord.js";
import { DIContainer, TYPES } from "./dependencyInjection";
import { Repository } from "./model/data/repository";
import { CommandHandler } from "./controller/commandHandler";
import { SpotifyAPI } from "./model/spotify/spotifyApi";
import { CommandFactory } from "./commandFramework";
import * as server from "./controller/httpController"
import * as fs from "fs";
import * as path from "path";

import * as Logging from "./logging"
let logger = Logging.buildLogger("index");

checkEnvironmentVariables();
importCommands();

let repository = DIContainer.get<Repository>(TYPES.Repository);
let spotifyApi = DIContainer.get<SpotifyAPI>(TYPES.SpotifyAPI);
let commandFactory = DIContainer.get<CommandFactory>(TYPES.CommandFactory);

startDiscordClient();
startHttpServer()

function startDiscordClient() {
    let handler = new CommandHandler(commandFactory, repository, spotifyApi);
    const client = new Discord.Client();
    client.on('ready', () => {
        logger.info(`Logged in as ${client.user?.tag}`);
    });
    client.on('message', handler.handleCommand);
    client.login(process.env.DISCORD_TOKEN);
}

function checkEnvironmentVariables() {
    if (!process.env.SPOTIFY_ID || !process.env.SPOTIFY_SECRET || !process.env.DISCORD_TOKEN) {
        console.error("SPOTIFY_ID, SPOTIFY_SECRET or DISCORD_TOKEN not set.");
        process.exit(-1);
    }

    if (!process.env.REDIRECT_URI) {
        console.error("REDIRECT_URI not set.");
        process.exit(-1);
    }
}

function importCommands() {
    var normalizedPath = path.join(__dirname, "/model/registeredCommands");
    fs.readdirSync(normalizedPath).forEach((file : string) =>
        require("./model/registeredCommands/" + file)
    );
}

function startHttpServer() {
    server.setDependencies(repository, spotifyApi);
    server.startListening();
}