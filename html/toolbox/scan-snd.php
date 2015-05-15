<?php

require_once 'mysql.inc.php';
pdo_select_db($DBsta);

echo 'Scanning SND...';

$res = $DB->query("SELECT *
                   FROM ressnd
                   WHERE resfolder NOT LIKE '5QDemo/%'
                   AND resfolder NOT LIKE '%Mb84'
                   AND resfolder NOT LIKE '%Mb85'
                   AND resfolder NOT LIKE '%Mh23'
                   AND resfolder NOT LIKE '%Me13'
                   AND resfolder NOT LIKE '%Me21'
                   AND resfolder NOT LIKE '%Me22'
                   AND resfolder NOT LIKE '%Me23'
                   AND resfolder NOT LIKE '%Mg40'");
while ($rs = $res->fetch()) {
    $list = scandir('../res-full/'.$rs['resfolder']);
    if (sizeof($list)) {
        $IDlist = array();
        foreach($list as $file) if (strpos($file,'.ogg') !== FALSE) {
            $ID = str_replace('.ogg','',$file);
            if ($ID < 1000) $IDlist[$ID] = 1;
        }
        ksort($IDlist);
        if (sizeof($IDlist) > 0) {
            $IDlist = implode(',', array_keys($IDlist));
            $DB->query("UPDATE ressnd
                        SET val = '" . addslashes($IDlist) . "'
                        WHERE grp = '" . addslashes($rs['grp']) . "'
                        AND name = '" . addslashes($rs['name']) . "'");
        }
    } else echo $rs['resfolder']." doesn't exists;";
}
echo 'OK<br/>';
