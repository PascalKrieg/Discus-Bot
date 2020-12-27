import { DIContainer, TYPES } from "./dependencyInjection";
import * as server from "./controller/httpController"
import * as path from "path";

import { DiscordWrapper } from "./controller/discordWrapper";
import { CommandFactory, loadPlugins } from "./model/commandFramework";

import * as Logging from "./logging"
let logger = Logging.buildLogger("index");

checkEnvironmentVariables();

let pluginPath = path.join(__dirname, "/model/plugins");
loadPlugins(pluginPath)

let discord = DIContainer.get<DiscordWrapper>(TYPES.DiscordWrapper);
let httpController = DIContainer.get<server.HttpController>(TYPES.HttpController);

let commandFactory = DIContainer.get<CommandFactory>(TYPES.CommandFactory);
commandFactory.reload();

discord.startClient();

httpController.loadFromPlugins();
httpController.startListening(9897);

function checkEnvironmentVariables() {
    if (!process.env.DISCORD_TOKEN) {
        console.error("DISCORD_TOKEN not set.");
        process.exit(-1);
    }
}
