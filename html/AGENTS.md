# Instructions Antigravity pour You Don't Know Jack (YDKJ)

Ce document constitue la référence globale pour les agents IA intervenant sur le projet **You Don't Know Jack (YDKJ)**. Il détaille le but du projet, son architecture technique, l'organisation du code et des données, le style de développement ainsi que les règles fondamentales à respecter lors de toute modification.

---

## 1. But du projet

**You Don't Know Jack (YDKJ)** est une recréation et adaptation web complète, fidèle et moderne en **HTML5 / Canvas / Vanilla JS / PHP / MySQL** du célèbre jeu vidéo de quiz et party-game éponyme créé par Jellyvision / Jackbox Games à la fin des années 1990.

### Objectifs principaux :
- **Fidélité rétro absolue** : Reconstituer au millième de seconde près l'expérience du jeu original sur CD-ROM (résolution originale 640x480 au format 4:3, animations de sprites vectoriels et bitmap, répliques audio de l'animateur, bruitages, jingles et typographies originales).
- **Localisation principale francophone** : Reproduction de la version française culte (animée notamment par Bertrand Amar), tout en maintenant une architecture modulaire et multilingue compatible avec les déclinaisons UK, DE et US.
- **Double mode de jeu** :
  - **Jeu local** : 1 à 3 joueurs sur le même ordinateur partageant le clavier (`Q`, `B`, `P` pour buzzer, `1`-`4` pour répondre, `V` pour vicier).
  - **Multijoueur en ligne** : Création et recherche de sessions, lobby d'attente public ou privé, synchronisation temps réel des buzzers, questions et scores entre navigateurs distants.
- **Mode Démo autonome** : Exécution hors base dynamique via `demo.php` s'appuyant sur les données figées de `5QDemo`.

---

## 2. Architecture globale et organisation des répertoires

```
html/
├── AGENTS.md                  # Ce fichier de référence pour les agents IA
├── index.php                  # Accueil et sélection du mode de jeu (local, démo, multi)
├── joinsession.php            # Création / rejoint d'une session multijoueur (lobby d'attente)
├── findsession.php            # Matchmaking automatique (recherche de session publique)
├── alpha.php                  # Écran de jeu principal (instanciation du moteur YDKJ)
├── quick.php                  # Lanceur rapide de partie locale 3 joueurs
├── demo.php                   # Lanceur du mode démo autonome
├── feedback.inc.php           # Formulaire de signalement de bugs / retours utilisateurs
├── analytics.php              # Tag de télémétrie / statistiques
├── webapp.php                 # Entrée PWA / mobile
│
├── api/                       # Backend PHP (statique et médias)
│   ├── index.php              # Contrôleur API central (gameinfo local, gamemode, resources)
│   ├── common.inc.php         # Utilitaires de streaming audio et HTTP Range
│   ├── mysql.inc.php          # Connecteur PDO et sélection de bases statique / dynamique
│   ├── get.php                # Serviteur sécurisé d'assets multimédias avec hash SHA-1
│   ├── soundeffect.php        # Effets sonores d'ambiance et de lobby
│   ├── report-error.php       # Remontée des exceptions JS client en base de données
│   └── local/                 # Configurations locales (ignorées du VCS public)
│       ├── config.inc.php     # Constantes de configuration ($VERSION, $DEMOMODE, etc.)
│       └── mysql-data.inc.php # Identifiants de connexion MySQL ($DBserver, $DBuser, $DBsta, $DBdyn)
├── ydkj_server.py             # Serveur WebSocket Tornado (gestion en mémoire des sessions, lobbies et relais temps réel)
├── ydkj_server.service        # Fichier d'unité systemd pour déploiement Linux
│
├── js/                        # Moteur client (Vanilla JS ES5 & jQuery)
│   ├── YDKJ.js                # Bootstrap principal et chargeur asynchrone des scripts
│   ├── YDKJGame.js            # Contrôleur d'état du jeu, plein écran dynamique et écouteurs claviers
│   ├── YDKJAPI.js             # Couche de synchronisation client/serveur (polling / postaction)
│   ├── YDKJMode.js            # Classe de base orchestrant le cycle de vie des modes de jeu
│   ├── YDKJAnimation.js       # Moteur de rendu des animations par sprites et frames (intervalle 66ms)
│   ├── YDKJFont.js            # Moteur de rendu et métrique des typographies du jeu
│   ├── YDKJFile.js            # Chargement et décompression de fichiers ressources
│   ├── common.js              # Minuteur YDKJTimer, aide audio et utilitaires généraux
│   ├── demo-res.js            # Ressources statiques précompilées pour le mode démo
│   ├── ModeIntro.js           # Mode : Introduction animée de début de partie
│   ├── ModeCategory.js        # Mode : Choix du thème parmi 3 catégories
│   ├── ModeQuestion.js        # Mode : Question standard à choix multiples avec buzzer et vicieuses
│   ├── ModeDisOrDat.js        # Mode spécial : Ceci ou Cela (associations rapides 30 secondes)
│   ├── ModeGibberish.js       # Mode spécial : Charabia (phrase cryptée avec rime d'indice)
│   ├── ModeR1WrapUp.js        # Mode : Bilan intermédiaire des scores après le Round 1
│   ├── ModeJackAttack.js      # Mode : Manche finale Jack Attack (associations de mots sous tension)
│   ├── ModeEnd.js             # Mode : Podium final, bilan des gains et clôture
│   ├── HackTimer.min.js       # Web Worker neutralisant le bridage des minuteurs en onglet inactif
│   ├── howler.core.min.js     # Gestionnaire audio cross-browser (Howler.js)
│   ├── NoSleep.min.js         # Maintien de l'écran allumé sur appareils tactiles
│   └── jquery-3.5.1.min.js    # jQuery 3
│
├── css/                       # Stylesheets et polices typographiques
│   ├── ydkj.css               # Déclarations @font-face, réinitialisations et désactivation de sélection
│   ├── feedback.css           # Styles de la boîte de dialogue de feedback
│   └── fonts/                 # Fichiers de polices originaux (JackCondensed, JackExtraCond, JackInput, JackRoman)
│
├── res/                       # Ressources légères du jeu (animations, timers, sons de démo)
├── res-full/                  # Ressources audio et visuelles complètes du jeu original
│
├── toolbox/                   # Boîte à outils, scripts d'extraction et de maintenance
│   ├── bdd/                   # Dépôts SQL des schémas statiques (v2 à v9) et dynamiques
│   ├── import-csv.php         # Importateur de qhdr.csv et strings.csv dans la base MySQL statique
│   ├── gamedebug.php          # Interface d'injection de session pour tester un mode ou une question précise
│   ├── readres.html           # Visualiseur de frames, d'animations et de métadonnées
│   ├── scan-snd.php           # Indexeur de pistes audio OGG vers la table ressnd
│   ├── convertwav.sh          # Script shell de conversion des assets audio WAV vers OGG/MP3
│   └── macToUTF8.php          # Convertisseur d'encodage MacRoman vers UTF-8
│
└── .agents/                   # Configuration de l'agent Antigravity
    └── rules/                 # Règles modulaires projet
```

---

## 3. Modèle de données : Double base MySQL

Le projet sépare strictement les données immuables extraites du CD-ROM original des données d'exécution en temps réel :

### A. Base Statique (`sta`, ex: `ydkjfr_sta`, `ydkjuk_sta`, `ydkjde_sta`)
Contient l'ensemble des contenus créatifs et logiques extraits du jeu d'origine :
- `qhdr` : En-têtes de questions :
  - `id` : Code unique sur 3 lettres (ex: `AAA`, `ABG`).
  - `title` : Titre absurde/décalé de la question.
  - `folder` : Chemin du dossier de ressources (ex: `QFOLD1/AAA`).
  - `qtype` : Type de question (`Question`, `Gibberish`, `DisOrDat`, `JackAttack`, `Fiber`).
  - `qsubtype` : Sous-type (`Normal`, `Blank`, `Who`, `Eyes`).
  - `value` : Valeur nominale (Round 1 = 1000/2000/3000 F, Round 2 = doublement).
  - `answer` : Indice de la réponse correcte (1 à 4).
  - `forcenext` : ID de la question suivante obligatoirement enchaînée (si applicable).
- `strings` : Textes des questions, 4 choix d'options, répliques écrites et sous-titres.
- `resani` : Définition des animations de sprites (nom, frames, minutages, coordonnées X/Y, alignements).
- `ressnd` : Pistes audio associées aux répliques de l'animateur, jingles et bruitages avec gestion de variantes aléatoires.
- `resfiles` : Référentiel des fichiers de médias physiques.

### B. Base Dynamique (`dyn`, ex: `ydkjfr_dyn`)
Gère uniquement la télémétrie et le suivi des erreurs clientes (l'état des salons et des joueurs étant géré en mémoire vive par Tornado) :
- `errors` : Enregistrement des erreurs JavaScript clientes remontées via `report-error.php`.

---

## 4. Cycle de vie et fonctionnement global d'une partie

1. **Lobby & Découverte** :
   - L'hôte génère une session à 4 chiffres via `joinsession.php` (ou active une session publique) qui communique directement via WebSocket (`ydkj_server.py`).
   - Les joueurs rejoignent en spectateurs par défaut. L'hôte configure les participants (1 à 3 joueurs) et le nombre de questions (7 ou 21).
   - Les pseudonymes et l'état du lobby sont synchronisés en temps réel via des messages WebSocket (`lobby_state`).
2. **Lancement & Transition SPA (`joinsession.php` / `alpha.php`)** :
   - Lorsque l'hôte lance la partie, un compte à rebours synchronisé de 5 secondes s'exécute, le statut passe à `in_game`.
   - La transition s'effectue en SPA (`launchGameSPA()`) sans rechargement de page afin de préserver l'activation audio utilisateur du navigateur. La WebSocket déjà connectée est directement transmise au moteur de jeu via `window.YDKJ_ACTIVE_WS`.
   - Si un utilisateur rejoint via `joinsession.php?session=CODE` ou `alpha.php?session=CODE` alors que la partie est déjà lancée (`in_game`), il est immédiatement admis en tant que spectateur (sans passer par le lobby).
   - Les spectateurs ont `keycode: 0` sur tous les joueurs, ne bloquent pas les barrières de synchronisation des joueurs actifs, et reçoivent le flux temps réel en direct.
3. **Boucle des modes de jeu (`YDKJMode`)** :
   - Chaque mode (`ModeIntro`, `ModeCategory`, `ModeQuestion`, etc.) suit un protocole strict :
     1. `preload(resources)` : Téléchargement et préparation des sprites, animations et sons nécessaires via Howler.
     2. `start()` : Déconnexion des anciens écouteurs de l'API (`unregisteraction`), déclenchement de l'animation et de la piste audio.
     3. `free()` : Destruction propre des éléments du DOM, libération de la mémoire des sons et arrêt des timers.
   - Déroulement standard :
     `Intro` -> `Category` (un joueur choisit une catégorie) -> `Question` (ou mode spécial `DisOrDat` / `Gibberish`) -> ... -> `R1WrapUp` -> Round 2 (valeurs doublées) -> `JackAttack` (manche finale) -> `End` (podium).
4. **Prise de Buzzer, Actions, Synchronisation Audio et Mobile** :
   - **Configuration fidèle des touches** :
     - 1 joueur : exclusivement **`B`** (`[98, 66]`), fidèle au CD-ROM où le joueur solo est au centre.
     - 2 joueurs : **`Q`** (J1) et **`P`** (J2).
     - 3 joueurs : **`Q`** (J1), **`B`** (J2) et **`P`** (J3).
     - Vicieuse : **`V`** (`[118, 86]`). En partie à 3 joueurs, le joueur choisit sa cible (touches 1, 2 ou 3) via une double action `playerScrew` réécoutée par les clients.
   - **Déblocage audio universel** : Avant le démarrage de `ModeIntro`, l'état de l'AudioContext est vérifié. S'il est `suspended`, un message invite à cliquer n'importe où. Le signal `sync` n'est envoyé au serveur Tornado qu'une fois l'audio débloqué. Le serveur attend que tous les joueurs actifs soient prêts (`sync_complete`) pour démarrer la manche au même millième de seconde.
   - **Maintien de l'écran allumé (Mobile)** : Activé automatiquement via la **Screen Wake Lock API** native du W3C avec fallback sur `NoSleep.min.js`.
   - **Actions temps réel** : Dès qu'un joueur appuie sur son buzzer, une action `playerBuzz` est transmise via WebSocket (`postaction`). Le serveur WebSocket Tornado (`ydkj_server.py`) la relaie immédiatement à tous les clients connectés (`action`).

---

## 5. Style de code et conventions de développement

### Backend (PHP)
- **Compatibilité & Structure** : PHP 7.x / 8.x. Architecture procédurale propre, centrée sur des fonctions utilitaires et un routage d'actions par `switch ($call)`.
- **Architecture PHP 100% Stateless (Zéro Session PHP)** :
  - Le backend PHP est entièrement sans état : aucune session PHP (`session_start()`, `$_SESSION`) n'est utilisée. Cela supprime tout verrouillage d'E/S disque et garantit une réactivité maximale sur les requêtes de médias et d'API.
- **Accès base de données** :
  - Connexion via PDO (`connectMysql('sta')` ou `connectMysql('dyn')`).
  - Mode d'erreur : `PDO::ERRMODE_EXCEPTION`.
  - Fetch par défaut : `PDO::FETCH_ASSOC`.
  - Charset : Toujours `utf8` via `SET NAMES utf8`.
- **Sécurité** :
  - Vérification systématique du hash SHA-1 et de `$GETsalt` dans `api/get.php` pour interdire la lecture arbitraire de fichiers hors du catalogue autorisé.
  - Nettoyage des entrées avec `intval()`, `htmlspecialchars()` et `addslashes()` (ou requêtes préparées PDO pour tout nouveau développement).

### Frontend (JavaScript)
- **Paradigme** : Vanilla JavaScript orienté objet façon prototype (ES5 compatible, sans transpilation ni bundler complexe) adossé à jQuery 3.5.1 pour les sélecteurs DOM.
- **Nommage** :
  - Classes du moteur préfixées par `YDKJ` (ex: `YDKJGame`, `YDKJAnimation`, `YDKJAPI`, `YDKJFont`).
  - Classes de mode préfixées par `Mode` (ex: `ModeCategory`, `ModeQuestion`).
  - Méthodes et propriétés en `camelCase`.
- **Conservation du contexte (`this`)** :
  - Assigner `var thisGame = this;` ou `var thisMode = this;` au sommet des fonctions constructrices et méthodes pour garantir la persistance du contexte dans les callbacks asynchrones.
- **Cycle de vie asynchrone** :
  - Implémenter systématiquement `preload(resources)`, `start()` et `free()` sur tout nouveau composant ou mode de jeu.
  - Toujours invoquer `game.api.unregisteraction()` avant d'enregistrer les écouteurs d'un nouveau tour pour éviter les écoutes fantômes et les doubles soumissions de buzz.
- **Gestion du temps et arrière-plan** :
  - Les animations et décomptes reposent sur `HackTimer.min.js`. Ne jamais utiliser de timers bruts qui se font geler lorsque l'onglet du navigateur perd le focus.
  - L'intervalle standard d'animation est calé à `jQuery.fx.interval = 66` ms (environ 15 images/seconde, fidèle au moteur original).
- **Rendu typographique** :
  - L'affichage de textes dynamiques dans le canvas de jeu passe par l'objet `YDKJFont` qui applique les largeurs et métriques personnalisées des fontes rétro (`JackCondensed`, `JackInput`, etc.).

### Rendu visuel et CSS
- **Format d'affichage fixe & Fullscreen** :
  - Le conteneur du jeu `#screen` mesure strictement **640x480 pixels**.
  - Le mode plein écran (`fullscreen`) s'effectue via calcul d'échelle CSS : `transform: scale(zoom, zoom)` centré au milieu de la fenêtre avec fond noir, préservant strictement le ratio 4:3 sans déformation.
- **Désactivation de la sélection** :
  - La sélection de texte est désactivée par défaut dans `#screen` (`user-select: none`) pour procurer un ressenti pur d'application native de jeu vidéo.

---

## 6. Outils de débogage et environnements de test

- **Débogage de mode ou de question ciblée** :
  - Utiliser la page `toolbox/gamedebug.php` pour forcer les options de débogage (via cookie `ydkj_debug`) : choix direct du mode (`Category`, `R1WrapUp`), du numéro de question, de la catégorie (1, 2, 3) ou du type de question spéciale (`DisOrDat` ou `Gibberish`).
- **Inspection des ressources et animations** :
  - Utiliser `toolbox/readres.html` pour inspecter les sprites d'animation, vérifier les coordonnées X/Y, les timings et l'alignement des polices.
- **Vérification audio** :
  - Utiliser `toolbox/test-audio.php` pour tester la validité des flux audio et le support HTTP 206 Partial Content.

---

## 7. Directives impératives pour les agents IA

1. **Ne pas introduire de framework frontend lourd** : Ne pas migrer vers React, Vue, Next.js ou Tailwind sans demande explicite du propriétaire du projet. Le code existant est optimisé pour du Vanilla JS / jQuery ultra-léger et autonome.
2. **Respecter la base statique** : Ne jamais modifier manuellement les données de la base statique sans passer par les scripts de la `toolbox/` ou fournir un script SQL de migration versionné (`ydkjfr_sta_vX.sql`).
3. **Protection des secrets locaux** : Ne jamais versionner ni divulguer les mots de passe et configurations situés dans `api/local/` ou `toolbox/mysql-data.inc.php`. Toujours s'appuyer sur les fichiers d'exemple `mysql-data.sample.inc.php`.
4. **Architecture réseau temps réel** : Les échanges multijoueurs (lobby, buzzers, réponses, synchronisation) transitent exclusivement par le serveur WebSocket Tornado (`ydkj_server.py`). Le mode local autonome s'exécute en boucle locale interne sans dépendance réseau.
5. **Sobriété des données et non-redondance stricte** : Éviter formellement de doublonner les informations inutilement dans les messages et les structures (ex: pas de champ `status: 'lobby'` dans un événement déjà nommé `lobby_state`, pas de liste `participants` si elle est déductible de `clients`). Ne transmettre ou stocker une information QUE si le code consommateur s'en sert réellement et qu'il est impossible de la déterminer autrement.
