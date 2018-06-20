<?php

require 'mysql.inc.php';

if ($_POST['type'] == 'animationList') {
    $sp = explode('/',$_POST['animationFile']);
    $animationFile = intval($sp[sizeof($sp)-1]);

    $res = $DB->query("SELECT * FROM resani WHERE resid=".$animationFile." ORDER BY framestart");
    echo json_encode($res->fetchAll());
}

if ($_POST['type'] == 'saveAnimation') {
    $sp = explode('/',$_POST['animationFile']);
    $animationFile = intval($sp[sizeof($sp)-1]);
    $framestart = intval($_POST['framestart']);
    $framestop = intval($_POST['framestop']);
    if ($framestop <= 0) $framestop = 'NULL';
    $loopani = intval($_POST['loopani']);

    $DB->query("INSERT INTO resani (grp, name, variantType, variantValue, resid, framestart, framestop, loopani) 
                       VALUES (
                        '".addslashes(trim($_POST['grp']))."',
                        '".addslashes(trim($_POST['name']))."',
                        '".addslashes(trim($_POST['variantType']))."',
                        '".addslashes(trim($_POST['variantValue']))."',
                        ".$animationFile.",
                        ".$framestart.",
                        ".$framestop.",
                        ".$loopani.")");
    echo json_encode(array('return' => 0));
}
