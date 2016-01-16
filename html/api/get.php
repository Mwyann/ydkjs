<?php

require_once 'local/config.inc.php';
require_once 'common.inc.php';

if (!$DEMOMODE) {
    session_readonly();
    if (!isset($_SESSION['id']) && !isset($_SESSION['session_id'])) die('Not logged in'); // On autorise les joueurs ayant un session_id valide (invités d'un jeu multijoueur)
}

if (!isset($_GET['uid'])) die('No uid');

require_once 'mysql.inc.php';
//connectMysql();

$hash = substr($_GET['uid'],-40);
$uid = substr($_GET['uid'],0,-40);

if (sha1($uid.$GETsalt) != $hash) die('Incorrect hash');

$uid = str_replace('..','',base64_decode($uid).$_GET['type']);

$file = '../'.$uid;

if (file_exists($file)) {
    $filesize = filesize($file);

    $offset = 0;
    $length = $filesize;

    // Obligé de gérer le Range pour Chrome. Même en répondant en HTTP/1.0 (qui n'accepte pas le Range), il insiste.
    if (isset($_SERVER['HTTP_RANGE'])) {
        // if the HTTP_RANGE header is set we're dealing with partial content
        $partialContent = true;
        // find the requested range
        // this might be too simplistic, apparently the client can request
        // multiple ranges, which can become pretty complex, so ignore it for now
        preg_match('/bytes=(\d+)-(\d+)?/', $_SERVER['HTTP_RANGE'], $matches);

        $offset = intval($matches[1]);
        if ((isset($matches[2])) && (intval($matches[2]) > 0)) $length = intval($matches[2]) - $offset + 1;
        else $length = $filesize-$offset;
    } else {
        $partialContent = false;
    }

    $f = fopen($file, 'r');
    // seek to the requested offset, this is 0 if it's not a partial content request
    fseek($f, $offset);
    $data = fread($f, $length);
    fclose($f);

    if ($partialContent) {
        // output the right headers for partial content
        header('HTTP/1.1 206 Partial Content');
        header('Content-Range: bytes ' . $offset . '-' . ($offset + $length - 1) . '/' . $filesize);
    }

    header('Content-type: '.mime_content_type($file));
    header('Content-length: '.$length);
    header('Last-Modified: '.gmdate('D, d M Y H:i:s T',time()));
    header('Accept-Ranges: bytes');
    header_remove('Cache-Control');
    header_remove('Expires');
    header_remove('Pragma');
    header_remove('X-Powered-By');
    print($data);
} else {
    header('HTTP/1.0 404 Not Found');
}
