<?php

require_once 'mysql.inc.php';
connectMysql();

if (!isset($_POST['msg'])) die();
if (!isset($_POST['url'])) die();
if (!isset($_POST['line'])) die();
if (!isset($_POST['col'])) die();
if (!isset($_POST['error'])) die();
if (!isset($_POST['stack'])) die();

$DB->query("INSERT INTO ".$DBdyn.".errors (now, ip, msg, url, line, col, `error`, `stack`)
           VALUES(NOW(),'".addslashes($_SERVER['REMOTE_ADDR'])."','".addslashes($_POST['msg'])."','".addslashes($_POST['url'])."','".intval($_POST['line'])."','".intval($_POST['col'])."','".addslashes($_POST['error'])."','".addslashes($_POST['stack'])."')");
$insertedId = $DB->lastInsertId();

if (isset($_POST['log']) && ($_POST['log'] != '')) {
    file_put_contents('errors/'.$insertedId.'.log', $_POST['log']);
}

die('OK');