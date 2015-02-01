<?php

require_once 'mysql.inc.php';

if (!isset($_POST['call'])) die('API ready 1');
$call = $_POST['call'];

function uriToUid($uri) {
    global $GETsalt;
    $base64 = base64_encode($uri);
    return 'api/get.php?uid='.$base64.sha1($base64.$GETsalt).'&type=';
}

function gamemode() {
    if (!isset($_POST['currentmode'])) die('Gamemode 1');
    $currentmode = $_POST['currentmode'];
    $newmode = array();
    switch ($currentmode) {
        case 'None': $newmode = array('mode' => 'Intro'); break;
        case 'Intro': $newmode = array('mode' => 'Category', 'category' => 1, 'questionnumber' => 1, 'chooseplayer' => rand(1,3)); break;
        case 'Category':
            if (!isset($_POST['category'])) die('Gamemode 2');
            $category = $_POST['category'];
            if (!isset($_POST['questionnumber'])) die('Gamemode 2');
            $questionnumber = $_POST['questionnumber'];
            $newmode = array('mode' => 'Category', 'category' => $category, 'questionnumber' => $questionnumber); break;
    }
    header('X-JSON: '.json_encode(array(
            'newmode' => $newmode
        )));
}

function resources() {
    global $DB, $DBsta;
    $reslist = array();

    if (!isset($_POST['mode'])) die('Resources 1');
    $mode = $_POST['mode'];

    if ($mode == 'Intro') {
        $intro = rand(1,4);
        $pretitle = rand(1,11);

        $reslist = array();
        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".resani a, ".$DBsta.".resfiles f
                           WHERE a.resid = f.resid
                           AND grp = 'Intro'");
        while ($rs = $res->fetch()) {
            if (substr($rs['name'],0,13) == 'IntroPreTitle') {
                if ($rs['name'] == 'IntroPreTitle'.$pretitle.'.1') $rs['name'] = 'IntroPreTitle1';
                elseif ($rs['name'] == 'IntroPreTitle'.$pretitle.'.2') $rs['name'] = 'IntroPreTitle2';
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

        $reslist['Intro/IntroJack'] = $reslist['Intro/IntroJack'.$intro];
        $reslist['Intro/JackLogo'] = $reslist['Intro/JackLogo'.$intro];
        unset($reslist['Intro/IntroJack1']);
        unset($reslist['Intro/IntroJack2']);
        unset($reslist['Intro/IntroJack3']);
        unset($reslist['Intro/IntroJack4']);
        unset($reslist['Intro/JackLogo1']);
        unset($reslist['Intro/JackLogo2']);
        unset($reslist['Intro/JackLogo3']);
        unset($reslist['Intro/JackLogo4']);

        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".ressnd
                           WHERE grp = 'Intro'");
        while ($rs = $res->fetch()) {
            $names = array($rs['name']);

            $possiblevalues = explode(',',$rs['val']);
            if (sizeof($possiblevalues) > 1) shuffle($possiblevalues);

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

    if ($mode == 'Category') {
        if (!isset($_POST['category'])) die('Resources 2');
        $category = $_POST['category'];
        if (!isset($_POST['questionnumber'])) die('Resources 2');
        $questionnumber = $_POST['questionnumber'];

        $reslist = array();
        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".resani a, ".$DBsta.".resfiles f
                           WHERE a.resid = f.resid
                           AND grp = 'Category'");
        while ($rs = $res->fetch()) {
            if ((strpos($rs['name'],'.C1') !== FALSE) && ($category != 1)) continue; else $rs['name'] = str_replace('.C1','',$rs['name']);
            if ((strpos($rs['name'],'.C2') !== FALSE) && ($category != 2)) continue; else $rs['name'] = str_replace('.C2','',$rs['name']);
            if ((strpos($rs['name'],'.C3') !== FALSE) && ($category != 3)) continue; else $rs['name'] = str_replace('.C3','',$rs['name']);
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
            $possiblevalues = explode(',',$rs['val']);
            if (sizeof($possiblevalues) > 1) shuffle($possiblevalues);

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

        if (($questionnumber % 4) != 0) {
            $res = $DB->query("SELECT *
                           FROM ".$DBsta.".qhdr
                           WHERE qtype = 'Question'
                           AND qsubtype = 'Normal'
                           AND NOT EXISTS (SELECT * FROM ".$DBsta.".qhdr a WHERE qhdr.id = a.forcenext)
                           ORDER BY RAND()
                           LIMIT 0,3");
        } else {
            $res = $DB->query("SELECT *
                           FROM ".$DBsta.".qhdr
                           WHERE qtype = 'DisOrDat'
                           ORDER BY RAND()
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

    if ($mode == 'Question') {
        if (!isset($_POST['category'])) die('Resources 2');
        $category = $_POST['category'];
        if (!isset($_POST['questionnumber'])) die('Resources 2');
        $questionnumber = $_POST['questionnumber'];
        if (!isset($_POST['id'])) die('Resources 2');
        $id = $_POST['id'];

        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".qhdr q, ".$DBsta.".strings s
                           WHERE id = '".addslashes($id)."'
                           AND q.folder = s.folder");
        $qhdr = $res->fetch();
        $value = number_format(1000*$qhdr['value']*$category,0,'','');

        if ($questionnumber <= 6) $jinglequestion = rand(1,3); else $jinglequestion = rand(1,2);
        $music = rand(1,6);

        $reslist = array('value' => $value);
        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".resani a, ".$DBsta.".resfiles f
                           WHERE a.resid = f.resid
                           AND grp = 'Question'");
        while ($rs = $res->fetch()) {
            if ((strpos($rs['name'],'.Q10') !== FALSE) && ($questionnumber < 10)) continue; else $rs['name'] = str_replace('.Q10','',$rs['name']);
            if ((strpos($rs['name'],'.Q1') !== FALSE) && ($questionnumber != 1)) continue; else $rs['name'] = str_replace('.Q1','',$rs['name']);
            if ((strpos($rs['name'],'.Q2') !== FALSE) && ($questionnumber != 2)) continue; else $rs['name'] = str_replace('.Q2','',$rs['name']);
            if ((strpos($rs['name'],'.Q3') !== FALSE) && ($questionnumber != 3)) continue; else $rs['name'] = str_replace('.Q3','',$rs['name']);
            if ((strpos($rs['name'],'.Q4') !== FALSE) && ($questionnumber != 4)) continue; else $rs['name'] = str_replace('.Q4','',$rs['name']);
            if ((strpos($rs['name'],'.Q5') !== FALSE) && ($questionnumber != 5)) continue; else $rs['name'] = str_replace('.Q5','',$rs['name']);
            if ((strpos($rs['name'],'.Q6') !== FALSE) && ($questionnumber != 6)) continue; else $rs['name'] = str_replace('.Q6','',$rs['name']);
            if ((strpos($rs['name'],'.Q7') !== FALSE) && ($questionnumber != 7)) continue; else $rs['name'] = str_replace('.Q7','',$rs['name']);
            if ((strpos($rs['name'],'.Q8') !== FALSE) && ($questionnumber != 8)) continue; else $rs['name'] = str_replace('.Q8','',$rs['name']);
            if ((strpos($rs['name'],'.Q9') !== FALSE) && ($questionnumber != 9)) continue; else $rs['name'] = str_replace('.Q9','',$rs['name']);
            if (strpos($rs['name'], 'JingleQuestion') === 0) if ($rs['name'] != 'JingleQuestion'.$jinglequestion) continue; else $rs['name'] = 'JingleQuestion';
            if (strpos($rs['name'], 'BGQuestion') === 0) if ($rs['name'] != 'BGQuestion'.$jinglequestion) continue; else $rs['name'] = 'BGQuestion';

            if (strpos($rs['name'], 'AnnounceValue') === 0) if ($rs['name'] != 'AnnounceValue'.$value.'F') continue; else $rs['name'] = 'AnnounceValue';
            if (strpos($rs['name'], 'HideValue') === 0) if ($rs['name'] != 'HideValue'.$value.'F') continue; else $rs['name'] = 'HideValue';

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
            if ((strpos($rs['name'],'.Q10') !== FALSE) && ($questionnumber < 10)) continue; else $rs['name'] = str_replace('.Q10','',$rs['name']);
            if ((strpos($rs['name'],'.Q1') !== FALSE) && ($questionnumber != 1)) continue; else $rs['name'] = str_replace('.Q1','',$rs['name']);
            if ((strpos($rs['name'],'.Q2') !== FALSE) && ($questionnumber != 2)) continue; else $rs['name'] = str_replace('.Q2','',$rs['name']);
            if ((strpos($rs['name'],'.Q3') !== FALSE) && ($questionnumber != 3)) continue; else $rs['name'] = str_replace('.Q3','',$rs['name']);
            if ((strpos($rs['name'],'.Q4') !== FALSE) && ($questionnumber != 4)) continue; else $rs['name'] = str_replace('.Q4','',$rs['name']);
            if ((strpos($rs['name'],'.Q5') !== FALSE) && ($questionnumber != 5)) continue; else $rs['name'] = str_replace('.Q5','',$rs['name']);
            if ((strpos($rs['name'],'.Q6') !== FALSE) && ($questionnumber != 6)) continue; else $rs['name'] = str_replace('.Q6','',$rs['name']);
            if ((strpos($rs['name'],'.Q7') !== FALSE) && ($questionnumber != 7)) continue; else $rs['name'] = str_replace('.Q7','',$rs['name']);
            if ((strpos($rs['name'],'.Q8') !== FALSE) && ($questionnumber != 8)) continue; else $rs['name'] = str_replace('.Q8','',$rs['name']);
            if ((strpos($rs['name'],'.Q9') !== FALSE) && ($questionnumber != 9)) continue; else $rs['name'] = str_replace('.Q9','',$rs['name']);
            if (strpos($rs['name'], 'JingleQuestion') === 0) if ($rs['name'] != 'JingleQuestion'.$jinglequestion) continue; else $rs['name'] = 'JingleQuestion';

            if (strpos($rs['name'], 'VoiceAnnounceValue') === 0) if ($rs['name'] != 'VoiceAnnounceValue'.$value.'F') continue; else $rs['name'] = 'VoiceAnnounceValue';

            if (($rs['name'] == 'JingleReadQuestion') || ($rs['name'] == 'JingleTimer')) $possiblevalues = array($music);
            else {
                $possiblevalues = explode(',',$rs['val']);
                if (sizeof($possiblevalues) > 1) shuffle($possiblevalues);
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
                if (sizeof($possiblevalues) > 1) shuffle($possiblevalues);

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
        if (file_exists('../'.$RevealAnswer.'.ogg')) $reslist['Question/RevealAnswer'] = array('urlAudio' => uriToUid($RevealAnswer));
        else $reslist['Question/RevealAnswer'] = PickAnySnd('Question','DefaultRevealAnswer');

        $reslist['STR'] = $qhdr['strings'];
        $reslist['correctanswer'] = $qhdr['answer'];
    }

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
        $value = number_format(500*$category,0,'','');

        $reslist = array('value' => $value);
        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".resani a, ".$DBsta.".resfiles f
                           WHERE a.resid = f.resid
                           AND grp = 'DisOrDat'");
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
                           WHERE grp = 'DisOrDat'
                           OR (grp = 'Question' AND name IN ('SFXPlayerCorrect','SFXPlayerLose'))");
        while ($rs = $res->fetch()) {
            $names = array($rs['name']);

            $possiblevalues = explode(',',$rs['val']);
            if (sizeof($possiblevalues) > 1) shuffle($possiblevalues);

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

function players() {
    $players = array(
        array('name' => 'Joueur 1','score' => 0,'keycode' => 113),
        array('name' => 'Joueur 2','score' => 0,'keycode' => 98),
        array('name' => 'Joueur 3','score' => 0,'keycode' => 112)
    );
    header('X-JSON: '.json_encode(array(
            'players' => $players
        )));
}

switch ($call) {
    case 'gamemode': gamemode(); break;
    case 'resources': resources(); break;
    case 'players': players(); break;
    default: die('API ready 2');
}
