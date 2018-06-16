<?php

require 'api/local/config.inc.php';
require 'api/common.inc.php';
require 'api/mysql.inc.php';
connectMysql('dyn');

$user_id = 0;
session_start();

$player = loadPlayer();
$player_id = $player['id'];
$player_nick = $player['nick'];

// On remplace le session_id par celui donné en POST s'il existe, ce qui permet à un joueur de rejoindre une autre partie.
// TODO : il faut donner la possibilité à quelqu'un de pouvoir créer une nouvelle partie même s'il est déjà associé à une partie (par exemple si le player_host se barre avant de créer)
if (isset($_POST['session_id'])) $_SESSION['session_id'] = intval($_POST['session_id']);
//if (isset($_GET['session_id'])) $_SESSION['session_id'] = intval($_GET['session_id']); // Idem en GET, pour le debug

// Chargement des infos de la session (si elles existent)

$player_host = 0;
if (isset($_SESSION['session_id'])) {
    $session_id = $_SESSION['session_id'];
    $res = $DB->query("SELECT * FROM sessions WHERE status < 2 AND id = " . $session_id); // On ignore les sessions qui ont déjà démarré
    if ($rs = $res->fetch()) {
        $player_host = $rs['player_host'];
    } else {
        unset($_SESSION['session_id']);
    }
}

// Si la session n'existe pas (ou plus) on la créée
if (!isset($_SESSION['session_id'])) {
    if ((!$DEMOMODE) && (!$ALLOWMULTI)) if (!isset($_SESSION['id'])) { // Uniquement les connectés
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
    $DB->query("INSERT INTO sessions (id, datecreated, player_host, public)
                VALUES (".$session_id.",NOW(),".$player_host.",".(isset($_GET['public'])?1:0).")");
    $_SESSION['session_id'] = $session_id;
}

$is_host = 0;
if ($player_host == $player_id) $is_host = 1;

$DB->query("UPDATE players SET last_ping = NOW(), session_id = ".$session_id." WHERE id = ".$player_id);
cleanSessions();

session_write_close();

?><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>You Don't Know Jack® ALPHA FR</title>
    <link href="css/ydkj.css" rel="stylesheet"/>
    <script src="js/HackTimer.min.js" type="text/javascript"></script>
    <script src="js/jquery-3.3.1.min.js" type="text/javascript"></script>

    <script type="text/javascript">
        (function(){
            jQuery(document).ready(function() {
                var player_nick = <?php echo json_encode($player_nick); ?>;
                var player_id = <?php echo $player_id; ?>;
                var is_host = <?php echo $is_host; ?>;
                var game_starting = false;
                var start_button = jQuery('#start_game');
                var start_counter = 0;
                var start_interval = 0;
                var sound = 0;

                jQuery('#change_nick').click(function() {
                    var p = jQuery('#player_nick');
                    player_nick = p.val();
                    p.val('');
                });

                jQuery('#player_nick').keypress(function(event) {
                    if (event.which == 13) {
                        jQuery('#change_nick').click();
                    }
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

                    if (game_starting) {
                        jQuery('#player_nick').attr('disabled','disabled');
                        jQuery('#change_nick').attr('disabled','disabled');
                    } else {
                        jQuery('#player_nick').removeAttr('disabled');
                        jQuery('#change_nick').removeAttr('disabled');
                    }

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

                            var nb_participants = 0;
                            jQuery.each(list_participants, function(i, elem) {
                                var names = jQuery(elem).closest('div').find('.nick').html();
                                nb_participants += names.split(', ').length;
                            });

                            if (nb_participants == 0) {
                                start_button.attr('disabled', 'disabled').val('Sélectionnez au moins un joueur');
                            } else if (nb_participants > 3) {
                                start_button.attr('disabled', 'disabled').val('Sélectionnez moins de joueurs');
                            } else {
                                start_button.removeAttr('disabled').val('Démarrer la partie ! ('+nb_participants+' joueur'+(nb_participants > 1 ? 's' : '')+')');
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
                    var publicgame = 0;
                    if (jQuery('#public').is(':checked')) publicgame = 1;
                    var nbquestions = 7;
                    if (jQuery('#nbquestions21').is(':checked')) nbquestions = 21;
                    var data = {player_nick: player_nick, readonly: (readonly?1:0), players_participants: players_participants, game_starting: game_starting, nbquestions: nbquestions, 'public': publicgame};
                    jQuery.ajax({
                        url: 'api/listplayers.php',
                        type: 'post',
                        data: data,
                        dataType: 'json',
                        success: function (data, status, xhr) {
                            var list_has_changed = false;
                            if ((data.players) && (data.players.length > 0)) {
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

                                        if (jQuery('#sound').is(':checked')) {
                                            if (!sound) {
                                                sound = jQuery('<audio />');
                                                sound.appendTo('body');
                                            }
                                            var audio = sound.get(0);
                                            audio.pause();
                                            sound.attr('src','api/soundeffect.php?sound=newplayer&num='+(Math.floor(Math.random()*999999))+'&type='+(audio.canPlayType('audio/ogg')?'ogg':'mp3'));
                                            audio.play();
                                        }
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
                                            playercheck.prop('checked', false);
                                        }
                                        playercheck.attr('disabled', 'disabled');
                                    }

                                    var nicks = playerdata.nicknames;
                                    if (playerdata.nicknames == '') nicks = '<i>Joueur anonyme</i>';
                                    if (player_id == playerdata.id) nicks += ' <i style="color:#FF0">(c\'est vous)</i>';
                                    if (playerdiv.find('.nick').html() != nicks) {
                                        playerdiv.find('.nick').html(nicks);
                                        list_has_changed = true;
                                    }

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
                                alert('La session a fermé, veuillez recommencer.');
                                window.location.href = './';
                            }

                            if (data.status != game_starting) {
                                if (data.status == '0') start_game(false);
                                if (data.status == '1') start_game(true);
                            }
                            if (data.status == '2') window.location.href = 'alpha.php';
                            if ((readonly) || (!is_host)) {
                                if (data.public == '1') jQuery('#public').prop('checked', true); else jQuery('#public').prop('checked', false);
                                if (data.nbquestions == '21') jQuery('#nbquestions21').prop('checked', true); else jQuery('#nbquestions21').prop('checked', false);
                            }

                            window.setTimeout(updatePlayers,1000);
                            if (readonly) {
                                if (is_host) {
                                    jQuery('#nbquestions21').removeAttr('disabled');
                                    jQuery('#public').removeAttr('disabled');
                                }
                                start_game(false);
                            }
                        }
                    });
                };
                updatePlayers(true);
                jQuery('#sound').prop('checked', false);
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
    Votre nom de joueur : <input type="text" value="" id="player_nick"/> <input type="button" id="change_nick" value="Changer" /> (nécessaire pour participer)<br/>
    <span style="font-size:80%">Si vous êtes plusieurs sur le même ordinateur, séparez les noms par une virgule, exemple : Juju, Machin</span>
</div>
<div style="margin:20px 0">
    Liste des joueurs présents :
    <div id="list_players" style="font-family:JackInput;font-size: 80%;margin:5px"><div>Chargement...</div></div>
</div>
<div>
    (Cochez les joueurs qui vont participer, les autres seront spectateurs)
</div>
<div style="margin:10px 0;font-size:80%">
    <input type="checkbox" id="nbquestions21" disabled="disabled" /> <label for="nbquestions21">21 questions (7 si décoché)</label> <input type="checkbox" id="public" disabled="disabled" /> <label for="public">Partie publique</label> <input type="checkbox" id="sound"/> <label for="sound">Son à la connexion d'un nouveau joueur</label>
</div>
<div style="margin:20px auto 10px auto; text-align:center"><input type="button" id="start_game" value="Chargement..." disabled/></div>
<div style="margin:20px auto 10px auto; text-align:center; color:#FF0">Note : Il y a eu récemment une importante mise à jour du jeu, et il est possible que vous rencontriez quelques bugs (arrêt du jeu, bug graphique gênant...). Si tel est le cas, envoyez moi un <a href="mailto:alpha@ydkj.fr" style="color:#FFF">e-mail</a> avec une description du problème, et je jetterai un oeil. Merci !</div>
</div>
<div style="margin:20px auto 10px auto; text-align:center"><a href="findsession.php" style="color:#666">Trouver une autre partie publique</a> - <a href="./" style="color:#666">Retour à l'accueil</a></div>
<?php require 'analytics.php'; ?>
</body>
</html>
