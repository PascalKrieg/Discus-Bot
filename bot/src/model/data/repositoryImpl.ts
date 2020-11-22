import { User, Channel, Snowflake } from "discord.js";
import { TokenPair } from "./tokenPair";
import { AuthenticatedUser } from "./authenticatedUser";
import { PartyChannel } from "./partyChannel";
import { Repository } from "./repository";
import { injectable } from "inversify";

@injectable()
export class RepositoryImpl implements Repository {
    getTokenPairByUserId(userId: string): AuthenticatedUser {
        throw new Error("Method not implemented.");
    }
    addCodeRequest(user: string, state: string): number {
        throw new Error("Method not implemented.");
    }
    retreiveCodeRequest(state: string): string {
        throw new Error("Method not implemented.");
    }
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

    isUserRegistered(userId: string): boolean {
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