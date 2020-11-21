import { exception } from "console";
import { Channel, Guild, GuildCreateChannelOptions, Message, MessageMentions, OverwriteData, User } from "discord.js";
import { Repository } from "./data/repository";


export class CreatePartyCommand {

    guild : Guild;
    creator : User;
    mentions : User[];
    partyChannel : Channel|undefined = undefined;
    repository : Repository;

    constructor(message : Message, repository : Repository) {
        if (!message.guild)
            throw exception();
        this.guild = message.guild;
        this.creator = message.author;
        this.mentions = this.extractUsers(message.mentions);
        this.repository = repository;
    }

    async execute() {
        this.setupPartyChannel();
    }

    private async setupPartyChannel(){
        let channelName = this.createChannelName();
        let options = this.createOptionsObject();
        this.partyChannel = await this.guild.channels.create(channelName, options);
        this.repository.addPartyChannel(this.partyChannel, this.creator);
    }

    private extractUsers(mentions : MessageMentions) : User[] {
        let users : User[] = Array.from(mentions.users.values());
        users.push(this.creator);
        return users;
    }

    private createChannelName() {
        let authorName = this.creator.tag.split("#")[0].toLowerCase();
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

}