<?php
session_start();

if (isset($_GET['session_id'])) {
  $session_id = intval($_GET['session_id']);
  if ($session_id > 0) {
    require 'api/mysql.inc.php';
    connectMysql('dyn');
    $res = $DB->query("SELECT * FROM sessions WHERE id = " . $session_id);
    if ($session = $res->fetch()) {
      $_SESSION['session_id'] = $session_id;
      $_SESSION['nbplayers'] = $session['nbplayers'];
      $_SESSION['player1'] = $session['nick1'];
      $_SESSION['player2'] = $session['nick2'];
      $_SESSION['player3'] = $session['nick3'];
    } else die('Session ID unknown');
  } else die('Session ID incorrect');
} else {
  unset($_SESSION['session_id']);
  unset($_SESSION['nbplayers']);
  unset($_SESSION['player1']);
  unset($_SESSION['player2']);
  unset($_SESSION['player3']);
}
session_write_close();

?><!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>You Don't Know Jack® ALPHA FR</title>
<link href="css/ydkj.css" rel="stylesheet"/>
<script src="js/jquery-1.12.0.min.js" type="text/javascript"></script>
<script src="js/YDKJ.js?ver=6" type="text/javascript"></script>

<script type="text/javascript">

(function(){
  jQuery(document).ready(function() {
    var game = new YDKJ(jQuery('#screen'));
    jQuery('#fullscreen').click(function() {
      jQuery('#headerbuttons').hide();
      game.fullscreen(function() {
        jQuery('#headerbuttons').show();
      });
      return false;
    });
    game.start();
  });
})();

</script>
</head>

<body style="background-color:#000;margin:0;padding:0;border:0">
  <div style="text-align:center;font-size:20px;margin:5px;font-family:JackCondensed, sans-serif" id="headerbuttons"><a href="#" id="fullscreen" style="color:#666">Plein écran</a> &nbsp; &nbsp; &nbsp; <a href="./" style="color:#666">Retour à l'accueil</a></div>
  <div id="screen" style="margin-left:auto;margin-right:auto">
    <img src="ajax-loader.gif" style="position:absolute;left:293px;top:212px" class="markedAsRemoved"/>
  </div> <!-- Couleur #EEE pour l'intro -->
</body>
</html>