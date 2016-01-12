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
        this.WelcomePlayers = new YDKJAnimation(resources['Intro/WelcomePlayers']);

        this.Player1 = new YDKJAnimation(resources['Intro/Player1']);
        if (this.game.players.length >= 2) this.Player2 = new YDKJAnimation(resources['Intro/Player2']);
        if (this.game.players.length == 3) this.Player3 = new YDKJAnimation(resources['Intro/Player3']);
    }
};

ModeIntro.prototype.start = function() {
    var thisMode = this;

    this.game.font.strings[310] = this.game.players[0].name;
    this.game.font.strings[315] = this.game.displayCurrency(this.game.players[0].score);
    if (this.game.players.length >= 2) {
        this.game.font.strings[320] = this.game.players[1].name;
        this.game.font.strings[325] = this.game.displayCurrency(this.game.players[1].score);
    }
    if (this.game.players.length == 3) {
        this.game.font.strings[330] = this.game.players[2].name;
        this.game.font.strings[335] = this.game.displayCurrency(this.game.players[2].score);
    }

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

        if (this.game.players.length >= 2) {
            this.Player2.ended(1000,function(){
                if (thisMode.game.players.length == 3) thisMode.Player3.play();
            });
        }

        this.Player1.ended(1000,function(){
            if (thisMode.game.players.length >= 2) thisMode.Player2.play();
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
                    thisMode.Player1.play();
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
