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

    this.TimerTimeOut = new YDKJAnimation(resources['Question/TimerTimeOut']);

    this.AboutToRevealAnswer = new YDKJAnimation(resources['Gibberish/AboutToRevealAnswer']);
    this.ShowAnswerTyping = new YDKJAnimation(resources['Gibberish/ShowAnswerTyping']);
    this.ShowAnswerTextFrame = new YDKJAnimation(resources['Gibberish/ShowAnswerTextFrame']);
    this.RevealAnswer = new YDKJAnimation(resources['Gibberish/RevealAnswer']);
    this.SFXShowAnswerAudience = new YDKJAnimation(resources['Gibberish/SFXShowAnswerAudience']);

    this.Player1ShowKey = new YDKJAnimation(resources['Question/Player1ShowKey']);
    this.Player1Answer = new YDKJAnimation(resources['Question/Player1Answer']);
    this.Player1AnswerLoop = new YDKJAnimation(resources['Question/Player1AnswerLoop']);
    this.Player1Buzzed = new YDKJAnimation(resources['Question/Player1Buzzed']);
    this.Player1Correct = new YDKJAnimation(resources['Question/Player1Correct']);
    this.Player1Wrong = new YDKJAnimation(resources['Question/Player1Wrong']);
    this.Player1LostScrew = new YDKJAnimation(resources['Question/Player1LostScrew']);

    if (this.game.players.length >= 2) {
        this.Player2ShowKey = new YDKJAnimation(resources['Question/Player2ShowKey']);
        this.Player2Answer = new YDKJAnimation(resources['Question/Player2Answer']);
        this.Player2AnswerLoop = new YDKJAnimation(resources['Question/Player2AnswerLoop']);
        this.Player2Buzzed = new YDKJAnimation(resources['Question/Player2Buzzed']);
        this.Player2Correct = new YDKJAnimation(resources['Question/Player2Correct']);
        this.Player2Wrong = new YDKJAnimation(resources['Question/Player2Wrong']);
        this.Player2LostScrew = new YDKJAnimation(resources['Question/Player2LostScrew']);
    }

    if (this.game.players.length == 3) {
        this.Player3ShowKey = new YDKJAnimation(resources['Question/Player3ShowKey']);
        this.Player3Answer = new YDKJAnimation(resources['Question/Player3Answer']);
        this.Player3AnswerLoop = new YDKJAnimation(resources['Question/Player3AnswerLoop']);
        this.Player3Buzzed = new YDKJAnimation(resources['Question/Player3Buzzed']);
        this.Player3Correct = new YDKJAnimation(resources['Question/Player3Correct']);
        this.Player3Wrong = new YDKJAnimation(resources['Question/Player3Wrong']);
        this.Player3LostScrew = new YDKJAnimation(resources['Question/Player3LostScrew']);
    }

};

ModeGibberish.prototype.start = function() {
    var thisMode = this;

    /*var nextcategoryready;

    var jumpToNextCategory = function() {
        nextcategoryready(function(nextcategory){
            nextcategory.modeObj.chooseplayer = thisMode.chooseplayer;
            nextcategory.modeObj.MusicChooseCategoryLoop.free();
            nextcategory.modeObj.MusicChooseCategoryLoop = thisMode.MusicLoopRules1;
            thisMode.MusicLoopRules1 = false; // Pour ne pas être détruite au passage à la catégorie suivante
            nextcategory.start();
        });
    };*/

    thisMode.QuestionHint31.ended(300,function() {
        this.free();
        thisMode.QuestionHint32.play();
    });

    thisMode.QuestionHint21.ended(300,function() {
        this.free();
        thisMode.QuestionHint22.play();
    });

    thisMode.QuestionHint11.ended(300,function() {
        this.free();
        thisMode.QuestionHint12.play();
    });

    var currentpos = 0;
    var decreasing = Math.round(thisMode.options.value/40);
    var timerInterval;
    var runTimer = function() {
        currentpos++;
        if (currentpos % 2 == 0) thisMode.game.font.strings[1305] = thisMode.game.displayCurrency(thisMode.options.value-currentpos*decreasing);
        thisMode.ShowPrice.reset();
        thisMode.ShowPrice.play();
        if (currentpos == 9) { // Premier indice
            thisMode.ShowHint1.play();
            thisMode.QuestionHint11.play();
        }
        if (currentpos == 18) { // Deuxième indice
            thisMode.ShowHint2.play();
            thisMode.QuestionHint21.play();
        }
        if (currentpos == 27) { // Troisième indice
            thisMode.ShowHint3.play();
            thisMode.QuestionHint31.play();
        }
        if (currentpos == 40) { // Fin du temps !
            clearInterval(timerInterval);
            thisMode.MusicPart1.free();
            thisMode.MusicPart2.free();
            thisMode.MusicPart3.free();
            thisMode.TimerDance.free();
            thisMode.TimerTimeOut.play();
            thisMode.TimerStop.play();
        }
    };

    this.QuestionIntro2.ended(100,function() {
        this.free();
        thisMode.QuestionIntro3.play();
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
        timerInterval = setInterval(runTimer,750);
    });

    this.QuestionIntro1.ended(100,function() {
        this.free();
        thisMode.ShowQuestion.play();
    });

    this.ExplainRules.ended(function() {
        this.free();
        thisMode.ShowRules.free();
        thisMode.HideRules.play();
        thisMode.QuestionIntro1.delay(100,function() {
            this.play();
        });
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

    //nextcategoryready = this.game.api.gamemode(thisMode); // Préchargement de la prochaine catégorie
};
