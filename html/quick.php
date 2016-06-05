<?php
session_start();
unset($_SESSION['session_id']);
$nbplayers = 3;
if (isset($_GET['nbplayers'])) {
    $nbplayers = intval($_GET['nbplayers']);
    if (($nbplayers < 1) || ($nbplayers > 3)) $nbplayers = 3;
}
$_SESSION['nbplayers'] = $nbplayers;
session_write_close();

header('Location: alpha.php');
die();