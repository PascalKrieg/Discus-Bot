import { TokenPair } from "../data/tokenPair";

export interface SpotifyAPI {
    getRegisterUrl(state : string) : string
    addToQueue(tokenPair : TokenPair, trackURI : string) : Promise<void>
    updateTokenIfExpiringSoon(tokenPair : TokenPair) : Promise<TokenPair> 
    updateToken(tokenPair : TokenPair) : Promise<TokenPair> 
    updateTokenPairFromRequestId(requestId : string) : Promise<void>
}