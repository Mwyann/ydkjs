/********** YDKJGame **********/

function YDKJGame() {
	jQuery.fx.interval = 66;
  this.players = new Array(
    {name:'Jeff',score:0},
    {name:'David',score:0},
    {name:'Alicia',score:0}
  );
  this.currentmode = 0;
}

YDKJGame.prototype.start = function() {
  var gamemode = new YDKJMode(this, 'Intro');
  //var gamemode = new YDKJMode(this, 'Category', {category:1,questionnumber:1});
  //var gamemode = new YDKJMode(this, 'Question', {questionnumber:1,res:'QFold1/AJM',correctanswer:4});
  gamemode.start();
}

YDKJGame.prototype.displayPlayer = function(playernumber) {
  var x;
  if (this.players.length == 3) {
    x=[106,320,533];
  }

  var playerdiv = jQuery('<div />').css({
    'position':'absolute',
    'z-index':'1000',
    'left':(x[playernumber-1]-100)+'px',
    'top':'400px',
    'width':'200px',
    'text-align':'center',
    'color':'#FFF',
    'font-family':'JackRoman',
    'font-size':'20px',
    'line-height':'30px'
  }).appendTo('#screen');

  jQuery('<div />').addClass('name').css({'position':'relative'}).html(this.players[playernumber-1].name).appendTo(playerdiv);
  jQuery('<div />').addClass('score').css({'position':'relative'}).html(this.players[playernumber-1].score+' F').appendTo(playerdiv);

  return playerdiv;
}
