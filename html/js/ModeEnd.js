/********** ModeEnd **********/

function ModeEnd() {}

ModeEnd.prototype.preload = function(resources) {
    this.animations = new YDKJAnimList(resources);
    this.animations.animations['Lights'].speed *= 2;
};

ModeEnd.prototype.start = function() {
    var thisMode = this;
    var anim = this.animations;

    var nbscores = 0;

    var displayScore1 = 0;
    var displayScore2 = 0;
    var displayScore3 = 0;
    var displayScoreAll = 0;

    anim.ended('FinalScore2', 400, function(){
        anim.play('MusicJack');
        this.delay(1000,function(){
            if (displayScoreAll) {
                if (displayScore1) displayScore1.free();
                if (displayScore2) displayScore2.free();
                if (displayScore3) displayScore3.free();
                displayScoreAll.play();
            }
        });
        anim.delay('MusicJack', 2000, function(){
            this.volume(50);
        });
        anim.delay('Lights', 3000, function(){
            this.play();
        });
        var volume = 50;
        anim.delay('MusicJack', 8000, function(){
            var int = setInterval(function(){
                volume--;
                if (volume > 1) anim.volume('MusicJack', volume);
                else if (volume == 0) {
                    anim.stop('MusicJack');
                    clearInterval(int);
                }
            },200);
        });
    });

    anim.ended('FinalScore1', 10, function(){
        if (nbscores == 1) {
            if (displayScore2) displayScore2.play();
            nbscores++;
            this.reset();
            this.play();
        } else {
            anim.play('FinalScore2');
            if (displayScore1) displayScore1.play();
        }
    });

    anim.ended('EndMusic', function(){
        anim.play('FinalScore1');
        if (displayScore3) displayScore3.play();
        nbscores = 1;
    });

    anim.ended('EndMusic', 0-anim.length('FinalScore'), function(){
        anim.play('FinalScore');
    });

    if (this.game.players.length == 1) {
        displayScore1 = anim.get('Score1of1');
        this.game.font.strings[1610] = this.game.players[0].name;
        this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[0].score);
    } else if (this.game.players.length == 2) {
        if (this.game.players[0].score == this.game.players[1].score) {
            displayScore1 = anim.get('Score1of2');
            this.game.font.strings[1610] = this.game.players[0].name;
            this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[0].score);
            this.game.font.strings[1611] = this.game.players[1].name;
            this.game.font.strings[1616] = this.game.displayCurrency(this.game.players[1].score);
        } else {
            displayScore1 = anim.get('Score1of11');
            displayScore2 = anim.get('Score2of11');
            displayScoreAll = anim.get('Scores11');
            if (this.game.players[0].score > this.game.players[1].score) {
                this.game.font.strings[1610] = this.game.players[0].name;
                this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1620] = this.game.players[1].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[1].score);
            } else {
                this.game.font.strings[1610] = this.game.players[1].name;
                this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1620] = this.game.players[0].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
            }
        }
    } else if (this.game.players.length == 3) {
        if (this.game.players[0].score == this.game.players[1].score) {
            if (this.game.players[1].score == this.game.players[2].score) {
                displayScore1 = anim.get('Score1of3');
                this.game.font.strings[1620] = this.game.players[0].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1621] = this.game.players[1].name;
                this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1622] = this.game.players[2].name;
                this.game.font.strings[1627] = this.game.displayCurrency(this.game.players[2].score);
            } else if (this.game.players[0].score > this.game.players[2].score) {
                displayScore1 = anim.get('Score1of21');
                displayScore2 = anim.get('Score2of21');
                displayScoreAll = anim.get('Scores21');
                this.game.font.strings[1620] = this.game.players[0].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1621] = this.game.players[1].name;
                this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1630] = this.game.players[2].name;
                this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[2].score);
            } else {
                displayScore1 = anim.get('Score1of12');
                displayScore2 = anim.get('Score2of12');
                displayScoreAll = anim.get('Scores12');
                this.game.font.strings[1610] = this.game.players[2].name;
                this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[2].score);
                this.game.font.strings[1620] = this.game.players[0].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1621] = this.game.players[1].name;
                this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[1].score);
            }
        } else if (this.game.players[0].score > this.game.players[1].score) {
            if (this.game.players[1].score == this.game.players[2].score) {
                displayScore1 = anim.get('Score1of12');
                displayScore2 = anim.get('Score2of12');
                displayScoreAll = anim.get('Scores12');
                this.game.font.strings[1610] = this.game.players[0].name;
                this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1620] = this.game.players[1].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1621] = this.game.players[2].name;
                this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[2].score);
            } else if (this.game.players[1].score > this.game.players[2].score) {
                displayScore1 = anim.get('Score1of111');
                displayScore2 = anim.get('Score2of111');
                displayScore3 = anim.get('Score3of111');
                displayScoreAll = anim.get('Scores111');
                this.game.font.strings[1610] = this.game.players[0].name;
                this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1620] = this.game.players[1].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1630] = this.game.players[2].name;
                this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[2].score);
            } else {
                if (this.game.players[0].score == this.game.players[2].score) {
                    displayScore1 = anim.get('Score1of21');
                    displayScore2 = anim.get('Score2of21');
                    displayScoreAll = anim.get('Scores21');
                    this.game.font.strings[1620] = this.game.players[0].name;
                    this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
                    this.game.font.strings[1621] = this.game.players[2].name;
                    this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[2].score);
                    this.game.font.strings[1630] = this.game.players[1].name;
                    this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[1].score);
                } else if (this.game.players[0].score > this.game.players[2].score) {
                    displayScore1 = anim.get('Score1of111');
                    displayScore2 = anim.get('Score2of111');
                    displayScore3 = anim.get('Score3of111');
                    displayScoreAll = anim.get('Scores111');
                    this.game.font.strings[1610] = this.game.players[0].name;
                    this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[0].score);
                    this.game.font.strings[1620] = this.game.players[1].name;
                    this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[1].score);
                    this.game.font.strings[1630] = this.game.players[2].name;
                    this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[2].score);
                } else {
                    displayScore1 = anim.get('Score1of111');
                    displayScore2 = anim.get('Score2of111');
                    displayScore3 = anim.get('Score3of111');
                    displayScoreAll = anim.get('Scores111');
                    this.game.font.strings[1610] = this.game.players[2].name;
                    this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[2].score);
                    this.game.font.strings[1620] = this.game.players[0].name;
                    this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
                    this.game.font.strings[1630] = this.game.players[1].name;
                    this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[1].score);
                }
            }
        } else {
            if (this.game.players[1].score == this.game.players[2].score) {
                displayScore1 = anim.get('Score1of21');
                displayScore2 = anim.get('Score2of21');
                displayScoreAll = anim.get('Scores21');
                this.game.font.strings[1620] = this.game.players[1].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1621] = this.game.players[2].name;
                this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[2].score);
                this.game.font.strings[1630] = this.game.players[0].name;
                this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[0].score);
            } else if (this.game.players[0].score == this.game.players[2].score) {
                displayScore1 = anim.get('Score1of12');
                displayScore2 = anim.get('Score2of12');
                displayScoreAll = anim.get('Scores12');
                this.game.font.strings[1610] = this.game.players[1].name;
                this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1620] = this.game.players[0].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1621] = this.game.players[2].name;
                this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[2].score);
            } else if (this.game.players[0].score > this.game.players[2].score) {
                displayScore1 = anim.get('Score1of111');
                displayScore2 = anim.get('Score2of111');
                displayScore3 = anim.get('Score3of111');
                displayScoreAll = anim.get('Scores111');
                this.game.font.strings[1610] = this.game.players[1].name;
                this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1620] = this.game.players[0].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1630] = this.game.players[2].name;
                this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[2].score);
            } else {
                if (this.game.players[1].score > this.game.players[2].score) {
                    displayScore1 = anim.get('Score1of111');
                    displayScore2 = anim.get('Score2of111');
                    displayScore3 = anim.get('Score3of111');
                    displayScoreAll = anim.get('Scores111');
                    this.game.font.strings[1610] = this.game.players[1].name;
                    this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[1].score);
                    this.game.font.strings[1620] = this.game.players[2].name;
                    this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[2].score);
                    this.game.font.strings[1630] = this.game.players[0].name;
                    this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[0].score);
                } else {
                    displayScore1 = anim.get('Score1of111');
                    displayScore2 = anim.get('Score2of111');
                    displayScore3 = anim.get('Score3of111');
                    displayScoreAll = anim.get('Scores111');
                    this.game.font.strings[1610] = this.game.players[2].name;
                    this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[2].score);
                    this.game.font.strings[1620] = this.game.players[1].name;
                    this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[1].score);
                    this.game.font.strings[1630] = this.game.players[0].name;
                    this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[0].score);
                }
            }
        }
    }

    thisMode.game.html.screen.html('');
    anim.play('EndMusic');
    this.game.api.postaction({action: 'endGame'});
};