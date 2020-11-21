import Discord from "discord.js";
import { CommandHandler } from "./commandHandler"
import { SingleUserRepository } from "./data/singleUserRepository";
import { SpotifyAPI } from "./spotify/spotifyApi";

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`)
});

if (!process.env.SPOTIFY_ID || !process.env.SPOTIFY_SECRET || !process.env.DISCORD_TOKEN) {
    console.error("SPOTIFY_ID, SPOTIFY_SECRET or DISCORD_TOKEN not set.")
    process.exit(-1);
}

const redirectUri = "http://localhost:8000";
let repository = new SingleUserRepository();
let spotifyApi = new SpotifyAPI(repository, process.env.SPOTIFY_ID, process.env.SPOTIFY_SECRET, redirectUri);

let handler = new CommandHandler(repository, spotifyApi);
client.on('message', handler.handleCommand);

client.login(process.env.DISCORD_TOKEN);