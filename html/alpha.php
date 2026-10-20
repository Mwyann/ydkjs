<?php

$session_code = '';
if (isset($_GET['session'])) {
    $session_code = strtoupper(trim($_GET['session']));
}

$nbplayers = 3;
if (isset($_GET['nbplayers'])) {
    $nbplayers = intval($_GET['nbplayers']);
    if (($nbplayers < 1) || ($nbplayers > 3)) $nbplayers = 3;
}

?><!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>You Don't Know Jack® ALPHA FR</title>
<link href="css/ydkj.css?v=17" rel="stylesheet"/>
<script src="js/jquery-3.5.1.min.js" type="text/javascript"></script>
<script src="js/YDKJ.js?ver=13" type="text/javascript"></script>

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="manifest" href="/manifest.json">

<script type="text/javascript">

(function(){
  jQuery(document).ready(function() {
    var sessionCode = <?php echo json_encode($session_code); ?>;
    var nbPlayers = <?php echo json_encode($nbplayers); ?>;
    if (sessionCode) {
      var prevSession = (sessionStorage.getItem('ydkj_session') || '').toUpperCase().trim();
      if (prevSession && prevSession !== sessionCode) {
        sessionStorage.removeItem('ydkj_client_id');
        sessionStorage.removeItem('ydkj_token');
      }
      sessionStorage.setItem('ydkj_session', sessionCode);
      sessionStorage.removeItem('ydkj_local_seed');
    } else {
      sessionStorage.removeItem('ydkj_session');
      sessionStorage.setItem('ydkj_nbplayers', nbPlayers);
      sessionStorage.setItem('ydkj_local_seed', 'LOC' + Math.floor(Math.random() * 900000 + 100000));
    }
    var game = new YDKJ(jQuery('#screen'));
    jQuery('#fullscreen').click(function() {
      jQuery('#headerbuttons').hide();
      game.fullscreen(function() {
        jQuery('#headerbuttons').show();
      });
      return false;
    });
    game.start();
    if (window.location.hash.toString().indexOf('fullscreen') >= 0) {
      jQuery('#fullscreen').click();
    }
  });
})();

</script>
</head>

<body style="background-color:#000;margin:0;padding:0;border:0;overflow:hidden">
  <div id="headerbuttons" class="ydkj-game-bar">
    <a href="./" class="ydkj-bar-btn" id="btn-back"><span class="ydkj-btn-arrow">&larr;</span> RETOUR &Agrave; L'ACCUEIL</a>
    <a href="#" class="ydkj-bar-btn" id="fullscreen"><span class="ydkj-btn-icon">&#x26F6;</span> PLEIN &Eacute;CRAN</a>
  </div>
  <div id="screen" style="margin-left:auto;margin-right:auto">
    <img src="directsilence.gif" style="position:absolute;left:293px;top:212px" class="markedAsRemoved"/>
  </div>
  <?php require 'analytics.php'; ?>
</body>
</html>