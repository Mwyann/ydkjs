/********** ModeJackAttack **********/

function ModeJackAttack() {}

ModeJackAttack.prototype.preload = function(resources) {
    this.CategorySelected = new YDKJAnimation(resources['JackAttack/CategorySelected']);
    this.SFXRip = new YDKJAnimation(resources['JackAttack/SFXRip']);
    this.IntroLaunch = new YDKJAnimation(resources['JackAttack/IntroLaunch']);
    this.IntroStart = new YDKJAnimation(resources['JackAttack/IntroStart']);
    this.IntroLoopMusic = new YDKJAnimation(resources['JackAttack/IntroLoopMusic']);

    this.ExplainRules = new YDKJAnimation(resources['JackAttack/ExplainRules']);
    this.NoExplain = new YDKJAnimation(resources['JackAttack/NoExplain']);
    this.SkipRules = new YDKJAnimation(resources['JackAttack/SkipRules']);

    this.BGMusic1 = new YDKJAnimation(resources['JackAttack/BGMusic1']);
    this.BGMusic2 = new YDKJAnimation(resources['JackAttack/BGMusic2']);
    this.BGMusic3 = new YDKJAnimation(resources['JackAttack/BGMusic3']);
    this.BGMusic4 = new YDKJAnimation(resources['JackAttack/BGMusic4']);
    this.BGMusic5 = new YDKJAnimation(resources['JackAttack/BGMusic5']);
    this.BGMusic6 = new YDKJAnimation(resources['JackAttack/BGMusic6']);
    this.BGMusic7 = new YDKJAnimation(resources['JackAttack/BGMusic7']);
    this.BGMusic8 = new YDKJAnimation(resources['JackAttack/BGMusic8']);
    this.SFXCorrect1 = new YDKJAnimation(resources['JackAttack/SFXCorrect1']);
    this.SFXCorrect2 = new YDKJAnimation(resources['JackAttack/SFXCorrect2']);
    this.SFXCorrect3 = new YDKJAnimation(resources['JackAttack/SFXCorrect3']);
    this.SFXCorrect4 = new YDKJAnimation(resources['JackAttack/SFXCorrect4']);
    this.SFXCorrect5 = new YDKJAnimation(resources['JackAttack/SFXCorrect5']);
    this.SFXCorrect6 = new YDKJAnimation(resources['JackAttack/SFXCorrect6']);
    this.SFXCorrect7 = new YDKJAnimation(resources['JackAttack/SFXCorrect7']);

    this.AudienceCorrect = new YDKJAnimation(resources['JackAttack/AudienceCorrect']);
    this.AudienceWrong = new YDKJAnimation(resources['JackAttack/AudienceWrong']);
    this.PlayersScream1 = new YDKJAnimation(resources['JackAttack/PlayersScream1']);
    this.PlayersScream2 = new YDKJAnimation(resources['JackAttack/PlayersScream2']);
    this.PlayersScream3 = new YDKJAnimation(resources['JackAttack/PlayersScream3']);

    this.RipBG = new YDKJAnimation(resources['JackAttack/RipBG']);
    this.IntroRound = new YDKJAnimation(resources['JackAttack/IntroRound']);

    this.ShowSkipText = new YDKJAnimation(resources['JackAttack/ShowSkipText']);
    this.HideSkipText = new YDKJAnimation(resources['JackAttack/HideSkipText']);

    this.LogoAnimation1 = new YDKJAnimation(resources['JackAttack/LogoAnimation1']);
    this.LogoAnimation2 = new YDKJAnimation(resources['JackAttack/LogoAnimation2']);
    this.Example = new YDKJAnimation(resources['JackAttack/Example']);
    this.RememberTheClue = new YDKJAnimation(resources['JackAttack/RememberTheClue']);
    this.LogoHide = new YDKJAnimation(resources['JackAttack/LogoHide']);
    this.ShowClue = new YDKJAnimation(resources['JackAttack/ShowClue']);

    this.ShowQuestion = new YDKJAnimation(resources['JackAttack/ShowQuestion']);
    this.Player1Correct = new YDKJAnimation(resources['JackAttack/Player1Correct']);
    this.Player1Wrong = new YDKJAnimation(resources['JackAttack/Player1Wrong']);
    this.Player2Correct = new YDKJAnimation(resources['JackAttack/Player2Correct']);
    this.Player2Wrong = new YDKJAnimation(resources['JackAttack/Player2Wrong']);
    this.Player3Correct = new YDKJAnimation(resources['JackAttack/Player3Correct']);
    this.Player3Wrong = new YDKJAnimation(resources['JackAttack/Player3Wrong']);
    this.QuestionCorrect = new YDKJAnimation(resources['JackAttack/QuestionCorrect']);
    this.AnswerCorrect = new YDKJAnimation(resources['JackAttack/AnswerCorrect']);

    for(var i = 1; i < 50; i++) {
        this['ShowAnswer'+ i.toString() + '.1'] = new YDKJAnimation(resources['JackAttack/ShowAnswer'+ i.toString() + '.1']);
        this['ShowAnswer'+ i.toString() + '.2'] = new YDKJAnimation(resources['JackAttack/ShowAnswer'+ i.toString() + '.2']);
    }

};

ModeJackAttack.prototype.start = function() {
    var thisMode = this;

    this.IntroStart.ended(function(){
        this.free();
        thisMode.IntroLoopMusic.start();
    });

    this.IntroLaunch.ended(function() {
        this.free();
        thisMode.IntroStart.play();
    });

    this.SFXRip.ended(function(){
        this.free();
        thisMode.IntroLaunch.play();
        thisMode.IntroRound.play();
    });

    var ripBG = function() {
        thisMode.game.html.screen.find('.markedAsRemoved').removeClass('markedAsRemoved'); // Ne rien enlever automatiquement, ce sera fait à la fin de l'animation
        var ripdiv = thisMode.RipBG.getDiv();
        ripdiv.css({
            'width': '0px',
            'overflow': 'hidden',
            'z-index': '1999'
        });
        thisMode.RipBG.play();
        var rippos = 0;
        var interval = 0;
        var blackDiv = jQuery('<div />').css({
            'z-index': '2000',
            'background-color': '#000',
            'width': '640px',
            'height': '480px',
            'position': 'absolute',
            'left': '640px',
            'top': '0px'
        });
        blackDiv.appendTo(thisMode.game.html.screen);

        function loopRip() {
            rippos++;
            if (rippos <= 8) {
                ripdiv.css({
                    'width': (rippos * 80).toString() + 'px'
                });
            } else if (rippos <= 16) {
                blackDiv.css({
                    'left': ((17-rippos) * 80).toString()+'px'
                });
            } else {
                clearInterval(interval);
                thisMode.game.html.screen.html(''); // Vidage manuel
            }
        }

        interval = setInterval(loopRip,40);
    };

    this.CategorySelected.ended(-5200,function(){
        this.free();
        thisMode.SFXRip.play();
        ripBG();
    });

    this.CategorySelected.play();
};
