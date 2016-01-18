<?php

// Got from https://www.leaseweb.com/labs/2014/08/session-locking-non-blocking-read-sessions-php/
function session_readonly()
{
    $session_name = preg_replace('/[^\da-z]/i', '', $_COOKIE[session_name()]);
    $session_data = file_get_contents(session_save_path().'/sess_'.$session_name);

    $return_data = array();
    $offset = 0;
    while ($offset < strlen($session_data)) {
        if (!strstr(substr($session_data, $offset), "|")) break;
        $pos = strpos($session_data, "|", $offset);
        $num = $pos - $offset;
        $varname = substr($session_data, $offset, $num);
        $offset += $num + 1;
        $data = unserialize(substr($session_data, $offset));
        $return_data[$varname] = $data;
        $offset += strlen(serialize($data));
    }
    $_SESSION = $return_data;
}

function cleanSessions() {
    global $DB;
    // Nettoyage des joueurs qui ne pinguent plus et qui ne sont pas en cours de jeu
    $DB->query("UPDATE players SET session_id = 0, spectator = 1 WHERE last_ping < DATE_ADD(NOW(), INTERVAL -3 SECOND)
                                AND session_id NOT IN (SELECT id FROM sessions WHERE status = 2)");
    /*$DB->query("DELETE FROM players WHERE last_ping < DATE_ADD(NOW(), INTERVAL -3 SECOND)
                                    AND session_id NOT IN (SELECT id FROM sessions WHERE status = 2)");*/

    // Nettoyage des sessions dont le host s'est déconnecté
    $DB->query("DELETE FROM sessions WHERE status < 2 AND (player_host, id) NOT IN (SELECT id, session_id FROM players)");
    $DB->query("UPDATE players SET session_id = 0, spectator = 1 WHERE session_id NOT IN (SELECT id FROM sessions)");

}

function loadPlayer() {
    global $DB;

    // Chargement des infos du joueur si elles existent
    $player_id = 0;
    $player_nick = '';
    if (isset($_SESSION['player_id'])) {
        $player_id = $_SESSION['player_id'];
        $res = $DB->query("SELECT * FROM players WHERE id = " . $player_id);
        if ($rs = $res->fetch()) {
            $_SESSION['session_id'] = $rs['session_id'];
            $player_nick = $rs['nicknames'];
        } else {
            unset($_SESSION['session_id']);
            unset($_SESSION['player_id']);
        }
    }

    // Si le joueur n'existe pas (ou plus) on le créée
    if (!isset($_SESSION['player_id'])) {
        $player_id = 0;
        while ($player_id == 0) {
            $player_id = rand(1, 999999999);
            $res = $DB->query("SELECT * FROM players WHERE id = " . $player_id);
            if ($res->fetch()) $player_id = 0;
        }
        $DB->query("INSERT INTO players (id, ip, last_ping) VALUES(" . $player_id . ",'".addslashes($_SERVER['REMOTE_ADDR'])."',NOW())");
        $_SESSION['player_id'] = $player_id;
        unset($_SESSION['session_id']);
    }
    return array('id' => $player_id, 'nick' => $player_nick);
}

function sendFile($file) {
    $filesize = filesize($file);

    $offset = 0;
    $length = $filesize;

    // Obligé de gérer le Range pour Chrome. Même en répondant en HTTP/1.0 (qui n'accepte pas le Range), il insiste.
    if (isset($_SERVER['HTTP_RANGE'])) {
        // if the HTTP_RANGE header is set we're dealing with partial content
        $partialContent = true;
        // find the requested range
        // this might be too simplistic, apparently the client can request
        // multiple ranges, which can become pretty complex, so ignore it for now
        preg_match('/bytes=(\d+)-(\d+)?/', $_SERVER['HTTP_RANGE'], $matches);

        $offset = intval($matches[1]);
        if ((isset($matches[2])) && (intval($matches[2]) > 0)) $length = intval($matches[2]) - $offset + 1;
        else $length = $filesize - $offset;
    } else {
        $partialContent = false;
    }

    $f = fopen($file, 'r');
    // seek to the requested offset, this is 0 if it's not a partial content request
    fseek($f, $offset);
    $data = fread($f, $length);
    fclose($f);

    if ($partialContent) {
        // output the right headers for partial content
        header('HTTP/1.1 206 Partial Content');
        header('Content-Range: bytes ' . $offset . '-' . ($offset + $length - 1) . '/' . $filesize);
    }
    header('Content-type: ' . mime_content_type($file));
    header('Content-length: ' . $length);
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s T', time()));
    header('Accept-Ranges: bytes');
    header_remove('Cache-Control');
    header_remove('Expires');
    header_remove('Pragma');
    header_remove('X-Powered-By');
    print($data);
    die();
}
