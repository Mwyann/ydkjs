<?php
/**
 * Outil d'exportation dynamique de la base de données statique vers SQLite.
 *
 * Ce script inspecte dynamiquement toutes les tables, colonnes, types, clés primaires
 * et index depuis la connexion MySQL ('mysql.inc.php') et les réplique dans SQLite
 * avec encodage UTF-8 intégral.
 */

$SQLITEPATH = 'export/res/ydkj_sta.sqlite';
$destDir = dirname($SQLITEPATH);
if (!empty($destDir) && !is_dir($destDir)) {
    @mkdir($destDir, 0777, true);
}

// Vérifier l'extension PDO SQLite
if (!extension_loaded('pdo_sqlite')) {
    die("ERREUR : L'extension PHP 'pdo_sqlite' n'est pas activée dans votre php.ini.\n" .
        "Veuillez décommenter ou ajouter 'extension=pdo_sqlite' dans php.ini puis réessayez.\n");
}

echo "=== Export dynamique MySQL vers SQLite ===\n";
echo "Fichier de destination : " . $SQLITEPATH . "\n";

// Connexion MySQL via le fichier existant
require 'mysql.inc.php';
if (!isset($DB) || !($DB instanceof PDO)) {
    die("ERREUR : La connexion MySQL a échoué via mysql.inc.php.\n");
}

// Supprimer l'ancienne base SQLite si elle existe déjà
if (file_exists($SQLITEPATH)) {
    unlink($SQLITEPATH);
    echo "Ancien fichier SQLite supprimé.\n";
}

try {
    $sqlite = new PDO('sqlite:' . $SQLITEPATH);
    $sqlite->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sqlite->exec("PRAGMA encoding = 'UTF-8';");
    $sqlite->exec("PRAGMA journal_mode = MEMORY;");
    $sqlite->exec("PRAGMA synchronous = OFF;");
} catch (Exception $e) {
    die("ERREUR lors de la création de la base SQLite : " . $e->getMessage() . "\n");
}

/**
 * Mapper un type SQL MySQL vers un type affinité SQLite
 */
function mysqlTypeToSqlite($mysqlType) {
    $type = strtolower($mysqlType);
    if (preg_match('/^(int|tinyint|smallint|mediumint|bigint)/', $type)) {
        return 'INTEGER';
    }
    if (preg_match('/^(float|double|decimal|numeric)/', $type)) {
        return 'REAL';
    }
    if (preg_match('/^(blob|binary|varbinary)/', $type)) {
        return 'BLOB';
    }
    return 'TEXT'; // varchar, char, text, mediumtext, longtext, set, enum, date, datetime...
}

// Introspection dynamique des tables MySQL
$tablesStmt = $DB->query("SHOW TABLES");
$tables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);

foreach ($tables as $table) {
    echo "Traitement de la table `$table`...\n";

    // Récupérer les colonnes
    $colsStmt = $DB->query("DESCRIBE `$table`");
    $columns = $colsStmt->fetchAll();

    $colDefs = [];
    $primaryKeys = [];

    foreach ($columns as $col) {
        $field = $col['Field'];
        $sqliteType = mysqlTypeToSqlite($col['Type']);
        $nullDef = ($col['Null'] === 'NO') ? 'NOT NULL' : 'DEFAULT NULL';
        if ($col['Default'] !== null) {
            $nullDef .= " DEFAULT " . $DB->quote($col['Default']);
        }
        $colDefs[] = "`$field` $sqliteType $nullDef";

        if ($col['Key'] === 'PRI') {
            $primaryKeys[] = "`$field`";
        }
    }

    if (!empty($primaryKeys)) {
        $colDefs[] = "PRIMARY KEY (" . implode(', ', $primaryKeys) . ")";
    }

    $createSql = "CREATE TABLE IF NOT EXISTS `$table` (\n  " . implode(",\n  ", $colDefs) . "\n);";
    $sqlite->exec($createSql);

    // Récupérer les index secondaires
    $indexStmt = $DB->query("SHOW INDEX FROM `$table` WHERE Key_name != 'PRIMARY'");
    $rawIndexes = $indexStmt->fetchAll();
    $groupedIndexes = [];
    foreach ($rawIndexes as $idxRow) {
        $keyName = $idxRow['Key_name'];
        $colName = $idxRow['Column_name'];
        $isUnique = ($idxRow['Non_unique'] == 0);
        if (!isset($groupedIndexes[$keyName])) {
            $groupedIndexes[$keyName] = [
                'unique' => $isUnique,
                'columns' => []
            ];
        }
        $groupedIndexes[$keyName]['columns'][] = "`$colName`";
    }

    foreach ($groupedIndexes as $idxName => $idxInfo) {
        $uniqueClause = $idxInfo['unique'] ? "UNIQUE " : "";
        $idxCols = implode(', ', $idxInfo['columns']);
        $idxSql = "CREATE {$uniqueClause}INDEX IF NOT EXISTS `idx_{$table}_{$idxName}` ON `$table` ({$idxCols});";
        try {
            $sqlite->exec($idxSql);
        } catch (Exception $e) {
            // Ignore si index redondant
        }
    }

    // Copie des données
    $dataStmt = $DB->query("SELECT * FROM `$table`");
    $rows = $dataStmt->fetchAll();
    $count = count($rows);

    if ($count > 0) {
        $sqlite->beginTransaction();
        $fieldNames = array_keys($rows[0]);
        $colList = '`' . implode('`, `', $fieldNames) . '`';
        $placeholders = implode(', ', array_fill(0, count($fieldNames), '?'));
        $insSql = "INSERT INTO `$table` ($colList) VALUES ($placeholders)";
        $insStmt = $sqlite->prepare($insSql);

        foreach ($rows as $row) {
            $insStmt->execute(array_values($row));
        }
        $sqlite->commit();
    }
    echo "  -> Structure créée et $count enregistrements copiés.\n\n";
}

// Clôture propre du journal pour distribution statique
$sqlite->exec("PRAGMA journal_mode = DELETE;");
$sqlite->exec("VACUUM;");

echo "============================================\n";
echo "Export terminé avec succès !\n";
echo "Base SQLite générée : " . $SQLITEPATH . "\n";
echo "============================================\n";
