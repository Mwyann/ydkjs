/********** YDKJGame **********/

function YDKJGame(demomode) {
    this.api = new YDKJAPI(this, demomode);
    jQuery.fx.interval = 66;
    this.playersready = this.api.players();
    this.gamemodeready = this.api.gamemode();
    this.currentmode = 0;
}

YDKJGame.prototype.start = function() {
    var thisGame = this;
    this.playersready(function(players) {
        thisGame.players = players;
        thisGame.gamemodeready(function(gamemode){
            gamemode.start();
        });
    })
};

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
};
