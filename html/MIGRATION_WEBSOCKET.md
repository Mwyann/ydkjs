# Documentation & Plan de Migration : Architecture WebSocket Temps Réel YDKJ

Ce document consigne la conception, l'architecture et l'ensemble des travaux réalisés pour la migration du mode multijoueur de **You Don't Know Jack (YDKJ)** depuis l'ancien modèle basé sur du polling HTTP / MySQL (base `dyn`) vers une architecture temps réel **WebSocket (Tornado en Python)** associée à un backend **PHP 100% sans état (Stateless)**.

---

## 1. Contexte et Objectifs de la Migration

### Pourquoi cette migration ?
1. **Latence critique pour un jeu de buzzer rétro** :
   Le modèle précédent reposait sur un polling HTTP régulier (`subscribe` en boucle, insertion d'actions dans la table SQL `actions`). Cela engendrait une latence de 50 à 300 ms, des blocages PHP d'E/S et des risques de collision ou de désynchronisation sur les buzzers millimétrés (`Q`, `B`, `P`).
2. **Élimination des verrous de sessions PHP** :
   Les sessions PHP (`session_start()`, fichiers de session sur disque) provoquaient des blocages d'E/S mutuels entre les requêtes de médias audio, de polling et d'API.
3. **Fiabilité et fluidité mobile & desktop** :
   Le passage en temps réel via socket bidirectionnelle permet un contrôle instantané des buzzers, une synchronisation millimétrée des pistes audio/animations, un maintien actif de l'écran tactile (Wake Lock) et une gestion transparente des spectateurs.

---

## 2. Architecture Globale

```
+-------------------------------------------------------------------------+
|                               NAVIGATEUR                                |
|  - joinsession.php (Lobby SPA)                                          |
|  - alpha.php (Moteur YDKJ : YDKJ.js, YDKJGame.js, YDKJAPI.js, Modes)    |
|  - Web Audio Context (Howler) + Screen Wake Lock API                    |
+------------------------------------+------------------------------------+
                                     |
             +-----------------------+------------------------+
             | WebSocket (Temps Réel)| HTTP POST (Médias/JSON)|
             v                                                v
+-----------------------------+             +-------------------------------+
|    ydkj_server.py (Python)  |             |           api/ (PHP)          |
|  - Tornado 8889             |             |  - 100% Stateless (sans sess) |
|  - Sessions en mémoire      |             |  - api/index.php (gamemode,   |
|  - Relais d'actions aveugle |             |    gameinfo local, resources) |
|  - Barrière de synchro audio|             |  - api/get.php (stream audio) |
|  - Logs textuels horodatés  |             +---------------+---------------+
+-----------------------------+                             |
                                                            v
                                            +-------------------------------+
                                            | Base MySQL Statique (sta)     |
                                            | - Questions, sons, sprites    |
                                            +-------------------------------+
```

---

## 3. Détail des Composants Réalisés

### A. Serveur WebSocket Temps Réel (`ydkj_server.py`)
- **Port d'écoute** : `8889` (chemin `/YDKJ/ws`, proxyfiable en WSS si SSL).
- **Gestion 100% en RAM** :
  - Dictionnaire `sessions[code]` contenant le statut (`lobby` ou `in_game`), l'hôte, les participants et les spectateurs.
  - Séquenceur d'actions incrémental `action_sequence` garantissant l'ordonnancement strict des événements.
- **Cycle de vie du lobby** :
  - `create_session` : Génération d'un code à 4 lettres majuscules univoques (sans 0, O, 1, I).
  - `update_nick` : Attribution du pseudo, mise à jour instantanée pour tous les clients.
  - `update_lobby` : Configuration par l'hôte du nombre de questions (7 ou 21) et activation des joueurs participants (1 à 3 joueurs max).
  - `start_countdown` / `cancel_countdown` : Compte à rebours synchronisé de 5 secondes annulable.
  - `kick_client` : Expulsion d'un client par l'hôte.
- **Barrière de synchronisation audio (`sync` / `sync_complete`)** :
  - Intercepte l'action `sync` émise par les clients au lancement de chaque mode.
  - Bloque le départ tant que l'ensemble des **joueurs actifs** (`game_players`) n'ont pas confirmé leur état prêt (audio débloqué).
  - Ignore les messages des spectateurs pour éviter tout blocage.
  - Timeout de sécurité automatique de 20 secondes pour prévenir les déconnexions intempestives.
- **Résilience et Reconnexion** :
  - `disconnected_clients` : Conservation des états avec jeton de sécurité `token` hexadécimal.
  - Timer d'absence de l'hôte (10s) : Déconnexion propre de tous les clients avec motif clair si l'hôte ne revient pas.
  - Timer de grâce (60s) : Fermeture de session si tous les clients s'absentent temporairement.
- **Support multilingue & Mapping des ports** :
  - Support d'alias de langues en ligne de commande : `--port=fr` (8890), `uk` (8891), `de` (8892), `us` (8893).
- **Changement de session fluide & Résilience de reconnexion** :
  - Si une socket était techniquement rattachée à une autre session (`self.session_code != code`), `self.leave_session()` est invoqué avant d'intégrer la nouvelle session.
  - Si un client tente un `reconnect` avec des identifiants inconnus ou expirés sur une session en statut `lobby`, le serveur bascule automatiquement sur `join_session(code)` au lieu de lever une erreur `Impossible de restaurer la session`.
- **Journalisation exhaustive** : Fichier dédié `logs/session_CODE.log` traçant chaque connexion, action, buzz et déconnexion.

### B. Frontend : Lobby & Transition SPA (`joinsession.php`)
- **Éradication des rechargements de page** :
  - Lorsque la partie démarre (`game_start`), le lobby ne fait plus de redirection HTTP vers `alpha.php`.
  - La fonction `launchGameSPA()` injecte dynamiquement `#screen`, charge `YDKJ.js?ver=11` et transmet la WebSocket déjà active via `window.YDKJ_ACTIVE_WS`.
  - Préserve le contexte d'interaction utilisateur nécessaire pour le déblocage audio dans les navigateurs stricts.
- **Gestion des changements de sessions** :
  - Détection automatique d'un changement de session dans `sessionStorage` : si l'URL courante ne correspond pas à la session stockée, les anciens `client_id` et `token` sont immédiatement purgés.
- **Admission immédiate des spectateurs** :
  - Si un utilisateur tente de rejoindre une partie en cours via `joinsession.php?session=CODE` ou `alpha.php?session=CODE`, le serveur détecte l'état `in_game`.
  - L'utilisateur est immédiatement admis en spectateur (`spectator: true`), sans passer par le lobby.
  - Toutes les touches de buzzer sont assignées à `0` (neutre), il reçoit les scores et actions en direct sans interférer.

### C. Moteur Client & Synchronisation (`js/YDKJAPI.js`, `js/YDKJGame.js`)
- **Architecture de synchronisation API** :
  - Mode multijoueur : `postaction` envoie un message JSON `{event: 'postaction', data: ...}` via WebSocket.
  - `runactions` traite les actions reçues séquentiellement.
  - `selfpost` est déterminé de manière directe (`msg.client_id === thisAPI.myClientId`).
  - Méthode utilitaire `ignoreaction(actionname)` pour réenregistrer en continu un écouteur neutre afin d'absorber les actions résiduelles sans pollution mémoire.
- **Attribution rétro des touches buzzer** :
  - **1 joueur** : Touche **`B`** (`[98, 66]`), fidèle au CD-ROM où le joueur solo est au milieu.
  - **2 joueurs** : Touche **`Q`** (`[113, 81]`) et **`P`** (`[112, 80]`).
  - **3 joueurs** : Touche **`Q`** (J1), **`B`** (J2), **`P`** (J3).
- **Déblocage audio universel (Firefox / Chrome / Safari)** :
  - `YDKJGame.start()` contrôle `Howler.ctx.state`.
  - Si le contexte est `suspended`, un calque discret et élégant invite l'utilisateur à cliquer n'importe où.
  - Le clic réactive l'audio et déclenche un micro-buffer muet pour déverrouiller la carte son.
  - Le signal `sync` n'est envoyé qu'une fois l'audio validé, garantissant un départ parfait pour tous.
- **Maintien de l'écran allumé (Mobile Wake Lock)** :
  - Utilisation prioritaire de la **Screen Wake Lock API** native du W3C (`navigator.wakeLock.request('screen')`).
  - Fallback transparent sur `NoSleep.min.js`.
  - Rétablissement automatique lors du changement de visibilité (`visibilitychange`).

### D. Améliorations et Corrections de Question (`js/ModeQuestion.js`)
- **Correction de la Vicieuse à 3 joueurs** :
  - Réenregistrement explicite de l'écouteur `registerPlayerScrew()` lors de la réception de `value == 0` et garde `screwee <= 0` sur les rappels d'animation `ended`.
  - Prise en charge des clics tactiles / souris sur les joueurs adverses pour les vicier directement sans passer par le clavier.
- **Synchronisation du TimeOut** :
  - Diffusion de l'action `timeOut` (phase de buzz ou de réponse) pour verrouiller instantanément le chronomètre sur l'ensemble des navigateurs avec filet de sécurité réseau de 5s.

### E. Backend PHP Stateless (`api/`)
- Suppression intégrale de `session_start()`, de `$_SESSION` et des requêtes SQL vers la base dynamique (`dyn`).
- Nettoyage des endpoints obsolètes (`api/listsessions.php`, `api/listplayers.php` renvoient un code HTTP 410 documenté).
- Le backend PHP ne s'occupe plus que du service ultra-rapide des questions statiques (`api/index.php`) et des flux audio OGG/MP3 avec support HTTP 206 Partial Content (`api/get.php`, `api/soundeffect.php`).

---

## 4. Bilan des Tests et Validations

| Cas d'usage | Résultat attendu | Validation |
|---|---|:---:|
| Partie locale 1 joueur | Démarrage immédiat, buzzer sur la touche **B** | Validé |
| Partie locale 2 / 3 joueurs | Buzzers respectifs Q/P et Q/B/P | Validé |
| Création de lobby multi | Synchronisation instantanée des pseudos et options | Validé |
| Décompte de démarrage 5s | Synchronisé sur tous les postes, annulable par l'hôte | Validé |
| Déconnexion de l'hôte | Timer de 10s puis clôture propre avec message pour les invités | Validé |
| Déblocage audio Firefox | Message explicite, synchronisation retenue jusqu'au clic | Validé |
| Arrivée en cours de partie | Rejoint direct en spectateur, pas de détour par le lobby | Validé |
| Vicieuse à 3 joueurs | Prise en compte immédiate de la cible sur tous les clients distants | Validé |
| Mobile tactile | Maintien de l'écran éveillé (Wake Lock + NoSleep) | Validé |

---

## 5. Déploiement et Exploitation

- **Serveur WebSocket** :
  ```bash
  python3 ydkj_server.py --port=8889 --log_dir=/path/to/logs
  ```
  Ou via service systemd : `systemctl restart ydkj_server.service`.
- **Backend Web** : Compatible avec n'importe quel serveur HTTP (Nginx / Apache + PHP 7.x / 8.x) sans configuration de base dynamique requise pour le multijoueur.
