/********** YDKJGame **********/

var YDKJaudiomanager = new AudioManager();

function YDKJGame(html, demomode) {
    var thisGame = this;
    if (!demomode) demomode = false;
    this.html = html;
    this.api = new YDKJAPI(this, demomode);
    this.font = new YDKJFont();
    this.demomode = demomode;
    jQuery.fx.interval = 66;
    this.gameinfoready = this.api.gameinfo();
    this.currentmode = 0;

    // Gestion du fullscreen
    var onresize = function() {};
    var onfullscreenoff = function() {};
    var oldcssbody = undefined;
    var oldcssscreen = undefined;
    var body = jQuery('body');
    var thewindow = jQuery(window);

    thewindow.resize(function() {
        // This will execute whenever the window is resized
        onresize();
    });

    thewindow.keyup(function(event) {
        if ((event.keyCode == 27) && (oldcssbody !== undefined) && (oldcssscreen !== undefined)) {
            onresize = function() {};
            body.attr('style',oldcssbody);
            thisGame.html.screen.attr('style',oldcssscreen);
            onfullscreenoff();
            onfullscreenoff = function() {};
        }
    });

    this.fullscreen = function(f) {
        var autozoom = function() {
            var zoom = Math.min(jQuery(window).width()/640,jQuery(window).height()/480);
            var centerup = Math.max(0,Math.round((jQuery(window).height()-(zoom*480))/4));
            body.css({
                'background-color': '#000',
                'overflow': 'hidden',
                'zoom': zoom.toFixed(2),
                '-moz-transform-origin': '50% 0',
                '-moz-transform': 'scale('+zoom.toFixed(2)+','+zoom.toFixed(2)+')'}).css('zoom',(zoom*100).toFixed(0)+'%');
            thisGame.html.screen.css({
                'top': centerup+'px'
            });
        };
        onfullscreenoff = f;
        oldcssbody = body.attr('style');
        oldcssscreen = thisGame.html.screen.attr('style');
        thisGame.html.screen.css({
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'right': '0',
            'margin': '0 auto'});

        onresize = autozoom;
        autozoom();
    }
}

YDKJGame.prototype.start = function() {
    var thisGame = this;
    this.font.preload(function () {
        var useraction = 0;
        if (!YDKJaudiomanager.init(512,function() {
            if (useraction) useraction.remove();
            thisGame.gameinfoready(function (gameinfo) {
                thisGame.players = gameinfo.players;
                thisGame.locale = gameinfo.locale;
                thisGame.engineVersion = gameinfo.engineVersion;
                (thisGame.api.gamemode())(function (gamemode) {
                    gamemode.start();
                });
            });
        })) {
            useraction = jQuery('<div />');
            useraction.html('Mobile user: please touch the screen to start the game').css({
                'color': 'white',
                'background-color': 'black',
                'position': 'absolute',
                'z-index': '99999',
                'top': '50%',
                'left': '30%'
            });
            useraction.appendTo('body');
        }
    });
};

YDKJGame.prototype.fullscreen = function(f) {
    this.fullscreen(f);
};

YDKJGame.prototype.displayCurrency = function(value) {
    var thousandSeparator = function(value,separator,decimal) {
        if (decimal === undefined) decimal = '.';
        var parts = value.toString().split(decimal);
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        return parts.join(decimal);
    };

    var minus = '';
    if (value < 0) minus = '-';
    value = Math.abs(value).toString();

    if (this.locale == 'fr_FR') {
        return minus+value+' F';
    }
    if (this.locale == 'en_GB') {
        return minus+'£'+thousandSeparator(value,',');
    }
    if (this.locale == 'en_US') {
        return minus+'$'+value.toString();
    }
    if (this.locale == 'de_DE') {
        return minus+'<span¤style="font-size:70%">DM</span>'+value.toString(); // The ¤ symbol will be replaced by a space later.
    }
    return value.toString();
};
