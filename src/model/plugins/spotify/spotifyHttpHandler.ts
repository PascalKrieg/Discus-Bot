import { Router } from "express";
import { PluginDependencies } from "../../../dependencyInjection";
import { RegisteredHttpHandler } from "../../commandFramework";

import * as express from "express";

import * as logging from "../../../logging"
let logger = logging.buildLogger("spotifyHttpHandler");

@RegisteredHttpHandler
export class SpotifyHttpHandler {

    router = express.Router();
    dependencies : PluginDependencies;

    constructor(dependencies : PluginDependencies) {
        this.dependencies = dependencies;
        this.setup();
    }

    private setup() {
        this.router.get("/register", async (req, res) => {
            
            if (!req.query.state || !req.query.code) {
                res.statusCode = 401;
                res.end();
            }

            let state = req.query.state as string;
            let code = req.query.code as string;

            this.dependencies.spotifyApi.updateTokenPairFromState(state, code).then( () => {
                res.statusCode = 200;
                res.send("Registration successfull!")
            }).catch((err) => {
                logger.error(err)
                res.statusCode = 500;
                res.send("Something went wrong! Registration not successful!")
            });

        });
    }

    getRouter() : Router {
        return this.router;
    }
}