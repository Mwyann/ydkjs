<?php

if ($_POST['type'] == 'animationList') {
    require 'mysql.inc.php';

    $sp = explode('/',$_POST['animationFile']);
    $animationFile = intval($sp[sizeof($sp)-1]);

    $res = $DB->query("SELECT * FROM resani WHERE resid=".$animationFile." ORDER BY framestart");
    echo json_encode($res->fetchAll());
}

