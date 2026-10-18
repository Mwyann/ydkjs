<?php
// Obsolète : Ce script était le démon de socket Unix pour l'ancien système de notification d'actions.
// La synchronisation et les actions sont désormais relayées en temps réel par le serveur WebSocket Tornado (ydkj_server.py).
http_response_code(410);
die('Daemon obsolete (migrated to WebSocket)');