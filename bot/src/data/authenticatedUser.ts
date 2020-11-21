import { TokenPair } from "../spotify/tokenPair";

export class AuthenticatedUser {
    userId : string;
    tokenPair : TokenPair;

    constructor(userId : string, tokenPair : TokenPair) {
        this.userId = userId;
        this.tokenPair = tokenPair;
    }
}