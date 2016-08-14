/********** ModeR1WrapUp **********/

function ModeR1WrapUp() {}

ModeR1WrapUp.prototype.preload = function(resources) {
    this.MusicRound2 = new YDKJAnimation(resources['R1WrapUp/MusicRound2']);
    this.MusicChooseCategoryStart = this.MusicRound2; // Sera utilisée par la question 10, elle pensera jouer un son de catégorie.

    this.VoiceRound1Over = new YDKJAnimation(resources['R1WrapUp/VoiceRound1Over']);
    this.VoiceRound2Start = new YDKJAnimation(resources['R1WrapUp/VoiceRound2Start']);
    this.ShowRound2 = new YDKJAnimation(resources['R1WrapUp/ShowRound2']);

    this.ShowPlayer1 = new YDKJAnimation(resources['R1WrapUp/ShowPlayer1']);
    if (this.game.players.length >= 2) {
        this.ShowPlayer2 = new YDKJAnimation(resources['R1WrapUp/ShowPlayer2']);
    }
    if (this.game.players.length == 3) {
        this.ShowPlayer3 = new YDKJAnimation(resources['R1WrapUp/ShowPlayer3']);
    }
};

ModeR1WrapUp.prototype.start = function(resources) {
    var thisMode = this;

    var nextcategoryready;

    this.VoiceRound2Start.ended(function() {
        nextcategoryready(function(nextcategory) {
            nextcategory.modeObj.chooseplayer = thisMode.chooseplayer; // On donne le choix au joueur précédent
            thisMode.MusicRound2.free();
            nextcategory.start();
        });
    });

    this.VoiceRound1Over.ended(200,function() {
        thisMode.VoiceRound2Start.play();
    });

    if (thisMode.game.players.length == 3) {
        this.ShowPlayer3.ended(function () {
            thisMode.ShowRound2.delay(300, function () {this.play()});
        });
    }

    if (thisMode.game.players.length >= 2) {
        this.ShowPlayer2.ended(function() {
            if (thisMode.game.players.length == 3) thisMode.ShowPlayer3.play(); else thisMode.ShowRound2.delay(300,function() {this.play()});
        });
    }

    this.ShowPlayer1.ended(function() {
        if (thisMode.game.players.length >= 2) thisMode.ShowPlayer2.play(); else thisMode.ShowRound2.delay(300,function() {this.play()});
    });

    this.ShowPlayer1.delay(500,function() {
        this.play();
        thisMode.VoiceRound1Over.play();
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
