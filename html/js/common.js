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
	if(this.is.chrome) this.maxVolume = 0.8;
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

function YDKJTimer10() {
    this.frames = {
        'Still':{
            10:{framestart:69},
            9:{framestart:88},
            8:{framestart:107},
            7:{framestart:125},
            6:{framestart:144},
            5:{framestart:163},
            4:{framestart:182},
            3:{framestart:200},
            2:{framestart:218},
            1:{framestart:236},
            0:{framestart:261}
        },
        'Hide':{
            10:{framestart:73,framestop:75},
            9:{framestart:92,framestop:94},
            8:{framestart:110,framestop:112},
            7:{framestart:129,framestop:131},
            6:{framestart:148,framestop:150},
            5:{framestart:167,framestop:169},
            4:{framestart:185,framestop:187},
            3:{framestart:203,framestop:205},
            2:{framestart:221,framestop:223},
            1:{framestart:239,framestop:241},
            0:{framestart:264,framestop:266}
        },
        'Show':{
            10:{framestart:59,framestop:65},
            9:{framestart:79,framestop:85},
            8:{framestart:98,framestop:104},
            7:{framestart:116,framestop:122},
            6:{framestart:135,framestop:141},
            5:{framestart:154,framestop:160},
            4:{framestart:173,framestop:179},
            3:{framestart:191,framestop:197},
            2:{framestart:209,framestop:215},
            1:{framestart:227,framestop:233},
            0:{framestart:245,framestop:251}
        }
    };

    var resName = 'res/5QDemo/off4/8018';
    this.animation = new YDKJAnimation(resName+'.gif',resName+'.js','',73,0,75);
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
}

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
