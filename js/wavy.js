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
    // let url = "https://cors-anywhere.herokuapp.com/api.wavy.fm/" + endpoint + "?" + param_string;
    let url = "https://api.wavy.fm/" + endpoint + "?" + param_string;
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
    $.get(
        getURL('profile/friends/' + username, {},
        false)).fail(function (data) {
            console.warn("Failed to get friends.", data)
            setErrorMessage(true);
        }).done(function(data) {
            let retrofitFriends = {
                'friends': {
                    'user': []
                }
            }
            data.forEach(function(user) {
                retrofitFriends.friends.user.push({
                    'name': user.username,
                    'user_id': user.user_id,
                    'url': "https://wavy.fm/user/" + user.username,
                    'image': [
                        {'#text': "data:image/jpeg;base64, " + user.avatar}
                    ]
                });
            });
            callback(retrofitFriends);
        });
}

function getNowPlaying(username, callback) {
    $.get(
        getURL('profile/listens/' + username, {
            'live': true,
            'page': 0,
            'size': 2
        }, false)).fail(function (data) {
            console.warn("Failed to get now playing.", data)
            setErrorMessage(true);
        }).done(function (data) {
            try {
                let currentlyPlaying = data.live != null;

                var track;

                var artwork;
                var artistHref;
                var title;
                var artist;
                var date;
                var url;

                if (currentlyPlaying) {
                    track = data.live;
                    date = 9999999999999;
                }
                else {
                    track = data.tracks[0].track;
                    date = data.tracks[0].date['$date'];
                }

                artwork = track.album.images[1].url;
                artistHref = track.artists[0].uri;
                title = track.name;
                artist = track.artists[0].name;
                url = track.uri;

                setErrorMessage(false);
                callback(title, artist, currentlyPlaying, date, artwork, url, artistHref);
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
    $.get(
        getURL("profiles", {
            "username": username
        }, false)).fail(function (data) {
            console.warn("Failed to get user info.", data);
            setErrorMessage(true);
        }).done(function (data) {
            let user = data[0];
            let retrofitUser = {
                'user': {
                    'realname': user.spotify_display_name,
                    'user_id': user.user_id,
                    'url': "https://wavy.fm/user/" + user.username,
                    'image': [
                        {'#text': "data:image/jpeg;base64, " + user.avatar}
                    ]
                }
            };
            callback(retrofitUser);
        });
}