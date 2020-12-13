import { Message } from "discord.js";
import { Repository } from "../model/data/repository";
import { SpotifyAPI } from "../model/spotify/spotifyApi";
import { Command } from "./interfaces";

const commandConstructors: CommandConstructor[] = [];

export function getCommandConstructors() {
    return commandConstructors;
}

export type CommandConstructor = {
    new(message : Message, repository : Repository, spotifyApi : SpotifyAPI): Command;
    readonly prototype: Command;
}

/**
 * Annotates a class as command to be loaded at runtime. The class must implement the Command interface and must provide a fitting constructer.
 * @param ctor The constructor of the annotated class.
 */
export function RegisteredCommand<T extends CommandConstructor>(ctor: T) {
    commandConstructors.push(ctor);
    return ctor;
}
