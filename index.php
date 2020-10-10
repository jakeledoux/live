<?php
    $username = explode('/', $_SERVER['REQUEST_URI']);
    $username = end($username);
    if ($username == "")
        include 'homepage.php';
    else
        include 'liveview.php';
?>
