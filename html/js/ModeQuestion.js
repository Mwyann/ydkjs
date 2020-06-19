/********** ModeQuestion **********/

function ModeQuestion() {}

ModeQuestion.prototype.preload = function(resources) {
    this.animations = new YDKJAnimList(resources);

    this.correctanswer = this.options.correctanswer;

    this.Timer = this.options.timer;
    this.timerTimeout = 0;

    // TODO: AnnounceFreeAnswer (Mc55) n'est pas présent dans la version allemande !
};

ModeQuestion.prototype.start = function() {
    var thisMode = this;
    var anim = this.animations;

    var nextcategoryready = 0;
    var misskeyallowed = -1; // -1 = Les réponses n'ont pas encore étés lues. 0 = Pas de son autorisé. 1 = Son autorisé
    var screwallowed = true; // Vicieuse autorisée ? (sera utile lors de l'implémentation des autres modes de question qui n'autorisent pas la vicieuse)
    var screwer = 0; // Joueur ayant lancé sa vicieuse
    var screwee = 0; // Joueur ayant été vicié
    var gameOver = 0; // Fin de la question

    // fonction qui sélectionne l'animation avec vicieuse ou non
    var IsScrew = function(player) {
        if (screwallowed && (thisMode.game.screwEnabled) && (thisMode.game.players.length > 1) && (thisMode.game.players[player-1].screw) && (player != screwee)) return '.Screw'; else return '';
    };

    if (this.game.players.length >= 2) {
        anim.ended('PlayerMissKey1', 1000, function() {
            misskeyallowed = 1;
        });
    }

    var unregisterPlayerBuzz = function() {
        thisMode.game.api.unregisteraction('playerBuzz');
    };

    var unregisterPlayerAnswer = function() {
        thisMode.game.api.unregisteraction('playerAnswer');
    };

    var unregisterPlayerScrew = function() {
        thisMode.game.api.unregisteraction('playerScrew');
    };

    var playerBuzz = function() {
        if (thisMode.buzzPlayer) {
            clearTimeout(thisMode.timerTimeout);
            thisMode.timerTimeout = 0;
            unregisterPlayerAnswer();
            unregisterPlayerScrew();
            if (thisMode.LastPlayers) anim.free(thisMode.LastPlayers);
            misskeyallowed = 1;
            anim.free('Question')
                .free('Answers')
                .free('JingleReadQuestion')
                .stop('JingleTimer')
                .reset('SFXPlayerBuzz')
                .play('SFXPlayerBuzz')
                .free('Player'+thisMode.buzzPlayer+'ShowKey'+IsScrew(thisMode.buzzPlayer))
                .reset('Player'+thisMode.buzzPlayer+'Loop'+IsScrew(thisMode.buzzPlayer))
                .play('Player'+thisMode.buzzPlayer+'Answer'+IsScrew(thisMode.buzzPlayer));
        }
    };

    var autoAnswerPlayer1 = function() {
        thisMode.currentPlayer = 1;
        clearTimeout(thisMode.timerTimeout);
        thisMode.timerTimeout = 0;
        anim.free('Question')
            .free('Answers')
            .free('JingleReadQuestion')
            .stop('JingleTimer')

            .free('Player1ShowKey')
            .free('Player1Loop')
            .play('Player1Answer');
    };

    var playerAnswer = function() {
        if ((!thisMode.currentPlayer) && (thisMode.game.players.length == 1)) autoAnswerPlayer1();
        if (thisMode.currentAns) {
            clearTimeout(thisMode.timerTimeout);
            thisMode.timerTimeout = 0;
            if (screwee) {
                anim.free('Player'+screwee+'AnswerScrewed');
                if (thisMode.game.players.length == 3) anim.reset('PlayerScrewedSelf');
            }
            anim.reset('Player'+thisMode.currentPlayer+'Buzzed')
                .free('ShowAnswer'+thisMode.currentAns)
                .play('LoopAnswer'+thisMode.currentAns)
                .stop('JingleTimer')
                .play('SFXPlayerKey');
            if ((thisMode.game.players.length > 1) && (thisMode.game.players[thisMode.currentPlayer-1].screw)) {
                (thisMode.game.screwEnabled) && anim.ended('Player'+thisMode.currentPlayer+'AnswerLoop.Screw', function() {
                    this.free();
                    anim.play('Player'+thisMode.currentPlayer+'AnswerEnd.Screw');
                });
            }
        }
    };

    var screwablePlayer = function() { // Joueur qui peut être vissié autre que le joueur courant. Renvoie le numéro du joueur, 0 si aucun joueur ne peut être vissié, -1 s'il y en a deux.
        var player = 0;
        if ((thisMode.currentPlayer != 1) && (thisMode.availPlayers[1])) player = 1;
        if ((thisMode.currentPlayer != 2) && (thisMode.availPlayers[2]))
            if (player == 0) player = 2; else player = -1;
        if ((thisMode.currentPlayer != 3) && (thisMode.availPlayers[3]))
            if (player == 0) player = 3; else player = -1;
        return player;
    };

    var doPlayerScrew = function(tmpscrewee) {
        var screwable = screwablePlayer();
        if (tmpscrewee) screwable = tmpscrewee;
        if (screwable == -1) {
            anim.play('Player'+screwer+'ScrewLoop')
                .click('Player'+screwer+'ScrewLoop',function(){pressKey(firstKeycode(thisMode.game.players[screwer-1].keycode));});
            screwee = -1;
        } else {
            anim.free('Player'+thisMode.currentPlayer+'ScrewWho')
                .free('Player'+screwable+'Loop'+IsScrew(screwable))
                .play('Player'+screwable+'Screwed'+IsScrew(screwable));
            if (thisMode.game.players.length == 3) anim.play('PlayerScrewed');
            if (screwer != screwable) {
                anim.play('Player'+screwer+'Loop');
                (function(screwer2){
                    // Rétablir le clic = buzz pour le joueur qui vient de jouer sa vicieuse (mais sur l'animation sans vicieuse pour le coup)
                    anim.click('Player'+screwer2+'Loop',function(){pressKey(firstKeycode(thisMode.game.players[screwer2-1].keycode));});
                })(screwer);
            }
        }
    };

    var PlayerScrewed = function() {
        thisMode.currentPlayer = screwee;
        PlayerBuzz();

        // Joueur X tu t'es fait vissier
        anim.play('Player'+thisMode.currentPlayer+'AnswerLoopScrewed');
        if (screwer != screwee) anim.play('Player'+thisMode.currentPlayer+'AnswerScrewed');
        else anim.play('PlayerScrewedSelf');
    };

    if ((thisMode.game.screwEnabled) && (thisMode.game.players.length > 1)) {
        if (thisMode.game.players.length == 3) {
            anim.ended('ScrewSounds', 300, function() {
                anim.play('Player'+thisMode.currentPlayer+'ScrewWho');
            });
        }

        anim.ended('ScrewActivate', 100, function() {
            var screwable = screwablePlayer();
            if (screwable == -1) {
                anim.play('ScrewLoop')
                    .reset('ScrewSounds')
                    .play('ScrewSounds');
            } else {
                if (thisMode.game.players.length == 2) anim.play('PlayerScrewed', 500);
            }
        });

        anim.ended('Player1Screw', function() {
            this.free();
            if (thisMode.game.players.length == 3) doPlayerScrew();
        });

        var PlayerScrewedEnd = function(playernum) {
            return function() {
                this.free();
                screwee = playernum;
                PlayerScrewed();
            }
        };

        anim.ended('Player1Screwed', PlayerScrewedEnd(1))
            .ended('Player1Screwed.Screw', PlayerScrewedEnd(1));

        anim.ended('Player2Screw', function() {
            this.free();
            if (thisMode.game.players.length == 3) doPlayerScrew();
        });

        anim.ended('Player2Screwed', PlayerScrewedEnd(2))
            .ended('Player2Screwed.Screw', PlayerScrewedEnd(2));

        if (thisMode.game.players.length == 3) {
            anim.ended('Player3Screw', function() {
                this.free();
                if (thisMode.game.players.length == 3) doPlayerScrew();
            });

            anim.ended('Player3Screwed', PlayerScrewedEnd(3))
                .ended('Player3Screwed.Screw', PlayerScrewedEnd(3));
        }
    }
    var playerScrew = function() {
        anim.reset('Player'+thisMode.currentPlayer+'Buzzed')
            .stop('JingleTimer')
            .reset('ScrewActivate')
            .play('ScrewActivate')
            .free('Player'+thisMode.currentPlayer+'AnswerLoop.Screw')
            .play('Player'+thisMode.currentPlayer+'Screw');
        thisMode.game.players[thisMode.currentPlayer-1].screw = 0;
        if (thisMode.game.players.length == 2) doPlayerScrew(); // En mode 2 joueurs, on joue immédiatement l'animation de vissieuse
        clearTimeout(thisMode.timerTimeout);
        thisMode.timerTimeout = 0;
    };

    var registerPlayerBuzz = function() {
        thisMode.game.api.registeraction('playerBuzz', function(data){
            if (!data.selfpost) {
                thisMode.buzzPlayer = parseInt(data.value);
                playerBuzz();
            }
        });
    };

    var registerPlayerAnswer = function() {
        thisMode.game.api.registeraction('playerAnswer', function(data){
            if (!data.selfpost) {
                thisMode.currentAns = parseInt(data.value);
                playerAnswer();
            }
        });
    };

    var playerScrewChoosed = function(tmspcrewee) {
        anim.free('Player'+screwer+'AnswerLoop')
            .free('Player'+screwer+'ScrewLoop')
            .reset('ScrewLoop');
        doPlayerScrew(tmspcrewee);
    };

    var registerPlayerScrew = function() {
        thisMode.game.api.registeraction('playerScrew', function(data){
            if (!data.selfpost) {
                var val = parseInt(data.value);
                if (val == 0) {
                    screwer = thisMode.currentPlayer;
                    playerScrew();
                } else playerScrewChoosed(val); // screwee
            }
        });
    };

    var registerPlayerBuzzIgnore = function() { // Fonction qui ne fait rien, pour ignorer les appuis suivants TODO rendre ce genre de trucs plus propre
        thisMode.game.api.registeraction('playerBuzz', function(data){
            registerPlayerBuzzIgnore();
        });
    };

    var registerPlayerAnswerIgnore = function() { // Fonction qui ne fait rien, pour ignorer les appuis suivants TODO rendre ce genre de trucs plus propre
        thisMode.game.api.registeraction('playerAnswer', function(data){
            registerPlayerAnswerIgnore();
        });
    };

    var registerPlayerScrewIgnore = function() { // Fonction qui ne fait rien, pour ignorer les appuis suivants TODO rendre ce genre de trucs plus propre
        thisMode.game.api.registeraction('playerScrew', function(data){
            registerPlayerScrewIgnore();
        });
    };

    var pressKey = function(choice) {
        if (!choice) return false; // Si on se voit envoyer 0 à cause d'un clic sur un joueur à keycode 0
        if ((screwer != 0) && (screwee <= 0)) { // Vicieuse en cours de viciage
            if (screwee == 0) return false; // Pas encore de choix disponible
            var tmpscrewee = 0;
            if ((choice == 49) || (findKeycode(choice, thisMode.game.players[0].keycode))) tmpscrewee = 1;
            if ((choice == 50) || (findKeycode(choice, thisMode.game.players[1].keycode))) tmpscrewee = 2;
            if ((choice == 51) || (findKeycode(choice, thisMode.game.players[2].keycode))) tmpscrewee = 3;
            if (!thisMode.availPlayers[tmpscrewee]) tmpscrewee = 0;
            if (tmpscrewee > 0) {
                thisMode.game.api.postaction({action: 'playerScrew', value: tmpscrewee});
                playerScrewChoosed(tmpscrewee);
            }
        } else if (thisMode.currentPlayer == 0) {
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
                playerBuzz();
            } else {
                if ((choice >= 49) && (choice <= 52)) { // Si réponses 1 à 4 : 1 seul joueur = réponse directe, 2 ou 3 joueurs : "On appuie d'abord sur la lettre !"
                    if (thisMode.game.players.length == 1) {
                        if (!hasKeycode(thisMode.game.players[0].keycode)) return false; // Ce joueur ne peut pas répondre
                        autoAnswerPlayer1();
                        pressKey(choice);
                    } else if (misskeyallowed != 0) {
                        // Il faudrait arrêter les LastPlayer ici ?
                        if (misskeyallowed == -1) gameReady();
                        if (!anim.get('PlayerMissKey1').played) anim.play('PlayerMissKey1'); else if (!anim.get('PlayerMissKey2').played) anim.play('PlayerMissKey2');
                        misskeyallowed = 0;
                    }
                }
                if ((thisMode.game.players.length > 1) && (misskeyallowed) && (findKeycode(choice, thisMode.game.screwKeycodes))) { // vicieuse
                    // Il faudrait arrêter les LastPlayer ici ?
                    if (!anim.get('PlayerMissKey1').played) anim.play('PlayerMissKey1'); else if (!anim.get('PlayerMissKey2').played) anim.play('PlayerMissKey2');
                    misskeyallowed = 0;
                }
            }
        } else if (thisMode.currentAns == 0) { // Réponse d'un joueur
            if (!hasKeycode(thisMode.game.players[thisMode.currentPlayer-1].keycode)) return false; // Ce joueur ne peut pas répondre
            if (screwallowed && (thisMode.game.screwEnabled) && (findKeycode(choice, thisMode.game.screwKeycodes))) { // vicieuse
                if (thisMode.game.players[thisMode.currentPlayer-1].screw) {
                    if (screwablePlayer() != 0) { // Si il reste au moins un autre joueur à vissier
                        screwer = thisMode.currentPlayer;
                        thisMode.game.api.postaction({action: 'playerScrew', value: 0});
                        playerScrew();
                    }
                }
                return true;
            }
            if (choice == 49) thisMode.currentAns = 1;
            if (choice == 50) thisMode.currentAns = 2;
            if (choice == 51) thisMode.currentAns = 3;
            if (choice == 52) thisMode.currentAns = 4;
            if ((thisMode.currentAns) && (!thisMode.availAnswers[thisMode.currentAns])) thisMode.currentAns = 0;
            if (thisMode.currentAns) {
                thisMode.game.api.postaction({action: 'playerAnswer', value: thisMode.currentAns});
                playerAnswer();
            }
        }
    };

    var screwerLost = false; // Sera renseigné si le vissieur a perdu son "pari"

    anim.ended('EndQuestion', function() {
        if (thisMode.timerTimeout) clearTimeout(thisMode.timerTimeout);

        var goNextCat = function() {
            nextcategoryready(function(nextcategory) {
                nextcategory.modeObj.animations.delay('MusicChooseCategoryStart', Math.max(500,2500-anim.length('EndQuestion')), function() {
                    nextcategory.start();
                });
            });
        };

        // Ici, si le joueur a été vissié (sauf si vissié lui-même), il faut faire "perdre" le vissieur
        if (screwerLost) {
            var voiceLost = 'Player'+screwerLost+'ScrewLost';
            var animLost = 'Player'+screwerLost+'Wrong';

            anim.play(voiceLost, 200)
                .ended(voiceLost, 200, function() {
                    thisMode.game.players[screwerLost-1].score = parseInt(thisMode.game.players[screwerLost-1].score) - parseInt(thisMode.options.value);
                    thisMode.game.font.strings[10*screwerLost+105] = thisMode.game.displayCurrency(thisMode.game.players[screwerLost-1].score);

                    anim.ended('SFXPlayerLose',false)
                        .free('Player'+screwerLost+'Loop')
                        .reset('SFXPlayerLose')
                        .play('SFXPlayerLose')
                        .ended(animLost, 500, function() {
                            goNextCat();
                        })
                        .play(animLost);
                });
        } else goNextCat();
    });

    anim.ended('SFXPlayerCorrect', function() {
        this.delay(300, function() {
            nextcategoryready(function(nextcategory) {
                nextcategory.modeObj.chooseplayer = thisMode.currentPlayer; // On donne le choix au joueur qui a bien répondu
                nextcategory.modeObj.animations.play('MusicChooseCategoryStart');
                anim.play('EndQuestion', 300);
            });
        });
    });

    anim.ended('RevealAnswer', 300, function() {
        if (thisMode.options.correctanswerisdefault) {
            anim.play('EndQuestion', 200);
        } else {
            anim.ended('Answer'+thisMode.correctanswer, 200,function () {
                anim.play('EndQuestion');
            });
            this.delay(200,function() {
                anim.play('Answer'+thisMode.correctanswer);
            });
        }
        nextcategoryready(function(nextcategory) {
            nextcategory.modeObj.animations.play('MusicChooseCategoryStart');
        });
    });

    var gameover = function() {
        // Plus aucun joueur ne peut jouer (timer ou tous les joueurs ont participé)
        pressKey = function(choice){};
        unbindKeyListener(thisMode.listener);
        registerPlayerBuzzIgnore();
        registerPlayerAnswerIgnore();
        registerPlayerScrewIgnore();
        gameOver = 1;

        var revealAnswer;
        var nbAns = 0;
        for(var i=1;i<=4;i++) if (thisMode.availAnswers[i]) nbAns++;
        if (nbAns == 1) revealAnswer = 'DefaultRevealLastAnswer'; // Plus qu'une réponse dispo (la bonne...)
        else revealAnswer = 'AboutToRevealAnswer';

        anim.ended(revealAnswer, 300, function() {
            anim.free('ShowAnswer1')
                .free('ShowAnswer2')
                .free('ShowAnswer3')
                .free('ShowAnswer4');
            thisMode.game.html.screen.find('.markedAsRemoved').remove();
            anim.play('RevealAnswer');
        }).play(revealAnswer);
    };

    var timerRunning = function() {
        thisMode.Timer.playTimer();
        thisMode.timerTimeout = setTimeout(timerRunning,(anim.length('JingleTimer')-800)/10); // Proportionnel à la durée du jingle !
    };

    anim.ended('SFXPlayerLose', 200, function() {
        registerPlayerBuzzIgnore();
        thisMode.game.api.synchronize(function() {
            thisMode.currentPlayer = 0;
            thisMode.currentAns = 0;

            if (thisMode.LastPlayers) {
                // Remise du compteur à 10
                thisMode.Timer.playTimer(10);
                anim.reset('JingleTimer')
                    .play('JingleTimer')
                    .play(thisMode.LastPlayers);
                if (thisMode.availPlayers[1]) anim.reset('Player1Loop'+IsScrew(1)).play('Player1Loop'+IsScrew(1));
                if (thisMode.availPlayers[2]) anim.delay('Player2Loop'+IsScrew(2), 100, function() {this.reset(); this.play();});
                if (thisMode.availPlayers[3]) anim.delay('Player3Loop'+IsScrew(3), 200, function() {this.reset(); this.play();});
                thisMode.timerTimeout = setTimeout(timerRunning, 500);
                unregisterPlayerAnswer();
                unregisterPlayerScrew();
                registerPlayerBuzz();
            } else gameover();
        });
    });

    var wrong1 = function() {
        anim.delay('SFXPlayerLose', 100, function() {
            thisMode.game.players[thisMode.currentPlayer-1].score = parseInt(thisMode.game.players[thisMode.currentPlayer-1].score) - parseInt(thisMode.options.value);
            thisMode.game.font.strings[10*thisMode.currentPlayer+105] = thisMode.game.displayCurrency(thisMode.game.players[thisMode.currentPlayer-1].score);

            thisMode.availPlayers[thisMode.currentPlayer] = 0;
            if (thisMode.currentAns > 0) thisMode.availAnswers[thisMode.currentAns] = 0;
            if (thisMode.availPlayers[1]) {
                if (thisMode.availPlayers[2]) thisMode.LastPlayers = 'LastPlayers12';
                else if (thisMode.availPlayers[3]) thisMode.LastPlayers = 'LastPlayers13';
                else thisMode.LastPlayers = 'LastPlayer1';
            } else if (thisMode.availPlayers[2]) {
                if (thisMode.availPlayers[3]) thisMode.LastPlayers = 'LastPlayers23';
                else thisMode.LastPlayers = 'LastPlayer2';
            } else if (thisMode.availPlayers[3]) {
                thisMode.LastPlayers = 'LastPlayer3';
            } else {
                // Plus aucun joueur
                thisMode.LastPlayers = 0;
            }

            var animwrong;
            if (thisMode.currentPlayer == screwee)
                animwrong = 'Player'+thisMode.currentPlayer+'WrongScrewed';
            else
                animwrong = 'Player'+thisMode.currentPlayer+'Wrong'+IsScrew(thisMode.currentPlayer);

            if (thisMode.LastPlayers) { // S'il reste des joueurs, on relance le timer
                anim.ended(animwrong, -400, function() {
                    anim.reset('TimerTimeOut');
                    thisMode.Timer.playTimer(10);
                });
            }

            anim.free('Player'+thisMode.currentPlayer+'AnswerLoop'+IsScrew(thisMode.currentPlayer))
                .free('Player'+thisMode.currentPlayer+'AnswerEnd.Screw')
                .free('Player'+thisMode.currentPlayer+'AnswerLoopScrewed')
                .play(animwrong);
            this.reset();
            this.play();
            screwer = 0;
            screwee = 0;
        });
    };

    anim.ended('TimeOut1', wrong1)
        .ended('TimeOut2', wrong1)
        .ended('TimeOut3', wrong1);

    anim.ended('TimerTimeOut', 500, function() {
        if (thisMode.currentPlayer > 0) { // Si un joueur avait buzzé
            anim.play('TimeOut'+thisMode.currentPlayer);
        } else { // Sinon, fin de la question
            gameover();
        }
    });

    anim.ended('JingleTimer', function() {
        clearTimeout(thisMode.timerTimeout);
        thisMode.timerTimeout = 0;
        this.delay(200,function() {
            thisMode.currentAns = -1;
            this.reset();
            thisMode.Timer.reset();
            anim.play('TimerTimeOut');
        });
    });

    var checkAnswer = function() {
        if (thisMode.currentPlayer == 0) return true;
        unregisterPlayerBuzz();
        registerPlayerAnswerIgnore();
        registerPlayerScrewIgnore();
        if (thisMode.currentAns != thisMode.correctanswer) { // Mauvaise réponse
            anim.free('LoopAnswer'+thisMode.currentAns)
                .play('WrongAnswer'+thisMode.currentAns)
                .delay('WrongAnswer'+thisMode.currentAns, 400, function(){wrong1()});
        } else { // Bonne réponse
            thisMode.game.players[thisMode.currentPlayer-1].score = parseInt(thisMode.game.players[thisMode.currentPlayer-1].score) + parseInt(thisMode.options.value);
            thisMode.game.font.strings[10*thisMode.currentPlayer+105] = thisMode.game.displayCurrency(thisMode.game.players[thisMode.currentPlayer-1].score);

            unbindKeyListener(thisMode.listener);
            pressKey = function(choice){};

            anim.play('SFXPlayerCorrect')
                .free('LoopAnswer'+thisMode.currentAns)
                .play('CorrectAnswer'+thisMode.currentAns)
                .free('Player'+thisMode.currentPlayer+'AnswerLoop'+IsScrew(thisMode.currentPlayer))
                .free('Player'+thisMode.currentPlayer+'AnswerEnd.Screw')
                .free('Player'+thisMode.currentPlayer+'AnswerLoopScrewed');
            if (thisMode.currentPlayer == screwee) {
                anim.play('Player'+thisMode.currentPlayer+'CorrectScrewed');
                if (screwer != screwee) screwerLost = screwer;
            } else
                anim.play('Player'+thisMode.currentPlayer+'Correct'+IsScrew(thisMode.currentPlayer));
        }
        return true;
    };

    anim.ended('Answer1', checkAnswer)
        .ended('Answer2', checkAnswer)
        .ended('Answer3', checkAnswer)
        .ended('Answer4', checkAnswer);

    anim.ended('Player1Answer', function() {
        this.free();
        anim.play('Player1AnswerLoop');
    });
    if (this.game.players.length >= 2) {
        (thisMode.game.screwEnabled) && anim.ended('Player1Answer.Screw', function() {
            this.free();
            anim.play('Player1AnswerLoop.Screw')
                .click('Player1AnswerLoop.Screw',function(){pressKey(firstKeycode(thisMode.game.screwKeycodes));}); // Clic vicieuse

        });
        anim.ended('Player2Answer', function() {
            this.free();
            anim.play('Player2AnswerLoop');
        });
        (thisMode.game.screwEnabled) && anim.ended('Player2Answer.Screw', function() {
            this.free();
            anim.play('Player2AnswerLoop.Screw')
                .click('Player2AnswerLoop.Screw',function(){pressKey(firstKeycode(thisMode.game.screwKeycodes));}); // Clic vicieuse
        });
    }
    if (this.game.players.length == 3) {
        anim.ended('Player3Answer', function() {
            this.free();
            anim.play('Player3AnswerLoop');
        });
        (thisMode.game.screwEnabled) && anim.ended('Player3Answer.Screw', function() {
            this.free();
            anim.play('Player3AnswerLoop.Screw')
                .click('Player3AnswerLoop.Screw',function(){pressKey(firstKeycode(thisMode.game.screwKeycodes));}); // Clic vicieuse
        });
    }

    var PlayerBuzz = function() {
        // Remise du compteur à 10
        thisMode.Timer.playTimer(10);
        anim.reset('JingleTimer').play('JingleTimer')
            .free('PrepareTimer');
        thisMode.timerTimeout = setTimeout(timerRunning,800);
        registerPlayerBuzzIgnore(); // Déplacé ici car si deux appuis trop rapides venant de l'API, le 2eme appui risque d'être ignoré à cause du return juste au dessus.
        registerPlayerAnswer();
        registerPlayerScrew();
    };

    anim.ended('SFXPlayerBuzz', 150, function() {
        thisMode.currentPlayer = thisMode.buzzPlayer; // Le joueur peut enfin répondre
        thisMode.buzzPlayer = 0;
        PlayerBuzz();

        // Vas-y joueur X
        anim.play('Player'+thisMode.currentPlayer+'Buzzed');
    });

    var gameReady = function() {
        anim.free('Question')
            .free('Answers')
            .delay('JingleReadQuestion', 100, function() {
                anim.free('JingleReadQuestion')
                    .free('PrepareTimer')
                    .play('JingleTimer');
                thisMode.Timer.playTimer(10);
                thisMode.timerTimeout = setTimeout(timerRunning,500);
                misskeyallowed = 1;
        });
    };

    anim.ended('Answers', 100, function() {
        gameReady();
    });

    anim.ended('Question', function() {
        this.free();
        anim.delay('JingleReadQuestion', 100, function() {
            anim.play('Answers');
        });
    });

    anim.ended('SFXPlayerKey', 150, function() {
        this.reset();
        anim.play('Answer'+thisMode.currentAns);
    });

    anim.ended('ShowAnswer1', function() {
        anim.ended('Player1Loop'+IsScrew(1), function() {
                if ((thisMode.buzzPlayer != 0) || (thisMode.currentPlayer != 0) || gameOver) this.stop();
            })
            .free('Player1ShowKey'+IsScrew(1))
            .play('Player1Loop'+IsScrew(1))
            .click('Player1Loop'+IsScrew(1), function(){pressKey(firstKeycode(thisMode.game.players[0].keycode));});
        if (thisMode.game.players.length >= 2) {
            anim.ended('Player2Loop'+IsScrew(2), function() {
                    if ((thisMode.buzzPlayer != 0) || (thisMode.currentPlayer != 0) || gameOver) this.stop();
                })
                .delay('Player2ShowKey'+IsScrew(2), 100, function() {
                    this.free();
                    anim.play('Player2Loop'+IsScrew(2))
                        .click('Player2Loop'+IsScrew(2), function(){pressKey(firstKeycode(thisMode.game.players[1].keycode));});
                });
        }
        if (thisMode.game.players.length == 3) {
            anim.ended('Player3Loop'+IsScrew(3), function() {
                    if ((thisMode.buzzPlayer != 0) || (thisMode.currentPlayer != 0) || gameOver) this.stop();
                })
                .delay('Player3ShowKey'+IsScrew(3), 200, function() {
                    this.free();
                    anim.play('Player3Loop'+IsScrew(3))
                        .click('Player3Loop'+IsScrew(3), function(){pressKey(firstKeycode(thisMode.game.players[2].keycode));});
                });
        }
    });

    anim.ended('PrepareTimer', 100, function() {
        anim.play('ShowAnswer1').click('ShowAnswer1', function(){pressKey(49)})
            .play('ShowAnswer2').click('ShowAnswer2', function(){pressKey(50)})
            .play('ShowAnswer3').click('ShowAnswer3', function(){pressKey(51)})
            .play('ShowAnswer4').click('ShowAnswer4', function(){pressKey(52)});

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
        if (thisMode.game.players.length == 1) registerPlayerAnswer();  // On détecte d'abord une réponse, car si on inverse, on va accepter les deux évènements immédiatement
        registerPlayerBuzz();
    });

    anim.ended('ShowQuestion', 500, function() {
        anim.free('TimerComesIn')
            .play('PrepareTimer');
    });

    anim.ended('ShowHeader', function() {
        anim.ended('PreQuestion', function() {
            this.free();
            thisMode.game.api.synchronize(function() {
                anim.play('ShowQuestion')
                    .play('JingleReadQuestion')
                    .delay('JingleReadQuestion', 300, function () {
                        anim.play('Question');
                    });
            });
        });

        thisMode.availPlayers = [];
        anim.ended('Player1ShowKey'+IsScrew(1), function() {
            thisMode.availPlayers[1] = 1;
        });
        if (thisMode.game.players.length >= 2) {
            anim.ended('Player2ShowKey'+IsScrew(2), function() {
                thisMode.availPlayers[2] = 1;
            });
        }
        if (thisMode.game.players.length == 3) {
            anim.ended('Player3ShowKey'+IsScrew(3), function() {
                thisMode.availPlayers[3] = 1;
            });
        }
        anim.delay('Player1ShowKey'+IsScrew(1), 200, function() {
            this.play();
            if (thisMode.game.players.length >= 2) anim.delay('Player2ShowKey'+IsScrew(2), 90, function() {
                this.play();
                if (thisMode.game.players.length == 3) anim.delay('Player3ShowKey'+IsScrew(3), 90, function() {
                    this.play();
                });
            });
        });
    });

    anim.ended('TimerComesIn', function() {
        anim.play('ShowHeader');
    });

    anim.ended('HideValue', function() {
        this.free();
        thisMode.game.html.screen.find('.markedAsRemoved').remove(); // Evite un glitch visuel où le texte ne disparait pas complètement
        anim.play('TimerComesIn', 300);
    });

    anim.ended('VoiceAnnounceValue', function() {
        this.free();
        anim.free('AnnounceValue')
            .free('ShowCategory')
            .play('HideValue')
            .delay('VoiceAnnounceValue', 150, function() {
                anim.play('PreQuestion');
            });
    });

    anim.ended('QuestionTitle', function() {
        this.free();
        anim.play('VoiceAnnounceValue', 100);
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
    this.game.font.resetTextStyle(1210);
    this.game.font.resetTextStyle(1215);
    this.game.font.strings[1100] = getSTRfromID(this.STR,'STR',1);
    this.game.font.strings[1200] = this.game.font.strings[1100];
    this.game.font.strings[1205] = this.game.displayCurrency(this.options.value);
    this.game.font.strings[1210] = getSTRfromID(this.STR,'STR',2);
    this.game.font.strings[1211] = getSTRfromID(this.STR,'STR',3);
    this.game.font.strings[1212] = getSTRfromID(this.STR,'STR',4);
    this.game.font.strings[1213] = getSTRfromID(this.STR,'STR',5);
    this.game.font.strings[1214] = getSTRfromID(this.STR,'STR',6);
    this.game.font.strings[1215] = this.game.font.strings[1210+parseInt(this.correctanswer)];

    anim.ended('ShowCategory', 150, function() {
        anim.play('AnnounceValue');
    });

    anim.ended('AnnounceCategory', function() {
        this.free();
        anim.play('ShowCategory')
            .play('QuestionTitle', 100);
    });

    anim.ended('JingleQuestion', function() {
        this.free();
        anim.delay('BGQuestion', 100, function() {
            this.play();
            anim.play('AnnounceCategory');
        });
    });

    this.game.html.screen.html(''); // Je vide manuellement l'écran.

    anim.play('JingleQuestion');

    nextcategoryready = this.game.api.gamemode(this); // Préchargement de la prochaine catégorie
};
