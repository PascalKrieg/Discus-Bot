import { inject, injectable } from "inversify";
import { TYPES } from "../dependencyInjection";
import { PluginDependencies } from "../model/services/pluginDependencies"
import { HttpController } from "./httpController";

import express from "express";
import { getPlugins } from "./pluginLoader";
import { Plugin } from "../model/commandFramework/plugin";

import * as logging from "../logging";
let logger = logging.buildLogger("httpControllerImpl");

@injectable()
export class HttpControllerImpl implements HttpController {
    
    dependencies : PluginDependencies;
    app : express.Application;

    constructor(@inject(TYPES.PluginDependencies) dependencies : PluginDependencies) {
        this.dependencies = dependencies;
        this.app = express();
    }

    
    loadFromPlugins(): void {
        let pluginList = getPlugins();

        logger.info("Registering HTTP Controller");

        pluginList.forEach((plugin : Plugin) => {
            logger.debug("Loading http listener for plugin " + plugin.getInfo().name);
            let pluginName = plugin.getInfo().name;
            let path = "/plugins/" + pluginName

            let httpHandlerCtor = plugin.getHttpHandlerConstructor();

            if (httpHandlerCtor !== undefined) {
                let handler = new httpHandlerCtor(this.dependencies.clone());
                this.app.use(path, handler.getRouter());
                logger.verbose(`(${pluginName}) Registered HTTP Handler for route ${path}`);
            }
        })

    }

    startListening(port: number): void {
        this.app.listen(port, () => {
            logger.info(`Started listening for http requests on port ${port}`)
        });
    }

}