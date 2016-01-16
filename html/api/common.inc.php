<?php

// Got from https://www.leaseweb.com/labs/2014/08/session-locking-non-blocking-read-sessions-php/
function session_readonly()
{
    $session_name = preg_replace('/[^\da-z]/i', '', $_COOKIE[session_name()]);
    $session_data = file_get_contents(session_save_path().'/sess_'.$session_name);

    $return_data = array();
    $offset = 0;
    while ($offset < strlen($session_data)) {
        if (!strstr(substr($session_data, $offset), "|")) break;
        $pos = strpos($session_data, "|", $offset);
        $num = $pos - $offset;
        $varname = substr($session_data, $offset, $num);
        $offset += $num + 1;
        $data = unserialize(substr($session_data, $offset));
        $return_data[$varname] = $data;
        $offset += strlen(serialize($data));
    }
    $_SESSION = $return_data;
}
