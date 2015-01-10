/********** ModeDisOrDat **********/

function ModeDisOrDat() {}

ModeDisOrDat.prototype.preload = function(resources) {
    this.ChoicePlayer1on3 = new YDKJAnimation(resources['DisOrDat/ChoicePlayer1on3']);
    this.ChoicePlayer2on3 = new YDKJAnimation(resources['DisOrDat/ChoicePlayer2on3']);
    this.ChoicePlayer3on3 = new YDKJAnimation(resources['DisOrDat/ChoicePlayer3on3']);

    this.AnnounceCategory = new YDKJAnimation(resources['DisOrDat/AnnounceCategory']);
    this.TimerComesIn = new YDKJAnimation(resources['DisOrDat/TimerComesIn']);

    this.GameStart = new YDKJAnimation(resources['DisOrDat/GameStart']);

    this.Intro = new YDKJAnimation(resources['DisOrDat/Intro']);
    this.IntroStill = new YDKJAnimation(resources['DisOrDat/IntroStill']);
    this.MusicLoopRules1 = new YDKJAnimation(resources['DisOrDat/MusicLoopRules1']);
    this.MusicLoopRules2 = new YDKJAnimation(resources['DisOrDat/MusicLoopRules2']);
    this.ShowQuestion = new YDKJAnimation(resources['DisOrDat/ShowQuestion']);

    this.MusicLoopPlay1 = new YDKJAnimation(resources['DisOrDat/MusicLoopPlay1']);
    this.MusicLoopPlay2 = new YDKJAnimation(resources['DisOrDat/MusicLoopPlay2']);
    this.MusicLoopPlay3 = new YDKJAnimation(resources['DisOrDat/MusicLoopPlay3']);
    this.MusicLoopPlay4 = new YDKJAnimation(resources['DisOrDat/MusicLoopPlay4']);

    this.QuestionTitle = new YDKJAnimation(resources['DisOrDat/QuestionTitle']);
    this.QuestionIntro1 = new YDKJAnimation(resources['DisOrDat/QuestionIntro1']);
    this.QuestionIntro2 = new YDKJAnimation(resources['DisOrDat/QuestionIntro2']);
    this.MessageSpaceBarComesIn = new YDKJAnimation(resources['DisOrDat/MessageSpaceBarComesIn']);
    this.MessageSpaceBarLeave = new YDKJAnimation(resources['DisOrDat/MessageSpaceBarLeave']);

    this.SFXShowKey = new YDKJAnimation(resources['DisOrDat/SFXShowKey']);
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

};

ModeDisOrDat.prototype.start = function() {
    var thisMode = this;

    var nextcategory = 0;

    if (this.chooseplayer == 1) this.ChoicePlayer = this.ChoicePlayer1on3;
    if (this.chooseplayer == 2) this.ChoicePlayer = this.ChoicePlayer2on3;
    if (this.chooseplayer == 3) this.ChoicePlayer = this.ChoicePlayer3on3;

    this.QuestionIntro2.ended(3500,function() {
        nextcategory.modeObj.MusicChooseCategoryLoop.free();
        nextcategory.modeObj.MusicChooseCategoryLoop = thisMode.MusicLoopRules1;
        thisMode.MusicLoopRules1 = false; // Pour ne pas être détruite au passage à la catégorie suivante
        nextcategory.start();
    });

    var buttonsStandby = [];

    var loopStandBy = function(){ // Fonction servant à synchroniser les animations Standby
        for(var i = 0; i < buttonsStandby.length; i++) {
            if ((!buttonsStandby[i].ComesIn.isplaying) && (!buttonsStandby[i].StandBy.isplaying) && (!buttonsStandby[i].Push.isplaying)) {
                buttonsStandby[i].ComesIn.free();
                buttonsStandby[i].Push.reset();
                buttonsStandby[i].StandBy.play();
            }
        }
    };

    var addStandBy = function(comesin, standby, push) {
        buttonsStandby.push({ComesIn: comesin, StandBy: standby, Push: push});
        standby.ended(function(){loopStandBy()});
    };

    this.Button4of4ComesIn.ended(function(){
        addStandBy(thisMode.Button4of4ComesIn, thisMode.Button4of4StandbyLoop, thisMode.Button4of4Push);
    });

    this.Button3of4ComesIn.ended(function(){
        addStandBy(thisMode.Button3of4ComesIn, thisMode.Button3of4StandbyLoop, thisMode.Button3of4Push);
        this.delay(300,function(){

        });
    });

    this.Button2of4ComesIn.ended(function(){
        addStandBy(thisMode.Button2of4ComesIn, thisMode.Button2of4StandbyLoop, thisMode.Button2of4Push);
        this.delay(300,function(){
            thisMode.Button3of4ComesIn.play();
            thisMode.SFXShowKey.reset();
            thisMode.SFXShowKey.play();
        });
    });

    this.Button1of4ComesIn.ended(function(){
        addStandBy(thisMode.Button1of4ComesIn, thisMode.Button1of4StandbyLoop, thisMode.Button1of4Push);
        loopStandBy();
        this.delay(300,function(){
            thisMode.Button2of4ComesIn.play();
            thisMode.SFXShowKey.reset();
            thisMode.SFXShowKey.play();
        });
    });

    this.Button4of3ComesIn.ended(function(){
        addStandBy(thisMode.Button4of3ComesIn, thisMode.Button4of3StandbyLoop, thisMode.Button4of3Push);
    });

    this.Button2of3ComesIn.ended(function(){
        addStandBy(thisMode.Button2of3ComesIn, thisMode.Button2of3StandbyLoop, thisMode.Button2of3Push);
        this.delay(300,function(){

        });
    });

    this.Button1of3ComesIn.ended(function(){
        addStandBy(thisMode.Button1of3ComesIn, thisMode.Button1of3StandbyLoop, thisMode.Button1of3Push);
        loopStandBy();
        this.delay(300,function(){
            thisMode.Button2of3ComesIn.play();
            thisMode.SFXShowKey.reset();
            thisMode.SFXShowKey.play();
        });
    });

    this.QuestionIntro1.ended(100,function() {
        thisMode.QuestionIntro2.play();
        thisMode.QuestionIntro2.delay(100,function(){
            thisMode.ShowQuestion.play();
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
            }).html(getSTRfromID(thisMode.STR,2));

            textdiv.appendTo(div);

            div.appendTo(thisMode.game.html.screen).animate({'left':'40px'},300,function(){
                textdiv.css({'font-style':'normal'});
                if (thisMode.options.nbchoices == 3) thisMode.Button1of3ComesIn.play();
                else thisMode.Button1of4ComesIn.play();
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
                    '-webkit-transform':'scale(0.0, 1.0)',
                    '-moz-transform':'scale(0.0, 1.0)',
                    '-ms-transform':'scale(0.0, 1.0)',
                    '-o-transform':'scale(0.0, 1.0)',
                    'transform':'scale(0.0,1.0)'
                }).html(getSTRfromID(thisMode.STR,1)).appendTo(div);

                div.appendTo(thisMode.game.html.screen);

                animTransform(titlediv,0,1,1,1,0.15,300,0);
            });
            this.play();
            //thisMode.MessageSpaceBarComesIn.play();
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
            'top':Math.round(155+textsize*0.05)+'px', // Plus bas que les catégories des questions
            'opacity':'0'
        }).html(getSTRfromID(thisMode.STR,1)).appendTo(thisMode.game.html.screen).animate({
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
