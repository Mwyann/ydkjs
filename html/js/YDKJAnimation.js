/********** YDKJAnimation **********/

function YDKJAnimation(resource) {
    this.resource = resource;// Paramètres : urlGif,urlJS,urlAudio,framestart,loop,framestop
    this.div = 0;
    this.tmpdiv = 0;
    if (resource) {
        if (this.resource.urlGif !== undefined) this.urlGif = this.resource.urlGif; else this.urlGif = '';
        if (this.resource.urlJS !== undefined) this.urlJS = this.resource.urlJS; else this.urlJS = '';
        if (this.resource.urlAudio !== undefined) this.urlAudio = this.resource.urlAudio; else this.urlAudio = '';
        if (this.resource.framestart !== undefined) this.framestart = this.resource.framestart; else this.framestart = 0;
        if (this.resource.loop !== undefined) this.loop = this.resource.loop; else this.loop = 0;
        if (this.resource.framestop !== undefined) this.framestop = this.resource.framestop; else this.framestop = -1;
    } else {
        this.urlGif = '';
        this.urlJS = '';
        this.urlAudio = '';
        this.framestart = 0;
        this.loop = 0;
        this.framestop = -1;
    }
    this.seamlessLoop = 0;

    var thisAnim = this;

    this.isplaying = 0;
    this.played = 0;

    this.resetEndedFunctions = function() {
        thisAnim.endedFunctions = [];
        thisAnim.endedFunctions.push({
            ms:0,
            endTimeout:0,
            functions:[function(){
                thisAnim.played = 1;
                if (!thisAnim.loop) {
                    thisAnim.isplaying = 0;
                }
            }]
        });
    };
    this.resetEndedFunctions();

    this.tiles = 0;
    this.frames = 0;
    this.intervalTimer = 0;
    this.audiostopTimer = 0;
    this.html = {};

    this.preloaded = 0;
    this.readyFunctions = [];
    this.clickFunctions = [];
    this.frameFunctions = [];

    // Lancement du preload

    this.gif = 0;
    if (this.urlGif != '') this.gif = getYDKJFile('gif',this.urlGif);
    this.js = 0;
    if (this.urlJS != '') this.js = getYDKJFile('js',this.urlJS);
    this.audio = 0;
    if (this.urlAudio != '') this.audio = getYDKJFile('audio',this.urlAudio);

    // Vérifier le statut du preload, dans l'ordre inverse, soit : gif -> js -> audio -> seamlessloop

    var seamlessloopready = function() {
        thisAnim.preloaded = 1;
        for(var i = 0; i < thisAnim.readyFunctions.length; i++) {
            thisAnim.readyFunctions[i].call(thisAnim);
        }
    };

    var audioready = function() {
        if ((thisAnim.audio) && (thisAnim.loop)) {
            var audiofile = thisAnim.audio.res;
            if (audiofile) {
                var audioelem = audiofile.get(0);
                thisAnim.seamlessLoop = new SeamlessLoop();
                thisAnim.seamlessLoop.addUri(thisAnim.urlAudio,audioelem.duration*1000,1);
                seamlessloopready();
            }
        } else seamlessloopready();
    };

    var jsready = function() {
        if (thisAnim.js) {
            thisAnim.tiles = thisAnim.js.res['tiles'];
            thisAnim.frames = thisAnim.js.res['frames'];
        }
        if (thisAnim.audio) thisAnim.audio.ready(audioready); else audioready();
    };

    var gifready = function() {
        if (thisAnim.js) thisAnim.js.ready(jsready); else jsready();
    };

    if (this.gif) this.gif.ready(gifready); else gifready();
    this._volume = audiospecs.maxVolume;
    if (this.audio) this.volume(1);

    // Méthodes privées

    this.newScreen = function() {
        if (!this.tmpdiv) this.tmpdiv = jQuery('<div />');
        this.tmpdiv.html('');
    };

    this.addTile = function(tileid, x, y) {
        var ourtile = this.tiles[tileid];
        if (!ourtile) return false;
        var ourdiv = jQuery('<div />');
        ourdiv.css({
            'background-image':'url("'+this.urlGif+'")',
            'background-repeat':'no-repeat',
            'background-position':(0-ourtile.x)+'px '+(0-ourtile.y)+'px',
            'width':(ourtile.w)+'px',
            'height':(ourtile.h)+'px',
            'position':'absolute',
            'left':x+'px',
            'top':y+'px'
        }).on('mousedown',(function() {
            for(var i = 0; i < thisAnim.clickFunctions.length; i++) {
                thisAnim.clickFunctions[i].call(thisAnim);
            }
        }));
        ourdiv.appendTo(this.tmpdiv);
        return true;
    };

    this.addFrame = function(frameid) {
        var ourframe = this.frames[frameid];
        var val = 0;
        if (ourframe.nbimg > 0) {
            var offsetx = ourframe.img[0].ox;
            var offsety = ourframe.img[0].oy;
            //var sizex = ourframe.img[0].sx;
            //var sizey = ourframe.img[0].sy;
            val = ourframe.img[0].val;
            for(var i = 1; i <= ourframe.nbimg; i++) {
                this.addTile(ourframe.img[i].idx-1, offsetx+ourframe.img[i].ox, offsety+ourframe.img[i].oy);
                val = val | ourframe.img[i].val;
            }
            return val;
        }
        return val;
    };

    this.getFrameVal = function(frameid) {
        var ourframe = this.frames[frameid];
        var val = 0;
        if (ourframe.nbimg > 0) {
            val = ourframe.img[0].val;
            for(var i = 1; i <= ourframe.nbimg; i++) {
                val = val | ourframe.img[i].val;
            }
            return val;
        }
        return val;
    };

    this.nextScreen = function() {
        // Ne pas remplacer tout le screen (uniquement supprimer lorsqu'on destroy l'animation (pas stop, on peut vouloir stopper sans supprimer))
        //var screen = jQuery('#screen');
        if (!this.div) {
            this.div = jQuery('<div />').css({
                'position':'absolute'
            });
            this.div.appendTo(this.html.screen);
        }
        this.html.screen.find('.markedAsRemoved').remove(); // Supprimer les éléments marqués

        //this.div.html(this.tmpdiv.html()); // Méthode simple et rapide mais ne gère pas les évènements javascript on...

        /*
        var newdiv = this.tmpdiv.clone(true);
        newdiv.attr('style',this.div.attr('style'));
        this.div.replaceWith(newdiv);
        this.div = newdiv;
        */

        this.div.replaceWith(this.tmpdiv);
        this.div = this.tmpdiv;
        this.tmpdiv = 0;

        this.newScreen();
    };

    this.triggerEnd = function(idx) {
        var functions = this.endedFunctions[idx].functions; // On les sauvegarde au cas où qu'elles soient écrasées par l'une des fonctions...
        for(var i = 0; i < functions.length; i++) {
            functions[i].call(this);
        }
    }
}

YDKJAnimation.prototype.ready = function(f) {
    if (!this.preloaded) this.readyFunctions.push(f); else f.call(this);
};

YDKJAnimation.prototype.click = function(f) {
    if (f === false) this.clickFunctions = [];
    else this.clickFunctions.push(f);
};

YDKJAnimation.prototype.frame = function(f) {
    if (f === false) this.frameFunctions = [];
    else this.frameFunctions.push(f);
};

YDKJAnimation.prototype.ended = function(a,b) { // a = délai OU fonction OU false, b = fonction si a == délai.
    var f = a;
    var msbeforeend = 0;
    if (b !== undefined) {
        f = b;
        msbeforeend = a;
    }
    if (f === false) {
        this.resetEndedFunctions();
        return true;
    }
    if (!msbeforeend) msbeforeend = 0;
    if (!this.played) {
        var idx = -1;
        var i;
        for(i = 0; i < this.endedFunctions.length; i++) if (this.endedFunctions[i].ms == msbeforeend) idx = i;
        if (idx == -1) {
            idx = i;
            this.endedFunctions[i] = {ms:msbeforeend, functions:[]};
        }
        this.endedFunctions[idx].functions.push(f);
    } else f.call(this);
};

YDKJAnimation.prototype.delay = function(delay,f) {
    var thisAnim = this;
    if (delay > 0) setTimeout(function(){f.call(thisAnim)},delay); else f.call(this);
};

YDKJAnimation.prototype.play = function() {
    this.stop();
    if (!this.preloaded) {
        //this.ready(function(){this.play();});  // Ne pas attendre le preload (normalement tout est déjà préloadé)
        return true; // Retourne immédiatement, même si l'animation n'a pas encore joué...
    }

    this.isplaying = 1;
    var thisAnim = this;

    if (this.urlGif != '') {
        this.newScreen();

        var speed;
        if (typeof animationSpeed == 'undefined') speed = 66; else speed = animationSpeed;

        var framenum = this.framestart;
        var framestop = this.frames.length-1;
        if (this.framestop >= 0) framestop = this.framestop;
        this.intervalTimer = 0;
        var intervaltimer = 0;
        var runanim = function() {
            //setTimeout(runanim,66);
            var val = thisAnim.addFrame(framenum);
            if (((val & 4) == 0) || ((val & 8) != 0)) thisAnim.nextScreen();
            if (((val & 32) != 0) && ((val & 8) != 0) && (thisAnim.animCallback)) thisAnim.animCallback();
            if (thisAnim.html.debug)
                thisAnim.html.debug.html('frame '+framenum+'/'+(thisAnim.frames.length-1)+' ; val:'+val+' ; nbimg: '+thisAnim.frames[framenum].nbimg);
            for(var i = 0; i < thisAnim.frameFunctions.length; i++) {
                thisAnim.frameFunctions[i].call(this, framenum);
            }
            framenum++;
            if ((framenum > framestop) || ((val & 16) != 0)) {
                if (thisAnim.loop) framenum = thisAnim.framestart; else {
                    clearInterval(intervaltimer);
                    thisAnim.intervalTimer = 0;
                }
            }
        };

        intervaltimer = setInterval(runanim,speed); // Pourrait être calculé depuis frames[x].fps1/frames[x].fps2
        runanim();
        this.intervalTimer = intervaltimer;
    }

    if (this.audio) {
        if ((this.loop) && (this.seamlessLoop)) {
            this.seamlessLoop.start(1);
            this.seamlessLoop.volume(this._volume);
        } else {
            var audiofile = this.audio.res;
            if (audiofile) {
                var audioelem = audiofile.get(0);
                var ended = function() {
                    thisAnim.audiostopTimer = 0;
                    if (!thisAnim.loop) {
                        setTimeout(function() {
                            if (audioelem.readyState) {
                                audioelem.pause();
                                audioelem.currentTime = 0;
                            }
                        }, audiospecs.stopDelay);
                    }
                };
                thisAnim.audiostopTimer = setTimeout(ended, audioelem.duration*1000+audiospecs.playDelay);
                if ((audioelem.readyState) && (audioelem.currentTime)) audioelem.currentTime = 0;
                audioelem.play();
                audioelem.volume=this._volume;
            }
        }
    }

    // this.triggerEnd lorsque l'animation est terminée, basée sur this.length()
    // Dans le cas d'une boucle, il faudrait exécuter le "end" à la fin de chaque boucle ?
    if (!thisAnim.loop) {
        var lth = this.length();
        for(var i = 0; i < this.endedFunctions.length; i++) {
            (function(i){
                thisAnim.endedFunctions[i].endTimeout = setTimeout(function(){thisAnim.triggerEnd(i);},Math.max(0,parseInt(lth)+thisAnim.endedFunctions[i].ms));
            })(i);
        }
    }
    return true;
};

YDKJAnimation.prototype.stop = function() {
    this.isplaying = 0;
    for(var i = 0; i < this.endedFunctions.length; i++){
        if (this.endedFunctions[i].endTimeout) clearTimeout(this.endedFunctions[i].endTimeout);
        this.endedFunctions[i].endTimeout = 0;
    }

    if (this.urlGif != '') {
        if (this.intervalTimer) {
            clearInterval(this.intervalTimer);
            this.intervalTimer = 0;
        }
    }

    if (this.audio) {
        if ((this.loop) && (this.seamlessLoop)) {
            this.seamlessLoop.stop();
        } else {
            if (this.audiostopTimer) clearTimeout(this.audiostopTimer);
            this.audiostopTimer = 0;
            var audiofile = this.audio.res;
            if (audiofile) {
                var audioelem = audiofile.get(0);
                if (audioelem.readyState) {
                    audioelem.pause();
                    audioelem.currentTime = 0;
                }
            }
        }
    }
};

YDKJAnimation.prototype.reset = function(fullreset) {
    this.stop();
    this.played = 0;
    if (this.urlGif != '') {
        this.newScreen();
        this.nextScreen();
    }
    if (fullreset) this.ended(false);
};

YDKJAnimation.prototype.free = function() {
    this.stop();
    if (this.gif) this.gif.free();
    if (this.js) this.js.free();
    if (this.audio) this.audio.free();
    if (this.div) this.div.addClass('markedAsRemoved'); // Sera retiré réellement à la prochaine animation (pour éviter les écrans noirs entre animations)
    if (this.tmpdiv) this.tmpdiv.remove();
};

YDKJAnimation.prototype.volume = function(vol) {
    var thisAnim = this;
    if (vol > 1) vol = vol/100;
    vol = vol*audiospecs.maxVolume;
    this._volume = vol;
    //vol = Math.log(vol*9+1)/Math.LN10; // Volume logarithmique ?

    this.ready(function(){
        if (thisAnim.audio) {
            if ((thisAnim.loop) && (thisAnim.seamlessLoop)) {
                thisAnim.seamlessLoop.volume(thisAnim._volume);
            } else {
                var audiofile = thisAnim.audio.res;
                if (audiofile) {
                    var audioelem = audiofile.get(0);
                    audioelem.volume = thisAnim._volume;
                }
            }
        }
    });
};

YDKJAnimation.prototype.setAnimCallback = function(callback) {
    this.animCallback = callback;
};

YDKJAnimation.prototype.length = function() {
    var maxlength = 0;
    var length;
    if (this.urlGif != '') {
        var speed;
        if (typeof animationSpeed == 'undefined') speed = 66; else speed = animationSpeed;

        var framestart = this.framestart;
        var framestop = this.frames.length-1;
        if (this.framestop >= 0) framestop = this.framestop;
        var val = 0;
        for(var frameid = framestart; ((frameid<framestop) && ((val & 16) == 0)); frameid++) {
            val = this.getFrameVal(frameid);
        }
        length = (frameid-framestart+1)*speed;
        if (length > maxlength) maxlength = length;
    }

    if (this.audio) {
        var audiofile = this.audio.res;
        if (audiofile) {
            var audioelem = audiofile.get(0);
            length = (audioelem.duration*1000).toFixed(0);
            if (length > maxlength) maxlength = length;
        }
    }

    return maxlength;
};
