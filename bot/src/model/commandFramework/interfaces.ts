
export interface Command {
    getCommandInfo() : CommandInfo;
    execute() : void;
}

export interface CommandInfo {
    command : string;
    aliases : string[];
    helpText : string;
}

export interface PluginInfo {
    name : string;
    description : string;
    author : string;
}