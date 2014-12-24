<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>You Don't Know Jack® DEMO FR</title>
<link href="css/ydkj.css" rel="stylesheet"/>
<script src="js/jquery-1.11.1.min.js" type="text/javascript"></script>
<script src="js/YDKJ.js?ver=2" type="text/javascript"></script>

<script type="text/javascript">

jQuery(document).ready(function() {
  jQuery('#startbutton').val("J'ai compris, commencer le jeu");
});

function startgame() {
    var screen = jQuery('#screen');
    jQuery('#warning').hide();
    screen.show();
    jQuery('#headerbuttons').show();

    var game = new YDKJ(screen);
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
  <div id="warning" style="border:#F00 1px solid; background-color:#300;color:#FFF;margin:50px;padding:20px;font-family:JackCondensed;font-size:18px">
    <div style="text-align:center;font-size:42px;font-weight:bold">You Don't Know Jack® DEMO FR</div>
    <p style="text-align:center;font-size:24px;font-weight:bold">ATTENTION : A LIRE AVANT DE JOUER ! <span style="font-size:20px">(Si si, vraiment, au moins ce qui est <u>souligné</u>)</span></p>
    <p>
     <u>Ce jeu est sous copyright <a style="color:#F00" href="http://jackboxgames.com/">Jackbox Games</a></u>. Il est sorti à l'origine en 1995 sur PC et Mac et en 1998 pour la version française (pour en savoir plus, voir la fiche du jeu sur <a style="color:#F00" href="http://fr.wikipedia.org/wiki/You_Don%27t_Know_Jack_%28s%C3%A9rie_de_jeux_vid%C3%A9o%29">Wikipedia</a>), et j'ai décidé d'en faire une version jouable dans un navigateur en extrayant les éléments graphiques et sonores des fichiers du jeu et en réécrivant (comprenez en simulant) le moteur en Javascript.<br/>
     <br/>
     <u>Je n'ai aucun lien avec Jackbox Games, et cette version du jeu n'est pas un développement officiel.</u> Il s'agit uniquement d'un travail de passionné. La seule version française existante ayant aujourd'hui plus de 15 ans, je souhaite juste en faire profiter les plus jeunes et rendre nostalgique les anciens joueurs.<br/>
     <br/>
     <u>Ceci n'est que la démo du jeu original, et elle est loin d'être finie</u>, beaucoup de choses ne sont pas fonctionnelles. J'ajouterai les éléments au fur et à mesure. Vous pouvez télécharger la démo d'origine en cliquant sur <a style="color:#F00" href="JACKDemo.zip">ce lien</a>.<br/>
     <br/>
     <u>Le jeu fonctionne le mieux dans Firefox et Chrome</u>. Il est possible de profiter du jeu en "plein écran", en cliquant sur le lien en haut de l'écran et en appuyant sur F11 (F11 et Echap pour revenir en mode normal). Internet Explorer ne gère pas les polices CSS3 et il a des soucis avec les sons qui s'arrêtent trop tôt. Les navigateurs mobiles quant à eux ont des problèmes avec la gestion des fichiers audio (permission de jouer un seul fichier audio à la fois, et uniquement suite à une action de l'utilisateur...).<br/>
     <br/>
     <u>Le but de ce projet est de transformer le jeu complet et d'y ajouter des fonctionnalités multi-joueurs en ligne</u>. Etant donné mon temps libre et le travail que cela va demander, ce n'est pas pour tout de suite, ni pour demain... mais à suivre ! Vous pouvez vous abonner au compte Twitter <a style="color:#F00" href="https://twitter.com/YdkjFr" target="_blank">@YdkjFr</a> associé pour connaître les dernières nouveautés. Si vous ne connaissez pas déjà le jeu, je vous laisse le découvrir.<br/>
     <br/>
     Contact : <a style="color:#F00" href="mailto:demo@ydkj.fr">demo@ydkj.fr</a>
     <br/>
     <u>Alpha disponible</u> ! Plus d'infos ici : <a style="color:#F00" href="http://play.ydkj.fr/">play.ydkj.fr</a>
    </p>
    <p style="text-align:center"><br/><input type="button" onclick="startgame()" value="Chargement..." id="startbutton" /><br/>
        <span style="font-size:12px">Super, <span style="color:#FF0"><?php include 'count.txt'; ?></span> personnes ont osé essayer !</span></p>
  </div>
  <div id="screen" style="display:none;margin-left:auto;margin-right:auto">
    <img src="ajax-loader.gif" style="position:absolute;left:293px;top:212px" class="markedAsRemoved"/>
  </div> <!-- Couleur #EEE pour l'intro -->
</body>
</html>