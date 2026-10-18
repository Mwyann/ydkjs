<?php

require_once 'local/config.inc.php';
require_once 'common.inc.php';


if (!isset($_GET['uid'])) die('No uid');

require_once 'mysql.inc.php';
//connectMysql();

$hash = substr($_GET['uid'],-40);
$uid = substr($_GET['uid'],0,-40);

if (sha1($uid.$GETsalt) != $hash) die('Incorrect hash');

$uid = str_replace('..','',base64_decode($uid).$_GET['type']);

$file = '../'.$uid;

if (file_exists($file)) {
    sendFile($file);
} else {
    header('HTTP/1.0 404 Not Found');
}
