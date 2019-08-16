/********** ModeR1WrapUp **********/

function ModeR1WrapUp() {}

ModeR1WrapUp.prototype.preload = function(resources) {
    this.animations = new YDKJAnimList(resources);
    var anim = this.animations;

    anim.volume('MusicRound2', 70);
    anim.animations['MusicChooseCategoryStart'] = anim.animations['MusicRound2']; // Sera utilisée par la question 10, elle pensera jouer un son de catégorie.
};

ModeR1WrapUp.prototype.start = function() {
    var thisMode = this;
    var anim = this.animations;

    var nextcategoryready;
    var skiplistener = 0;

    var goNextCat = function() {
        if (skiplistener) unbindKeyListener(skiplistener);
        for(var i = 0; i < thisMode.game.players.length; i++) thisMode.game.players[i].screw = 1; // On redonne des vicieuses à tous les joueurs (ici car si on passe les explications il faut quand même les redistribuer...
        nextcategoryready(function(nextcategory) {
            nextcategory.modeObj.chooseplayer = thisMode.chooseplayer; // On donne le choix au joueur précédent
            anim.free('MusicRound2');
            nextcategory.start();
        });
    };

    anim.ended('VoiceRound2Start', 200, goNextCat)
        .ended('VoiceExplainScrews', 200, goNextCat);

    if (thisMode.game.players.length > 1) {
        anim.ended('SFXGiveScrews', 300, function() {
            var usedScrew = 0;
            for(var i = 0; i < thisMode.game.players.length; i++) if (!thisMode.game.players[i].screw) usedScrew = 1;
            if (usedScrew) anim.play('VoiceRound2Start'); else anim.play('VoiceExplainScrews');
        });

        anim.ended('Player1ScrewShow',function() {
            anim.free('Player1ScrewShow')
                .play('Player1ScrewLoop');
        });

        anim.ended('Player2ScrewShow',function() {
            anim.free('Player2ScrewShow')
                .play('Player2ScrewLoop');
        });

        if (thisMode.game.players.length == 3) {
            anim.ended('Player3ScrewShow',function() {
                anim.free('Player3ScrewShow')
                    .play('Player3ScrewLoop');
            });
        }
    }

    anim.ended('VoiceGiveScrews', 200, function() {
        // Animation + son des vicieuses avant le round 2
        anim.play('SFXGiveScrews')
            .play('Player1ScrewShow')
            .play('Player2ScrewShow', 333);
        if (thisMode.game.players.length == 3) anim.play('Player3ScrewShow', 666);
    });

    anim.ended('VoiceRound1Over', 200, function() {
        if (thisMode.game.players.length > 1) {
            anim.play('VoiceGiveScrews');
        } else anim.play('VoiceRound2Start');
    });

    if (thisMode.game.players.length == 3) {
        anim.ended('ShowPlayer3', function() {
            anim.play('ShowRound2', 300);
        });
    }

    if (thisMode.game.players.length >= 2) {
        anim.ended('ShowPlayer2', function() {
            if (thisMode.game.players.length == 3) anim.play('ShowPlayer3'); else anim.play('ShowRound2', 300);
        });
    }

    anim.ended('ShowPlayer1', function() {
        if (thisMode.game.players.length >= 2) anim.play('ShowPlayer2'); else anim.play('ShowRound2', 300);
    });

    anim.delay('ShowPlayer1', 500, function() {
        this.play();
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
        anim.play('VoiceRound1Over');
    });

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

    this.game.html.screen.html(''); // On vide l'écran
    nextcategoryready = this.game.api.gamemode(this); // Préchargement de la prochaine catégorie
};
