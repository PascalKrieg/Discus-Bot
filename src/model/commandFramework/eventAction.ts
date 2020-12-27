import { Channel, DMChannel, Guild, GuildChannel, GuildEmoji, GuildMember, Invite, Message, MessageReaction, Presence, Role, User, VoiceState } from "discord.js";
import { Logger } from "winston";
import { PluginDependencies } from "../services/pluginDependencies";
import { buildLogger } from "../../logging"

export abstract class EventAction {
    dependencies : PluginDependencies
    logger : Logger
    constructor(dependencies : PluginDependencies) {
        this.logger = buildLogger(this.GetEventString())
        this.dependencies = dependencies;
    }
    abstract GetEventString() : string;
    abstract action(...args: any[]) : void;
    abstract passArguments(...args: any[]) : void;
}

export abstract class ChannelCreateAction extends EventAction {
    GetEventString(): string {
        return "channelCreate";
    }
    /**
     * Called whenever a channel is created.
     * @param channel The channel that was created
     */
    abstract action(channel :  DMChannel|GuildChannel) : void

    passArguments(args: any[]) {
        let [channel] = args
        this.action(channel);
    }
}

export abstract class ChannelDeleteAction extends EventAction {
    GetEventString(): string {
        return "channelDelete";
    }
    /**
     * Called whenever a channel is deleted.
     * @param channel The channel that was deleted
     */
    abstract action(channel :  DMChannel|GuildChannel) : void

    passArguments(args: any[]) {
        let [channel] = args
        this.action(channel);
    }
}

export abstract class ChannelPinsUpdateAction extends EventAction {
    GetEventString(): string {
        return "channelPinsUpdate";
    }
    /**
     * Called whenever the pins of a channel are updated.
     * Due to the nature of the WebSocket event, not much information can be provided easily here - you need to manually check the pins yourself.
     * @param channel The channel that the pins update occurred in
     * @param time The time of the pins update
     */
    abstract action(channel :  DMChannel|GuildChannel, time : Date) : void

    passArguments(args: any[]) {
        let [channel, time] = args
        this.action(channel, time);
    }
}


export abstract class ChannelUpdateAction extends EventAction {
    GetEventString(): string {
        return "channelUpdate";
    }
    /**
     * Called whenever a channel is updated - e.g. name change, topic change, channel type change.
     * @param oldChannel The channel before the update
     * @param newChannel The channel after the update
     */
    abstract action(oldChannel : DMChannel|GuildChannel, newChannel : DMChannel|GuildChannel) : void

    passArguments(args: any[]) {
        let [oldChannel, newChannel] = args
        this.action(oldChannel, newChannel);
    }
}

export abstract class EmojiCreateAction extends EventAction {
    GetEventString(): string {
        return "emojiCreate";
    }
    /**
     * Called whenever a custom emoji is created in a guild.
     * @param emoji The emoji that was created
     */
    abstract action(emoji : GuildEmoji) : void

    passArguments(args: any[]) {
        let [emoji] = args
        this.action(emoji);
    }
}


export abstract class EmojiDeleteAction extends EventAction {
    GetEventString(): string {
        return "emojiDelete";
    }
    /**
     * Called whenever a custom emoji is deleted in a guild.
     * @param emoji The emoji that was deleted
     */
    abstract action(emoji : GuildEmoji) : void

    passArguments(args: any[]) {
        let [emoji] = args
        this.action(emoji);
    }
}

export abstract class EmojiUpdateAction extends EventAction {
    GetEventString(): string {
        return "emojiUpdate";
    }
    /**
     * Emitted whenever a custom emoji is updated in a guild.
     * @param oldEmoji The old emoji
     * @param newEmoji The new emoji
     */
    abstract action(oldEmoji : GuildEmoji, newEmoji : GuildEmoji) : void

    passArguments(args: any[]) {
        let [oldEmoji, newEmoji] = args
        this.action(oldEmoji, newEmoji);
    }
}


export abstract class GuildBanAddAction extends EventAction {
    GetEventString(): string {
        return "guildBanAdd";
    }
    /**
     * Emitted whenever a member is banned from a guild.
     * @param guild The guild that the ban occurred in
     * @param user The user that was banned
     */
    abstract action(guild : Guild, user : User) : void

    passArguments(args: any[]) {
        let [guild, user] = args
        this.action(guild, user);
    }
}


export abstract class GuildBanRemoveAction extends EventAction {
    GetEventString(): string {
        return "guildBanRemove";
    }
    /**
     * Emitted whenever a member is unbanned from a guild.
     * @param guild The guild that the unban occurred in
     * @param user The user that was unbanned
     */
    abstract action(guild : Guild, user : User) : void

    passArguments(args: any[]) {
        let [guild, user] = args
        this.action(guild, user);
    }
}


export abstract class GuildJoinAction extends EventAction {
    GetEventString(): string {
        return "guildCreate";
    }
    /**
     * Emitted whenever the client joins a guild.
     * @param guild The joined guild
     */
    abstract action(guild : Guild) : void

    passArguments(args: any[]) {
        let [guild] = args
        this.action(guild);
    }
}

export abstract class GuildLeaveAction extends EventAction {
    GetEventString(): string {
        return "guildDelete";
    }
    /**
     * Emitted whenever a guild kicks the client or the guild is deleted/left.
     * @param guild The guild that was left/deleted
     */
    abstract action(guild : Guild) : void

    passArguments(args: any[]) {
        let [guild] = args
        this.action(guild);
    }
}

export abstract class GuildIntegrationsUpdateAction extends EventAction {
    GetEventString(): string {
        return "guildIntegrationsUpdate";
    }
    /**
     * Emitted whenever a guild integration is updated
     * @param guild The guild whose integrations were updated
     */
    abstract action(guild : Guild) : void

    passArguments(args: any[]) {
        let [guild] = args
        this.action(guild);
    }
}


export abstract class GuildMemberAddAction extends EventAction {
    GetEventString(): string {
        return "guildMemberAdd";
    }
    /**
     * Emitted whenever a user joins a guild.
     * @param guildMember The member that has joined a guild
     */
    abstract action(guildMember : GuildMember) : void

    passArguments(args: any[]) {
        let [guildMember] = args
        this.action(guildMember);
    }
}

export abstract class GuildMemberAvailableAction extends EventAction {
    GetEventString(): string {
        return "guildMemberAvailable";
    }
    /**
     * Emitted whenever a member becomes available in a large guild.
     * @param guildMember The member that became available
     */
    abstract action(guildMember : GuildMember) : void

    passArguments(args: any[]) {
        let [guildMember] = args
        this.action(guildMember);
    }
}

export abstract class GuildMemberRemoveAction extends EventAction {
    GetEventString(): string {
        return "guildMemberRemove";
    }
    /**
     * Emitted whenever a member leaves a guild, or is kicked.
     * @param guildMember The member that has left/been kicked from the guild
     */
    abstract action(guildMember : GuildMember) : void

    passArguments(args: any[]) {
        let [guildMember] = args
        this.action(guildMember);
    }
}

export abstract class GuildMemberUpdateAction extends EventAction {
    GetEventString(): string {
        return "guildMemberUpdate";
    }
    /**
     * Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
     * Also emitted when the user's details (e.g. username) change.
     * @param oldMember The member before the update
     * @param newMemver The member after the update
     */
    abstract action(oldMember : GuildMember, newMemver : GuildMember) : void

    passArguments(args: any[]) {
        let [oldMember, newMember] = args
        this.action(oldMember, newMember);
    }
}

export abstract class GuildUnavailableAction extends EventAction {
    GetEventString(): string {
        return "guildUnavailable";
    }
    /**
     * Emitted whenever a guild becomes unavailable, likely due to a server outage.
     * @param guild The guild that has become unavailable
     */
    abstract action(guild : Guild) : void

    passArguments(args: any[]) {
        let [guild] = args
        this.action(guild);
    }
}

export abstract class GuildUpdateAction extends EventAction {
    GetEventString(): string {
        return "guildUpdate";
    }
    /**
     * Emitted whenever a guild is updated - e.g. name change.
     * @param oldGuild The guild before the update
     * @param newGuild The guild after the update
     */
    abstract action(guild : Guild) : void

    passArguments(args: any[]) {
        let [guild] = args
        this.action(guild);
    }
}

export abstract class InviteCreateAction extends EventAction {
    GetEventString(): string {
        return "inviteCreate";
    }

    /**
     * Emitted when an invite is created. This event only triggers if the client has MANAGE_GUILD permissions for the guild, or MANAGE_CHANNEL permissions for the channel.
     * @param invite The invite that was created
     */
    abstract action(invite : Invite) : void

    passArguments(args: any[]) {
        let [invite] = args
        this.action(invite);
    }
}

export abstract class InviteDeleteAction extends EventAction {
    GetEventString(): string {
        return "inviteDelete";
    }

    /**
     * Emitted when an invite is deleted. This event only triggers if the client has MANAGE_GUILD permissions for the guild, or MANAGE_CHANNEL permissions for the channel.
     * @param invite The invite that was deleted
     */
    abstract action(invite : Invite) : void

    passArguments(args: any[]) {
        let [invite] = args
        this.action(invite);
    }
}

export abstract class MessageAction extends EventAction {
    GetEventString(): string {
        return "message";
    }

    /**
     * Emitted whenever a message is created.
     * @param message The created message
     */
    abstract action(message : Message) : void

    passArguments(args: any[]) {
        let [message] = args;
        this.action(message as Message);
    }
}

export abstract class MessageDeleteAction extends EventAction {
    GetEventString(): string {
        return "messageDelete";
    }

    /**
     * Emitted whenever a message is deleted.
     * @param message The deleted message
     */
    abstract action(message : Message) : void

    passArguments(args: any[]) {
        let [message] = args
        this.action(message);
    }
}

export abstract class MessageReactionAddAction extends EventAction {
    GetEventString(): string {
        return "messageReactionAdd";
    }

    /**
     * Emitted whenever a reaction is added to a cached message.
     * @param messageReaction The reaction object
     * @param user The user that applied the guild or reaction emoji
     */
    abstract action(messageReaction : MessageReaction, user : User) : void

    passArguments(args: any[]) {
        let [messageReaction, user] = args;
        this.action(messageReaction, user);
    }
}

export abstract class MessageReactionRemoveAction extends EventAction {
    GetEventString(): string {
        return "messageReactionRemove";
    }

    /**
     * Emitted whenever a reaction is removed from a cached message.
     * @param messageReaction The reaction object
     * @param user The user whose emoji or reaction emoji was removed
     */
    abstract action(messageReaction : MessageReaction, user : User) : void

    passArguments(args: any[]) {
        let [reaction, user] = args
        this.action(reaction, user);
    }
}

export abstract class MessageUpdateAction extends EventAction {
    GetEventString(): string {
        return "messageUpdate";
    }

    /**
     * Emitted whenever a message is updated - e.g. embed or content change.
     * @param oldMessage The message before the update
     * @param newMessage The message after the update
     */
    abstract action(oldMessage : Message, newMessage : Message) : void

    passArguments(args: any[]) {
        let [oldMessage, newMessage] = args
        this.action(oldMessage, newMessage);
    }
}

export abstract class PresenceUpdateAction extends EventAction {
    GetEventString(): string {
        return "presenceUpdate";
    }

    /**
     * Emitted whenever a guild member's presence (e.g. status, activity) is changed.
     * @param oldMessage The presence before the update, if one at all
     * @param newMessage The presence after the update
     */
    abstract action(oldPresence : Presence|undefined, newPresence : Presence) : void

    passArguments(args: any[]) {
        let [oldPresence, newPresence] = args
        this.action(oldPresence, newPresence);
    }
}

export abstract class RoleCreateAction extends EventAction {
    GetEventString(): string {
        return "roleCreate";
    }

    /**
     * Emitted whenever a role is created.
     * @param role The role that was created
     */
    abstract action(role : Role) : void

    passArguments(args: any[]) {
        let [role] = args
        this.action(role);
    }
}

export abstract class RoleDeleteAction extends EventAction {
    GetEventString(): string {
        return "roleDelete";
    }

    /**
     * Emitted whenever a guild role is deleted.
     * @param role The role that was deleted
     */
    abstract action(role : Role) : void

    passArguments(args: any[]) {
        let [role] = args
        this.action(role);
    }
}

export abstract class RoleUpdateAction extends EventAction {
    GetEventString(): string {
        return "roleUpdate";
    }

    /**
     * Emitted whenever a guild role is updated.
     * @param oldRole The role before the update
     * @param newRole The role after the update
     */
    abstract action(oldRole : Role, newRole : Role) : void

    passArguments(args: any[]) {
        let [oldRole, newRole] = args
        this.action(oldRole, newRole);
    }
}

export abstract class TypingStartAction extends EventAction {
    GetEventString(): string {
        return "typingStart";
    }

    /**
     * Emitted whenever a user starts typing in a channel.
     * @param channel The channel the user started typing in
     * @param user The user that started typing
     */
    abstract action(channel : Channel, user : User) : void

    passArguments(args: any[]) {
        let [channel, user] = args
        this.action(channel, user);
    }
}

export abstract class VoiceStateUpdate extends EventAction {
    GetEventString(): string {
        return "voiceStateUpdate";
    }

    /**
     * Emitted whenever a member changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
     * @param oldState The voice state before the update
     * @param newState The voice state after the update
     */
    abstract action(oldState : VoiceState, newState : VoiceState) : void

    passArguments(args: any[]) {
        let [oldState, newState] = args
        this.action(oldState, newState);
    }
}