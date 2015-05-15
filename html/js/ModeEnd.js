/********** ModeJackAttack **********/

function ModeEnd() {}

ModeEnd.prototype.preload = function(resources) {
    this.EndMusic = new YDKJAnimation(resources['End/EndMusic']);
    this.FinalScore = new YDKJAnimation(resources['End/FinalScore']);
    this.FinalScore1 = new YDKJAnimation(resources['End/FinalScore1']);
    this.FinalScore2 = new YDKJAnimation(resources['End/FinalScore2']);

    this.Score1of111 = new YDKJAnimation(resources['End/Score1of111']);
    this.Score2of111 = new YDKJAnimation(resources['End/Score2of111']);
    this.Score3of111 = new YDKJAnimation(resources['End/Score3of111']);
    this.Scores111 = new YDKJAnimation(resources['End/Scores111']);
    this.Score1of12 = new YDKJAnimation(resources['End/Score1of12']);
    this.Score2of12 = new YDKJAnimation(resources['End/Score2of12']);
    this.Scores12 = new YDKJAnimation(resources['End/Scores12']);
    this.Score1of21 = new YDKJAnimation(resources['End/Score1of21']);
    this.Score2of21 = new YDKJAnimation(resources['End/Score2of21']);
    this.Scores21 = new YDKJAnimation(resources['End/Scores21']);
    this.Score1of3 = new YDKJAnimation(resources['End/Score1of3']);
    this.Score1of11 = new YDKJAnimation(resources['End/Score1of11']);
    this.Score2of11 = new YDKJAnimation(resources['End/Score2of11']);
    this.Scores11 = new YDKJAnimation(resources['End/Scores11']);
    this.Score1of2 = new YDKJAnimation(resources['End/Score1of2']);
    this.Score1of1 = new YDKJAnimation(resources['End/Score1of1']);

    this.Lights = new YDKJAnimation(resources['End/Lights']);
    this.Lights.speed *= 2;
    this.MusicJack = new YDKJAnimation(resources['End/MusicJack']);
    this.StartMusicJack = new YDKJAnimation(resources['End/StartMusicJack']);
    this.AudienceJack = new YDKJAnimation(resources['End/AudienceJack']);

    this.ShowJackLogo = new YDKJAnimation(resources['End/ShowJackLogo']);
    this.HideJackLogo = new YDKJAnimation(resources['End/HideJackLogo']);
};

ModeEnd.prototype.start = function() {
    var thisMode = this;

    var nbscores = 0;

    var displayScore1 = 0;
    var displayScore2 = 0;
    var displayScore3 = 0;
    var displayScoreAll = 0;

    this.FinalScore2.ended(400,function(){
        thisMode.MusicJack.play();
        this.delay(1000,function(){
            if (displayScoreAll) {
                if (displayScore1) displayScore1.free();
                if (displayScore2) displayScore2.free();
                if (displayScore3) displayScore3.free();
                displayScoreAll.play();
            }
        });
        thisMode.MusicJack.delay(2000,function(){
            this.volume(50);
        });
        thisMode.Lights.delay(3000,function(){
            this.play();
        });
        var volume = 50;
        thisMode.MusicJack.delay(8000,function(){
            var int = setInterval(function(){
                volume--;
                if (volume > 1) thisMode.MusicJack.volume(volume);
                else if (volume == 0) {
                    thisMode.MusicJack.stop();
                    clearInterval(int);
                }
            },200);
        });
    });

    this.FinalScore1.ended(10,function(){
        if (nbscores == 1) {
            if (displayScore2) displayScore2.play();
            nbscores++;
            this.reset();
            this.play();
        } else {
            thisMode.FinalScore2.play();
            if (displayScore1) displayScore1.play();
        }
    });

    this.EndMusic.ended(function(){
        thisMode.FinalScore1.play();
        if (displayScore3) displayScore3.play();
        nbscores = 1;
    });

    this.EndMusic.ended(0-this.FinalScore.length(),function(){
        thisMode.FinalScore.play();
    });

    if (this.game.players.length == 1) {
        displayScore1 = this.Score1of1;
        this.game.font.strings[1610] = this.game.players[0].name;
        this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[0].score);
    } else if (this.game.players.length == 2) {
        if (this.game.players[0].score == this.game.players[1].score) {
            displayScore1 = this.Score1of2;
            this.game.font.strings[1610] = this.game.players[0].name;
            this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[0].score);
            this.game.font.strings[1611] = this.game.players[1].name;
            this.game.font.strings[1616] = this.game.displayCurrency(this.game.players[1].score);
        } else {
            displayScore1 = this.Score1of11;
            displayScore2 = this.Score2of11;
            displayScoreAll = this.Scores11;
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
                displayScore1 = this.Score1of3;
                this.game.font.strings[1620] = this.game.players[0].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1621] = this.game.players[1].name;
                this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1622] = this.game.players[2].name;
                this.game.font.strings[1627] = this.game.displayCurrency(this.game.players[2].score);
            } else if (this.game.players[0].score > this.game.players[2].score) {
                displayScore1 = this.Score1of21;
                displayScore2 = this.Score2of21;
                displayScoreAll = this.Scores21;
                this.game.font.strings[1620] = this.game.players[0].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1621] = this.game.players[1].name;
                this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1630] = this.game.players[2].name;
                this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[2].score);
            } else {
                displayScore1 = this.Score1of12;
                displayScore2 = this.Score2of12;
                displayScoreAll = this.Scores12;
                this.game.font.strings[1610] = this.game.players[2].name;
                this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[2].score);
                this.game.font.strings[1620] = this.game.players[0].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1621] = this.game.players[1].name;
                this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[1].score);
            }
        } else if (this.game.players[0].score > this.game.players[1].score) {
            if (this.game.players[1].score == this.game.players[2].score) {
                displayScore1 = this.Score1of12;
                displayScore2 = this.Score2of12;
                displayScoreAll = this.Scores12;
                this.game.font.strings[1610] = this.game.players[0].name;
                this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1620] = this.game.players[1].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1621] = this.game.players[2].name;
                this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[2].score);
            } else if (this.game.players[1].score > this.game.players[2].score) {
                displayScore1 = this.Score1of111;
                displayScore2 = this.Score2of111;
                displayScore3 = this.Score3of111;
                displayScoreAll = this.Scores111;
                this.game.font.strings[1610] = this.game.players[0].name;
                this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1620] = this.game.players[1].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1630] = this.game.players[2].name;
                this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[2].score);
            } else {
                if (this.game.players[0].score == this.game.players[2].score) {
                    displayScore1 = this.Score1of21;
                    displayScore2 = this.Score2of21;
                    displayScoreAll = this.Scores21;
                    this.game.font.strings[1620] = this.game.players[0].name;
                    this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
                    this.game.font.strings[1621] = this.game.players[2].name;
                    this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[2].score);
                    this.game.font.strings[1630] = this.game.players[1].name;
                    this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[1].score);
                } else if (this.game.players[0].score > this.game.players[2].score) {
                    displayScore1 = this.Score1of111;
                    displayScore2 = this.Score2of111;
                    displayScore3 = this.Score3of111;
                    displayScoreAll = this.Scores111;
                    this.game.font.strings[1610] = this.game.players[0].name;
                    this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[0].score);
                    this.game.font.strings[1620] = this.game.players[1].name;
                    this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[1].score);
                    this.game.font.strings[1630] = this.game.players[2].name;
                    this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[2].score);
                } else {
                    displayScore1 = this.Score1of111;
                    displayScore2 = this.Score2of111;
                    displayScore3 = this.Score3of111;
                    displayScoreAll = this.Scores111;
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
                displayScore1 = this.Score1of21;
                displayScore2 = this.Score2of21;
                displayScoreAll = this.Scores21;
                this.game.font.strings[1620] = this.game.players[1].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1621] = this.game.players[2].name;
                this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[2].score);
                this.game.font.strings[1630] = this.game.players[0].name;
                this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[0].score);
            } else if (this.game.players[0].score == this.game.players[2].score) {
                displayScore1 = this.Score1of12;
                displayScore2 = this.Score2of12;
                displayScoreAll = this.Scores12;
                this.game.font.strings[1610] = this.game.players[1].name;
                this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1620] = this.game.players[0].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1621] = this.game.players[2].name;
                this.game.font.strings[1626] = this.game.displayCurrency(this.game.players[2].score);
            } else if (this.game.players[0].score > this.game.players[2].score) {
                displayScore1 = this.Score1of111;
                displayScore2 = this.Score2of111;
                displayScore3 = this.Score3of111;
                displayScoreAll = this.Scores111;
                this.game.font.strings[1610] = this.game.players[1].name;
                this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[1].score);
                this.game.font.strings[1620] = this.game.players[0].name;
                this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[0].score);
                this.game.font.strings[1630] = this.game.players[2].name;
                this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[2].score);
            } else {
                if (this.game.players[1].score > this.game.players[2].score) {
                    displayScore1 = this.Score1of111;
                    displayScore2 = this.Score2of111;
                    displayScore3 = this.Score3of111;
                    displayScoreAll = this.Scores111;
                    this.game.font.strings[1610] = this.game.players[1].name;
                    this.game.font.strings[1615] = this.game.displayCurrency(this.game.players[1].score);
                    this.game.font.strings[1620] = this.game.players[2].name;
                    this.game.font.strings[1625] = this.game.displayCurrency(this.game.players[2].score);
                    this.game.font.strings[1630] = this.game.players[0].name;
                    this.game.font.strings[1635] = this.game.displayCurrency(this.game.players[0].score);
                } else {
                    displayScore1 = this.Score1of111;
                    displayScore2 = this.Score2of111;
                    displayScore3 = this.Score3of111;
                    displayScoreAll = this.Scores111;
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
    this.EndMusic.play();
};