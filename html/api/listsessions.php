<?php
// Obsolète : Ce script utilisait l'ancien système de recherche de sessions en polling MySQL (dyn).
// Le matchmaking public est désormais géré en temps réel par le serveur WebSocket Tornado (ydkj_server.py).
http_response_code(410);
die('Endpoint obsolete (migrated to WebSocket)');
