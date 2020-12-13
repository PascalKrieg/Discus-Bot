import { Command } from "./interfaces";

export type Constructor<T> = {
    new(...args: any[]): T;
    readonly prototype: T;
}

const commandConstructors: Constructor<Command>[] = [];

export function getCommandConstructors() {
    return commandConstructors;
}

export function RegisteredCommand<T extends Constructor<Command>>(ctor: T) {
    commandConstructors.push(ctor);
    return ctor;
}