import { PluginInfo } from "../../commandFramework"

export * from "./messageCommand"
export * from "./onReactionTest"
export * from "./pingCommand"
export * from "./onReactionTest"

export function getPluginInfo() : PluginInfo {
    return {
        name : "base",
        author : "Pascal Krieg",
        description : "Default commands and functions"
    }
}