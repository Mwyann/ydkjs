<?php

/**
 * Script de conversion directe de la table `strings` en base de données.
 * Utile pour convertir les données existantes de littéral JS vers du vrai JSON sans réimporter le CSV complet.
 */

require_once __DIR__ . '/mysql.inc.php';
require_once __DIR__ . '/strings-json.inc.php';

pdo_select_db($DBsta);

echo "Conversion des chaînes de la table {$DBsta}.strings en JSON standard...\n";

$res = $DB->query("SELECT folder, strings FROM strings");
$updateStmt = $DB->prepare("UPDATE strings SET strings = :strings WHERE folder = :folder");

$converted = 0;
$alreadyValid = 0;
$errors = 0;

while ($row = $res->fetch()) {
    $folder = $row['folder'];
    $raw = $row['strings'];

    // Vérifier si c'est déjà du JSON valide
    $test = json_decode($raw);
    if (json_last_error() === JSON_ERROR_NONE && $test !== null) {
        $alreadyValid++;
        continue;
    }

    $json = convertJsLiteralToJson($raw);
    if (json_decode($json) !== null) {
        $updateStmt->execute([':strings' => $json, ':folder' => $folder]);
        $converted++;
    } else {
        echo "Erreur sur le dossier : {$folder}\n";
        $errors++;
    }
}

echo "Terminé ! Lignes converties : {$converted}, Déjà valides : {$alreadyValid}, Erreurs : {$errors}\n";
