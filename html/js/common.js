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

function animTransform(elem,fromx,tox,fromy,toy,speed,w,h,align,callback) {
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

        if (align == 'left') {
            elem.css({
                'left': (0 - ((w / 2) * (1 - expandValX))) + 'px',
                'top': (0 - ((h / 2) * (1 - expandValY))) + 'px'
            });
        } else if (align == 'right') {
            elem.css({
                'left': (w - ((w / 2) * (1 - expandValX))) + 'px',
                'top': (h - ((h / 2) * (1 - expandValY))) + 'px'
            });
        } // Sinon, toute autre valeur = centré (pour ne pas faire d'ambiguité, on peut mettre 'center')

        elem.css({
            '-webkit-transform':'scale('+expandValX+','+expandValY+')',
            '-moz-transform':'scale('+expandValX+','+expandValY+')',
            '-ms-transform':'scale('+expandValX+','+expandValY+')',
            '-o-transform':'scale('+expandValX+','+expandValY+')',
            'transform':'scale('+expandValX+','+expandValY+')'
        });
    };
    expandInterval = setInterval(expand,66);
}

function getSTRfromID(STR,type,id) {
    for(var i = 0; i < STR.length; i++) if ((STR[i].type == type) && (STR[i].id == id)) return STR[i].data;
    return '';
}

/********** Timer **********/

function YDKJTimer(timerType) {
    this.timerType = timerType;
}

YDKJTimer.prototype.preload = function(resources) {
    this.frames = resources['Common/Timer'+this.timerType+'/Frames'];
    this.animation = new YDKJAnimation(resources['Common/Timer'+this.timerType]);
    var thisTimer = this;
    this.step = 0; // 0 = Still, 1 = Hiding, 2 = Showing
    this.current = this.timerType;
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

YDKJTimer.prototype.ready = function(f) {
    this.animation.ready(f);
};

YDKJTimer.prototype.free = function() {
    if (this.animation) this.animation.free();
    this.animation = 0;
};

YDKJTimer.prototype.reset = function() {
    this.animation.reset();
};

YDKJTimer.prototype.playTimer = function(next) {
    if (typeof next == 'undefined') next = this.current-1;
    if ((next < 0) || (next > this.timerType)) return false;
    var thisTimer = this;
    this.animation.ready(function() {
        thisTimer.animation.html = thisTimer.html;
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

/********** MersenneTwister **********/

/*
 If you want to use this as a substitute for Math.random(), use the random()
 method like so:

 var m = new MersenneTwister();
 var randomNumber = m.random();

 You can also call the other genrand_{foo}() methods on the instance.

 If you want to use a specific seed in order to get a repeatable random
 sequence, pass an integer into the constructor:

 var m = new MersenneTwister(123);

 and that will always produce the same random sequence.

 Sean McCullough (banksean@gmail.com)
 */

/*
 A C-program for MT19937, with initialization improved 2002/1/26.
 Coded by Takuji Nishimura and Makoto Matsumoto.

 Before using, initialize the state by using init_genrand(seed)
 or init_by_array(init_key, key_length).

 Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:

 1. Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.

 3. The names of its contributors may not be used to endorse or promote
 products derived from this software without specific prior written
 permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


 Any feedback is very welcome.
 http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
 email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
 */

var MersenneTwister = function(seed) {
    if (seed == undefined) {
        seed = new Date().getTime();
    }
    /* Period parameters */
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 0x9908b0df;   /* constant vector a */
    this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
    this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

    this.mt = new Array(this.N); /* the array for the state vector */
    this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

    this.init_genrand(seed);
};

/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(s) {
    this.mt[0] = s >>> 0;
    for (this.mti=1; this.mti<this.N; this.mti++) {
        var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
        this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
            + this.mti;
        /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
        /* In the previous versions, MSBs of the seed affect   */
        /* only MSBs of the array mt[].                        */
        /* 2002/01/09 modified by Makoto Matsumoto             */
        this.mt[this.mti] >>>= 0;
        /* for >32 bit machines */
    }
};

/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function() {
    var y;
    var mag01 = new Array(0x0, this.MATRIX_A);
    /* mag01[x] = x * MATRIX_A  for x=0,1 */

    if (this.mti >= this.N) { /* generate N words at one time */
        var kk;

        if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
            this.init_genrand(5489); /* a default initial seed is used */

        for (kk=0;kk<this.N-this.M;kk++) {
            y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
            this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        for (;kk<this.N-1;kk++) {
            y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
            this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
        this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

        this.mti = 0;
    }

    y = this.mt[this.mti++];

    /* Tempering */
    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >>> 18);

    return y >>> 0;
};

// Some code from http://chancejs.com/

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function () {
    return this.genrand_int32() * (1.0 / 4294967296.0);
    /* divided by 2^32 */
};

/**
 *  Return a random integer
 *
 *  NOTE the max and min are INCLUDED in the range. So:
 *  chance.integer({min: 1, max: 3});
 *  would return either 1, 2, or 3.
 *
 *  @param {Number} [min] can specify a min
 *  @param {Number} [max] can specify a max
 *  @returns {Number} a single random integer number
 */
MersenneTwister.prototype.integer = function (min,max) {
    // 9007199254740992 (2^53) is the max integer number in JavaScript
    // See: http://vq.io/132sa2j
    return Math.floor(this.random() * (max - min + 1) + min);
};
