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
        enableWakeLock();
    };

    var enableWakeLock = function() {
        if ('wakeLock' in navigator && navigator.wakeLock.request) {
            try {
                navigator.wakeLock.request('screen').catch(function(){});
            } catch(e) {}
        }
        if (typeof NoSleep !== 'undefined') {
            try {
                if (!window.YDKJ_NOSLEEP) {
                    window.YDKJ_NOSLEEP = new NoSleep();
                }
                window.YDKJ_NOSLEEP.enable();
            } catch(e) {}
        }
    };
    thisGame.enableWakeLock = enableWakeLock;
    jQuery(window).one('click touchend', enableWakeLock);
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            enableWakeLock();
        }
    });

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
            window.YDKJCurrentGame = thisGame; // Utile pour le debug
            (thisGame.api.gamemode())(function (gamemode) {
                var checkAudioAndStart = function() {
                    // Forcer l'initialisation de l'AudioContext interne de Howler
                    if (window.Howler && !window.Howler.ctx) {
                        try {
                            window.Howler.mute(false);
                        } catch(e) {}
                    }

                    var ctx = (window.Howler && window.Howler.ctx) ? window.Howler.ctx : null;
                    if (!ctx) {
                        var AC = window.AudioContext || window.webkitAudioContext || false;
                        if (AC) {
                            try {
                                var fallbackCtx = new AC();
                                if (window.Howler) {
                                    window.Howler.ctx = fallbackCtx;
                                    ctx = fallbackCtx;
                                }
                            } catch(e) {}
                        }
                    }

                    var isRunning = ctx ? (ctx.state === 'running') : true;

                    if (!isRunning) {
                        var useraction = jQuery('<div id="ydkj_audio_unlock" />');
                        useraction.html(
                            '<div style="max-width:580px;margin:0 auto;text-align:center">' +
                                '<div style="font-size:26px;font-family:JackCondensed, sans-serif;letter-spacing:1px;line-height:1.3;margin-bottom:12px">' +
                                    'CLIQUEZ N\'IMPORTE OÙ SUR L\'ÉCRAN POUR ACTIVER LE SON ET DÉMARRER LA PARTIE' +
                                '</div>' +
                                '<div style="font-size:16px;color:#bbb;font-family:sans-serif">' +
                                    '(Requis par votre navigateur pour autoriser la lecture sonore)' +
                                '</div>' +
                            '</div>'
                        ).css({
                            'text-align': 'center',
                            'width': '100%',
                            'color': 'white',
                            'background-color': 'rgba(0, 0, 0, 0.9)',
                            'position': 'absolute',
                            'z-index': '99999',
                            'top': '0',
                            'left': '0',
                            'bottom': '0',
                            'right': '0',
                            'display': 'flex',
                            'justify-content': 'center',
                            'align-items': 'center',
                            'cursor': 'pointer',
                            'user-select': 'none'
                        });
                        useraction.appendTo('body');

                        var unlock = function() {
                            if (!useraction) return;
                            useraction.remove();
                            useraction = null;

                            if (window.Howler && window.Howler.ctx) {
                                if (typeof window.Howler.ctx.resume === 'function') {
                                    try { window.Howler.ctx.resume(); } catch(e) {}
                                }
                                try {
                                    var buffer = window.Howler.ctx.createBuffer(1, 1, 22050);
                                    var source = window.Howler.ctx.createBufferSource();
                                    source.buffer = buffer;
                                    source.connect(window.Howler.ctx.destination);
                                    source.start(0);
                                } catch(e) {}
                            } else if (ctx && typeof ctx.resume === 'function') {
                                try { ctx.resume(); } catch(e) {}
                            }

                            thisGame.enableWakeLock();
                            gamemode.start();
                        };

                        jQuery(window).one('click touchend keydown', unlock);
                    } else {
                        thisGame.enableWakeLock();
                        gamemode.start();
                    }
                };

                checkAudioAndStart();
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
