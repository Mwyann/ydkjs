<?php

function connectMysql() {
    global $DB, $SQLITEPATH;

    // 1. Mode SQLite si $SQLITEPATH est renseigné
    if (!empty($SQLITEPATH)) {
        try {
            $sqliteFile = $SQLITEPATH;
            // Résolution du chemin absolu si relatif
            if (!preg_match('/^([a-zA-Z]:[\\\\\/]|\/)/', $sqliteFile)) {
                $sqliteFile = dirname(__DIR__) . '/' . ltrim($sqliteFile, '/\\');
            }

            // Normalisation pour format URI SQLite
            $normalizedPath = str_replace('\\', '/', $sqliteFile);
            if (!preg_match('/^[a-zA-Z]:/', $normalizedPath) && substr($normalizedPath, 0, 1) !== '/') {
                $normalizedPath = '/' . $normalizedPath;
            }

            try {
                // Tentative en mode immutable (lecture seule absolue, désactive tout verrou et tout fichier journal/shm)
                $DB = new PDO('sqlite:file:' . $normalizedPath . '?immutable=1');
            } catch (Exception $eImm) {
                // Fallback standard si l'URI filename n'est pas supporté
                $DB = new PDO('sqlite:' . $sqliteFile);
            }

            $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $DB->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

            // Forcer les tris temporaires en RAM (pour éviter d'écrire sur disque lors des ORDER BY)
            $DB->exec("PRAGMA temp_store = MEMORY;");

            // Fonctions compatibles MySQL pour SQLite
            $DB->sqliteCreateFunction('MD5', 'md5', 1);
            $DB->sqliteCreateFunction('CONCAT', function() {
                return implode('', func_get_args());
            });
            return;
        } catch (Exception $e) {
            echo "Echec SQLite : " . $e->getMessage();
            return;
        }
    }

    // 2. Mode MySQL classique
    require __DIR__ . '/local/mysql-data.inc.php';

    try {
        $db = !empty($DBname) ? $DBname : (!empty($DBsta) ? $DBsta : 'ydkjfr_sta');

        $DB = new PDO('mysql:host=' . $DBserver . ';dbname=' . $db, $DBuser, $DBpass, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
        $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $DB->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        echo "Echec MySQL : " . $e->getMessage();
    }

    $DBserver = '';
    $DBuser = '';
    $DBpass = '';
}
