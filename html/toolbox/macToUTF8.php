<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<pre>
<?php

for($i = 0x80;$i <= 0xFF;$i++) {
    $charutf = iconv('macintosh','UTF-8',chr($i));
    $utf = '';
    foreach(str_split($charutf) as $c) {
        if ($utf != '') $utf .= '+';
        $utf .= 'chr($'.strtoupper(dechex(ord($c))).')';
    }
    echo '  else if (ord(c) = $'.strtoupper(dechex($i)).') then result:='.$utf.' // '.iconv('macintosh','UTF-8',chr($i)).'<br/>';
}

?>
</pre>
</body>
</html>