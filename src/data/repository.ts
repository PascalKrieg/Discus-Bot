import { Channel, Snowflake, User } from "discord.js";
import { AuthenticatedUser } from "./authenticatedUser";

export interface Repository {

    addUser(user : User, accessToken : String, refreshToken : String) : void;
    addPartyChannel(channel : Channel, owner : User) : void;

    getPartyChannelIds() : Array<Snowflake>;
    getPartyChannelOwner(channelId : Snowflake) : AuthenticatedUser;

    isUserRegistered(user : User) : boolean;
    isChannelPartyChannel(channelId : Snowflake) : boolean;

    updateUserToken(user: User, accesToken : String, refreshToken : String) : void;

    deleteChannel(channelId : Snowflake) : void;
    deleteUserToken(userId : Snowflake) : void;
}