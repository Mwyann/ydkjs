<?php

require_once 'mysql-data.inc.php';

// Connexion bdd PDO
try{
    // Connexion à la base de données
    $DB = new PDO('mysql:host='.$DBserver.';dbname='.$DBsta, $DBuser, $DBpass, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));

    // Configuration du pilote : nous voulons des exceptions
    $DB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Obligatoire pour la suite
    $DB->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC); // Uniquement associatif
}
catch(Exception $e){
    echo "Echec : " . $e->getMessage(); // afficher les erreurs(sans mot de passe ...)
}

$DBserver = '';
$DBuser = '';
$DBpass = '';

function pdo_select_db($dbname, $pdo_object = 0) {
    global $DB;
    if (!$pdo_object) $pdo_object = $DB;
    $pdo_object->exec('USE '.$dbname);
}
