/********** YDKJResource **********/

function YDKJResource(resourceName) {
    this.resourceName = resourceName;

    this.preloaded = 0;
    this.readyFunctions = [];

    var thisResource = this;

    this.isplaying = 0;
    this.played = 0;

    var sp = resourceName.split('/');
    var resGif = '';
    var resJS = '';
    var resAudio = '';
    var resFramestart = 0;
    var resFramestop = -1;
    var resLoop = 0;
    if ((YDKJanim[sp[0]]) && (YDKJanim[sp[0]][sp[1]])) {
        resGif = 'res/'+YDKJanim[sp[0]][sp[1]]['res']+'/'+YDKJanim[sp[0]][sp[1]]['name']+'.gif';
        resJS = 'res/'+YDKJanim[sp[0]][sp[1]]['res']+'/'+YDKJanim[sp[0]][sp[1]]['name']+'.js';
        resFramestart = YDKJanim[sp[0]][sp[1]]['framestart'];
        if (YDKJanim[sp[0]][sp[1]]['loop']) resLoop = 1;
        if (YDKJanim[sp[0]][sp[1]]['framestop']) resFramestop = YDKJanim[sp[0]][sp[1]]['framestop'];
    }

    if ((YDKJsnd[sp[0]]) && (YDKJsnd[sp[0]][sp[1]])) {
        resAudio = 'res/'+YDKJsnd[sp[0]][sp[1]]['res']+'/'+YDKJsnd[sp[0]][sp[1]]['name']+'/'+YDKJsnd[sp[0]][sp[1]]['min'];
        if (YDKJsnd[sp[0]][sp[1]]['loop']) resLoop = 1;
    } else if ((YDKJsnd[sp[0]]) && (YDKJsnd[sp[0]]['SFX'+sp[1]])) {
        resAudio = 'res/'+YDKJsnd[sp[0]]['SFX'+sp[1]]['res']+'/'+YDKJsnd[sp[0]]['SFX'+sp[1]]['name']+'/'+YDKJsnd[sp[0]]['SFX'+sp[1]]['min'];
        if (YDKJsnd[sp[0]]['SFX'+sp[1]]['loop']) resLoop = 1;
    }

    this.animation = new YDKJAnimation(resGif,resJS,resAudio,resFramestart,resLoop,resFramestop);

    this.animation.ended(function() {
        thisResource.played = thisResource.animation.played;
        thisResource.isplaying = thisResource.animation.isplaying;
    });

    this.animation.ready(function(){
        thisResource.preloaded = 1;
        for(var i = 0; i < thisResource.readyFunctions.length; i++) {
            thisResource.readyFunctions[i].call(thisResource);
        }
    });
}

YDKJResource.prototype.ready = function(f) {
    if (!this.preloaded) this.readyFunctions.push(f); else f.call(this);
};

YDKJResource.prototype.ended = function(f,msbeforeend) {
    this.animation.ended(f,msbeforeend);
};

YDKJResource.prototype.delay = function(f,delay) {
    var thisResource = this;
    if (delay) setTimeout(function(){f.call(thisResource)},delay); else f.call(this);
};

YDKJResource.prototype.play = function() {
    var thisResource = this;
    this.played = 0;
    this.animation.ready(function(){
        thisResource.isplaying = 1;
        thisResource.animation.play();
    });
};

YDKJResource.prototype.stop = function() {
    this.isplaying = 0;
    this.animation.stop();
};

YDKJResource.prototype.reset = function() {
    this.isplaying = 0;
    this.animation.reset();
};

YDKJResource.prototype.setAnimCallback = function(callback) {
    this.animation.setAnimCallback(callback);
};

YDKJResource.prototype.free = function() {
    this.isplaying = 0;
    this.animation.free();
};

YDKJResource.prototype.length = function() {
    return this.animation.length();
};
