<?php

$nbplayers = 3;
if (isset($_GET['nbplayers'])) {
    $nbplayers = intval($_GET['nbplayers']);
    if (($nbplayers < 1) || ($nbplayers > 3)) $nbplayers = 3;
}

$hash = '';
if (isset($_GET['fullscreen'])) $hash = '#fullscreen';

header('Location: alpha.php?nbplayers='.$nbplayers.$hash);
die();