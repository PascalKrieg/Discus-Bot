import "reflect-metadata";
import * as fs from "fs"
import * as Discord from "discord.js"
import * as Logging from "../logging"
import { DiscordWrapper } from "./discordWrapper";
import { PluginDependencies, TYPES } from "../dependencyInjection";
import { inject, injectable } from "inversify";
import { EventActionConstructor, getEventActionConstructors } from "../commandFramework";
let logger = Logging.buildLogger("discordInitializer");

@injectable()
export class DiscordWrapperImpl implements DiscordWrapper {
    
    dependencies : PluginDependencies;
    client : Discord.Client;

    constructor(@inject(TYPES.PluginDependencies) dependencies : PluginDependencies) {
        this.dependencies = dependencies;
        this.client = new Discord.Client();
    }

    loadPlugins(pluginFolderPath : string) {
        fs.readdirSync(pluginFolderPath).forEach((plugin : string) => {
            try {
                require(pluginFolderPath + "/" + plugin);
            } catch {
                logger.error(`Failed to load plugin ${plugin}!`);
            }
        });
    }

    private registerEventActions() {
        let eventActionConstructors = getEventActionConstructors();
        eventActionConstructors.forEach((ctor : EventActionConstructor) => {
            let eventString = ctor.prototype.GetEventString();
            let callback = (...args : any[]) => {
                logger.verbose("Callback called for " + ctor.name)
                try {
                    let eventAction = new ctor(this.dependencies.clone());
                    eventAction.passArguments(args);
                    
                } catch (error) {
                    logger.error(`Error occured during action execution of action ${ctor.name}\n${error}`);
                }
                
            }
            this.client.on(eventString, callback);
            logger.info(`Registered Event "${ctor.name}" to occur on ${eventString}`);
        })
    }

    async startClient() {
        this.client.on('ready', () => {
            logger.info(`Logged in as ${this.client.user?.tag}`);
        });
        this.client.on('error', (error) => {
            logger.error(error);
        });
        this.client.on('messageReactionAdd', () => {logger.info("Reaction added")})
        this.registerEventActions();

        this.client.login(process.env.DISCORD_TOKEN);
    }

}