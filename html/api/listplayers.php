<?php
// Obsolète : Ce script utilisait l'ancien système de lobby en polling MySQL (dyn).
// Le lobby et les joueurs sont désormais gérés en temps réel par le serveur WebSocket Tornado (ydkj_server.py).
http_response_code(410);
die('Endpoint obsolete (migrated to WebSocket)');
