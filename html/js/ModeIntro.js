/********** ModeIntro **********/

function ModeIntro() {}

ModeIntro.prototype.preload = function(resources) {
    this.IntroPreTitle = new YDKJAnimation(resources['Intro/IntroPreTitle']);
    this.IntroJack = new YDKJAnimation(resources['Intro/IntroJack']);

    this.MusicJack = new YDKJAnimation(resources['Intro/MusicJack']);
    this.SFXBang = new YDKJAnimation(resources['Intro/SFXBang']);
    this.SFXJackTitle = new YDKJAnimation(resources['Intro/SFXJackTitle']);
    this.IntroJackTitle = new YDKJAnimation(resources['Intro/IntroJackTitle']);
    this.IntroJackDemo = new YDKJAnimation(resources['Intro/IntroJackDemo']);
};

ModeIntro.prototype.start = function() {
    var thisMode = this;

    var skiplistener = 0;

    this.IntroJackDemo.ended(300,function(){
        thisMode.MusicJack.free();
        thisMode.IntroJack.free();
        if (skiplistener) unbindKeyListener(skiplistener);
        thisMode.categoryready(function(category) {
            category.start(); // On passe au choix de la catégorie
        });
    });

    this.IntroJackTitle.ended(300,function(){
        thisMode.IntroJackDemo.play();
        thisMode.categoryready = thisMode.game.api.gamemode(thisMode); // Preload des catégories pendant le speech
        skiplistener = bindKeyListener(function(choice) {
            if (choice == 32) {
                unbindKeyListener(skiplistener);
                thisMode.categoryready(function(category) {
                    category.start(); // Barre espace = on passe au choix de la catégorie
                });
            }
        });
    });

    this.SFXJackTitle.ended(300,function(){
        thisMode.MusicJack.volume(50); // On baisse le volume de la musique de fond
        thisMode.IntroJackTitle.play();
    });

    this.SFXBang.ended(function(){
        thisMode.SFXJackTitle.delay(300,function(){this.play()});
    });

    var playerNamesPos = 0;
    var actualPlayer = 0;
    this.IntroJack.setAnimCallback(function(){
        if (playerNamesPos % 3 == 0) {
            actualPlayer = thisMode.game.displayPlayer(Math.floor(playerNamesPos/3)+1);
            actualPlayer.css({'opacity':'0.33'}).show();
        } else {
            if (playerNamesPos % 3 == 1) actualPlayer.css({'opacity':'0.66'});
            else actualPlayer.css({'opacity':1});
        }
        playerNamesPos++;
    });

    this.IntroPreTitle.ended(function(){
        this.free();
        thisMode.IntroJack.play();
        thisMode.MusicJack.play();
        thisMode.SFXBang.delay(300,function(){this.play()});
    });

    this.IntroPreTitle.play();
};
