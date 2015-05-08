<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>You Don't Know Jack® DEMO FR</title>
<link href="css/ydkj.css" rel="stylesheet"/>
<script src="js/jquery-1.11.3.min.js" type="text/javascript"></script>
<?php
$ver = 3;
$scripts = array(
    'js/YDKJ.js',
    'js/YDKJGame.js',
    'js/YDKJFont.js',
    'js/YDKJMode.js',
    'js/YDKJAPI.js',
    'js/YDKJAnimation.js',
    'js/YDKJFile.js',
    'js/common.js',
    'js/ModeIntro.js',
    'js/ModeCategory.js',
    'js/ModeQuestion.js',
    'js/ModeDisOrDat.js',
    'js/ModeJackAttack.js',
    'js/demo-res.js',
    'js/SeamlessLoop.js'
);
foreach($scripts as $s) echo "<script src=\"$s?ver=$ver\" type=\"text/javascript\"></script>\n";
?>

<script type="text/javascript">

jQuery(document).ready(function() {
    startgame();
});

function startgame() {
    var screen = jQuery('#screen');
    var debug = jQuery('#debuglive');
    jQuery('#warning').hide();
    screen.show();
    jQuery('#headerbuttons').show();

    var game = new YDKJ(screen, debug);
    jQuery('#fullscreen').click(function() {
        jQuery('#headerbuttons').hide();
        game.fullscreen(function() {
            jQuery('#headerbuttons').show();
        });
        return false;
    });
    game.demo();
}

</script>
</head>

<body style="background-color:#000;margin:0;padding:0;border:0">
  <div style="text-align:center;font-size:20px;margin:5px;font-family:JackCondensed, sans-serif;display:none" id="headerbuttons"><a href="#" id="fullscreen" style="color:#666">Plein écran</a></div>
  <div id="screen" style="display:none;margin-left:auto;margin-right:auto">
    <img src="ajax-loader.gif" style="position:absolute;left:293px;top:212px" class="markedAsRemoved"/>
  </div> <!-- Couleur #EEE pour l'intro -->
  <div id="debuglive" style="background-color:#000;color:#FFF;padding:5px;margin-top:10px;"><br/></div>
</body>
</html>