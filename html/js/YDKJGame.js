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
            thisGame.engineVersion = gameinfo.engineVersion;
            thisGame.api.localMode = gameinfo.localMode;
            thisGame.api.subscribe();
            (thisGame.api.gamemode())(function (gamemode) {
                // device detection
                if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
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
        return minus+'<span style="font-size:70%">DM</span>'+value.toString();
    }
    return value.toString();
};
