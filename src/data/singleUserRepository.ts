import { User, Channel } from "discord.js";
import { TokenPair } from "../spotify/tokenPair";
import { AuthenticatedUser } from "./authenticatedUser";
import { Repository } from "./repository";


export class SingleUserRepository implements Repository {
    addUser(user: User, tokenPair: TokenPair): void {
        throw new Error("Method not implemented.");
    }
    addPartyChannel(channel: Channel, owner: User): void {
        throw new Error("Method not implemented.");
    }
    getPartyChannelIds(): string[] {
        throw new Error("Method not implemented.");
    }
    getPartyChannelOwner(channelId: string): AuthenticatedUser {
        throw new Error("Method not implemented.");
    }
    getTokenPairByUserId(userId: string): TokenPair {
        throw new Error("Method not implemented.");
    }
    isUserRegistered(user: User): boolean {
        throw new Error("Method not implemented.");
    }
    isChannelPartyChannel(channelId: string): boolean {
        throw new Error("Method not implemented.");
    }
    updateUserToken(user: User, tokenPair: TokenPair): void {
        throw new Error("Method not implemented.");
    }
    deleteChannel(channelId: string): void {
        throw new Error("Method not implemented.");
    }
    deleteUserToken(userId: string): void {
        throw new Error("Method not implemented.");
    }

}