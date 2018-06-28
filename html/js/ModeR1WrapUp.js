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

    anim.ended('VoiceRound2Start', function() {
        nextcategoryready(function(nextcategory) {
            nextcategory.modeObj.chooseplayer = thisMode.chooseplayer; // On donne le choix au joueur précédent
            anim.free('MusicRound2');
            nextcategory.start();
        });
    });

    anim.ended('VoiceRound1Over', 200, function() {
        anim.play('VoiceRound2Start');
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
