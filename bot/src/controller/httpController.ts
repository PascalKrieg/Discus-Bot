import http from 'http'
import { Repository } from '../model/data/repository';
import { SpotifyAPI } from '../model/spotifyApi';

import * as Logging  from '../logging';
let logger = Logging.buildLogger("httpController");

let repo : Repository;
let spotify : SpotifyAPI;


export function setDependencies(repository : Repository, spotifyAPI : SpotifyAPI) {
    repo = repository;
    spotify = spotifyAPI;
}

function requestListener(req : any, res : any) {
    logger.verbose("Received registration completion request: " + req.url)
    let queryObject = extractQuery(req.url);

    let requestId = queryObject.get("requestId");
    logger.debug("Extracted request id: " + requestId);
    if (requestId) {
        logger.debug("trying to update token for")
        spotify.updateTokenPairFromRequestId(requestId);
    }

    res.end();
}

function extractQuery(url : string) : Map<string, string> {
    let queryMap : Map<string, string> = new Map();
    
    if (url.indexOf("?") == -1) {
        return queryMap;
    }
    let queryString = url.split("?")[1];
    let queryArray = queryString.split("&")
    let keyValueArray = queryArray.map(query => {
        let split = query.split("=")
        return {
            key : split[0],
            value : split[1]
        }
    })

    keyValueArray.forEach(elem => {
        queryMap.set(elem.key, elem.value);
    })
    return queryMap;
}

export function startListening() {
    const server = http.createServer(requestListener);
    server.listen(8080);
}