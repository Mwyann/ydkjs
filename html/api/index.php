<?php

require_once 'local/config.inc.php';
require_once 'common.inc.php';
require_once 'mysql.inc.php';
require_once 'JSON.php';

// Gestion de la session
session_readonly();
// Numéro de session et mode de la session (local ou en ligne)
$session_id = -1;
$localMode = 0;
if (isset($_SESSION['session_id'])) $session_id = intval($_SESSION['session_id']);
if ($session_id <= 0) { // Si pas de numéro de session renseigné, on en génère un aléatoirement et on reste en mode local
    $session_id = rand(1000000,999999999);
    $localMode = 1;
}
$player_id = 0;
if (isset($_SESSION['player_id'])) $player_id = intval($_SESSION['player_id']);
$players_ids = '';
if (isset($_SESSION['players_ids'])) $players_ids = $_SESSION['players_ids'];
// Nombre de joueurs
$nbplayers = 3; // CONSTANTE POUR LE MOMENT
if (isset($_SESSION['nbplayers'])) $nbplayers = $_SESSION['nbplayers'];
if (($nbplayers == 1) && ($players_ids == '')) $localMode = 1; // 1 joueur, pas de mode spectateur = mode local forcé, pas besoin de faire appel au serveur quand on joue en solo...

$player1 = '';
if (isset($_SESSION['player1'])) $player1 = htmlspecialchars(substr(trim($_SESSION['player1']),0,20));
$player2 = '';
if (isset($_SESSION['player2'])) $player2 = htmlspecialchars(substr(trim($_SESSION['player2']),0,20));
$player3 = '';
if (isset($_SESSION['player3'])) $player3 = htmlspecialchars(substr(trim($_SESSION['player3']),0,20));

srand($session_id*130);

if (!isset($_POST['call'])) die('API ready 1');
$call = $_POST['call'];

function uriToUid($uri) {
    global $GETsalt;
    $base64 = base64_encode($uri);
    return 'api/get.php?uid='.$base64.sha1($base64.$GETsalt).'&type=';
}

function shuffle_rand(&$array) {
    $newarray = array();
    $oldarray = array_values($array); // Clean keys
    while (sizeof($oldarray) > 1) {
        $rand = rand(0,sizeof($oldarray)-1);
        array_push($newarray,$oldarray[$rand]);
        array_splice($oldarray,$rand,1);
    }
    if (sizeof($oldarray) > 0) array_push($newarray,$oldarray[0]);
    $array = $newarray;
}

function gameinfo() {
    global $VERSION, $nbplayers, $localMode, $player1, $player2, $player3;
    $players = array();
    $locale = '';
    $engineVersion = 2;
    $noms = array('Player 1', 'Player 2', 'Player 3');
    switch($VERSION) {
        case 'fr':  $noms = array('Joueur 1', 'Joueur 2', 'Joueur 3');
                    $locale = 'fr_FR';
                    $engineVersion = 2;
                    break;
        case 'uk':  $noms = array('Player 1', 'Player 2', 'Player 3');
                    $locale = 'en_GB';
                    $engineVersion = 2;
                    break;
        case 'de1': $noms = array('Kandidat 1', 'Kandidat 2', 'Kandidat 3');
                    $locale = 'de_DE';
                    $engineVersion = 2;
                    break;
    }
    if ($player1 != '') $noms[0] = $player1;
    if ($player2 != '') $noms[1] = $player2;
    if ($player3 != '') $noms[2] = $player3;
    if ($nbplayers == 1)
        $players = array(
            array('name' => $noms[0],'score' => 0,'keycode' => 98), // Si on fournit un keycode, cela veut dire que le joueur est contrôlable en local (sinon, renvoyer "0" ou rien du tout)
        );
    if ($nbplayers == 2)
        $players = array(
            array('name' => $noms[0],'score' => 0,'keycode' => 113), // Ou alors on met un nouveau paramètre 'localplayer', plus explicite, au choix.
            array('name' => $noms[1],'score' => 0,'keycode' => 112)
        );
    if ($nbplayers == 3)
        $players = array(
            array('name' => $noms[0],'score' => 0,'keycode' => 113),
            array('name' => $noms[1],'score' => 0,'keycode' => 98),
            array('name' => $noms[2],'score' => 0,'keycode' => 112)
        );

    header('X-JSON: '.json_encode(array(
            'players' => $players,
            'locale' => $locale,
            'engineVersion' => $engineVersion,
            'localMode' => $localMode
        )));
}

// Retourne les paramètres du prochain mode de jeu
function gamemode() {
    global $nbplayers;
    if (!isset($_POST['currentmode'])) die('Gamemode 1');
    $currentmode = $_POST['currentmode'];
    $newmode = array();
    switch ($currentmode) {
        case 'None': $newmode = array('mode' => 'Intro'); break;
        //case 'None': $newmode = array('mode' => 'Category', 'category' => 1, 'questionnumber' => 7, 'chooseplayer' => rand(1,$nbplayers)); break; // Ligne DEBUG
        case 'Intro': $newmode = array('mode' => 'Category', 'category' => 1, 'questionnumber' => 1, 'chooseplayer' => rand(1,$nbplayers)); break;
        case 'Category':
            if (!isset($_POST['category'])) die('Gamemode 2');
            $category = $_POST['category'];
            if (!isset($_POST['questionnumber'])) die('Gamemode 2');
            $questionnumber = $_POST['questionnumber'];
            $newmode = array('mode' => 'Category', 'category' => $category, 'questionnumber' => $questionnumber); break;
        case 'JackAttack': $newmode = array('mode' => 'End'); break;
    }
    header('X-JSON: '.json_encode(array(
            'newmode' => $newmode
        )));
}

// Fonction qui renvoie un tableau JSON avec la liste des ressources et des URLS à aller chercher
function resources() {
    global $DB, $DBsta, $DBdyn, $DEMOMODE, $VERSION, $nbplayers, $session_id;
    $reslist = array();
    connectMysql();

    if (!isset($_POST['mode'])) die('Resources 1');
    $mode = $_POST['mode'];

    /*********** MODE INTRO ***********/
    if ($mode == 'Intro') {
        $intro = rand(1,4); // Choix aléatoire parmi 4 intros différentes (le Jack qui casse)
        $pretitle = rand(1,11); // Choix aléatoire parmi 11 pré-titres différents (les deux lignes avant le logo)

        $reslist = array();

        // Sélection des animations
        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".resani a, ".$DBsta.".resfiles f
                           WHERE a.resid = f.resid
                           AND grp = 'Intro'");
        while ($rs = $res->fetch()) {
            if (($rs['variantType'] == 'NumberOfPlayers') && ($rs['variantValue'] != $nbplayers)) continue; // Ignorer ce qui ne correspond pas au bon nombre de joueurs

            // Sélection du pré-titre
            if (substr($rs['name'],0,13) == 'IntroPreTitle') {
                if ($rs['name'] == 'IntroPreTitle'.$pretitle.'.1') $rs['name'] = 'IntroPreTitle1';
                elseif ($rs['name'] == 'IntroPreTitle'.$pretitle.'.2') $rs['name'] = 'IntroPreTitle2';
                else continue;
            }

            // Sélection de l'intro
            if (substr($rs['name'],0,9) == 'IntroJack') {
                if ($rs['name'] == 'IntroJack'.$intro) $rs['name'] = 'IntroJack';
                else continue;
            }
            if (substr($rs['name'],0,8) == 'JackLogo') {
                if ($rs['name'] == 'JackLogo'.$intro) $rs['name'] = 'JackLogo';
                else continue;
            }

            // Construction du tableau correspondant à l'animation
            $r = array(
                'urlGif' => uriToUid('res-full/'.$rs['filename'].'.gif'),
                'urlJS' => uriToUid('res-full/'.$rs['filename'].'.js'),
                'framestart' => $rs['framestart']
            );
            if ($rs['framestop'] !== null) $r['framestop'] = $rs['framestop'];
            if ($rs['loopani']) $r['loop'] = $rs['loopani'];
            $reslist[$rs['grp'].'/'.$rs['name']] = $r;
        }

        // Sélection des sons
        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".ressnd
                           WHERE grp = 'Intro'");
        while ($rs = $res->fetch()) {
            if (($rs['variantType'] == 'NumberOfPlayers') && ($rs['variantValue'] != $nbplayers)) continue; // Ignorer ce qui ne correspond pas au bon nombre de joueurs

            // Choisir une valeur au hasard parmi la liste de choix possibles.
            $names = array($rs['name']);

            $possiblevalues = explode(',',$rs['val']);
            if (sizeof($possiblevalues) > 1) shuffle_rand($possiblevalues);

            foreach($names as $idname => $name) {
                $key = $rs['grp'] . '/' . $name;
                if (!isset($reslist[$key])) {
                    if ((substr($name, 0, 3) == 'SFX') && (isset($reslist[$rs['grp'] . '/' . substr($name, 3)]))) $key = $rs['grp'] . '/' . substr($name, 3);
                    else $reslist[$key] = array();
                }

                if ($key == 'Intro/IntroJackSound') $possiblevalues = array($intro);

                $reslist[$key]['urlAudio'] = uriToUid('res-full/' . $rs['resfolder'] . '/' . $possiblevalues[$idname]);
                if ($rs['loopsnd']) $reslist[$key]['loop'] = $rs['loopsnd'];
            }
        }
    }

    /********** CHOIX D'UNE CATEGORIE ***********/
    if ($mode == 'Category') {
        if (!isset($_POST['category'])) die('Resources 2');
        $category = $_POST['category'];
        if (!isset($_POST['questionnumber'])) die('Resources 2');
        $questionnumber = $_POST['questionnumber'];
        srand(($session_id+99)*$questionnumber); // Initialisation du générateur de nombre aléatoire de la même manière pour tout le monde
        $playersolo = 0;
        if ($nbplayers == 1) $playersolo = 1;

        $reslist = array();
        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".resani a, ".$DBsta.".resfiles f
                           WHERE a.resid = f.resid
                           AND grp = 'Category'");
        while ($rs = $res->fetch()) {
            if (($rs['variantType'] == 'CategoryNumber') && ($rs['variantValue'] != $category)) continue; // On ne prend que ce qui correspond au numéro de catégorie en cours

            $r = array(
                'urlGif' => uriToUid('res-full/'.$rs['filename'].'.gif'),
                'urlJS' => uriToUid('res-full/'.$rs['filename'].'.js'),
                'framestart' => $rs['framestart']
            );
            if ($rs['framestop'] !== null) $r['framestop'] = $rs['framestop'];
            if ($rs['loopani']) $r['loop'] = $rs['loopani'];
            $reslist[$rs['grp'].'/'.$rs['name']] = $r;
        }

        $grooves = rand(1,12);

        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".ressnd
                           WHERE grp = 'Category'");
        while ($rs = $res->fetch()) {
            if (($rs['variantType'] == 'PlayerSolo') && ($rs['variantValue'] != $playersolo)) continue; // Uniquement ce qui correspond à un joueur

            $possiblevalues = explode(',',$rs['val']);
            if (sizeof($possiblevalues) > 1) shuffle_rand($possiblevalues);

            if (strpos($rs['resfolder'], 'GROOVES/GROOVE%') === 0) {
                $rs['resfolder'] = str_replace('%',str_pad($grooves,2,'0',STR_PAD_LEFT),$rs['resfolder']);
            }

            $key = $rs['grp'].'/'.$rs['name'];
            if (!isset($reslist[$key])) {
                if ((substr($rs['name'],0,3) == 'SFX') && (isset($reslist[$rs['grp'].'/'.substr($rs['name'],3)]))) $key = $rs['grp'].'/'.substr($rs['name'],3);
                else $reslist[$key] = array();
            }
            $reslist[$key]['urlAudio'] = uriToUid('res-full/'.$rs['resfolder'].'/'.$possiblevalues[0]);
            if ($rs['loopsnd']) $reslist[$key]['loop'] = $rs['loopsnd'];
        }

        $reslist['questiontitles'] = array();

        $demo = '';
        if ($questionnumber == 7) {
            if ($DEMOMODE) {
                switch ($VERSION) {
                    case 'fr': $demo = "AND id LIKE 'JC_'"; break;
                    case 'uk': $demo = "AND id LIKE 'JG_'"; break;
                    case 'de1': $demo = "AND id LIKE 'JC_'"; break;
                }
            }
            $res = $DB->query("SELECT *
                               FROM ".$DBsta.".qhdr
                               WHERE qtype = 'JackAttack'
                               ".$demo."
                               ORDER BY MD5(CONCAT(id,".rand(1,999999)."))
                               LIMIT 0,3");
        } elseif ($questionnumber == 4) {
            if ($DEMOMODE) {
                switch ($VERSION) {
                    case 'fr': $demo = "AND id LIKE 'DB_'"; break;
                    case 'uk': $demo = "AND id LIKE 'DD_'"; break;
                    case 'de1': $demo = "AND id LIKE 'PB_'"; break;
                }
            }
            $res = $DB->query("SELECT *
                               FROM ".$DBsta.".qhdr
                               WHERE qtype = 'DisOrDat'
                               ".$demo."
                               ORDER BY MD5(CONCAT(id,".rand(1,999999)."))
                               LIMIT 0,3");
        } else {
            if ($DEMOMODE) {
                switch ($VERSION) {
                    case 'fr': $demo = "AND (id LIKE 'AA_' OR id LIKE 'AB_')"; break;
                    case 'uk': $demo = "AND (id LIKE 'AA_' OR id LIKE 'AB_')"; break;
                    case 'de1': $demo = "AND (id LIKE 'AA_' OR id LIKE 'AB_')"; break;
                }
            }
            $res = $DB->query("SELECT *
                               FROM ".$DBsta.".qhdr
                               WHERE qtype = 'Question'
                               AND qsubtype = 'Normal'
                               ".$demo."
                               AND NOT EXISTS (SELECT * FROM ".$DBsta.".qhdr a WHERE qhdr.id = a.forcenext)
                               ORDER BY MD5(CONCAT(id,".rand(1,999999)."))
                               LIMIT 0,3");
        }
        $c = 0;
        while ($rs = $res->fetch()) {
            $reslist['questiontitles'][$c] = $rs['title'];
            $reslist['question'.($c+1)] = $rs['id'];
            $reslist['questiontype'.($c+1)] = $rs['qtype'];
            $c++;
        }
    }

    /********** QUESTION *********/
    if ($mode == 'Question') {
        if (!isset($_POST['category'])) die('Resources 2');
        $category = $_POST['category'];
        if (!isset($_POST['questionnumber'])) die('Resources 2');
        $questionnumber = $_POST['questionnumber'];
        srand(($session_id+50)*$questionnumber); // Initialisation du générateur de nombre aléatoire de la même manière pour tout le monde
        if (!isset($_POST['id'])) die('Resources 2');
        $id = $_POST['id'];

        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".qhdr q, ".$DBsta.".strings s
                           WHERE id = '".addslashes($id)."'
                           AND q.folder = s.folder");
        $qhdr = $res->fetch();
        $questionvalue = number_format(1000*$qhdr['value']*$category,0,'','');
        $questionnumbertmp = $questionnumber;
        if ($questionnumber > 10) $questionnumbertmp = 10;
        $playersolo = 0;
        if ($nbplayers == 1) $playersolo = 1;

        // Choix parmi les 2-3 jingles
        if ($questionnumber <= 6) $jinglequestion = rand(1,3); else $jinglequestion = rand(1,2);
        $music = rand(1,6); // Choix parmi les 6 musiques

        $reslist = array('value' => $questionvalue);
        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".resani a, ".$DBsta.".resfiles f
                           WHERE a.resid = f.resid
                           AND grp = 'Question'");
        while ($rs = $res->fetch()) {
            if ($rs['variantType'] == 'QuestionDemo') continue;
            if ($rs['variantType'] == 'QuestionNumber') if ($rs['variantValue'] != $questionnumbertmp) continue;
            if (($rs['variantType'] == 'QuestionValue') && ($rs['variantValue'] != $questionvalue)) continue;
            if (($rs['variantType'] == 'NumberOfPlayers') && ($rs['variantValue'] != $nbplayers)) continue;

            // Choix parmi les 2-3 jingles
            if (strpos($rs['name'], 'JingleQuestion') === 0) if ($rs['name'] != 'JingleQuestion'.$jinglequestion) continue; else $rs['name'] = 'JingleQuestion';
            if (strpos($rs['name'], 'BGQuestion') === 0) if ($rs['name'] != 'BGQuestion'.$jinglequestion) continue; else $rs['name'] = 'BGQuestion';

            $r = array(
                'urlGif' => uriToUid('res-full/'.$rs['filename'].'.gif'),
                'urlJS' => uriToUid('res-full/'.$rs['filename'].'.js'),
                'framestart' => $rs['framestart']
            );
            if ($rs['framestop'] !== null) $r['framestop'] = $rs['framestop'];
            if ($rs['loopani']) $r['loop'] = $rs['loopani'];
            $reslist[$rs['grp'].'/'.$rs['name']] = $r;
        }

        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".ressnd
                           WHERE grp = 'Question'");
        while ($rs = $res->fetch()) {
            if ($rs['variantType'] == 'QuestionNumber') if ($rs['variantValue'] != $questionnumbertmp) continue;
            if (strpos($rs['name'], 'JingleQuestion') === 0) if ($rs['name'] != 'JingleQuestion'.$jinglequestion) continue; else $rs['name'] = 'JingleQuestion';
            if (($rs['variantType'] == 'NumberOfPlayers') && ($rs['variantValue'] != $nbplayers)) continue;
            if (($rs['variantType'] == 'PlayerSolo') && ($rs['variantValue'] != $playersolo)) continue;
            if (($rs['variantType'] == 'QuestionValue') && ($rs['variantValue'] != $questionvalue)) continue;

            if (($rs['name'] == 'JingleReadQuestion') || ($rs['name'] == 'JingleTimer')) $possiblevalues = array($music);
            else {
                $possiblevalues = explode(',',$rs['val']);
                if (sizeof($possiblevalues) > 1) shuffle_rand($possiblevalues);
            }

            $names = array($rs['name']);
            if ($rs['name'] == 'SFXWrongAnswer') $names = array($rs['name'].'1', $rs['name'].'2', $rs['name'].'3', $rs['name'].'4');
            if ($rs['name'] == 'TimeOut') $names = array($rs['name'].'1', $rs['name'].'2', $rs['name'].'3');

            foreach($names as $idname => $name) {
                $key = $rs['grp'] . '/' . $name;
                if (!isset($reslist[$key])) {
                    if ((substr($name, 0, 3) == 'SFX') && (isset($reslist[$rs['grp'] . '/' . substr($name, 3)]))) $key = $rs['grp'] . '/' . substr($name, 3);
                    else $reslist[$key] = array();
                }
                $reslist[$key]['urlAudio'] = uriToUid('res-full/' . $rs['resfolder'] . '/' . $possiblevalues[$idname]);
                if ($rs['loopsnd']) $reslist[$key]['loop'] = $rs['loopsnd'];
            }
        }

        unset($reslist['Question/DefaultPreQuestion']);
        unset($reslist['Question/DefaultWrongAnswer']);
        //unset($reslist['Question/DefaultRevealLastAnswer']);
        //unset($reslist['Question/DefaultRevealFreeAnswer']);
        unset($reslist['Question/DefaultRevealAnswer']);

        function PickAnySnd($grp,$type) {
            global $DB, $DBsta;
            $res = $DB->query("SELECT *
                               FROM ".$DBsta.".ressnd
                               WHERE grp = '".addslashes($grp)."'
                               AND name = '".addslashes($type)."'");
            while ($rs = $res->fetch()) {
                $possiblevalues = explode(',',$rs['val']);
                if (sizeof($possiblevalues) > 1) shuffle_rand($possiblevalues);

                $result['urlAudio'] = uriToUid('res-full/'.$rs['resfolder'].'/'.$possiblevalues[0]);
                if ($rs['loopsnd']) $result['loop'] = $rs['loopsnd'];
                return $result;
            }
            return array();
        }

        $reslist['Question/QuestionTitle'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/1'));

        $PreQuestion = 'res-full/'.$qhdr['folder'].'/snd/2';
        if (file_exists('../'.$PreQuestion.'.ogg')) $reslist['Question/PreQuestion'] = array('urlAudio' => uriToUid($PreQuestion));
        else $reslist['Question/PreQuestion'] = PickAnySnd('Question','DefaultPreQuestion');

        $reslist['Question/Question'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/3'));
        $reslist['Question/Answers'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/5'));
        $EndQuestion = 'res-full/'.$qhdr['folder'].'/snd/6';
        if (file_exists('../'.$EndQuestion.'.ogg')) $reslist['Question/EndQuestion'] = array('urlAudio' => uriToUid($EndQuestion));
        else $reslist['Question/EndQuestion'] = array();

        $reslist['correctanswerisdefault'] = 0;
        for($i = 1; $i <= 4; $i++) {
            $Answer = 'res-full/'.$qhdr['folder'].'/snd/'.($i+6);
            if (file_exists('../'.$Answer.'.ogg')) $reslist['Question/Answer'.$i] = array('urlAudio' => uriToUid($Answer));
            else if ($i != $qhdr['answer']) $reslist['Question/Answer'.$i] = PickAnySnd('Question','DefaultWrongAnswer');
            else {
                $reslist['Question/Answer'.$i] = PickAnySnd('Question','DefaultGoodAnswer');
                $reslist['correctanswerisdefault'] = 1;
            }
        }

        $RevealAnswer = 'res-full/'.$qhdr['folder'].'/snd/11';
        if (file_exists('../'.$RevealAnswer.'.ogg')) $reslist['Question/AboutToRevealAnswer'] = array('urlAudio' => uriToUid($RevealAnswer));
        else $reslist['Question/AboutToRevealAnswer'] = PickAnySnd('Question','DefaultRevealAnswer');

        $reslist['STR'] = $qhdr['strings'];
        $reslist['correctanswer'] = $qhdr['answer'];
    }

    /********* COUCI-COUCA **********/
    if ($mode == 'DisOrDat') {
        if (!isset($_POST['category'])) die('Resources 2');
        $category = $_POST['category'];
        if (!isset($_POST['id'])) die('Resources 2');
        $id = $_POST['id'];

        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".qhdr q, ".$DBsta.".strings s
                           WHERE id = '".addslashes($id)."'
                           AND q.folder = s.folder");
        $qhdr = $res->fetch();
        $questionvalue = number_format(500*$category,0,'','');
        $json = new Services_JSON();
        $strings = $json->decode($qhdr['strings']);
        $nbanswers = 2;
        foreach($strings as $str) if ($str->id == 4) {
            foreach($str->data as $d) if ($d == 3) $nbanswers = 3;
        }

        $reslist = array('value' => $questionvalue);
        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".resani a, ".$DBsta.".resfiles f
                           WHERE a.resid = f.resid
                           AND grp = 'DisOrDat'");
        while ($rs = $res->fetch()) {
            if (($rs['variantType'] == 'NumberOfAnswers') && ($rs['variantValue'] != $nbanswers)) continue;
            if (($rs['variantType'] == 'QuestionValue') && ($rs['variantValue'] != $questionvalue)) continue;

            $r = array(
                'urlGif' => uriToUid('res-full/'.$rs['filename'].'.gif'),
                'urlJS' => uriToUid('res-full/'.$rs['filename'].'.js'),
                'framestart' => $rs['framestart']
            );
            if ($rs['framestop'] !== null) $r['framestop'] = $rs['framestop'];
            if ($rs['loopani']) $r['loop'] = $rs['loopani'];
            $reslist[$rs['grp'].'/'.$rs['name']] = $r;
        }

        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".ressnd
                           WHERE grp = 'DisOrDat'
                           OR (grp = 'Question' AND name IN ('SFXPlayerCorrect','SFXPlayerLose'))");
        while ($rs = $res->fetch()) {
            if (($rs['variantType'] == 'NumberOfPlayers') && ($rs['variantValue'] != $nbplayers)) continue;
            if (($rs['variantType'] == 'QuestionValue') && ($rs['variantValue'] != $questionvalue)) continue;

            $names = array($rs['name']);

            $possiblevalues = explode(',',$rs['val']);
            if (sizeof($possiblevalues) > 1) shuffle_rand($possiblevalues);

            foreach($names as $idname => $name) {
                $key = $rs['grp'] . '/' . $name;
                if (!isset($reslist[$key])) {
                    if ((substr($name, 0, 3) == 'SFX') && (isset($reslist[$rs['grp'] . '/' . substr($name, 3)]))) $key = $rs['grp'] . '/' . substr($name, 3);
                    else $reslist[$key] = array();
                }

                $reslist[$key]['urlAudio'] = uriToUid('res-full/' . $rs['resfolder'] . '/' . $possiblevalues[$idname]);
                if ($rs['loopsnd']) $reslist[$key]['loop'] = $rs['loopsnd'];
            }
        }

        $reslist['DisOrDat/QuestionTitle'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/1'));
        $reslist['DisOrDat/QuestionIntro1'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/2'));
        $reslist['DisOrDat/QuestionIntro2'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/3'));
        $reslist['DisOrDat/QuestionAnswer1'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/4'));
        $reslist['DisOrDat/QuestionAnswer2'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/5'));
        $reslist['DisOrDat/Question1'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/6'));
        $reslist['DisOrDat/Question2'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/7'));
        $reslist['DisOrDat/Question3'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/8'));
        $reslist['DisOrDat/Question4'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/9'));
        $reslist['DisOrDat/Question5'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/10'));
        $reslist['DisOrDat/Question6'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/11'));
        $reslist['DisOrDat/Question7'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/12'));

        $reslist['DisOrDat/Public0on7'] = $reslist['DisOrDat/Public0on7'.rand(1,3)];
        unset($reslist['DisOrDat/Public0on71']);
        unset($reslist['DisOrDat/Public0on72']);
        unset($reslist['DisOrDat/Public0on73']);
        $reslist['DisOrDat/Public7on7'] = $reslist['DisOrDat/Public7on7'.rand(1,3)];
        unset($reslist['DisOrDat/Public7on71']);
        unset($reslist['DisOrDat/Public7on72']);
        unset($reslist['DisOrDat/Public7on73']);
        $reslist['DisOrDat/RestartSkipped'] = $reslist['DisOrDat/RestartSkipped'.rand(1,2)];
        unset($reslist['DisOrDat/RestartSkipped1']);
        unset($reslist['DisOrDat/RestartSkipped2']);

        $reslist['STR'] = $qhdr['strings'];
    }

    /*********** JACK ATTACK ************/
    if ($mode == 'JackAttack') {
        if (!isset($_POST['category'])) die('Resources 2');
        $category = $_POST['category'];
        if (!isset($_POST['id'])) die('Resources 2');
        $id = $_POST['id'];
        $skiprules = rand(1,12);
        $playersolo = 0;
        if ($nbplayers == 1) $playersolo = 1;

        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".qhdr q, ".$DBsta.".strings s
                           WHERE id = '".addslashes($id)."'
                           AND q.folder = s.folder");
        $qhdr = $res->fetch();

        $reslist = array('title' => $qhdr['title']);
        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".resani a, ".$DBsta.".resfiles f
                           WHERE a.resid = f.resid
                           AND grp = 'JackAttack'");
        while ($rs = $res->fetch()) {
            if (($rs['variantType'] == 'CategoryNumber') && ($rs['variantValue'] != $category)) continue;

            // Cas particulier pour les joueurs : en mode solo, on prend le joueur du milieu (Player2), en deux joueurs on prend les extrémités (Player1 et Player3), et en 3 joueurs bah on prend les 3 bien sûr.
            if ((substr($rs['name'],0,7) == 'Player1') && ($nbplayers == 1)) continue; // On ignore le Player1 en mode un joueur (dingue non ?)
            if ((substr($rs['name'],0,7) == 'Player2') && ($nbplayers == 2)) continue; // On ignore le Player2 en mode deux joueurs (ce mec est fou)
            if ((substr($rs['name'],0,7) == 'Player2') && ($nbplayers == 1)) $rs['name'] = str_replace('Player2','Player1',$rs['name']); // Mais en mode solo, le Player2 devient le Player1.
            if ((substr($rs['name'],0,7) == 'Player3') && ($nbplayers == 1)) continue; // On ignore le Player3 en solo (ha enfin quelque chose de sensé)
            if ((substr($rs['name'],0,7) == 'Player3') && ($nbplayers == 2)) $rs['name'] = str_replace('Player3','Player2',$rs['name']); // Et enfin, à deux, le Player3 devient le Player2.

            if ((substr($rs['name'],0,12) == 'ShowSkipText') || (substr($rs['name'],0,12) == 'HideSkipText')) {
                if ($rs['name'] == 'ShowSkipText'.$skiprules) $rs['name'] = 'ShowSkipText';
                elseif ($rs['name'] == 'HideSkipText'.$skiprules) $rs['name'] = 'HideSkipText';
                else continue;
            }

            $r = array(
                'urlGif' => uriToUid('res-full/'.$rs['filename'].'.gif'),
                'urlJS' => uriToUid('res-full/'.$rs['filename'].'.js'),
                'framestart' => $rs['framestart']
            );
            if ($rs['framestop'] !== null) $r['framestop'] = $rs['framestop'];
            if ($rs['loopani']) $r['loop'] = $rs['loopani'];
            $reslist[$rs['grp'].'/'.$rs['name']] = $r;
        }

        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".ressnd
                           WHERE grp = 'JackAttack'");
        while ($rs = $res->fetch()) {
            if (($rs['variantType'] == 'PlayerSolo') && ($rs['variantValue'] != $playersolo)) continue;

            $names = array($rs['name']);
            if ($rs['name'] == 'PlayersScream') $names = array('PlayersScream1', 'PlayersScream2', 'PlayersScream3');

            $possiblevalues = explode(',',$rs['val']);
            if (sizeof($possiblevalues) > 1) shuffle_rand($possiblevalues);

            foreach($names as $idname => $name) {
                $key = $rs['grp'] . '/' . $name;
                if (!isset($reslist[$key])) {
                    if ((substr($name, 0, 3) == 'SFX') && (isset($reslist[$rs['grp'] . '/' . substr($name, 3)]))) $key = $rs['grp'] . '/' . substr($name, 3);
                    else $reslist[$key] = array();
                }

                $reslist[$key]['urlAudio'] = uriToUid('res-full/' . $rs['resfolder'] . '/' . $possiblevalues[$idname]);
                if ($rs['loopsnd']) $reslist[$key]['loop'] = $rs['loopsnd'];
            }
        }


        $reslist['JackAttack/RipBG'] = $reslist['JackAttack/RipBG'.rand(1,2)];
        unset($reslist['JackAttack/RipBG1']);
        unset($reslist['JackAttack/RipBG2']);

        $reslist['JackAttack/IntroLaunch'] = $reslist['JackAttack/IntroLaunch1'];
        unset($reslist['JackAttack/IntroLaunch1']);
        unset($reslist['JackAttack/IntroLaunch2']);
        unset($reslist['JackAttack/IntroLaunch3']);

        $reslist['JackAttack/IntroRound'] = $reslist['JackAttack/IntroRound'.rand(1,3)];
        unset($reslist['JackAttack/IntroRound1']);
        unset($reslist['JackAttack/IntroRound2']);
        unset($reslist['JackAttack/IntroRound3']);

        $reslist['JackAttack/Example'] = $reslist['JackAttack/Example'.rand(1,3)];
        unset($reslist['JackAttack/Example1']);
        unset($reslist['JackAttack/Example2']);
        unset($reslist['JackAttack/Example3']);

        $reslist['JackAttack/NoExplain'] = $reslist['JackAttack/NoExplain1Player'];
        unset($reslist['JackAttack/NoExplain1Player']);
        unset($reslist['JackAttack/NoExplain23Players']);

        $reslist['JackAttack/TheClue'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/2'));

        $reslist['randseed'] = rand(1,9999999);

        $reslist['STR'] = $qhdr['strings'];
    }

    /*********** SCORES ***********/
    if ($mode == 'End') {
        $reslist = array();
        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".resani a, ".$DBsta.".resfiles f
                           WHERE a.resid = f.resid
                           AND grp = 'End'");
        while ($rs = $res->fetch()) {
            $r = array(
                'urlGif' => uriToUid('res-full/'.$rs['filename'].'.gif'),
                'urlJS' => uriToUid('res-full/'.$rs['filename'].'.js'),
                'framestart' => $rs['framestart']
            );
            if ($rs['framestop'] !== null) $r['framestop'] = $rs['framestop'];
            if ($rs['loopani']) $r['loop'] = $rs['loopani'];
            $reslist[$rs['grp'].'/'.$rs['name']] = $r;
        }

        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".ressnd
                           WHERE grp = 'End'");
        while ($rs = $res->fetch()) {
            $names = array($rs['name']);

            $possiblevalues = explode(',',$rs['val']);
            if (sizeof($possiblevalues) > 1) shuffle_rand($possiblevalues);

            foreach($names as $idname => $name) {
                $key = $rs['grp'] . '/' . $name;
                if (!isset($reslist[$key])) {
                    if ((substr($name, 0, 3) == 'SFX') && (isset($reslist[$rs['grp'] . '/' . substr($name, 3)]))) $key = $rs['grp'] . '/' . substr($name, 3);
                    else $reslist[$key] = array();
                }

                $reslist[$key]['urlAudio'] = uriToUid('res-full/' . $rs['resfolder'] . '/' . $possiblevalues[$idname]);
                if ($rs['loopsnd']) $reslist[$key]['loop'] = $rs['loopsnd'];
            }
        }

        $reslist['highscores'] = array();
    }

    /******** BOULE TIMER 10 SECONDES **********/
    if ($mode == 'Timer10') {
        $resName = 'res-full/10TIMER/off4/8018';
        $reslist = array('Common/Timer10' => array('urlGif' => uriToUid($resName.'.gif'), 'urlJS' => uriToUid($resName.'.js'), 'framestart' => 73, 'loop' => 0, 'framestop' => 75),
                         'Common/Timer10/Frames' => array(
                             'Still' => array(
                                 10  => array('framestart' => 69),
                                 9   => array('framestart' => 88),
                                 8   => array('framestart' => 107),
                                 7   => array('framestart' => 125),
                                 6   => array('framestart' => 144),
                                 5   => array('framestart' => 163),
                                 4   => array('framestart' => 182),
                                 3   => array('framestart' => 200),
                                 2   => array('framestart' => 218),
                                 1   => array('framestart' => 236),
                                 0   => array('framestart' => 261)
                             ),
                             'Hide'  => array(
                                 10  => array('framestart' => 73,'framestop' => 75),
                                 9   => array('framestart' => 92,'framestop' => 94),
                                 8   => array('framestart' => 110,'framestop' => 112),
                                 7   => array('framestart' => 129,'framestop' => 131),
                                 6   => array('framestart' => 148,'framestop' => 150),
                                 5   => array('framestart' => 167,'framestop' => 169),
                                 4   => array('framestart' => 185,'framestop' => 187),
                                 3   => array('framestart' => 203,'framestop' => 205),
                                 2   => array('framestart' => 221,'framestop' => 223),
                                 1   => array('framestart' => 239,'framestop' => 241),
                                 0   => array('framestart' => 264,'framestop' => 266)
                             ),
                             'Show'  => array(
                                 10  => array('framestart' => 59,'framestop' => 65),
                                 9   => array('framestart' => 79,'framestop' => 85),
                                 8   => array('framestart' => 98,'framestop' => 104),
                                 7   => array('framestart' => 116,'framestop' => 122),
                                 6   => array('framestart' => 135,'framestop' => 141),
                                 5   => array('framestart' => 154,'framestop' => 160),
                                 4   => array('framestart' => 173,'framestop' => 179),
                                 3   => array('framestart' => 191,'framestop' => 197),
                                 2   => array('framestart' => 209,'framestop' => 215),
                                 1   => array('framestart' => 227,'framestop' => 233),
                                 0   => array('framestart' => 245,'framestop' => 251)
                             )
                         ));
    }

    /******** BOULE TIMER 30 SECONDES **********/
    if ($mode == 'Timer30') {
        $resName = 'res-full/30TIMER/off4/8021';
        $reslist = array('Common/Timer30' => array('urlGif' => uriToUid($resName.'.gif'), 'urlJS' => uriToUid($resName.'.js'), 'framestart' => 79, 'loop' => 0, 'framestop' => 79),
                         'Common/Timer30/Frames' => array(
                             'Still' => array(
                                 30  => array('framestart' => 79),
                                 29  => array('framestart' => 99),
                                 28  => array('framestart' => 118),
                                 27  => array('framestart' => 139),
                                 26  => array('framestart' => 160),
                                 25  => array('framestart' => 180),
                                 24  => array('framestart' => 201),
                                 23  => array('framestart' => 221),
                                 22  => array('framestart' => 241),
                                 21  => array('framestart' => 261),
                                 20  => array('framestart' => 281),
                                 19  => array('framestart' => 300),
                                 18  => array('framestart' => 320),
                                 17  => array('framestart' => 340),
                                 16  => array('framestart' => 360),
                                 15  => array('framestart' => 380),
                                 14  => array('framestart' => 401),
                                 13  => array('framestart' => 421),
                                 12  => array('framestart' => 441),
                                 11  => array('framestart' => 461),
                                 10  => array('framestart' => 481),
                                 9   => array('framestart' => 500),
                                 8   => array('framestart' => 519),
                                 7   => array('framestart' => 537),
                                 6   => array('framestart' => 556),
                                 5   => array('framestart' => 575),
                                 4   => array('framestart' => 594),
                                 3   => array('framestart' => 612),
                                 2   => array('framestart' => 630),
                                 1   => array('framestart' => 648),
                                 0   => array('framestart' => 673)
                             ),
                             'Hide'  => array(
                                 30  => array('framestart' => 83,'framestop' => 85),
                                 29  => array('framestart' => 102,'framestop' => 104),
                                 28  => array('framestart' => 122,'framestop' => 124),
                                 27  => array('framestart' => 144,'framestop' => 146),
                                 26  => array('framestart' => 164,'framestop' => 166),
                                 25  => array('framestart' => 184,'framestop' => 186),
                                 24  => array('framestart' => 205,'framestop' => 207),
                                 23  => array('framestart' => 225,'framestop' => 227),
                                 22  => array('framestart' => 245,'framestop' => 247),
                                 21  => array('framestart' => 265,'framestop' => 267),
                                 20  => array('framestart' => 284,'framestop' => 286),
                                 19  => array('framestart' => 304,'framestop' => 306),
                                 18  => array('framestart' => 324,'framestop' => 326),
                                 17  => array('framestart' => 344,'framestop' => 346),
                                 16  => array('framestart' => 364,'framestop' => 366),
                                 15  => array('framestart' => 384,'framestop' => 386),
                                 14  => array('framestart' => 405,'framestop' => 407),
                                 13  => array('framestart' => 425,'framestop' => 427),
                                 12  => array('framestart' => 445,'framestop' => 447),
                                 11  => array('framestart' => 465,'framestop' => 467),
                                 10  => array('framestart' => 485,'framestop' => 487),
                                 9   => array('framestart' => 504,'framestop' => 506),
                                 8   => array('framestart' => 522,'framestop' => 524),
                                 7   => array('framestart' => 541,'framestop' => 543),
                                 6   => array('framestart' => 560,'framestop' => 562),
                                 5   => array('framestart' => 579,'framestop' => 581),
                                 4   => array('framestart' => 597,'framestop' => 599),
                                 3   => array('framestart' => 615,'framestop' => 617),
                                 2   => array('framestart' => 633,'framestop' => 635),
                                 1   => array('framestart' => 651,'framestop' => 653),
                                 0   => array('framestart' => 676,'framestop' => 678)
                             ),
                             'Show'  => array(
                                 30  => array('framestart' => 79,'framestop' => 79),
                                 29  => array('framestart' => 89,'framestop' => 95),
                                 28  => array('framestart' => 108,'framestop' => 114),
                                 27  => array('framestart' => 128,'framestop' => 134),
                                 26  => array('framestart' => 150,'framestop' => 156),
                                 25  => array('framestart' => 170,'framestop' => 176),
                                 24  => array('framestart' => 190,'framestop' => 196),
                                 23  => array('framestart' => 211,'framestop' => 217),
                                 22  => array('framestart' => 231,'framestop' => 237),
                                 21  => array('framestart' => 251,'framestop' => 257),
                                 20  => array('framestart' => 271,'framestop' => 277),
                                 19  => array('framestart' => 290,'framestop' => 296),
                                 18  => array('framestart' => 310,'framestop' => 316),
                                 17  => array('framestart' => 330,'framestop' => 336),
                                 16  => array('framestart' => 350,'framestop' => 356),
                                 15  => array('framestart' => 370,'framestop' => 376),
                                 14  => array('framestart' => 390,'framestop' => 396),
                                 13  => array('framestart' => 411,'framestop' => 417),
                                 12  => array('framestart' => 431,'framestop' => 437),
                                 11  => array('framestart' => 451,'framestop' => 457),
                                 10  => array('framestart' => 471,'framestop' => 477),
                                 9   => array('framestart' => 491,'framestop' => 497),
                                 8   => array('framestart' => 510,'framestop' => 516),
                                 7   => array('framestart' => 528,'framestop' => 534),
                                 6   => array('framestart' => 547,'framestop' => 553),
                                 5   => array('framestart' => 566,'framestop' => 572),
                                 4   => array('framestart' => 585,'framestop' => 591),
                                 3   => array('framestart' => 603,'framestop' => 609),
                                 2   => array('framestart' => 621,'framestop' => 627),
                                 1   => array('framestart' => 639,'framestop' => 645),
                                 0   => array('framestart' => 657,'framestop' => 663)
                             )
                         ));
    }

    header('X-JSON: '.json_encode(array(
            'reslist' => $reslist,
        )));
}

function getSocket() {
    global $VERSION, $SOCKETPATH, $session_id;
    @$socket = stream_socket_client('unix://'.$SOCKETPATH.'/YDKJ'.$VERSION.$session_id.'.sock',$errno,$errstr,1);

    if (!$socket) {
        exec('/usr/bin/php syncdaemon.php '.$session_id.' > /dev/null &');
        $trials = 50;
        while ((!$socket) && ($trials)) {
            $trials--;
            @$socket = stream_socket_client('unix://'.$SOCKETPATH.'/YDKJ'.$VERSION.$session_id.'.sock', $errno, $errstr, 1);
            if (!$socket) usleep(50000);
        }
        if (!$trials) {
            header('X-JSON: ' . json_encode(array(
                    'error' => 'Couldn\'t connect to the local daemon',
                )));
            die();
        }
    }
    return $socket;
}

function subscribe() {
    global $DB, $session_id;

    // Check en base s'il y a une nouvelle action
    connectMysql('dyn');
    $lastid = intval($_POST['lastid']);
    $actions = array();
    $res = $DB->query("SELECT *
                       FROM actions
                       WHERE session_id = ".$session_id."
                       AND action_id > ".$lastid."
                       LIMIT 0,20");
    if ($res->rowCount() == 0) {
        $DB = null;
        $socket = getSocket();

        stream_set_timeout($socket, 10); // Timeout de 10 secondes.
        fwrite($socket,'0'); // 0 = On se met juste en attente.
        @fread($socket,1); // On attend une action sur le serveur
        @fclose($socket);

        // Check en base s'il y a une nouvelle action
        connectMysql('dyn');
        $lastid = intval($_POST['lastid']);
        $actions = array();
        $res = $DB->query("SELECT *
                           FROM actions
                           WHERE session_id = ".$session_id."
                           AND action_id > ".$lastid."
                           LIMIT 0,20");
    }
    while ($action = $res->fetch()) {
        $data = json_decode($action['actiondata'],true);
        $data['id'] = $action['action_id'];
        array_push($actions,$data);
    }

    header('X-JSON: ' . json_encode(array(
            'actions' => $actions
    )));

    die();
}

function postaction() {
    global $DB, $session_id, $player_id, $players_ids, $nbplayers;
    $data = $_POST['data'];

    if ($players_ids != '') {
        if (strpos($players_ids, '#' . $player_id . '#') === false) { // Si on ne fait pas partie des "joueurs" (donc on est un spectateur), alors on ne participe pas activement à l'action.
            header('X-JSON: ' . json_encode(array(
                    'id' => -1
                )));
            die();
        }
    }

    // TODO Vérifier l'action (à développer dans un second temps)

    if ($data['action'] == 'sync') { // Gérer l'action 'sync'
        $socket = getSocket();
        stream_set_timeout($socket, 10); // Timeout de 10 secondes.
        fwrite($socket,$nbplayers); // n > 1 = On débloque tout le monde dès que n connexions ont envoyé un nombre > 1
        if (fread($socket,1) == $nbplayers) { // On est le dernier : on ajoute l'action en base
            connectMysql('dyn');
            $DB->query("INSERT INTO actions (session_id, player_id, dateaction, actiondata) VALUES (".$session_id.", ".$player_id.", NOW(), '".addslashes(json_encode($data))."')");
        }
        fwrite($socket,'1'); // On valide l'action
        @fclose($socket);

        header('X-JSON: ' . json_encode(array(
                'id' => 0
            )));
        die();
    }

    // Ajouter l'action en base
    connectMysql('dyn');

    $DB->query("INSERT INTO actions (session_id, player_id, dateaction, actiondata) VALUES (".$session_id.", ".$player_id.", NOW(), '".addslashes(json_encode($data))."')");
    $action_id = $DB->lastInsertId();

    // "Réveiller" les autres joueurs pour leur indiquer qu'il y a une nouvelle action à lire
    $socket = getSocket();
    stream_set_timeout($socket, 10); // Timeout de 10 secondes.
    fwrite($socket,'1'); // 1 = On débloque tout le monde immédiatement !
    @fclose($socket);

    header('X-JSON: ' . json_encode(array(
            'id' => $action_id
        )));

    die();
}

switch ($call) {
    case 'gameinfo': gameinfo(); break;
    case 'gamemode': gamemode(); break;
    case 'resources': resources(); break;
    case 'subscribe': subscribe(); break;
    case 'postaction': postaction(); break;
    default: die('API ready 2');
}
