/********** ModeQuestion **********/

function ModeQuestion() {}

ModeQuestion.prototype.preload = function(resources) {
    this.JingleQuestion = new YDKJAnimation(resources['Question/JingleQuestion']);
    this.BGQuestion = new YDKJAnimation(resources['Question/BGQuestion']);

    this.AnnounceCategory = new YDKJAnimation(resources['Question/AnnounceCategory']);
    this.ShowCategory = new YDKJAnimation(resources['Question/ShowCategory']);
    this.AnnounceValue = new YDKJAnimation(resources['Question/AnnounceValue']);
    this.VoiceAnnounceValue = new YDKJAnimation(resources['Question/VoiceAnnounceValue']);
    this.HideValue = new YDKJAnimation(resources['Question/HideValue']);
    this.TimerComesIn = new YDKJAnimation(resources['Question/TimerComesIn']);
    this.PrepareTimer = new YDKJAnimation(resources['Question/PrepareTimer']);
    this.JingleReadQuestion = new YDKJAnimation(resources['Question/JingleReadQuestion']);
    this.JingleTimer = new YDKJAnimation(resources['Question/JingleTimer']);
    this.TimeOut1 = new YDKJAnimation(resources['Question/TimeOut1']);
    this.TimeOut2 = new YDKJAnimation(resources['Question/TimeOut2']);
    this.TimeOut3 = new YDKJAnimation(resources['Question/TimeOut3']);
    this.TimerTimeOut = new YDKJAnimation(resources['Question/TimerTimeOut']);
    this.ShowHeader = new YDKJAnimation(resources['Question/ShowHeader']);
    this.ShowQuestion = new YDKJAnimation(resources['Question/ShowQuestion']);
    this.HideQuestion = new YDKJAnimation(resources['Question/HideQuestion']);

    this.SFXPlayerBuzz = new YDKJAnimation(resources['Question/SFXPlayerBuzz']);
    this.SFXPlayerKey = new YDKJAnimation(resources['Question/SFXPlayerKey']);
    this.SFXPlayerLose = new YDKJAnimation(resources['Question/SFXPlayerLose']); // On fait tomber le joueur
    this.SFXPlayerCorrect = new YDKJAnimation(resources['Question/SFXPlayerCorrect']);
    this.DefaultRevealLastAnswer = new YDKJAnimation(resources['Question/DefaultRevealLastAnswer']);

    this.ShowPlayer1Key = new YDKJAnimation(resources['Question/ShowPlayer1Key']);
    this.Player1Answer = new YDKJAnimation(resources['Question/Player1Answer']);
    this.Player1AnswerLoop = new YDKJAnimation(resources['Question/Player1AnswerLoop']);
    this.PlayerBuzzedPlayer1 = new YDKJAnimation(resources['Question/PlayerBuzzedPlayer1']);
    this.Player1Correct = new YDKJAnimation(resources['Question/Player1Correct']);
    this.Player1Wrong = new YDKJAnimation(resources['Question/Player1Wrong']);
    this.Player1Cancel = new YDKJAnimation(resources['Question/Player1Cancel']);

    this.ShowPlayer2Key = new YDKJAnimation(resources['Question/ShowPlayer2Key']);
    this.Player2Answer = new YDKJAnimation(resources['Question/Player2Answer']);
    this.Player2AnswerLoop = new YDKJAnimation(resources['Question/Player2AnswerLoop']);
    this.PlayerBuzzedPlayer2 = new YDKJAnimation(resources['Question/PlayerBuzzedPlayer2']);
    this.Player2Correct = new YDKJAnimation(resources['Question/Player2Correct']);
    this.Player2Wrong = new YDKJAnimation(resources['Question/Player2Wrong']);
    this.Player2Cancel = new YDKJAnimation(resources['Question/Player2Cancel']);

    this.ShowPlayer3Key = new YDKJAnimation(resources['Question/ShowPlayer3Key']);
    this.Player3Answer = new YDKJAnimation(resources['Question/Player3Answer']);
    this.Player3AnswerLoop = new YDKJAnimation(resources['Question/Player3AnswerLoop']);
    this.PlayerBuzzedPlayer3 = new YDKJAnimation(resources['Question/PlayerBuzzedPlayer3']);
    this.Player3Correct = new YDKJAnimation(resources['Question/Player3Correct']);
    this.Player3Wrong = new YDKJAnimation(resources['Question/Player3Wrong']);
    this.Player3Cancel = new YDKJAnimation(resources['Question/Player3Cancel']);

    this.ShowAnswer1 = new YDKJAnimation(resources['Question/ShowAnswer1']);
    this.ShowAnswer2 = new YDKJAnimation(resources['Question/ShowAnswer2']);
    this.ShowAnswer3 = new YDKJAnimation(resources['Question/ShowAnswer3']);
    this.ShowAnswer4 = new YDKJAnimation(resources['Question/ShowAnswer4']);
    this.LoopAnswer1 = new YDKJAnimation(resources['Question/LoopAnswer1']);
    this.LoopAnswer2 = new YDKJAnimation(resources['Question/LoopAnswer2']);
    this.LoopAnswer3 = new YDKJAnimation(resources['Question/LoopAnswer3']);
    this.LoopAnswer4 = new YDKJAnimation(resources['Question/LoopAnswer4']);
    this.CorrectAnswer1 = new YDKJAnimation(resources['Question/CorrectAnswer1']);
    this.CorrectAnswer2 = new YDKJAnimation(resources['Question/CorrectAnswer2']);
    this.CorrectAnswer3 = new YDKJAnimation(resources['Question/CorrectAnswer3']);
    this.CorrectAnswer4 = new YDKJAnimation(resources['Question/CorrectAnswer4']);
    this.WrongAnswer1 = new YDKJAnimation(resources['Question/WrongAnswer1']);
    this.WrongAnswer2 = new YDKJAnimation(resources['Question/WrongAnswer2']);
    this.WrongAnswer3 = new YDKJAnimation(resources['Question/WrongAnswer3']);
    this.WrongAnswer4 = new YDKJAnimation(resources['Question/WrongAnswer4']);

    this.LastPlayer1 = new YDKJAnimation(resources['Question/LastPlayer1']);
    this.LastPlayer2 = new YDKJAnimation(resources['Question/LastPlayer2']);
    this.LastPlayer3 = new YDKJAnimation(resources['Question/LastPlayer3']);
    this.LastPlayers12 = new YDKJAnimation(resources['Question/LastPlayers12']);
    this.LastPlayers13 = new YDKJAnimation(resources['Question/LastPlayers13']);
    this.LastPlayers23 = new YDKJAnimation(resources['Question/LastPlayers23']);

    this.correctanswer = this.options.correctanswer;

    this.QuestionTitle = new YDKJAnimation(resources['Question/QuestionTitle']);
    this.PreQuestion = new YDKJAnimation(resources['Question/PreQuestion']);
    this.Question = new YDKJAnimation(resources['Question/Question']);
    this.Answers = new YDKJAnimation(resources['Question/Answers']);
    this.EndQuestion = new YDKJAnimation(resources['Question/EndQuestion']);
    this.Answer1 = new YDKJAnimation(resources['Question/Answer1']);
    this.Answer2 = new YDKJAnimation(resources['Question/Answer2']);
    this.Answer3 = new YDKJAnimation(resources['Question/Answer3']);
    this.Answer4 = new YDKJAnimation(resources['Question/Answer4']);
    this.AboutToRevealAnswer = new YDKJAnimation(resources['Question/AboutToRevealAnswer']);
    this.RevealAnswer = new YDKJAnimation(resources['Question/RevealAnswer']);

    this.Timer = this.options.timer;
    this.timerTimeout = 0;
};

ModeQuestion.prototype.start = function() {
    var thisMode = this;

    var nextcategoryready = 0;


    var pressKey = function(choice) {
        if (thisMode.currentPlayer == 0) {
            if (thisMode.buzzPlayer != 0) return false; // On a déjà un joueur en attente
            if (choice == thisMode.game.players[0].keycode) thisMode.buzzPlayer = 1; // Joueur 1
            if (choice == thisMode.game.players[1].keycode) thisMode.buzzPlayer = 2; // Joueur 2
            if (choice == thisMode.game.players[2].keycode) thisMode.buzzPlayer = 3; // Joueur 3
            if (!thisMode.availPlayers[thisMode.buzzPlayer]) thisMode.buzzPlayer = 0;

            // Si réponses 1 à 4 : 1 seul joueur = réponse directe, 2 ou 3 joueurs : "On appuie d'abord sur la lettre !"

            if (thisMode.buzzPlayer) {
                clearTimeout(thisMode.timerTimeout);
                thisMode.Question.free();
                thisMode.Answers.free();
                thisMode.JingleReadQuestion.free();
                if (thisMode.LastPlayers) thisMode.LastPlayers.free();
                thisMode.JingleTimer.stop();
                thisMode.SFXPlayerBuzz.reset();
                thisMode.SFXPlayerBuzz.play();
                switch (thisMode.buzzPlayer) {
                    case 1:
                        thisMode.Player1Answer.play();
                        thisMode.ShowPlayer1Key.free();
                        break;
                    case 2:
                        thisMode.Player2Answer.play();
                        thisMode.ShowPlayer2Key.free();
                        break;
                    case 3:
                        thisMode.Player3Answer.play();
                        thisMode.ShowPlayer3Key.free();
                        break;
                }
            }
        } else if (thisMode.currentAns == 0) { // Réponse d'un joueur
            if (choice == 49) thisMode.currentAns = 1;
            if (choice == 50) thisMode.currentAns = 2;
            if (choice == 51) thisMode.currentAns = 3;
            if (choice == 52) thisMode.currentAns = 4;
            if (!thisMode.availAnswers[thisMode.currentAns]) thisMode.currentAns = 0;

            if (thisMode.currentAns) {
                clearTimeout(thisMode.timerTimeout);
                switch (thisMode.currentPlayer) {
                    case 1:
                        thisMode.PlayerBuzzedPlayer1.free();
                        break;
                    case 2:
                        thisMode.PlayerBuzzedPlayer2.free();
                        break;
                    case 3:
                        thisMode.PlayerBuzzedPlayer3.free();
                        break;
                }
                switch(thisMode.currentAns){
                    case 1:
                        thisMode.LoopAnswer1.play();
                        thisMode.ShowAnswer1.free();
                        break;
                    case 2:
                        thisMode.LoopAnswer2.play();
                        thisMode.ShowAnswer2.free();
                        break;
                    case 3:
                        thisMode.LoopAnswer3.play();
                        thisMode.ShowAnswer3.free();
                        break;
                    case 4:
                        thisMode.LoopAnswer4.play();
                        thisMode.ShowAnswer4.free();
                        break;
                }
                thisMode.JingleTimer.stop();
                thisMode.SFXPlayerKey.reset();
                thisMode.SFXPlayerKey.play();
            }
        }
    };

    this.EndQuestion.ended(function(){
        nextcategoryready(function(nextcategory) {
            nextcategory.modeObj.MusicChooseCategoryStart.delay(Math.max(500,2500-thisMode.EndQuestion.length()),function () {
                nextcategory.start();
            });
        });
    });

    this.SFXPlayerCorrect.ended(function(){
        var thisSFX = this;
        this.delay(300,function(){
            nextcategoryready(function(nextcategory) {
                nextcategory.modeObj.chooseplayer = thisMode.currentPlayer; // On donne le choix au joueur qui a bien répondu
                nextcategory.modeObj.MusicChooseCategoryStart.play();
                thisSFX.delay(300,function () {
                    thisMode.EndQuestion.play();
                });
            });
        });
    });

    this.RevealAnswer.ended(300,function(){
        if (thisMode.options.correctanswerisdefault) {
            thisMode.EndQuestion.delay(200,function () {
                this.play();
            });
        } else {
            var answer;
            if (thisMode.correctanswer == 1) answer = thisMode.Answer1;
            if (thisMode.correctanswer == 2) answer = thisMode.Answer2;
            if (thisMode.correctanswer == 3) answer = thisMode.Answer3;
            if (thisMode.correctanswer == 4) answer = thisMode.Answer4;
            answer.ended(200,function () {
                thisMode.EndQuestion.play();
            });
            this.delay(200,function () {
                answer.play();
            });
        }
        nextcategoryready(function(nextcategory) {
            nextcategory.modeObj.MusicChooseCategoryStart.play();
        });
    });

    var gameover = function() {
        // Plus aucun joueur ne peut jouer (timer ou tous les joueurs ont participé)
        unbindKeyListener(thisMode.listener);
        pressKey = function(choice){};

        var revealAnswer;
        var nbAns = 0;
        for(var i=1;i<=4;i++) if (thisMode.availAnswers[i]) nbAns++;
        if (nbAns == 1) revealAnswer = thisMode.DefaultRevealLastAnswer;
        else revealAnswer = thisMode.AboutToRevealAnswer;

        revealAnswer.ended(300,function() {
            thisMode.ShowAnswer1.free();
            thisMode.ShowAnswer2.free();
            thisMode.ShowAnswer3.free();
            thisMode.ShowAnswer4.free();
            thisMode.game.html.screen.find('.markedAsRemoved').remove();
            thisMode.RevealAnswer.play();
        });

        revealAnswer.play();
    };

    var timerRunning = function(){
        thisMode.Timer.playTimer();
        thisMode.timerTimeout = setTimeout(timerRunning,(thisMode.JingleTimer.length()-800)/10); // Proportionnel à la durée du jingle !
    };

    this.SFXPlayerLose.ended(200,function(){
        thisMode.currentPlayer = 0;
        thisMode.currentAns = 0;

        if (thisMode.LastPlayers)  {
            // Remise du compteur à 10
            thisMode.Timer.playTimer(10);
            thisMode.JingleTimer.reset();
            thisMode.JingleTimer.play();
            thisMode.timerTimeout = setTimeout(timerRunning,500);
            thisMode.LastPlayers.play();
        } else gameover();
    });

    var wrong1 = function(){
        thisMode.SFXPlayerLose.delay(100,function() {
            var currentPlayer = thisMode.currentPlayer;
            thisMode.game.players[currentPlayer-1].score = parseInt(thisMode.game.players[currentPlayer-1].score) - parseInt(thisMode.options.value);
            thisMode.game.font.strings[10*thisMode.currentPlayer+105] = thisMode.game.displayCurrency(thisMode.game.players[thisMode.currentPlayer-1].score).replace('_','&nbsp;');

            var PlayerWrong, PlayerAnswerLoop;
            switch (currentPlayer) {
                case 1:
                    PlayerWrong = thisMode.Player1Wrong;
                    PlayerAnswerLoop = thisMode.Player1AnswerLoop;
                    break;
                case 2:
                    PlayerWrong = thisMode.Player2Wrong;
                    PlayerAnswerLoop = thisMode.Player2AnswerLoop;
                    break;
                case 3:
                    PlayerWrong = thisMode.Player3Wrong;
                    PlayerAnswerLoop = thisMode.Player3AnswerLoop;
                    break;
            }

            thisMode.availPlayers[thisMode.currentPlayer] = 0;
            if (thisMode.currentAns > 0) thisMode.availAnswers[thisMode.currentAns] = 0;
            if (thisMode.availPlayers[1]) {
                if (thisMode.availPlayers[2]) thisMode.LastPlayers = thisMode.LastPlayers12;
                else if (thisMode.availPlayers[3]) thisMode.LastPlayers = thisMode.LastPlayers13;
                else thisMode.LastPlayers = thisMode.LastPlayer1;
            } else if (thisMode.availPlayers[2]) {
                if (thisMode.availPlayers[3]) thisMode.LastPlayers = thisMode.LastPlayers23;
                else thisMode.LastPlayers = thisMode.LastPlayer2;
            } else if (thisMode.availPlayers[3]) {
                thisMode.LastPlayers = thisMode.LastPlayer3;
            } else {
                // Plus aucun joueur
                thisMode.LastPlayers = 0;
            }

            if (thisMode.LastPlayers) {
                PlayerWrong.ended(-400, function () {
                    thisMode.TimerTimeOut.reset();
                    thisMode.Timer.playTimer(10);
                });
            }

            PlayerAnswerLoop.free();
            PlayerWrong.play();
            this.reset();
            this.play();
        });
    };

    this.TimeOut1.ended(wrong1);
    this.TimeOut2.ended(wrong1);
    this.TimeOut3.ended(wrong1);

    this.TimerTimeOut.ended(500,function(){
        if (thisMode.currentPlayer == 1) {
            thisMode.TimeOut1.play();
        } else if (thisMode.currentPlayer == 2) {
            thisMode.TimeOut2.play();
        } else if (thisMode.currentPlayer == 3) {
            thisMode.TimeOut3.play();
        } else {
            gameover();
        }
    });

    this.JingleTimer.ended(function(){
        clearTimeout(thisMode.timerTimeout);
        this.delay(200,function(){
            thisMode.currentAns = -1;
            this.reset();
            thisMode.Timer.reset();
            thisMode.TimerTimeOut.play();
        });
    });

    var checkAnswer = function(){
        if (thisMode.currentPlayer == 0) return true;
        if (thisMode.currentAns != thisMode.correctanswer) { // Mauvaise réponse
            switch(thisMode.currentAns){
                case 1:
                    thisMode.LoopAnswer1.free();
                    thisMode.WrongAnswer1.play();
                    thisMode.WrongAnswer1.delay(400,function(){wrong1()});
                    break;
                case 2:
                    thisMode.LoopAnswer2.free();
                    thisMode.WrongAnswer2.play();
                    thisMode.WrongAnswer2.delay(400,function(){wrong1()});
                    break;
                case 3:
                    thisMode.LoopAnswer3.free();
                    thisMode.WrongAnswer3.play();
                    thisMode.WrongAnswer3.delay(400,function(){wrong1()});
                    break;
                case 4:
                    thisMode.LoopAnswer4.free();
                    thisMode.WrongAnswer4.play();
                    thisMode.WrongAnswer4.delay(400,function(){wrong1()});
                    break;
            }
        } else { // Bonne réponse
            switch(thisMode.currentAns){
                case 1:
                    thisMode.LoopAnswer1.free();
                    thisMode.CorrectAnswer1.play();
                    break;
                case 2:
                    thisMode.LoopAnswer2.free();
                    thisMode.CorrectAnswer2.play();
                    break;
                case 3:
                    thisMode.LoopAnswer3.free();
                    thisMode.CorrectAnswer3.play();
                    break;
                case 4:
                    thisMode.LoopAnswer4.free();
                    thisMode.CorrectAnswer4.play();
                    break;
            }
            switch (thisMode.currentPlayer) {
                case 1:
                    thisMode.Player1AnswerLoop.free();
                    thisMode.Player1Correct.play();
                    break;
                case 2:
                    thisMode.Player2AnswerLoop.free();
                    thisMode.Player2Correct.play();
                    break;
                case 3:
                    thisMode.Player3AnswerLoop.free();
                    thisMode.Player3Correct.play();
                    break;
            }

            thisMode.game.players[thisMode.currentPlayer-1].score = parseInt(thisMode.game.players[thisMode.currentPlayer-1].score) + parseInt(thisMode.options.value);
            thisMode.game.font.strings[10*thisMode.currentPlayer+105] = thisMode.game.displayCurrency(thisMode.game.players[thisMode.currentPlayer-1].score).replace('_','&nbsp;');

            thisMode.SFXPlayerCorrect.play();
            unbindKeyListener(thisMode.listener);
        }
        return true;
    };

    this.Answer1.ended(checkAnswer);
    this.Answer2.ended(checkAnswer);
    this.Answer3.ended(checkAnswer);
    this.Answer4.ended(checkAnswer);

    this.Player1Answer.ended(function(){
        this.free();
        thisMode.Player1AnswerLoop.play();
    });
    this.Player2Answer.ended(function(){
        this.free();
        thisMode.Player2AnswerLoop.play();
    });
    this.Player3Answer.ended(function(){
        this.free();
        thisMode.Player3AnswerLoop.play();
    });

    this.SFXPlayerBuzz.ended(150,function(){
        // Remise du compteur à 10
        thisMode.Timer.playTimer(10);
        thisMode.JingleTimer.reset();
        thisMode.JingleTimer.play();
        thisMode.PrepareTimer.free();
        thisMode.timerTimeout = setTimeout(timerRunning,800);
        thisMode.currentPlayer = thisMode.buzzPlayer; // Le joueur peut enfin répondre
        thisMode.buzzPlayer = 0;

        // Vas-y joueur X
        if (thisMode.currentPlayer == 1) {
            thisMode.PlayerBuzzedPlayer1.play();
        }
        if (thisMode.currentPlayer == 2) {
            thisMode.PlayerBuzzedPlayer2.play();
        }
        if (thisMode.currentPlayer == 3) {
            thisMode.PlayerBuzzedPlayer3.play();
        }
    });

    this.Answers.ended(function(){
        this.free();
        thisMode.JingleReadQuestion.delay(100,function(){
            thisMode.JingleReadQuestion.free();
            thisMode.JingleTimer.play();
            thisMode.PrepareTimer.free();
            thisMode.timerTimeout = setTimeout(timerRunning,500);
        });
    });

    this.Question.ended(function(){
        this.free();
        thisMode.JingleReadQuestion.delay(100,function(){
            thisMode.Answers.play();
        });
    });

    this.SFXPlayerKey.ended(150,function(){
        this.reset();
        switch(thisMode.currentAns){
            case 1:
                thisMode.Answer1.play();
                break;
            case 2:
                thisMode.Answer2.play();
                break;
            case 3:
                thisMode.Answer3.play();
                break;
            case 4:
                thisMode.Answer4.play();
                break;
        }
    });

    this.PrepareTimer.ended(1000,function(){
        thisMode.ShowAnswer1.play();
        thisMode.ShowAnswer2.play();
        thisMode.ShowAnswer3.play();
        thisMode.ShowAnswer4.play();
        thisMode.ShowAnswer1.click(function(){pressKey(49)});
        thisMode.ShowAnswer2.click(function(){pressKey(50)});
        thisMode.ShowAnswer3.click(function(){pressKey(51)});
        thisMode.ShowAnswer4.click(function(){pressKey(52)});

        thisMode.availAnswers = [];
        thisMode.availAnswers[1] = 1;
        thisMode.availAnswers[2] = 1;
        thisMode.availAnswers[3] = 1;
        thisMode.availAnswers[4] = 1;

        thisMode.buzzPlayer = 0;
        thisMode.currentPlayer = 0;
        thisMode.currentAns = 0;
        thisMode.listener = bindKeyListener(function(choice) {
            pressKey(choice);
        });
    });

    this.ShowQuestion.ended(500,function(){
        thisMode.TimerComesIn.free();
        thisMode.PrepareTimer.play();
    });

    this.ShowHeader.ended(function(){
        thisMode.PreQuestion.ended(function(){
            this.free();
            thisMode.ShowQuestion.play();
            thisMode.JingleReadQuestion.play();
            thisMode.JingleReadQuestion.delay(300,function() {
                thisMode.Question.play();
            });
        });

        thisMode.availPlayers = [];
        thisMode.ShowPlayer1Key.ended(function(){
            thisMode.availPlayers[1] = 1;
        });
        thisMode.ShowPlayer2Key.ended(function(){
            thisMode.availPlayers[2] = 1;
        });
        thisMode.ShowPlayer3Key.ended(function(){
            thisMode.availPlayers[3] = 1;
        });

        thisMode.ShowPlayer1Key.delay(200,function(){
            this.play();
            this.click(function(){pressKey(thisMode.game.players[0].keycode)});
            if (thisMode.game.players.length >= 2) thisMode.ShowPlayer2Key.delay(90,function(){
                this.play();
                this.click(function(){pressKey(thisMode.game.players[1].keycode)});
                if (thisMode.game.players.length == 3) thisMode.ShowPlayer3Key.delay(90,function(){
                    this.play();
                    this.click(function(){pressKey(thisMode.game.players[2].keycode)});
                });
            });
        });
    });

    this.TimerComesIn.ended(function(){
        thisMode.ShowHeader.play();
    });

    this.HideValue.ended(300,function() {
        this.free();
        thisMode.TimerComesIn.play();
    });

    this.VoiceAnnounceValue.ended(function(){
        this.free();
        thisMode.AnnounceValue.free();
        thisMode.ShowCategory.free();
        thisMode.HideValue.play();
        thisMode.VoiceAnnounceValue.delay(150,function(){
            thisMode.PreQuestion.play();
        });
    });

    this.QuestionTitle.ended(function(){
        this.free();
        thisMode.VoiceAnnounceValue.delay(100,function() {
            this.play();
        });
    });

    this.game.font.strings[110] = this.game.players[0].name;
    this.game.font.strings[115] = this.game.displayCurrency(this.game.players[0].score).replace('_','&nbsp;');
    this.game.font.strings[120] = this.game.players[1].name;
    this.game.font.strings[125] = this.game.displayCurrency(this.game.players[1].score).replace('_','&nbsp;');
    this.game.font.strings[130] = this.game.players[2].name;
    this.game.font.strings[135] = this.game.displayCurrency(this.game.players[2].score).replace('_','&nbsp;');

    this.game.font.strings[1100] = getSTRfromID(thisMode.STR,'STR',1);
    this.game.font.strings[1200] = this.game.font.strings[1100];
    this.game.font.strings[1205] = thisMode.game.displayCurrency(thisMode.options.value).replace('_','&nbsp;');
    this.game.font.strings[1210] = getSTRfromID(thisMode.STR,'STR',2);
    this.game.font.strings[1211] = getSTRfromID(thisMode.STR,'STR',3);
    this.game.font.strings[1212] = getSTRfromID(thisMode.STR,'STR',4);
    this.game.font.strings[1213] = getSTRfromID(thisMode.STR,'STR',5);
    this.game.font.strings[1214] = getSTRfromID(thisMode.STR,'STR',6);
    this.game.font.strings[1215] = this.game.font.strings[1210+this.correctanswer];

    this.ShowCategory.ended(150,function() {
        thisMode.AnnounceValue.play();
    });

    this.AnnounceCategory.ended(function(){
        thisMode.ShowCategory.play();
        thisMode.AnnounceCategory.delay(100,function(){
            thisMode.QuestionTitle.play();
        });
    });

    this.JingleQuestion.ended(function(){
        this.free();
        thisMode.BGQuestion.delay(100,function(){
            this.play();
            thisMode.AnnounceCategory.play();
        });
    });

    thisMode.game.html.screen.html(''); // Je vide manuellement l'écran.

    this.JingleQuestion.play();

    nextcategoryready = this.game.api.gamemode(thisMode); // Préchargement de la prochaine catégorie
};
