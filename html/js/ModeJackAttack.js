/********** ModeJackAttack **********/

function ModeJackAttack() {}

ModeJackAttack.prototype.preload = function(resources) {
    this.animations = new YDKJAnimList(resources);
    var anim = this.animations;

    anim.volume('AudienceCorrect', 50);
    anim.animations['LogoAnimation1'].speed *= 2;
    anim.animations['Example'].speed *= 2;
    anim.animations['RememberTheClue'].speed *= 2;

    // Animations spéciales pour afficher les touches en version mobile
    if (isMobile()) {
        anim.animations['Player1Button'] = anim.animations['Player1'];
        if (this.game.players.length >= 2) {
            anim.animations['Player2Button'] = anim.animations['Player2'];
        }
        if (this.game.players.length == 3) {
            anim.animations['Player3Button'] = anim.animations['Player3'];
        }
    }
};

ModeJackAttack.prototype.start = function() {
    var thisMode = this;
    var anim = this.animations;

    var randomness = new MersenneTwister(); // Grâce à cette classe, tous les joueurs auront les mêmes probabilités d'affichage

    var availableQuestions = [1,2,3,4,5,6,7];
    randomness.init_genrand(parseInt(this.options.randseed));
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
    var pressKey;

    var endGame = function() {
        thisMode.game.api.registeraction('playerAnswer', function(data){});
        unbindKeyListener(pressKey);
        // Effacer les touches à l'écran pour les appareils mobiles
        if (isMobile()) {
            anim.free('Player1Button');
            if (thisMode.game.players.length >= 2) {
                anim.free('Player2Button');
            }
            if (thisMode.game.players.length == 3) {
                anim.free('Player3Button');
            }
        }
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
        var a1 = anim.get(currentAnswerAnim+'.1');
        var a2 = anim.get(currentAnswerAnim+'.2');
        var div = a2.getDiv();
        div.css({
            'opacity': '0'
        });
        a1.speed = Math.floor((anim.length('BGMusic' + BGMusicPos)-anim.get('ShowQuestion').speed*15)/77);
        a2.speed = a1.speed;
        a1.play();
        a2.play();
    };

    for(var i = 1; i < 50; i++) {
        anim.ended('ShowAnswer'+ i + '.1', function(){
            this.reset();
            nextAnswer();
        });
        anim.ended('ShowAnswer'+ i + '.2', function(){
            this.reset();
        });
    }

    var playQuestion = function() {
        anim.reset('QuestionCorrect');
        anim.reset('AnswerCorrect');
        anim.reset('Player1Correct');
        if (thisMode.game.players.length >= 2) anim.reset('Player2Correct');
        if (thisMode.game.players.length == 3) anim.reset('Player3Correct');
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
        anim.reset('ShowQuestion');
        anim.get('ShowQuestion').speed = Math.floor(anim.length('BGMusic' + BGMusicPos)/105);
        anim.delay('ShowQuestion', anim.get('ShowQuestion').speed*9, function(){nextAnswer()});
        anim.play('ShowQuestion');
    };

    var nextQuestion = function() {
        anim.delay('ShowQuestion', 400, function(){playQuestion()});
    };

    var BGMusicEnded = function(){
        BGMusicPlayed++;
        if (BGMusicPlayed >= 4) {
            this.free();
            BGMusicPos++;
            if (BGMusicPos < 8) {
                BGMusicPlayed = 0;
                anim.play('BGMusic' + BGMusicPos);
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
    for(b = 1; b <= 7; b++) {
        anim.ended('BGMusic' + b, BGMusicEnded);
    }
    for(b = 1; b <= 7; b++) {
        anim.ended('SFXCorrect' + b, function(){
            BGMusicPos++;
            BGMusicPlayed = 0;
            if ((availableQuestions.length > 1) && (BGMusicPos <= 7)) {
                anim.play('BGMusic' + BGMusicPos);
                availableQuestions.shift(); // On enlève la question répondue
                nextQuestion();
            } else { // Fin du jeu
                endGame();
                return;
            }
        });
    }

    anim.ended('AudienceWrong', 2000, function(){
        this.reset();
    });

    anim.ended('PlayersScream1', -500, function(){
        anim.play('AudienceWrong');
    });
    anim.ended('PlayersScream2', -500, function(){
        anim.play('AudienceWrong');
    });
    anim.ended('PlayersScream3', -500, function(){
        anim.play('AudienceWrong');
    });

    var playerAnswer = function(buzzPlayer, answer) {
        if (currentAnswer > 50) return false;
        if (answer == 0) return false;
        if (buzzPlayer) {
            var Wrong = anim.get('Player' + buzzPlayer + 'Wrong');
            var Scream = anim.get('PlayersScream' + buzzPlayer);
            var Correct = anim.get('Player' + buzzPlayer + 'Correct');

            if (ansList[answers[answer-1]] == matchList[availableQuestions[0]-1]) { // Bonne réponse !
                if (currentAnswer > 50) return false; // On revérifie, on ne sait jamais...
                currentAnswer = 99;
                thisMode.game.players[buzzPlayer-1].score = parseInt(thisMode.game.players[buzzPlayer-1].score) + 2000;
                anim.free('BGMusic' + BGMusicPos);
                anim.play('SFXCorrect' + BGMusicPos);
                anim.reset('ShowQuestion');
                anim.reset(currentAnswerAnim+'.1');
                anim.reset(currentAnswerAnim+'.2');
                anim.reset('Player1Wrong');
                anim.reset('PlayersScream1');
                if (thisMode.game.players.length >= 2) {
                    anim.reset('Player2Wrong');
                    anim.reset('PlayersScream2');
                }
                if (thisMode.game.players.length == 3) {
                    anim.reset('Player3Wrong');
                    anim.reset('PlayersScream3');
                }
                anim.reset('AudienceWrong');
                thisMode.game.font.resetTextStyle(1500);
                anim.play('QuestionCorrect');
                anim.play('AnswerCorrect');
                Correct.play();
                anim.reset('AudienceCorrect');
                anim.play('AudienceCorrect');
            } else {
                thisMode.game.players[buzzPlayer-1].score = parseInt(thisMode.game.players[buzzPlayer-1].score) - 2000;
                var aWrong = currentAnswerAnim ? anim.get(currentAnswerAnim+'.2') : null;
                var divWrong = aWrong ? aWrong.getDiv() : false;
                Wrong.reset();
                Scream.reset();
                Wrong.play();
                Wrong.getDiv().css('pointer-events','none');
                Scream.play();
                if (divWrong) {
                    divWrong.stop(true).css({
                        'opacity': 0.8
                    }).delay(200).animate({'opacity': 0},100);
                }
            }
        }
    };

    var registerPlayerAnswer = function() {
        thisMode.game.api.registeraction('playerAnswer', function(data){
            if (!data.selfpost) playerAnswer(parseInt(data.player), parseInt(data.answer));
            registerPlayerAnswer();
        });
    };

    pressKey = function(choice) {
        if (currentAnswer > 50) return false; // Dès qu'on a trouvé la bonne réponse on ignore les appuis sur les touches
        if (currentAnswer == 0) return false;
        var buzzPlayer = 0;
        if (findKeycode(choice, thisMode.game.players[0].keycode)) buzzPlayer = 1; // Joueur 1
        if (thisMode.game.players.length >= 2) if (findKeycode(choice, thisMode.game.players[1].keycode)) buzzPlayer = 2; // Joueur 2
        if (thisMode.game.players.length == 3) if (findKeycode(choice, thisMode.game.players[2].keycode)) buzzPlayer = 3; // Joueur 3

        if (buzzPlayer) {
            thisMode.game.api.postaction({action: 'playerAnswer', player: buzzPlayer, answer: currentAnswer});
            playerAnswer(buzzPlayer, currentAnswer);
        }
    };

    var startGame = function() {
        // device detection
        if(isMobile()) {
            // Animations spéciales pour afficher les touches en version mobile
            var div;
            thisMode.game.font.strings[310] = thisMode.game.players[0].name;
            thisMode.game.font.strings[315] = '';
            anim.play('Player1Button');
            anim.click('Player1Button', function(){pressKey(firstKeycode(thisMode.game.players[0].keycode))});
            div = anim.get('Player1Button').getDiv();
            div.css('opacity','0.5');
            if (thisMode.game.players.length >= 2) {
                thisMode.game.font.strings[320] = thisMode.game.players[1].name;
                thisMode.game.font.strings[325] = '';
                anim.play('Player2Button');
                anim.click('Player2Button', function(){pressKey(firstKeycode(thisMode.game.players[1].keycode))});
                div = anim.get('Player2Button').getDiv();
                div.css('opacity','0.5');
            }
            if (thisMode.game.players.length == 3) {
                thisMode.game.font.strings[330] = thisMode.game.players[2].name;
                thisMode.game.font.strings[335] = '';
                anim.play('Player3Button');
                anim.click('Player3Button', function(){pressKey(firstKeycode(thisMode.game.players[2].keycode))});
                div = anim.get('Player3Button').getDiv();
                div.css('opacity','0.5');
            }
        }
        thisMode.listener = bindKeyListener(pressKey);
        registerPlayerAnswer();
        anim.play('BGMusic1');
        playQuestion();
    };

    anim.ended('ShowClue', function(){
        anim.ended('TheClue', function(){
            var st = function() {
                anim.free('IntroLoopMusic');
                startGame();
            };
            if (anim.isplaying('IntroLoopMusic')) {
                anim.ended('IntroLoopMusic', false);
                anim.ended('IntroLoopMusic', st);
            } else st();
        });
    });

    anim.ended('TheClue', -800, function(){ // TODO En dernier recours, tant pis, on fait un petit blanc pour éviter de repartir dans la boucle
        anim.ended('IntroLoopMusic', false);
        anim.ended('IntroLoopMusic', function(){
            this.stop();
        });
    });

    var explainRules = 2;
    var showClue = 0;
    var skiplistener = 0;

    anim.ended('LogoHide', 200, function(){
        this.free();
        thisMode.game.api.synchronize(function(){
            anim.play('ShowClue');
            anim.play('TheClue');
        });
    });

    anim.ended('HideSkipText', function(){
        this.free();
    });

    var endOfRules2 = function(){
        showClue = function() {
            if (skiplistener) unbindKeyListener(skiplistener);
            thisMode.game.api.registeraction('skipexplanations', function(data){});
            anim.free('ShowSkipText');
            anim.free('LogoAnimation1');
            anim.free('LogoAnimation2');
            anim.play('HideSkipText');
            anim.play('LogoHide');
            anim.play('Thunder');
        };
        if (anim.isplaying('LogoAnimation1')) showClue();
    };

    anim.ended('ExplainRules', 300, endOfRules2);
    anim.ended('SkipRules', 300, endOfRules2);

    var endOfRules1 = function(){ // On ne joue plus l'animation "drapeau" juste avant de passer à l'énoncé de l'indice
        anim.ended('LogoAnimation1', false);
        anim.ended('LogoAnimation1', function(){
            this.reset();
            this.play();
        });
    };

    anim.ended('ExplainRules', -400, endOfRules1);
    anim.ended('SkipRules', -400, endOfRules1);

    anim.ended('RememberTheClue', function(){
        this.free();
    });

    anim.ended('Example', Math.max(0,13700-anim.length('Example')), function(){
        this.free();
        anim.play('RememberTheClue');
    });

    anim.ended('LogoAnimation2', function() {
        this.reset();
        if (showClue) showClue(); else anim.play('LogoAnimation1');
    });

    anim.ended('LogoAnimation1', function() {
        this.reset();
        anim.play('LogoAnimation2');
        if (explainRules == 2) {
            var doskipexplanations = function() {
                unbindKeyListener(skiplistener);
                thisMode.game.api.registeraction('skipexplanations', function(data){});
                anim.free('ShowSkipText');
                anim.free('ExplainRules');
                anim.free('RememberTheClue');
                anim.free('Example');
                anim.play('HideSkipText');
                anim.play('SkipRules');
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
            anim.click('ShowSkipText', skipexplanations);
            anim.play('ShowSkipText');
            anim.play('ExplainRules');
            anim.play('Example');
        }
        else if (explainRules == 1) anim.play('NoExplain');
        explainRules = 0;
    });

    anim.ended('IntroRound', function(){
        this.free();
        anim.play('LogoAnimation1');
    });

    anim.ended('IntroStart', function(){
        this.free();
        anim.play('IntroLoopMusic');
    });

    anim.ended('IntroLaunch', function(){
        this.free();
        anim.play('IntroStart');
    });

    anim.ended('SFXRip', function(){
        this.free();
        anim.play('IntroLaunch');
        anim.play('IntroRound');
    });

    var ripBG = function() {
        thisMode.game.html.screen.find('.markedAsRemoved').removeClass('markedAsRemoved'); // Ne rien enlever automatiquement, ce sera fait à la fin de l'animation
        var ripdiv = anim.get('RipBG').getDiv();
        ripdiv.css({
            'width': '0px',
            'height': '480px',
            'overflow': 'hidden',
            'z-index': '1999'
        });
        anim.play('RipBG');
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

    anim.ended('CategorySelected', -5000, function(){
        this.free();
        anim.play('SFXRip');
        ripBG();
    });

    endgameready = this.game.api.gamemode(this); // Préchargement de la fin du jeu

    if (false) { // DEBUG : false = on affiche tout le jeu, y compris les explications, true = on zappe l'intro et on passe directement au jeu
        thisMode.game.html.screen.html('');
        startGame();
    } else anim.play('CategorySelected');

};

