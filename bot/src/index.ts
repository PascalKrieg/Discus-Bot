import Discord from "discord.js";
import { DIContainer } from "./dependencyInjection/inversify.config";
import { TYPES } from "./dependencyInjection/types";
import { Repository } from "./model/data/repository";

import { CommandHandler } from "./controller/commandHandler";
import { SpotifyAPI } from "./model/spotifyApi";

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`)
});

if (!process.env.SPOTIFY_ID || !process.env.SPOTIFY_SECRET || !process.env.DISCORD_TOKEN) {
    console.error("SPOTIFY_ID, SPOTIFY_SECRET or DISCORD_TOKEN not set.")
    process.exit(-1);
}

if (!process.env.REDIRECT_URI) {
    console.error("REDIRECT_URI not set.")
    process.exit(-1);
}

let repository = DIContainer.get<Repository>(TYPES.Repository);
let spotifyApi = new SpotifyAPI(repository, process.env.SPOTIFY_ID, process.env.SPOTIFY_SECRET, process.env.REDIRECT_URI);

let handler = new CommandHandler(repository, spotifyApi);
client.on('message', handler.handleCommand);

client.login(process.env.DISCORD_TOKEN);