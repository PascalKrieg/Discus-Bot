import { TokenPair } from "../../data/tokenPair";

export interface SpotifyAPI {
    getRegisterUrl(state : string) : string
    addToQueue(tokenPair : TokenPair, trackURI : string) : Promise<void>
    updateTokenIfExpiringSoon(tokenPair : TokenPair) : Promise<TokenPair> 
    updateToken(tokenPair : TokenPair) : Promise<TokenPair> 
    updateTokenPairFromState(state : string, code : string) : Promise<void>
}