<!DOCTYPE html>
<html>
<head>
    <title>Jouez à You Don't Know Jack®</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <link href="css/ydkj.css" rel="stylesheet"/>
    <style type="text/css">
        a {
            color: #46F;
        }
    </style>
</head>
<body style="background-color:#000;color:#FFF;font-family:JackCondensed, sans-serif">
<div style="text-align:center;font-size:80px;margin-top:100px;line-height:0">
    <div>YOU DON’T KNOW</div>
    <div style="font-size:350%;line-height:95%">JACK<span style="font-size:10%; vertical-align:top; line-height:400%">®</span></div>
</div>

<div style="text-align:center;font-size:30px;margin:20px">Pour jouer, quatre possibilités :</div>
<div style="text-align:center;font-size:20px;margin:12px">- Testez la <a href="demo.php">démo originale du jeu (4 questions)</a></div>
<div style="text-align:center;font-size:20px;margin:12px">- Commencer une partie rapide (7 questions) en local : <a href="quick.php?nbplayers=1">1 joueur</a>, <a href="quick.php?nbplayers=2">2 joueurs</a> ou <a href="quick.php?nbplayers=3">3 joueurs</a></div>
<div style="text-align:center;font-size:20px;margin:12px">- <a href="joinsession.php" style="font-size:30px">Commencer une partie multi-joueurs (local ou en ligne)</a></div>
<div style="text-align:center;font-size:20px;margin:12px"><form action="joinsession.php" method="post">- Rejoindre une partie multi-joueurs : <input type="text" name="session_id" size="4" maxlength="4" /> <input type="submit" value="Go" /> ou <a href="findsession.php">rejoindre une partie publique</a></form></div>
<br/>
<div style="text-align:center;font-size:26px;margin:20px;color:#FF0">&Eacute;coutez <a href="itv/">l'interview exclusive de Luc Mitéran</a>, la voix de Jack !</div>
<div style="text-align:center;font-size:26px;margin:20px;color:#FF0">Exclusif ! Saviez-vous que Jack voulait passer à la TV ?<br/>Visionnez <a href="https://www.youtube.com/watch?v=jxsfDZwQCrY" target="_blank">le pré-pilote de Wewewe</a>, l'émission présentée par Luc Mitéran (+ making of) !</div>
<div style="text-align:center;font-size:20px;margin:10px">Projet original : <a href="http://www.ydkjs.eu/">You Don't Know Javascript</a></div>
<div style="text-align:center;font-size:20px">Contact : <a href="#" id="contact-link">Cliquez ici pour contacter Jack</a></div>
<script>
(function () {
    function r13(s) {
        return s.replace(/[a-zA-Z]/g, function (c) {
            return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
    }

    var e = atob('d25weEBscXh3Zi5ya'+'A==');
    e = r13(e);
    document.getElementById('contact-link').onclick = function () {
        this.href = 'mailto:' + e;
        this.textContent = e;
        this.onclick = null;
        return false;
    };
})();
</script>
<div id="warning" style="border:#F00 1px solid; background-color:#300;color:#FFF;margin:50px;padding:20px;font-family:JackCondensed;font-size:18px">
    <p style="text-align:center;font-size:24px;font-weight:bold">ATTENTION : A LIRE AVANT DE JOUER ! <span style="font-size:20px">(Si si, vraiment, au moins ce qui est <u>souligné</u>)</span></p>
    <p>
        <u>Ce jeu est sous copyright <a style="color:#F00" href="http://jackboxgames.com/">Jackbox Games</a></u>. Il est sorti à l'origine en 1995 sur PC et Mac et en 1998 pour la version française (pour en savoir plus, voir la fiche du jeu sur <a style="color:#F00" href="http://fr.wikipedia.org/wiki/You_Don%27t_Know_Jack_%28s%C3%A9rie_de_jeux_vid%C3%A9o%29">Wikipedia</a>), et j'ai décidé d'en faire une version jouable dans un navigateur en extrayant les éléments graphiques et sonores des fichiers du jeu et en réécrivant (comprenez en simulant) le moteur en Javascript.<br/>
        <br/>
        <u>Je n'ai aucun lien avec Jackbox Games, et cette version du jeu n'est pas un développement officiel.</u> Il s'agit uniquement d'un travail de passionné. La seule version française existante ayant aujourd'hui plus de 15 ans, je souhaite juste en faire profiter les plus jeunes et rendre nostalgique les anciens joueurs.<br/>
        <br/>
        <u>La voix de Jack est celle du <a href="http://www.wppk.fr/" style="color:#FFF">doubleur professionnel Luc Mitéran, dit <span style="color:#F00"><u>Walther Pépéka</u></span></a>.</u> Vous pouvez le contacter par e-mail : <a href="mailto:walther.pepeka@gmail.com" style="color:#F00">walther.pepeka@gmail.com</a>.<br/>Vous pouvez aussi écouter <a href="itv/" style="color:#0CF">l'interview exclusive de Walther Pépéka</a>, afin d'en apprendre plus sur le jeu et sur son travail de comédien !<br/>
        <br/>
        <u>Cette version est loin d'être finie</u>, beaucoup de choses ne sont pas fonctionnelles. J'ajouterai les éléments au fur et à mesure. Pour le moment, seules les questions simples de type QCM, les Couci-Couça, la Rimatologie et les JackAttack sont jouables. Vous pouvez tester la démo du jeu (4 questions) en cliquant sur <a href="demo.php" style="color:#F00">ce lien</a>. Depuis début 2016, il est également possible de jouer à plusieurs en ligne !<br/>
        <br/>
        <u>Le jeu fonctionne le mieux dans Firefox et Chrome</u>. Il est possible de profiter du jeu en "plein écran", en cliquant sur le lien en haut de l'écran (Echap pour revenir en mode normal). Internet Explorer ne gère pas les polices CSS3 et il a des soucis avec les sons qui s'arrêtent trop tôt. Sous Android, les navigateurs Firefox et Chrome fonctionnent relativement bien également, vous pouvez appuyer sur les éléments graphiques pour jouer, mais si vous n'avez pas de clavier physique, vous ne pourrez pas taper la réponse à la Rimatologie, et vous ne pourrez pas jouer à la Jack Attack.<br/>
        <br/>
        <u>Le but de ce projet est de transformer le jeu complet et d'y ajouter des fonctionnalités multi-joueurs en ligne</u>. Il reste encore beaucoup de travail pour finir le portage du jeu, mais cela avance ! Vous pouvez vous abonner au compte Twitter <a style="color:#F00" href="https://twitter.com/YdkjFr" target="_blank">@YdkjFr</a> associé pour connaître les dernières nouveautés.<br/>
        <br/>
        Play the UK version: <a style="color:#F00" href="http://www.ydkj.co.uk/">www.ydkj.co.uk</a><br/>
        Play the DE version: <a style="color:#F00" href="http://de.ydkj.eu/">de.ydkj.eu</a><br/>
    </p>
</div>
<div style="text-align:center;font-size:16px;color:#666;font-family:JackCondensed">YOU DON’T KNOW JACK® Jackbox Games, Berkeley Systems, Jellyvision, Melog Productions Inc, BMG Interactive, Take-Two Interactive</div>

<?php require 'analytics.php'; ?>
</body>
</html>
