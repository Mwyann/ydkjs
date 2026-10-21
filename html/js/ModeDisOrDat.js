/********** ModeDisOrDat **********/

function ModeDisOrDat() {}

ModeDisOrDat.prototype.preload = function(resources) {
    this.anslist = getSTRfromID(this.STR,'ANS#',4);
    this.nbchoices = 2;
    for(var a = 0; a < this.anslist.length; a++) if (this.anslist[a] == 3) this.nbchoices = 3;

    this.animations = new YDKJAnimList(resources);

    this.Timer = this.options.timer;
    this.timerTimeout = 0;
};

ModeDisOrDat.prototype.start = function() {
    var thisMode = this;
    var anim = this.animations;

    var nextcategoryready;

    if (this.options.chooseplayer == 1) {
        this.ChoicePlayer = anim.get('ChoicePlayer1');
        this.PlayerComesIn = anim.get('Player1ComesIn');
        this.PlayerWinGrow = anim.get('Player1WinGrow');
        this.PlayerWinBig = anim.get('Player1WinBig');
        this.PlayerWin = anim.get('Player1Win');
        this.PlayerLoseGrow = anim.get('Player1LoseGrow');
        this.PlayerLoseBig = anim.get('Player1LoseBig');
        this.PlayerLose = anim.get('Player1Lose');
    }
    if (this.options.chooseplayer == 2) {
        this.ChoicePlayer = anim.get('ChoicePlayer2');
        this.PlayerComesIn = anim.get('Player2ComesIn');
        this.PlayerWinGrow = anim.get('Player2WinGrow');
        this.PlayerWinBig = anim.get('Player2WinBig');
        this.PlayerWin = anim.get('Player2Win');
        this.PlayerLoseGrow = anim.get('Player2LoseGrow');
        this.PlayerLoseBig = anim.get('Player2LoseBig');
        this.PlayerLose = anim.get('Player2Lose');
    }
    if (this.options.chooseplayer == 3) {
        this.ChoicePlayer = anim.get('ChoicePlayer3');
        this.PlayerComesIn = anim.get('Player3ComesIn');
        this.PlayerWinGrow = anim.get('Player3WinGrow');
        this.PlayerWinBig = anim.get('Player3WinBig');
        this.PlayerWin = anim.get('Player3Win');
        this.PlayerLoseGrow = anim.get('Player3LoseGrow');
        this.PlayerLoseBig = anim.get('Player3LoseBig');
        this.PlayerLose = anim.get('Player3Lose');
    }

    var tempscore = 0;

    var jumpToNextCategory = function() {
        nextcategoryready(function(nextcategory){
            nextcategory.options.chooseplayer = thisMode.options.chooseplayer;
            nextcategory.modeObj.animations.free('MusicChooseCategoryLoop');
            nextcategory.modeObj.animations.animations['MusicChooseCategoryLoop'] = anim.get('MusicLoopRules1');
            delete anim.animations['MusicLoopRules1']; // Pour ne pas être détruite au passage à la catégorie suivante
            nextcategory.start();
        });
    };

    var buttonsAnswer = [0]; // Rien pour le 0, comme ça on décale pas
    var currentAnswers = [0,0,0,0,0,0,0]; // 0 = non répondu, 1 = gagné, 2 = perdu
    var currentQuestion = -1;
    var canPress = 1;

    var buttonslistener = 0;

    var animateValue = function(animstart,animloop,animstop,changevalue,from,to,frames,callback) {
        var step = Math.floor((to-from)/frames);
        var loopAnimValue = function() {
            frames--;
            if (frames > 0) {
                from = from+step;
                changevalue(thisMode.game.displayCurrency(from).replace('_','&thinsp;'));
            } else {
                changevalue(thisMode.game.displayCurrency(to).replace('_','&thinsp;'));
            }
        };
        var nextStep = function() {
            if (frames == 0) {
                callback();
                return false;
            }
            loopAnimValue();
            animstart.reset();
            if (frames > 0) {
                animloop.reset();
                animloop.play();
            } else {
                animloop.reset();
                animstop.play();
            }
        };

        animstop.ended(false);
        animstop.ended(nextStep);

        animloop.ended(false);
        animloop.ended(nextStep);

        animstart.ended(false);
        animstart.ended(nextStep);

        loopAnimValue();
        animstart.play();
    };

    var sumScores = function(endmessage) {
        var finalscorehide;
        if (tempscore > 0) {
            anim.free('FinalScoreWinShow');
            finalscorehide = anim.get('FinalScoreWinHide');
        } else {
            anim.free('FinalScoreLoseShow');
            finalscorehide = anim.get('FinalScoreLoseHide');
        }
        finalscorehide.ended(-60,function(){
            var PlayerGrow;
            var PlayerBig;
            if (tempscore > 0) {
                PlayerGrow = thisMode.PlayerWinGrow;
                PlayerBig = thisMode.PlayerWinBig;
            } else {
                PlayerGrow = thisMode.PlayerLoseGrow;
                PlayerBig = thisMode.PlayerLoseBig;
            }

            PlayerGrow.ended(200,function() {
                this.free();
                var from = thisMode.game.players[thisMode.options.chooseplayer-1].score;
                thisMode.game.players[thisMode.options.chooseplayer-1].score += tempscore;
                if (tempscore > 0) {
                    anim.reset('SFXScoreWin');
                    anim.play('SFXScoreWin');
                } else {
                    anim.reset('SFXScoreLose');
                    anim.play('SFXScoreLose');
                }
                animateValue(PlayerBig,PlayerBig,PlayerBig, function(newvalue) {
                    thisMode.game.font.strings[1492] = newvalue;
                    thisMode.game.font.strings[1497] = newvalue;
                },from,thisMode.game.players[thisMode.options.chooseplayer-1].score,12,function(){
                    setTimeout(function(){
                        endmessage.ended(800,jumpToNextCategory);
                        endmessage.play();
                        PlayerBig.free();
                        if (tempscore > 0) {
                            thisMode.PlayerWin.play();
                            anim.play('SFXPlayerCorrect');
                        } else {
                            thisMode.PlayerLose.play();
                            anim.play('SFXPlayerLose');
                        }
                    },200);
                });
            });
            thisMode.PlayerComesIn.free();
            PlayerGrow.play();
        });
        finalscorehide.play();
    };

    var endQuestion = function(callback) {
        var i;
        clearInterval(thisMode.timerTimeout);
        unbindKeyListener(buttonslistener);
        thisMode.game.api.registeraction('pressButton', function(data){});
        var totalButtons = 0;
        var tempscoreLeave = function() {
            totalButtons--;
            if (totalButtons == 0) {
                anim.free('TempScoreShow');
                anim.free('TempScoreCorrectStop');
                anim.free('TempScoreWrongStop');
                anim.play('TempScoreHide');

                thisMode.game.font.strings[1480] = thisMode.game.displayCurrency(tempscore).replace('_','&thinsp;');
                thisMode.game.font.strings[1485] = thisMode.game.font.strings[1480];
                if (tempscore > 0) {
                    anim.play('FinalScoreWinShow');
                } else {
                    anim.play('FinalScoreLoseShow');
                }

                if (callback) callback();
            }
        };
        for(i = 0; i < buttonsAnswer.length; i++) if (buttonsAnswer[i]) {
            buttonsAnswer[i].Ready.free();
            buttonsAnswer[i].Push.free();
            totalButtons++;
            buttonsAnswer[i].Leave.ended(-50,tempscoreLeave);
            buttonsAnswer[i].Leave.play();
        }

        anim.free('ShowQuestion');
        anim.free('HideQuestionCorrect');
        anim.free('HideQuestionWrong');
        anim.free('HideQuestionTimeout');

        anim.free('ShowSubject');
        anim.play('HideSubject');
    };

    anim.ended('MusicPlayEnd', function(){
        anim.reset('MusicLoopRules1');
        anim.play('MusicLoopRules1');
    });

    anim.ended('TimeOut', 300, function() {
        var nbanswersleft = 0;
        for(var i = 0; i < currentAnswers.length; i++) if (currentAnswers[i] == 0) nbanswersleft++;
        var tm;
        if (nbanswersleft == 1) tm = anim.get('TimeOutLoseOneQuestion');
        else tm = anim.get('TimeOutLoseMoreQuestions');
        tm.ended(-150,function(){
            anim.play('SFXScoreLose');
            anim.reset('TempScoreShow');
            anim.reset('TempScoreCorrectStop');
            anim.reset('TempScoreWrongStop');
            var oldtempscore = tempscore;
            tempscore -= thisMode.options.value*nbanswersleft;
            animateValue(anim.get('TempScoreWrongStart'), anim.get('TempScoreWrong'), anim.get('TempScoreWrongStop'), function(newvalue) {
                thisMode.game.font.strings[1470] = newvalue;
                thisMode.game.font.strings[1475] = newvalue;
            }, oldtempscore, tempscore, 6, function(){
                endQuestion(function(){
                    var nbgoodanswers = 0;
                    for(var i = 0; i < currentAnswers.length; i++) if (currentAnswers[i] == 1) nbgoodanswers++;

                    var scoremessage;
                    if (nbgoodanswers >= 4) scoremessage = anim.get('Score3Positive');
                    else scoremessage = anim.get('Score3Negative');

                    var endmessage;
                    if (nbgoodanswers == 0) endmessage = anim.get('Score30on7');
                    if (nbgoodanswers == 1) endmessage = anim.get('Score31on7');
                    if (nbgoodanswers == 2) endmessage = anim.get('Score32on7');
                    if (nbgoodanswers == 3) endmessage = anim.get('Score32on7'); // Partage le même son que le 2/7
                    if (nbgoodanswers == 4) endmessage = anim.get('Score34on7');
                    if (nbgoodanswers == 5) endmessage = anim.get('Score35on7');
                    if (nbgoodanswers == 6) endmessage = anim.get('Score36on7');

                    endmessage.ended(1500,function(){
                        jumpToNextCategory();
                    });

                    scoremessage.ended(500,function(){
                        sumScores(endmessage);
                    });

                    anim.ended('ShowFinalScore', 300, function(){
                        scoremessage.play();
                    });

                    anim.play('ShowFinalScore');
                });
            });
        });
        tm.play();
    });

    anim.ended('SFXTimeOut1', 300, function() {
        anim.play('MusicPlayEnd');
        anim.play('TimeOut');
    });

    anim.ended('MusicEndTimeOut', function() {
        anim.play('SFXTimeOut1');
    });

    var askQuestion = function() {
        var str = getSTRfromID(thisMode.STR,'STR#',3);

        anim.reset('HideQuestionSkip');
        anim.reset('HideQuestionCorrect');
        anim.reset('HideQuestionWrong');
        thisMode.game.font.resetTextStyle(1420);
        thisMode.game.font.strings[1420] = str[currentQuestion+2];
        anim.play('ShowQuestion');

        var thisQuestion = anim.get('Question' + (currentQuestion+1));

        var nbquestions = 0;
        for(var i = 0; i < currentAnswers.length; i++) if (currentAnswers[i] == 0) nbquestions++;

        if (nbquestions == 1) { // "la dernière" c'est quand il n'en reste plus qu'une à répondre, et on ne peut pas la passer.
            anim.ended('LastQuestionAnnounce', function(){
                thisQuestion.reset();
                thisQuestion.play();
            });
            anim.play('LastQuestionAnnounce');
        } else {
            thisQuestion.reset();
            thisQuestion.play();
        }
        canPress = 1;
    };

    var afterPressAnimation;

    var RestartSkipped = anim.get('RestartSkipped');

    var registerPressButton = 0; // Déclaré plus tard

    var doPressButton = function(b) { // Appuie sur les boutons. Fonction pour gérer les animations, sons et styles CSS
        registerPressButton();
        if (!canPress) return false;
        var nbquestions = 0;
        for(var i = 0; i < currentAnswers.length; i++) if (currentAnswers[i] == 0) nbquestions++;
        if ((nbquestions == 1) && (b == 4)) {
            anim.play('CannotSkipLast');
            return false;
        }

        var bt = buttonsAnswer[b].Push;
        buttonsAnswer[b].StandBy.reset();
        buttonsAnswer[b].Ready.reset(true);
        bt.reset();
        bt.play();
        anim.reset('SFXKeyPress');
        anim.play('SFXKeyPress');

        if (currentQuestion >= 0) {
            canPress = 0;
            // Animation différente si gagné ou perdu
            // INFO : le score (+500-500) s'incrémente tous les 83 par frames sur 6 frames, soit environ 500/6 => 83*6 = 496 (et on ajoute 1 frame pour afficher la valeur exacte).
            // Pour l'addition, c'est sur 11 frames (et on ajoute 1 pour le score exact), donc 1500 ~= 136*11 par exemple.

            var nextQuestion = function() {
                var nbquestions = 0;
                for (var i = 0; i < currentAnswers.length; i++) if (currentAnswers[i] == 0) nbquestions++;
                if (nbquestions == 0) {
                    clearTimeout(thisMode.timerTimeout);
                    setTimeout(endQuestion(function(){
                        anim.free('MusicLoopPlay1');
                        anim.free('MusicLoopPlay2');
                        anim.free('MusicLoopPlay3');
                        anim.free('MusicLoopPlay4');
                        anim.play('MusicPlayEnd');
                        var nbgoodanswers = 0;
                        for(var i = 0; i < currentAnswers.length; i++) if (currentAnswers[i] == 1) nbgoodanswers++;

                        if (nbgoodanswers > 3) {
                            anim.play('Public7on7');
                            anim.volume('Public7on7', 70);
                        } else {
                            anim.play('Public0on7');
                            anim.volume('Public0on7', 70);
                        }
                    }),300);

                    anim.ended('MusicPlayEnd', 100, function(){
                        var nbgoodanswers = 0;
                        for(var i = 0; i < currentAnswers.length; i++) if (currentAnswers[i] == 1) nbgoodanswers++;

                        var scoremessage = anim.get('Score1' + nbgoodanswers + 'on7');
                        var endmessage = anim.get('Score2' + nbgoodanswers + 'on7');

                        endmessage.ended(1500,function(){
                            jumpToNextCategory();
                        });

                        scoremessage.ended(500,function(){
                            sumScores(endmessage);
                        });

                        scoremessage.play();
                    });
                } else {
                    var announceRestartSkipped = false;
                    currentQuestion++;
                    if (currentQuestion == 7) {
                        currentQuestion = 0;
                        announceRestartSkipped = true;
                    }
                    while (currentAnswers[currentQuestion] != 0) {
                        currentQuestion++;
                        if (currentQuestion == 7) {
                            currentQuestion = 0;
                            announceRestartSkipped = true;
                        }
                    }
                    if ((announceRestartSkipped) && (RestartSkipped)) {
                        RestartSkipped.ended(100,function(){askQuestion();});
                        RestartSkipped.delay(150,function(){this.play()});
                        RestartSkipped = false;
                    } else {
                        askQuestion();
                    }
                }
            };

            if (b == 4) { // On passe la question
                anim.reset('ShowQuestion');
                anim.play('HideQuestionSkip');
                afterPressAnimation = function() {
                    nextQuestion();
                };
            } else {
                if (b == thisMode.anslist[currentQuestion]) { // Bonne réponse !
                    currentAnswers[currentQuestion] = 1;
                    anim.reset('ShowQuestion');
                    anim.play('HideQuestionCorrect');
                    afterPressAnimation = function(){
                        anim.reset('SFXCorrect');
                        anim.play('SFXCorrect');
                        anim.reset('TempScoreShow');
                        anim.reset('TempScoreCorrectStop');
                        anim.reset('TempScoreWrongStop');
                        var oldtempscore = tempscore;
                        tempscore += thisMode.options.value;
                        animateValue(anim.get('TempScoreCorrectStart'), anim.get('TempScoreCorrect'), anim.get('TempScoreCorrectStop'), function(newvalue) {
                            thisMode.game.font.strings[1470] = newvalue;
                            thisMode.game.font.strings[1475] = newvalue;
                        },oldtempscore,tempscore,6,function(){
                            nextQuestion();
                        });
                    };
                } else { // Perdu !
                    currentAnswers[currentQuestion] = 2;
                    anim.reset('ShowQuestion');
                    anim.play('HideQuestionWrong');
                    afterPressAnimation = function(){
                        anim.reset('SFXWrong');
                        anim.play('SFXWrong');
                        anim.reset('TempScoreShow');
                        anim.reset('TempScoreCorrectStop');
                        anim.reset('TempScoreWrongStop');
                        var oldtempscore = tempscore;
                        tempscore -= thisMode.options.value;
                        animateValue(anim.get('TempScoreWrongStart'), anim.get('TempScoreWrong'), anim.get('TempScoreWrongStop'), function(newvalue) {
                            thisMode.game.font.strings[1470] = newvalue;
                            thisMode.game.font.strings[1475] = newvalue;
                        }, oldtempscore,tempscore,6,function(){
                            nextQuestion();
                        });
                    };
                }
            }
        }
    };

    registerPressButton = function() {
        thisMode.game.api.registeraction('pressButton', function(data){
            if (!data.selfpost) doPressButton(parseInt(data.value)); else registerPressButton();
        });
    };

    var pressButton = function(b) {
        thisMode.game.api.postaction({action: 'pressButton', value: b});
        doPressButton(b);
    };

    anim.ended('MusicLoopPlay4', function(){
        this.reset();
        anim.play('MusicLoopPlay1');
    });

    anim.ended('MusicLoopPlay3', function(){
        this.reset();
        anim.play('MusicLoopPlay4');
    });

    anim.ended('MusicLoopPlay2', function(){
        this.reset();
        anim.play('MusicLoopPlay3');
    });

    anim.ended('MusicLoopPlay1', function(){
        this.reset();
        anim.play('MusicLoopPlay2');
    });

    anim.ended('JingleStartPlay2', function(){
        anim.play('MusicLoopPlay1');
    });

    var timerRunning = function(){
        if (thisMode.Timer.current > 1) {
            thisMode.Timer.playTimer();
            thisMode.timerTimeout = setTimeout(timerRunning, 1000);
        } else { // Timeout
            thisMode.Timer.playTimer();
            anim.reset('ShowQuestion');
            anim.play('HideQuestionTimeout');

            clearInterval(thisMode.timerTimeout);
            unbindKeyListener(buttonslistener);
            thisMode.game.api.registeraction('pressButton', function(data){});
            for(var i = 0; i < buttonsAnswer.length; i++) if (buttonsAnswer[i]) {
                buttonsAnswer[i].Ready.click(false);
                buttonsAnswer[i].Push.click(false);
            }

            var timersup = function() {
                anim.stop('MusicLoopPlay1');
                anim.stop('MusicLoopPlay2');
                anim.stop('MusicLoopPlay3');
                anim.stop('MusicLoopPlay4');

                anim.play('MusicEndTimeOut');
                thisMode.Timer.reset();
                anim.play('TimerTimeOut');
            };

            anim.ended('MusicLoopPlay1', false);
            anim.ended('MusicLoopPlay2', false);
            anim.ended('MusicLoopPlay3', false);
            anim.ended('MusicLoopPlay4', false);
            anim.ended('MusicLoopPlay1', timersup);
            anim.ended('MusicLoopPlay2', timersup);
            anim.ended('MusicLoopPlay3', timersup);
            anim.ended('MusicLoopPlay4', timersup);
        }
    };

    anim.ended('JingleStartPlay1', function(){
        anim.play('JingleStartPlay2');
        anim.free('PrepareTimer');

        var i;

        if (hasKeycode(thisMode.game.players[thisMode.options.chooseplayer-1].keycode)) { // Joueur local
            for(i = 0; i < buttonsAnswer.length; i++) if (buttonsAnswer[i]) {
                (function(){
                    var j = i;
                    buttonsAnswer[j].Ready.click(function(){
                        pressButton(j);
                    });
                    buttonsAnswer[j].Push.click(function(){
                        pressButton(j);
                    });
                })();
            }

            buttonslistener = bindKeyListener(function (choice) {
                var chosed = 0;
                if (choice == 49) chosed = 1;
                else if (choice == 50) chosed = 2;
                else if ((choice == 51) && (thisMode.nbchoices == 3)) chosed = 3;
                else if (choice == 52) chosed = 4;
                if (chosed > 0) pressButton(chosed);
            });
        }
        registerPressButton();

        timerRunning();

        for(i = 0; i < buttonsAnswer.length; i++) if (buttonsAnswer[i]) {
            buttonsAnswer[i].Push.ended(false);
            buttonsAnswer[i].Push.ended(-150,function(){
                afterPressAnimation();
            });
        }
        currentQuestion = 0;
        askQuestion();
    });

    anim.ended('GameStart', 100, function(){
        thisMode.game.api.synchronize(function() {
            anim.stop('MusicLoopRules1');
            anim.play('JingleStartPlay1');
        });
    });

    anim.ended('PrepareTimer', 300, function(){
        anim.play('GameStart');
    });

    anim.ended('AnnounceTimer', 100, function() {
        canPress = 0;
        anim.free('TimerComesIn');
        anim.play('PrepareTimer');
    });

    var skiplistener = 0;

    anim.ended('MessageSpaceBarLeave', function(){
        this.free();
    });

    anim.ended('ValueLeave', -100, function() {
        anim.free('MessageSpaceBarComesIn');
        anim.play('MessageSpaceBarLeave');
    });

    var countLoopRules2 = 4; // 4 fois le MusicLoopRules2
    var endOfRules = function() {
        var i;
        if (skiplistener) unbindKeyListener(skiplistener);
        countLoopRules2 = 0; // TODO: on laisse finir la musique ou bien on arrête immédiatement ?
        anim.ended('MusicLoopRules1', false); // Grosse libération globale : si on passe les explications, il faut tout arrêter immédiatement.
        for(i = 0; i < buttonsAnswer.length; i++) if (buttonsAnswer[i]) {
            buttonsAnswer[i].ComesIn.free();
            buttonsAnswer[i].Push.reset();
            buttonsAnswer[i].StandBy.free();
        }
        anim.stop('SFXKeyPress');
        anim.free('SFXShowKey');
        anim.free('SFXShowPriceCorrect');
        anim.free('SFXShowPriceWrong');
        anim.free('SFXHidePrice');
        anim.free('QuestionIntro1');
        anim.free('QuestionIntro2');
        anim.free('QuestionAnswer1');
        anim.free('QuestionAnswer2');
        anim.free('RulesExplainBoth');
        anim.free('RulesExplainSkip');
        anim.free('RulesExplainCorrect');
        anim.free('RulesExplainWrong');
        anim.free('ValueComesIn');
        anim.free('ValueMinus');
        anim.free('ValueLeave');
        thisMode.PlayerComesIn.play();
        for(i = 0; i < buttonsAnswer.length; i++) if (buttonsAnswer[i]) {
            buttonsAnswer[i].Ready.play();
        }

        thisMode.game.font.strings[1470] = thisMode.game.displayCurrency(0).replace('_','&thinsp;');
        thisMode.game.font.strings[1475] = thisMode.game.font.strings[1470];
        anim.play('TempScoreShow');

        var prepareGame = function() {
            anim.delay('AnnounceTimer', 600, function() {
                this.play();
            });
        };
        if (anim.isplaying('RulesSkipExplain')) anim.ended('RulesSkipExplain', prepareGame); else prepareGame();
    };

    anim.ended('ValueLeave', function() {
        this.free();
        endOfRules();
    });

    anim.ended('RulesExplainWrong', 150, function() {
        anim.free('ValueMinus');
        anim.play('ValueLeave');
        anim.play('SFXHidePrice');
    });

    anim.ended('RulesExplainCorrect', 150, function() {
        anim.play('RulesExplainWrong');
        anim.free('ValueComesIn');
        anim.play('ValueMinus');
        anim.play('SFXShowPriceWrong');
    });

    var rulesExplainNext = function() {
        anim.play('RulesExplainCorrect');
        anim.play('ValueComesIn');
        anim.play('SFXShowPriceCorrect');
    };

    anim.ended('MusicLoopRules2', function() {
        if (countLoopRules2 <= 0) {
            this.free();
            anim.reset('MusicLoopRules1');
            anim.play('MusicLoopRules1');
            return true;
        }
        countLoopRules2--;
        return false;
    });

    var MusicLoopRules2 = function() {
        anim.ended('MusicLoopRules1', function() {
            this.reset(true);
            anim.play('MusicLoopRules2');
            return true;
        });
    };

    var rulesExplainSkip = function(){
        anim.play('RulesExplainSkip');
        anim.delay('RulesExplainSkip', 300, function(){
            buttonsAnswer[4].ComesIn.play();
            anim.reset('SFXShowKey');
            anim.play('SFXShowKey');
        });
    };

    anim.ended('RulesExplainBoth', 800, function(){
        rulesExplainSkip();
    });

    anim.ended('RulesExplainBoth', -350, function(){
        doPressButton(3);
    });

    anim.ended('QuestionAnswer2', 800, function(){
        if (thisMode.nbchoices == 2) {
            rulesExplainSkip();
        } else {
            anim.play('RulesExplainBoth');
        }
    });

    anim.ended('QuestionAnswer2', -350, function(){
        doPressButton(2);
    });

    anim.ended('QuestionAnswer1', 800, function(){
        var timeleft = buttonsAnswer[1].StandBy.length()-buttonsAnswer[1].StandBy.position();
        var anslen = anim.length('QuestionAnswer2')-350;
        var interval = timeleft - anslen + 100;
        if (interval > 0) {
            this.delay(interval,function(){
                anim.play('QuestionAnswer2');
            });
        } else anim.play('QuestionAnswer2');
    });

    anim.ended('QuestionAnswer1', -350, function(){
        doPressButton(1);
    });

    var readAnswers = function() {
        anim.delay('QuestionIntro2', 800, function () {
            anim.ended('QuestionIntro2', function () {
                anim.play('QuestionAnswer1');
            });
        });
    };

    var loopStandBy = function() { // Fonction servant à synchroniser les animations Standby
        for(var i = 0; i < buttonsAnswer.length; i++) if (buttonsAnswer[i]) {
            if ((!buttonsAnswer[i].ComesIn.isplaying) && (buttonsAnswer[i].ComesIn.played) && (!buttonsAnswer[i].StandBy.isplaying) && (!buttonsAnswer[i].Push.isplaying)) {
                buttonsAnswer[i].ComesIn.free();
                buttonsAnswer[i].Push.reset();
                buttonsAnswer[i].StandBy.reset();
                buttonsAnswer[i].StandBy.play();
            }
        }
    };

    var addStandBy = function(comesin, standby, push, ready, leave) {
        buttonsAnswer.push({ComesIn: comesin, StandBy: standby, Push: push, Ready: ready, Leave: leave});
        standby.ended(function(){loopStandBy()});
    };

    anim.ended('ShowSubject', function(){
        buttonsAnswer[1].ComesIn.play();
        anim.play('SFXShowKey');
    });

    anim.ended('QuestionIntro1', 100, function() {
        anim.play('QuestionIntro2');
        anim.delay('QuestionIntro2', 100, function(){
            anim.play('ShowSubject');
        });
    });

    anim.ended('QuestionTitle', 200, function() {
        anim.play('QuestionIntro1');
        anim.delay('TimerComesIn', 200, function(){
            this.ended(-500,function(){
                anim.play('ShowHeader');
            });
            this.play();

            addStandBy(anim.get('Button1ComesIn'), anim.get('Button1StandbyLoop'), anim.get('Button1Push'), anim.get('Button1Ready'), anim.get('Button1Leave'));
            addStandBy(anim.get('Button2ComesIn'), anim.get('Button2StandbyLoop'), anim.get('Button2Push'), anim.get('Button2Ready'), anim.get('Button2Leave'));
            if (thisMode.nbchoices == 2) buttonsAnswer.push(0); // Rien pour le bouton 3
            else addStandBy(anim.get('Button3ComesIn'), anim.get('Button3StandbyLoop'), anim.get('Button3Push'), anim.get('Button3Ready'), anim.get('Button3Leave'));
            addStandBy(anim.get('Button4ComesIn'), anim.get('Button4StandbyLoop'), anim.get('Button4Push'), anim.get('Button4Ready'), anim.get('Button4Leave'));

            // Setup des boutons pour les explications

            buttonsAnswer[4].Push.ended(function() { // Il faut un délai après le ended sinon, si le Push est stop/reset avant le délai, cela ne sera jamais exécuté.
                this.delay(200,function(){
                    this.ended(false);
                    rulesExplainNext();
                });
            });

            buttonsAnswer[4].ComesIn.ended(function(){
                this.delay(300,function(){
                    buttonsAnswer[4].ComesIn.free();
                    doPressButton(4);
                });
            });

            buttonsAnswer[thisMode.nbchoices].ComesIn.ended(function(){
                this.delay(300,function(){
                    MusicLoopRules2();
                });
                readAnswers();
            });

            if (thisMode.nbchoices == 3) {
                buttonsAnswer[2].ComesIn.ended(function(){
                    this.delay(300,function(){
                        buttonsAnswer[3].ComesIn.play();
                        anim.reset('SFXShowKey');
                        anim.play('SFXShowKey');
                    });
                });
            }

            buttonsAnswer[1].ComesIn.ended(function(){
                loopStandBy();
                this.delay(300,function(){
                    buttonsAnswer[2].ComesIn.play();
                    anim.reset('SFXShowKey');
                    anim.play('SFXShowKey');
                });
            });

            var doskipexplanations = function() {
                unbindKeyListener(skiplistener);
                thisMode.game.api.registeraction('skipexplanations', function(data){});
                anim.free('MessageSpaceBarComesIn');
                anim.play('MessageSpaceBarLeave');
                anim.play('RulesSkipExplain');
                anim.volume('ShowSubject', 0);
                anim.play('ShowSubject');
                endOfRules();
            };

            var skipexplanations = function() {
                thisMode.game.api.postaction({action: 'skipexplanations'});
                doskipexplanations();
            };

            if (hasKeycode(thisMode.game.players[thisMode.options.chooseplayer-1].keycode)) { // Joueur local
                skiplistener = bindKeyListener(function (choice) {
                    if (choice == 32) skipexplanations(); // Barre espace = on passe les explications
                });
            }
            thisMode.game.api.registeraction('skipexplanations', function(data){
                if (!data.selfpost) doskipexplanations();
            });

            anim.click('MessageSpaceBarComesIn', skipexplanations);
            anim.play('MessageSpaceBarComesIn');
        });
    });

    anim.ended('QuestionTitle', -400, function() {
        anim.free('ShowCategory');
        anim.play('HideCategory');
    });

    anim.ended('AnnounceCategory', 100, function() {
        anim.play('QuestionTitle');
    });

    anim.ended('AnnounceCategory', -400, function() {
        anim.play('ShowCategory');
    });

    this.game.font.resetTextStyle(1100);
    this.game.font.strings[1100] = getSTRfromID(thisMode.STR,'STR',1);
    this.game.font.strings[1400] = this.game.font.strings[1100];
    this.game.font.strings[1410] = getSTRfromID(thisMode.STR,'STR',2);
    var str = getSTRfromID(thisMode.STR,'STR#',3);
    this.game.font.strings[1430] = str[0];
    this.game.font.strings[1435] = this.game.font.strings[1430];
    this.game.font.strings[1440] = str[1];
    this.game.font.strings[1445] = this.game.font.strings[1440];

    this.game.font.strings[1487] = this.game.players[this.options.chooseplayer-1].name;
    this.game.font.strings[1491] = this.game.font.strings[1487];
    this.game.font.strings[1492] = this.game.displayCurrency(this.game.players[this.options.chooseplayer-1].score);
    this.game.font.strings[1497] = this.game.font.strings[1492];

    anim.ended('Intro', function() {
        this.free();
        anim.play('IntroStill');
        anim.play('MusicLoopRules1');
        anim.delay('AnnounceCategory', 500, function(){
            this.play();
        });
    });

    this.ChoicePlayer.delay(500,function(){
        this.play();
        anim.delay('Intro', 2500, function(){
            thisMode.game.html.screen.html(''); // Je vide manuellement l'écran.
            this.play();
        });
    });

    nextcategoryready = this.game.api.gamemode(thisMode); // Préchargement de la prochaine catégorie
};

