// Jake Ledoux, 2019

// DONE: Force now-playing if pre-scrobbles are detected (for CD an vinyl scrobblers)
// DONE: Refreshing
// DONE: Sort by recent
// DONE: Album art
// DONE: now-playing animated icon
// DONE: Load yourself as well
// DONE: loading screen
// DONE: Last.fm links
// DONE: Profile pictures
// DONE: Responsive resizing
// DONE: background placeholders
// DONE: User pinning
// DONE: Fixed background scrolling

var refreshInterval;

function openLink(url) {
    window.open(url, '_blank');
}

function createTile(size, username, userImg, userHref, title, artist, currentlyPlaying, timestamp, imgUrl, titleHref, artistHref) {
    tile = document.createElement("div");
    tile.classList.add("user-tile");
    $(tile).attr('user', username);
    
    if (userHref == undefined) {
        if ($(`.user-tile[user="${username}"]`).length)
            return
        // Create placeholder tile
        $(tile).attr('time', 0);
        let loading_img = document.createElement('img');
        loading_img.src = "https://media.giphy.com/media/u2Prjtt7QYD0A/giphy.gif";
        loading_img.classList.add('loading-img');
        tile.append(loading_img);
        // tile.style['border'] = '0.1px rgba(255,255,255,0.05) solid';
    }
    else {

        $(tile).attr('time', timestamp);
        // $(tile).attr('onclick', `openLink("${titleHref}");`);
        // $(tile).addClass('clickable');
        tile.style['backgroundImage'] = `url('${imgUrl}')`;
        if (!currentlyPlaying)
            tile.classList.add("not-playing");

        // Username shadow
        let temp = document.createElement("div");
        temp.classList.add("username-shadow");
        tile.append(temp);

        // Username
        temp = document.createElement("a");
        temp.classList.add("username");
        $(temp).attr("href", userHref);
        $(temp).attr("title", username);
        let tempImg = document.createElement("img");
        if (!userImg)
            userImg = "https://www.tc.columbia.edu/capitalprojects/about-us/contact-us/profiles/Profile-Placeholder.jpg";
        tempImg.src = userImg;
        temp.append(tempImg);
        tile.append(temp);

        // <pinshit>
        let isPinned = localStorage[`pinned-${username}`] == "true";
        $(tile).attr("pinned", isPinned);
        let pin = document.createElement("div");
        let emoji = document.createElement("p");
        if (isPinned) {
            $(pin).addClass("pinned");
        }
        $(emoji).text("📌");
        $(pin).append(emoji);
        $(pin).addClass("pin");
        $(pin).click(togglePin);
        tile.append(pin);
        // </pinshit>

        // Song shadow
        temp = document.createElement("div");
        temp.classList.add("shadow");
        tile.append(temp);

        // Song info
        temp = document.createElement("div");
        temp.classList.add("song-info");

        let titleText = document.createElement("h1");
        let titleLink = document.createElement("a");

        let artistText = document.createElement("h2");
        let artistLink = document.createElement("a");

        $(titleLink).text(title);
        $(titleLink).attr("href", titleHref);
        $(titleText).addClass("song-title");
        titleText.append(titleLink);

        $(artistLink).attr("href", artistHref);
        $(artistLink).text(artist);
        $(artistText).addClass("song-artist");
        artistText.append(artistLink);

        let nowPlaying = document.createElement("img");
        nowPlaying.src = "https://www.last.fm/static/images/icons/now_playing_grey_12.b4158f8790d0.gif";
        nowPlaying.classList.add("now-playing-img")

        tile.style.width = `${size}px`;
        tile.style.height = `${size}px`;

        temp.append(titleText);
        temp.append(artistText);
        artistText.append(nowPlaying);
        tile.append(temp);
    }

    if ($(`.user-tile[user="${username}"]`).length) {
        $(`.user-tile[user="${username}]"`).replaceWith(tile);
    }
    else
        document.body.prepend(tile);

    sort();
}

function gcd(a, b) {
    if (!b) {
        return a;
    }

    return gcd(b, a % b);
};

function sort() {
    // Sort tiles by time
    $('body').find('.user-tile').sort(function (a, b) {
        // If identical pin states
        if ($(a).attr('pinned') == $(b).attr('pinned')){
            if ($(a).attr('time') == $(b).attr('time')) {
                // If A is main user
                if ($(a).attr('user') == USERNAME)
                    return -1;
                // If B is main user
                else if ($(b).attr('user') == USERNAME)
                    return 1;
                // Alphabetical
                if ($(a).attr('user') > $(b).attr('user'))
                    return 1;
                else
                    return -1;
            }
            // Timestamp sort
            return +$(b).attr('time') - +$(a).attr('time');
        }
        // Only one is pinned
        else {
            if ($(a).attr('pinned') == "true")
                return -1;
            else
                return 1;
        }
    }).prependTo('body');
}

function togglePin() {
    // Update all pin states
    $(this).toggleClass("pinned");
    let isPinned = $(this).hasClass("pinned");
    let username = $(this).parent().attr("user");
    $(this).parent().attr("pinned", isPinned);
    localStorage[`pinned-${username}`] = isPinned;

    // Resort
    sort();
}

function refreshLastFM(friends) {
    // Friends haven't been loaded yet
    if (friends == undefined)
        return false;

    console.log("Refreshing...");
    // Last.fm failed to provide information on the user
    if (friends.friends == undefined) {
        if ($(".user-tile").length) {
            console.warn("Last.fm not returning new data.")
            $(".warning-icon").removeClass("hide");
            return false;
        }
        else {
            alert("Username doesn't exist. (or the server is down)");
            clearInterval(refreshInterval);
            // window.location.href = `${window.location.origin}${window.location.pathname.split("/").slice(0, -1).join("/")}`;;
            return false;
        }
    }

    $(".warning-icon").addClass("hide");
    var [columns, rows, size] = getSize();
    // Create tiles
    createTile(size, USERNAME);
    getNowPlaying(USERNAME, function (...args) {
        createTile(size, USERNAME, USER.image[0]['#text'], USER.url, ...args);
    })
    for (var idx in friends.friends.user) {
        let friend = friends.friends.user[idx];
        createTile(size, friend.name);
        getNowPlaying(friend.name, function(...args) {
            createTile(size, friend.name, friend.image[0]['#text'], friend.url, ...args);
            resize();
        });
    }
    
}

var USERNAME = $("meta[property='username']").attr("content");
var USER;
var FRIENDS;

// Document ready
$(function() {
    getInfo(USERNAME, function (userInfo) {
        USER = userInfo.user;
        getFriends(USERNAME, function(friends) {
            FRIENDS = friends;
            refreshLastFM(FRIENDS);
            refreshInterval = setInterval(function() {refreshLastFM(FRIENDS)}, 10000);
        });
    });
    window.onresize = resize;
})

function getSize() {
    let columns = Math.round($('body').width() / 350);
    let size = $('body').width() / columns;
    let rows = Math.ceil($(window).height() / size);
    return [columns, rows, size];
}

function resize() {
    let [columns, rows, size] = getSize();
    let tileCount = $(".user-tile").length
    let totalRows = tileCount / columns;
    if (totalRows > rows) {
        var targetTileCount = columns * totalRows;
        $("#background-tiles").css("height", "auto");
    }
    else {
        var targetTileCount = columns * rows;
        // $("#background-tiles").css("height", "100vh");
    }
    $("#background-tiles")[0].innerHTML = '<div style="clear: both;"></div>';
    for (i = 0; i < targetTileCount; i++) {
        let bgTile = document.createElement("div")
        $(bgTile).addClass("bg-tile");
        $("#background-tiles").prepend(bgTile);
    }
    $(".user-tile, .bg-tile").each(function () {
        this.style.width = `${size}px`;
        this.style.height = `${size}px`;
    });
}

function setErrorMessage(state) {
    if (state == "connection")
        $("#server-down").removeClass("hidden");
    else if (state == "no-friends")
        $("#no-friends").removeClass("hidden");
    else
    {
        $("#server-down").addClass("hidden");
        $("#no-friends").addClass("hidden");
    }
}
// $(window).resize(resize);
