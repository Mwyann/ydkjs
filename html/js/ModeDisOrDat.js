/********** ModeDisOrDat **********/

function ModeDisOrDat() {}

ModeDisOrDat.prototype.preload = function() {
  this.ChoicePlayer1on3 = new YDKJResource('DisOrDat/ChoicePlayer1on3');
  this.ChoicePlayer2on3 = new YDKJResource('DisOrDat/ChoicePlayer2on3');
  this.ChoicePlayer3on3 = new YDKJResource('DisOrDat/ChoicePlayer3on3');
  
  this.AnnounceCategory = new YDKJResource('DisOrDat/AnnounceCategory');
  this.TimerComesIn = new YDKJResource('DisOrDat/TimerComesIn');
  
  this.strjs = getYDKJFile('js','res/'+this.options.res+'/STR.js');
  
  this.GameStart = new YDKJResource('DisOrDat/GameStart');
  
  this.Intro = new YDKJResource('DisOrDat/Intro');
  this.IntroStill = new YDKJResource('DisOrDat/IntroStill');
  this.MusicLoopRules1 = new YDKJResource('DisOrDat/MusicLoopRules1');
  this.MusicLoopRules2 = new YDKJResource('DisOrDat/MusicLoopRules2');
  
  this.MusicLoopPlay1 = new YDKJResource('DisOrDat/MusicLoopPlay1');
  this.MusicLoopPlay2 = new YDKJResource('DisOrDat/MusicLoopPlay2');
  this.MusicLoopPlay3 = new YDKJResource('DisOrDat/MusicLoopPlay3');
  this.MusicLoopPlay4 = new YDKJResource('DisOrDat/MusicLoopPlay4');
  
  this.QuestionTitle = new YDKJAnimation('','','res/'+this.options.res+'/snd/1');
  this.QuestionIntro1 = new YDKJAnimation('','','res/'+this.options.res+'/snd/2');
  this.QuestionIntro2 = new YDKJAnimation('','','res/'+this.options.res+'/snd/3');
}

ModeDisOrDat.prototype.start = function() {
  var thisMode = this;

  var nextcategory = 0;
  
  if (this.chooseplayer == 1) this.ChoicePlayer = this.ChoicePlayer1on3;
  if (this.chooseplayer == 2) this.ChoicePlayer = this.ChoicePlayer2on3;
  if (this.chooseplayer == 3) this.ChoicePlayer = this.ChoicePlayer3on3;
  
  this.QuestionIntro1.ended(function() {
    thisMode.Intro.delay(function() {
      thisMode.QuestionIntro2.play();
    },100);
  });
  
  this.QuestionTitle.ended(function() {
    thisMode.Intro.delay(function() {
      thisMode.QuestionIntro1.play();
  		thisMode.TimerComesIn.delay(function(){
  			this.play();
  		},200);
  	},200);
  });

  this.QuestionTitle.ended(function() {
    jQuery('#screen #QuestionTitle').css('font-style','italic').delay(100).animate({'left':'-500px'},500,function(){
  		jQuery('#screen #QuestionTitle').remove();
		});
  },400);
  
  this.AnnounceCategory.ended(function() {
		thisMode.AnnounceCategory.delay(function(){
		  thisMode.QuestionTitle.play();
		},100);
  });
  
  this.AnnounceCategory.ended(function() {
		var textsize = 70;
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
		,250);
  },400);
  
  this.Intro.ended(function() {
    this.free();
    thisMode.IntroStill.play();
    thisMode.MusicLoopRules1.play();
    thisMode.AnnounceCategory.delay(function(){
      this.play();
    },500);
  });
  
  this.strjs.ready(function(){
  	thisMode.STR = thisMode.strjs.res['STR'];
    thisMode.ChoicePlayer.delay(function(){
      this.play();
      thisMode.Intro.delay(function(){
        jQuery('#screen').css('background-color','#000').html(''); // Je vide manuellement l'écran.
        this.play();
      },2500);
    },500);
	});
  
  nextcategory = new YDKJMode(this.game, 'Category', {category:1,questionnumber:this.options.questionnumber+1});
  nextcategory.chooseplayer = this.chooseplayer;
}
