
export class TokenPair {
    accessToken : string;
    refreshToken : string;
    expirationTime : Date;

    constructor(accessToken : string, refreshToken : string, expirationTime : Date) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expirationTime = expirationTime;
    }

    isExpired() {
        return this.expirationTime < new Date();
    }

}