<?php
require 'local/config.inc.php';
require 'common.inc.php';
require 'mysql.inc.php';

session_readonly();

$session_id = 0;
if (isset($_SESSION['session_id'])) $session_id = $_SESSION['session_id'];

connectMysql('dyn');
cleanSessions();

$res = $DB->query("SELECT * FROM sessions WHERE public = 1 AND status = 0 AND id > " . $session_id); // On ignore les sessions qui ont déjà démarré, et celles que l'utilisateur a déjà vu
if ($rs = $res->fetch()) {
    $session_id = $rs['id'];
    session_start();
    loadPlayer();
    $_SESSION['session_id'] = $session_id;
    session_write_close();
    $DB->query("UPDATE players SET session_id = ".$session_id." WHERE id = " . $_SESSION['player_id']);
} else {
    if ($session_id > 0) {
        session_start();
        unset($_SESSION['session_id']);
        $session_id = 0;
        session_write_close();
        if (isset($_SESSION['player_id'])) $DB->query("UPDATE players SET session_id = 0 WHERE id = " . $_SESSION['player_id']);
    }
}

header('X-JSON: '.json_encode(array(
        'found' => ($session_id != 0?1:0),
    )));
