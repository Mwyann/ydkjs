/********** ModeIntro **********/

function ModeIntro() {}

ModeIntro.prototype.preload = function() {
    this.IntroPreTitle = new YDKJResource('Intro/IntroPreTitle');
    this.IntroJack = new YDKJResource('Intro/IntroJack');

    this.MusicJack = new YDKJResource('Intro/MusicJack');
    this.SFXBang = new YDKJResource('Intro/SFXBang');
    this.SFXJackTitle = new YDKJResource('Intro/SFXJackTitle');
    this.IntroJackTitle = new YDKJResource('Intro/IntroJackTitle');
    this.IntroJackDemo = new YDKJResource('Intro/IntroJackDemo');
};

ModeIntro.prototype.start = function() {
    var thisMode = this;

    this.IntroJackDemo.ended(function(){
        this.free();
        thisMode.IntroJackDemo.delay(function(){
            thisMode.MusicJack.free();
            thisMode.IntroJack.free();
            if (this.skiplistener) unbindKeyListener(this.skiplistener);
            thisMode.category.start(); // On passe au choix de la catégorie
        },300);
    });

    this.IntroJackTitle.ended(function(){
        this.free();
        thisMode.IntroJackDemo.delay(function(){
            this.play();
            thisMode.category = new YDKJMode(thisMode.game, 'Category', {category:1,questionnumber:1}); // Preload des catégories pendant le speech
            this.skiplistener = bindKeyListener(function(choice) {
                if (choice == 32) {
                    unbindKeyListener(thisMode.skiplistener);
                    thisMode.category.start(); // Barre espace = on passe au choix de la catégorie
                }
            });
        },300);
    });

    this.SFXJackTitle.ended(function(){
        this.free();
        thisMode.IntroJackTitle.delay(function(){
            thisMode.MusicJack.animation.volume(50); // On baisse le volume de la musique de fond
            this.play();
        },300);
    });

    this.SFXBang.ended(function(){
        this.free();
        thisMode.SFXJackTitle.delay(function(){this.play()},300);
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
        thisMode.SFXBang.delay(function(){this.play()},300);
    });

    this.IntroPreTitle.play();
};
