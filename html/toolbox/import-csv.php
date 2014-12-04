<?php

require_once 'mysql.inc.php';
pdo_select_db($DBsta);

echo 'Importing QHDR...';
if (($handle = fopen("qhdr.csv", "r")) !== FALSE) {
    $DB->query("DELETE FROM qhdr");
    while (($data = fgetcsv($handle, 1000, chr(0xA4))) !== FALSE) {
        $filename = str_replace('.SRF','',strtr(strtoupper($data[2]),':','/'));

        $qtype = '';
        switch($data[3]) {
            case '0': $qtype = 'Question'; break;
            case '2': $qtype = 'Gibberish'; break;
            case '3': $qtype = 'DisOrDat'; break;
            case '4': $qtype = 'JackAttack'; break;
            case '5': $qtype = 'Fiber'; break;
        }

        $qsubtype = '';
        switch($data[4]) {
            case '1': $qsubtype = 'Normal'; break;
            case '2': $qsubtype = 'Blank'; break;
            case '3': $qsubtype = 'Who'; break;
            case '4': $qsubtype = 'Eyes'; break;
        }

        $DB->query("INSERT IGNORE INTO qhdr (id, title, folder, qtype, qsubtype, value, answer) VALUES (
                    '".addslashes($data[0])."',
                    '".addslashes($data[1])."',
                    '".addslashes($filename)."',
                    '".addslashes($qtype)."',
                    '".addslashes($qsubtype)."',
                    '".addslashes($data[5])."',
                    '".addslashes($data[6])."')");
    }
    $DB->query("UPDATE qhdr SET qsubtype = NULL WHERE qsubtype = ''");
    $DB->query("UPDATE qhdr SET answer = NULL WHERE answer = 0");
    fclose($handle);
    echo 'OK<br/>';
} else echo 'Missing<br/>';

echo 'Importing strings...';
if (($handle = fopen("strings.csv", "r")) !== FALSE) {
    $DB->query("DELETE FROM strings");
    while (($data = fgetcsv($handle, 1000, chr(0xA4))) !== FALSE) {
        $file = trim(strtr($data[0],'\\','/'),'/');
        $DB->query("INSERT IGNORE INTO strings (folder, strings) VALUES (
                    '".addslashes($file)."',
                    '".addslashes($data[1])."')");
    }
    fclose($handle);
    echo 'OK<br/>';
} else echo 'Missing<br/>';
