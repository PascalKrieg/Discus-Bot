export interface DiscordWrapper {
    loadPlugins(pluginFolderPath : string) : void;
    startClient() : Promise<void>;
}