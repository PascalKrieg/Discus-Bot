import { Channel, GuildCreateChannelOptions, Message, MessageMentions, OverwriteData, User } from "discord.js";
import { Repository } from "../../data/repository";

import * as Logging from "../../../logging"
import { CommandInfo, RegisteredCommand } from "../../commandFramework";
import { PluginDependencies } from "../../../dependencyInjection";
let logger = Logging.buildLogger("createPartyCommand");

@RegisteredCommand
export class CreatePartyCommand {

    message : Message;
    mentions : User[];
    partyChannel : Channel|undefined = undefined;
    repository : Repository;

    constructor(message : Message, dependencies : PluginDependencies) {
        this.message = message;
        this.mentions = this.extractUsers(message.mentions);
        this.repository = dependencies.repository;
    }

    getCommandInfo(): CommandInfo {
        return {
            command : "createParty",
            aliases : ["cp"],
            helpText : ""
        }
    }

    async execute() {
        this.setupPartyChannel();
    }

    private async setupPartyChannel(){
        let channelName = this.createChannelName();
        logger.debug("Attempting to setup party channel " + channelName)
        let options = this.createOptionsObject();
        if (this.message.guild == null) {
            return;
        }
        try {
            this.partyChannel = await this.message.guild.channels.create(channelName, options);
            this.repository.addPartyChannel(this.partyChannel, this.message.author);
        } catch(err) {
            this.printErrorMessage(err);
        }
    }

    private extractUsers(mentions : MessageMentions) : User[] {
        let users : User[] = Array.from(mentions.users.values());
        users.push(this.message.author);
        return users;
    }

    private createChannelName() {
        let authorName = this.message.author.tag.split("#")[0].toLowerCase();
        let date = new Date();
        let channelName = `${authorName}-${date.getDate()}-${date.getMonth() + 1}`;
        return channelName;
    }

    private createOptionsObject() : GuildCreateChannelOptions {
        let options : GuildCreateChannelOptions = {
            type : "text",
            topic : "listening party",
            nsfw : false,
            position : 0,
            permissionOverwrites : this.createPermissionOverwriteArray()
        };
        return options
    }

    private createPermissionOverwriteArray() : OverwriteData[] {
        let permissionOverwrites : OverwriteData[] = [];

        this.mentions.forEach((user) => {
            let overwrite = this.createUserPermissionOverwrite(user);
            permissionOverwrites.push(overwrite);
        });

        return permissionOverwrites;
    }

    private createUserPermissionOverwrite(user : User) : OverwriteData {
        let overwrite : OverwriteData = {
            id : user.id,
            allow : 84032,
            deny : 176128,
            type : "member"
        };
        return overwrite;
    }

    private printErrorMessage(err : Error) {
        this.message.channel.send("Failed to create party channel.\n" + err.message);
    }

}