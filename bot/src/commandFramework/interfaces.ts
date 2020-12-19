
export interface Command {
    getCommandInfo() : CommandInfo;
    execute() : void;
}

export interface CommandInfo {
    command : string;
    aliases : string[];
    helpText : string;
}