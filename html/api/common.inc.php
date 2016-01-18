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
