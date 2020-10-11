<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Home | Last.fm Live</title>
    <script type="text/javascript">
        function go_username(form) {
            try {
                window.location.href += form.username.value
            }
            catch(err) {
                console.error(err);
            }
            return false;
        }
    </script>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="style.css">
    <style>
        html {
            background: black;
        }
        input {
            font-size: 4vh;            
            color: white;
            background: none;
            border: none;
            font-family: inherit;
            padding: 0 .2em 0 .2em;
        }
        input[type="text"] {
            border-bottom: solid 2px gray;
            border-radius: 4px;
        }
        input[type="submit"] {
            color: firebrick;
            font-weight: 800;
        }
        input[type="submit"]:hover {
            color: #e83030;
            cursor: pointer;
        }
        input:focus,
        select:focus,
        textarea:focus,
        button:focus {
            outline: none;
        }
        form {
            display: flex;
            height: 100vh;
        }
        .centered-input {
            margin: auto;
            display: block;
        }
        @media (max-width: 767px) {
            input {
                font-size: 6vw;
            }
            .centered-input {
                height: 33%;
            }
        }
    </style>
</head>
<body>
    <form name="username-form" onsubmit="return go_username(this)" method="post">
        <div class="centered-input">
            <input type="text" name="username" placeholder="last.fm username" autofocus="autofocus" required>
            <input type="submit" value="go">
        </div>
    </form>
	<a href="https://last.fm/user/jakeledoux" style="position: absolute;bottom: 1em;margin: auto;transform: translateX(-50%);-webkit-transform: translateX(-50%);left: 50%;color: firebrick;">&gt; follow me on last.fm &lt;</a>
</body>
</html>