const LAST_KEY = "f76166b41b4c9451176fa01ce972a117";
const LAST_SECRET = "6a579489f53255010774fae37b685408";
var LAST_SESSION = "";
var LOVED_TRACKS = [];

// Low level ------------------------------------------

function writeSession(session) {
    LAST_SESSION = session;
}

function writeLovedTracks(tracks) {
    LOVED_TRACKS = [];
    for (key in tracks) {
        let track = tracks[key];
        LOVED_TRACKS.push({ "title": track.name, "artist": track.artist.name });
    }
}

function sign(parameters) {
    let param_string = "";
    let keys = Object.keys(parameters).sort();
    for (key in keys) {
        key = keys[key];
        param_string += `${key}${parameters[key]}`;
    }
    param_string += LAST_SECRET;
    let sig = md5(param_string);
    return sig;
}

function getURL(parameters, signed = true) {
    let param_string = "";
    for (key in parameters)
    {
        param_string += `${key}=${parameters[key]}&`;
    }
    if (signed) {
        param_string += `api_sig=${sign(parameters)}&`;
    }
    let url = "https://ws.audioscrobbler.com/2.0/?" + param_string + "format=json";
    return url;
}

// High level  -----------------------------------------

function getMobileSession(username, password) {
    $.post(
    getURL({
        "method": "auth.getMobileSession",
        "username": username,
        "password": password,
        "api_key": LAST_KEY
    })).done(function(data) {
        writeSession(data.session.key);
    }).fail(function(data) {
        console.warn("Last.fm authentication failed.")
    });
}

function loveTrack(title, artist) {
    if (LAST_SESSION == "") {
        console.warn("Failed to love track, session key not available.");
        return false;
    }
    $.post(
    getURL({
        "method": "track.love",
        "track": title,
        "artist": artist,
        "api_key": LAST_KEY,
        "sk": LAST_SESSION
    })).fail(function (data) {
        console.warn("Failed to love track.", data)
    }).done(function() {
        LOVED_TRACKS.push({'title': title, 'artist': artist});
    });
}

function unLoveTrack(title, artist) {
    if (LAST_SESSION == "") {
        console.warn("Failed to un-love track, session key not available.");
        return false;
    }
    $.post(
        getURL({
            "method": "track.unlove",
            "track": title,
            "artist": artist,
            "api_key": LAST_KEY,
            "sk": LAST_SESSION
        })).fail(function (data) {
            console.warn("Failed to un-love track.", data)
        }).done(function () {
            LOVED_TRACKS.pop(getLovedIndex(title, artist));
        });
}

function getLovedTracks(username) {
    $.post(
        getURL({
            "method": "user.getLovedTracks",
            "limit": 1000,
            "user": username,
            "api_key": LAST_KEY
        }, false)).fail(function (data) {
            console.warn("Failed to get loved tracks.", data)
        }).done(function (data) {
            writeLovedTracks(data.lovedtracks.track);
        });
}

function isLoved(title, artist) {
    for (key in LOVED_TRACKS) {
        let track = LOVED_TRACKS[key];
        if (track.title == title && track.artist == artist) {
            return true;
        }
    }
    return false;
}

function getLovedIndex(title, artist) {
    for (key in LOVED_TRACKS) {
        let track = LOVED_TRACKS[key];
        if (track.title == title && track.artist == artist) {
            return key;
        }
    }
    return false;
}

function getFriends(username, callback, limit=15) {
    $.post(
        getURL({
            "method": "user.getFriends",
            "user": username,
            "api_key": LAST_KEY
        }, false)).fail(function (data) {
            console.warn("Failed to get friends.", data)
            setErrorMessage("no-friends");
        }).done(function(data) {
            callback(data);
        });
}

function getNowPlaying(username, callback, checkLength=false) {
    $.post(
        getURL({
            "method": "user.getRecentTracks",
            "user": username,
            "limit": 1,
            "api_key": LAST_KEY
        }, false)).fail(function (data) {
            console.warn("Failed to get now playing.", data)
            setErrorMessage("connection");
        }).done(function (data) {
            try {
                let track = data.recenttracks.track[0];
                setErrorMessage(false);
                let currentlyPlaying = track['@attr'] != undefined;
                let artwork = track.image[3]['#text'];
                let artistHref = track.url.split("/").slice(0, -2).join("/")
                if (track.date == undefined)
                    track.date = {'uts': 99999999999};
                if (!currentlyPlaying && checkLength) {
                    getLength(track.name, track.artist['#text'], function (duration) {
                        currentlyPlaying = (parseInt(track.date.uts*1000) + duration > Date.now());
                        callback(track.name, track.artist['#text'], currentlyPlaying, track.date.uts, artwork, track.url, artistHref);
                    })
                }
                else
                    callback(track.name, track.artist['#text'], currentlyPlaying, track.date.uts, artwork, track.url, artistHref);
            } catch(err) {
                setErrorMessage("connection");
                console.warn("Failed to get now playing.", err, data);
            }
        });
}

function getLength(track, artist, callback) {
    let duration = localStorage[`<${track}><${artist}>`] || "UNKNOWN";
    if (duration == "UNKNOWN") {
    // } if (true) {
        $.post(
            getURL({
                "method": "track.getInfo",
                "track": track,
                "artist": artist,
                "api_key": LAST_KEY
            }, false)).fail(function (data) {
                console.warn("Failed to get length.", data)
            }).done(function (data) {
                if (data.error == undefined) {
                    // Cache duration
                    let duration = parseInt(data.track.duration);
                    localStorage[`<${track}><${artist}>`] = duration
                    callback(duration);
                }
                else
                    callback(0);
            });
    }
    else {
        callback(parseInt(duration));
    }
    
}

function getInfo(username, callback) {
    $.post(
        getURL({
            "method": "user.getInfo",
            "username": username,
            "api_key": LAST_KEY
        }, false)).fail(function (data) {
            console.warn("Failed to get user info.", data)
            setErrorMessage("connection");
        }).done(function (data) {
            callback(data);
        });
}
