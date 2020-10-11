// const LAST_KEY = "f76166b41b4c9451176fa01ce972a117";
// const LAST_SECRET = "6a579489f53255010774fae37b685408";
// var LAST_SESSION = "";

// Low level ------------------------------------------

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

function getURL(endpoint, parameters, signed = true) {
    let param_string = "";
    for (key in parameters)
    {
        param_string += `${key}=${parameters[key]}&`;
    }
    if (signed) {
        param_string += `api_sig=${sign(parameters)}&`;
    }
    let url = "https://api.wavy.fm/?" + param_string;
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

function getFriends(username, callback, limit=15) {
    $.post(
        getURL({
            "method": "user.getFriends",
            "user": username,
            "api_key": LAST_KEY,
            "limit": limit
        }, false)).fail(function (data) {
            console.warn("Failed to get friends.", data)
            setErrorMessage(true);
        }).done(function(data) {
            callback(data);
        });
}

function getNowPlaying(username, callback) {
    $.post(
        getURL({
            "method": "user.getRecentTracks",
            "user": username,
            "limit": 1,
            "api_key": LAST_KEY
        }, false)).fail(function (data) {
            console.warn("Failed to get now playing.", data)
            setErrorMessage(true);
        }).done(function (data) {
            try {
                let track = data.recenttracks.track[0];
                setErrorMessage(false);
                let currentlyPlaying = track['@attr'] != undefined;
                let artwork = track.image[3]['#text'];
                let artistHref = track.url.split("/").slice(0, -2).join("/")
                if (track.date == undefined)
                    track.date = {'uts': 99999999999};
                if (!currentlyPlaying) {
                    getLength(track.name, track.artist['#text'], function (duration) {
                        currentlyPlaying = (parseInt(track.date.uts*1000) + duration > Date.now());
                        callback(track.name, track.artist['#text'], currentlyPlaying, track.date.uts, artwork, track.url, artistHref);
                    })
                }
                else
                    callback(track.name, track.artist['#text'], currentlyPlaying, track.date.uts, artwork, track.url, artistHref);
            } catch(err) {
                setErrorMessage(true);
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
            setErrorMessage(true);
        }).done(function (data) {
            callback(data);
        });
}