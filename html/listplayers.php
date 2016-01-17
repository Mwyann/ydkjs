<?php

require 'api/local/config.inc.php';
require 'api/common.inc.php';
require 'api/mysql.inc.php';
connectMysql('dyn');

session_readonly();

if (!isset($_SESSION['player_id'])) die('Connect to a session first');

$player_id = $_SESSION['player_id'];
$res = $DB->query("SELECT * FROM players WHERE id = " . $player_id);
if ($rs = $res->fetch()) {
    $session_id = $rs['session_id'];
} else {
    session_start();
    unset($_SESSION['session_id']);
    unset($_SESSION['player_id']);
    session_write_close();
    die('Unknown player ID');
}

$session_id = $_SESSION['session_id'];
$res = $DB->query("SELECT * FROM sessions WHERE id = " . $session_id);
if ($rs = $res->fetch()) {
    $player_host = $rs['player_host'];
    $status = $rs['status'];
} else {
    session_start();
    unset($_SESSION['session_id']);
    session_write_close();
    die('Unknown session ID');
}

$sql = '';
if (isset($_POST['player_nick'])) $sql = ", nicknames = '".addslashes(trim($_POST['player_nick']))."'";

$DB->query("UPDATE players SET last_ping = NOW() ".$sql." WHERE id = " . $player_id);
$DB->query("DELETE FROM players WHERE last_ping < DATE_ADD(NOW(), INTERVAL -3 SECOND)
                                AND session_id NOT IN (SELECT id FROM sessions WHERE status = 2)"); // Nettoyage des joueurs qui ne pinguent plus et qui ne sont pas en cours de jeu

$is_host = 0;
if ($player_host == $player_id) $is_host = 1;

$readonly = 0;
if (isset($_POST['readonly'])) $readonly = intval($_POST['readonly']);

$game_starting = 0;
if (($is_host) && (!$readonly)) {
    if (isset($_POST['game_starting'])) $game_starting = intval($_POST['game_starting']);
    if (($game_starting != 0) && ($game_starting != 1) && ($game_starting != 2)) $game_starting = 0;
    if (($status < 2) && ($game_starting < 2)) {
        $status = $game_starting;
        $DB->query("UPDATE sessions SET status = ".$status." WHERE id = " . $session_id);
    }

    $participants = array();
    if (isset($_POST['players_participants'])) $participants = $_POST['players_participants'];
    $list_participants = '';
    foreach($participants as $p_id) {
        if ($list_participants != '') $list_participants .= ',';
        $list_participants .= intval($p_id);
    }
    if ($list_participants != '') $list_participants = 'id IN ('.$list_participants.')'; else $list_participants = '1 = 0';
    $DB->query("UPDATE players SET spectator = IF(".$list_participants." AND nicknames != '',0,1) WHERE session_id = " . $session_id);
}

$players = array();
$res = $DB->query("SELECT * FROM players WHERE session_id = " . $session_id . " ORDER BY id");
while ($rs = $res->fetch()) {
    $player = array('id' => $rs['id'], 'nicknames' => htmlspecialchars($rs['nicknames']), 'spectator' => $rs['spectator']);
    array_push($players, $player);
}

if (($game_starting == 2) && ($status != 2)) {
    // Démarrage de la partie !
    $nbplayers = 0;
    $playerids = array(0,0,0);
    $nick = array('','','');
    foreach($players as $player) if (!$player['spectator']) {
        $playerids[$nbplayers] = $player['id'];
        $nick[$nbplayers] = $player['nicknames'];
        $nbplayers++;
        if ($nbplayers == 3) break;
    }
    if ($nbplayers == 0) {
        $status = 0;
        $DB->query("UPDATE sessions SET status = ".$status." WHERE id = " . $session_id);
    } else {
        $status = 2;
        $DB->query("UPDATE sessions SET status = ".$status.",
                    nbplayers = ".$nbplayers.",
                    player1 = ".intval($playerids[0]).",
                    nick1 = '".addslashes($nick[0])."',
                    player2 = ".intval($playerids[1]).",
                    nick2 = '".addslashes($nick[1])."',
                    player3 = ".intval($playerids[2]).",
                    nick3 = '".addslashes($nick[2])."'
                    WHERE id = " . $session_id);
    }
}

header('X-JSON: '.json_encode(array(
        'players' => $players,
        'status' => $status
    )));

die();
