import { CommandConstructor, EventActionConstructor, HttpHandlerConstructor } from "../../controller/pluginLoader";
import { PluginInfo } from "./interfaces";

export class Plugin {
    private info : PluginInfo;
    private commandConstructors : CommandConstructor[];
    private eventActionConstructors : EventActionConstructor[];

    private httpHandlerConstructor? : HttpHandlerConstructor;

    constructor(info : PluginInfo, commandConstructors : CommandConstructor[], eventActionConstructors : EventActionConstructor[], httpHandlerConstructor? : HttpHandlerConstructor) {
        this.info = info;
        this.commandConstructors = commandConstructors;
        this.eventActionConstructors = eventActionConstructors;
        this.httpHandlerConstructor = httpHandlerConstructor;
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

    getHttpHandlerConstructor() : HttpHandlerConstructor | undefined {
        return this.httpHandlerConstructor;
    }
}