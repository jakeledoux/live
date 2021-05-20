<!DOCTYPE html>
<html lang="en">
    <head>
        <base target="_blank">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta property="username" content="<?= $username ?>">
        <title><?= $username ?> | Last.fm Live</title>
        <script src="https://code.jquery.com/jquery-3.4.1.min.js"
            integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
        <script src="js/friends.js?rev=a-cache-you-cant-sweat-out"></script>
        <script src="js/md5.js?rev=a-cache-you-cant-sweat-out"></script>
        <script src="js/last.js?rev=a-cache-you-cant-sweat-out"></script>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
        <link rel="stylesheet" href="style.css">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet">
    </head>
    <body>
        <div id="no-friends" class="hidden error-msg">
            <h1>404: No Friends Found</h1>
            <p>
                You need to be following people on Last.fm in order to use this
                site. Get your friends to sign up or find some people online
                who share your taste. It'll make Last.fm more fun, I promise. :)
            </p>
        </div>
        <div id="server-down" class="hidden error-msg">
            <h1>Connection Issues</h1>
            <p>
                Either Last.fm servers are having a bad day or you entered a
                bad username.
            </p>
        </div>
        <div id="background-tiles">
        </div>
        <div style="clear: both;"></div>
    </body>
</html>
