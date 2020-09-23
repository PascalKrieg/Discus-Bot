import Discord from "discord.js";
import { handleCommand } from "./commands"

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`)
});

client.on('message', handleCommand);

client.login(process.env.DISCORD_TOKEN);