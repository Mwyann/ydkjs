<?php

require 'local/config.inc.php';
require 'common.inc.php';
require 'mysql.inc.php';

connectMysql();

$file = '';
if ($_GET['sound'] == 'newplayer') {
    $res = $DB->query("SELECT * FROM ressnd WHERE grp = 'Credits' AND name = 'NewPlayers'");
    $rs = $res->fetch();
    $vals = explode(',',$rs['val']);
    $num = intval($_GET['num']);
    $file = '../res-full/'.$rs['resfolder'].'/'.$vals[$num%(sizeof($vals))].'.'.strtr(substr($_GET['type'],0,3),'./','--');
}

if (($file) && (file_exists($file))) sendFile($file);

header('HTTP/1.0 404 Not Found');
