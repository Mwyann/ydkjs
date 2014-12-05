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
<div style="text-align:center;font-size:80px;margin-top:150px;line-height:0"><div style="">YOU DON’T KNOW</div>
    <div style="font-size:350%;line-height:95%">JACK<span style="font-size:10%; vertical-align:top; line-height:400%">®</span></div></div>

<?php

function displaylogin() {
?>
    <form action="/" method="post">
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
    <div style="text-align:center;font-size:28px">Félicitations, vous avez été invité à tester<br/>la version alpha de You Don't Know Jack® !<br/>Inscrivez-vous via le formulaire ci-dessous :</div>
    <form action="/" method="post">
        <div style="width:300px; margin-left:auto; margin-right:auto">
            <input type="hidden" name="invitation" value="<?php echo $_GET['invitation']; ?>"/>
            <div style="text-align:right;font-size:20px;margin:10px">Pseudo : <input type="text" name="nickname"/></div>
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
    <div style="text-align:center;font-size:20px;margin:20px"><a href="alpha.php">Jouer une partie !</a></div>
    <div style="text-align:center;font-size:20px;margin:20px"><a href="?logout=1">Déconnexion</a></div>
<?php
}

if (isset($_SESSION['id'])) {
    if (isset($_GET['logout'])) {
        $_SESSION = array();
        session_destroy();
        session_start();
    } else loggedin();
}

if (!isset($_SESSION['id'])) {
    if (isset($_POST['invitation'])) {
        require_once 'api/mysql.inc.php';
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
                } else {
                    $DB->query("INSERT INTO ".$DBdyn.".accounts (login, password, nickname)
                                VALUES ('".addslashes($_POST['login'])."','".sha1($_POST['login'].$_POST['password'])."','".addslashes($_POST['nickname'])."')");
                    $id = $DB->lastInsertId();
                    $DB->query("UPDATE ".$DBdyn.".invitations
                               SET dateused = NOW(),
                               godson = ".$id."
                               WHERE uid = '" . addslashes($invitation) . "'");
                    header('Location: /?login=1');
                }
            } else echo "<div style=\"text-align:center;font-size:28px\">L'invitation a déjà été utilisée.<br/>Contactez <a href=\"mailto:alpha@ydkj.fr\">alpha@ydkj.fr</a> pour en obtenir une.</div>";
        } else echo "<div style=\"text-align:center;font-size:28px\">L'invitation n'existe pas.<br/>Contactez <a href=\"mailto:alpha@ydkj.fr\">alpha@ydkj.fr</a> pour en obtenir une.</div>";
    } else if (isset($_GET['invitation'])) {
        require_once 'api/mysql.inc.php';
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
            header('Location: /');
        } else displaylogin();

    } else if (isset($_GET['login'])) {
        displaylogin();
    } else {
        ?>
        <div style="text-align:center;font-size:28px">Alpha-test disponible ! Inscription : <a href="mailto:alpha@ydkj.fr">alpha@ydkj.fr</a></div>
        <div style="text-align:center;font-size:20px;margin:20px">Vous possédez déjà un compte ? <a href="?login=1">Connectez-vous !</a></div>
    <?php
    }
}
?>
</body>
</html>