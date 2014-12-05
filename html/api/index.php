<?php

require_once 'mysql.inc.php';

if (!isset($_POST['call'])) die('API ready 1');
$call = $_POST['call'];

function uriToUid($uri) {
  return 'api/get.php?uid='.base64_encode($uri).'&type=';
}

function gamemode() {
    if (!isset($_POST['currentmode'])) die('Gamemode 1');
    $currentmode = $_POST['currentmode'];
    $newmode = array();
    switch ($currentmode) {
        case 'None': //$newmode = array('mode' => 'Intro'); break;
        case 'Intro': $newmode = array('mode' => 'Category', 'category' => 1, 'questionnumber' => 1); break;
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

        //if (($questionnumber % 2) == 1) {
        if (1) {
            $res = $DB->query("SELECT *
                           FROM ".$DBsta.".qhdr
                           WHERE qtype = 'Question'
                           AND qsubtype = 'Normal'
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

        if ($questionnumber <= 10) $jinglequestion = rand(1,3); else $jinglequestion = rand(1,2);
        $music = rand(1,6);

        $reslist = array('value' => $value);
        $res = $DB->query("SELECT *
                           FROM ".$DBsta.".resani a, ".$DBsta.".resfiles f
                           WHERE a.resid = f.resid
                           AND grp = 'Question'");
        while ($rs = $res->fetch()) {
            if ((strpos($rs['name'],'.Q1') !== FALSE) && ($questionnumber != 1)) continue; else $rs['name'] = str_replace('.Q1','',$rs['name']);
            if ((strpos($rs['name'],'.Q2') !== FALSE) && ($questionnumber != 2)) continue; else $rs['name'] = str_replace('.Q2','',$rs['name']);
            if ((strpos($rs['name'],'.Q3') !== FALSE) && ($questionnumber < 3)) continue; else $rs['name'] = str_replace('.Q3','',$rs['name']);
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
            if ((strpos($rs['name'],'.Q1') !== FALSE) && ($questionnumber != 1)) continue; else $rs['name'] = str_replace('.Q1','',$rs['name']);
            if ((strpos($rs['name'],'.Q2') !== FALSE) && ($questionnumber != 2)) continue; else $rs['name'] = str_replace('.Q2','',$rs['name']);
            if ((strpos($rs['name'],'.Q3') !== FALSE) && ($questionnumber < 3)) continue; else $rs['name'] = str_replace('.Q3','',$rs['name']);
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

        function PickDefault($type) {
            global $DB, $DBsta;
            $res = $DB->query("SELECT *
                               FROM ".$DBsta.".ressnd
                               WHERE grp = 'Question'
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
        else $reslist['Question/PreQuestion'] = PickDefault('DefaultPreQuestion');

        $reslist['Question/Question'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/3'));
        $reslist['Question/Answers'] = array('urlAudio' => uriToUid('res-full/'.$qhdr['folder'].'/snd/5'));
        $EndQuestion = 'res-full/'.$qhdr['folder'].'/snd/6';
        if (file_exists('../'.$EndQuestion.'.ogg')) $reslist['Question/EndQuestion'] = array('urlAudio' => uriToUid($EndQuestion));
        else $reslist['Question/EndQuestion'] = array();

        for($i = 1; $i <= 4; $i++) {
            $Answer = 'res-full/'.$qhdr['folder'].'/snd/'.($i+6);
            if (file_exists('../'.$Answer.'.ogg')) $reslist['Question/Answer'.$i] = array('urlAudio' => uriToUid($Answer));
            else $reslist['Question/Answer'.$i] = PickDefault('DefaultWrongAnswer');
        }

        $RevealAnswer = 'res-full/'.$qhdr['folder'].'/snd/11';
        if (file_exists('../'.$RevealAnswer.'.ogg')) $reslist['Question/RevealAnswer'] = array('urlAudio' => uriToUid($RevealAnswer));
        else $reslist['Question/RevealAnswer'] = PickDefault('DefaultRevealAnswer');

        $reslist['STR'] = $qhdr['strings'];
        $reslist['correctanswer'] = $qhdr['answer'];
    }

    if ($mode == 'Timer10') {
        $resName = 'res-full/10TIMER/off4/8018';
        $reslist = array('Common/Timer10' => array('urlGif' => uriToUid($resName.'.gif'), 'urlJS' => uriToUid($resName.'.js'), 'framestart' => 73, 'loop' => 0, 'framestop' => 75),
                         'Common/Timer10/Frames' => array(
                         'Still' => array(
                            10 => array('framestart' => 69),
                            9 =>  array('framestart' => 88),
                            8 =>  array('framestart' => 107),
                            7 =>  array('framestart' => 125),
                            6 =>  array('framestart' => 144),
                            5 =>  array('framestart' => 163),
                            4 =>  array('framestart' => 182),
                            3 =>  array('framestart' => 200),
                            2 =>  array('framestart' => 218),
                            1 =>  array('framestart' => 236),
                            0 =>  array('framestart' => 261)
                        ),
                        'Hide' =>  array(
                            10 =>  array('framestart' => 73,'framestop' => 75),
                            9 =>  array('framestart' => 92,'framestop' => 94),
                            8 =>  array('framestart' => 110,'framestop' => 112),
                            7 =>  array('framestart' => 129,'framestop' => 131),
                            6 =>  array('framestart' => 148,'framestop' => 150),
                            5 =>  array('framestart' => 167,'framestop' => 169),
                            4 =>  array('framestart' => 185,'framestop' => 187),
                            3 =>  array('framestart' => 203,'framestop' => 205),
                            2 =>  array('framestart' => 221,'framestop' => 223),
                            1 =>  array('framestart' => 239,'framestop' => 241),
                            0 =>  array('framestart' => 264,'framestop' => 266)
                        ),
                        'Show' =>  array(
                            10 =>  array('framestart' => 59,'framestop' => 65),
                            9 =>  array('framestart' => 79,'framestop' => 85),
                            8 =>  array('framestart' => 98,'framestop' => 104),
                            7 =>  array('framestart' => 116,'framestop' => 122),
                            6 =>  array('framestart' => 135,'framestop' => 141),
                            5 =>  array('framestart' => 154,'framestop' => 160),
                            4 =>  array('framestart' => 173,'framestop' => 179),
                            3 =>  array('framestart' => 191,'framestop' => 197),
                            2 =>  array('framestart' => 209,'framestop' => 215),
                            1 =>  array('framestart' => 227,'framestop' => 233),
                            0 =>  array('framestart' => 245,'framestop' => 251)
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
