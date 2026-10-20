<?php

/**
 * Convertit un littéral d'objet/tableau JavaScript (tel qu'extrait de Director/CSV)
 * en une chaîne JSON standard valide selon la RFC 8259.
 */
function convertJsLiteralToJson($str) {
    if (!is_string($str) || trim($str) === '') return '[]';

    // Si la chaîne est déjà un JSON valide, on ne la retouche pas
    $test = json_decode($str);
    if (json_last_error() === JSON_ERROR_NONE && $test !== null) {
        return $str;
    }

    $pos = 0;
    $len = strlen($str);

    $skipWhitespace = function() use ($str, $len, &$pos) {
        while ($pos < $len && ($str[$pos] === ' ' || $str[$pos] === "\t" || $str[$pos] === "\n" || $str[$pos] === "\r")) {
            $pos++;
        }
    };

    $parseValue = function() use ($str, $len, &$pos, $skipWhitespace, &$parseValue) {
        $skipWhitespace();
        if ($pos >= $len) return null;

        $char = $str[$pos];

        if ($char === '[') {
            $pos++; // consomme '['
            $arr = [];
            while ($pos < $len) {
                $skipWhitespace();
                if ($pos < $len && $str[$pos] === ']') {
                    $pos++;
                    return $arr;
                }
                $arr[] = $parseValue();
                $skipWhitespace();
                if ($pos < $len && $str[$pos] === ',') {
                    $pos++;
                }
            }
            return $arr;
        }

        if ($char === '{') {
            $pos++; // consomme '{'
            $obj = [];
            while ($pos < $len) {
                $skipWhitespace();
                if ($pos < $len && $str[$pos] === '}') {
                    $pos++;
                    return (object)$obj;
                }
                // Clé : identifiant non quoté ou chaîne quotée
                if ($str[$pos] === "'" || $str[$pos] === '"') {
                    $key = $parseValue();
                } else {
                    $kStart = $pos;
                    while ($pos < $len && preg_match('/[a-zA-Z0-9_#$]/', $str[$pos])) {
                        $pos++;
                    }
                    $key = substr($str, $kStart, $pos - $kStart);
                }
                $skipWhitespace();
                if ($pos < $len && $str[$pos] === ':') {
                    $pos++;
                }
                $val = $parseValue();
                $obj[$key] = $val;
                $skipWhitespace();
                if ($pos < $len && $str[$pos] === ',') {
                    $pos++;
                }
            }
            return (object)$obj;
        }

        if ($char === "'" || $char === '"') {
            $quote = $char;
            $pos++; // consomme la quote ouvrante
            $val = '';
            while ($pos < $len) {
                $c = $str[$pos];
                if ($c === '\\') {
                    $pos++;
                    if ($pos < $len) {
                        $next = $str[$pos];
                        switch ($next) {
                            case 'n': $val .= "\n"; break;
                            case 'r': $val .= "\r"; break;
                            case 't': $val .= "\t"; break;
                            case '\\': $val .= "\\"; break;
                            case "'": $val .= "'"; break;
                            case '"': $val .= '"'; break;
                            default: $val .= '\\' . $next; break;
                        }
                    }
                } elseif ($c === $quote) {
                    $pos++; // consomme la quote fermante
                    return $val;
                } else {
                    $val .= $c;
                }
                $pos++;
            }
            return $val;
        }

        // Nombre, booléen, null, ou mot clé brut
        $start = $pos;
        while ($pos < $len && !in_array($str[$pos], [',', ']', '}', ':', ' ', "\t", "\n", "\r"])) {
            $pos++;
        }
        $raw = substr($str, $start, $pos - $start);
        if (is_numeric($raw)) {
            return strpos($raw, '.') !== false ? (float)$raw : (int)$raw;
        }
        if ($raw === 'true') return true;
        if ($raw === 'false') return false;
        if ($raw === 'null') return null;
        return $raw;
    };

    $parsed = $parseValue();
    if ($parsed !== null) {
        return json_encode($parsed, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    return $str;
}
