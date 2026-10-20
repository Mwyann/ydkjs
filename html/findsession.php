<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You Don't Know Jack® ALPHA FR</title>
    <link href="css/ydkj.css?v=17" rel="stylesheet"/>
    <script src="js/HackTimer.min.js" type="text/javascript"></script>
    <script src="js/jquery-3.5.1.min.js" type="text/javascript"></script>
    <script type="text/javascript">
        (function(){
            jQuery(document).ready(function() {
                var wsProtocol = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
                var wsHost = window.location.hostname;
                var wsPort = (window.location.protocol === 'https:') ? '' : ':8889';
                var wsUrl = wsProtocol + '//' + wsHost + wsPort + '/YDKJ/ws';

                var ws = null;
                var checkInterval = null;

                function queryPublicSession() {
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({event: 'find_public_session'}));
                    }
                }

                try {
                    ws = new WebSocket(wsUrl);
                } catch(e) {
                    console.error('Erreur connexion WebSocket', e);
                }

                if (ws) {
                    ws.onopen = function() {
                        queryPublicSession();
                        checkInterval = setInterval(queryPublicSession, 3000);
                    };

                    ws.onmessage = function(evt) {
                        var msg;
                        try {
                            msg = JSON.parse(evt.data);
                        } catch(e) {
                            return;
                        }

                        if (msg.event === 'public_session_found') {
                            if (msg.session) {
                                if (checkInterval) clearInterval(checkInterval);
                                window.location.href = 'joinsession.php?session=' + msg.session;
                            }
                        }
                    };

                    ws.onclose = function() {
                        if (checkInterval) clearInterval(checkInterval);
                    };
                }
            });
        })();
    </script>
</head>

<body style="background-color:#000;color:#FFF;font-family:JackCondensed, sans-serif;margin:0;padding:10px 0;border:0">
<div class="ydkj-header-logo">
    <div>YOU DON’T KNOW</div>
    <div class="ydkj-logo-jack">JACK<span class="ydkj-logo-reg">®</span></div>
</div>

<div class="ydkj-panel">
    <p style="text-align:center;font-size:28px;font-weight:bold;margin:5px 0 20px 0;color:#FF0">Recherche d'une partie publique...</p>
    <div style="font-size:19px;line-height:1.4;text-align:center">
        Si vous ne trouvez pas rapidement une partie publique,<br/>n'hésitez pas à en créer une !
        <div style="margin:20px auto 10px auto">
            <a href="joinsession.php?public=1" class="ydkj-btn">CRÉER UNE PARTIE PUBLIQUE</a>
        </div>
    </div>
</div>
<div style="margin:20px auto 15px auto; text-align:center">
    <a href="./" class="ydkj-btn">RETOUR &Agrave; L'ACCUEIL</a>
</div>
<?php require 'analytics.php'; ?>
</body>
</html>
