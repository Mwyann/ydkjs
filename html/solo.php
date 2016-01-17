<?php
session_start();
unset($_SESSION['session_id']);
session_write_close();

header('Location: alpha.php');
die();