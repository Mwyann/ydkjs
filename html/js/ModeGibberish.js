/********** ModeGibberish **********/

function ModeGibberish() {}

ModeGibberish.prototype.preload = function(resources) {
    this.animations = new YDKJAnimList(resources);
    var anim = this.animations;

    /* Eléments pour la fenêtre de saisie texte */
    var typeframe = new InputTextFrame();
    typeframe.game = this.game;
    typeframe.TextFrameShow = anim.get('TextFrameShow');
    typeframe.TextFrameEnter = anim.get('TextFrameEnter');
    typeframe.ShowAnswerTyping = anim.get('ShowAnswerTyping');
    typeframe.ShowAnswerTextFrame = anim.get('ShowAnswerTextFrame');
    typeframe.SFXShowTextFrame = anim.get('SFXShowTextFrame');
    typeframe.SFXTypeHeartBeat = anim.get('SFXTypeHeartBeat');
    typeframe.SFXTypeAnswer = anim.get('SFXTypeAnswer');
    typeframe.SFXTypeBack = anim.get('SFXTypeBack');
    typeframe.SFXAnswerEntered = anim.get('SFXAnswerEntered');
    typeframe.SFXEraseAnswer = anim.get('SFXEraseAnswer');
    this.typeframe = typeframe;

    this.timerInterval = 0;
};

ModeGibberish.prototype.start = function() {
    var thisMode = this;
    var anim = this.animations;
    this.buzzPlayer = 0;
    this.listener = 0;

    var nextcategoryready;

    var currentpos = 0;
    var decreasing = Math.round(thisMode.options.value/20);
    var ShowHint = 0; // Indice programmé pour apparaitre
    if (thisMode.game.players.length >= 2) {
        anim.ended('LastPlayer1', 100, function() {if (ShowHint) ShowHint()});
        anim.ended('LastPlayer2', 100, function() {if (ShowHint) ShowHint()});
        anim.ended('LastPlayers', 100, function() {if (ShowHint) ShowHint()});
    }
    if (thisMode.game.players.length == 3) {
        anim.ended('LastPlayer3', 100, function() {if (ShowHint) ShowHint()});
    }
    if (anim.has('QuestionHint12')) anim.ended('QuestionHint12', 100, function() {if (ShowHint) ShowHint()}); else anim.ended('QuestionHint11', 100, function() {if (ShowHint) ShowHint()});
    if (anim.has('QuestionHint22')) anim.ended('QuestionHint22', 100, function() {if (ShowHint) ShowHint()}); else anim.ended('QuestionHint21', 100, function() {if (ShowHint) ShowHint()});

    var runTimer = function() {
        currentpos++;
        thisMode.game.font.strings[1305] = thisMode.game.displayCurrency(thisMode.options.value-Math.floor(currentpos/2)*decreasing);
        anim.reset('ShowPrice');
        anim.play('ShowPrice');
        if (!ShowHint) {
            if ((currentpos >= 9) && (!anim.played('ShowHint1'))) { // Premier indice
                ShowHint = function () {
                    anim.play('ShowHint1');
                    anim.play('QuestionHint11');
                    ShowHint = 0;
                }
            }
            if ((currentpos >= 18) && (!anim.played('ShowHint2'))) { // Deuxième indice
                ShowHint = function () {
                    anim.play('ShowHint2');
                    anim.play('QuestionHint21');
                    ShowHint = 0;
                }
            }
            if ((currentpos >= 27) && (!anim.played('ShowHint3'))) { // Troisième indice
                ShowHint = function () {
                    anim.play('ShowHint3');
                    anim.play('QuestionHint31');
                    ShowHint = 0;
                }
            }
            if (currentpos == 40) { // Fin du temps !
                clearInterval(thisMode.timerInterval);
                unbindKeyListener(thisMode.listener);
                anim.reset('MusicPart1');
                anim.reset('MusicPart2');
                anim.reset('MusicPart3');
                anim.free('TimerDance');
                anim.play('TimerTimeOut');
                anim.play('TimerStop');
            }

            if (ShowHint) {
                if ((!anim.isplaying('LastPlayer1')) && (!anim.isplaying('LastPlayer2')) && (!anim.isplaying('LastPlayer3')) && (!anim.isplaying('LastPlayers'))
                  && (!anim.isplaying('QuestionHint11')) && (!anim.isplaying('QuestionHint12')) && (!anim.isplaying('QuestionHint21')) && (!anim.isplaying('QuestionHint22')))
                    ShowHint();
            }
        }
    };

    var registerPlayerBuzz = 0; // Déclaré plus tard

    var registerPlayerBuzzIgnore = function() {
        thisMode.game.api.ignoreaction('playerBuzz');
    };

    var typelistener = 0;

    var jumpToNextCategory = function(len){
        nextcategoryready(function(nextcategory) {
            nextcategory.modeObj.animations.delay('MusicChooseCategoryStart', Math.max(500,2500-len), function() {
                nextcategory.start();
            });
        });
    };

    anim.ended('EndQuestion', function(){jumpToNextCategory(anim.length('EndQuestion'))});
    if (anim.has('RevealAnswer')) anim.ended('RevealAnswer', function(){jumpToNextCategory(anim.length('RevealAnswer'))});

    var revealAnswer = function() {
        registerPlayerBuzzIgnore();
        thisMode.typeframe.showAnswer(getSTRfromID(thisMode.STR,'Ansr',128),function() {
            anim.play('SFXShowAnswerAudience');
        });
    };

    anim.ended('SFXPlayerCorrect', function(){
        this.delay(300,function(){
            nextcategoryready(function(nextcategory) {
                nextcategory.modeObj.chooseplayer = thisMode.buzzPlayer; // On donne le choix au joueur qui a bien répondu
                nextcategory.modeObj.animations.play('MusicChooseCategoryStart');
                anim.delay('SFXPlayerCorrect', 300, function () {
                    anim.play('EndQuestion');
                });
            });
        });
    });

    anim.ended('TextFrameWrong', 100, function() {
        thisMode.game.api.synchronize(function() {
            thisMode.buzzPlayer = 0;
            var nbPlayersLeft = 0;
            for (var i = 1; i <= thisMode.game.players.length; i++) {
                if (thisMode.availPlayers[i]) nbPlayersLeft++;
            }
            if (nbPlayersLeft > 0) {
                if (nbPlayersLeft == 1) {
                    if (thisMode.availPlayers[1]) anim.play('LastPlayer1');
                    if (thisMode.availPlayers[2]) anim.play('LastPlayer2');
                    if (thisMode.availPlayers[3]) anim.play('LastPlayer3');
                } else anim.play('LastPlayers');

                ShowHint = 0;
                registerPlayerBuzz();
                thisMode.listener = bindKeyListener(function (choice) {
                    pressKey(choice);
                });
                anim.play('MusicPart1');
                anim.reset('TimerStop');
                anim.play('TimerDance');
                thisMode.timerInterval = setInterval(runTimer, 750);
            } else {
                if (anim.has('AboutToRevealAnswer')) anim.play('AboutToRevealAnswer'); else revealAnswer();
            }
        });
    });

    anim.ended('SFXPlayerLose', function() {
        anim.reset('TextFrameShow');
        anim.reset('TextFrameWrong');
        anim.play('TextFrameWrong');
    });

    var playerWrong = function() {
        if (typelistener) {
            unbindKeyListener(typelistener);
            typelistener = 0;
        }
        registerTypeAnswerIgnore();
        thisMode.typeframe.wrong(function () {
            setTimeout(function() {
                anim.reset('SFXPlayerLose');
                anim.play('SFXPlayerLose');
                thisMode.availPlayers[thisMode.buzzPlayer] = 0;

                thisMode.game.players[thisMode.buzzPlayer-1].score = parseInt(thisMode.game.players[thisMode.buzzPlayer-1].score) - (parseInt(thisMode.options.value)-Math.floor(currentpos/2)*decreasing);
                thisMode.game.font.strings[10*thisMode.buzzPlayer+105] = thisMode.game.displayCurrency(thisMode.game.players[thisMode.buzzPlayer-1].score);

                anim.free('Player'+thisMode.buzzPlayer+'AnswerLoop');
                anim.play('Player'+thisMode.buzzPlayer+'Wrong');
            },150);
        });
    };

    for (var p = 1; p <= thisMode.game.players.length; p++) {
        (function(pl) {
            anim.ended('Player'+pl+'Answer', function(){
                this.free();
                anim.play('Player'+pl+'AnswerLoop');
            });
            anim.ended('FreeAnswerTimeOutPlayer'+pl, playerWrong);
            anim.ended('Wrong0CluePlayer'+pl, playerWrong);
            anim.ended('Wrong1CluePlayer'+pl, playerWrong);
            anim.ended('Wrong2CluePlayer'+pl, playerWrong);
            anim.ended('Wrong3CluePlayer'+pl, playerWrong);
            anim.ended('WrongSoClosePlayer'+pl, playerWrong);
        })(p);
    }

    this.typeframe.onEnter = function(text) {
        anim.free('FreeAnswerPlayer'+thisMode.buzzPlayer);
        anim.free('FreeAnswerHurry1Player'+thisMode.buzzPlayer);
        anim.free('FreeAnswerHurry2Player'+thisMode.buzzPlayer);
        anim.free('FreeAnswerTimeOutPlayer'+thisMode.buzzPlayer);

        unbindKeyListener(typelistener);
        typelistener = 0;
        registerTypeAnswerIgnore();
        var resultat = checkTextWrds(text,getSTRfromID(thisMode.STR,'Wrds',128));
        if (resultat == 2) { // Bonne réponse !
            var correctAnswer = function() {
                thisMode.game.players[thisMode.buzzPlayer-1].score = parseInt(thisMode.game.players[thisMode.buzzPlayer-1].score) + (parseInt(thisMode.options.value)-Math.floor(currentpos/2)*decreasing);
                thisMode.game.font.strings[10*thisMode.buzzPlayer+105] = thisMode.game.displayCurrency(thisMode.game.players[thisMode.buzzPlayer-1].score);

                anim.reset('TextFrameShow');
                anim.play('TextFrameCorrect');
                anim.play('SFXPlayerCorrect');
                pressKey = function(choice){};

                anim.free('Player'+thisMode.buzzPlayer+'AnswerLoop');
                anim.play('Player'+thisMode.buzzPlayer+'Correct');
            };
            if (anim.has('CorrectAnswer')) {
                anim.ended('CorrectAnswer', 100, correctAnswer);
                anim.play('CorrectAnswer');
            } else correctAnswer();
        } else if (resultat == 1) { // Presque !
            anim.play('WrongSoClosePlayer'+thisMode.buzzPlayer);
        } else { // Mauvaise réponse
            if (currentpos < 9) { // Aucun indice n'a été donné
                anim.play('Wrong0CluePlayer'+thisMode.buzzPlayer);
            } else if (currentpos < 18) { // 1 indice a été donné
                anim.play('Wrong1CluePlayer'+thisMode.buzzPlayer);
            } else if (currentpos < 27) { // 2 indices ont été donnés
                anim.play('Wrong2CluePlayer'+thisMode.buzzPlayer);
            } else { // 3 indices ont été donnés
                anim.play('Wrong3CluePlayer'+thisMode.buzzPlayer);
            }
        }
    };

    var registerTypeAnswer = function() {
        thisMode.game.api.registeraction('typeAnswer', function(data){
            if (!data.selfpost) thisMode.typeframe.sendKeypress(parseInt(data.value));
            registerTypeAnswer();
        });
    };
    var registerTypeAnswerIgnore = function() {
        thisMode.game.api.ignoreaction('typeAnswer');
    };

    anim.ended('SFXPlayerBuzz', function() {
        anim.play('FreeAnswerPlayer'+thisMode.buzzPlayer);

        unbindKeyListener(thisMode.listener);
        registerTypeAnswer(); // Réaction à l'api
        if (hasKeycode(thisMode.game.players[thisMode.buzzPlayer-1].keycode)) { // Ce joueur peut répondre
            var handleKey = function(key) {
                thisMode.game.api.postaction({action: 'typeAnswer', value: key});
                thisMode.typeframe.sendKeypress(key);
            };
            thisMode.typeframe.onKey = handleKey;
            thisMode.typeframe.canInput = true;
            typelistener = bindKeyListener(handleKey);
        } else {
            thisMode.typeframe.onKey = null;
            thisMode.typeframe.canInput = false;
        }
        thisMode.typeframe.start();
    });

    var playerBuzz = function() {
        if (thisMode.buzzPlayer) {
            registerPlayerBuzzIgnore();
            clearInterval(thisMode.timerInterval);

            anim.reset('MusicPart1');
            anim.reset('MusicPart2');
            anim.reset('MusicPart3');
            anim.reset('QuestionIntro2');
            anim.reset('QuestionIntro3');
            anim.reset('QuestionHint11');
            anim.reset('QuestionHint21');
            anim.reset('QuestionHint31');
            if (anim.has('QuestionHint12')) anim.reset('QuestionHint12');
            if (anim.has('QuestionHint22')) anim.reset('QuestionHint22');
            if (anim.has('QuestionHint32')) anim.reset('QuestionHint32');
            anim.reset('TimerDance');
            anim.play('TimerStop');
            anim.reset('AboutToRevealAnswer');

            anim.reset('SFXPlayerBuzz');
            anim.play('SFXPlayerBuzz');
            anim.free('Player'+thisMode.buzzPlayer+'ShowKey');
            anim.play('Player'+thisMode.buzzPlayer+'Answer');
        }
    };

    registerPlayerBuzz = function() {
        thisMode.game.api.registeraction('playerBuzz', function(data){
            if (!data.selfpost) {
                thisMode.buzzPlayer = parseInt(data.value);
                playerBuzz();
            }
        });
    };

    var pressKey = function(choice) {
        if (!choice) return false; // Si on se voit envoyer 0 à cause d'un clic sur un joueur à keycode 0
        if (thisMode.buzzPlayer != 0) return false; // On a déjà un joueur en attente
        if (findKeycode(choice, thisMode.game.players[0].keycode)) thisMode.buzzPlayer = 1; // Joueur 1
        if (thisMode.game.players.length >= 2) {
            if (findKeycode(choice, thisMode.game.players[1].keycode)) thisMode.buzzPlayer = 2; // Joueur 2
        }
        if (thisMode.game.players.length == 3) {
            if (findKeycode(choice, thisMode.game.players[2].keycode)) thisMode.buzzPlayer = 3; // Joueur 3
        }
        if (!thisMode.availPlayers[thisMode.buzzPlayer]) thisMode.buzzPlayer = 0;

        if (thisMode.buzzPlayer) {
            thisMode.game.api.postaction({action: 'playerBuzz', value: thisMode.buzzPlayer});
            playerBuzz(); // Laisser l'API faire un auto-appel ? (règle le souci du buzz en même temps, mais ajoute un petit délai)
        }
    };

    anim.ended('SFXShowAnswerAudience', 150, function() {
        nextcategoryready(function(nextcategory) {
            nextcategory.modeObj.chooseplayer = thisMode.chooseplayer; // On donne le choix au joueur précédent
            nextcategory.modeObj.animations.play('MusicChooseCategoryStart');
        });
        if (anim.has('RevealAnswer')) anim.play('RevealAnswer'); else anim.play('EndQuestion');
    });

    if (anim.has('AboutToRevealAnswer')) anim.ended('AboutToRevealAnswer', 100, revealAnswer);

    anim.ended('TimerTimeOut', 100, function() {
        if (anim.has('AboutToRevealAnswer')) anim.play('AboutToRevealAnswer'); else revealAnswer();
    });

    anim.ended('QuestionHint31', 300, function() {
        this.free();
        if (anim.has('QuestionHint32')) anim.play('QuestionHint32');
    });

    anim.ended('QuestionHint21', 300, function() {
        this.free();
        if (anim.has('QuestionHint22')) anim.play('QuestionHint22');
    });

    anim.ended('QuestionHint11', 300, function() {
        this.free();
        if (anim.has('QuestionHint12')) anim.play('QuestionHint12');
    });

    anim.ended('QuestionIntro2', 100, function() {
        this.free();
        if (anim.has('QuestionIntro3')) anim.play('QuestionIntro3');
    });

    anim.ended('MusicPart3', function(){
        this.reset();
        anim.play('MusicPart1');
    });

    anim.ended('MusicPart2', function(){
        this.reset();
        anim.play('MusicPart3');
    });

    anim.ended('MusicPart1', function(){
        this.reset();
        anim.play('MusicPart2');
    });

    anim.ended('TimerDance', 100, function() {
        anim.reset('TimerDance');
        anim.play('TimerDance');
    });

    anim.ended('ShowQuestion', 100, function() {
        anim.play('MusicPart1');
        anim.play('QuestionIntro2');
        anim.free('TimerComesIn');
        anim.play('TimerDance');

        thisMode.availPlayers = [];
        thisMode.availPlayers[1] = 1;
        anim.click('Player1ShowKey', function(){pressKey(firstKeycode(thisMode.game.players[0].keycode))});
        if (thisMode.game.players.length >= 2) {
            thisMode.availPlayers[2] = 1;
            anim.click('Player2ShowKey', function(){pressKey(firstKeycode(thisMode.game.players[1].keycode))});
        }
        if (thisMode.game.players.length == 3) {
            thisMode.availPlayers[3] = 1;
            anim.click('Player3ShowKey', function(){pressKey(firstKeycode(thisMode.game.players[2].keycode))});
        }

        registerPlayerBuzz();
        thisMode.listener = bindKeyListener(function(choice) {
            pressKey(choice);
        });

        thisMode.timerInterval = setInterval(runTimer,750);
    });

    if (anim.has('QuestionIntro1')) {
        anim.ended('QuestionIntro1', 100, function() {
            this.free();
            thisMode.game.api.synchronize(function() {
                anim.play('ShowQuestion');
            });
        });
    }

    anim.ended('ExplainRules', function() {
        this.free();
        anim.free('ShowRules');
        anim.play('HideRules');
        if (anim.has('QuestionIntro1')) {
            anim.delay('QuestionIntro1', 100, function () {
                this.play();
            });
        } else {
            thisMode.game.api.synchronize(function() {
                anim.delay('ShowQuestion', 200, function(){
                    this.play();
                });
            });
        }
    });

    anim.ended('ShowHeader', 500, function() {
        anim.play('ShowRules');
    });

    anim.ended('TimerComesIn', function() {
        anim.play('ShowPrice');
    });

    anim.ended('HideValue', 300, function() {
        this.free();
        anim.play('TimerComesIn');
        anim.play('Player1ShowKey');
        if (thisMode.game.players.length >= 2) anim.play('Player2ShowKey');
        if (thisMode.game.players.length == 3) anim.play('Player3ShowKey');
        anim.play('ExplainRules');
        anim.delay('ShowHeader', 100, function() {
            this.play();
        });
    });

    anim.ended('VoiceAnnounceValue', function(){
        this.free();
        anim.free('AnnounceValue');
        anim.free('ShowCategory');
        anim.play('HideValue');
    });

    anim.ended('QuestionTitle', function(){
        this.free();
        anim.delay('VoiceAnnounceValue', 100, function() {
            this.play();
        });
    });

    this.game.font.strings[110] = this.game.players[0].name;
    this.game.font.strings[115] = this.game.displayCurrency(this.game.players[0].score);
    if (thisMode.game.players.length >= 2) {
        this.game.font.strings[120] = this.game.players[1].name;
        this.game.font.strings[125] = this.game.displayCurrency(this.game.players[1].score);
    }
    if (thisMode.game.players.length == 3) {
        this.game.font.strings[130] = this.game.players[2].name;
        this.game.font.strings[135] = this.game.displayCurrency(this.game.players[2].score);
    }

    this.game.font.resetTextStyle(1100);
    this.game.font.resetTextStyle(1310);
    this.game.font.strings[1100] = getSTRfromID(this.STR,'Gory',128);
    this.game.font.strings[1200] = this.game.font.strings[1100];
    this.game.font.strings[1305] = this.game.displayCurrency(this.options.value);
    this.game.font.strings[1310] = getSTRfromID(this.STR,'Gibr',128);
    this.game.font.strings[1311] = getSTRfromID(this.STR,'Hnt1',128);
    this.game.font.strings[1312] = getSTRfromID(this.STR,'Hnt2',128);
    this.game.font.strings[1313] = getSTRfromID(this.STR,'Hnt3',128);
    this.game.font.strings[1315] = getSTRfromID(this.STR,'Ansr',128);

    anim.ended('ShowCategory', 150, function() {
        anim.play('AnnounceValue');
    });

    anim.ended('AnnounceCategory', function(){
        this.free();
        anim.play('ShowCategory');
        anim.delay('QuestionTitle', 100, function(){
            this.play();
        });
    });

    anim.ended('Intro2', function() {
        this.free();
        anim.play('BGIntro');
        anim.delay('AnnounceCategory', 200, function() {
            this.play();
        });
    });

    anim.ended('Intro1', function() {
        this.free();
        anim.play('Intro2');
    });

    // Jouer l'animation du zoom noir
    var blackZoom = function() {
        var step=0;
        var sizes=[{x:40,y:30}, // Tailles d'origine du jeu, svp
            {x:80,y:60},
            {x:160,y:120},
            {x:240,y:180},
            {x:320,y:240},
            {x:400,y:300},
            {x:480,y:360},
            {x:560,y:420},
            {x:640,y:480}];
        var blueDiv = jQuery('<div />').css('z-index','2000');
        blueDiv.appendTo(thisMode.game.html.screen);
        var interval = 0;
        var nextStep = function() {
            if (step < 9) {
                blueDiv.css({
                    'background-color':'#000',
                    'width':(sizes[step].x)+'px',
                    'height':(sizes[step].y)+'px',
                    'position':'absolute',
                    'left':Math.round((640-sizes[step].x)/2)+'px',
                    'top':Math.round((480-sizes[step].y)/2)+'px'
                });
                step++;
            } else {
                clearInterval(interval);
                thisMode.game.html.screen.html(''); // On vide l'écran
                anim.play('Intro1');
            }
        };
        interval = setInterval(nextStep,40*2);
    };

    anim.ended('MusicIntro1', function() {
        this.free();
        anim.play('MusicIntro2');
    });

    anim.ended('Intro', 60, function() {
        this.free();
        blackZoom();
        anim.play('MusicIntro1');
    });

    anim.delay('Intro', 500, function(){
        this.play();
    });

    nextcategoryready = this.game.api.gamemode(thisMode); // Préchargement de la prochaine catégorie
};

