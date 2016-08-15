/********** ModeGibberish **********/

function ModeGibberish() {}

ModeGibberish.prototype.preload = function(resources) {
    this.Intro = new YDKJAnimation(resources['Gibberish/Intro']);
    this.MusicIntro1 = new YDKJAnimation(resources['Gibberish/MusicIntro1']);
    this.MusicIntro2 = new YDKJAnimation(resources['Gibberish/MusicIntro2']);
    this.Intro1 = new YDKJAnimation(resources['Gibberish/Intro1']);
    this.Intro2 = new YDKJAnimation(resources['Gibberish/Intro2']);
    this.BGIntro = new YDKJAnimation(resources['Gibberish/BGIntro']);

    this.AnnounceCategory = new YDKJAnimation(resources['Gibberish/AnnounceCategory']);
    this.QuestionTitle = new YDKJAnimation(resources['Gibberish/QuestionTitle']);
    this.ShowCategory = new YDKJAnimation(resources['Gibberish/ShowCategory']);
    this.AnnounceValue = new YDKJAnimation(resources['Gibberish/AnnounceValue']);
    this.VoiceAnnounceValue = new YDKJAnimation(resources['Gibberish/VoiceAnnounceValue']);
    this.HideValue = new YDKJAnimation(resources['Gibberish/HideValue']);

    this.TimerComesIn = new YDKJAnimation(resources['Gibberish/TimerComesIn']);
    this.TimerDance = new YDKJAnimation(resources['Gibberish/TimerDance']);
    this.TimerStop = new YDKJAnimation(resources['Gibberish/TimerStop']);
    this.ExplainRules = new YDKJAnimation(resources['Gibberish/ExplainRules']);
    this.ShowHeader = new YDKJAnimation(resources['Gibberish/ShowHeader']);
    this.ShowPrice = new YDKJAnimation(resources['Gibberish/ShowPrice']);
    this.ShowRules = new YDKJAnimation(resources['Gibberish/ShowRules']);
    this.HideRules = new YDKJAnimation(resources['Gibberish/HideRules']);

    this.QuestionIntro1 = new YDKJAnimation(resources['Gibberish/QuestionIntro1']);
    this.ShowQuestion = new YDKJAnimation(resources['Gibberish/ShowQuestion']);
    this.QuestionIntro2 = new YDKJAnimation(resources['Gibberish/QuestionIntro2']);
    this.QuestionIntro3 = new YDKJAnimation(resources['Gibberish/QuestionIntro3']);

    this.MusicPart1 = new YDKJAnimation(resources['Gibberish/MusicPart1']);
    this.MusicPart2 = new YDKJAnimation(resources['Gibberish/MusicPart2']);
    this.MusicPart3 = new YDKJAnimation(resources['Gibberish/MusicPart3']);

    this.ShowHint1 = new YDKJAnimation(resources['Gibberish/ShowHint1']);
    this.ShowHint2 = new YDKJAnimation(resources['Gibberish/ShowHint2']);
    this.ShowHint3 = new YDKJAnimation(resources['Gibberish/ShowHint3']);
    this.QuestionHint11 = new YDKJAnimation(resources['Gibberish/QuestionHint11']);
    this.QuestionHint12 = new YDKJAnimation(resources['Gibberish/QuestionHint12']);
    this.QuestionHint21 = new YDKJAnimation(resources['Gibberish/QuestionHint21']);
    this.QuestionHint22 = new YDKJAnimation(resources['Gibberish/QuestionHint22']);
    this.QuestionHint31 = new YDKJAnimation(resources['Gibberish/QuestionHint31']);
    this.QuestionHint32 = new YDKJAnimation(resources['Gibberish/QuestionHint32']);

    this.LastPlayer1 = new YDKJAnimation(resources['Gibberish/LastPlayer1']);
    this.LastPlayer2 = new YDKJAnimation(resources['Gibberish/LastPlayer2']);
    this.LastPlayer3 = new YDKJAnimation(resources['Gibberish/LastPlayer3']);
    this.LastPlayers = new YDKJAnimation(resources['Gibberish/LastPlayers']);

    this.TimerTimeOut = new YDKJAnimation(resources['Question/TimerTimeOut']);
    this.CorrectAnswer = new YDKJAnimation(resources['Gibberish/CorrectAnswer']);
    this.AboutToRevealAnswer = new YDKJAnimation(resources['Gibberish/AboutToRevealAnswer']);
    this.RevealAnswer = new YDKJAnimation(resources['Gibberish/RevealAnswer']);
    this.SFXShowAnswerAudience = new YDKJAnimation(resources['Gibberish/SFXShowAnswerAudience']);
    this.EndQuestion = new YDKJAnimation(resources['Gibberish/EndQuestion']);

    /* Eléments pour la fenêtre de saisie texte */
    var typeframe = new InputTextFrame();
    typeframe.game = this.game;
    this.TextFrameShow = typeframe.TextFrameShow = new YDKJAnimation(resources['Gibberish/TextFrameShow']);
    this.TextFrameEnter = typeframe.TextFrameEnter = new YDKJAnimation(resources['Gibberish/TextFrameEnter']);
    this.ShowAnswerTyping = typeframe.ShowAnswerTyping = new YDKJAnimation(resources['Gibberish/ShowAnswerTyping']);
    this.ShowAnswerTextFrame = typeframe.ShowAnswerTextFrame = new YDKJAnimation(resources['Gibberish/ShowAnswerTextFrame']);
    this.SFXShowTextFrame = typeframe.SFXShowTextFrame = new YDKJAnimation(resources['Gibberish/SFXShowTextFrame']);
    this.SFXTypeHeartBeat = typeframe.SFXTypeHeartBeat = new YDKJAnimation(resources['Gibberish/SFXTypeHeartBeat']);
    this.SFXTypeAnswer = typeframe.SFXTypeAnswer = new YDKJAnimation(resources['Gibberish/SFXTypeAnswer']);
    this.SFXTypeBack = typeframe.SFXTypeBack = new YDKJAnimation(resources['Gibberish/SFXTypeBack']);
    this.SFXAnswerEntered = typeframe.SFXAnswerEntered = new YDKJAnimation(resources['Gibberish/SFXAnswerEntered']);
    this.SFXEraseAnswer = typeframe.SFXEraseAnswer = new YDKJAnimation(resources['Gibberish/SFXEraseAnswer']);
    this.typeframe = typeframe;

    this.TextFrameCorrect = new YDKJAnimation(resources['Gibberish/TextFrameCorrect']);
    this.TextFrameWrong = new YDKJAnimation(resources['Gibberish/TextFrameWrong']);

    this.Player1ShowKey = new YDKJAnimation(resources['Question/Player1ShowKey']);
    this.Player1Answer = new YDKJAnimation(resources['Question/Player1Answer']);
    this.Player1AnswerLoop = new YDKJAnimation(resources['Question/Player1AnswerLoop']);
    this.Player1Correct = new YDKJAnimation(resources['Question/Player1Correct']);
    this.Player1Wrong = new YDKJAnimation(resources['Question/Player1Wrong']);
    this.Player1LostScrew = new YDKJAnimation(resources['Question/Player1LostScrew']);
    this.FreeAnswerPlayer1 = new YDKJAnimation(resources['Gibberish/FreeAnswerPlayer1']);
    this.FreeAnswerHurryUp1Player1 = new YDKJAnimation(resources['Gibberish/FreeAnswerHurryUp1Player1']);
    this.FreeAnswerHurryUp2Player1 = new YDKJAnimation(resources['Gibberish/FreeAnswerHurryUp1Player1']);
    this.FreeAnswerTimeOutPlayer1 = new YDKJAnimation(resources['Gibberish/FreeAnswerTimeOutPlayer1']);
    this.Wrong0CluePlayer1 = new YDKJAnimation(resources['Gibberish/Wrong0CluePlayer1']);
    this.Wrong1CluePlayer1 = new YDKJAnimation(resources['Gibberish/Wrong1CluePlayer1']);
    this.Wrong2CluePlayer1 = new YDKJAnimation(resources['Gibberish/Wrong2CluePlayer1']);
    this.Wrong3CluePlayer1 = new YDKJAnimation(resources['Gibberish/Wrong3CluePlayer1']);
    this.WrongSoClosePlayer1 = new YDKJAnimation(resources['Gibberish/WrongSoClosePlayer1']);

    if (this.game.players.length >= 2) {
        this.Player2ShowKey = new YDKJAnimation(resources['Question/Player2ShowKey']);
        this.Player2Answer = new YDKJAnimation(resources['Question/Player2Answer']);
        this.Player2AnswerLoop = new YDKJAnimation(resources['Question/Player2AnswerLoop']);
        this.Player2Correct = new YDKJAnimation(resources['Question/Player2Correct']);
        this.Player2Wrong = new YDKJAnimation(resources['Question/Player2Wrong']);
        this.Player2LostScrew = new YDKJAnimation(resources['Question/Player2LostScrew']);
        this.FreeAnswerPlayer2 = new YDKJAnimation(resources['Gibberish/FreeAnswerPlayer2']);
        this.FreeAnswerHurryUp1Player2 = new YDKJAnimation(resources['Gibberish/FreeAnswerHurryUp1Player2']);
        this.FreeAnswerHurryUp2Player2 = new YDKJAnimation(resources['Gibberish/FreeAnswerHurryUp1Player2']);
        this.FreeAnswerTimeOutPlayer2 = new YDKJAnimation(resources['Gibberish/FreeAnswerTimeOutPlayer2']);
        this.Wrong0CluePlayer2 = new YDKJAnimation(resources['Gibberish/Wrong0CluePlayer2']);
        this.Wrong1CluePlayer2 = new YDKJAnimation(resources['Gibberish/Wrong1CluePlayer2']);
        this.Wrong2CluePlayer2 = new YDKJAnimation(resources['Gibberish/Wrong2CluePlayer2']);
        this.Wrong3CluePlayer2 = new YDKJAnimation(resources['Gibberish/Wrong3CluePlayer2']);
        this.WrongSoClosePlayer2 = new YDKJAnimation(resources['Gibberish/WrongSoClosePlayer2']);
    }

    if (this.game.players.length == 3) {
        this.Player3ShowKey = new YDKJAnimation(resources['Question/Player3ShowKey']);
        this.Player3Answer = new YDKJAnimation(resources['Question/Player3Answer']);
        this.Player3AnswerLoop = new YDKJAnimation(resources['Question/Player3AnswerLoop']);
        this.Player3Correct = new YDKJAnimation(resources['Question/Player3Correct']);
        this.Player3Wrong = new YDKJAnimation(resources['Question/Player3Wrong']);
        this.Player3LostScrew = new YDKJAnimation(resources['Question/Player3LostScrew']);
        this.FreeAnswerPlayer3 = new YDKJAnimation(resources['Gibberish/FreeAnswerPlayer3']);
        this.FreeAnswerHurryUp1Player3 = new YDKJAnimation(resources['Gibberish/FreeAnswerHurryUp1Player3']);
        this.FreeAnswerHurryUp2Player3 = new YDKJAnimation(resources['Gibberish/FreeAnswerHurryUp1Player3']);
        this.FreeAnswerTimeOutPlayer3 = new YDKJAnimation(resources['Gibberish/FreeAnswerTimeOutPlayer3']);
        this.Wrong0CluePlayer3 = new YDKJAnimation(resources['Gibberish/Wrong0CluePlayer3']);
        this.Wrong1CluePlayer3 = new YDKJAnimation(resources['Gibberish/Wrong1CluePlayer3']);
        this.Wrong2CluePlayer3 = new YDKJAnimation(resources['Gibberish/Wrong2CluePlayer3']);
        this.Wrong3CluePlayer3 = new YDKJAnimation(resources['Gibberish/Wrong3CluePlayer3']);
        this.WrongSoClosePlayer3 = new YDKJAnimation(resources['Gibberish/WrongSoClosePlayer3']);
    }

    this.SFXPlayerBuzz = new YDKJAnimation(resources['Question/SFXPlayerBuzz']);
    this.SFXPlayerCorrect = new YDKJAnimation(resources['Question/SFXPlayerCorrect']);
    this.SFXPlayerLose = new YDKJAnimation(resources['Question/SFXPlayerLose']);

    this.timerInterval = 0;
};

ModeGibberish.prototype.start = function() {
    var thisMode = this;
    this.buzzPlayer = 0;
    this.listener = 0;

    var nextcategoryready;

    var currentpos = 0;
    var decreasing = Math.round(thisMode.options.value/40);
    var ShowHint = 0; // Indice programmé pour apparaitre
    this.LastPlayer1.ended(100, function() {if (ShowHint) ShowHint()});
    this.LastPlayer2.ended(100, function() {if (ShowHint) ShowHint()});
    this.LastPlayer3.ended(100, function() {if (ShowHint) ShowHint()});
    this.LastPlayers.ended(100, function() {if (ShowHint) ShowHint()});
    if (this.QuestionHint12.urlAudio != '') this.QuestionHint12.ended(100, function() {if (ShowHint) ShowHint()}); else this.QuestionHint11.ended(100, function() {if (ShowHint) ShowHint()});
    if (this.QuestionHint22.urlAudio != '') this.QuestionHint22.ended(100, function() {if (ShowHint) ShowHint()}); else this.QuestionHint21.ended(100, function() {if (ShowHint) ShowHint()});

    var runTimer = function() {
        currentpos++;
        if (currentpos % 2 == 0) thisMode.game.font.strings[1305] = thisMode.game.displayCurrency(thisMode.options.value-currentpos*decreasing);
        thisMode.ShowPrice.reset();
        thisMode.ShowPrice.play();
        if (!ShowHint) {
            if ((currentpos >= 9) && (!thisMode.ShowHint1.played)) { // Premier indice
                ShowHint = function () {
                    thisMode.ShowHint1.play();
                    thisMode.QuestionHint11.play();
                    ShowHint = 0;
                }
            }
            if ((currentpos >= 18) && (!thisMode.ShowHint2.played)) { // Deuxième indice
                ShowHint = function () {
                    thisMode.ShowHint2.play();
                    thisMode.QuestionHint21.play();
                    ShowHint = 0;
                }
            }
            if ((currentpos >= 27) && (!thisMode.ShowHint3.played)) { // Troisième indice
                ShowHint = function () {
                    thisMode.ShowHint3.play();
                    thisMode.QuestionHint31.play();
                    ShowHint = 0;
                }
            }
            if (currentpos == 40) { // Fin du temps !
                clearInterval(thisMode.timerInterval);
                unbindKeyListener(thisMode.listener);
                thisMode.MusicPart1.reset();
                thisMode.MusicPart2.reset();
                thisMode.MusicPart3.reset();
                thisMode.TimerDance.free();
                thisMode.TimerTimeOut.play();
                thisMode.TimerStop.play();
            }

            if (ShowHint) {
                if ((!thisMode.LastPlayer1.isplaying) && (!thisMode.LastPlayer2.isplaying) && (!thisMode.LastPlayer3.isplaying) && (!thisMode.LastPlayers.isplaying)
                 && (!thisMode.QuestionHint11.isplaying) && (!thisMode.QuestionHint12.isplaying) && (!thisMode.QuestionHint21.isplaying) && (!thisMode.QuestionHint22.isplaying))
                    ShowHint();
            }
        }
    };

    var registerPlayerBuzz = 0; // Déclaré plus tard

    var registerPlayerBuzzIgnore = function() { // Fonction qui ne fait rien, pour ignorer les appuis suivants TODO rendre ce genre de trucs plus propre
        thisMode.game.api.registeraction('playerBuzz', function(data){
            registerPlayerBuzzIgnore();
        });
    };

    var typelistener = 0;

    var jumpToNextCategory = function(len){
        nextcategoryready(function(nextcategory) {
            nextcategory.modeObj.MusicChooseCategoryStart.delay(Math.max(500,2500-len),function () {
                nextcategory.start();
            });
        });
    };

    this.EndQuestion.ended(function(){jumpToNextCategory(thisMode.EndQuestion.length())});
    this.RevealAnswer.ended(function(){jumpToNextCategory(thisMode.RevealAnswer.length())});

    this.SFXPlayerCorrect.ended(function(){
        var thisSFX = this;
        this.delay(300,function(){
            nextcategoryready(function(nextcategory) {
                nextcategory.modeObj.chooseplayer = thisMode.buzzPlayer; // On donne le choix au joueur qui a bien répondu
                nextcategory.modeObj.MusicChooseCategoryStart.play();
                thisSFX.delay(300,function () {
                    thisMode.EndQuestion.play();
                });
            });
        });
    });

    this.TextFrameWrong.ended(100,function() {
        thisMode.game.api.synchronize(function() {
            thisMode.buzzPlayer = 0;
            var nbPlayersLeft = 0;
            for (var i = 1; i <= thisMode.game.players.length; i++) {
                if (thisMode.availPlayers[i]) nbPlayersLeft++;
            }
            if (nbPlayersLeft > 0) {
                if (nbPlayersLeft == 1) {
                    if (thisMode.availPlayers[1]) thisMode.LastPlayer1.play();
                    if (thisMode.availPlayers[2]) thisMode.LastPlayer2.play();
                    if (thisMode.availPlayers[3]) thisMode.LastPlayer3.play();
                } else thisMode.LastPlayers.play();

                ShowHint = 0;
                registerPlayerBuzz();
                thisMode.listener = bindKeyListener(function (choice) {
                    pressKey(choice);
                });
                thisMode.MusicPart1.play();
                thisMode.TimerStop.reset();
                thisMode.TimerDance.play();
                thisMode.timerInterval = setInterval(runTimer, 750);
            } else {
                thisMode.AboutToRevealAnswer.play();
            }
        });
    });

    this.SFXPlayerLose.ended(function() {
        thisMode.TextFrameShow.reset();
        thisMode.TextFrameWrong.reset();
        thisMode.TextFrameWrong.play();
    });

    var playerWrong = function() {
        thisMode.typeframe.wrong(function () {
            setTimeout(function() {
                thisMode.SFXPlayerLose.reset();
                thisMode.SFXPlayerLose.play();
                thisMode.availPlayers[thisMode.buzzPlayer] = 0;

                thisMode.game.players[thisMode.buzzPlayer-1].score = parseInt(thisMode.game.players[thisMode.buzzPlayer-1].score) - parseInt(thisMode.options.value);
                thisMode.game.font.strings[10*thisMode.buzzPlayer+105] = thisMode.game.displayCurrency(thisMode.game.players[thisMode.buzzPlayer-1].score);

                switch (thisMode.buzzPlayer) {
                    case 1:
                        thisMode.Player1AnswerLoop.free();
                        thisMode.Player1Wrong.play();
                        break;
                    case 2:
                        thisMode.Player2AnswerLoop.free();
                        thisMode.Player2Wrong.play();
                        break;
                    case 3:
                        thisMode.Player3AnswerLoop.free();
                        thisMode.Player3Wrong.play();
                        break;
                }
            },150);
        });
    };

    this.Player1Answer.ended(function(){
        this.free();
        thisMode.Player1AnswerLoop.play();
    });
    this.FreeAnswerTimeOutPlayer1.ended(playerWrong);
    this.Wrong0CluePlayer1.ended(playerWrong);
    this.Wrong1CluePlayer1.ended(playerWrong);
    this.Wrong2CluePlayer1.ended(playerWrong);
    this.Wrong3CluePlayer1.ended(playerWrong);
    this.WrongSoClosePlayer1.ended(playerWrong);
    if (this.game.players.length >= 2) {
        this.Player2Answer.ended(function () {
            this.free();
            thisMode.Player2AnswerLoop.play();
        });
        this.FreeAnswerTimeOutPlayer2.ended(playerWrong);
        this.Wrong0CluePlayer2.ended(playerWrong);
        this.Wrong1CluePlayer2.ended(playerWrong);
        this.Wrong2CluePlayer2.ended(playerWrong);
        this.Wrong3CluePlayer2.ended(playerWrong);
        this.WrongSoClosePlayer2.ended(playerWrong);
    }
    if (this.game.players.length == 3) {
        this.Player3Answer.ended(function () {
            this.free();
            thisMode.Player3AnswerLoop.play();
        });
        this.FreeAnswerTimeOutPlayer3.ended(playerWrong);
        this.Wrong0CluePlayer3.ended(playerWrong);
        this.Wrong1CluePlayer3.ended(playerWrong);
        this.Wrong2CluePlayer3.ended(playerWrong);
        this.Wrong3CluePlayer3.ended(playerWrong);
        this.WrongSoClosePlayer3.ended(playerWrong);
    }

    this.typeframe.onEnter = function(text) {
        switch (thisMode.buzzPlayer) {
            case 1:
                thisMode.FreeAnswerPlayer1.free();
                thisMode.FreeAnswerHurryUp1Player1.free();
                thisMode.FreeAnswerHurryUp2Player1.free();
                thisMode.FreeAnswerTimeOutPlayer1.free();
                break;
            case 2:
                thisMode.FreeAnswerPlayer2.free();
                thisMode.FreeAnswerHurryUp1Player2.free();
                thisMode.FreeAnswerHurryUp2Player2.free();
                thisMode.FreeAnswerTimeOutPlayer2.free();
                break;
            case 3:
                thisMode.FreeAnswerPlayer3.free();
                thisMode.FreeAnswerHurryUp1Player3.free();
                thisMode.FreeAnswerHurryUp2Player3.free();
                thisMode.FreeAnswerTimeOutPlayer3.free();
                break;
        }

        unbindKeyListener(typelistener);
        typelistener = 0;
        var resultat = checkTextWrds(text,getSTRfromID(thisMode.STR,'Wrds',128));
        if (resultat == 2) { // Bonne réponse !
            var correctAnswer = function() {
                thisMode.game.players[thisMode.buzzPlayer-1].score = parseInt(thisMode.game.players[thisMode.buzzPlayer-1].score) + parseInt(thisMode.options.value);
                thisMode.game.font.strings[10*thisMode.buzzPlayer+105] = thisMode.game.displayCurrency(thisMode.game.players[thisMode.buzzPlayer-1].score);

                thisMode.TextFrameShow.reset();
                thisMode.TextFrameCorrect.play();
                thisMode.SFXPlayerCorrect.play();
                pressKey = function(choice){};

                switch (thisMode.buzzPlayer) {
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
            };
            if (thisMode.CorrectAnswer.urlAudio != '') {
                thisMode.CorrectAnswer.ended(100,correctAnswer);
                thisMode.CorrectAnswer.play();
            } else correctAnswer();
        } else if (resultat == 1) { // Presque !
            switch (thisMode.buzzPlayer) {
                case 1:thisMode.WrongSoClosePlayer1.play();break;
                case 2:thisMode.WrongSoClosePlayer2.play();break;
                case 3:thisMode.WrongSoClosePlayer3.play();break;
            }
        } else { // Mauvaise réponse
            if (currentpos < 9) { // Aucun indice n'a été donné
                switch (thisMode.buzzPlayer) {
                    case 1:thisMode.Wrong0CluePlayer1.play();break;
                    case 2:thisMode.Wrong0CluePlayer2.play();break;
                    case 3:thisMode.Wrong0CluePlayer3.play();break;
                }
            } else if (currentpos < 18) { // 1 indice a été donné
                switch (thisMode.buzzPlayer) {
                    case 1:thisMode.Wrong1CluePlayer1.play();break;
                    case 2:thisMode.Wrong1CluePlayer2.play();break;
                    case 3:thisMode.Wrong1CluePlayer3.play();break;
                }
            } else if (currentpos < 27) { // 2 indices ont été donnés
                switch (thisMode.buzzPlayer) {
                    case 1:thisMode.Wrong2CluePlayer1.play();break;
                    case 2:thisMode.Wrong2CluePlayer2.play();break;
                    case 3:thisMode.Wrong2CluePlayer3.play();break;
                }
            } else { // 3 indices ont été donnés
                switch (thisMode.buzzPlayer) {
                    case 1:thisMode.Wrong3CluePlayer1.play();break;
                    case 2:thisMode.Wrong3CluePlayer2.play();break;
                    case 3:thisMode.Wrong3CluePlayer3.play();break;
                }
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
        thisMode.game.api.registeraction('typeAnswer', function(data){
            registerTypeAnswerIgnore();
        });
    };

    this.SFXPlayerBuzz.ended(function() {
        switch (thisMode.buzzPlayer) {
            case 1:thisMode.FreeAnswerPlayer1.play();break;
            case 2:thisMode.FreeAnswerPlayer2.play();break;
            case 3:thisMode.FreeAnswerPlayer3.play();break;
        }

        unbindKeyListener(thisMode.listener);
        registerTypeAnswer(); // Réaction à l'api
        if (thisMode.game.players[thisMode.buzzPlayer-1].keycode) { // Ce joueur peut répondre
            typelistener = bindKeyListener(function(key) {
                thisMode.game.api.postaction({action: 'typeAnswer', value: key});
                thisMode.typeframe.sendKeypress(key);
            });
        }
        thisMode.typeframe.start();
    });

    var playerBuzz = function() {
        if (thisMode.buzzPlayer) {
            registerPlayerBuzzIgnore();
            clearInterval(thisMode.timerInterval);

            thisMode.MusicPart1.reset();
            thisMode.MusicPart2.reset();
            thisMode.MusicPart3.reset();
            thisMode.QuestionIntro2.reset();
            thisMode.QuestionIntro3.reset();
            thisMode.QuestionHint11.reset();
            thisMode.QuestionHint12.reset();
            thisMode.QuestionHint21.reset();
            thisMode.QuestionHint22.reset();
            thisMode.QuestionHint31.reset();
            thisMode.QuestionHint32.reset();
            thisMode.TimerDance.reset();
            thisMode.TimerStop.play();
            thisMode.AboutToRevealAnswer.reset();

            thisMode.SFXPlayerBuzz.reset();
            thisMode.SFXPlayerBuzz.play();
            switch (thisMode.buzzPlayer) {
                case 1:
                    thisMode.Player1ShowKey.free();
                    thisMode.Player1Answer.play();
                    break;
                case 2:
                    thisMode.Player2ShowKey.free();
                    thisMode.Player2Answer.play();
                    break;
                case 3:
                    thisMode.Player3ShowKey.free();
                    thisMode.Player3Answer.play();
                    break;
            }
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
        if (choice == thisMode.game.players[0].keycode) thisMode.buzzPlayer = 1; // Joueur 1
        if (thisMode.game.players.length >= 2) {
            if (choice == thisMode.game.players[1].keycode) thisMode.buzzPlayer = 2; // Joueur 2
        }
        if (thisMode.game.players.length == 3) {
            if (choice == thisMode.game.players[2].keycode) thisMode.buzzPlayer = 3; // Joueur 3
        }
        if (!thisMode.availPlayers[thisMode.buzzPlayer]) thisMode.buzzPlayer = 0;

        if (thisMode.buzzPlayer) {
            thisMode.game.api.postaction({action: 'playerBuzz', value: thisMode.buzzPlayer});
            playerBuzz(); // Laisser l'API faire un auto-appel ? (règle le souci du buzz en même temps, mais ajoute un petit délai)
        }
    };

    this.SFXShowAnswerAudience.ended(150,function() {
        nextcategoryready(function(nextcategory) {
            nextcategory.modeObj.chooseplayer = thisMode.chooseplayer; // On donne le choix au joueur précédent
            nextcategory.modeObj.MusicChooseCategoryStart.play();
        });
        if (thisMode.RevealAnswer.urlAudio != '') thisMode.RevealAnswer.play(); else thisMode.EndQuestion.play();
    });

    this.AboutToRevealAnswer.ended(100,function(){
        registerPlayerBuzzIgnore();
        thisMode.typeframe.showAnswer(getSTRfromID(thisMode.STR,'Ansr',128),function() {
            thisMode.SFXShowAnswerAudience.play();
        });
    });

    this.TimerTimeOut.ended(100,function() {
        thisMode.AboutToRevealAnswer.play();
    });

    this.QuestionHint31.ended(300,function() {
        this.free();
        if (thisMode.QuestionHint32.urlAudio != '') thisMode.QuestionHint32.play();
    });

    this.QuestionHint21.ended(300,function() {
        this.free();
        if (thisMode.QuestionHint22.urlAudio != '') thisMode.QuestionHint22.play();
    });

    this.QuestionHint11.ended(300,function() {
        this.free();
        if (thisMode.QuestionHint12.urlAudio != '') thisMode.QuestionHint12.play();
    });

    this.QuestionIntro2.ended(100,function() {
        this.free();
        if (thisMode.QuestionIntro3.urlAudio != '') thisMode.QuestionIntro3.play();
    });

    this.MusicPart3.ended(function(){
        this.reset();
        thisMode.MusicPart1.play();
    });

    this.MusicPart2.ended(function(){
        this.reset();
        thisMode.MusicPart3.play();
    });

    this.MusicPart1.ended(function(){
        this.reset();
        thisMode.MusicPart2.play();
    });

    this.TimerDance.ended(100,function() {
        thisMode.TimerDance.reset();
        thisMode.TimerDance.play();
    });

    this.ShowQuestion.ended(100,function() {
        thisMode.MusicPart1.play();
        thisMode.QuestionIntro2.play();
        thisMode.TimerComesIn.free();
        thisMode.TimerDance.play();

        thisMode.availPlayers = [];
        thisMode.availPlayers[1] = 1;
        thisMode.Player1ShowKey.click(function(){pressKey(thisMode.game.players[0].keycode)});
        if (thisMode.game.players.length >= 2) {
            thisMode.availPlayers[2] = 1;
            thisMode.Player2ShowKey.click(function(){pressKey(thisMode.game.players[1].keycode)});
        }
        if (thisMode.game.players.length == 3) {
            thisMode.availPlayers[3] = 1;
            thisMode.Player3ShowKey.click(function(){pressKey(thisMode.game.players[2].keycode)});
        }

        registerPlayerBuzz();
        thisMode.listener = bindKeyListener(function(choice) {
            pressKey(choice);
        });

        thisMode.timerInterval = setInterval(runTimer,750);
    });

    this.QuestionIntro1.ended(100,function() {
        this.free();
        thisMode.game.api.synchronize(function() {
            thisMode.ShowQuestion.play();
        });
    });

    this.ExplainRules.ended(function() {
        this.free();
        thisMode.ShowRules.free();
        thisMode.HideRules.play();
        if (thisMode.QuestionIntro1.urlAudio != '') {
            thisMode.QuestionIntro1.delay(100, function () {
                this.play();
            });
        } else {
            thisMode.game.api.synchronize(function() {
                thisMode.ShowQuestion.delay(200,function(){
                    this.play();
                });
            });
        }
    });

    this.ShowHeader.ended(500,function() {
        thisMode.ShowRules.play();
    });

    this.TimerComesIn.ended(function() {
        thisMode.ShowPrice.play();
    });

    this.HideValue.ended(300,function() {
        this.free();
        thisMode.TimerComesIn.play();
        thisMode.Player1ShowKey.play();
        if (thisMode.game.players.length >= 2) thisMode.Player2ShowKey.play();
        if (thisMode.game.players.length == 3) thisMode.Player3ShowKey.play();
        thisMode.ExplainRules.play();
        thisMode.ShowHeader.delay(100,function() {
            this.play();
        });
    });

    this.VoiceAnnounceValue.ended(function(){
        this.free();
        thisMode.AnnounceValue.free();
        thisMode.ShowCategory.free();
        thisMode.HideValue.play();
    });

    this.QuestionTitle.ended(function(){
        this.free();
        thisMode.VoiceAnnounceValue.delay(100,function() {
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

    this.ShowCategory.ended(150,function() {
        thisMode.AnnounceValue.play();
    });

    this.AnnounceCategory.ended(function(){
        this.free();
        thisMode.ShowCategory.play();
        thisMode.QuestionTitle.delay(100,function(){
            this.play();
        });
    });

    this.Intro2.ended(function() {
        this.free();
        thisMode.BGIntro.play();
        thisMode.AnnounceCategory.delay(200,function() {
            this.play();
        })
    });

    this.Intro1.ended(function() {
        this.free();
        thisMode.Intro2.play();
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
                thisMode.Intro1.play();
            }
        };
        interval = setInterval(nextStep,40*2);
    };

    this.MusicIntro1.ended(function() {
        this.free();
        thisMode.MusicIntro2.play();
    });

    this.Intro.ended(60,function() {
        this.free();
        blackZoom();
        thisMode.MusicIntro1.play();
    });

    this.Intro.delay(500,function(){
        this.play();
    });

    nextcategoryready = this.game.api.gamemode(thisMode); // Préchargement de la prochaine catégorie
};
