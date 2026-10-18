<?php

$requested_session = '';
if (isset($_GET['session'])) $requested_session = strtoupper(trim($_GET['session']));
elseif (isset($_GET['session_id'])) $requested_session = strtoupper(trim($_GET['session_id']));
elseif (isset($_POST['session_id'])) $requested_session = strtoupper(trim($_POST['session_id']));

$is_public = (isset($_GET['public']) && $_GET['public'] == '1') ? 1 : 0;
$default_nick = '';

?><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>You Don't Know Jack® ALPHA FR</title>
    <link href="css/ydkj.css" rel="stylesheet"/>
    <script src="js/HackTimer.min.js" type="text/javascript"></script>
    <script src="js/jquery-3.5.1.min.js" type="text/javascript"></script>

    <script type="text/javascript">
        (function(){
            jQuery(document).ready(function() {
                var requestedSession = <?php echo json_encode($requested_session); ?>;
                var defaultNick = <?php echo json_encode($default_nick); ?>;
                var isPublic = <?php echo $is_public; ?>;

                var sessionCode = '';
                var myClientId = 0;
                var myToken = '';
                var isHost = false;
                var isSpectator = true;
                var gameStarting = false;
                var startCounter = 5;
                var startInterval = 0;
                var soundAudio = null;
                var knownClientsCount = 0;

                var startButton = jQuery('#start_game');
                var playerNickInput = jQuery('#player_nick');
                var changeNickBtn = jQuery('#change_nick');
                var listPlayers = jQuery('#list_players');
                var sessionDisplay = jQuery('#session_code_display');
                var check21 = jQuery('#nbquestions21');
                var checkPublic = jQuery('#public');
                var checkSound = jQuery('#sound');

                var savedNick = sessionStorage.getItem('ydkj_nick');
                if (savedNick) {
                    playerNickInput.val(savedNick);
                } else if (defaultNick) {
                    playerNickInput.val(defaultNick);
                }

                // Auto-détection de l'URL WebSocket
                var wsProtocol = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
                var wsHost = window.location.hostname;
                var wsPort = (window.location.protocol === 'https:') ? '' : ':8889';
                var wsUrl = wsProtocol + '//' + wsHost + wsPort + '/YDKJ/ws';

                var ws = null;

                function wsSend(obj) {
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify(obj));
                    }
                }

                function escapeHtml(str) {
                    return String(str)
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;');
                }

                function playJoinSound() {
                    try {
                        if (!soundAudio) {
                            soundAudio = new Audio();
                        }
                        var ext = soundAudio.canPlayType('audio/ogg') ? 'ogg' : 'mp3';
                        soundAudio.src = 'api/soundeffect.php?sound=newplayer&num=' + Math.floor(Math.random() * 999999) + '&type=' + ext;
                        soundAudio.play();
                    } catch(e) {}
                }

                function applyLobbyConfig() {
                    if (!isHost || gameStarting) return;
                    var participants = [];
                    listPlayers.find('.participant:checked').each(function() {
                        var cid = parseInt(jQuery(this).closest('.player').data('client-id'));
                        if (cid) participants.push(cid);
                    });
                    var nbQ = check21.is(':checked') ? 21 : 7;
                    var isPub = checkPublic.is(':checked');
                    wsSend({
                        event: 'update_lobby',
                        participants: participants,
                        nb_questions: nbQ,
                        public: isPub
                    });
                }

                function updateStartButtonState(clients) {
                    if (gameStarting) return;

                    if (!isHost) {
                        startButton.attr('disabled', 'disabled').val('En attente de l\'hôte...');
                        return;
                    }

                    var activeParticipants = 0;
                    clients.forEach(function(c) {
                        if (!c.spectator && c.nick) {
                            var names = c.nick.split(',');
                            activeParticipants += names.length;
                        }
                    });

                    if (activeParticipants === 0) {
                        startButton.attr('disabled', 'disabled').val('Sélectionnez au moins un joueur');
                    } else if (activeParticipants > 3) {
                        startButton.attr('disabled', 'disabled').val('Sélectionnez au maximum 3 joueurs (' + activeParticipants + ' sélectionnés)');
                    } else {
                        startButton.removeAttr('disabled').val('Démarrer la partie ! (' + activeParticipants + ' joueur' + (activeParticipants > 1 ? 's' : '') + ')');
                    }
                }

                function renderLobbyState(msg) {
                    var clients = msg.clients || [];

                    // Mettre à jour notre propre statut
                    var myInfo = clients.find(function(c) { return c.client_id === myClientId; });
                    if (myInfo) {
                        isHost = myInfo.is_host;
                        isSpectator = myInfo.spectator;
                    }

                    // Format de partie
                    if (msg.nb_questions === 21) {
                        check21.prop('checked', true);
                    } else {
                        check21.prop('checked', false);
                    }

                    // Son de connexion
                    if (clients.length > knownClientsCount && knownClientsCount > 0 && checkSound.is(':checked')) {
                        playJoinSound();
                    }
                    knownClientsCount = clients.length;

                    // Rendu de la liste des joueurs
                    listPlayers.empty();
                    if (clients.length === 0) {
                        listPlayers.html('<div>Aucun joueur connecté</div>');
                        return;
                    }

                    clients.forEach(function(c) {
                        var row = jQuery('<div />').addClass('player').data('client-id', c.client_id).css({
                            'margin': '4px 0',
                            'display': 'flex',
                            'align-items': 'center'
                        });

                        var chk = jQuery('<input type="checkbox" class="participant" />').css('margin', '2px 8px 2px 0');
                        if (!c.spectator) {
                            chk.prop('checked', true);
                        }

                        if (!isHost || !c.nick || gameStarting) {
                            chk.attr('disabled', 'disabled');
                        } else {
                            chk.change(function() {
                                applyLobbyConfig();
                            });
                        }
                        row.append(chk);

                        var nickSpan = jQuery('<span class="nick" />');
                        var displayNick = c.nick ? escapeHtml(c.nick) : '<i>Joueur anonyme</i>';
                        if (c.client_id === myClientId) {
                            displayNick += ' <i style="color:#FF0">(c\'est vous)</i>';
                        }
                        if (c.is_host) {
                            displayNick += ' <span style="color:#9ece6a;font-size:85%">[Hôte]</span>';
                        }
                        nickSpan.html(displayNick);
                        row.append(nickSpan);

                        // Bouton d'expulsion réservé à l'hôte
                        if (isHost && c.client_id !== myClientId && !gameStarting) {
                            var kickBtn = jQuery('<button type="button" style="margin-left:12px;padding:1px 6px;font-size:11px;background:#f7768e;color:#fff;border:none;cursor:pointer;border-radius:3px">Expulser</button>');
                            kickBtn.click(function() {
                                if (confirm('Voulez-vous vraiment expulser ce joueur ?')) {
                                    wsSend({event: 'kick_client', client_id: c.client_id});
                                }
                            });
                            row.append(kickBtn);
                        }

                        listPlayers.append(row);
                    });

                    updateStartButtonState(clients);
                }

                function updateCountdownButton() {
                    if (isHost) {
                        startButton.removeAttr('disabled').val('Démarrage dans ' + startCounter + ' seconde' + (startCounter > 1 ? 's' : '') + '... (cliquer pour annuler)');
                    } else {
                        startButton.attr('disabled', 'disabled').val('Démarrage de la partie dans ' + startCounter + ' seconde' + (startCounter > 1 ? 's' : '') + '...');
                    }
                }

                function startCountdownUI() {
                    gameStarting = true;
                    startCounter = 5;
                    playerNickInput.attr('disabled', 'disabled');
                    changeNickBtn.attr('disabled', 'disabled');
                    listPlayers.find('input, button').attr('disabled', 'disabled');
                    check21.attr('disabled', 'disabled');
                    checkPublic.attr('disabled', 'disabled');

                    updateCountdownButton();

                    if (startInterval) clearInterval(startInterval);
                    startInterval = setInterval(function() {
                        startCounter--;
                        if (startCounter <= 0) {
                            clearInterval(startInterval);
                            startInterval = 0;
                            if (isHost) {
                                wsSend({event: 'start_game'});
                            }
                        } else {
                            updateCountdownButton();
                        }
                    }, 1000);
                }

                function cancelCountdownUI() {
                    gameStarting = false;
                    if (startInterval) clearInterval(startInterval);
                    startInterval = 0;
                    playerNickInput.removeAttr('disabled');
                    changeNickBtn.removeAttr('disabled');
                    if (isHost) {
                        check21.removeAttr('disabled');
                        checkPublic.removeAttr('disabled');
                    }
                    if (isHost) {
                        applyLobbyConfig();
                    } else {
                        startButton.attr('disabled', 'disabled').val('En attente de l\'hôte...');
                    }
                }

                function submitNick() {
                    var n = playerNickInput.val().trim();
                    if (n) {
                        sessionStorage.setItem('ydkj_nick', n);
                        wsSend({event: 'update_nick', nick: n});
                    }
                }

                playerNickInput.on('input change', function() {
                    var n = jQuery(this).val().trim();
                    if (n) sessionStorage.setItem('ydkj_nick', n);
                });

                changeNickBtn.click(submitNick);
                playerNickInput.keypress(function(e) {
                    if (e.which === 13) {
                        submitNick();
                    }
                });

                check21.change(applyLobbyConfig);
                checkPublic.change(applyLobbyConfig);

                startButton.click(function() {
                    if (!isHost) return;
                    if (gameStarting) {
                        wsSend({event: 'cancel_countdown'});
                    } else {
                        wsSend({event: 'start_countdown'});
                    }
                });

                function launchGameSPA() {
                    sessionStorage.setItem('ydkj_session', sessionCode);
                    sessionStorage.setItem('ydkj_client_id', myClientId);
                    sessionStorage.setItem('ydkj_token', myToken);

                    // Mettre à jour l'historique et l'URL pour refléter alpha.php sans recharger la page
                    if (window.history && window.history.pushState) {
                        window.history.pushState({session: sessionCode}, '', 'alpha.php?session=' + sessionCode);
                    }

                    // Transmettre la WebSocket active et détacher les écouteurs du lobby
                    ws.onmessage = null;
                    ws.onclose = null;
                    window.YDKJ_ACTIVE_WS = ws;

                    // Remplacer le contenu du lobby par l'écran de jeu
                    jQuery('body').css({
                        'background-color': '#000',
                        'margin': '0',
                        'padding': '0',
                        'border': '0'
                    }).html(
                        '<div style="text-align:center;font-size:20px;margin:5px;font-family:JackCondensed, sans-serif" id="headerbuttons">' +
                            '<a href="#" id="fullscreen" style="color:#666">Plein écran</a> &nbsp; &nbsp; &nbsp; ' +
                            '<a href="./" style="color:#666">Retour à l\'accueil</a>' +
                        '</div>' +
                        '<div id="screen" style="margin-left:auto;margin-right:auto">' +
                            '<img src="ajax-loader.gif" style="position:absolute;left:293px;top:212px" class="markedAsRemoved"/>' +
                        '</div>'
                    );

                    // Charger le moteur YDKJ et démarrer la partie (conserve le geste utilisateur pour l'audio)
                    jQuery.getScript('js/YDKJ.js?ver=11', function() {
                        var game = new YDKJ(jQuery('#screen'));
                        jQuery('#fullscreen').click(function() {
                            jQuery('#headerbuttons').hide();
                            game.fullscreen(function() {
                                jQuery('#headerbuttons').show();
                            });
                            return false;
                        });
                        game.start();
                    });
                }

                // Connexion WebSocket
                function connectWS() {
                    try {
                        ws = new WebSocket(wsUrl);
                    } catch(e) {
                        alert('Impossible de joindre le serveur WebSocket : ' + e.message);
                        return;
                    }

                    ws.onopen = function() {
                        if (requestedSession) {
                            wsSend({event: 'join_session', session: requestedSession});
                        } else {
                            wsSend({event: 'create_session', public: (isPublic === 1)});
                        }
                    };

                    ws.onmessage = function(evt) {
                        var msg;
                        try {
                            msg = JSON.parse(evt.data);
                        } catch(e) {
                            return;
                        }

                        if (msg.event === 'session_created') {
                            sessionCode = msg.session;
                            myClientId = msg.client_id;
                            myToken = msg.token || '';
                            isHost = true;
                            isSpectator = false;

                            sessionDisplay.text(sessionCode);
                            sessionStorage.setItem('ydkj_session', sessionCode);
                            sessionStorage.setItem('ydkj_client_id', myClientId);
                            sessionStorage.setItem('ydkj_token', myToken);

                            check21.removeAttr('disabled');
                            checkPublic.removeAttr('disabled');
                            if (isPublic) checkPublic.prop('checked', true);

                            var curNick = playerNickInput.val().trim();
                            if (curNick) {
                                wsSend({event: 'update_nick', nick: curNick});
                            }
                        }
                        else if (msg.event === 'session_joined') {
                            sessionCode = msg.session;
                            myClientId = msg.client_id;
                            myToken = msg.token || '';
                            isHost = msg.is_host;
                            isSpectator = (typeof msg.spectator !== 'undefined') ? msg.spectator : true;

                            sessionStorage.setItem('ydkj_session', sessionCode);
                            sessionStorage.setItem('ydkj_client_id', myClientId);
                            sessionStorage.setItem('ydkj_token', myToken);

                            if (msg.status === 'in_game') {
                                launchGameSPA();
                                return;
                            }

                            sessionDisplay.text(sessionCode);
                            check21.attr('disabled', 'disabled');
                            checkPublic.attr('disabled', 'disabled');

                            var curNick = playerNickInput.val().trim();
                            if (curNick) {
                                wsSend({event: 'update_nick', nick: curNick});
                            }
                        }
                        else if (msg.event === 'reconnected') {
                            sessionCode = msg.session;
                            myClientId = msg.client_id;
                            myToken = msg.token || '';
                            isHost = msg.is_host;
                            isSpectator = (typeof msg.spectator !== 'undefined') ? msg.spectator : false;

                            sessionStorage.setItem('ydkj_session', sessionCode);
                            sessionStorage.setItem('ydkj_client_id', myClientId);
                            sessionStorage.setItem('ydkj_token', myToken);

                            if (msg.status === 'in_game') {
                                launchGameSPA();
                                return;
                            }
                            renderLobbyState(msg);
                        }
                        else if (msg.event === 'lobby_state') {
                            renderLobbyState(msg);
                        }
                        else if (msg.event === 'countdown_started') {
                            startCountdownUI();
                        }
                        else if (msg.event === 'countdown_cancelled') {
                            cancelCountdownUI();
                        }
                        else if (msg.event === 'game_start') {
                            launchGameSPA();
                        }
                        else if (msg.event === 'kicked') {
                            alert('Vous avez été expulsé de la session par l\'hôte.');
                            window.location.href = './';
                        }
                        else if (msg.event === 'session_closed') {
                            alert(msg.reason || 'La session a été fermée.');
                            window.location.href = './';
                        }
                        else if (msg.event === 'server_shutdown') {
                            alert(msg.message || 'Le serveur s\'est arrêté.');
                            window.location.href = './';
                        }
                        else if (msg.event === 'error') {
                            alert(msg.message || 'Erreur inconnue.');
                            if (msg.message === 'Session inexistante') {
                                window.location.href = './';
                            }
                        }
                    };

                    ws.onclose = function() {
                        if (!gameStarting) {
                            startButton.attr('disabled', 'disabled').val('Connexion perdue');
                        }
                    };
                }

                connectWS();
            });
        })();
    </script>
</head>

<body style="background-color:#000;color:#FFF;font-family:JackCondensed, sans-serif;margin:0;padding:0;border:0">
<div style="text-align:center;font-size:80px;margin-top:100px;line-height:0"><div style="">YOU DON’T KNOW</div>
    <div style="font-size:350%;line-height:95%">JACK<span style="font-size:10%; vertical-align:top; line-height:400%">®</span></div></div>
<div style="border:#669 1px solid; background-color:#336;color:#FFF;padding:10px;margin:15px auto;font-family:JackCondensed;font-size:18px;width:640px">
    <p style="text-align:center;font-size:28px;font-weight:bold;margin:10px 0 30px 0;color:#FF0">Partie n° <span style="color:#F00" id="session_code_display">...</span></p>

<div style="margin:20px 0">
    Votre nom de joueur : <input type="text" value="" id="player_nick"/> <input type="button" id="change_nick" value="Changer" /> (nécessaire pour participer)<br/>
    <span style="font-size:80%">Si vous êtes plusieurs sur le même ordinateur, séparez les noms par une virgule, exemple : Juju, Machin</span>
</div>
<div style="margin:20px 0">
    Liste des joueurs présents :
    <div id="list_players" style="font-family:JackInput;font-size: 80%;margin:5px"><div>Connexion au serveur...</div></div>
</div>
<div>
    (Cochez les joueurs qui vont participer, les autres seront spectateurs)
</div>
<div style="margin:10px 0;font-size:80%">
    <input type="checkbox" id="nbquestions21" disabled="disabled" /> <label for="nbquestions21">21 questions (7 si décoché)</label> <input type="checkbox" id="public" disabled="disabled" /> <label for="public">Partie publique</label> <input type="checkbox" id="sound"/> <label for="sound">Son à la connexion d'un nouveau joueur</label>
</div>
<div style="margin:20px auto 10px auto; text-align:center"><input type="button" id="start_game" value="En attente..." disabled/></div>
<div style="margin:20px auto 10px auto; text-align:center; color:#FF0">Note : Il y a eu récemment une importante mise à jour du jeu, et il est possible que vous rencontriez quelques bugs (arrêt du jeu, bug graphique gênant...). Si tel est le cas, envoyez moi un <a href="mailto:alpha@ydkj.fr" style="color:#FFF">e-mail</a> avec une description du problème, et je jetterai un oeil. Merci !</div>
</div>
<div style="margin:20px auto 10px auto; text-align:center"><a href="findsession.php" style="color:#666">Trouver une autre partie publique</a> - <a href="./" style="color:#666">Retour à l'accueil</a></div>
<?php require 'analytics.php'; ?>
</body>
</html>
