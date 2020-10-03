import { Channel } from "discord.js";
import { AuthenticatedUser } from "./authenticatedUser";

export class PartyChannel {
    owner : AuthenticatedUser;
    channel : Channel;
    expiration : Date;

    constructor(owner : AuthenticatedUser, channel : Channel, expiration : Date) {
        this.owner = owner;
        this.channel = channel;
        this.expiration = expiration;
    }
}