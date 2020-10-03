
export class AuthenticatedUser {
    userId : String;
    accessToken : String;
    refreshToken : String;

    constructor(userId : String, accessToken : String, refreshToken : String) {
        this.userId = userId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}