import { Channel, Snowflake, User } from "discord.js";
import { TokenPair } from "./tokenPair";
import { AuthenticatedUser } from "./authenticatedUser";

export interface Repository {
    addUser(user : User, tokenPair : TokenPair) : void;
    addPartyChannel(channel : Channel, owner : User, autoDelete? : Date) : void;

    getPartyChannelIds() : Array<Snowflake>;
    getPartyChannelOwner(channelId : Snowflake) : AuthenticatedUser;
    getTokenPairByUserId(userId : Snowflake) : AuthenticatedUser;

    isUserRegistered(userId : Snowflake) : boolean;
    isChannelPartyChannel(channelId : Snowflake) : boolean;

    updateUserToken(user: User, tokenPair : TokenPair) : void;

    deleteChannel(channelId : Snowflake) : void;
    deleteUserToken(userId : Snowflake) : void;

    addCodeRequest(userId : Snowflake, state : string) : number;
    retreiveCodeRequest(state : string) : string;
}