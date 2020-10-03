import { Channel, Snowflake, User } from "discord.js";
import { ChannelOwner } from "./ChannelOwner";

export interface Repository {

    getPartyChannelIds() : Array<Snowflake>;
    getPartyChannelOwner(channelId : Snowflake) : ChannelOwner;

    isUserRegistered(user : User) : boolean;
    isChannelPartyChannel(channelId : Snowflake) : boolean;

    addUser(user : User, accessToken : String, refreshToken : String) : void;
    addPartyChannel(channel : Channel, owner : User) : void;

    updateUserToken(user: User, accesToken : String, refreshToken : String) : void;

    deleteChannel(channelId : Snowflake) : void;
    deleteUserToken(userId : Snowflake) : void;
}