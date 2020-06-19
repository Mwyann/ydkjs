/********** YDKJGame **********/

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

    this.fullscreenoff = function() {
        body.fullScreen(false);
        onresize = function() {};
        body.attr('style',oldcssbody);
        thisGame.html.screen.attr('style',oldcssscreen);
        onfullscreenoff();
        onfullscreenoff = function() {};
        oldcssbody = undefined;
        oldcssscreen = undefined;
    };

    thewindow.keyup(function(event) {
        if ((event.keyCode == 27) && (oldcssbody !== undefined) && (oldcssscreen !== undefined)) thisGame.fullscreenoff();
    });

    this.fullscreen = function(f) {
        if ((oldcssbody !== undefined) && (oldcssscreen !== undefined)) return false;
        body.fullScreen(true);
        var autozoom = function() {
            var zoom = Math.min(jQuery(window).width()/640,jQuery(window).height()/480);
            var centerup = Math.max(0,Math.round((jQuery(window).height()-(zoom*480))/2));
            var centerleft = Math.max(0,Math.round((jQuery(window).width()-(zoom*640))/2));
            body.css({
                'background-color': '#000',
                'overflow': 'hidden'
            });
            thisGame.html.screen.css({
                'top': centerup+'px',
                'left': centerleft+'px',
                'transform-origin': '0 0',
                'transform': 'scale('+zoom.toFixed(2)+','+zoom.toFixed(2)+')'
            });
        };
        onfullscreenoff = f;
        oldcssbody = body.attr('style');
        oldcssscreen = thisGame.html.screen.attr('style');
        thisGame.html.screen.css({
            'position': 'absolute',
            'top': '0',
            'left': '0'});

        onresize = autozoom;
        autozoom();
    };

    body.bind("fullscreenchange", function(e) {
        if (body.fullScreen()) thisGame.fullscreen(function() {}); else thisGame.fullscreenoff();
    });
}

YDKJGame.prototype.start = function() {
    var thisGame = this;
    this.font.preload(function () {
        thisGame.gameinfoready(function (gameinfo) {
            thisGame.players = gameinfo.players;
            thisGame.locale = gameinfo.locale;
            thisGame.screwEnabled = gameinfo.screwEnabled;
            thisGame.screwKeycodes = [];
            switch(thisGame.locale) {
                case 'fr_FR': thisGame.screwKeycodes = [118, 86]; break; // v ou V (vicieuse)
                case 'en_GB':
                case 'en_US': thisGame.screwKeycodes = [115, 83]; break; // s ou S (screw)
                case 'de_DE': thisGame.screwKeycodes = [110, 78]; break; // n ou N (nageln)
                default: thisGame.screwKeycodes = [];
            }
            thisGame.engineVersion = gameinfo.engineVersion;
            thisGame.api.localMode = gameinfo.localMode;
            thisGame.api.subscribe();
            (thisGame.api.gamemode())(function (gamemode) {
                // device detection
                var AudioContext = window.AudioContext // Default
                    || window.webkitAudioContext // Safari and old versions of Chrome
                    || false;
                var state = '';
                if (AudioContext) {
                    var audiocontext = new AudioContext();
                    state = audiocontext.state;
                }
                if (state !== 'running') {
                    var useraction = jQuery('<div />');
                    useraction.html('Mobile user: please touch the screen to start the game').css({
                        'text-align': 'center',
                        'width': '100%',
                        'color': 'white',
                        'background-color': 'black',
                        'position': 'absolute',
                        'z-index': '99999',
                        'top': '50%',
                        'left': '0'
                    });
                    useraction.appendTo('body');
                    var noSleep = new NoSleep();
                    var userok = function() {
                        if (!useraction) return;
                        useraction.remove();
                        useraction = 0;
                        noSleep.enable();
                        gamemode.start();
                    };
                    jQuery(window).one('touchend',userok).one('mouseup',userok);
                } else gamemode.start();
            });
        });
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

    switch(this.locale) {
        case 'fr_FR': return minus+value+' F';
        case 'en_GB': return minus+'£'+thousandSeparator(value,',');
        case 'en_US': return minus+'$'+value.toString();
        case 'de_DE': return minus+'<span style="font-size:70%">DM</span>'+value.toString();
        default: return value.toString();
    }
};
