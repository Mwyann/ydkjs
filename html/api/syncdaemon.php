<?php

require 'local/config.inc.php';

function freadline($socket) {
    $str = '';
    $c = '';
    do {
        $str .= $c;
        $c = fread($socket,1);
    } while ($c != "\n");
    return $str;
}

if (sizeof($argv) != 2) die('Hmmm no.');
$session_id = intval($argv[1]);
if ($session_id <= 0) die('Bad session ID');

$filename = $SOCKETPATH.'/YDKJ'.$VERSION.$session_id.'.sock';
@unlink($filename);
$listen = stream_socket_server('unix://'.$filename,$errno,$errstr);
if ($listen) {
    $continuelistening = 1;
    while ($continuelistening) {
        $sockets = array();
        $synclist = array();
        while (true) {
            @$socket = stream_socket_accept($listen, 20);
            if (!$socket) {
                $continuelistening = 0; // Aucune nouvelle connexion ni activité depuis 20 secondes... on sort
                break;
            } else {
                $data = freadline($socket);
                $sp = explode(',',$data);
                $player_id = $sp[0];
                $sockets[$player_id] = $socket;
                $whatsup = intval($data[1]);
                if ($whatsup > 0) { // Si la valeur est positive, on vérifie le nombre de connexions qui ont fait pareil, et si il y en a assez, on déco tout le monde !
                    $synclist[$player_id] = 1;
                    @fwrite($socket, sizeof($synclist)); // On renvoie à l'utilisateur le combientième il a été à nous envoyer l'info
                    @fread($socket,1); // On attend la validation
                    if (sizeof($synclist) >= $whatsup) break;
                }
            }
        }

        // Fermeture de tous les sockets
        foreach ($sockets as $socket) {
            @fwrite($socket, '1');
            @fclose($socket);
        }
    }
}
fclose($listen);
unlink($filename);