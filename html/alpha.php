<?php
session_start();

if (isset($_SESSION['session_id'])) {
  $session_id = intval($_SESSION['session_id']);
  if (($session_id > 0) && ($session_id < 1000000)) {
    require 'api/mysql.inc.php';
    connectMysql('dyn');
    $res = $DB->query("SELECT * FROM sessions WHERE status = 2 AND nbplayers > 0 AND id = " . $session_id);
    if ($session = $res->fetch()) {
      $_SESSION['session_id'] = $session_id;
      $_SESSION['nbquestions'] = $session['nbquestions'];
      $_SESSION['nbplayers'] = $session['nbplayers'];
      $_SESSION['player1'] = array('nick' => $session['nick1'], 'id' => $session['player1']);
      $_SESSION['player2'] = array('nick' => $session['nick2'], 'id' => $session['player2']);
      $_SESSION['player3'] = array('nick' => $session['nick3'], 'id' => $session['player3']);
      $players_id = array();
      if ($session['player1'] > 0) $players_id[$session['player1']] = 1;
      if ($session['player2'] > 0) $players_id[$session['player2']] = 1;
      if ($session['player3'] > 0) $players_id[$session['player3']] = 1;
      $_SESSION['players_ids'] = '#'.implode('#',array_keys($players_id)).'#';
    } else die('Session ID unknown');
  } else unset($_SESSION['session_id']);
}
if (!isset($_SESSION['session_id'])) {
  $_SESSION['session_id'] = rand(1000000,999999999);
  //unset($_SESSION['nbplayers']);
  unset($_SESSION['player1']);
  unset($_SESSION['player2']);
  unset($_SESSION['player3']);
  unset($_SESSION['players_ids']);
}
session_write_close();

?><!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>You Don't Know Jack® ALPHA FR</title>
<link href="css/ydkj.css" rel="stylesheet"/>
<script src="js/jquery-3.0.0.min.js" type="text/javascript"></script>
<script src="js/YDKJ.js?ver=7" type="text/javascript"></script>

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
  <?php require 'analytics.php'; ?>
</body>
</html>