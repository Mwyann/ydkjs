/********** YDKJMode **********/

function YDKJMode(game, modename, options) {
    if (!options) options = {};
    this.modeObj = false;

    // preload
    if (modename == 'Intro') this.modeObj = new ModeIntro();
    if (modename == 'Category') this.modeObj = new ModeCategory();
    if (modename == 'Question') this.modeObj = new ModeQuestion();
    if (modename == 'DisOrDat') this.modeObj = new ModeDisOrDat();

    if (!this.modeObj) return;

    this.modeObj.game = game;
    this.modeObj.options = options;
    this.modeObj.preload(game.api.resources(this.modeObj));
}

YDKJMode.prototype.start = function() {
    var thisMode = this;
    if (!this.modeObj) return false;
    if (this.modeObj.game.currentmode) this.modeObj.game.currentmode.free();
    this.modeObj.game.currentmode = this;
    this.modeObj.skiplistener = 0;

    // S'assurer que toutes les ressources sont préchargées avant de démarrer.
    var numobj = 1;
    var readyfunction = function() {
        numobj--;
        if (numobj == 0) thisMode.modeObj.start();
    };

    for (var i in this.modeObj) if (this.modeObj.hasOwnProperty(i)) {
        if ((this.modeObj[i] instanceof YDKJAnimation) || (this.modeObj[i] instanceof YDKJTimer10)) {
            numobj++;
            this.modeObj[i].ready(readyfunction);
        }
    }

    readyfunction();

    return true;
};

YDKJMode.prototype.free = function() {
    for (var i in this.modeObj) if (this.modeObj.hasOwnProperty(i)) {
        if ((this.modeObj[i] instanceof YDKJAnimation) || (this.modeObj[i] instanceof YDKJTimer10)) {
            this.modeObj[i].free();
            this.modeObj[i] = undefined;
            delete this.modeObj[i];
        }
    }
};
