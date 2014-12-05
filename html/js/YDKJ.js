/********** YDKJ **********/

function YDKJ() {
    var thisYDKJ = this;

    this.preloaded = 0;
    this.readyFunctions = [];

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
    if (typeof YDKJMode == "undefined") loadScript('js/YDKJMode.js');
    if (typeof YDKJAPI == "undefined") loadScript('js/YDKJAPI.js');
    if (typeof YDKJAnimation == "undefined") loadScript('js/YDKJAnimation.js');
    if (typeof YDKJFile == "undefined") loadScript('js/YDKJFile.js');
    if (typeof AudioSpecs == "undefined") loadScript('js/common.js');
    if (typeof ModeIntro == "undefined") loadScript('js/ModeIntro.js');
    if (typeof ModeCategory == "undefined") loadScript('js/ModeCategory.js');
    if (typeof ModeQuestion == "undefined") loadScript('js/ModeQuestion.js');
    if (typeof ModeDisOrDat == "undefined") loadScript('js/ModeDisOrDat.js');
    if (typeof YDKJDemoSnd == "undefined") loadScript('js/demo-res.js');
    if (typeof SeamlessLoop == "undefined") loadScript('js/SeamlessLoop.js');

    scriptsready();
}

YDKJ.prototype.ready = function(f) {
    if (!this.preloaded) this.readyFunctions.push(f); else f.call(this);
};

YDKJ.prototype.start = function() {
    this.ready(function() {
        var game = new YDKJGame(false);
        game.start();
    });
};

YDKJ.prototype.demo = function() {
    this.ready(function() {
        var game = new YDKJGame(true);
        game.start();
    });
};
