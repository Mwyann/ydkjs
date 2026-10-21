/********** YDKJGame **********/

function YDKJGame(html, demomode, loaderConfig, options) {
    var thisGame = this;
    if (!demomode) demomode = false;
    this.options = options || {};
    this.html = html;
    this.api = new YDKJAPI(this, demomode, this.options);
    this.font = new YDKJFont();
    this.demomode = demomode;
    jQuery.fx.interval = 66;
    this.gameinfoready = this.api.gameinfo();
    this.currentmode = 0;

    // Configuration du loader (valeurs par défaut si non spécifié par la page)
    this.loaderGif = 'ajax-loader.gif';
    this.loaderMinDuration = 1000;
    this.endGif = null;
    this.endGifDuration = 0;
    this.loaderStartTime = Date.now();
    this.endGifUrl = null;
    var preloadEndImg = null;

    this.setLoader = function(loaderGif, minDuration, endGif, endDuration) {
        if (loaderGif !== undefined && loaderGif !== null) thisGame.loaderGif = loaderGif;
        if (minDuration !== undefined && minDuration !== null) thisGame.loaderMinDuration = parseInt(minDuration, 10) || 0;
        if (endGif !== undefined) thisGame.endGif = endGif;
        if (endDuration !== undefined && endDuration !== null) thisGame.endGifDuration = parseInt(endDuration, 10) || 0;

        if (thisGame.$loaderImg && thisGame.loaderGif) {
            thisGame.$loaderImg.attr('src', thisGame.loaderGif);
        }
        if (thisGame.endGif) {
            thisGame.endGifUrl = thisGame.endGif + '?t=' + thisGame.loaderStartTime;
            preloadEndImg = new Image();
            preloadEndImg.src = thisGame.endGifUrl;
        } else {
            thisGame.endGifUrl = null;
            preloadEndImg = null;
        }
        return thisGame;
    };

    if (loaderConfig) {
        this.setLoader(loaderConfig.loaderGif, loaderConfig.minDuration, loaderConfig.endGif, loaderConfig.endDuration);
    }

    // Conteneur de chargement parfaitement centré (évite tout sursaut d'affichage)
    var $loader = jQuery('<div id="ydkj_loader" />').css({
        'position': 'absolute',
        'top': '0',
        'left': '0',
        'width': '640px',
        'height': '480px',
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        'background': '#000',
        'z-index': '10'
    });
    var $loaderImg = jQuery('<img id="ydkj_loader_img" alt="Chargement" />').attr('src', thisGame.loaderGif).css({
        'display': 'block'
    });
    $loader.append($loaderImg);
    thisGame.$loader = $loader;
    thisGame.$loaderImg = $loaderImg;
    thisGame.html.screen.empty().append($loader);

    if (thisGame.endGif) {
        thisGame.endGifUrl = thisGame.endGif + '?t=' + thisGame.loaderStartTime;
        preloadEndImg = new Image();
        preloadEndImg.src = thisGame.endGifUrl;
    }

    // Gestion de l'affichage adaptatif (auto-fit 4:3) et du fullscreen
    var onfullscreenoff = function() {};
    var body = jQuery('body');
    var thewindow = jQuery(window);

    // Mise à jour de l'information de mode de jeu dans la barre (#headerbuttons)
    var updateHeaderModeInfo = function() {
        var header = jQuery('#headerbuttons');
        if (header.length) {
            var modeInfo = header.find('#game-mode-info');
            if (!modeInfo.length) {
                modeInfo = jQuery('<span class="ydkj-bar-info" id="game-mode-info" />');
                var fullscreenBtn = header.find('#fullscreen');
                if (fullscreenBtn.length) {
                    modeInfo.insertBefore(fullscreenBtn);
                } else {
                    modeInfo.appendTo(header);
                }
            }
            var infoText = '';
            if (thisGame.demomode) {
                infoText = 'MODE D\u00C9MO';
            } else if (thisGame.api && thisGame.api.sessionCode) {
                infoText = 'SESSION : ' + thisGame.api.sessionCode;
            } else {
                infoText = 'PARTIE LOCALE';
            }
            modeInfo.text(infoText);
        }
    };
    updateHeaderModeInfo();

    var autozoom = function() {
        var header = jQuery('#headerbuttons');
        var headerHeight = 0;
        if (header.length && header.is(':visible')) {
            headerHeight = header.outerHeight(true) || 0;
        }
        var winW = thewindow.width();
        var winH = thewindow.height();
        var availH = Math.max(0, winH - headerHeight);
        var zoom = Math.min(winW / 640, availH / 480);
        if (zoom <= 0) zoom = 1;
        var centerleft = Math.max(0, Math.round((winW - (zoom * 640)) / 2));
        var centerup = headerHeight + Math.max(0, Math.round((availH - (zoom * 480)) / 2));

        body.css({
            'background-color': '#000',
            'overflow': 'hidden'
        });
        thisGame.html.screen.css({
            'position': 'absolute',
            'top': centerup + 'px',
            'left': centerleft + 'px',
            'transform-origin': '0 0',
            'transform': 'scale(' + zoom.toFixed(4) + ',' + zoom.toFixed(4) + ')',
            'display': 'block',
            'visibility': 'visible'
        });
    };
    this.autozoom = autozoom;

    thewindow.resize(function() {
        autozoom();
    });

    this.fullscreen = function(f) {
        if (typeof f === 'function') onfullscreenoff = f;
        jQuery('#headerbuttons').hide();
        if (typeof body.fullScreen === 'function') {
            body.fullScreen(true);
        }
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

    body.bind("fullscreenchange webkitfullscreenchange mozfullscreenchange", function(e) {
        var isFull = (typeof body.fullScreen === 'function') ? body.fullScreen() : false;
        if (isFull) {
            jQuery('#headerbuttons').hide();
        } else {
            jQuery('#headerbuttons').show();
            onfullscreenoff();
            onfullscreenoff = function() {};
        }
        autozoom();
    });

    // Activer le mode plein écran fenêtré (pleine largeur auto-fit) immédiatement
    autozoom();
    enableWakeLock();
}

YDKJGame.prototype.start = function() {
    var thisGame = this;
    this.font.preload(function () {
        thisGame.gameinfoready(function (gameinfo) {
            thisGame.players = gameinfo.players;
            thisGame.locale = gameinfo.locale;
            thisGame.screwEnabled = gameinfo.screwEnabled;
            thisGame.nbQuestions = gameinfo.nbQuestions;
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
            var proceedToLaunch = function(launchCallback) {
                var onGameReady = function() {
                    var elapsed = Date.now() - (thisGame.loaderStartTime || Date.now());
                    var remainingMin = Math.max(0, thisGame.loaderMinDuration - elapsed);

                    var finishLoader = function() {
                        if (thisGame.endGif && thisGame.endGifDuration > 0) {
                            if (thisGame.$loaderImg) {
                                // Redémarrer l'animation du GIF de fin depuis le début (frame 0)
                                thisGame.$loaderImg.attr('src', '');
                                thisGame.$loaderImg.attr('src', thisGame.endGifUrl || (thisGame.endGif + '?t=' + Date.now()));
                            }
                            setTimeout(function() {
                                if (thisGame.$loader) {
                                    thisGame.$loader.remove();
                                    thisGame.$loader = null;
                                }
                                checkAudioAndStart();
                            }, thisGame.endGifDuration);
                        } else {
                            if (thisGame.$loader) {
                                thisGame.$loader.remove();
                                thisGame.$loader = null;
                            }
                            checkAudioAndStart();
                        }
                    };

                    if (remainingMin > 0) {
                        setTimeout(finishLoader, remainingMin);
                    } else {
                        finishLoader();
                    }
                };

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
                        var targetScreen = (thisGame.html && thisGame.html.screen) ? thisGame.html.screen : 'body';
                        useraction.appendTo(targetScreen);

                        var unlock = function() {
                            if (!useraction) return;
                            useraction.remove();
                            useraction = null;

                            if (window.Howler && window.Howler.ctx) {
                                if (typeof window.Howler.ctx.resume === 'function') {
                                    try { window.Howler.ctx.resume(); } catch(e) {}
                                }
                                try {
                                    var sampleRate = (window.Howler.ctx.sampleRate) ? window.Howler.ctx.sampleRate : 22050;
                                    var buffer = window.Howler.ctx.createBuffer(1, 1, sampleRate);
                                    var source = window.Howler.ctx.createBufferSource();
                                    source.buffer = buffer;
                                    source.connect(window.Howler.ctx.destination);
                                    source.start(0);
                                } catch(e) {}
                            } else if (ctx && typeof ctx.resume === 'function') {
                                try { ctx.resume(); } catch(e) {}
                            }

                            thisGame.enableWakeLock();
                            launchCallback();
                        };

                        jQuery(window).one('click touchend keydown', unlock);
                    } else {
                        thisGame.enableWakeLock();
                        launchCallback();
                    }
                };

                onGameReady();
            };

            if (gameinfo.inProgress) {
                // Partie déjà commencée : attente du prochain game_state
                thisGame.loaderMinDuration = 0;
                thisGame.endGifDuration = 0;
                if (thisGame.$loader) {
                    thisGame.$loader.remove();
                    thisGame.$loader = null;
                }

                var waitScreen = jQuery('<div id="ydkj_midgame_wait" />');
                waitScreen.html(
                    '<div style="max-width:580px;margin:0 auto;text-align:center">' +
                        '<div style="font-size:28px;font-family:JackCondensed, sans-serif;letter-spacing:1px;line-height:1.3;margin-bottom:12px;color:#FFD700">' +
                            'PARTIE EN COURS' +
                        '</div>' +
                        '<div style="font-size:18px;color:#fff;font-family:JackCondensed, sans-serif;letter-spacing:1px">' +
                            'SYNCHRONISATION AU PROCHAIN TOUR...' +
                        '</div>' +
                    '</div>'
                ).css({
                    'text-align': 'center',
                    'width': '100%',
                    'color': 'white',
                    'background-color': 'rgba(0, 0, 0, 0.9)',
                    'position': 'absolute',
                    'z-index': '99998',
                    'top': '0',
                    'left': '0',
                    'bottom': '0',
                    'right': '0',
                    'display': 'flex',
                    'justify-content': 'center',
                    'align-items': 'center',
                    'user-select': 'none'
                });
                var targetScreen = (thisGame.html && thisGame.html.screen) ? thisGame.html.screen : 'body';
                waitScreen.appendTo(targetScreen);

                // Prise en compte immédiate d'un geste utilisateur sur l'écran d'attente pour débloquer l'audio au plus tôt
                jQuery(window).one('click touchend keydown', function() {
                    if (window.Howler && window.Howler.ctx && typeof window.Howler.ctx.resume === 'function') {
                        try { window.Howler.ctx.resume(); } catch(e) {}
                    }
                });

                var handleGameState = function(stateMsg) {
                    thisGame.api.onGameStateReceived = null;
                    thisGame.api.lastGameState = null;
                    thisGame.api.actionlist = [];

                    // Réinjection complète des joueurs (future-proof) en préservant le keycode local de ce client
                    if (stateMsg.players && Array.isArray(stateMsg.players)) {
                        for (var i = 0; i < stateMsg.players.length && i < thisGame.players.length; i++) {
                            var localKeycode = thisGame.players[i].keycode;
                            jQuery.extend(thisGame.players[i], stateMsg.players[i]);
                            thisGame.players[i].keycode = localKeycode;
                        }
                    }

                    proceedToLaunch(function() {
                        if (waitScreen) {
                            waitScreen.remove();
                            waitScreen = null;
                        }
                        var nextMode = new YDKJMode(thisGame, stateMsg.modedata);
                        nextMode.start();
                    });
                };

                if (thisGame.api.lastGameState) {
                    handleGameState(thisGame.api.lastGameState);
                } else {
                    thisGame.api.onGameStateReceived = handleGameState;
                }
            } else {
                // Démarrage normal depuis le début
                (thisGame.api.gamemode())(function (gamemode) {
                    proceedToLaunch(function() {
                        gamemode.start();
                    });
                });
            }
        });
    });
};

YDKJGame.prototype.fullscreen = function(f) {
    this.fullscreen(f);
};

YDKJGame.prototype.setLoader = function(loaderGif, minDuration, endGif, endDuration) {
    if (this.setLoader) {
        return this.setLoader(loaderGif, minDuration, endGif, endDuration);
    }
    return this;
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
