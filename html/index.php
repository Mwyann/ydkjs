<?php

session_start();
ob_start();

?>
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
<div style="text-align:center;font-size:80px;margin-top:100px;line-height:0"><div style="">YOU DON’T KNOW</div>
    <div style="font-size:350%;line-height:95%">JACK<span style="font-size:10%; vertical-align:top; line-height:400%">®</span></div></div>

<?php

function displaylogin() {
?>
    <form action="./" method="post">
        <div style="width:300px; margin-left:auto; margin-right:auto">
            <div style="text-align:right;font-size:20px;margin:10px">Login : <input type="text" name="login"/></div>
            <div style="text-align:right;font-size:20px;margin:10px">Pass : <input type="password" name="password"/></div>
            <div style="text-align:center;font-size:20px;margin:20px"><input type="submit" value="Connexion"/></div>
        </div>
    </form>
<?php
}

function invited() {
    ?>
    <div style="text-align:center;font-size:28px">Félicitations, vous avez été invité(e) à tester<br/>la version alpha de You Don't Know Jack® !<br/>Inscrivez-vous via le formulaire ci-dessous :</div>
    <form action="./" method="post">
        <div style="width:300px; margin-left:auto; margin-right:auto">
            <input type="hidden" name="invitation" value="<?php echo $_GET['invitation']; ?>"/>
            <div style="text-align:right;font-size:20px;margin:10px">Pseudo : <input type="text" name="nickname"/></div>
            <div style="text-align:right;font-size:20px;margin:10px">Email : <input type="text" name="mail"/></div>
            <div style="text-align:right;font-size:20px;margin:10px">Login : <input type="text" name="login"/></div>
            <div style="text-align:right;font-size:20px;margin:10px">Pass : <input type="password" name="password"/></div>
            <div style="text-align:right;font-size:20px;margin:10px">Répéter : <input type="password" name="pass2"/></div>
            <div style="text-align:center;font-size:20px;margin:20px"><input type="submit" value="Inscription"/></div>
        </div>
    </form>
<?php
}

function loggedin() {
?>
    <div style="text-align:center;font-size:28px">Bienvenue, <?php echo $_SESSION['nickname']?> !</div>
    <div style="text-align:center;font-size:20px;margin:20px"><form action="joinsession.php" method="post">Rejoindre une partie multi-joueurs : <input type="text" name="session_id" size="4" maxlength="4" /> <input type="submit" value="Go" /></form></div>
    <div style="text-align:center;font-size:24px;margin:10px"><a href="solo.php">Jouer à Jack (3 joueurs en local) !</a></div>
    <div style="text-align:center;font-size:24px;margin:10px"><a href="joinsession.php">Commencer une partie multi-joueur !</a></div>
    <div style="text-align:center;font-size:20px;margin:10px"><a href="?help=1">Aide, news, astuces</a></div>
    <div style="text-align:center;font-size:20px;margin:10px"><a href="?logout=1">Déconnexion</a></div>
<?php
//    <div style="text-align:center;font-size:16px;margin:10px"><a href="?account=1">Mon compte</a></div>

}

function account() {
    ?>
    <div style="text-align:center;font-size:28px">Mon compte</div>
    <div style="text-align:center;font-size:20px;margin:10px"><a href="?infos=1">Mes infos</a></div>
    <div style="text-align:center;font-size:20px;margin:10px"><a href="?invitations=1">Mes invitations</a></div>
    <div style="text-align:center;font-size:20px;margin:10px"><a href="/">Retour</a></div>
<?php
}

function help() {
    ?>
    <div style="text-align:center;font-size:28px">Aide, news, astuces</div>
    <div style="text-align:center;font-size:20px;margin:10px">
        Abonnez-vous au compte Twitter <a href="https://twitter.com/YdkjFr" target="_blank">@YdkjFr</a> associé pour connaître les dernières nouveautés.<br/>
        Astuce : Vous pouvez jouer en "plein écran", en cliquant sur le lien en haut de l'écran et en appuyant sur F11 (F11 et Echap pour revenir en mode normal).<br/>
    <div style="text-align:center;font-size:20px;margin:10px"><a href="/">Retour</a></div>
<?php
//        Nouveau : vous pouvez inviter des amis à jouer ! Allez dans "Mon compte" puis dans "Mes invitations".</div>

}

function infos() {
    ?>
    <div style="text-align:center;font-size:28px">Mes infos</div>
    <div style="text-align:center;font-size:20px;margin:10px"><a href="?infos=1">Mes infos</a></div>
    <div style="text-align:center;font-size:20px;margin:10px"><a href="?invitations=1">Mes invitations</a></div>
    <div style="text-align:center;font-size:20px;margin:10px"><a href="/">Retour</a></div>
<?php
}

function invitations() {
    ?>
    <div style="text-align:center;font-size:28px">Mes invitations</div>
    <div style="text-align:center;font-size:16px;margin:10px"><a href="?infos=1">Mes infos</a></div>
    <div style="text-align:center;font-size:16px;margin:10px"><a href="?invitations=1">Mes invitations</a></div>
    <div style="text-align:center;font-size:16px;margin:10px"><a href="/">Retour</a></div>
<?php
}

if (isset($_SESSION['id'])) {
    if (isset($_GET['account'])) {
        account();
    } else if (isset($_GET['help'])) {
        help();
    } else if (isset($_GET['infos'])) {
        infos();
    } else if (isset($_GET['invitations'])) {
        invitations();
    } else if (isset($_GET['logout'])) {
        $_SESSION = array();
        session_destroy();
        session_start();
    } else loggedin();
}

if (!isset($_SESSION['id'])) {
    if (isset($_POST['invitation'])) {
        require_once 'api/mysql.inc.php';
        connectMysql('dyn');
        $invitation = $_POST['invitation'];
        $res = $DB->query("SELECT *
                           FROM ".$DBdyn.".invitations
                           WHERE uid = '".addslashes($invitation)."'");
        $rs = $res->fetch();
        if ($rs) {
            if ($rs['dateused'] === NULL) {

                $res2 = $DB->query("SELECT *
                                   FROM ".$DBdyn.".accounts
                                   WHERE login = '".addslashes($_POST['login'])."'");
                $rs2 = $res2->fetch();
                if ($rs2) {
                    echo "<div style=\"text-align:center;font-size:28px\">Ce login est déjà pris. Veuillez en choisir un autre.</div>";
                } else if ($_POST['password'] != $_POST['pass2']) {
                    echo "<div style=\"text-align:center;font-size:28px\">Les mots de passe ne correspondent pas.</div>";
                } else if (($_POST['mail'] == '') || (!filter_var($_POST['mail'],FILTER_VALIDATE_EMAIL))) {
                    echo "<div style=\"text-align:center;font-size:28px\">L'adresse e-mail est incorrecte.</div>";
                } else {
                    $DB->query("INSERT INTO ".$DBdyn.".accounts (login, password, mail, nickname)
                                VALUES ('".addslashes($_POST['login'])."','".sha1($_POST['login'].$_POST['password'])."','".addslashes($_POST['mail'])."','".addslashes($_POST['nickname'])."')");
                    $id = $DB->lastInsertId();
                    $DB->query("UPDATE ".$DBdyn.".invitations
                               SET dateused = NOW(),
                               godson = ".$id."
                               WHERE uid = '" . addslashes($invitation) . "'");
                    header('Location: ./?login=1');
                }
            } else echo "<div style=\"text-align:center;font-size:28px\">L'invitation a déjà été utilisée.<br/>Contactez <a href=\"mailto:alpha@ydkj.fr\">alpha@ydkj.fr</a> pour en obtenir une.</div>";
        } else echo "<div style=\"text-align:center;font-size:28px\">L'invitation n'existe pas.<br/>Contactez <a href=\"mailto:alpha@ydkj.fr\">alpha@ydkj.fr</a> pour en obtenir une.</div>";
    } else if (isset($_GET['invitation'])) {
        require_once 'api/mysql.inc.php';
        connectMysql('dyn');
        $invitation = $_GET['invitation'];
        $res = $DB->query("SELECT *
                           FROM ".$DBdyn.".invitations
                           WHERE uid = '" . addslashes($invitation) . "'");
        $rs = $res->fetch();
        if ($rs) {
            if ($rs['dateused'] === null) invited();
            else echo "<div style=\"text-align:center;font-size:28px\">L'invitation a déjà été utilisée.<br/>Contactez <a href=\"mailto:alpha@ydkj.fr\">alpha@ydkj.fr</a> pour en obtenir une.</div>";
        } else echo "<div style=\"text-align:center;font-size:28px\">L'invitation n'existe pas.<br/>Contactez <a href=\"mailto:alpha@ydkj.fr\">alpha@ydkj.fr</a> pour en obtenir une.</div>";
    } else if (isset($_POST['login'])) {
        require_once 'api/mysql.inc.php';
        connectMysql('dyn');
        $login = $_POST['login'];
        $password = $_POST['password'];
        $res = $DB->query("SELECT *
                       FROM ".$DBdyn.".accounts
                       WHERE login = '" . addslashes($login) . "'
                       AND password = '" . sha1($login . $password) . "'");
        $rs = $res->fetch();
        if ($rs) {
            $DB->query("UPDATE ".$DBdyn.".accounts
                           SET lastlogin = NOW()
                           WHERE id = '" . addslashes($rs['id']) . "'");
            $_SESSION['id'] = $rs['id'];
            $_SESSION['login'] = $rs['login'];
            $_SESSION['nickname'] = $rs['nickname'];
            $_SESSION['currentsession'] = $rs['currentsession'];
            $_SESSION['invitationsleft'] = $rs['invitationsleft'];
            header('Location: ./');
        } else displaylogin();

    } else if (isset($_GET['login'])) {
        displaylogin();
    } else {
        ?>
        <div style="text-align:center;font-size:26px">Alpha-test disponible : questions QCM du jeu original + multi-joueur en ligne !<br/>Inscription : envoyez un mail à <a href="mailto:alpha@ydkj.fr">alpha@ydkj.fr</a></div>
        <div style="text-align:center;font-size:20px;margin:20px">Vous possédez déjà un compte ? <a href="?login=1">Connectez-vous !</a></div>
        <div style="text-align:center;font-size:20px;margin:20px">Testez la démo du jeu : <a href="http://demo.ydkj.fr/">demo.ydkj.fr</a></div>
        <div style="text-align:center;font-size:20px;margin:20px"><form action="joinsession.php" method="post">Rejoindre une partie multi-joueurs : <input type="text" name="session_id" size="4" maxlength="4" /> <input type="submit" value="Go" /></form></div>
        <div id="warning" style="border:#F00 1px solid; background-color:#300;color:#FFF;margin:50px;padding:20px;font-family:JackCondensed;font-size:18px">
            <p style="text-align:center;font-size:24px;font-weight:bold">ATTENTION : A LIRE AVANT DE JOUER ! <span style="font-size:20px">(Si si, vraiment, au moins ce qui est <u>souligné</u>)</span></p>
            <p>
                <u>Ce jeu est sous copyright <a style="color:#F00" href="http://jackboxgames.com/">Jackbox Games</a></u>. Il est sorti à l'origine en 1995 sur PC et Mac et en 1998 pour la version française (pour en savoir plus, voir la fiche du jeu sur <a style="color:#F00" href="http://fr.wikipedia.org/wiki/You_Don%27t_Know_Jack_%28s%C3%A9rie_de_jeux_vid%C3%A9o%29">Wikipedia</a>), et j'ai décidé d'en faire une version jouable dans un navigateur en extrayant les éléments graphiques et sonores des fichiers du jeu et en réécrivant (comprenez en simulant) le moteur en Javascript.<br/>
                <br/>
                <u>Je n'ai aucun lien avec Jackbox Games, et cette version du jeu n'est pas un développement officiel.</u> Il s'agit uniquement d'un travail de passionné. La seule version française existante ayant aujourd'hui plus de 15 ans, je souhaite juste en faire profiter les plus jeunes et rendre nostalgique les anciens joueurs.<br/>
                <br/>
                <u>Cette version est loin d'être finie</u>, beaucoup de choses ne sont pas fonctionnelles. J'ajouterai les éléments au fur et à mesure. Pour le moment, seules les questions simples de type QCM sont jouables. Vous pouvez tester la démo du jeu (4 questions) en cliquant sur <a style="color:#F00" href="http://demo.ydkj.fr/">ce lien</a>.<br/>
                <br/>
                <u>Le jeu fonctionne le mieux dans Firefox et Chrome</u>. Il est possible de profiter du jeu en "plein écran", en cliquant sur le lien en haut de l'écran et en appuyant sur F11 (F11 et Echap pour revenir en mode normal). Internet Explorer ne gère pas les polices CSS3 et il a des soucis avec les sons qui s'arrêtent trop tôt. Les navigateurs mobiles quant à eux ont des problèmes avec la gestion des fichiers audio (permission de jouer un seul fichier audio à la fois, et uniquement suite à une action de l'utilisateur...).<br/>
                <br/>
                <u>Le but de ce projet est de transformer le jeu complet et d'y ajouter des fonctionnalités multi-joueurs en ligne</u>. Etant donné mon temps libre et le travail que cela va demander, ce n'est pas pour tout de suite, ni pour demain... mais à suivre ! Vous pouvez vous abonner au compte Twitter <a style="color:#F00" href="https://twitter.com/YdkjFr" target="_blank">@YdkjFr</a> associé pour connaître les dernières nouveautés.<br/>
            </p>
        </div>
    <?php
    }
}
?>
</body>
</html>