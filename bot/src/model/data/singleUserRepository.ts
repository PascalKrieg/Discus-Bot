import { User, Channel, Snowflake } from "discord.js";
import { TokenPair } from "./tokenPair";
import { AuthenticatedUser } from "./authenticatedUser";
import { PartyChannel } from "./partyChannel";
import { Repository } from "./repository";
import { injectable } from "inversify";

@injectable()
export class SingleUserRepository implements Repository {
    users : AuthenticatedUser[] = [];
    partyChannels : PartyChannel[] = [];

    addUser(user: User, tokenPair: TokenPair): void {
        this.users.push(new AuthenticatedUser(user.id, user.tag, tokenPair));
    }

    addPartyChannel(channel: Channel, owner: User): void {
        try {
            let user = this.users.find((value) => {
                return value.userId === owner.id;
            });
            if (user) {
                this.partyChannels.push(new PartyChannel(user, channel, new Date()));
            } else {
                throw new Error("User not registered!");
            }
        } catch (err) {
            // DELETE ZOMBIE CHANNEL!!
        }
    }

    getPartyChannelIds(): string[] {
        return this.partyChannels.map(partyChannel => partyChannel.channel.id);
    }
    getPartyChannelOwner(channelId: string): AuthenticatedUser {
        let partyChannel = this.partyChannels.find((partyChannel) => {
            return partyChannel.channel.id === channelId;
        });
        if (partyChannel) {
            return partyChannel.owner;
        } else {
            throw new Error("Party channel does not exist!");
        }
    }
    getTokenPairByUserId(userId: string): TokenPair {
        let user = this.users.find((value) => {
            return value.userId === userId;
        });
        if (user) {
            return user.tokenPair;
        } else {
            throw new Error("User not registered!");
        }
    }

    isUserRegistered(userId : string): boolean {
        return undefined == this.users.find((value) => {
            return value.userId === userId;
        });
    }

    isChannelPartyChannel(channelId: string): boolean {
        return undefined == this.partyChannels.find((value) => {
            return value.channel.id === channelId;
        });
    }
    updateUserToken(user: User, tokenPair: TokenPair): void {
        this.deleteUserToken(user.id);
        this.users.push(new AuthenticatedUser(user.id, user.tag, tokenPair));
    }
    deleteChannel(channelId: string): void {
        this.partyChannels.filter(partyChannel => partyChannel.channel.id === channelId);
    }
    deleteUserToken(userId: string): void {
        this.users.filter(user => user.userId === userId);
    }

}