import { request } from "https";

import * as Logging from "../../../logging";
let logger = Logging.buildLogger("spotifyLinkUtil");

export async function getTrackURIFromLink(link : string) : Promise<string> {
    logger.debug("Attempting to extract track uri from link: " + link);

    if (isToSpotifyLink(link)) {
        return await extractToSpotifyURI(link);
    }

    if (isSpotifyLink(link)) {
        return await openSpotifyLinkToTrackURI(link);
    }

    throw new Error("Not a link");
}

export function isSpotifyURL(sharedLink : string) : boolean {
    return isSpotifyLink(sharedLink) || isToSpotifyLink(sharedLink);
}

async function extractToSpotifyURI(link : string) : Promise<string> {
    let targetPath = link.slice(link.lastIndexOf("/") + 1, link.length)
    return new Promise((resolve, reject) => {
        let splitAtSlash = link.split("/");
        if (splitAtSlash[0].indexOf("link.tospotify.com") !== -1) {
            request({
                hostname : "link.tospotify.com",
                port : 443,
                path : targetPath,
                method : "GET",
            }, (res) => {
                if (res.headers.location) {
                    resolve(openSpotifyLinkToTrackURI(res.headers.location));
                } else {
                    reject(new Error());
                }
            }).end();
        } else {
            resolve(openSpotifyLinkToTrackURI(link));
        }
    })
}


function openSpotifyLinkToTrackURI(link : string) : string {
    let spotifyURI : string = link.slice(link.lastIndexOf("/") + 1 , link.indexOf("?"));
    return "spotify:track:" + spotifyURI;
}

function isSpotifyLink(sharedLink : string): boolean{
    let spotifyDomain : string = "spotify.com";
    return sharedLink.includes(spotifyDomain);
}

function isToSpotifyLink(sharedLink : string) : boolean {
    let spotifyDomain : string = "link.tospotify.com";
    return sharedLink.includes(spotifyDomain);
}