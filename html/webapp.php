<?php

$nbplayers = 1;
if (isset($_GET['nbplayers'])) $nbplayers = intval($_GET['nbplayers']);

header('Location: /quick.php?nbplayers='.$nbplayers.'&fullscreen=1');
