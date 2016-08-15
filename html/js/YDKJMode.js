/********** YDKJMode **********/

function YDKJMode(game, modename, options) {
    var thisMode = this;
    if (!options) options = {};
    this.modeObj = false;

    // preload
    if (modename == 'Intro') this.modeObj = new ModeIntro();
    if (modename == 'Category') this.modeObj = new ModeCategory();
    if (modename == 'R1WrapUp') this.modeObj = new ModeR1WrapUp();
    if (modename == 'Question') this.modeObj = new ModeQuestion();
    if (modename == 'DisOrDat') this.modeObj = new ModeDisOrDat();
    if (modename == 'Gibberish') this.modeObj = new ModeGibberish();
    if (modename == 'JackAttack') this.modeObj = new ModeJackAttack();
    if (modename == 'End') this.modeObj = new ModeEnd();

    if (!this.modeObj) return;

    this.modeObj.game = game;
    this.modeObj.options = options;
    this.resourcesready = game.api.resources(this.modeObj);
    this.resourcesready(function(resources) {
        thisMode.modeObj.preload(resources);
    });
}

YDKJMode.prototype.start = function() {
    var thisMode = this;
    if (!this.modeObj) return false;
    if (this.modeObj.game.currentmode) this.modeObj.game.currentmode.free();
    this.modeObj.game.currentmode = this;
    this.modeObj.skiplistener = 0;

    this.resourcesready(function(resources) {
        // S'assurer que toutes les ressources sont préchargées avant de démarrer.
        var numobj = 1;
        var readyfunction = function () {
            numobj--;
            if (numobj == 0) {
                thisMode.modeObj.game.api.unregisteraction(true); // On nettoie tous les handlers de l'API avant de démarrer
                thisMode.modeObj.start();
            }
        };

        for (var i in thisMode.modeObj) if (thisMode.modeObj.hasOwnProperty(i)) {
            if ((thisMode.modeObj[i] instanceof YDKJAnimation) || (thisMode.modeObj[i] instanceof YDKJTimer)) {
                numobj++;
                thisMode.modeObj[i].html = thisMode.modeObj.game.html;
                thisMode.modeObj[i].font = thisMode.modeObj.game.font;
                thisMode.modeObj[i].ready(readyfunction);
            }
        }

        readyfunction();
    });

    return true;
};

YDKJMode.prototype.free = function() {
    for (var i in this.modeObj) if (this.modeObj.hasOwnProperty(i)) {
        if ((this.modeObj[i] instanceof YDKJAnimation) || (this.modeObj[i] instanceof YDKJTimer)) {
            this.modeObj[i].free();
            this.modeObj[i] = undefined;
            delete this.modeObj[i];
        }
    }
};
