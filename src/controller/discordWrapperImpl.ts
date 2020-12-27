import "reflect-metadata";
import * as Discord from "discord.js"
import * as Logging from "../logging"
import { DiscordWrapper } from "./discordWrapper";
import { PluginDependencies, TYPES } from "../dependencyInjection";
import { inject, injectable } from "inversify";
import { EventActionConstructor, getPlugins } from "../model/commandFramework";
import { Plugin } from "../model/commandFramework/plugin";
let logger = Logging.buildLogger("discordInitializer");

@injectable()
export class DiscordWrapperImpl implements DiscordWrapper {
    
    dependencies : PluginDependencies;
    client : Discord.Client;

    constructor(@inject(TYPES.PluginDependencies) dependencies : PluginDependencies) {
        this.dependencies = dependencies;
        this.client = new Discord.Client();
    }


    private registerEventActions() {
        let plugins = getPlugins();
        logger.info("Registering discord events")
        plugins.forEach((plugin : Plugin) => {

            let eventActionConstructors = plugin.getEventActionConstructors();

            eventActionConstructors.forEach((ctor : EventActionConstructor) => {
                let eventString = ctor.prototype.GetEventString();
                let callback = (...args : any[]) => {
                    try {
                        let eventAction = new ctor(this.dependencies.clone());
                        eventAction.passArguments(args);
                        
                    } catch (error) {
                        logger.error(`Error occured during action execution of action ${ctor.name}\n${error}`);
                    }
                    
                }
                this.client.on(eventString, callback);
                logger.verbose(`(${plugin.getInfo().name}) Registered Event "${ctor.name}" to occur on ${eventString}`);
            });

        });
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