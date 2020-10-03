import { Repository } from "../data/repository";
import { request } from "https";
import { TokenPair } from "./tokenPair";
import { User } from "discord.js";
import { resolve } from "path";
import { rejects } from "assert";

export class SpotifyAPI {
    readonly minimumTokenTimeRemaining = 60;

    repository : Repository;
    clientId : string;
    clientSecret : string;
    redirectUri : string;

    constructor(repository : Repository, clientId : string, clientSecret : string, redirectUri : string) {
        this.repository = repository;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
    }
    
    
    async refreshToken(refreshToken : string, user : User) {
        this.fetchTokenPair(refreshToken).then((tokenPair) => {
            this.repository.updateUserToken(user, tokenPair)
        })  
    }

    async addToQueue(userId : string, trackURI : string) {
        let tokenPair = this.repository.getTokenPairByUserId(userId);
        this.refreshTokenIfExpiringSoon(tokenPair).then(result => {
            let options = this.createPostSongOptions(trackURI, tokenPair.accessToken);
        
            request(options, (res) => {
                res.on("end", () => {
                    if (res.statusCode !== 304)
                        throw new Error("Status Code not 304");
                })
            }).end();
        }).catch(err => {
            throw err;
        })
    }
    
    async refreshTokenIfExpiringSoon(tokenPair : TokenPair) : Promise<TokenPair> {
        return new Promise((resolve, reject) => {
            let now = new Date();
            if ((tokenPair.expirationTime.getTime() - now.getTime()) / 1000 < this.minimumTokenTimeRemaining) {
                this.fetchTokenPair(tokenPair.refreshToken).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                })
            }
        });
    }

    async getTrackURIFromLink(link : string) : Promise<string> {
        let splitAtSlash = link.split("/");
        if (splitAtSlash[0].indexOf("link.tospotify.com") !== -1) {
            return new Promise((resolve, reject) => {
                request({
                    hostname : "link.tospotify.com",
                    port : 443,
                    path : "/qZcPGKvChab",
                    method : "GET",
                }, (res) => {
                    if (res.headers.location) {
                        resolve(this.openSpotifyLinkToTrackURI(res.headers.location));
                    } else {
                        reject(new Error());
                    }
                }).end();
            })
        } else {
            throw new Error();
        }
    }

    openSpotifyLinkToTrackURI(link : string) : string {
        return "";
    }

    async fetchTokenPair(code : string) : Promise<TokenPair> {
        return new Promise((resolve, reject) => {
            let options = this.createTokenFetchOptions();
            let data = ""

            request(options, (res) => {
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
            }).end(`{'grant_type' : 'authorization_code', 'code':${code}, 'redirect_uri':'${this.redirectUri}'}`);
        })
    }

    private createTokenFetchOptions() {
        return {
            hostname : "accounts.spotify.com",
            auth : `${this.clientId}:${this.clientSecret}`,
            port : 443,
            path : "/api/token",
            method : "POST",
        }
    }

    private createPostSongOptions(trackURI : string, access_token : string) {
        return {
            hostname : "api.spotify.com",
            port : 443,
            path : `/v1/me/player/queue?uri=${trackURI}`,
            method : "POST",
            headers : {
                "Authorization" : `Bearer ${access_token}`
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

    private createBase64AuthHeader() {
        const content = `${this.clientId}:${this.clientSecret}`;
        const buffer = Buffer.from(content, "utf-8");
        return "Basic " + buffer.toString("base64");
    }
}