/********** YDKJ **********/

function YDKJ(screen, debug) {
    var thisYDKJ = this;
    this.screen = screen;
    this.debug = debug;
    this.screen.css('position','relative').css('width','640px').css('height','480px').css('overflow','hidden').css('background','#000');

    this.preloaded = 0;
    this.readyFunctions = [];
    this.game = 0;

    // Chargement des scripts supplémentaires
    var totalscripts = 1;

    var scriptsready = function() {
        totalscripts--;
        if (totalscripts == 0) {
            thisYDKJ.preloaded = 1;
            for(var i = 0; i < thisYDKJ.readyFunctions.length; i++) {
                thisYDKJ.readyFunctions[i].call(thisYDKJ);
            }
        }
    };

    var loadScript = function(scriptname) {
        totalscripts++;
        jQuery.getScript(scriptname+'?rand='+Math.random(),scriptsready);
    };

    if (typeof YDKJGame == "undefined") loadScript('js/YDKJGame.js');
    if (typeof YDKJFont == "undefined") loadScript('js/YDKJFont.js');
    if (typeof YDKJMode == "undefined") loadScript('js/YDKJMode.js');
    if (typeof YDKJAPI == "undefined") loadScript('js/YDKJAPI.js');
    if (typeof YDKJAnimation == "undefined") loadScript('js/YDKJAnimation.js');
    if (typeof YDKJFile == "undefined") loadScript('js/YDKJFile.js');
    if (typeof AudioSpecs == "undefined") loadScript('js/common.js');
    if (typeof ModeIntro == "undefined") loadScript('js/ModeIntro.js');
    if (typeof ModeCategory == "undefined") loadScript('js/ModeCategory.js');
    if (typeof ModeQuestion == "undefined") loadScript('js/ModeQuestion.js');
    if (typeof ModeDisOrDat == "undefined") loadScript('js/ModeDisOrDat.js');
    if (typeof ModeJackAttack == "undefined") loadScript('js/ModeJackAttack.js');
    if (typeof ModeEnd == "undefined") loadScript('js/ModeEnd.js');
    if (typeof YDKJDemoSnd == "undefined") loadScript('js/demo-res.js');
    if (typeof SeamlessLoop == "undefined") loadScript('js/SeamlessLoop.js');

    scriptsready();
}

YDKJ.prototype.ready = function(f) {
    if (!this.preloaded) this.readyFunctions.push(f); else f.call(this);
};

YDKJ.prototype.start = function() {
    this.ready(function() {
        this.game = new YDKJGame({screen: this.screen, debug: this.debug});
        this.game.start();
    });
};

YDKJ.prototype.demo = function() {
    this.ready(function() {
        this.game = new YDKJGame({screen: this.screen, debug: this.debug}, true);
        this.game.start();
    });
};

YDKJ.prototype.fullscreen = function(f) {
    this.ready(function() {
        this.game.fullscreen(f);
    });
};

(function() {
    var oldWindowError = window.onerror;
    window.onerror = function(msg, url, line, col, error) {
        jQuery.ajax({
            url: 'api/report-error.php',
            type: 'post',
            data: {msg:msg, url:url, line:line, col:col, error:error},
            success: function(html, status, xhr) {
                console.log('YDKJS: An error has been found and has been reported to the developer.');
            },
            error: function (xhr, ajaxOptions, thrownError){
                console.log('YDKJS: An error has been found but couldn\'t be reported.');
            }
        });
        if (oldWindowError) oldWindowError.apply(this,arguments);
    };
})();

