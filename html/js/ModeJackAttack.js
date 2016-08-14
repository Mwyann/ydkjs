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
    if (this.game.players.length >= 2) {
        this.Player2Correct = new YDKJAnimation(resources['JackAttack/Player2Correct']);
        this.Player2Wrong = new YDKJAnimation(resources['JackAttack/Player2Wrong']);
    }
    if (this.game.players.length == 3) {
        this.Player3Correct = new YDKJAnimation(resources['JackAttack/Player3Correct']);
        this.Player3Wrong = new YDKJAnimation(resources['JackAttack/Player3Wrong']);
    }
    this.QuestionCorrect = new YDKJAnimation(resources['JackAttack/QuestionCorrect']);
    this.AnswerCorrect = new YDKJAnimation(resources['JackAttack/AnswerCorrect']);

    for(var i = 1; i < 50; i++) {
        this['ShowAnswer'+ i.toString() + '.1'] = new YDKJAnimation(resources['JackAttack/ShowAnswer'+ i.toString() + '.1']);
        this['ShowAnswer'+ i.toString() + '.2'] = new YDKJAnimation(resources['JackAttack/ShowAnswer'+ i.toString() + '.2']);
    }

};

ModeJackAttack.prototype.start = function() {
    var thisMode = this;

    var randomness = new MersenneTwister(); // Grâce à cette classe, tous les joueurs auront les mêmes probabilités d'affichage

    var availableQuestions = [1,2,3,4,5,6,7];
    var randseed = this.options.randseed;
    randomness.init_genrand(randseed);
    var answerseeds = [];
    for(var j = 0; j < 14; j++) {
        var r = -1;
        while (r == -1) {
            r = randomness.integer(0,999999);
            for(var k = 0;k < j; k++) if (answerseeds[k] == r) r = -1;
        }
        answerseeds.push(r);
    }
    var answers = []; // 9 à choisir
    var currentQuestion = 0;
    var currentAnswer = 0;

    var BGMusicPlayed = 0;
    var BGMusicPos = 1;

    var questionList = getSTRfromID(thisMode.STR,'Root',128);
    var ansList = getSTRfromID(thisMode.STR,'Dcoy',128);
    var matchList = getSTRfromID(thisMode.STR,'Mtch',128);
    jQuery.merge(ansList, matchList);

    var currentAnswerAnim;
    var endgameready;

    var endGame = function() {
        thisMode.game.api.registeraction('playerAnswer', function(data){});
        endgameready(function(endgame) {
            endgame.start();
        });
    };

    var nextAnswer = function() {
        if (currentAnswer >= 9) return false;
        var c = currentAnswerAnim;
        while (c == currentAnswerAnim) c = 'ShowAnswer' + (randomness.integer(1,7)+(7*(BGMusicPos-1))).toString();
        currentAnswerAnim = c;
        currentAnswer++;
        thisMode.game.font.resetTextStyle(1510);
        thisMode.game.font.resetTextStyle(1511);
        thisMode.game.font.resetTextStyle(1512);
        thisMode.game.font.resetTextStyle(1513);
        thisMode.game.font.strings[1510] = ansList[answers[currentAnswer-1]];
        thisMode.game.font.strings[1511] = thisMode.game.font.strings[1510];
        thisMode.game.font.strings[1512] = thisMode.game.font.strings[1510];
        thisMode.game.font.strings[1513] = thisMode.game.font.strings[1510];
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
        if (thisMode.game.players.length >= 2) thisMode.Player2Correct.reset();
        if (thisMode.game.players.length == 3) thisMode.Player3Correct.reset();
        var q = availableQuestions[0];
        currentQuestion++;
        currentAnswer = 0;
        thisMode.game.font.resetTextStyle(1500);
        thisMode.game.font.resetTextStyle(1520);
        thisMode.game.font.strings[1500] = questionList[q-1];
        thisMode.game.font.strings[1520] = matchList[q-1];
        randomness.init_genrand(answerseeds[currentQuestion-1]);
        answers = [];
        while (answers.length < 9) answers.push(-1); // Initialiser le tableau avec des éléments à -1
        var r;
        r = randomness.integer(0,8);
        answers[r] = ansList.length - 8 + q; // On place la bonne réponse au hasard
        if (r == 0) answers[randomness.integer(3,8)] = ansList.length - 8 + q; // Si on la place en toute première place, ne soyons pas vaches, plaçons-la un peu plus tard ailleurs aussi
        var i, j, c;
        for(i = 0; i < 9; i++) if (answers[i] == -1) {
            r = -1;
            while (r == -1) {
                r = randomness.integer(1,ansList.length)-1;
                for (j = i - 2; j < i + 2; j++) if ((i >= 0) && (i < 9)) if (answers[j] == r) r = -1; // Pas la même réponse 2 avant ni 2 après
                c = 0;
                for (j = 0; j < i; j++) if (answers[j] == r) c++; // Pas la même réponse plus de 2 fois
                if (c == 2) r = -1;
            }
            answers[i] = r;
        }
        randomness.init_genrand(answerseeds[currentQuestion-1]+1);
        thisMode.ShowQuestion.reset();
        thisMode.ShowQuestion.speed = Math.floor(thisMode['BGMusic' + BGMusicPos].length()/105);
        thisMode.ShowQuestion.delay(thisMode.ShowQuestion.speed*9,function(){nextAnswer()});
        thisMode.ShowQuestion.play();
    };

    var nextQuestion = function() {
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
                endGame();
                return;
            }
        }
        if ((BGMusicPlayed == 0) || (BGMusicPlayed == 2)) {
            if (availableQuestions.length > 1) {
                availableQuestions.push(availableQuestions.shift()); // On remet la question à la fin
                nextQuestion();
            } else { // Fin du jeu
                endGame();
                return;
            }
        }
    };

    var b;
    for(b = 1; b <= 7; b++) this['BGMusic' + b].ended(BGMusicEnded);
    for(b = 1; b <= 7; b++) {
        thisMode['SFXCorrect' + b].ended(function(){
            BGMusicPos++;
            BGMusicPlayed = 0;
            if ((availableQuestions.length > 1) && (BGMusicPos <= 7)) {
                thisMode['BGMusic' + BGMusicPos].play();
                availableQuestions.shift(); // On enlève la question répondue
                nextQuestion();
            } else { // Fin du jeu
                endGame();
                return;
            }
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

    var playerAnswer = function(buzzPlayer, answer) {
        if (currentAnswer > 50) return false;
        if (buzzPlayer) {
            var Wrong;
            var Scream;
            var Correct;
            if (buzzPlayer == 1) {
                Wrong = thisMode.Player1Wrong;
                Scream = thisMode.PlayersScream1;
                Correct = thisMode.Player1Correct;
            }
            if (buzzPlayer == 2) {
                Wrong = thisMode.Player2Wrong;
                Scream = thisMode.PlayersScream2;
                Correct = thisMode.Player2Correct;
            }

            if (buzzPlayer == 3) {
                Wrong = thisMode.Player3Wrong;
                Scream = thisMode.PlayersScream3;
                Correct = thisMode.Player3Correct;
            }

            if (ansList[answers[answer-1]] == matchList[currentQuestion-1]) { // Bonne réponse !
                if (currentAnswer > 50) return false; // On revérifie, on ne sait jamais...
                currentAnswer = 99;
                thisMode.game.players[buzzPlayer-1].score = parseInt(thisMode.game.players[buzzPlayer-1].score) + 2000;
                thisMode['BGMusic' + BGMusicPos].free();
                thisMode['SFXCorrect' + BGMusicPos].play();
                thisMode.ShowQuestion.reset();
                thisMode[currentAnswerAnim+'.1'].reset();
                thisMode[currentAnswerAnim+'.2'].reset();
                thisMode.Player1Wrong.reset();
                thisMode.PlayersScream1.reset();
                if (thisMode.game.players.length >= 2) {
                    thisMode.Player2Wrong.reset();
                    thisMode.PlayersScream2.reset();
                }
                if (thisMode.game.players.length == 3) {
                    thisMode.Player3Wrong.reset();
                    thisMode.PlayersScream3.reset();
                }
                thisMode.AudienceWrong.reset();
                thisMode.game.font.resetTextStyle(1500);
                thisMode.QuestionCorrect.play();
                thisMode.AnswerCorrect.play();
                Correct.play();
                thisMode.AudienceCorrect.reset();
                thisMode.AudienceCorrect.play();
            } else {
                thisMode.game.players[buzzPlayer-1].score = parseInt(thisMode.game.players[buzzPlayer-1].score) - 2000;
                var divWrong = thisMode[currentAnswerAnim+'.2'].getDiv();
                Wrong.reset();
                Scream.reset();
                Wrong.play();
                Scream.play();
                divWrong.stop(true).css({
                    'opacity': 0.8
                }).delay(200).animate({'opacity': 0},100);
            }
        }
    };

    var registerPlayerAnswer = function() {
        thisMode.game.api.registeraction('playerAnswer', function(data){
            if (!data.selfpost) playerAnswer(parseInt(data.player), parseInt(data.answer));
            registerPlayerAnswer();
        });
    };

    var pressKey = function(choice) {
        if (currentAnswer > 50) return false; // Dès qu'on a trouvé la bonne réponse on ignore les appuis sur les touches
        var buzzPlayer = 0;
        if (choice == thisMode.game.players[0].keycode) buzzPlayer = 1; // Joueur 1
        if (thisMode.game.players.length >= 2) if (choice == thisMode.game.players[1].keycode) buzzPlayer = 2; // Joueur 2
        if (thisMode.game.players.length == 3) if (choice == thisMode.game.players[2].keycode) buzzPlayer = 3; // Joueur 3

        if (buzzPlayer) {
            thisMode.game.api.postaction({action: 'playerAnswer', player: buzzPlayer, answer: currentAnswer});
            playerAnswer(buzzPlayer, currentAnswer);
        }
    };

    var startGame = function() {
        thisMode.listener = bindKeyListener(pressKey);
        registerPlayerAnswer();
        thisMode.BGMusic1.play();
        playQuestion();
    };

    this.ShowClue.ended(function(){
        thisMode.TheClue.ended(function(){
            var st = function() {
                thisMode.IntroLoopMusic.free();
                startGame();
            };
            if (thisMode.IntroLoopMusic.isplaying) {
                thisMode.IntroLoopMusic.ended(false);
                thisMode.IntroLoopMusic.ended(st);
            } else st();
        })
    });

    this.TheClue.ended(-800,function(){ // TODO En dernier recours, tant pis, on fait un petit blanc pour éviter de repartir dans la boucle
        thisMode.IntroLoopMusic.ended(false);
        thisMode.IntroLoopMusic.ended(function(){
            this.stop();
        })
    });

    var explainRules = 2;
    var showClue = 0;
    var skiplistener = 0;

    this.LogoHide.ended(200,function(){
        this.free();
        thisMode.game.api.synchronize(function(){
            thisMode.ShowClue.play();
            thisMode.TheClue.play();
        });
    });

    thisMode.HideSkipText.ended(function(){
        this.free();
    });

    var endOfRules2 = function(){
        showClue = function() {
            if (skiplistener) unbindKeyListener(skiplistener);
            thisMode.game.api.registeraction('skipexplanations', function(data){});
            thisMode.ShowSkipText.free();
            thisMode.LogoAnimation1.free();
            thisMode.LogoAnimation2.free();
            thisMode.HideSkipText.play();
            thisMode.LogoHide.play();
            thisMode.Thunder.play();
        };
        if (thisMode.LogoAnimation1.isplaying) showClue();
    };

    this.ExplainRules.ended(300,endOfRules2);
    this.SkipRules.ended(300,endOfRules2);

    var endOfRules1 = function(){ // On ne joue plus l'animation "drapeau" juste avant de passer à l'énoncé de l'indice
        thisMode.LogoAnimation1.ended(false);
        thisMode.LogoAnimation1.ended(function(){
            this.reset();
            this.play();
        });
    };

    this.ExplainRules.ended(-400,endOfRules1);
    this.SkipRules.ended(-400,endOfRules1);

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
            var doskipexplanations = function() {
                unbindKeyListener(skiplistener);
                thisMode.game.api.registeraction('skipexplanations', function(data){});
                thisMode.ShowSkipText.free();
                thisMode.ExplainRules.free();
                thisMode.RememberTheClue.free();
                thisMode.Example.free();
                thisMode.HideSkipText.play();
                thisMode.SkipRules.play();
            };
            var skipexplanations = function() {
                thisMode.game.api.postaction({action: 'skipexplanations'});
                doskipexplanations();
            };

            skiplistener = bindKeyListener(function(choice) {
                if (choice == 32) skipexplanations(); // Barre espace = on passe les explications
            });
            thisMode.game.api.registeraction('skipexplanations', function(data){
                if (!data.selfpost) doskipexplanations();
            });
            thisMode.ShowSkipText.play();
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
                    'width': (rippos * 80).toString() + 'px',
                    'z-index': 1999+rippos // Force le navigateur à redessiner complètement l'image, évite les bugs d'affichage
                });
            } else if (rippos <= 16) {
                blackDiv.css({
                    'left': ((17-rippos) * 80).toString()+'px',
                    'z-index': 1999+rippos // Idem au dessus
                });
            } else {
                clearInterval(interval);
                thisMode.game.html.screen.html(''); // Vidage manuel
            }
        }

        interval = setInterval(loopRip,40);
    };

    var indexPlayer1 = 210;
    var indexPlayer2 = 220;
    var indexPlayer3 = 230;
    if (this.game.players.length == 1) indexPlayer1 = 220;
    if (this.game.players.length == 2) indexPlayer2 = 230;

    this.game.font.strings[indexPlayer1] = this.game.players[0].name;
    this.game.font.strings[indexPlayer1 + 1] = this.game.font.strings[indexPlayer1];
    this.game.font.strings[indexPlayer1 + 5] = '+ '+thisMode.game.displayCurrency(2000);
    this.game.font.strings[indexPlayer1 + 6] = '- '+thisMode.game.displayCurrency(2000);
    if (this.game.players.length >= 2) {
        this.game.font.strings[indexPlayer2] = this.game.players[1].name;
        this.game.font.strings[indexPlayer2 + 1] = this.game.font.strings[indexPlayer2];
        this.game.font.strings[indexPlayer2 + 5] = this.game.font.strings[indexPlayer1 + 5];
        this.game.font.strings[indexPlayer2 + 6] = this.game.font.strings[indexPlayer1 + 6];
    }
    if (this.game.players.length == 3) {
        this.game.font.strings[indexPlayer3] = this.game.players[2].name;
        this.game.font.strings[indexPlayer3 + 1] = this.game.font.strings[indexPlayer3];
        this.game.font.strings[indexPlayer3 + 5] = this.game.font.strings[indexPlayer1 + 5];
        this.game.font.strings[indexPlayer3 + 6] = this.game.font.strings[indexPlayer1 + 6];
    }

    this.game.font.strings[1499] = this.options.title;
    this.game.font.strings[1200] = this.game.font.strings[1100];

    this.CategorySelected.ended(-5000,function(){
        this.free();
        thisMode.SFXRip.play();
        ripBG();
    });

    endgameready = this.game.api.gamemode(this); // Préchargement de la fin du jeu

    if (false) { // DEBUG : false = on affiche tout le jeu, y compris les explications, true = on zappe l'intro et on passe directement au jeu
        thisMode.game.html.screen.html('');
        startGame();
    } else this.CategorySelected.play();

};
