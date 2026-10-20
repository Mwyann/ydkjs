<!DOCTYPE html>
<html>
<head>
    <title>Jouez à You Don't Know Jack®</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="css/ydkj.css?v=18" rel="stylesheet"/>
</head>
<body>

<div class="ydkj-header-logo">
    <div>YOU DON’T KNOW</div>
    <div class="ydkj-logo-jack">JACK<span class="ydkj-logo-reg">®</span></div>
</div>

<div class="ydkj-modes-container">
    <div class="ydkj-modes-title">POUR JOUER, TROIS POSSIBILITÉS :</div>

    <!-- Possibilité 1 -->
    <div class="ydkj-mode-card">
        <div class="ydkj-mode-header">
            <div class="ydkj-mode-img-wrap">
                <img src="cat1.gif" alt="Catégorie 1"/>
            </div>
            <div class="ydkj-mode-info">
                <div class="ydkj-mode-name">DÉMO ORIGINALE DU JEU</div>
                <div class="ydkj-mode-desc">Testez la démo originale du jeu (idéal pour découvrir ou faire découvrir).</div>
            </div>
        </div>
        <div class="ydkj-mode-actions">
            <a href="demo.php" class="ydkj-btn">LANCER LA DÉMO</a>
        </div>
    </div>

    <!-- Possibilité 2 -->
    <div class="ydkj-mode-card">
        <div class="ydkj-mode-header">
            <div class="ydkj-mode-img-wrap">
                <img src="cat2.gif" alt="Catégorie 2"/>
            </div>
            <div class="ydkj-mode-info">
                <div class="ydkj-mode-name">PARTIE RAPIDE EN LOCAL (7&nbsp;QUESTIONS)</div>
                <div class="ydkj-mode-desc">Sur le même ordinateur avec partage du clavier.</div>
            </div>
        </div>
        <div class="ydkj-mode-actions">
            <a href="quick.php?nbplayers=1" class="ydkj-btn">1 JOUEUR</a>
            <a href="quick.php?nbplayers=2" class="ydkj-btn">2 JOUEURS</a>
            <a href="quick.php?nbplayers=3" class="ydkj-btn">3 JOUEURS</a>
        </div>
    </div>

    <!-- Possibilité 3 : Créer ou rejoindre une partie multi-joueurs -->
    <div class="ydkj-mode-card">
        <div class="ydkj-mode-header">
            <div class="ydkj-mode-img-wrap">
                <img src="cat3.gif" alt="Catégorie 3"/>
            </div>
            <div class="ydkj-mode-info">
                <div class="ydkj-mode-name">PARTIE MULTI-JOUEURS (LOCAL OU EN LIGNE)</div>
                <div class="ydkj-mode-desc">Créez votre salon (7 ou 21 questions), rejoignez avec un code ou cherchez une partie publique en cours.</div>
            </div>
        </div>
        <div class="ydkj-mode-actions ydkj-actions-stacked">
            <a href="joinsession.php" class="ydkj-btn">CRÉER UNE PARTIE</a>
            <form action="joinsession.php" method="post" id="form-join" class="ydkj-form-join">
                <input type="text" name="session_id" id="session-code-input" size="4" maxlength="4" class="ydkj-input" placeholder="CODE"/>
                <button type="submit" id="btn-join" class="ydkj-btn">PARTIE PUBLIQUE</button>
            </form>
        </div>
    </div>

    <!-- Section Bonus, Archives et Contact sous forme de blocs -->
    <div class="ydkj-section-title">BONUS, ARCHIVES &amp; CONTACT :</div>

    <div class="ydkj-cards-grid">
        <!-- Bonus 1 : Interview -->
        <div class="ydkj-sub-card">
            <div class="ydkj-sub-card-title">INTERVIEW DE LUC MITÉRAN</div>
            <div class="ydkj-sub-card-desc">&Eacute;coutez l'interview exclusive de la voix mythique de Jack ! Découvrez les anecdotes de doublage et l'envers du décor.</div>
            <div class="ydkj-sub-card-action">
                <a href="itv/" class="ydkj-btn">ÉCOUTER L'INTERVIEW</a>
            </div>
        </div>

        <!-- Bonus 2 : Passage TV Wewewe -->
        <div class="ydkj-sub-card">
            <div class="ydkj-sub-card-title">JACK À LA TÉLÉVISION</div>
            <div class="ydkj-sub-card-desc">Exclusif ! Saviez-vous que Jack voulait passer à la TV ? Visionnez le pré-pilote de Wewewe présenté par Luc Mitéran (+ making of) !</div>
            <div class="ydkj-sub-card-action">
                <a href="https://www.youtube.com/watch?v=jxsfDZwQCrY" target="_blank" class="ydkj-btn">VOIR LA VIDÉO</a>
            </div>
        </div>

        <!-- Info 3 : Projet original -->
        <div class="ydkj-sub-card">
            <div class="ydkj-sub-card-title">PROJET ORIGINAL</div>
            <div class="ydkj-sub-card-desc">Découvrez le projet web original d'adaptation du moteur Jellyvision en JavaScript par l'auteur original.</div>
            <div class="ydkj-sub-card-action">
                <a href="https://www.ydkjs.eu/" target="_blank" class="ydkj-btn">YDKJS.EU</a>
            </div>
        </div>

        <!-- Info 4 : Autres langues -->
        <div class="ydkj-sub-card">
            <div class="ydkj-sub-card-title">AUTRES LANGUES</div>
            <div class="ydkj-sub-card-desc">Les versions anglaise (UK) et allemande sont également disponibles !</div>
            <div class="ydkj-sub-card-action">
                <a href="https://www.ydkj.co.uk/" target="_blank" class="ydkj-btn">YDKJ.CO.UK</a>
                <a href="https://de.ydkj.eu/" target="_blank" class="ydkj-btn">DE.YDKJ.EU</a>
            </div>
        </div>

        <!-- Info 5 : Application Android -->
        <div class="ydkj-sub-card">
            <div class="ydkj-sub-card-title">APPLICATION ANDROID</div>
            <div class="ydkj-sub-card-desc">Jouez au jeu sur votre smartphone ou tablette Android.</div>
            <div class="ydkj-sub-card-action">
                <a href="https://play.google.com/store/apps/details?id=com.mwyann.ydkjs&hl=fr" target="_blank" class="ydkj-btn">GOOGLE PLAY</a>
            </div>
        </div>

        <!-- Info 6 : Contact -->
        <div class="ydkj-sub-card">
            <div class="ydkj-sub-card-title">CONTACTER JACK</div>
            <div class="ydkj-sub-card-desc">Une remarque, un bug non répertorié ou un mot doux pour l'équipe ? Cliquez ci-dessous pour nous écrire.</div>
            <div class="ydkj-sub-card-action">
                <a href="#" id="contact-link" class="ydkj-btn">CONTACTER JACK</a>
            </div>
        </div>
    </div>
</div>

<script>
(function () {
    // Contact obfusqué
    function r13(s) {
        return s.replace(/[a-zA-Z]/g, function (c) {
            return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
    }

    var e = atob('d25weEBscXh3Zi5ya'+'A==');
    e = r13(e);
    var contact = document.getElementById('contact-link');
    if (contact) {
        contact.onclick = function () {
            this.href = 'mailto:' + e;
            this.textContent = e;
            this.onclick = null;
            return false;
        };
    }

    // Gestion dynamique du bouton Rejoindre / Partie publique (Option 3)
    var codeInput = document.getElementById('session-code-input');
    var joinBtn = document.getElementById('btn-join');
    var joinForm = document.getElementById('form-join');

    if (codeInput && joinBtn && joinForm) {
        function updateJoinBtn() {
            if (codeInput.value.trim().length > 0) {
                joinBtn.textContent = 'REJOINDRE';
            } else {
                joinBtn.textContent = 'PARTIE PUBLIQUE';
            }
        }

        codeInput.addEventListener('input', updateJoinBtn);
        codeInput.addEventListener('change', updateJoinBtn);
        codeInput.addEventListener('keyup', updateJoinBtn);
        window.addEventListener('pageshow', updateJoinBtn);
        updateJoinBtn();

        joinForm.addEventListener('submit', function (evt) {
            if (!codeInput.value.trim()) {
                evt.preventDefault();
                window.location.href = 'findsession.php';
            }
        });
    }
})();
</script>

<div id="warning" class="ydkj-box-red">
    <img src="jackhead.png" alt="Jack"/>
    <p class="ydkj-box-red-title">INFORMATIONS IMPORTANTES SUR LE JEU</p>
    <p>
        <u>Ce jeu est sous copyright <a href="https://jackboxgames.com/">Jackbox Games</a></u>. Il est sorti à l'origine en 1995 sur PC et Mac et en 1998 pour la version française (pour en savoir plus, voir la fiche du jeu sur <a href="https://fr.wikipedia.org/wiki/You_Don%27t_Know_Jack">Wikipedia</a>), et j'ai décidé d'en faire une version jouable dans un navigateur en extrayant les éléments graphiques et sonores des fichiers du jeu et en réécrivant (comprenez en simulant) le moteur en Javascript.<br/>
        <br/>
        <u>Je n'ai aucun lien avec Jackbox Games, et cette version du jeu n'est pas un développement officiel.</u> Il s'agit uniquement d'un travail de passionné. La seule version française existante ayant aujourd'hui plus de 15 ans, je souhaite juste en faire profiter les plus jeunes et rendre nostalgique les anciens joueurs.<br/>
        <br/>
        <u>La voix de Jack est celle du <a href="https://www.wppk.fr/">doubleur professionnel Luc Mitéran, dit <u>Walther Pépéka</u></a>.</u> Vous pouvez le contacter par e-mail : <a href="mailto:walther.pepeka@gmail.com">walther.pepeka@gmail.com</a>. Vous pouvez aussi écouter <a href="itv/">l'interview exclusive de Walther Pépéka</a>, afin d'en apprendre plus sur le jeu et sur son travail de comédien !<br/>
        <br/>
        <u>Cette version est loin d'être finie</u>, beaucoup de choses ne sont pas fonctionnelles. J'ajouterai les éléments au fur et à mesure. Pour le moment, seules les questions simples de type QCM, les Couci-Couça, la Rimatologie et les JackAttack sont jouables. Vous pouvez tester la démo du jeu (4 questions) en cliquant sur <a href="demo.php">ce lien</a>. Il est également possible de jouer à plusieurs en ligne !<br/>
        <br/>
        <u>Le jeu est compatible avec tous les navigateurs modernes</u>. Il s'adapte automatiquement à la largeur de votre écran. Il est possible de profiter du mode plein écran complet en cliquant sur le bouton en haut de l'écran (Echap pour quitter). Sous Android, les navigateurs Firefox et Chrome entre autres fonctionnent bien également, vous pouvez appuyer sur les éléments graphiques pour jouer, y compris les Rimatologies et les Jack Attack.<br/>
        <br/>
        <u>Le but de ce projet est de transformer le jeu complet et d'y ajouter des fonctionnalités multi-joueurs en ligne</u>. Il reste encore beaucoup de travail pour finir le portage du jeu, mais cela avance ! Depuis 2026, je me sers notamment de l'IA pour m'assister dans certaines tâches complexes comme le multi-joueur ou l'interface par exemple.<br/>
        <br/>
        Play the UK version: <a href="https://www.ydkj.co.uk/">www.ydkj.co.uk</a><br/>
        Play the DE version: <a href="https://de.ydkj.eu/">de.ydkj.eu</a><br/>
    </p>
</div>
<div class="ydkj-footer">YOU DON’T KNOW JACK® Jackbox Games, Berkeley Systems, Jellyvision, Melog Productions Inc, BMG Interactive, Take-Two Interactive</div>

<?php require 'analytics.php'; ?>
</body>
</html>
