import { Command } from "./interfaces";

export type Constructor<T> = {
    new(...args: any[]): T;
    readonly prototype: T;
}

const commandConstructors: Constructor<Command>[] = [];

export function getCommandConstructors() {
    return commandConstructors;
}

/**
 * Annotates a class as command to be loaded at runtime. The class must implement the Command interface and must provide a fitting constructer.
 * @param ctor The constructor of the annotated class.
 */
export function RegisteredCommand<T extends Constructor<Command>>(ctor: T) {
    commandConstructors.push(ctor);
    return ctor;
}