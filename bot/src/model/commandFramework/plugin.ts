import { Router } from "express";
import { CommandConstructor, EventActionConstructor } from "../../controller/pluginLoader";
import { PluginInfo } from "./interfaces";

export class Plugin {
    private info : PluginInfo;
    private commandConstructors : CommandConstructor[];
    private eventActionConstructors : EventActionConstructor[];

    private router? : Router;

    constructor(info : PluginInfo, commandConstructors : CommandConstructor[], eventActionConstructors : EventActionConstructor[], router? : Router) {
        this.info = info;
        this.commandConstructors = commandConstructors;
        this.eventActionConstructors = eventActionConstructors;
        this.router = router;
    }

    getInfo() {
        return this.info;
    }
    getCommandConstructors() {
        return this.commandConstructors;
    }
    getEventActionConstructors() {
        return this.eventActionConstructors;
    }

    getRouter() : Router | undefined {
        return this.router;
    }
}