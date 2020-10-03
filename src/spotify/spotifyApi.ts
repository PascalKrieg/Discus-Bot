import { Repository } from "../data/repository";
import { request } from "http";

export class SpotifyAPI {

    repository : Repository;
    clientId : String;
    clientSecret : String;
    redirectUri : String;

    constructor(repository : Repository, clientId : String, clientSecret : String, redirectUri : String) {
        this.repository = repository;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
    }
    
}