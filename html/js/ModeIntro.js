/********** ModeIntro **********/

function ModeIntro() {}

ModeIntro.prototype.preload = function(resources) {
    if (this.game.demomode) {
        this.IntroPreTitle = new YDKJAnimation(resources['Intro/IntroPreTitle']);
        this.IntroJack = new YDKJAnimation(resources['Intro/IntroJack']);

        this.MusicJack = new YDKJAnimation(resources['Intro/MusicJack']);
        this.SFXBang = new YDKJAnimation(resources['Intro/SFXBang']);
        this.SFXJackTitle = new YDKJAnimation(resources['Intro/SFXJackTitle']);
        this.IntroJackTitle = new YDKJAnimation(resources['Intro/IntroJackTitle']);
        this.IntroJackDemo = new YDKJAnimation(resources['Intro/IntroJackDemo']);
    } else {
        this.IntroPreTitle = new YDKJAnimation(resources['Intro/IntroPreTitle']);
        this.IntroPreTitle1 = new YDKJAnimation(resources['Intro/IntroPreTitle1']);
        this.IntroPreTitle2 = new YDKJAnimation(resources['Intro/IntroPreTitle2']);
        this.JackLogo = new YDKJAnimation(resources['Intro/JackLogo']);
        this.IntroJack = new YDKJAnimation(resources['Intro/IntroJack']);
        this.IntroJackSound = new YDKJAnimation(resources['Intro/IntroJackSound']); // Image et son séparés car l'un se finit plus tôt que l'autre

        this.MusicJack1st = new YDKJAnimation(resources['Intro/MusicJack1st']);
        this.SFXBang = new YDKJAnimation(resources['Intro/SFXBang']);
        this.MusicJack = new YDKJAnimation(resources['Intro/MusicJack']);
        this.IntroJackTitle = new YDKJAnimation(resources['Intro/IntroJackTitle']);

        this.Welcome = new YDKJAnimation(resources['Intro/Welcome']);
        this.Welcome1Player = new YDKJAnimation(resources['Intro/Welcome1Player']);
        this.Welcome2Players = new YDKJAnimation(resources['Intro/Welcome2Players']);
        this.Welcome3Players = new YDKJAnimation(resources['Intro/Welcome3Players']);

        this.Player1on1 = new YDKJAnimation(resources['Intro/Player1on1']);
        this.Player1on2 = new YDKJAnimation(resources['Intro/Player1on2']);
        this.Player2on2 = new YDKJAnimation(resources['Intro/Player2on2']);
        this.Player1on3 = new YDKJAnimation(resources['Intro/Player1on3']);
        this.Player2on3 = new YDKJAnimation(resources['Intro/Player2on3']);
        this.Player3on3 = new YDKJAnimation(resources['Intro/Player3on3']);
    }
};

ModeIntro.prototype.start = function() {
    var thisMode = this;

    if (this.game.demomode) {
        var skiplistener = 0;

        this.IntroJackDemo.ended(300, function () {
            thisMode.MusicJack.free();
            thisMode.IntroJack.free();
            if (skiplistener) unbindKeyListener(skiplistener);
            thisMode.categoryready(function (category) {
                category.start(); // On passe au choix de la catégorie
            });
        });

        this.IntroJackTitle.ended(300, function () {
            thisMode.IntroJackDemo.play();
            skiplistener = bindKeyListener(function (choice) {
                if (choice == 32) {
                    unbindKeyListener(skiplistener);
                    thisMode.categoryready(function (category) {
                        category.start(); // Barre espace = on passe au choix de la catégorie
                    });
                }
            });
        });

        this.SFXJackTitle.ended(300, function () {
            thisMode.MusicJack.volume(50); // On baisse le volume de la musique de fond
            thisMode.IntroJackTitle.play();
        });

        this.SFXBang.ended(300,function () {
            thisMode.SFXJackTitle.play()
        });

        var playerNamesPos = 0;
        var actualPlayer = 0;
        this.IntroJack.setAnimCallback(function () {
            if (playerNamesPos % 3 == 0) {
                actualPlayer = thisMode.game.displayPlayer(Math.floor(playerNamesPos / 3) + 1);
                actualPlayer.css({'opacity': '0.33'}).show();
            } else {
                if (playerNamesPos % 3 == 1) actualPlayer.css({'opacity': '0.66'});
                else actualPlayer.css({'opacity': 1});
            }
            playerNamesPos++;
        });

        this.IntroPreTitle.ended(function () {
            this.free();
            thisMode.IntroJack.play();
            thisMode.MusicJack.play();
            thisMode.SFXBang.delay(300, function () {
                this.play()
            });
            thisMode.categoryready = thisMode.game.api.gamemode(thisMode); // Preload des catégories pendant l'intro
        });

        this.IntroPreTitle.play();
    } else {
        if (this.game.players.length == 1) this.WelcomePlayers = this.Welcome1Player;
        if (this.game.players.length == 2) this.WelcomePlayers = this.Welcome2Players;
        if (this.game.players.length == 3) this.WelcomePlayers = this.Welcome3Players;

        this.WelcomePlayers.ended(300, function () {
            thisMode.MusicJack.free();
            thisMode.IntroJack.free();
            thisMode.categoryready(function (category) {
                category.start(); // On passe au choix de la catégorie
            });
        });

        this.Welcome.ended(300, function () {
            thisMode.WelcomePlayers.play();
        });

        this.Player2on3.ended(1000,function(){
            thisMode.Player3on3.play();
            var a = thisMode.game.displayPlayer(3);
            a.css({'opacity': '0','display':'','font-size':'24px'}).animate({'opacity':'1'},180);
        });

        this.Player1on3.ended(1000,function(){
            thisMode.Player2on3.play();
            var a = thisMode.game.displayPlayer(2);
            a.css({'opacity': '0','display':'','font-size':'24px'}).animate({'opacity':'1'},180);
        });

        this.Player1on2.ended(1000,function(){
            thisMode.Player2on2.play();
            var a = thisMode.game.displayPlayer(2);
            a.css({'opacity': '0','display':'','font-size':'24px'}).animate({'opacity':'1'},180);
        });

        this.IntroJackTitle.ended(300, function () {
            thisMode.Welcome.play();
        });

        this.IntroJack.ended(function(){
            this.free();
            thisMode.game.html.screen.html('');
            this.delay(300,function(){
                thisMode.MusicJack1st.volume(50); // On baisse le volume de la musique de fond
                thisMode.MusicJack.volume(50);
                thisMode.IntroJackTitle.play();
                this.delay(500,function(){
                    if (thisMode.game.players.length == 1) thisMode.Player1on1.play();
                    if (thisMode.game.players.length == 2) thisMode.Player1on2.play();
                    if (thisMode.game.players.length == 3) thisMode.Player1on3.play();
                    var a = thisMode.game.displayPlayer(1);
                    a.css({'opacity': '0','display':'','font-size':'24px'}).animate({'opacity':'1'},180);
                });
            });
        });

        this.SFXBang.ended(-100,function () {
            this.free();
            thisMode.JackLogo.free();
            thisMode.IntroJack.play();
            thisMode.IntroJackSound.play();
        });

        this.MusicJack1st.ended(function(){
            thisMode.MusicJack.play();
        });

        this.IntroPreTitle.ended(function () {
            this.free();
            thisMode.IntroPreTitle1.free();
            thisMode.IntroPreTitle2.free();
            thisMode.JackLogo.play();
            thisMode.MusicJack1st.play();
            thisMode.SFXBang.play();
            thisMode.categoryready = thisMode.game.api.gamemode(thisMode); // Preload des catégories pendant l'intro
        });

        this.IntroPreTitle1.ended(2000,function(){
            thisMode.IntroPreTitle2.play();
        });

        this.IntroPreTitle.play();
        thisMode.game.html.screen.html('');
        setTimeout(function(){
            thisMode.IntroPreTitle1.play();
        },2800);
    }
};
