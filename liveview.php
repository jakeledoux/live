<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta property="username" content="<?= $username ?>">
        <title><?= $username ?> | Wavy.fm Live</title>
        <script src="https://code.jquery.com/jquery-3.4.1.min.js"
            integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
        <script src="js/friends.js?rev=animalcrossingisfun"></script>
        <script src="js/md5.js?rev=animalcrossingisfun"></script>
        <script src="js/wavy.js?rev=animalcrossingisfun"></script>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
        <link rel="stylesheet" href="style.css">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet">
    </head>
    <body>
        <div id="server-down" class="hidden">
            <h1>Connection Issues</h1>
            <p>wavy.fm servers might be having a bad day, or maybe my code broke. This site is still experimental.</p>
        </div>
        <div id="background-tiles">
        </div>
        <div style="clear: both;"></div>
    </body>
</html>