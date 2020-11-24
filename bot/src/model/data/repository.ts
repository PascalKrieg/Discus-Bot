import { Channel, Snowflake, User } from "discord.js";
import { TokenPair } from "./tokenPair";
import { AuthenticatedUser } from "./authenticatedUser";

export interface Repository {
    addUser(user : User, tokenPair : TokenPair) : void;
    isUserPresent(userId : Snowflake) : Promise<boolean>;
    isUserRegistered(userId : Snowflake) : Promise<boolean>;

    addUserAndCodeRequest(user : User, state : string) : Promise<string>

    getTokenPairByUserId(userId : Snowflake) : Promise<AuthenticatedUser>;
    updateUserToken(userId : Snowflake, tokenPair : TokenPair) : void;
    replaceTokens(oldToken : TokenPair, newToken : TokenPair) : void;
    deleteUserToken(userId : Snowflake) : void;

    addCodeRequest(userId : Snowflake, state : string) : Promise<string>;
    getRequestCodeById(id : string) : Promise<string>;
    getRequestCodeByState(state : string) : Promise<string>;
    deleteCodeRequest(id : string) : void;
    finishCodeRequest(requestId : string, newToken : TokenPair) : void;
    
    addPartyChannel(channel : Channel, owner : User, autoDelete? : Date) : void;
    getPartyChannelIds() : Promise<Array<Snowflake>>;
    getPartyChannelOwner(channelId : Snowflake) : Promise<AuthenticatedUser>;
    isChannelPartyChannel(channelId : Snowflake) : Promise<boolean>;
    deleteChannel(channelId : Snowflake) : void;
}