<?php

require_once 'mysql.inc.php';

if (!isset($_POST['msg'])) die();
if (!isset($_POST['url'])) die();
if (!isset($_POST['line'])) die();
if (!isset($_POST['col'])) die();
if (!isset($_POST['error'])) die();

$DB->query("INSERT INTO ".$DBdyn.".errors (now, ip, msg, url, line, col, `error`)
           VALUES(NOW(),'".addslashes($_SERVER['REMOTE_ADDR'])."','".addslashes($_POST['msg'])."','".addslashes($_POST['url'])."','".intval($_POST['line'])."','".intval($_POST['col'])."','".addslashes($_POST['error'])."')");
