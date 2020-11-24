import { request, RequestOptions } from "https";
import { TokenPair } from "./data/tokenPair";
import { Repository } from "./data/repository"
import * as Logging from "../logging";
let logger = Logging.buildLogger("spotifyApi");

export class SpotifyAPI {
    readonly minimumTokenTimeRemaining = 60;

    clientId : string;
    clientSecret : string;
    redirectUri : string;

    repository : Repository;

    constructor(clientId : string, clientSecret : string, redirectUri : string, repository : Repository)  {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.repository = repository;
    }
    
    getRegisterUrl(state : string) : string {
        let url = "https://accounts.spotify.com/authorize" 
            + `?client_id=${this.clientId}&response_type=code&show_dialog=true&redirect_uri=${encodeURIComponent(this.redirectUri)}&state=${encodeURIComponent(state)}&scope=user-modify-playback-state`;
        return url;
    }

    async addToQueue(tokenPair : TokenPair, trackURI : string, refreshTokenOnFailure : boolean = true) {
        logger.verbose("Request to add to Queue started.")
        this.updateTokenIfExpiringSoon(tokenPair).then(token => {
            let options = this.createPostSongOptions(trackURI, token.accessToken);
            request(options, (res) => {
                res.on("end", () => {
                    if (res.statusCode !== 304) {
                        logger.debug("Add to queue request failed with code " + res.statusCode);
                        throw new Error("Status Code not 304");
                    }
                })
            }).end();
        }).catch(err => {
            if (refreshTokenOnFailure) {
                logger.verbose("Attempting to refresh token after addToQueue api failure.")
                this.updateToken(tokenPair).then(newToken => {
                    this.addToQueue(newToken, trackURI, false)
                }).catch(err => {throw err});
            }
            throw err;
        })
    }

    async updateTokenIfExpiringSoon(tokenPair : TokenPair) : Promise<TokenPair> {
        let now = new Date();
        if ((tokenPair.expirationTime.getTime() - now.getTime()) / 1000 < this.minimumTokenTimeRemaining) {
            return this.updateToken(tokenPair);
        }
        return tokenPair;
    }

    async updateToken(tokenPair : TokenPair) : Promise<TokenPair> {
        logger.debug("Attempting to update token.")
        let newToken = await this.fetchTokenFromRefresh(tokenPair)
        await this.repository.replaceTokens(tokenPair, newToken);
        return newToken;
    }

    async updateTokenPairFromRequestId(requestId : string) {
        logger.verbose("Attempting to fetch token pair from code");
        let code = await this.repository.getRequestCodeById(requestId);
        let tokenPair = await this.fetchTokenFromCode(code);
        this.repository.finishCodeRequest(requestId, tokenPair);
    }

    private fetchTokenFromRefresh(tokenPair : TokenPair) : Promise<TokenPair> {
        logger.verbose("Attempting to fetch token pair from refresh token")
        let options = this.createRefreshTokenOptions();
        let body = `{'grant_type' : 'refresh_token', 'refresh_token':'${tokenPair.refreshToken}', 'redirect_uri':'${this.redirectUri}'}`;
        return this.fetchTokenPair(options, body);
    }

    private fetchTokenFromCode(code : string) : Promise<TokenPair> {
        let options = this.createFetchFromCodeOptions();
        let body = `{'grant_type' : 'authorization_code', 'code' : '${code}', 'redirect_uri':'${this.redirectUri}'}`
        return this.fetchTokenPair(options, body);
    }

    private fetchTokenPair(requestOptions : RequestOptions, body : string) : Promise<TokenPair>{
        return new Promise((resolve, reject) => {
            let data = ""
            logger.debug("Making spotify api request:\nBody: " + body + "\nOptions: " + JSON.stringify(requestOptions))
            request(requestOptions, (res) => {
                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 200) {
                        let tokenPair = this.createTokenPairFromResponse(data);
                        resolve(tokenPair);
                    } else {
                        reject(new Error(data));
                    }
                });

                res.on('error', (err) => {
                    reject(err);
                })
            }).end(body);
        })
    }

    private createFetchFromCodeOptions() {
        return {
            hostname : "accounts.spotify.com",
            auth : `${this.clientId}:${this.clientSecret}`,
            port : 443,
            path : "/api/token",
            method : "POST",
            headers : {
                "Accept" : "Application/json",
            }
        }
    }

    private createRefreshTokenOptions() {
        return {
            hostname : "accounts.spotify.com",
            auth : `${this.clientId}:${this.clientSecret}`,
            port : 443,
            path : "/api/token",
            method : "POST",
            headers : {
                "Accept" : "Application/json",
            }
        }
    }

    private createPostSongOptions(trackURI : string, access_token : string) {
        return {
            hostname : "api.spotify.com",
            port : 443,
            path : `/v1/me/player/queue?uri=${trackURI}`,
            method : "POST",
            headers : {
                "Authorization" : `Bearer ${access_token}`,
            }
        }
    }

    createTokenPairFromResponse(response : string) : TokenPair {
        let responseObject = JSON.parse(response);
        
        if (!responseObject.access_token || !responseObject.token_type || !responseObject.scope || !responseObject.expires_in || !responseObject.refresh_token)
            throw new Error("Not all information received");
        
        let now = new Date();
        let expiration = new Date((new Date()).setSeconds(now.getSeconds() + parseInt(responseObject.expires_in)));
        
        return new TokenPair(responseObject.access_token, responseObject.refresh_token, expiration);
    }
}