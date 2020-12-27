import { Router } from "express";

export interface Command {
    getCommandInfo() : CommandInfo;
    execute() : void;
}

export interface CommandInfo {
    command : string;
    aliases : string[];
    helpText : string;
}

export interface HttpHandler {
    getRouter() : Router
}

export interface PluginInfo {
    name : string;
    description : string;
    author : string;
}