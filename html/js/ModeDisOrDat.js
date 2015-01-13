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
    this.ShowQuestion = new YDKJAnimation(resources['DisOrDat/ShowQuestion']);

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
    this.Player1Win = new YDKJAnimation(resources['DisOrDat/Player1Win']);
    this.Player1Lose = new YDKJAnimation(resources['DisOrDat/Player1Lose']);

    this.Player2ComesIn = new YDKJAnimation(resources['DisOrDat/Player2ComesIn']);
    this.Player2Win = new YDKJAnimation(resources['DisOrDat/Player2Win']);
    this.Player2Lose = new YDKJAnimation(resources['DisOrDat/Player2Lose']);

    this.Player3ComesIn = new YDKJAnimation(resources['DisOrDat/Player3ComesIn']);
    this.Player3Win = new YDKJAnimation(resources['DisOrDat/Player3Win']);
    this.Player3Lose = new YDKJAnimation(resources['DisOrDat/Player3Lose']);

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

    this.Timer = this.options.timer;
    this.timerTimeout = 0;
};

ModeDisOrDat.prototype.start = function() {
    var thisMode = this;

    var nextcategory = 0;

    if (this.chooseplayer == 1) {
        this.ChoicePlayer = this.ChoicePlayer1on3;
        this.PlayerComesIn = this.Player1ComesIn;
        this.PlayerWin = this.Player1Win;
        this.PlayerLose = this.Player1Lose;
    }
    if (this.chooseplayer == 2) {
        this.ChoicePlayer = this.ChoicePlayer2on3;
        this.PlayerComesIn = this.Player2ComesIn;
        this.PlayerWin = this.Player2Win;
        this.PlayerLose = this.Player2Lose;
    }
    if (this.chooseplayer == 3) {
        this.ChoicePlayer = this.ChoicePlayer3on3;
        this.PlayerComesIn = this.Player3ComesIn;
        this.PlayerWin = this.Player3Win;
        this.PlayerLose = this.Player3Lose;
    }

    var jumpToNextCategory = function() {
        nextcategory.modeObj.MusicChooseCategoryLoop.free();
        nextcategory.modeObj.MusicChooseCategoryLoop = thisMode.MusicLoopRules1;
        thisMode.MusicLoopRules1 = false; // Pour ne pas être détruite au passage à la catégorie suivante
        nextcategory.start();
    };

    var buttonsAnswer = [];
    var textAnswer = [];
    var currentAnswers = [0,0,0,0,0,0,0]; // 0 = non répondu, 1 = gagné, 2 = perdu
    var currentQuestion = 0;
    var questionouterdiv;
    var questiondiv;

    var displayAnswer = function(i) {
        var str = getSTRfromID(thisMode.STR,'STR#',3);

        var div = jQuery('<div />').css({ // Titre de la catégorie
            'position':'absolute',
            'left':'0',
            'top':'330px'
        });

        var left = '0';
        if (i == 2) left = '226px';

        var answerdiv = jQuery('<div />').css({
            'position':'relative',
            'text-align':'center',
            'top':'12px',
            'left':left,
            'width':'200px',
            'font-size':'8px',
            'color':'#FF0',
            'font-family':'JackCondensed'
        }).html(str[i-1]).appendTo(div).animate({
            'top':'-6px',
            'font-size':'30px'
        },90,function(){
            answerdiv.css({
                'top':'0',
                'font-size':'24px'
            })
        });

        div.appendTo(thisMode.game.html.screen);

        textAnswer[i-1] = answerdiv;
    };

    var loopStandBy = function(){ // Fonction servant à synchroniser les animations Standby
        for(var i = 0; i < buttonsAnswer.length; i++) {
            if ((!buttonsAnswer[i].ComesIn.isplaying) && (buttonsAnswer[i].ComesIn.played) && (!buttonsAnswer[i].StandBy.isplaying) && (!buttonsAnswer[i].Push.isplaying)) {
                buttonsAnswer[i].ComesIn.free();
                buttonsAnswer[i].Push.reset();
                buttonsAnswer[i].StandBy.reset();
                buttonsAnswer[i].StandBy.play();
            }
        }
    };

    var askQuestion = function() {
        var str = getSTRfromID(thisMode.STR,'STR#',3);

        questionouterdiv.html('');
        questiondiv = jQuery('<div />').attr('id','QuestionDiv').css({ // Titre de la catégorie
            'color':'#FFF',
            'font-family':'JackExtraCond',
            'text-align':'center',
            'font-size':'70px',
            'line-height':'70px',
            'position':'absolute',
            'width':'640px',
            '-webkit-transform':'scale(0.0,1.0)',
            '-moz-transform':'scale(0.0,1.0)',
            '-ms-transform':'scale(0.0,1.0)',
            '-o-transform':'scale(0.0,1.0)',
            'transform':'scale(0.0,1.0)'
        }).html(str[currentQuestion+2]).appendTo(questionouterdiv);

        animTransform(questiondiv,0,1,1,1,0.30,640,0,'center');

        var thisQuestion;
        if (currentQuestion == 0) thisQuestion = thisMode.Question1;
        if (currentQuestion == 1) thisQuestion = thisMode.Question2;
        if (currentQuestion == 2) thisQuestion = thisMode.Question3;
        if (currentQuestion == 3) thisQuestion = thisMode.Question4;
        if (currentQuestion == 4) thisQuestion = thisMode.Question5;
        if (currentQuestion == 5) thisQuestion = thisMode.Question6;
        if (currentQuestion == 6) thisQuestion = thisMode.Question7;

        if (false) { // TODO En fait "la dernière" c'est quand il n'en reste plus qu'une à répondre (à vérifier), et tu ne peux pas la passer.
            thisMode.LastQuestionAnnounce.ended(function(){
                thisQuestion.reset();
                thisQuestion.play();
            });
            thisMode.LastQuestionAnnounce.play();
        } else {
            thisQuestion.reset();
            thisQuestion.play();
        }
    };

    var pressButton = function(b,ans) { // Appuie sur les boutons. Fonction pour gérer les animations, sons et styles CSS
        var bt = buttonsAnswer[b].Push;
        buttonsAnswer[b].StandBy.reset();
        buttonsAnswer[b].Ready.reset(true);
        bt.reset();
        bt.play();
        thisMode.SFXKeyPress.reset();
        thisMode.SFXKeyPress.play();
        if (b < 2) {
            var answerdiv = textAnswer[b];
            answerdiv.css({
                'top':'12px',
                'font-size':'8px'
            });
            bt.delay(66,function(){
                answerdiv.css({
                    'display':'none'
                });
                bt.delay(66,function(){
                    answerdiv.css({
                        'display':'',
                        'top':'-7px',
                        'font-size':'34px',
                        'color':'#F00'
                    });
                    bt.delay(300,function() {
                        answerdiv.css({
                            'top': '12px',
                            'font-size': '8px'
                        });
                        bt.delay(66,function() {
                            answerdiv.css({
                                'top': '0',
                                'font-size': '24px',
                                'color': '#FF0'
                            });
                        });
                    });
                });
            });
        }

        if (questiondiv) {
            // Animation différente si gagné ou perdu
            // INFO : le score (+500-500) s'incrémente tous les 83 par frames sur 6 frames, soit environ 500/6 => 83*6 = 496 (et on ajoute 1 frame pour afficher la valeur exacte).
            // Pour l'addition, c'est sur 11 frames (et on ajoute 1 pour le score exact), donc 1500 ~= 136*11 par exemple.
            //if (ans == true) {
                questiondiv.animate({
                    'left': '640px'
                }, 250, function () {
                    currentQuestion++;
                    if (currentQuestion == 7) currentQuestion = 0;
                    askQuestion();
                });
            //};
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

    thisMode.Button4of4Ready.click(function(){
        pressButton(3);
    });
    thisMode.Button4of4Push.click(function(){
        pressButton(3);
    });

    thisMode.Button3of4Ready.click(function(){
        pressButton(2);
    });
    thisMode.Button3of4Push.click(function(){
        pressButton(2);
    });
    thisMode.Button4of3Ready.click(function(){
        pressButton(2);
    });
    thisMode.Button4of3Push.click(function(){
        pressButton(2);
    });

    thisMode.Button2of4Ready.click(function(){
        pressButton(1);
    });
    thisMode.Button2of4Push.click(function(){
        pressButton(1);
    });
    thisMode.Button2of3Ready.click(function(){
        pressButton(1);
    });
    thisMode.Button2of3Push.click(function(){
        pressButton(1);
    });

    thisMode.Button1of4Ready.click(function(){
        pressButton(0);
    });
    thisMode.Button1of4Push.click(function(){
        pressButton(0);
    });
    thisMode.Button1of3Ready.click(function(){
        pressButton(0);
    });
    thisMode.Button1of3Push.click(function(){
        pressButton(0);
    });

    thisMode.MusicLoopPlay4.ended(function(){
        this.reset();
        thisMode.MusicLoopPlay1.play();
    });

    thisMode.MusicLoopPlay3.ended(function(){
        this.reset();
        thisMode.MusicLoopPlay4.play();
    });

    thisMode.MusicLoopPlay2.ended(function(){
        this.reset();
        thisMode.MusicLoopPlay3.play();
    });

    thisMode.MusicLoopPlay1.ended(function(){
        this.reset();
        thisMode.MusicLoopPlay2.play();
    });

    thisMode.JingleStartPlay2.ended(function(){
        thisMode.MusicLoopPlay1.play();
    });

    var timerRunning = function(){
        if (thisMode.Timer.current > 0) {
            thisMode.Timer.playTimer();
            thisMode.timerTimeout = setTimeout(timerRunning, 1100);
        } else {
            // Timeout
            thisMode.MusicLoopPlay1.free();
            thisMode.MusicLoopPlay2.free();
            thisMode.MusicLoopPlay3.free();
            thisMode.MusicLoopPlay4.free();
            thisMode.MusicLoopRules1.reset();
            thisMode.MusicLoopRules1.play();
            jumpToNextCategory();
        }
    };

    thisMode.JingleStartPlay1.ended(function(){
        thisMode.JingleStartPlay2.play();
        thisMode.PrepareTimer.free();
        timerRunning();
        questionouterdiv = jQuery('<div />').css({ // Titre de la catégorie
            'position':'absolute',
            'height':'70px',
            'line-height':'70px',
            'left':'0',
            'top':'150px'
        });

        questionouterdiv.appendTo(thisMode.game.html.screen);

        for(var i = 0; i < buttonsAnswer.length; i++) {
            buttonsAnswer[i].Push.ended(false);
        }
        askQuestion();
    });

    thisMode.GameStart.ended(100,function(){
        thisMode.MusicLoopRules1.stop();
        thisMode.JingleStartPlay1.play();
    });

    thisMode.PrepareTimer.ended(300,function(){
        thisMode.GameStart.play();
    });

    thisMode.AnnounceTimer.ended(100,function() {
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
        thisMode.MusicLoopRules1.ended(false);
        thisMode.Button1of3ComesIn.free(); // Grosse libération globale : si on passe les explications, il faut tout arrêter immédiatement.
        thisMode.Button2of3ComesIn.free();
        thisMode.Button4of3ComesIn.free();
        thisMode.Button1of4ComesIn.free();
        thisMode.Button2of4ComesIn.free();
        thisMode.Button3of4ComesIn.free();
        thisMode.Button4of4ComesIn.free();
        for(i = 0; i < buttonsAnswer.length; i++) {
            buttonsAnswer[i].Push.reset();
            buttonsAnswer[i].StandBy.free();
        }
        thisMode.SFXShowKey.free();
        thisMode.SFXKeyPress.free();
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
        for(i = 0; i < buttonsAnswer.length; i++) {
            buttonsAnswer[i].Ready.play();
        }
        if (textAnswer.length == 0) {
            displayAnswer(1);
            displayAnswer(2);
        } else if (textAnswer.length == 1) displayAnswer(2);

        // TODO: afficher le score du joueur et le score temporaire à gauche.

        var prepareGame = function() {
            thisMode.AnnounceTimer.delay(600,function() {
                this.play();
                //jumpToNextCategory();
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

    this.Button4of3Push.ended(function() { // Il faut un délai après le ended sinon, si le Push est stop/reset avant le délai, cela ne sera jamais exécuté.
        this.delay(200,function(){
            this.ended(false);
            rulesExplainNext();
        });
    });

    this.Button4of4Push.ended(function() {
        this.delay(200,function(){
            this.ended(false);
            rulesExplainNext();
        });
    });

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

    thisMode.QuestionAnswer2.ended(800,function(){
        if (thisMode.options.nbchoices == 3) {
            thisMode.RulesExplainSkip.play();
            thisMode.QuestionAnswer2.delay(300,function(){
                thisMode.Button4of3ComesIn.play();
                thisMode.SFXShowKey.reset();
                thisMode.SFXShowKey.play();
            });
        } else {
            thisMode.RulesExplainBoth.play(); // TODO: gérer la suite...
        }
    });

    thisMode.QuestionAnswer2.ended(-350,function(){
        pressButton(1);
    });

    thisMode.QuestionAnswer1.ended(800,function(){
        // EST-CE LA MEILLEURE MANIERE DE FAIRE ?
        // On attend que le bouton 1 (donc n° 0) soit à nouveau en Standby avant d'appuyer, donc on attend si nécessaire que le 2 ait le temps de faire une boucle.
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
        pressButton(0);
    });

    var readAnswers = function() {
        thisMode.QuestionIntro2.delay(800, function () {
            thisMode.QuestionIntro2.ended(function () {
                thisMode.QuestionAnswer1.play();
            });
        })
    };

    this.Button2of3ComesIn.ended(readAnswers);
    this.Button2of4ComesIn.ended(readAnswers);

    var addStandBy = function(comesin, standby, push, ready) {
        buttonsAnswer.push({ComesIn: comesin, StandBy: standby, Push: push, Ready: ready});
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

    this.Button4of4ComesIn.ended(function(){
        this.delay(300,function(){
            buttonsAnswer[3].ComesIn.free();
            pressButton(3);
        });
        this.delay(300,function(){
            MusicLoopRules2();
        });
    });

    this.Button3of4ComesIn.ended(function(){
    });

    this.Button2of4ComesIn.ended(-100,function() {
        displayAnswer(2);
    });
    this.Button2of4ComesIn.ended(function(){
        this.delay(300,function(){
            thisMode.Button3of4ComesIn.play();
            thisMode.SFXShowKey.reset();
            thisMode.SFXShowKey.play();
        });
    });

    this.Button1of4ComesIn.ended(-100,function() {
        displayAnswer(1);
    });
    this.Button1of4ComesIn.ended(function(){
        loopStandBy();
        this.delay(300,function(){
            thisMode.Button2of4ComesIn.play();
            thisMode.SFXShowKey.reset();
            thisMode.SFXShowKey.play();
        });
    });

    this.Button4of3ComesIn.ended(function(){
        this.delay(300,function(){
            buttonsAnswer[2].ComesIn.free();
            pressButton(2);
        });
    });

    this.Button2of3ComesIn.ended(-100,function() {
        displayAnswer(2);
    });
    this.Button2of3ComesIn.ended(function(){
        this.delay(300,function(){
            MusicLoopRules2();
        });
    });

    this.Button1of3ComesIn.ended(-100,function() {
        displayAnswer(1);
    });
    this.Button1of3ComesIn.ended(function(){
        loopStandBy();
        this.delay(300,function(){
            thisMode.Button2of3ComesIn.play();
            thisMode.SFXShowKey.reset();
            thisMode.SFXShowKey.play();
        });
    });

    var showQuestion = function(f) {
        showQuestion = function(){}; // Auto-détruire la fonction pour éviter qu'elle ne soit exécutée plusieurs fois
        var div = jQuery('<div />').css({ // Texte de la question
            'position':'absolute',
            'height':'150px',
            'line-height':'150px',
            'left':'-560px',
            'top':'70px'
        });

        var textdiv = jQuery('<div />').css({
            'position':'relative',
            'width':'560px',
            'vertical-align':'top',
            'display':'inline-block',
            'font-size':'29px',
            'line-height':'34px',
            'color':'#FF0',
            'font-family':'JackRoman',
            'font-style':'italic',
            'text-align':'center'
        }).html(getSTRfromID(thisMode.STR,'STR',2));

        textdiv.appendTo(div);

        div.appendTo(thisMode.game.html.screen).animate({'left':'40px'},300,function() {
            textdiv.css({'font-style':'normal'});
            if (f) f();
        });
    };

    this.QuestionIntro1.ended(100,function() {
        thisMode.QuestionIntro2.play();
        thisMode.QuestionIntro2.delay(100,function(){
            thisMode.ShowQuestion.play();
            showQuestion(function(){
                if (thisMode.options.nbchoices == 3) {
                    addStandBy(thisMode.Button1of3ComesIn, thisMode.Button1of3StandbyLoop, thisMode.Button1of3Push, thisMode.Button1of3Ready);
                    addStandBy(thisMode.Button2of3ComesIn, thisMode.Button2of3StandbyLoop, thisMode.Button2of3Push, thisMode.Button2of3Ready);
                    addStandBy(thisMode.Button4of3ComesIn, thisMode.Button4of3StandbyLoop, thisMode.Button4of3Push, thisMode.Button4of3Ready);
                    thisMode.Button1of3ComesIn.play();
                } else {
                    addStandBy(thisMode.Button1of4ComesIn, thisMode.Button1of4StandbyLoop, thisMode.Button1of4Push, thisMode.Button1of4Ready);
                    addStandBy(thisMode.Button2of4ComesIn, thisMode.Button2of4StandbyLoop, thisMode.Button2of4Push, thisMode.Button2of4Ready);
                    addStandBy(thisMode.Button3of4ComesIn, thisMode.Button3of4StandbyLoop, thisMode.Button3of4Push, thisMode.Button3of4Ready);
                    addStandBy(thisMode.Button4of4ComesIn, thisMode.Button4of4StandbyLoop, thisMode.Button4of4Push, thisMode.Button4of4Ready);
                    thisMode.Button1of4ComesIn.play();
                }
                thisMode.SFXShowKey.play();
            });
        });
    });

    this.QuestionTitle.ended(200,function() {
        thisMode.QuestionIntro1.play();
        thisMode.TimerComesIn.delay(200,function(){
            this.ended(-500,function(){
                var div = jQuery('<div />').css({ // Titre de la catégorie
                    'position':'absolute',
                    'height':'70px',
                    'line-height':'70px',
                    'left':'70px',
                    'top':'0'
                });

                var titlediv = jQuery('<div />').css({
                    'position':'relative',
                    'left':'-150px',
                    'width':'300px',
                    'vertical-align':'middle',
                    'display':'inline-block',
                    'font-size':'20px',
                    'line-height':'24px',
                    'color':'#33F',
                    'font-family':'JackRoman',
                    '-webkit-transform':'scale(0.0,1.0)',
                    '-moz-transform':'scale(0.0,1.0)',
                    '-ms-transform':'scale(0.0,1.0)',
                    '-o-transform':'scale(0.0,1.0)',
                    'transform':'scale(0.0,1.0)'
                }).html(getSTRfromID(thisMode.STR,'STR',1)).appendTo(div);

                div.appendTo(thisMode.game.html.screen);

                animTransform(titlediv,0,1,1,1,0.15,300,0,'left');
            });
            this.play();
            thisMode.MessageSpaceBarComesIn.play();
            skiplistener = bindKeyListener(function(choice) {
                if (choice == 32) { // Barre espace = on passe les explications
                    unbindKeyListener(skiplistener);
                    thisMode.MessageSpaceBarComesIn.free();
                    thisMode.MessageSpaceBarLeave.play();
                    thisMode.RulesSkipExplain.play();
                    showQuestion();
                    endOfRules();
                }
            });
        });
    });

    this.QuestionTitle.ended(-400,function() {
        thisMode.game.html.screen.find('#QuestionTitle').css('font-style','italic').delay(100).animate({'left':'-500px'},500,function(){
            thisMode.game.html.screen.find('#QuestionTitle').remove();
        });
    });

    this.AnnounceCategory.ended(100,function() {
        thisMode.QuestionTitle.play();
    });

    this.AnnounceCategory.ended(-400,function() {
        var textsize = 50;
        if (getSTRfromID(thisMode.STR,'STR',1).length < 35) textsize = 70;
        if (getSTRfromID(thisMode.STR,'STR',1).length < 15) textsize = 120;

        jQuery('<div />').attr('id','QuestionTitle').css({ // Titre de la catégorie
            'color':'#FFF',
            'font-family':'JackExtraCond',
            'text-align':'center',
            'font-size':Math.round(textsize*0.90)+'px',
            'line-height':textsize+'px',
            'position':'absolute',
            'width':'450px',
            'left':'95px',
            'top':Math.round(155+textsize*0.05)+'px', // Plus bas que les catégories des questions
            'opacity':'0'
        }).html(getSTRfromID(thisMode.STR,'STR',1)).appendTo(thisMode.game.html.screen).animate({
                'top':'155px', // Plus bas que les catégories des questions
                'font-size':textsize+'px',
                'line-height':Math.round(textsize*1.10)+'px',
                'opacity':'1',
                'display':'none'}
            ,250);
    });

    this.Intro.ended(function() {
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

    nextcategory = new YDKJMode(this.game, 'Category', {category:1,questionnumber:this.options.questionnumber+1});
    nextcategory.modeObj.chooseplayer = this.chooseplayer;
};
