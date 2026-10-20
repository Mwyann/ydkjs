<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Demo YDKJ</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link href="css/ydkj.css?v=18" rel="stylesheet"/>
<script src="js/jquery-3.5.1.min.js" type="text/javascript"></script>
<script src="js/YDKJ.js?ver=14" type="text/javascript"></script>

<script type="text/javascript">

jQuery(document).ready(function() {
  var screen = jQuery('#screen');
  var game = new YDKJ(screen);
  game.setLoader('directsilence.gif', 2000, 'directsilencefin.gif', 1000);
  jQuery('#fullscreen').click(function() {
    jQuery('#headerbuttons').hide();
    game.fullscreen(function() {
      jQuery('#headerbuttons').show();
    });
    return false;
  });
  game.demo();
});

</script>
</head>

<body class="ydkj-game-page">
  <div id="headerbuttons" class="ydkj-game-bar">
    <a href="./" class="ydkj-bar-btn" id="btn-back"><span class="ydkj-btn-arrow">&larr;</span> RETOUR &Agrave; L'ACCUEIL</a>
    <a href="#" class="ydkj-bar-btn" id="fullscreen"><span class="ydkj-btn-icon">&#x26F6;</span> PLEIN &Eacute;CRAN</a>
  </div>
  <div id="screen"></div>
<?php require 'analytics.php'; ?>
</body>
</html>