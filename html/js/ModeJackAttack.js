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
    this.Thunder = new YDKJAnimation(resources['JackAttack/Thunder']);
    this.TheClue = new YDKJAnimation(resources['JackAttack/TheClue']);

    this.BGMusic1 = new YDKJAnimation(resources['JackAttack/BGMusic1']);
    this.BGMusic2 = new YDKJAnimation(resources['JackAttack/BGMusic2']);
    this.BGMusic3 = new YDKJAnimation(resources['JackAttack/BGMusic3']);
    this.BGMusic4 = new YDKJAnimation(resources['JackAttack/BGMusic4']);
    this.BGMusic5 = new YDKJAnimation(resources['JackAttack/BGMusic5']);
    this.BGMusic6 = new YDKJAnimation(resources['JackAttack/BGMusic6']);
    this.BGMusic7 = new YDKJAnimation(resources['JackAttack/BGMusic7']);
    this.SFXCorrect1 = new YDKJAnimation(resources['JackAttack/SFXCorrect1']);
    this.SFXCorrect2 = new YDKJAnimation(resources['JackAttack/SFXCorrect2']);
    this.SFXCorrect3 = new YDKJAnimation(resources['JackAttack/SFXCorrect3']);
    this.SFXCorrect4 = new YDKJAnimation(resources['JackAttack/SFXCorrect4']);
    this.SFXCorrect5 = new YDKJAnimation(resources['JackAttack/SFXCorrect5']);
    this.SFXCorrect6 = new YDKJAnimation(resources['JackAttack/SFXCorrect6']);
    this.SFXCorrect7 = new YDKJAnimation(resources['JackAttack/SFXCorrect7']);
    this.EndMusic = new YDKJAnimation(resources['JackAttack/EndMusic']);

    this.AudienceCorrect = new YDKJAnimation(resources['JackAttack/AudienceCorrect']);
    this.AudienceCorrect.volume(50);
    this.AudienceWrong = new YDKJAnimation(resources['JackAttack/AudienceWrong']);
    this.PlayersScream1 = new YDKJAnimation(resources['JackAttack/PlayersScream1']);
    this.PlayersScream2 = new YDKJAnimation(resources['JackAttack/PlayersScream2']);
    this.PlayersScream3 = new YDKJAnimation(resources['JackAttack/PlayersScream3']);

    this.RipBG = new YDKJAnimation(resources['JackAttack/RipBG']);
    this.IntroRound = new YDKJAnimation(resources['JackAttack/IntroRound']);

    this.ShowSkipText = new YDKJAnimation(resources['JackAttack/ShowSkipText']);
    this.HideSkipText = new YDKJAnimation(resources['JackAttack/HideSkipText']);

    this.LogoAnimation1 = new YDKJAnimation(resources['JackAttack/LogoAnimation1']);
    this.LogoAnimation1.speed *= 2;
    this.LogoAnimation2 = new YDKJAnimation(resources['JackAttack/LogoAnimation2']);
    this.Example = new YDKJAnimation(resources['JackAttack/Example']);
    this.Example.speed *= 2;
    this.RememberTheClue = new YDKJAnimation(resources['JackAttack/RememberTheClue']);
    this.RememberTheClue.speed *= 2;
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

    var availableQuestions = [1,2,3,4,5,6,7];
    var answers = this.options.answers; // 9 à choisir
    var currentQuestion = 0;
    var currentAnswer = 0;

    var BGMusicPlayed = 0;
    var BGMusicPos = 1;

    var questionList = getSTRfromID(thisMode.STR,'Root',128);
    var ansList = getSTRfromID(thisMode.STR,'Dcoy',128);
    var matchList = getSTRfromID(thisMode.STR,'Mtch',128);
    jQuery.merge(ansList, matchList);

    var currentAnswerAnim;

    var nextAnswer = function() {
        if (currentAnswer >= 9) return false;
        currentAnswerAnim = 'ShowAnswer' + (Math.floor(Math.random()*10)+1).toString();
        currentAnswer++;
        thisMode.game.font.resetTextStyle(1510);
        thisMode.game.font.resetTextStyle(1511);
        thisMode.game.font.resetTextStyle(1512);
        thisMode.game.font.resetTextStyle(1513);
        thisMode.game.font.resetTextStyle(1520);
        thisMode.game.font.strings[1510] = ansList[answers[currentQuestion-1][currentAnswer-1] % ansList.length];
        thisMode.game.font.strings[1511] = thisMode.game.font.strings[1510];
        thisMode.game.font.strings[1512] = thisMode.game.font.strings[1510];
        thisMode.game.font.strings[1513] = thisMode.game.font.strings[1510];
        thisMode.game.font.strings[1520] = thisMode.game.font.strings[1510];
        var div = thisMode[currentAnswerAnim+'.2'].getDiv();
        div.css({
            'opacity': '0'
        });
        thisMode[currentAnswerAnim+'.1'].speed = Math.floor((thisMode['BGMusic' + BGMusicPos].length()-thisMode.ShowQuestion.speed*15)/77);
        thisMode[currentAnswerAnim+'.2'].speed = thisMode[currentAnswerAnim+'.1'].speed;
        thisMode[currentAnswerAnim+'.1'].play();
        thisMode[currentAnswerAnim+'.2'].play();
    };

    for(var i = 1; i < 50; i++) {
        this['ShowAnswer'+ i.toString() + '.1'].ended(function(){
            this.reset();
            //this.delay(Math.floor((thisMode['BGMusic' + BGMusicPos].length()-5050)/15),function(){nextAnswer()});
            nextAnswer();
        });
        this['ShowAnswer'+ i.toString() + '.2'].ended(function(){
            this.reset();
        });
    }

    var playQuestion = function() {
        thisMode.QuestionCorrect.reset();
        thisMode.AnswerCorrect.reset();
        thisMode.Player1Correct.reset();
        thisMode.Player2Correct.reset();
        thisMode.Player3Correct.reset();
        var q = availableQuestions[0];
        currentQuestion++;
        currentAnswer = 0;
        thisMode.game.font.resetTextStyle(1500);
        thisMode.game.font.strings[1500] = questionList[q-1];
        thisMode.ShowQuestion.reset();
        thisMode.ShowQuestion.speed = Math.floor(thisMode['BGMusic' + BGMusicPos].length()/105);
        thisMode.ShowQuestion.delay(thisMode.ShowQuestion.speed*9,function(){nextAnswer()});
        thisMode.ShowQuestion.play();
    };

    var nextQuestion = function() {
        availableQuestions.push(availableQuestions.shift());
        thisMode.ShowQuestion.delay(400,function(){playQuestion()});
    };

    var BGMusicEnded = function(){
        BGMusicPlayed++;
        if (BGMusicPlayed >= 4) {
            this.free();
            BGMusicPos++;
            if (BGMusicPos < 8) {
                BGMusicPlayed = 0;
                thisMode['BGMusic' + BGMusicPos].play();
            } else { // Fin du jeu
                return;
            }
        }
        if ((BGMusicPlayed == 0) || (BGMusicPlayed == 2)) {
            nextQuestion();
        }
    };

    for(var b = 1; b <= 7; b++) this['BGMusic' + b].ended(BGMusicEnded);
    for(var b = 1; b <= 6; b++) {
        thisMode['SFXCorrect' + b].ended(function(){
            BGMusicPos++;
            BGMusicPlayed = 0;
            thisMode['BGMusic' + BGMusicPos].play();
            nextQuestion();
        });
    }

    this.AudienceWrong.ended(2000,function(){
        this.reset();
    });

    this.PlayersScream1.ended(-500,function(){
        thisMode.AudienceWrong.play();
    });
    this.PlayersScream2.ended(-500,function(){
        thisMode.AudienceWrong.play();
    });
    this.PlayersScream3.ended(-500,function(){
        thisMode.AudienceWrong.play();
    });


    var startGame = function() {
        thisMode.listener = bindKeyListener(function(choice) {
            var buzzPlayer = 0;
            if (choice == thisMode.game.players[0].keycode) buzzPlayer = 1; // Joueur 1
            if (choice == thisMode.game.players[1].keycode) buzzPlayer = 2; // Joueur 2
            if (choice == thisMode.game.players[2].keycode) buzzPlayer = 3; // Joueur 3

            if (buzzPlayer) {
                var divWrong = thisMode[currentAnswerAnim+'.2'].getDiv();
                if (buzzPlayer == 1) {
                    thisMode.Player1Wrong.reset();
                    thisMode.PlayersScream1.reset();
                    thisMode.Player1Wrong.play();
                    thisMode.PlayersScream1.play();
                    divWrong.stop(true).css({
                        'opacity': 0.8
                    }).animate({'opacity': 0},300);
                }
                if (buzzPlayer == 2) {
                    thisMode.Player2Wrong.reset();
                    thisMode.PlayersScream2.reset();
                    thisMode.Player2Wrong.play();
                    thisMode.PlayersScream2.play();
                    divWrong.stop(true).css({
                        'opacity': 0.8
                    }).animate({'opacity': 0},300);
                }

                if (buzzPlayer == 3) {
                    thisMode['BGMusic' + BGMusicPos].free();
                    thisMode['SFXCorrect' + BGMusicPos].play();
                    thisMode.ShowQuestion.reset();
                    thisMode[currentAnswerAnim+'.1'].reset();
                    thisMode[currentAnswerAnim+'.2'].reset();
                    currentAnswer = 99;
                    thisMode.game.font.resetTextStyle(1500);
                    thisMode.QuestionCorrect.play();
                    thisMode.AnswerCorrect.play();
                    thisMode.Player3Correct.play();
                    thisMode.AudienceCorrect.reset();
                    thisMode.AudienceCorrect.play();
                }

                /*if (buzzPlayer == 3) {
                    thisMode.Player3Wrong.reset();
                    thisMode.PlayersScream3.reset();
                    thisMode.Player3Wrong.play();
                    thisMode.PlayersScream3.play();
                    divWrong.stop(true).css({
                        'opacity': 0.8
                    }).animate({'opacity': 0},300);
                }*/
            }
        });
        thisMode.BGMusic1.play();
        playQuestion();
    };

    this.ShowClue.ended(function(){
        thisMode.TheClue.ended(function(){
            thisMode.IntroLoopMusic.ended(function(){
                this.free();
                startGame();
            });
        })
    });

    //this.TheClue.ended(-800,function(){ // En dernier recours, tant pis, on fait un petit blanc pour éviter de retartir dans la boucle
    //    thisMode.IntroLoopMusic.ended(false);
    //});

    var explainRules = 2;
    var showClue = 0;

    this.LogoHide.ended(200,function(){
        this.free();
        thisMode.ShowClue.play();
        thisMode.TheClue.play();
    });

    this.ExplainRules.ended(300,function(){
        showClue = function() {
            thisMode.ShowSkipText.free();
            thisMode.LogoAnimation1.free();
            thisMode.LogoAnimation2.free();
            //thisMode.HideSkipText.play();
            thisMode.LogoHide.play();
            thisMode.Thunder.play();
        };
        if (thisMode.LogoAnimation1.isplaying) showClue();
    });

    this.ExplainRules.ended(-400,function(){ // On ne joue plus l'animation "drapeau" juste avant de passer à l'énoncé de l'indice
        thisMode.LogoAnimation1.ended(false);
        thisMode.LogoAnimation1.ended(function(){
            this.reset();
            this.play();
        });
    });

    this.RememberTheClue.ended(function(){
        this.free();
    });

    this.Example.ended(Math.max(0,13700-this.Example.length()), function(){
        this.free();
        thisMode.RememberTheClue.play();
    });

    this.LogoAnimation2.ended(function() {
        this.reset();
        if (showClue) showClue(); else thisMode.LogoAnimation1.play();
    });

    this.LogoAnimation1.ended(function() {
        this.reset();
        thisMode.LogoAnimation2.play();
        if (explainRules == 2) {
            //thisMode.ShowSkipText.play();
            thisMode.ExplainRules.play();
            thisMode.Example.play();
        }
        else if (explainRules == 1) thisMode.NoExplain.play();
        explainRules = 0;
    });

    this.IntroRound.ended(function(){
        this.free();
        thisMode.LogoAnimation1.play();
    });

    this.IntroStart.ended(function(){
        this.free();
        thisMode.IntroLoopMusic.play();
    });

    this.IntroLaunch.ended(function(){
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
            'height': '480px',
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

    this.game.font.strings[210] = this.game.players[0].name;
    this.game.font.strings[211] = this.game.font.strings[210];
    this.game.font.strings[215] = '+ '+thisMode.game.displayCurrency(2000);
    this.game.font.strings[216] = '- '+thisMode.game.displayCurrency(2000);
    this.game.font.strings[220] = this.game.players[1].name;
    this.game.font.strings[221] = this.game.font.strings[220];
    this.game.font.strings[225] = this.game.font.strings[215];
    this.game.font.strings[226] = this.game.font.strings[216];
    this.game.font.strings[230] = this.game.players[2].name;
    this.game.font.strings[231] = this.game.font.strings[230];
    this.game.font.strings[235] = this.game.font.strings[215];
    this.game.font.strings[236] = this.game.font.strings[216];

    this.game.font.strings[1499] = this.options.title;
    this.game.font.strings[1200] = this.game.font.strings[1100];

    this.CategorySelected.ended(-5000,function(){
        this.free();
        thisMode.SFXRip.play();
        ripBG();
    });

    if (false) {
        thisMode.game.html.screen.html('');
        startGame();
    } else this.CategorySelected.play();

};
