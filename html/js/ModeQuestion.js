/********** ModeQuestion **********/

function ModeQuestion() {}

ModeQuestion.prototype.preload = function() {
  if (this.options.questionnumber == 1) {
    this.JingleQuestion = new YDKJResource('Category/JingleQuestion1'); // Charger les bonnes ressources en fonction du n° de la question
    this.BGQuestion = new YDKJResource('Category/BGQuestion1');
  }
  if (this.options.questionnumber == 2) {
    this.JingleQuestion = new YDKJResource('Category/JingleQuestion2');
    this.BGQuestion = new YDKJResource('Category/BGQuestion2');
  }
  if (this.options.questionnumber >= 3) {
    this.JingleQuestion = new YDKJResource('Category/JingleQuestion3');
    this.BGQuestion = new YDKJResource('Category/BGQuestion3');
  }

  this.value = 2000;

  this.AnnounceCategory = new YDKJResource('Question/AnnounceCategory');
  this.AnnounceValue = new YDKJResource('Question/AnnounceValue'+this.value+'F');
  this.VoiceAnnounceValue = new YDKJResource('Question/VoiceAnnounceValue'+this.value+'F');
  this.HideValue = new YDKJResource('Question/HideValue2000F');
  this.TimerComesIn = new YDKJResource('Question/TimerComesIn');
  this.PrepareTimer = new YDKJResource('Question/PrepareTimer');
  this.SFXShowQuestion = new YDKJResource('Question/SFXShowQuestion');
  this.JingleReadQuestion = new YDKJResource('Question/JingleReadQuestion');
  this.JingleTimer = new YDKJResource('Question/JingleTimer');
  this.TimeOut = new YDKJResource('Question/TimeOut');
  this.SFXTimeOut = new YDKJResource('Question/SFXTimeOut');
  this.SFXPlayerBuzz = new YDKJResource('Question/SFXPlayerBuzz');
  this.SFXPlayerKey = new YDKJResource('Question/SFXPlayerKey');
  this.SFXPlayerWrong1 = new YDKJResource('Question/SFXPlayerWrong1'); // On efface la réponse
  this.SFXPlayerWrong2 = new YDKJResource('Question/SFXPlayerWrong2'); // On fait tomber le joueur
  this.SFXPlayerCorrect = new YDKJResource('Question/SFXPlayerCorrect');
  this.SFXRevealAnswer = new YDKJResource('Question/SFXRevealAnswer');
  this.DefaultRevealAnswer = new YDKJResource('Question/DefaultRevealAnswer');
  this.DefaultRevealLastAnswer = new YDKJResource('Question/DefaultRevealLastAnswer');

  this.ShowPlayer1Key = new YDKJResource('Question/ShowPlayer1Key');
  this.Player1Answer = new YDKJResource('Question/Player1Answer');
  this.Player1AnswerLoop = new YDKJResource('Question/Player1AnswerLoop');
  this.PlayerBuzzedPlayer1 = new YDKJResource('Question/PlayerBuzzedPlayer1');
  this.Player1Correct = new YDKJResource('Question/Player1Correct');
  this.Player1Wrong = new YDKJResource('Question/Player1Wrong');
  this.Player1Cancel = new YDKJResource('Question/Player1Cancel');

  this.ShowPlayer2Key = new YDKJResource('Question/ShowPlayer2Key');
  this.Player2Answer = new YDKJResource('Question/Player2Answer');
  this.Player2AnswerLoop = new YDKJResource('Question/Player2AnswerLoop');
  this.PlayerBuzzedPlayer2 = new YDKJResource('Question/PlayerBuzzedPlayer2');
  this.Player2Correct = new YDKJResource('Question/Player2Correct');
  this.Player2Wrong = new YDKJResource('Question/Player2Wrong');
  this.Player2Cancel = new YDKJResource('Question/Player2Cancel');

  this.ShowPlayer3Key = new YDKJResource('Question/ShowPlayer3Key');
  this.Player3Answer = new YDKJResource('Question/Player3Answer');
  this.Player3AnswerLoop = new YDKJResource('Question/Player3AnswerLoop');
  this.PlayerBuzzedPlayer3 = new YDKJResource('Question/PlayerBuzzedPlayer3');
  this.Player3Correct = new YDKJResource('Question/Player3Correct');
  this.Player3Wrong = new YDKJResource('Question/Player3Wrong');
  this.Player3Cancel = new YDKJResource('Question/Player3Cancel');

  this.NumberAnswer1 = new YDKJResource('Question/NumberAnswer1');
  this.NumberAnswer2 = new YDKJResource('Question/NumberAnswer2');
  this.NumberAnswer3 = new YDKJResource('Question/NumberAnswer3');
  this.NumberAnswer4 = new YDKJResource('Question/NumberAnswer4');
  this.LoopAnswer1 = new YDKJResource('Question/LoopAnswer1');
  this.LoopAnswer2 = new YDKJResource('Question/LoopAnswer2');
  this.LoopAnswer3 = new YDKJResource('Question/LoopAnswer3');
  this.LoopAnswer4 = new YDKJResource('Question/LoopAnswer4');
  this.CorrectAnswer1 = new YDKJResource('Question/CorrectAnswer1');
  this.CorrectAnswer2 = new YDKJResource('Question/CorrectAnswer2');
  this.CorrectAnswer3 = new YDKJResource('Question/CorrectAnswer3');
  this.CorrectAnswer4 = new YDKJResource('Question/CorrectAnswer4');
  this.WrongAnswer1 = new YDKJResource('Question/WrongAnswer1');
  this.WrongAnswer2 = new YDKJResource('Question/WrongAnswer2');
  this.WrongAnswer3 = new YDKJResource('Question/WrongAnswer3');
  this.WrongAnswer4 = new YDKJResource('Question/WrongAnswer4');

  this.LastPlayer1 = new YDKJResource('Question/LastPlayer1');
	this.LastPlayer2 = new YDKJResource('Question/LastPlayer2');
	this.LastPlayer3 = new YDKJResource('Question/LastPlayer3');
	this.LastPlayers12 = new YDKJResource('Question/LastPlayers12');
	this.LastPlayers13 = new YDKJResource('Question/LastPlayers13');
	this.LastPlayers23 = new YDKJResource('Question/LastPlayers23');

  this.strjs = getYDKJFile('js','res/'+this.options.res+'/STR.js');
  this.correctanswer = this.options.correctanswer;

  this.QuestionTitle = new YDKJAnimation('','','res/'+this.options.res+'/snd/1');
  this.PreQuestion = new YDKJAnimation('','','res/'+this.options.res+'/snd/2');
  this.Question = new YDKJAnimation('','','res/'+this.options.res+'/snd/3');
  this.Answers = new YDKJAnimation('','','res/'+this.options.res+'/snd/5');
  this.EndQuestion = new YDKJAnimation('','','res/'+this.options.res+'/snd/6');
  this.Answer1 = new YDKJAnimation('','','res/'+this.options.res+'/snd/7');
  this.Answer2 = new YDKJAnimation('','','res/'+this.options.res+'/snd/8');
  this.Answer3 = new YDKJAnimation('','','res/'+this.options.res+'/snd/9');
  this.Answer4 = new YDKJAnimation('','','res/'+this.options.res+'/snd/10');
  this.RevealAnswer = new YDKJAnimation('','','res/'+this.options.res+'/snd/11');
};

ModeQuestion.prototype.start = function() {
  var thisMode = this;

  var nextcategory = 0;

  this.EndQuestion.ended(function(){
    nextcategory.modeObj.MusicChooseCategoryStart.delay(function(){
      nextcategory.start();
    },200);
  });

  this.SFXPlayerCorrect.ended(function(){
    thisMode.availPlayers[thisMode.currentPlayer].css({'color':'#0F0'});
    this.delay(function(){
      nextcategory.modeObj.chooseplayer = thisMode.currentPlayer; // On donne le choix au joueur qui a bien répondu
      nextcategory.modeObj.MusicChooseCategoryStart.play();
      this.delay(function(){
        thisMode.EndQuestion.play();
      },300);
    },300);
  });

  this.SFXRevealAnswer.ended(function(){
    this.delay(function(){
      var answer;
      if (thisMode.correctanswer == 1) answer = thisMode.Answer1;
      if (thisMode.correctanswer == 2) answer = thisMode.Answer2;
      if (thisMode.correctanswer == 3) answer = thisMode.Answer3;
      if (thisMode.correctanswer == 4) answer = thisMode.Answer4;
      answer.ended(function(){
        thisMode.SFXRevealAnswer.delay(function(){
          thisMode.EndQuestion.play();
        },200);
      });
      this.delay(function(){
        answer.play();
      },200);
      nextcategory.modeObj.MusicChooseCategoryStart.play();
    },300);
  });

  var gameover = function() {
    // Plus aucun joueur ne peut jouer (timer ou tous les joueurs ont participé)
    unbindKeyListener(thisMode.listener);

    var revealAnswer;
    var nbAns = 0;
    for(var i=1;i<=4;i++) if (thisMode.availAnswers[i]) nbAns++;
    if (nbAns == 1) revealAnswer = thisMode.DefaultRevealLastAnswer;
    else revealAnswer = thisMode.DefaultRevealAnswer;

    revealAnswer.ended(function() {
      this.delay(function(){
        thisMode.NumberAnswer1.free();
        thisMode.NumberAnswer2.free();
        thisMode.NumberAnswer3.free();
        thisMode.NumberAnswer4.free();
        jQuery('#screen .markedAsRemoved').remove();
        for(var i=1;i<=4;i++) if (thisMode.availAnswers[i]) thisMode.availAnswers[i].remove();

    		var div = jQuery('<div />').css({ // Réponse
    			'position':'absolute',
    			'height':'120px',
    			'line-height':'120px',
    			'left':'50px',
    			'top':'220px'
    		}).appendTo('#screen');

        jQuery('<div />').css({
          'position':'relative',
    			'vertical-align':'middle',
  				'display':'inline-block',
          'font-family':'JackRoman',
          'color':'#FC0',
          'text-align':'center',
          'width':'540px',
          'font-size':'44px',
          'line-height':'44px'
        }).html(getSTRfromID(thisMode.STR,thisMode.correctanswer+2)).appendTo(div);

        thisMode.SFXRevealAnswer.play();
      },300);
    });

    revealAnswer.play();
  };

  this.SFXPlayerWrong2.ended(function(){
    thisMode.JingleTimer.delay(function(){
      thisMode.availPlayers[thisMode.currentPlayer].css({'color':'#F00'});
      thisMode.availPlayers[thisMode.currentPlayer] = 0;
      if (thisMode.currentAns > 0) thisMode.availAnswers[thisMode.currentAns] = 0;
      thisMode.currentPlayer = 0;
      thisMode.currentAns = 0;

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
        gameover();
      }

      if (thisMode.LastPlayers)  {
        this.play();
        thisMode.LastPlayers.play();
      }
    },200);
  });

  var wrong1 = function(){
    thisMode.SFXPlayerWrong2.delay(function() {
      var currentPlayer = thisMode.currentPlayer;
      thisMode.game.players[currentPlayer-1].score -= thisMode.value;
      thisMode.availPlayers[currentPlayer].find('.score').html(thisMode.game.players[currentPlayer-1].score+' F');

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

      PlayerWrong.ended(function(){
        if (thisMode.availPlayers[currentPlayer]) thisMode.availPlayers[currentPlayer].css({'color':'#F00'});
      });

      PlayerWrong.play();
      PlayerAnswerLoop.free();
      this.play();
    },100);
  };

  this.WrongAnswer1.ended(wrong1);
  this.WrongAnswer2.ended(wrong1);
  this.WrongAnswer3.ended(wrong1);
  this.WrongAnswer4.ended(wrong1);
  this.TimeOut.ended(wrong1);

  this.SFXTimeOut.ended(function(){
    this.delay(function(){
      if (thisMode.currentPlayer) {
        thisMode.TimeOut.play();
      } else {
        gameover();
      }
    },500);
  });

  this.JingleTimer.ended(function(){
    this.delay(function(){
      thisMode.currentAns = -1;
      thisMode.SFXTimeOut.play();
    },200);
  });

  var checkAnswer = function(){
    if (thisMode.currentPlayer == 0) return true;
    if (thisMode.currentAns != thisMode.correctanswer) { // Mauvaise réponse
      switch(thisMode.currentAns){
        case 1:
          thisMode.WrongAnswer1.play();
          thisMode.LoopAnswer1.free();
        break;
        case 2:
          thisMode.WrongAnswer2.play();
          thisMode.LoopAnswer2.free();
        break;
        case 3:
          thisMode.WrongAnswer3.play();
          thisMode.LoopAnswer3.free();
        break;
        case 4:
          thisMode.WrongAnswer4.play();
          thisMode.LoopAnswer4.free();
        break;
      }
      animTransform(thisMode.availAnswers[thisMode.currentAns],1,0,1,1,0.18,thisMode.availAnswers[thisMode.currentAns].width(),0);
      thisMode.SFXPlayerWrong1.play();
    } else { // Bonne réponse
      switch(thisMode.currentAns){
        case 1:
          thisMode.CorrectAnswer1.play();
          thisMode.LoopAnswer1.free();
        break;
        case 2:
          thisMode.CorrectAnswer2.play();
          thisMode.LoopAnswer2.free();
        break;
        case 3:
          thisMode.CorrectAnswer3.play();
          thisMode.LoopAnswer3.free();
        break;
        case 4:
          thisMode.CorrectAnswer4.play();
          thisMode.LoopAnswer4.free();
        break;
      }
      switch (thisMode.currentPlayer) {
        case 1:
          thisMode.Player1Correct.play();
          thisMode.Player1AnswerLoop.free();
        break;
        case 2:
          thisMode.Player2Correct.play();
          thisMode.Player2AnswerLoop.free();
        break;
        case 3:
          thisMode.Player3Correct.play();
          thisMode.Player3AnswerLoop.free();
        break;
      }

      thisMode.game.players[thisMode.currentPlayer-1].score += thisMode.value;
      thisMode.availPlayers[thisMode.currentPlayer].find('.score').html(thisMode.game.players[thisMode.currentPlayer-1].score+' F');

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
    thisMode.Player1AnswerLoop.play();
    this.free();
  });
  this.Player2Answer.ended(function(){
    thisMode.Player2AnswerLoop.play();
    this.free();
  });
  this.Player3Answer.ended(function(){
    thisMode.Player3AnswerLoop.play();
    this.free();
  });

  this.SFXPlayerBuzz.ended(function(){
    this.delay(function(){
      // Remise du compteur à 10
      thisMode.JingleTimer.play();

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
    },150);
  });

  this.Answers.ended(function(){
    this.free();
    thisMode.JingleReadQuestion.delay(function(){
      thisMode.JingleReadQuestion.free();
      thisMode.JingleTimer.play();
    },100);
  });

  this.Question.ended(function(){
    this.free();
    thisMode.JingleReadQuestion.delay(function(){
      thisMode.Answers.play();
    },100);
  });

  thisMode.PrepareTimer.ended(function(){
    this.delay(function(){
      thisMode.NumberAnswer1.play();
      thisMode.NumberAnswer2.play();
      thisMode.NumberAnswer3.play();
      thisMode.NumberAnswer4.play();

      var div1 = jQuery('<div />').css({ // Réponse 1
  			'position':'absolute',
  			'left':'138px',
  			'top':'223px',
  			'width':'500px'
  		}).appendTo('#screen');
      var ans1 = jQuery('<div />').css({
  			'position':'absolute',
  			'left':'150px',
  			'font-size':'26px',
  			'color':'#FC0',
  			'font-family':'JackCondensed',
				'-webkit-transform':'scale(1.0, 0.0)',
    		'-moz-transform':'scale(1.0, 0.0)',
    		'-ms-transform':'scale(1.0, 0.0)',
    		'-o-transform':'scale(1.0, 0.0)',
    		'transform':'scale(1.0, 0.0)'
  		}).html(getSTRfromID(thisMode.STR,3)).appendTo(div1);
      animTransform(ans1,1,1,0,1,0.10,0,26);

      var div2 = jQuery('<div />').css({ // Réponse 2
  			'position':'absolute',
  			'left':'138px',
  			'top':'255px',
  			'width':'500px'
  		}).appendTo('#screen');
      var ans2 = jQuery('<div />').css({
  			'position':'absolute',
  			'left':'150px',
  			'font-size':'26px',
  			'color':'#FC0',
  			'font-family':'JackCondensed',
				'-webkit-transform':'scale(1.0, 0.0)',
    		'-moz-transform':'scale(1.0, 0.0)',
    		'-ms-transform':'scale(1.0, 0.0)',
    		'-o-transform':'scale(1.0, 0.0)',
    		'transform':'scale(1.0, 0.0)'
  		}).html(getSTRfromID(thisMode.STR,4)).appendTo(div2);
      animTransform(ans2,1,1,0,1,0.10,0,26);

      var div3 = jQuery('<div />').css({ // Réponse 3
  			'position':'absolute',
  			'left':'138px',
  			'top':'286px',
  			'width':'500px'
  		}).appendTo('#screen');
      var ans3 = jQuery('<div />').css({
  			'position':'absolute',
  			'left':'150px',
  			'font-size':'26px',
  			'color':'#FC0',
  			'font-family':'JackCondensed',
				'-webkit-transform':'scale(1.0, 0.0)',
    		'-moz-transform':'scale(1.0, 0.0)',
    		'-ms-transform':'scale(1.0, 0.0)',
    		'-o-transform':'scale(1.0, 0.0)',
    		'transform':'scale(1.0, 0.0)'
  		}).html(getSTRfromID(thisMode.STR,5)).appendTo(div3);
      animTransform(ans3,1,1,0,1,0.10,0,26);

      var div4 = jQuery('<div />').css({ // Réponse 4
  			'position':'absolute',
  			'left':'138px',
  			'top':'318px',
  			'width':'500px'
  		}).appendTo('#screen');
      var ans4 = jQuery('<div />').css({
  			'position':'absolute',
  			'left':'150px',
  			'font-size':'26px',
  			'color':'#FC0',
  			'font-family':'JackCondensed',
				'-webkit-transform':'scale(1.0, 0.0)',
    		'-moz-transform':'scale(1.0, 0.0)',
    		'-ms-transform':'scale(1.0, 0.0)',
    		'-o-transform':'scale(1.0, 0.0)',
    		'transform':'scale(1.0, 0.0)'
  		}).html(getSTRfromID(thisMode.STR,6)).appendTo(div4);
      animTransform(ans4,1,1,0,1,0.10,0,26);

      thisMode.availAnswers = [];
      thisMode.availAnswers[1] = ans1;
      thisMode.availAnswers[2] = ans2;
      thisMode.availAnswers[3] = ans3;
      thisMode.availAnswers[4] = ans4;

      thisMode.currentPlayer = 0;
      thisMode.currentAns = 0;
      thisMode.listener = bindKeyListener(function(choice) {
        if (thisMode.currentPlayer == 0) {
          if (choice == 113) thisMode.currentPlayer = 1; // Joueur 1
          if (choice == 98) thisMode.currentPlayer = 2; // Joueur 2
          if (choice == 112) thisMode.currentPlayer = 3; // Joueur 3
          if (!thisMode.availPlayers[thisMode.currentPlayer]) thisMode.currentPlayer = 0;

          // Si réponses 1 à 4 : 1 seul joueur = réponse directe, 2 ou 3 joueurs : "On appuie d'abord sur la lettre !"

          if (thisMode.currentPlayer) {
            thisMode.Question.free();
            thisMode.Answers.free();
            thisMode.JingleReadQuestion.free();
            if (thisMode.LastPlayers) thisMode.LastPlayers.free();
            thisMode.JingleTimer.stop();
            thisMode.SFXPlayerBuzz.play();
            switch (thisMode.currentPlayer) {
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
            thisMode.SFXPlayerKey.ended(function(){
              this.delay(function(){
                // Pas moyen de faire un "simple" thisMode.SFXPlayerKey.reset(); ça fait bugguer le reste...
                var oldkey = thisMode.SFXPlayerKey;
                thisMode.SFXPlayerKey = new YDKJResource('Question/SFXPlayerKey');
                oldkey.free();
                this.free();
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
              },150);
            });
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
                thisMode.NumberAnswer1.free();
              break;
              case 2:
                thisMode.LoopAnswer2.play();
                thisMode.NumberAnswer2.free();
              break;
              case 3:
                thisMode.LoopAnswer3.play();
                thisMode.NumberAnswer3.free();
              break;
              case 4:
                thisMode.LoopAnswer4.play();
                thisMode.NumberAnswer4.free();
              break;
            }
            thisMode.JingleTimer.stop();
            thisMode.SFXPlayerKey.play();
          }
        }
      });

    },1000);
  });

  this.SFXShowQuestion.ended(function(){
    this.delay(function(){
      thisMode.TimerComesIn.free();
      thisMode.PrepareTimer.play();
    },500);
  });

	this.TimerComesIn.ended(function(){
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
			'-webkit-transform':'scale(0.0, 1.0)',
  		'-moz-transform':'scale(0.0, 1.0)',
  		'-ms-transform':'scale(0.0, 1.0)',
  		'-o-transform':'scale(0.0, 1.0)',
  		'transform':'scale(0.0,1.0)'
		}).html(getSTRfromID(thisMode.STR,1)).appendTo(div);

		div.appendTo('#screen');

		animTransform(titlediv,0,1,1,1,0.15,300,0,function(){
		  thisMode.PreQuestion.ended(function(){
			  this.free();

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
    			'vertical-align':'middle',
  				'display':'inline-block',
    			'font-size':'36px',
    			'line-height':'34px',
    			'color':'#FFF',
    			'font-family':'JackExtraCond',
    			'font-style':'italic',
    			'text-align':'center'
    		}).html(getSTRfromID(thisMode.STR,2));

    		textdiv.appendTo(div);

    		div.appendTo('#screen').animate({'left':'40px'},300,function(){textdiv.css({'font-style':'normal'})});

        thisMode.SFXShowQuestion.play();
        thisMode.JingleReadQuestion.play();
        thisMode.JingleReadQuestion.delay(function() {
          thisMode.Question.play();
        },300);
			});

			thisMode.availPlayers = [];

			thisMode.ShowPlayer1Key.ended(function(){
			  thisMode.availPlayers[1] = thisMode.game.displayPlayer(1).show();
			});
			thisMode.ShowPlayer2Key.ended(function(){
			  thisMode.availPlayers[2] = thisMode.game.displayPlayer(2).show();
			});
			thisMode.ShowPlayer3Key.ended(function(){
			  thisMode.availPlayers[3] = thisMode.game.displayPlayer(3).show();
			});

			thisMode.ShowPlayer1Key.delay(function(){
				this.play();
			        if (thisMode.game.players.length >= 2) thisMode.ShowPlayer2Key.delay(function(){
			            this.play();
			            if (thisMode.game.players.length == 3) thisMode.ShowPlayer3Key.delay(function(){
			                this.play();
                        },100);
			    },100);
			},200);
		});

		var valuediv = jQuery('<div />').css({ // Valeur de la question
			'position':'absolute',
			'text-align':'right',
			'font-size':'20px',
			'color':'#33F',
			'font-family':'JackRoman',
			'right':'-80px',
			'top':'22px'
		}).html(thisMode.value+' F').appendTo('#screen').animate({'right':'20px'}, 500).animate({'right':'15px'}, 200);
	});

	this.VoiceAnnounceValue.ended(function(){
		this.free();
		thisMode.AnnounceValue.free();
		jQuery('#screen #QuestionTitle').css('font-style','italic').delay(100).animate({'left':'-500px'},500,function(){
  		jQuery('#screen #QuestionTitle').remove();
  		thisMode.TimerComesIn.delay(function(){
  			this.play();
  		},300);
		});
		thisMode.HideValue.play();
		thisMode.VoiceAnnounceValue.delay(function(){
		  thisMode.PreQuestion.play();
		},150);
	});

	this.QuestionTitle.ended(function(){
		this.free();
		thisMode.VoiceAnnounceValue.delay(function() {
		  this.play();
		},100);
	});

	this.AnnounceCategory.ended(function(){
		var textsize = 50;
		if (getSTRfromID(thisMode.STR,1).length < 35) textsize = 70;
		if (getSTRfromID(thisMode.STR,1).length < 15) textsize = 120;

		jQuery('<div />').attr('id','QuestionTitle').css({ // Titre de la catégorie
			'color':'#FFF',
			'font-family':'JackExtraCond',
			'text-align':'center',
			'font-size':Math.round(textsize*0.90)+'px',
			'line-height':textsize+'px',
			'position':'absolute',
			'width':'450px',
			'left':'95px',
			'top':Math.round(125+textsize*0.05)+'px',
			'opacity':'0'
		}).html(getSTRfromID(thisMode.STR,1)).appendTo('#screen').animate({
			'top':'125px',
			'font-size':textsize+'px',
			'line-height':Math.round(textsize*1.10)+'px',
			'opacity':'1',
			'display':'none'}
		,250,function(){
		  thisMode.AnnounceValue.delay(function(){
		    this.play();
		  },150);
		});
		thisMode.AnnounceCategory.delay(function(){
		  thisMode.QuestionTitle.play();
		},100);
	});

  this.JingleQuestion.ended(function(){
    thisMode.JingleQuestion.free();
    thisMode.BGQuestion.delay(function(){
      this.play();
      thisMode.AnnounceCategory.play();
    },100);
  });

  jQuery('#screen').css('background-color','#000').html(''); // Je vide manuellement l'écran.
  this.strjs.ready(function(){
  	thisMode.STR = thisMode.strjs.res['STR'];
  	thisMode.JingleQuestion.play();
	});

	nextcategory = new YDKJMode(this.game, 'Category', {category:1,questionnumber:this.options.questionnumber+1});
};
