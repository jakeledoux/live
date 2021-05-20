<?php
    $uri = $_SERVER['REQUEST_URI'];
    $username = explode('/', $uri);
    $username = end($username);
    if ($username == "")
        include 'homepage.php';
    else
        include 'liveview.php';
?>
