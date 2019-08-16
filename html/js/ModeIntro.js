/********** ModeIntro **********/

function ModeIntro() {}

ModeIntro.prototype.preload = function(resources) {
    this.animations = new YDKJAnimList(resources);
};

ModeIntro.prototype.start = function() {
    var thisMode = this;
    var anim = this.animations;

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

    if (this.game.demomode) { // Mode démo
        var skiplistener = 0;

        anim.ended('IntroJackDemo', 300, function () {
            anim.free('MusicJack')
                .free('IntroJack');
            if (skiplistener) unbindKeyListener(skiplistener);
            thisMode.categoryready(function (category) {
                category.start(); // On passe au choix de la catégorie
            });
        });

        anim.ended('IntroJackTitle', 300, function () {
            anim.play('IntroJackDemo');
            skiplistener = bindKeyListener(function (choice) {
                if (choice == 32) {
                    unbindKeyListener(skiplistener);
                    thisMode.categoryready(function (category) {
                        category.start(); // Barre espace = on passe au choix de la catégorie
                    });
                }
            });
        });

        anim.ended('SFXJackTitle', 300, function () {
            anim.volume('MusicJack', 50) // On baisse le volume de la musique de fond
                .play('IntroJackTitle');
        });

        anim.ended('SFXBang', 300, function () {
            anim.play('SFXJackTitle');
        });

        anim.ended('IntroPreTitle', function () {
            this.free();
            anim.play('IntroJack')
                .play('MusicJack')
                .play('SFXBang', 300);
            thisMode.categoryready = thisMode.game.api.gamemode(thisMode); // Preload des catégories pendant l'intro
        });

        anim.play('IntroPreTitle');

    } else { // Mode jeu normal
        var skiplistener = 0;

        var goNextCat = function() {
            if (skiplistener) unbindKeyListener(skiplistener);
            thisMode.categoryready(function(category) {
                category.start(); // On passe au choix de la catégorie
            });
        };

        if (this.game.players.length == 1) {
            anim.ended('NewPlayers', 300, function () {
                anim.free('MusicJack')
                    .free('IntroJack');
                goNextCat();
            });
        } else {
            anim.ended('LetsGo', 100, function() {
                goNextCat();
            });

            anim.ended('TiltRound1', 100, function() {
                anim.play('LetsGo');
            });

            anim.ended('TiltRound1', -200, function() {
                anim.stop('MusicJack');
                anim.free('MusicJack')
                    .free('IntroJack');
            });

            anim.ended('HelpScrews', function() {
                if (skiplistener) unbindKeyListener(skiplistener);
                anim.free('ShowRound1');
                anim.play('TiltRound1');
                anim.stop('Screw1Loop');
                anim.stop('Screw2Loop');
                if (thisMode.game.players.length == 3) anim.stop('Screw3Loop');
                anim.free('ShowSkipRules');
                anim.play('HideSkipRules');
            });

            anim.ended('SFXScrews', function() {
                anim.play('HelpScrews');
                anim.play('ShowSkipRules');
                var skipRules = function() {
                    thisMode.game.api.postaction({action: 'skipRules'});
                    //goNextCat(); // On laisse l'action loopback s'exécuter car puisqu'on change direct de catégorie, l'action se fait unregister direct et le jeu bloque.
                };
                skiplistener = bindKeyListener(function (choice) {
                    if (choice == 32) skipRules();
                });
                anim.click('ShowSkipRules',skipRules);
                thisMode.game.api.registeraction('skipRules', function(data){
                    /*if (!data.selfpost) */goNextCat();
                });
            });

            anim.ended('Screw1', function() {
                this.free();
                anim.play('Screw1Loop');
                thisMode.game.players[0].screw = 1;
            });

            anim.ended('Screw2', function() {
                this.free();
                anim.play('Screw2Loop');
                thisMode.game.players[1].screw = 1;
            });

            if (this.game.players.length == 3) {
                anim.ended('Screw3', function () {
                    this.free();
                    anim.play('Screw3Loop');
                    thisMode.game.players[2].screw = 1;
                });
            }

            anim.ended('GiveScrews', -200, function() {
                anim.play('SFXScrews');
                anim.play('Screw1', 400);
                anim.play('Screw2', 600);
                if (thisMode.game.players.length == 3) anim.play('Screw3', 800);
            });

            anim.ended('NewPlayers', 100, function () {
                anim.play('GiveScrews');
            });

            if (this.game.players.length == 3) {
                anim.ended('Player2', 1000, function() {
                    anim.play('Player3');
                });
            }

            anim.ended('Player1', 1000, function() {
                anim.play('Player2');
            });
        }

        anim.ended('Welcome', 100, function () {
            anim.play('NewPlayers');
        });

        anim.ended('Welcome', -100, function () {
            anim.play('ShowRound1');
        });

        anim.ended('IntroJackTitle', 300, function () {
            anim.play('Welcome');
        });

        anim.ended('IntroJack', function() {
            this.free();
            thisMode.game.html.screen.html('');
            this.delay(300, function() {
                anim.volume('MusicJack1st', 50) // On baisse le volume de la musique de fond
                    .volume('MusicJack', 50)
                    .play('IntroJackTitle')
                    .play('Player1', 500);
            });
        });

        anim.ended('SFXBang', -100, function() {
            this.free();
            anim.free('JackLogo')
                .play('IntroJack')
                .play('IntroJackSound');
        });

        anim.ended('MusicJack1st', function() {
            anim.play('MusicJack');
        });

        anim.ended('IntroPreTitle', function() {
            this.free();
            anim.free('IntroPreTitle1')
                .free('IntroPreTitle2')
                .play('JackLogo')
                .play('MusicJack1st')
                .play('SFXBang');
            thisMode.categoryready = thisMode.game.api.gamemode(thisMode); // Preload des catégories pendant l'intro
        });

        anim.ended('IntroPreTitle1', 2000, function() {
            anim.play('IntroPreTitle2');
        });

        this.game.api.synchronize(function() {
            anim.play('IntroPreTitle');
            thisMode.game.html.screen.html('');
            anim.play('IntroPreTitle1', 2800);
        });
    }
};
