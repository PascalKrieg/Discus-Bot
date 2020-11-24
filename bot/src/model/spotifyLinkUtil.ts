import { request } from "https";

export async function getTrackURIFromLink(link : string) : Promise<string> {
    return new Promise((resolve, reject) => {
        let splitAtSlash = link.split("/");
        if (splitAtSlash[0].indexOf("link.tospotify.com") !== -1) {
            request({
                hostname : "link.tospotify.com",
                port : 443,
                path : "/qZcPGKvChab",
                method : "GET",
            }, (res) => {
                if (res.headers.location) {
                    resolve(openSpotifyLinkToTrackURI(res.headers.location));
                } else {
                    reject(new Error());
                }
            }).end();
        } else {
            resolve(extractSpotifyURI(link));
        }
    })
}

export function isSpotifyURL(sharedLink : string) : boolean {
    return isSpotifyLink(sharedLink) || isToSpotifyLink(sharedLink);
}

function openSpotifyLinkToTrackURI(link : string) : string {
    let spotifyURI : string = link.slice(link.lastIndexOf("/") + 1 , link.indexOf("?"));
    return spotifyURI;
}

function extractSpotifyURI(spotifyLink: string): string {
    let searchString : string = "spotify:track:";
    let spotifyURI : string = spotifyLink.slice(spotifyLink.indexOf(searchString) + searchString.length);

    return spotifyURI;
}

function isSpotifyLink(sharedLink : string): boolean{
    let spotifyDomain : string = "spotify.com";
    return sharedLink.includes(spotifyDomain);
}

function isToSpotifyLink(sharedLink : string) : boolean {
    let spotifyDomain : string = "tospotify.com";
    return sharedLink.includes(spotifyDomain);
}