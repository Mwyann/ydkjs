<!DOCTYPE html>
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

<body style="background-color:#000;color:#FFF;font-family:JackCondensed, sans-serif;margin:0;padding:0;border:0">
<div style="text-align:center;font-size:80px;margin-top:100px;line-height:0"><div style="">YOU DON’T KNOW</div>
    <div style="font-size:350%;line-height:95%">JACK<span style="font-size:10%; vertical-align:top; line-height:400%">®</span></div></div>

<div style="border:#669 1px solid; background-color:#336;color:#FFF;padding:10px;margin:15px auto;font-family:JackCondensed;font-size:18px;width:640px">
    <p style="text-align:center;font-size:28px;font-weight:bold;margin:10px 0 30px 0;color:#FF0">Recherche d'une partie publique...</p>
    <div>
        Si vous ne trouvez pas rapidement une partie publique, n'hésitez pas à en créer une !
        <p style="text-align: center"><a href="joinsession.php?public=1" style="color:#F90">Créer une partie publique</a></p>
    </div>
</div>
<div style="margin:20px auto 10px auto; text-align:center"><a href="./" style="color:#666">Retour à l'accueil</a></div>
<?php require 'analytics.php'; ?>
</body>
</html>
