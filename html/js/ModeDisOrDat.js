/********** ModeDisOrDat **********/

function ModeDisOrDat() {}

ModeDisOrDat.prototype.preload = function(resources) {
    this.ChoicePlayer1on3 = new YDKJAnimation(resources['DisOrDat/ChoicePlayer1on3']);
    this.ChoicePlayer2on3 = new YDKJAnimation(resources['DisOrDat/ChoicePlayer2on3']);
    this.ChoicePlayer3on3 = new YDKJAnimation(resources['DisOrDat/ChoicePlayer3on3']);

    this.AnnounceCategory = new YDKJAnimation(resources['DisOrDat/AnnounceCategory']);
    this.TimerComesIn = new YDKJAnimation(resources['DisOrDat/TimerComesIn']);

    this.Intro = new YDKJAnimation(resources['DisOrDat/Intro']);
    this.IntroStill = new YDKJAnimation(resources['DisOrDat/IntroStill']);
    this.MusicLoopRules1 = new YDKJAnimation(resources['DisOrDat/MusicLoopRules1']);
    this.MusicLoopRules2 = new YDKJAnimation(resources['DisOrDat/MusicLoopRules2']);

    this.ShowHeader = new YDKJAnimation(resources['DisOrDat/ShowHeader']);
    this.ShowCategory = new YDKJAnimation(resources['DisOrDat/ShowCategory']);
    this.HideCategory = new YDKJAnimation(resources['DisOrDat/HideCategory']);
    this.ShowSubject = new YDKJAnimation(resources['DisOrDat/ShowSubject']);
    this.HideSubject = new YDKJAnimation(resources['DisOrDat/HideSubject']);
    this.ShowQuestion = new YDKJAnimation(resources['DisOrDat/ShowQuestion']);
    this.HideQuestionSkip = new YDKJAnimation(resources['DisOrDat/HideQuestionSkip']);
    this.HideQuestionWrong = new YDKJAnimation(resources['DisOrDat/HideQuestionWrong']);
    this.HideQuestionCorrect = new YDKJAnimation(resources['DisOrDat/HideQuestionCorrect']);
    this.HideQuestionTimeout = new YDKJAnimation(resources['DisOrDat/HideQuestionTimeout']);

    this.JingleStartPlay1 = new YDKJAnimation(resources['DisOrDat/JingleStartPlay1']);
    this.JingleStartPlay2 = new YDKJAnimation(resources['DisOrDat/JingleStartPlay2']);
    this.MusicLoopPlay1 = new YDKJAnimation(resources['DisOrDat/MusicLoopPlay1']);
    this.MusicLoopPlay2 = new YDKJAnimation(resources['DisOrDat/MusicLoopPlay2']);
    this.MusicLoopPlay3 = new YDKJAnimation(resources['DisOrDat/MusicLoopPlay3']);
    this.MusicLoopPlay4 = new YDKJAnimation(resources['DisOrDat/MusicLoopPlay4']);

    this.QuestionTitle = new YDKJAnimation(resources['DisOrDat/QuestionTitle']);
    this.QuestionIntro1 = new YDKJAnimation(resources['DisOrDat/QuestionIntro1']);
    this.QuestionIntro2 = new YDKJAnimation(resources['DisOrDat/QuestionIntro2']);
    this.QuestionAnswer1 = new YDKJAnimation(resources['DisOrDat/QuestionAnswer1']);
    this.QuestionAnswer2 = new YDKJAnimation(resources['DisOrDat/QuestionAnswer2']);
    this.RulesExplainBoth = new YDKJAnimation(resources['DisOrDat/RulesExplainBoth']);
    this.RulesExplainSkip = new YDKJAnimation(resources['DisOrDat/RulesExplainSkip']);
    this.RulesExplainCorrect = new YDKJAnimation(resources['DisOrDat/RulesExplain500FCorrect']); // Il faudra choisir la ressource en fonction de la valeur de la question
    this.RulesExplainWrong = new YDKJAnimation(resources['DisOrDat/RulesExplain500FWrong']);
    this.RulesSkipExplain = new YDKJAnimation(resources['DisOrDat/RulesSkipExplain']);
    this.ValueComesIn = new YDKJAnimation(resources['DisOrDat/Value500FComesIn']);
    this.ValueMinus = new YDKJAnimation(resources['DisOrDat/Value500FMinus']);
    this.ValueLeave = new YDKJAnimation(resources['DisOrDat/Value500FLeave']);
    this.SFXShowPriceCorrect = new YDKJAnimation(resources['DisOrDat/SFXShowPriceCorrect']);
    this.SFXShowPriceWrong = new YDKJAnimation(resources['DisOrDat/SFXShowPriceWrong']);
    this.SFXHidePrice = new YDKJAnimation(resources['DisOrDat/SFXHidePrice']);

    this.MessageSpaceBarComesIn = new YDKJAnimation(resources['DisOrDat/MessageSpaceBarComesIn']);
    this.MessageSpaceBarLeave = new YDKJAnimation(resources['DisOrDat/MessageSpaceBarLeave']);

    this.SFXShowKey = new YDKJAnimation(resources['DisOrDat/SFXShowKey']);
    this.SFXKeyPress = new YDKJAnimation(resources['DisOrDat/SFXKeyPress']);
    this.Button1of4ComesIn = new YDKJAnimation(resources['DisOrDat/Button1of4ComesIn']);
    this.Button1of4StandbyLoop = new YDKJAnimation(resources['DisOrDat/Button1of4StandbyLoop']);
    this.Button1of4Ready = new YDKJAnimation(resources['DisOrDat/Button1of4Ready']);
    this.Button1of4Push = new YDKJAnimation(resources['DisOrDat/Button1of4Push']);
    this.Button1of4Leave = new YDKJAnimation(resources['DisOrDat/Button1of4Leave']);

    this.Button2of4ComesIn = new YDKJAnimation(resources['DisOrDat/Button2of4ComesIn']);
    this.Button2of4StandbyLoop = new YDKJAnimation(resources['DisOrDat/Button2of4StandbyLoop']);
    this.Button2of4Ready = new YDKJAnimation(resources['DisOrDat/Button2of4Ready']);
    this.Button2of4Push = new YDKJAnimation(resources['DisOrDat/Button2of4Push']);
    this.Button2of4Leave = new YDKJAnimation(resources['DisOrDat/Button2of4Leave']);

    this.Button3of4ComesIn = new YDKJAnimation(resources['DisOrDat/Button3of4ComesIn']);
    this.Button3of4StandbyLoop = new YDKJAnimation(resources['DisOrDat/Button3of4StandbyLoop']);
    this.Button3of4Ready = new YDKJAnimation(resources['DisOrDat/Button3of4Ready']);
    this.Button3of4Push = new YDKJAnimation(resources['DisOrDat/Button3of4Push']);
    this.Button3of4Leave = new YDKJAnimation(resources['DisOrDat/Button3of4Leave']);

    this.Button4of4ComesIn = new YDKJAnimation(resources['DisOrDat/Button4of4ComesIn']);
    this.Button4of4StandbyLoop = new YDKJAnimation(resources['DisOrDat/Button4of4StandbyLoop']);
    this.Button4of4Ready = new YDKJAnimation(resources['DisOrDat/Button4of4Ready']);
    this.Button4of4Push = new YDKJAnimation(resources['DisOrDat/Button4of4Push']);
    this.Button4of4Leave = new YDKJAnimation(resources['DisOrDat/Button4of4Leave']);

    this.Button1of3ComesIn = new YDKJAnimation(resources['DisOrDat/Button1of3ComesIn']);
    this.Button1of3StandbyLoop = new YDKJAnimation(resources['DisOrDat/Button1of3StandbyLoop']);
    this.Button1of3Ready = new YDKJAnimation(resources['DisOrDat/Button1of3Ready']);
    this.Button1of3Push = new YDKJAnimation(resources['DisOrDat/Button1of3Push']);
    this.Button1of3Leave = new YDKJAnimation(resources['DisOrDat/Button1of3Leave']);

    this.Button2of3ComesIn = new YDKJAnimation(resources['DisOrDat/Button2of3ComesIn']);
    this.Button2of3StandbyLoop = new YDKJAnimation(resources['DisOrDat/Button2of3StandbyLoop']);
    this.Button2of3Ready = new YDKJAnimation(resources['DisOrDat/Button2of3Ready']);
    this.Button2of3Push = new YDKJAnimation(resources['DisOrDat/Button2of3Push']);
    this.Button2of3Leave = new YDKJAnimation(resources['DisOrDat/Button2of3Leave']);

    this.Button4of3ComesIn = new YDKJAnimation(resources['DisOrDat/Button4of3ComesIn']);
    this.Button4of3StandbyLoop = new YDKJAnimation(resources['DisOrDat/Button4of3StandbyLoop']);
    this.Button4of3Ready = new YDKJAnimation(resources['DisOrDat/Button4of3Ready']);
    this.Button4of3Push = new YDKJAnimation(resources['DisOrDat/Button4of3Push']);
    this.Button4of3Leave = new YDKJAnimation(resources['DisOrDat/Button4of3Leave']);

    this.Player1ComesIn = new YDKJAnimation(resources['DisOrDat/Player1ComesIn']);
    this.Player1WinGrow = new YDKJAnimation(resources['DisOrDat/Player1WinGrow']);
    this.Player1WinBig = new YDKJAnimation(resources['DisOrDat/Player1WinBig']);
    this.Player1Win = new YDKJAnimation(resources['DisOrDat/Player1Win']);
    this.Player1LoseGrow = new YDKJAnimation(resources['DisOrDat/Player1LoseGrow']);
    this.Player1LoseBig = new YDKJAnimation(resources['DisOrDat/Player1LoseBig']);
    this.Player1Lose = new YDKJAnimation(resources['DisOrDat/Player1Lose']);

    this.Player2ComesIn = new YDKJAnimation(resources['DisOrDat/Player2ComesIn']);
    this.Player2WinGrow = new YDKJAnimation(resources['DisOrDat/Player2WinGrow']);
    this.Player2WinBig = new YDKJAnimation(resources['DisOrDat/Player2WinBig']);
    this.Player2Win = new YDKJAnimation(resources['DisOrDat/Player2Win']);
    this.Player2LoseGrow = new YDKJAnimation(resources['DisOrDat/Player2LoseGrow']);
    this.Player2LoseBig = new YDKJAnimation(resources['DisOrDat/Player2LoseBig']);
    this.Player2Lose = new YDKJAnimation(resources['DisOrDat/Player2Lose']);

    this.Player3ComesIn = new YDKJAnimation(resources['DisOrDat/Player3ComesIn']);
    this.Player3WinGrow = new YDKJAnimation(resources['DisOrDat/Player3WinGrow']);
    this.Player3WinBig = new YDKJAnimation(resources['DisOrDat/Player3WinBig']);
    this.Player3Win = new YDKJAnimation(resources['DisOrDat/Player3Win']);
    this.Player3LoseGrow = new YDKJAnimation(resources['DisOrDat/Player3LoseGrow']);
    this.Player3LoseBig = new YDKJAnimation(resources['DisOrDat/Player3LoseBig']);
    this.Player3Lose = new YDKJAnimation(resources['DisOrDat/Player3Lose']);

    this.TempScoreShow = new YDKJAnimation(resources['DisOrDat/TempScoreShow']);
    this.TempScoreCorrectStart = new YDKJAnimation(resources['DisOrDat/TempScoreCorrectStart']);
    this.TempScoreCorrect = new YDKJAnimation(resources['DisOrDat/TempScoreCorrect']);
    this.TempScoreCorrectStop = new YDKJAnimation(resources['DisOrDat/TempScoreCorrectStop']);
    this.TempScoreWrongStart = new YDKJAnimation(resources['DisOrDat/TempScoreWrongStart']);
    this.TempScoreWrong = new YDKJAnimation(resources['DisOrDat/TempScoreWrong']);
    this.TempScoreWrongStop = new YDKJAnimation(resources['DisOrDat/TempScoreWrongStop']);
    this.TempScoreHide = new YDKJAnimation(resources['DisOrDat/TempScoreHide']);

    this.FinalScoreWinShow = new YDKJAnimation(resources['DisOrDat/FinalScoreWinShow']);
    this.FinalScoreWinHide = new YDKJAnimation(resources['DisOrDat/FinalScoreWinHide']);
    this.FinalScoreLoseShow = new YDKJAnimation(resources['DisOrDat/FinalScoreLoseShow']);
    this.FinalScoreLoseHide = new YDKJAnimation(resources['DisOrDat/FinalScoreLoseHide']);

    this.SFXPlayerCorrect = new YDKJAnimation(resources['Question/SFXPlayerCorrect']);
    this.SFXPlayerLose = new YDKJAnimation(resources['Question/SFXPlayerLose']);

    this.AnnounceTimer = new YDKJAnimation(resources['DisOrDat/AnnounceTimer']);
    this.PrepareTimer = new YDKJAnimation(resources['DisOrDat/PrepareTimer']);
    this.GameStart = new YDKJAnimation(resources['DisOrDat/GameStart']);

    this.Question1 = new YDKJAnimation(resources['DisOrDat/Question1']);
    this.Question2 = new YDKJAnimation(resources['DisOrDat/Question2']);
    this.Question3 = new YDKJAnimation(resources['DisOrDat/Question3']);
    this.Question4 = new YDKJAnimation(resources['DisOrDat/Question4']);
    this.Question5 = new YDKJAnimation(resources['DisOrDat/Question5']);
    this.Question6 = new YDKJAnimation(resources['DisOrDat/Question6']);
    this.Question7 = new YDKJAnimation(resources['DisOrDat/Question7']);
    this.LastQuestionAnnounce = new YDKJAnimation(resources['DisOrDat/LastQuestionAnnounce']);
    this.CannotSkipLast = new YDKJAnimation(resources['DisOrDat/CannotSkipLast']);
    this.SFXCorrect = new YDKJAnimation(resources['DisOrDat/SFXCorrect']);
    this.SFXWrong = new YDKJAnimation(resources['DisOrDat/SFXWrong']);
    this.SFXScoreWin = new YDKJAnimation(resources['DisOrDat/SFXScoreWin']);
    this.SFXScoreLose = new YDKJAnimation(resources['DisOrDat/SFXScoreLose']);
    this.RestartSkipped = new YDKJAnimation(resources['DisOrDat/RestartSkipped']);

    this.MusicPlayEnd = new YDKJAnimation(resources['DisOrDat/MusicPlayEnd']);
    this.Public0on7 = new YDKJAnimation(resources['DisOrDat/Public0on7']);
    this.Public7on7 = new YDKJAnimation(resources['DisOrDat/Public7on7']);

    this.Score10on7 = new YDKJAnimation(resources['DisOrDat/Score10on7']);
    this.Score11on7 = new YDKJAnimation(resources['DisOrDat/Score11on7']);
    this.Score12on7 = new YDKJAnimation(resources['DisOrDat/Score12on7']);
    this.Score13on7 = new YDKJAnimation(resources['DisOrDat/Score13on7']);
    this.Score14on7 = new YDKJAnimation(resources['DisOrDat/Score14on7']);
    this.Score15on7 = new YDKJAnimation(resources['DisOrDat/Score15on7']);
    this.Score16on7 = new YDKJAnimation(resources['DisOrDat/Score16on7']);
    this.Score17on7 = new YDKJAnimation(resources['DisOrDat/Score17on7']);
    this.Score20on7 = new YDKJAnimation(resources['DisOrDat/Score20on7']);
    this.Score21on7 = new YDKJAnimation(resources['DisOrDat/Score21on7']);
    this.Score22on7 = new YDKJAnimation(resources['DisOrDat/Score22on7']);
    this.Score23on7 = new YDKJAnimation(resources['DisOrDat/Score23on7']);
    this.Score24on7 = new YDKJAnimation(resources['DisOrDat/Score24on7']);
    this.Score25on7 = new YDKJAnimation(resources['DisOrDat/Score25on7']);
    this.Score26on7 = new YDKJAnimation(resources['DisOrDat/Score26on7']);
    this.Score27on7 = new YDKJAnimation(resources['DisOrDat/Score27on7']);
    this.Score3Positive = new YDKJAnimation(resources['DisOrDat/Score3Positive']);
    this.Score36on7 = new YDKJAnimation(resources['DisOrDat/Score36on7']);
    this.Score35on7 = new YDKJAnimation(resources['DisOrDat/Score35on7']);
    this.Score34on7 = new YDKJAnimation(resources['DisOrDat/Score34on7']);
    this.Score3Negative = new YDKJAnimation(resources['DisOrDat/Score3Negative']);
    this.Score32on7 = new YDKJAnimation(resources['DisOrDat/Score32on7']);
    this.Score31on7 = new YDKJAnimation(resources['DisOrDat/Score31on7']);
    this.Score30on7 = new YDKJAnimation(resources['DisOrDat/Score30on7']);

    this.TimerTimeOut = new YDKJAnimation(resources['DisOrDat/TimerTimeOut']);
    this.MusicEndTimeOut = new YDKJAnimation(resources['DisOrDat/MusicEndTimeOut']);
    this.SFXTimeOut1 = new YDKJAnimation(resources['DisOrDat/SFXTimeOut1']);
    this.MusicPlayEnd = new YDKJAnimation(resources['DisOrDat/MusicPlayEnd']);
    this.TimeOut = new YDKJAnimation(resources['DisOrDat/TimeOut']);
    this.TimeOutLoseMoreQuestions = new YDKJAnimation(resources['DisOrDat/TimeOutLose500FMoreQuestions']); // Idem ici, il faudra choisir la ressource en fonction de la valeur de la question
    this.TimeOutLoseOneQuestion = new YDKJAnimation(resources['DisOrDat/TimeOutLose500FOneQuestion']);
    this.ShowFinalScore = new YDKJAnimation(resources['DisOrDat/ShowFinalScore']);

    this.Timer = this.options.timer;
    this.timerTimeout = 0;
};

ModeDisOrDat.prototype.start = function() {
    var thisMode = this;

    var nextcategoryready;

    if (this.chooseplayer == 1) {
        this.ChoicePlayer = this.ChoicePlayer1on3;
        this.PlayerComesIn = this.Player1ComesIn;
        this.PlayerWinGrow = this.Player1WinGrow;
        this.PlayerWinBig = this.Player1WinBig;
        this.PlayerWin = this.Player1Win;
        this.PlayerLoseGrow = this.Player1LoseGrow;
        this.PlayerLoseBig = this.Player1LoseBig;
        this.PlayerLose = this.Player1Lose;
    }
    if (this.chooseplayer == 2) {
        this.ChoicePlayer = this.ChoicePlayer2on3;
        this.PlayerComesIn = this.Player2ComesIn;
        this.PlayerWinGrow = this.Player2WinGrow;
        this.PlayerWinBig = this.Player2WinBig;
        this.PlayerWin = this.Player2Win;
        this.PlayerLoseGrow = this.Player2LoseGrow;
        this.PlayerLoseBig = this.Player2LoseBig;
        this.PlayerLose = this.Player2Lose;
    }
    if (this.chooseplayer == 3) {
        this.ChoicePlayer = this.ChoicePlayer3on3;
        this.PlayerComesIn = this.Player3ComesIn;
        this.PlayerWinGrow = this.Player3WinGrow;
        this.PlayerWinBig = this.Player3WinBig;
        this.PlayerWin = this.Player3Win;
        this.PlayerLoseGrow = this.Player3LoseGrow;
        this.PlayerLoseBig = this.Player3LoseBig;
        this.PlayerLose = this.Player3Lose;
    }

    var anslist = getSTRfromID(thisMode.STR,'ANS#',4);
    var nbchoices = 2;
    for(var a = 0; a < anslist.length; a++) if (anslist[a] == 3) nbchoices = 3;

    var tempscore = 0;

    var jumpToNextCategory = function() {
        nextcategoryready(function(nextcategory){
            nextcategory.modeObj.chooseplayer = thisMode.chooseplayer;
            nextcategory.modeObj.MusicChooseCategoryLoop.free();
            nextcategory.modeObj.MusicChooseCategoryLoop = thisMode.MusicLoopRules1;
            thisMode.MusicLoopRules1 = false; // Pour ne pas être détruite au passage à la catégorie suivante
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
            thisMode.FinalScoreWinShow.free();
            finalscorehide = thisMode.FinalScoreWinHide;
        } else {
            thisMode.FinalScoreLoseShow.free();
            finalscorehide = thisMode.FinalScoreLoseHide;
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
                var from = thisMode.game.players[thisMode.chooseplayer-1].score;
                thisMode.game.players[thisMode.chooseplayer-1].score += tempscore;
                if (tempscore > 0) {
                    thisMode.SFXScoreWin.reset();
                    thisMode.SFXScoreWin.play();
                } else {
                    thisMode.SFXScoreLose.reset();
                    thisMode.SFXScoreLose.play();
                }
                animateValue(PlayerBig,PlayerBig,PlayerBig, function(newvalue) {
                    thisMode.game.font.strings[1492] = newvalue;
                    thisMode.game.font.strings[1497] = newvalue;
                },from,thisMode.game.players[thisMode.chooseplayer-1].score,12,function(){
                    setTimeout(function(){
                        endmessage.ended(800,jumpToNextCategory);
                        endmessage.play();
                        PlayerBig.free();
                        if (tempscore > 0) {
                            thisMode.PlayerWin.play();
                            thisMode.SFXPlayerCorrect.play();
                        } else {
                            thisMode.PlayerLose.play();
                            thisMode.SFXPlayerLose.play();
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

        var totalButtons = 0;
        var tempscoreLeave = function() {
            totalButtons--;
            if (totalButtons == 0) {
                thisMode.TempScoreShow.free();
                thisMode.TempScoreCorrectStop.free();
                thisMode.TempScoreWrongStop.free();
                thisMode.TempScoreHide.play();

                thisMode.game.font.strings[1480] = thisMode.game.displayCurrency(tempscore).replace('_','&thinsp;');
                thisMode.game.font.strings[1485] = thisMode.game.font.strings[1480];
                if (tempscore > 0) {
                    thisMode.FinalScoreWinShow.play();
                } else {
                    thisMode.FinalScoreLoseShow.play();
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

        thisMode.ShowQuestion.free();
        thisMode.HideQuestionCorrect.free();
        thisMode.HideQuestionWrong.free();
        thisMode.HideQuestionTimeout.free();

        thisMode.ShowSubject.free();
        thisMode.HideSubject.play();
    };

    this.MusicPlayEnd.ended(function(){
        thisMode.MusicLoopRules1.reset();
        thisMode.MusicLoopRules1.play();
    });

    this.TimeOut.ended(300,function() {
        var nbanswersleft = 0;
        for(var i = 0; i < currentAnswers.length; i++) if (currentAnswers[i] == 0) nbanswersleft++;
        var tm;
        if (nbanswersleft == 1) tm = thisMode.TimeOutLoseOneQuestion;
        else tm = thisMode.TimeOutLoseMoreQuestions;
        tm.ended(-150,function(){
            thisMode.SFXScoreLose.play();
            thisMode.TempScoreShow.reset();
            thisMode.TempScoreCorrectStop.reset();
            thisMode.TempScoreWrongStop.reset();
            var oldtempscore = tempscore;
            tempscore -= thisMode.options.value*nbanswersleft;
            animateValue(thisMode.TempScoreWrongStart, thisMode.TempScoreWrong, thisMode.TempScoreWrongStop, function(newvalue) {
                thisMode.game.font.strings[1470] = newvalue;
                thisMode.game.font.strings[1475] = newvalue;
            }, oldtempscore, tempscore, 6, function(){
                endQuestion(function(){
                    var nbgoodanswers = 0;
                    for(var i = 0; i < currentAnswers.length; i++) if (currentAnswers[i] == 1) nbgoodanswers++;

                    var scoremessage;
                    if (nbgoodanswers >= 4) scoremessage = thisMode.Score3Positive;
                    else scoremessage = thisMode.Score3Negative;

                    var endmessage;
                    if (nbgoodanswers == 0) endmessage = thisMode.Score30on7;
                    if (nbgoodanswers == 1) endmessage = thisMode.Score31on7;
                    if (nbgoodanswers == 2) endmessage = thisMode.Score32on7;
                    if (nbgoodanswers == 3) endmessage = thisMode.Score32on7; // Partage le même son que le 2/7
                    if (nbgoodanswers == 4) endmessage = thisMode.Score34on7;
                    if (nbgoodanswers == 5) endmessage = thisMode.Score35on7;
                    if (nbgoodanswers == 6) endmessage = thisMode.Score36on7;

                    endmessage.ended(1500,function(){
                        jumpToNextCategory();
                    });

                    scoremessage.ended(500,function(){
                        sumScores(endmessage);
                    });

                    thisMode.ShowFinalScore.ended(300,function(){
                        scoremessage.play();
                    });

                    thisMode.ShowFinalScore.play();
                });
            });
        });
        tm.play();
    });

    this.SFXTimeOut1.ended(300,function() {
        thisMode.MusicPlayEnd.play();
        thisMode.TimeOut.play();
    });

    this.MusicEndTimeOut.ended(function() {
        thisMode.SFXTimeOut1.play();
    });

    var askQuestion = function() {
        var str = getSTRfromID(thisMode.STR,'STR#',3);

        thisMode.HideQuestionSkip.reset();
        thisMode.HideQuestionCorrect.reset();
        thisMode.HideQuestionWrong.reset();
        thisMode.game.font.resetTextStyle(1420);
        thisMode.game.font.strings[1420] = str[currentQuestion+2];
        thisMode.ShowQuestion.play();

        var thisQuestion;
        if (currentQuestion == 0) thisQuestion = thisMode.Question1;
        if (currentQuestion == 1) thisQuestion = thisMode.Question2;
        if (currentQuestion == 2) thisQuestion = thisMode.Question3;
        if (currentQuestion == 3) thisQuestion = thisMode.Question4;
        if (currentQuestion == 4) thisQuestion = thisMode.Question5;
        if (currentQuestion == 5) thisQuestion = thisMode.Question6;
        if (currentQuestion == 6) thisQuestion = thisMode.Question7;

        var nbquestions = 0;
        for(var i = 0; i < currentAnswers.length; i++) if (currentAnswers[i] == 0) nbquestions++;

        if (nbquestions == 1) { // "la dernière" c'est quand il n'en reste plus qu'une à répondre, et on ne peut pas la passer.
            thisMode.LastQuestionAnnounce.ended(function(){
                thisQuestion.reset();
                thisQuestion.play();
            });
            thisMode.LastQuestionAnnounce.play();
        } else {
            thisQuestion.reset();
            thisQuestion.play();
        }
        canPress = 1;
    };

    var afterPressAnimation;

    var RestartSkipped = this.RestartSkipped;

    var pressButton = function(b) { // Appuie sur les boutons. Fonction pour gérer les animations, sons et styles CSS
        if (!canPress) return false;
        var nbquestions = 0;
        for(var i = 0; i < currentAnswers.length; i++) if (currentAnswers[i] == 0) nbquestions++;
        if ((nbquestions == 1) && (b == 4)) {
            thisMode.CannotSkipLast.play();
            return false;
        }

        var bt = buttonsAnswer[b].Push;
        buttonsAnswer[b].StandBy.reset();
        buttonsAnswer[b].Ready.reset(true);
        bt.reset();
        bt.play();
        thisMode.SFXKeyPress.reset();
        thisMode.SFXKeyPress.play();

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
                        thisMode.MusicLoopPlay1.free();
                        thisMode.MusicLoopPlay2.free();
                        thisMode.MusicLoopPlay3.free();
                        thisMode.MusicLoopPlay4.free();
                        thisMode.MusicPlayEnd.play();
                        var nbgoodanswers = 0;
                        for(var i = 0; i < currentAnswers.length; i++) if (currentAnswers[i] == 1) nbgoodanswers++;

                        if (nbgoodanswers > 3) {
                            thisMode.Public7on7.play();
                            thisMode.Public7on7.volume(70);
                        } else {
                            thisMode.Public0on7.play();
                            thisMode.Public0on7.volume(70);
                        }
                    }),300);

                    thisMode.MusicPlayEnd.ended(100,function(){
                        var nbgoodanswers = 0;
                        for(var i = 0; i < currentAnswers.length; i++) if (currentAnswers[i] == 1) nbgoodanswers++;

                        var scoremessage;
                        var endmessage;
                        if (nbgoodanswers == 0) scoremessage = thisMode.Score10on7;
                        if (nbgoodanswers == 1) scoremessage = thisMode.Score11on7;
                        if (nbgoodanswers == 2) scoremessage = thisMode.Score12on7;
                        if (nbgoodanswers == 3) scoremessage = thisMode.Score13on7;
                        if (nbgoodanswers == 4) scoremessage = thisMode.Score14on7;
                        if (nbgoodanswers == 5) scoremessage = thisMode.Score15on7;
                        if (nbgoodanswers == 6) scoremessage = thisMode.Score16on7;
                        if (nbgoodanswers == 7) scoremessage = thisMode.Score17on7;

                        if (nbgoodanswers == 0) endmessage = thisMode.Score20on7;
                        if (nbgoodanswers == 1) endmessage = thisMode.Score21on7;
                        if (nbgoodanswers == 2) endmessage = thisMode.Score22on7;
                        if (nbgoodanswers == 3) endmessage = thisMode.Score23on7;
                        if (nbgoodanswers == 4) endmessage = thisMode.Score24on7;
                        if (nbgoodanswers == 5) endmessage = thisMode.Score25on7;
                        if (nbgoodanswers == 6) endmessage = thisMode.Score26on7;
                        if (nbgoodanswers == 7) endmessage = thisMode.Score27on7;

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
                thisMode.ShowQuestion.reset();
                thisMode.HideQuestionSkip.play();
                afterPressAnimation = function() {
                    nextQuestion();
                };
            } else {
                if (b == anslist[currentQuestion]) { // Bonne réponse !
                    currentAnswers[currentQuestion] = 1;
                    thisMode.ShowQuestion.reset();
                    thisMode.HideQuestionCorrect.play();
                    afterPressAnimation = function(){
                        thisMode.SFXCorrect.reset();
                        thisMode.SFXCorrect.play();
                        thisMode.TempScoreShow.reset();
                        thisMode.TempScoreCorrectStop.reset();
                        thisMode.TempScoreWrongStop.reset();
                        var oldtempscore = tempscore;
                        tempscore += thisMode.options.value;
                        animateValue(thisMode.TempScoreCorrectStart, thisMode.TempScoreCorrect, thisMode.TempScoreCorrectStop, function(newvalue) {
                            thisMode.game.font.strings[1470] = newvalue;
                            thisMode.game.font.strings[1475] = newvalue;
                        },oldtempscore,tempscore,6,function(){
                            nextQuestion();
                        });
                    };
                } else { // Perdu !
                    currentAnswers[currentQuestion] = 2;
                    thisMode.ShowQuestion.reset();
                    thisMode.HideQuestionWrong.play();
                    afterPressAnimation = function(){
                        thisMode.SFXWrong.reset();
                        thisMode.SFXWrong.play();
                        thisMode.TempScoreShow.reset();
                        thisMode.TempScoreCorrectStop.reset();
                        thisMode.TempScoreWrongStop.reset();
                        var oldtempscore = tempscore;
                        tempscore -= thisMode.options.value;
                        animateValue(thisMode.TempScoreWrongStart, thisMode.TempScoreWrong, thisMode.TempScoreWrongStop, function(newvalue) {
                            thisMode.game.font.strings[1470] = newvalue;
                            thisMode.game.font.strings[1475] = newvalue;
                        }, oldtempscore,tempscore,6,function(){
                            nextQuestion();
                        });
                    };
                }
            }
        }

        /*
        // SECURITE DESACTIVEE SINON PROBLEME APRES car exécution de loopStandby en cours de jeu
        // Normalement on a pas besoin de cette sécurité
        var standby = false;
        for(var i = 0; i < buttonsAnswer.length; i++) if (b != i) {
            if (buttonsAnswer[i].StandBy.isplaying) standby = true;
        }
        if (!standby) loopStandBy(); // Sécurité, si on appuie et que plus aucun bouton n'est en standby
        */
    };

    this.MusicLoopPlay4.ended(function(){
        this.reset();
        thisMode.MusicLoopPlay1.play();
    });

    this.MusicLoopPlay3.ended(function(){
        this.reset();
        thisMode.MusicLoopPlay4.play();
    });

    this.MusicLoopPlay2.ended(function(){
        this.reset();
        thisMode.MusicLoopPlay3.play();
    });

    this.MusicLoopPlay1.ended(function(){
        this.reset();
        thisMode.MusicLoopPlay2.play();
    });

    this.JingleStartPlay2.ended(function(){
        thisMode.MusicLoopPlay1.play();
    });

    var timerRunning = function(){
        if (thisMode.Timer.current > 1) {
            thisMode.Timer.playTimer();
            thisMode.timerTimeout = setTimeout(timerRunning, 1000);
        } else { // Timeout
            thisMode.Timer.playTimer();
            thisMode.ShowQuestion.reset();
            thisMode.HideQuestionTimeout.play();

            clearInterval(thisMode.timerTimeout);
            unbindKeyListener(buttonslistener);
            for(var i = 0; i < buttonsAnswer.length; i++) if (buttonsAnswer[i]) {
                buttonsAnswer[i].Ready.click(false);
                buttonsAnswer[i].Push.click(false);
            }

            var timersup = function() {
                thisMode.MusicLoopPlay1.stop();
                thisMode.MusicLoopPlay2.stop();
                thisMode.MusicLoopPlay3.stop();
                thisMode.MusicLoopPlay4.stop();

                thisMode.MusicEndTimeOut.play();
                thisMode.Timer.reset();
                thisMode.TimerTimeOut.play();
            };

            thisMode.MusicLoopPlay1.ended(false);
            thisMode.MusicLoopPlay2.ended(false);
            thisMode.MusicLoopPlay3.ended(false);
            thisMode.MusicLoopPlay4.ended(false);
            thisMode.MusicLoopPlay1.ended(timersup);
            thisMode.MusicLoopPlay2.ended(timersup);
            thisMode.MusicLoopPlay3.ended(timersup);
            thisMode.MusicLoopPlay4.ended(timersup);
        }
    };

    this.JingleStartPlay1.ended(function(){
        thisMode.JingleStartPlay2.play();
        thisMode.PrepareTimer.free();

        var i;
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

        buttonslistener = bindKeyListener(function(choice) {
            var chosed = 0;
            if (choice == 49) chosed = 1;
            else if (choice == 50) chosed = 2;
            else if ((choice == 51) && (nbchoices == 3)) chosed = 3;
            else if (choice == 52) chosed = 4;
            if (chosed > 0) pressButton(chosed);
        });

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

    this.GameStart.ended(100,function(){
        thisMode.MusicLoopRules1.stop();
        thisMode.JingleStartPlay1.play();
    });

    this.PrepareTimer.ended(300,function(){
        thisMode.GameStart.play();
    });

    this.AnnounceTimer.ended(100,function() {
        canPress = 0;
        thisMode.TimerComesIn.free();
        thisMode.PrepareTimer.play();
    });

    var skiplistener = 0;

    this.MessageSpaceBarLeave.ended(function(){
        this.free();
    });

    this.ValueLeave.ended(-100,function() {
        thisMode.MessageSpaceBarComesIn.free();
        thisMode.MessageSpaceBarLeave.play();
    });

    var countLoopRules2 = 4; // 4 fois le MusicLoopRules2
    var endOfRules = function() {
        var i;
        if (skiplistener) unbindKeyListener(skiplistener);
        countLoopRules2 = 0; // TODO: on laisse finir la musique ou bien on arrête immédiatement ?
        thisMode.MusicLoopRules1.ended(false); // Grosse libération globale : si on passe les explications, il faut tout arrêter immédiatement.
        for(i = 0; i < buttonsAnswer.length; i++) if (buttonsAnswer[i]) {
            buttonsAnswer[i].ComesIn.free();
            buttonsAnswer[i].Push.reset();
            buttonsAnswer[i].StandBy.free();
        }
        thisMode.SFXKeyPress.stop();
        thisMode.SFXShowKey.free();
        thisMode.SFXShowPriceCorrect.free();
        thisMode.SFXShowPriceWrong.free();
        thisMode.SFXHidePrice.free();
        thisMode.QuestionIntro1.free();
        thisMode.QuestionIntro2.free();
        thisMode.QuestionAnswer1.free();
        thisMode.QuestionAnswer2.free();
        thisMode.RulesExplainBoth.free();
        thisMode.RulesExplainSkip.free();
        thisMode.RulesExplainCorrect.free();
        thisMode.RulesExplainWrong.free();
        thisMode.ValueComesIn.free();
        thisMode.ValueMinus.free();
        thisMode.ValueLeave.free();
        thisMode.PlayerComesIn.play();
        for(i = 0; i < buttonsAnswer.length; i++) if (buttonsAnswer[i]) {
            buttonsAnswer[i].Ready.play();
        }

        thisMode.game.font.strings[1470] = thisMode.game.displayCurrency(0).replace('_','&thinsp;');
        thisMode.game.font.strings[1475] = thisMode.game.font.strings[1470];
        thisMode.TempScoreShow.play();

        var prepareGame = function() {
            thisMode.AnnounceTimer.delay(600,function() {
                this.play();
            });
        };
        if (thisMode.RulesSkipExplain.isplaying) thisMode.RulesSkipExplain.ended(prepareGame); else prepareGame();
    };

    this.ValueLeave.ended(function() {
        this.free();
        endOfRules();
    });

    thisMode.RulesExplainWrong.ended(150,function() {
        thisMode.ValueMinus.free();
        thisMode.ValueLeave.play();
        thisMode.SFXHidePrice.play();
    });

    thisMode.RulesExplainCorrect.ended(150,function() {
        thisMode.RulesExplainWrong.play();
        thisMode.ValueComesIn.free();
        thisMode.ValueMinus.play();
        thisMode.SFXShowPriceWrong.play();
    });

    var rulesExplainNext = function() {
        thisMode.RulesExplainCorrect.play();
        thisMode.ValueComesIn.play();
        thisMode.SFXShowPriceCorrect.play();
    };

    this.MusicLoopRules2.ended(function() {
        if (countLoopRules2 <= 0) {
            this.free();
            thisMode.MusicLoopRules1.reset();
            thisMode.MusicLoopRules1.play();
            return true;
        }
        countLoopRules2--;
        return false;
    });

    var MusicLoopRules2 = function() {
        thisMode.MusicLoopRules1.ended(function() {
            this.reset(true);
            thisMode.MusicLoopRules2.play();
            return true;
        });
    };

    var rulesExplainSkip = function(){
        thisMode.RulesExplainSkip.play();
        thisMode.RulesExplainSkip.delay(300,function(){
            buttonsAnswer[4].ComesIn.play();
            thisMode.SFXShowKey.reset();
            thisMode.SFXShowKey.play();
        });
    };

    thisMode.RulesExplainBoth.ended(800,function(){
        rulesExplainSkip();
    });

    thisMode.RulesExplainBoth.ended(-350,function(){
        pressButton(3);
    });

    thisMode.QuestionAnswer2.ended(800,function(){
        if (nbchoices == 2) {
            rulesExplainSkip();
        } else {
            thisMode.RulesExplainBoth.play();
        }
    });

    thisMode.QuestionAnswer2.ended(-350,function(){
        pressButton(2);
    });

    thisMode.QuestionAnswer1.ended(800,function(){
        // EST-CE LA MEILLEURE MANIERE DE FAIRE ?
        // On attend que le bouton 1 soit à nouveau en Standby avant d'appuyer, donc on attend si nécessaire que le 2 ait le temps de faire une boucle.
        var timeleft = buttonsAnswer[1].StandBy.length()-buttonsAnswer[1].StandBy.position();
        var anslen = thisMode.QuestionAnswer2.length()-350;
        var interval = timeleft - anslen + 100;
        if (interval > 0) {
            this.delay(interval,function(){
                thisMode.QuestionAnswer2.play();
            });
        } else thisMode.QuestionAnswer2.play();
    });

    thisMode.QuestionAnswer1.ended(-350,function(){
        pressButton(1);
    });

    var readAnswers = function() {
        thisMode.QuestionIntro2.delay(800, function () {
            thisMode.QuestionIntro2.ended(function () {
                thisMode.QuestionAnswer1.play();
            });
        })
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
        /*
        // SECURITE DESACTIVEE SINON PROBLEME APRES car exécution de loopStandby en cours de jeu
        // Normalement on a pas besoin de cette sécurité
        push.ended(function() {
            var standby = false;
            for(var i = 0; i < buttonsAnswer.length; i++) {
                if (buttonsAnswer[i].StandBy.isplaying) standby = true;
            }
            if (!standby) loopStandBy(); // Sécurité, si plus aucun bouton n'est en mode standby
        });
        */
    };

    thisMode.ShowSubject.ended(function(){
        buttonsAnswer[1].ComesIn.play();
        thisMode.SFXShowKey.play();
    });

    this.QuestionIntro1.ended(100,function() {
        thisMode.QuestionIntro2.play();
        thisMode.QuestionIntro2.delay(100,function(){
            thisMode.ShowSubject.play();
        });
    });

    this.QuestionTitle.ended(200,function() {
        thisMode.QuestionIntro1.play();
        thisMode.TimerComesIn.delay(200,function(){
            this.ended(-500,function(){
                thisMode.ShowHeader.play();
            });
            this.play();

            if (nbchoices == 2) {
                addStandBy(thisMode.Button1of3ComesIn, thisMode.Button1of3StandbyLoop, thisMode.Button1of3Push, thisMode.Button1of3Ready, thisMode.Button1of3Leave);
                addStandBy(thisMode.Button2of3ComesIn, thisMode.Button2of3StandbyLoop, thisMode.Button2of3Push, thisMode.Button2of3Ready, thisMode.Button2of3Leave);
                buttonsAnswer.push(0); // Rien pour le bouton 3
                addStandBy(thisMode.Button4of3ComesIn, thisMode.Button4of3StandbyLoop, thisMode.Button4of3Push, thisMode.Button4of3Ready, thisMode.Button4of3Leave);
            } else {
                addStandBy(thisMode.Button1of4ComesIn, thisMode.Button1of4StandbyLoop, thisMode.Button1of4Push, thisMode.Button1of4Ready, thisMode.Button1of4Leave);
                addStandBy(thisMode.Button2of4ComesIn, thisMode.Button2of4StandbyLoop, thisMode.Button2of4Push, thisMode.Button2of4Ready, thisMode.Button2of4Leave);
                addStandBy(thisMode.Button3of4ComesIn, thisMode.Button3of4StandbyLoop, thisMode.Button3of4Push, thisMode.Button3of4Ready, thisMode.Button3of4Leave);
                addStandBy(thisMode.Button4of4ComesIn, thisMode.Button4of4StandbyLoop, thisMode.Button4of4Push, thisMode.Button4of4Ready, thisMode.Button4of4Leave);
            }

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
                    pressButton(4);
                });
            });

            buttonsAnswer[nbchoices].ComesIn.ended(function(){
                this.delay(300,function(){
                    MusicLoopRules2();
                });
                readAnswers();
            });

            if (nbchoices == 3) {
                buttonsAnswer[2].ComesIn.ended(function(){
                    this.delay(300,function(){
                        buttonsAnswer[3].ComesIn.play();
                        thisMode.SFXShowKey.reset();
                        thisMode.SFXShowKey.play();
                    });
                });
            }

            buttonsAnswer[1].ComesIn.ended(function(){
                loopStandBy();
                this.delay(300,function(){
                    buttonsAnswer[2].ComesIn.play();
                    thisMode.SFXShowKey.reset();
                    thisMode.SFXShowKey.play();
                });
            });

            var skipexplanations = function() {
                unbindKeyListener(skiplistener);
                thisMode.MessageSpaceBarComesIn.free();
                thisMode.MessageSpaceBarLeave.play();
                thisMode.RulesSkipExplain.play();
                thisMode.ShowSubject.volume(0);
                thisMode.ShowSubject.play();
                endOfRules();
            };

            skiplistener = bindKeyListener(function(choice) {
                if (choice == 32) skipexplanations(); // Barre espace = on passe les explications
            });

            thisMode.MessageSpaceBarComesIn.click(skipexplanations);
            thisMode.MessageSpaceBarComesIn.play();
        });
    });

    this.QuestionTitle.ended(-400,function() {
        thisMode.ShowCategory.free();
        thisMode.HideCategory.play();
    });

    this.AnnounceCategory.ended(100,function() {
        thisMode.QuestionTitle.play();
    });

    this.AnnounceCategory.ended(-400,function() {
        thisMode.ShowCategory.play();
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

    this.game.font.strings[1487] = this.game.players[this.chooseplayer-1].name;
    this.game.font.strings[1491] = this.game.font.strings[1487];
    this.game.font.strings[1492] = this.game.displayCurrency(this.game.players[this.chooseplayer-1].score);
    this.game.font.strings[1497] = this.game.font.strings[1492];

    this.Intro.ended(function() {
        this.free();
        thisMode.IntroStill.play();
        thisMode.MusicLoopRules1.play();
        thisMode.AnnounceCategory.delay(500,function(){
            this.play();
        });
    });

    this.ChoicePlayer.delay(500,function(){
        this.play();
        thisMode.Intro.delay(2500,function(){
            thisMode.game.html.screen.html(''); // Je vide manuellement l'écran.
            this.play();
        });
    });

    nextcategoryready = this.game.api.gamemode(thisMode); // Préchargement de la prochaine catégorie
};
