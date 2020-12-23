import { DMChannel, GuildChannel, TextChannel } from "discord.js";
import { EventActions, RegisteredEventAction } from "../../../commandFramework";

@RegisteredEventAction
export class TestEventAction extends EventActions.ChannelCreateAction {
    action(channel: DMChannel | GuildChannel): void {
        if (channel instanceof DMChannel) {
            (channel as DMChannel).send("DM Channel created!");
        } else if (channel instanceof TextChannel) {
            (channel as TextChannel).send("Welcome to this new channel!");
        }
    }
}