<?php

if (!isset($_POST['msg'])) die();
if (!isset($_POST['url'])) die();
if (!isset($_POST['line'])) die();
if (!isset($_POST['col'])) die();
if (!isset($_POST['error'])) die();
if (!isset($_POST['stack'])) die();

$logsDir = __DIR__ . '/../../logs';
if (!is_dir($logsDir)) {
    @mkdir($logsDir, 0777, true);
}

$now = date('Y-m-d H:i:s');
$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '-';
$session = '';
if (!empty($_POST['session'])) {
    $session = strtoupper(trim($_POST['session']));
} elseif (!empty($_GET['session'])) {
    $session = strtoupper(trim($_GET['session']));
} elseif (!empty($_SERVER['HTTP_REFERER']) && preg_match('/[?&]session=([A-Za-z0-9]+)/', $_SERVER['HTTP_REFERER'], $m)) {
    $session = strtoupper($m[1]);
}
$session = substr($session, 0, 200);

$msg = substr(trim($_POST['msg']), 0, 200);
$url = substr(trim($_POST['url']), 0, 200);
$line = intval($_POST['line']);
$col = intval($_POST['col']);
$error = substr(trim($_POST['error']), 0, 2000);
$stack = substr(trim($_POST['stack']), 0, 2000);

$sessionInfo = $session ? " | Session: " . $session : "";
$logEntry = sprintf(
    "[%s] IP: %s%s\nURL: %s (L:%d, C:%d)\nMSG: %s\nERR: %s\nSTACK:\n%s\n",
    $now, $ip, $sessionInfo, $url, $line, $col, $msg, $error, $stack
);

if (isset($_POST['log']) && ($_POST['log'] != '')) {
    $logEntry .= "DEBUG LOG:\n" . substr(trim($_POST['log']), 0, 16000) . "\n";
}
$logEntry .= str_repeat('-', 60) . "\n";

@file_put_contents($logsDir . '/js-errors.log', $logEntry, FILE_APPEND | LOCK_EX);

die('OK');