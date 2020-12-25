import { PluginInfo } from "../../commandFramework"

export * from "./createPartyCommand"
export * from "./registerMeCommand"
export * from "./partyChannelMessageAction"

export function getPluginInfo() : PluginInfo {
    return {
        name : "spotify",
        author : "Pascal Krieg",
        description : "Allows creation of listening parties, so everyone can enqueue songs to the playback queue."
    }
}