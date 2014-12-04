/********** Quelques fonctions pour le son **********/

function AudioSpecs() {
    this.is = {
        ff: Boolean(!(window.mozInnerScreenX == null) && /firefox/.test( navigator.userAgent.toLowerCase() )),
        ie: Boolean(document.all && !window.opera),
        opera: Boolean(window.opera),
        chrome: Boolean(window.chrome),
        safari: Boolean(!window.chrome && /safari/.test( navigator.userAgent.toLowerCase() ) && window.getComputedStyle && !window.globalStorage && !window.opera)
    };
    this.playDelay = -30; // IE 1500
    this.stopDelay = 30;  // IE 20
    this.maxVolume = 1;
    if(this.is.chrome) this.playDelay = -25;
    if(this.is.chrome) this.stopDelay = 25;
    if(this.is.chrome) this.maxVolume = 0.5;
    if(this.is.ff) this.playDelay = -25;
    if(this.is.ff) this.stopDelay = 85;
    if(this.is.opera) this.playDelay = 5;
    if(this.is.opera) this.stopDelay = 0;
}

var audiospecs = new AudioSpecs();

/********** Quelques fonctions pour le preload **********/

// 'fireOne' argument is optional, if set, will invoke the callback once for every
// image in the 'this' collection, thus making 'this' in the callback that element alone
// If it's not used, the callback will be invoked once all the images in the collection has
// been loaded. And 'this' will be the jQuery collection of the filtered 'img' elements.

jQuery.fn.imagesLoaded = function(callback, fireOne) {
    var
        args = arguments,
        elems = this.filter('img'),
        elemsLen = elems.length - 1;

    elems
        .bind('load', function(e) {
            if (fireOne) {
                !elemsLen-- && callback.call(elems, e);
            } else {
                callback.call(this, e);
            }
        }).each(function() {
            // cached images don't fire load sometimes, so we reset src.
            if (this.complete || this.complete === undefined) {
                if (jQuery(this).hasClass('alreadyLoaded')) jQuery(this).trigger('load'); else this.src = this.src;
            }
        });
};

function waitForAudio(selector,callback) {
    var waitloop = function() {
        var elems = jQuery(selector);
        var totalAudio = elems.length;
        elems.each(function(){if (this.duration) totalAudio--;});
        if (totalAudio) window.setTimeout(function(){waitloop()},50); else callback.call();
    };
    waitloop();
}

/********** Saisie au clavier **********/

function bindKeyListener(callback,timeout){
    if (typeof(timeout) === 'undefined') timeout = 0;
    var listener = function(event){callback(event.which)};
    jQuery(window).bind('keypress',listener);
    return listener;
}

function unbindKeyListener(listener) {
    jQuery(window).unbind('keypress',listener);
}

/********** Animation de transformation **********/

function animTransform(elem,fromx,tox,fromy,toy,speed,w,h,callback) {
    var expandInterval = 0;
    var expandValX = fromx;
    var expandValY = fromy;
    var expand = function() {
        expandValX += (tox-fromx)*speed;
        expandValY += (toy-fromy)*speed;

        if (tox > fromx) {if (expandValX >= tox) expandValX = tox;} else {if (expandValX <= tox) expandValX = tox;}
        if (toy > fromy) {if (expandValY >= toy) expandValY = toy;} else {if (expandValY <= toy) expandValY = toy;}

        if ((expandValX == tox) && (expandValY == toy)) {
            clearInterval(expandInterval);
            if (callback) callback();
        }

        elem.css({
            'left':(0-((w/2)*(1-expandValX)))+'px',
            'top':(0-((h/2)*(1-expandValY)))+'px',
            '-webkit-transform':'scale('+expandValX+', '+expandValY+')',
            '-moz-transform':'scale('+expandValX+', '+expandValY+')',
            '-ms-transform':'scale('+expandValX+', '+expandValY+')',
            '-o-transform':'scale('+expandValX+', '+expandValY+')',
            'transform':'scale('+expandValX+', '+expandValY+')'
        });
    };
    expandInterval = setInterval(expand,66);
}

function getSTRfromID(STR,id) {
    for(var i = 0; i < STR.length; i++) if (STR[i].id == id) return STR[i].str;
    return '';
}

/********** Timer **********/

function YDKJTimer10() {}

YDKJTimer10.prototype.preload = function(resources) {
    this.frames = resources['Common/Timer10/Frames'];
    this.animation = new YDKJAnimation(resources['Common/Timer10']);
    var thisTimer = this;
    this.step = 0; // 0 = Still, 1 = Hiding, 2 = Showing
    this.current = 10;
    this.next = 0;
    this.animation.ended(function() {
        if (thisTimer.step == 1) {
            thisTimer.current = thisTimer.next;
            thisTimer.animation.framestart = thisTimer.frames.Show[thisTimer.current].framestart;
            thisTimer.animation.framestop = thisTimer.frames.Show[thisTimer.current].framestop;
            thisTimer.step = 2;
            thisTimer.animation.reset();
            thisTimer.animation.play();
        } else if (thisTimer.step == 2) {
            thisTimer.animation.framestart = thisTimer.frames.Still[thisTimer.current].framestart;
            thisTimer.animation.framestop = thisTimer.frames.Still[thisTimer.current].framestart;
            thisTimer.step = 0;
            thisTimer.animation.reset();
            thisTimer.animation.play();
        }
    });
};

YDKJTimer10.prototype.ready = function(f) {
    this.animation.ready(f);
};

YDKJTimer10.prototype.free = function() {
    if (this.animation) this.animation.free();
    this.animation = 0;
};

YDKJTimer10.prototype.playTimer = function(next) {
    if (typeof next == 'undefined') next = this.current-1;
    if ((next < 0) || (next > 10)) return false;
    var thisTimer = this;
    this.animation.ready(function() {
        if (next == thisTimer.current) {
            thisTimer.animation.framestart = thisTimer.frames.Still[thisTimer.current].framestart;
            thisTimer.animation.framestop = thisTimer.frames.Still[thisTimer.current].framestart;
            thisTimer.step = 0;
            thisTimer.animation.reset();
            thisTimer.animation.play();
        } else {
            thisTimer.animation.framestart = thisTimer.frames.Hide[thisTimer.current].framestart;
            thisTimer.animation.framestop = thisTimer.frames.Hide[thisTimer.current].framestop;
            thisTimer.step = 1;
            thisTimer.next = next;
            thisTimer.animation.reset();
            thisTimer.animation.play();
        }
    });
    return next;
};
