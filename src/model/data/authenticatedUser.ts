import { TokenPair } from "./tokenPair";

export class AuthenticatedUser {
    userId : string;
    userTag : string;
    tokenPair : TokenPair;

    constructor(userId : string, userTag : string, tokenPair : TokenPair) {
        this.userId = userId;
        this.userTag = userTag;
        this.tokenPair = tokenPair;
    }
}