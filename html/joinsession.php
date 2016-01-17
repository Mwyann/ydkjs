<?php

require_once 'api/local/config.inc.php';
require 'api/mysql.inc.php';
connectMysql('dyn');

$user_id = 0;
session_start();

// Chargement des infos du joueur si elles existent
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
        $player_id = rand(1,999999999);
        $res = $DB->query("SELECT * FROM players WHERE id = " . $player_id);
        if ($res->fetch()) $player_id = 0;
    }
    $DB->query("INSERT INTO players (id, last_ping) VALUES(" . $player_id . ",NOW())");
    $_SESSION['player_id'] = $player_id;
    unset($_SESSION['session_id']);
}

// On remplace le session_id par celui donné en POST s'il existe, ce qui permet à un joueur de rejoindre une autre partie.
// TODO : il faut donner la possibilité à quelqu'un de pouvoir créer une nouvelle partie même s'il est déjà associé à une partie (par exemple si le player_host se barre avant de créer)
if (isset($_POST['session_id'])) $_SESSION['session_id'] = intval($_POST['session_id']);
//if (isset($_GET['session_id'])) $_SESSION['session_id'] = intval($_GET['session_id']); // Idem en GET, pour le debug

// Chargement des infos de la session (si elles existent)

$player_host = 0;
if (isset($_SESSION['session_id'])) {
    $session_id = $_SESSION['session_id'];
    $res = $DB->query("SELECT * FROM sessions WHERE status < 2 AND id = " . $session_id); // On ignore les sessions qui ont déjà commencé
    if ($rs = $res->fetch()) {
        $player_host = $rs['player_host'];
    } else {
        unset($_SESSION['session_id']);
    }
}

// Si la session n'existe pas (ou plus) on la créée
if (!isset($_SESSION['session_id'])) {
    if (!$DEMOMODE) if (!isset($_SESSION['id'])) { // Uniquement les connectés
        header('Location: ./');
        die();
    }
    $session_id = 0;
    while (!$session_id) {
        $session_id = rand(1000, 9999);
        $res = $DB->query("SELECT * FROM sessions WHERE id = " . $session_id);
        if ($res->fetch()) $session_id = 0;
    }
    $player_host = $player_id;
    $DB->query("INSERT INTO sessions (id, datecreated, player_host)
                VALUES (".$session_id.",NOW(),".$player_host.")");
    $_SESSION['session_id'] = $session_id;
}

$is_host = 0;
if ($player_host == $player_id) $is_host = 1;

$DB->query("UPDATE players SET session_id = ".$session_id." WHERE id = ".$player_id);

session_write_close();

?><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>You Don't Know Jack® ALPHA FR</title>
    <link href="css/ydkj.css" rel="stylesheet"/>
    <script src="js/HackTimer.min.js" type="text/javascript"></script>
    <script src="js/jquery-1.12.0.min.js" type="text/javascript"></script>

    <script type="text/javascript">
        (function(){
            jQuery(document).ready(function() {
                // Extrait les valeurs retournées par un appel Ajax
                var getHeaderJSON = function(xhr) {
                    var json;
                    try { json = xhr.getResponseHeader('X-JSON') }
                    catch(e) {}

                    if (json) {
                        return JSON.parse(json);
                        //var data = eval('(' + json + ')'); // or JSON.parse or whatever you like
                        //return data
                    }
                    return [];
                };

                var player_nick = <?php echo json_encode($player_nick); ?>;
                var player_id = <?php echo $player_id; ?>;
                var is_host = <?php echo $is_host; ?>;
                var game_starting = false;
                var start_button = jQuery('#start_game');
                var start_counter = 0;
                var start_interval = 0;

                jQuery('#change_nick').click(function() {
                    var p = jQuery('#player_nick');
                    player_nick = p.val();
                    p.val('');
                });

                var start_game = function(active) {
                    if (game_starting != active) {
                        if (active) {
                            start_counter = 5;
                            start_interval = window.setInterval(function () {
                                start_counter--;
                                start_game(true);
                            }, 1000);
                        } else {
                            if (start_interval) window.clearInterval(start_interval);
                            start_interval = 0;
                        }
                    }

                    game_starting = (active?1:0);

                    if (!is_host) {
                        if (!game_starting) start_button.attr('disabled', 'disabled').val('En attente des autres joueurs...');
                        else {
                            start_button.attr('disabled', 'disabled').val('Démarrage de la partie dans ' + start_counter + ' seconde' + (start_counter > 1 ? 's' : '') + '...');
                            if (start_counter <= 0) {
                                start_button.val('Démarrage de la partie en cours...');
                                if (start_interval) window.clearInterval(start_interval);
                                start_interval = 0;
                            }
                        }
                    } else {
                        // GAME HOST
                        if (game_starting) {
                            start_button.val('Démarrage de la partie dans ' + start_counter + ' seconde' + (start_counter > 1 ? 's' : '') + '... (cliquer pour annuler)');
                            if (start_counter <= 0) {
                                start_button.attr('disabled', 'disabled').val('Démarrage de la partie en cours...');
                                jQuery('#list_players').find('.participant').attr('disabled','disabled');
                                if (start_interval) window.clearInterval(start_interval);
                                start_interval = 0;
                                game_starting = 2;
                            }
                        } else {
                            var list_participants = jQuery('#list_players').find('.participant:checked');

                            if (list_participants.length == 0) {
                                start_button.attr('disabled', 'disabled').val('Sélectionnez au moins un joueur');
                            } else if (list_participants.length > 3) {
                                start_button.attr('disabled', 'disabled').val('Sélectionnez moins de joueurs');
                            } else {
                                start_button.removeAttr('disabled').val('Démarrer la partie ! ('+(list_participants.length)+' joueur'+(list_participants.length > 1 ? 's' : '')+')');
                            }
                        }
                    }
                };

                start_button.click(function() {
                    start_game(!game_starting);
                });

                var updatePlayers = function(readonly) {
                    var players_participants = [];
                    var list_players = jQuery('#list_players');
                    var list_participants = list_players.find('.participant:checked');
                    for(var i = 0; i < list_participants.length; i++) {
                        players_participants.push(jQuery(list_participants[i]).closest('.player').attr('id').replace('player',''));
                    }
                    if (readonly) players_participants = 0;
                    var data = {player_nick: player_nick, readonly: (readonly?1:0), players_participants: players_participants, game_starting: game_starting};
                    jQuery.ajax({
                        url: 'listplayers.php',
                        type: 'post',
                        data: data,
                        success: function (html, status, xhr) {
                            var data = getHeaderJSON(xhr);
                            var list_has_changed = false;
                            if (data.players) {
                                for(var i = 0; i < data.players.length; i++) {
                                    var playerdata = data.players[i];
                                    var playerdiv = list_players.find('#player'+playerdata.id);
                                    if (playerdiv.length == 0) { // Création du joueur
                                        playerdiv = jQuery('<div />').attr('id','player'+playerdata.id).addClass('player');

                                        var checktmp = jQuery('<input type="checkbox" class="participant"/>').css('margin', '2px 5px');
                                        if (playerdata.spectator == '1') checktmp.prop('checked', false); else checktmp.prop('checked', true);
                                        if (is_host) checktmp.click(function(){start_game(false)});
                                        checktmp.appendTo(playerdiv);

                                        jQuery('<span class="nick"/>').appendTo(playerdiv);

                                        playerdiv.appendTo(list_players);
                                    }

                                    // Mise à jour des infos du joueur
                                    var playercheck = playerdiv.find('.participant');
                                    if (!is_host) {
                                        if (playerdata.spectator == '1') playercheck.prop('checked', false); else playercheck.prop('checked', true);
                                        playercheck.attr('disabled', 'disabled');
                                    } else {
                                        if ((playerdata.nicknames != '') && (data.status < 2)) playercheck.removeAttr('disabled');
                                    }
                                    if (playerdata.nicknames == '') {
                                        if (playercheck.is(':checked')) {
                                            list_has_changed = true;
                                            playercheck.removeAttr('checked');
                                        }
                                        playercheck.attr('disabled', 'disabled');
                                    }

                                    var nicks = playerdata.nicknames;
                                    if (playerdata.nicknames == '') nicks = '<i>Joueur anonyme</i>';
                                    if (player_id == playerdata.id) nicks += ' <i style="color:#FF0">(c\'est vous)</i>';
                                    playerdiv.find('.nick').html(nicks); // TODO souligner le joueur host ?

                                    playerdiv.addClass('ok'); // Ne pas supprimer ce joueur
                                }

                                // Retirer les joueurs qui sont partis
                                var old_players = list_players.children('div').not('.ok');
                                // Trouver si l'un des joueurs qui est parti était aussi un participant
                                if (old_players.find('.participant:checked').length > 0) list_has_changed = true;
                                old_players.remove();
                                list_players.find('.ok').removeClass('ok');

                                list_participants = list_players.find('.participant:checked');

                                if (list_has_changed) start_game(false);
                            } else {
                                list_players.html('<div>Aucun joueur<div>');
                            }

                            if (data.status != game_starting) {
                                if (data.status == '0') start_game(false);
                                if (data.status == '1') start_game(true);
                            }
                            if (data.status == '2') window.location.href = 'alpha.php';

                            window.setTimeout(updatePlayers,1000);
                            if (readonly) start_game(false);
                        }
                    });
                };
                window.setTimeout(function(){updatePlayers(true);},500); // Attendre un petit peu pour s'assurer d'avoir bien créé les infos de session
            });
        })();
    </script>
</head>

<body style="background-color:#000;color:#FFF;font-family:JackCondensed, sans-serif;margin:0;padding:0;border:0">
<div style="text-align:center;font-size:80px;margin-top:100px;line-height:0"><div style="">YOU DON’T KNOW</div>
    <div style="font-size:350%;line-height:95%">JACK<span style="font-size:10%; vertical-align:top; line-height:400%">®</span></div></div>
<div style="border:#669 1px solid; background-color:#336;color:#FFF;padding:10px;margin:15px auto;font-family:JackCondensed;font-size:18px;width:640px">
    <p style="text-align:center;font-size:28px;font-weight:bold;margin:10px 0 30px 0;color:#FF0">Nouvelle partie n° <span style="color:#F00"><?php echo $session_id; ?></span></p>

<div style="margin:20px 0">
    Votre nom de joueur : <input type="text" value="" id="player_nick"/> <input type="button" id="change_nick" value="Changer" /> (nécessaire pour participer)
</div>
<div style="margin:20px 0">
    Liste des joueurs connectés :
    <div id="list_players" style="font-family:JackInput;font-size: 80%;margin:5px"><div>Chargement...</div></div>
</div>
<div>
    (Cochez les joueurs qui vont participer, les autres seront spectateurs)
</div>
<div style="margin:20px auto 10px auto; text-align:center"><input type="button" id="start_game" value="Chargement..." disabled/></div>
</div>
<div style="margin:20px auto 10px auto; text-align:center"><a href="./" style="color:#333">Retour à l'accueil</a></div>
</body>
</html>
