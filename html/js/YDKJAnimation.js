/********** YDKJAnimation **********/

var animID=0;
function YDKJAnimation(urlGif,urlJS,urlAudio,framestart,loop,framestop) {
  this.id = animID++;
  this.urlGif = urlGif;
  this.urlJS = urlJS;
  this.urlAudio = urlAudio;
  if (typeof(framestart) === 'undefined') framestart = 0;
  if (typeof(loop) === 'undefined') loop = 0;
  if (typeof(framestop) === 'undefined') framestop = -1;
  this.framestart = framestart;
  this.loop = loop;
  this.framestop = framestop;
  this.seamlessLoop = 0;

  var thisAnim = this;

  this.isplaying = 0;
  this.played = 0;
  this.endedFunctions = [];
  this.endedFunctions.push({
    ms:0,
    endTimeout:0,
    functions:[function(){
      thisAnim.played = 1;
      if (!thisAnim.loop) {
        thisAnim.isplaying = 0;
      }
    }]
  });

  this.tiles = 0;
  this.frames = 0;
  this.intervalTimer = 0;
  this.audiostopTimer = 0;

  this.preloaded = 0;
  this.readyFunctions = [];

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
        thisAnim.seamlessLoop.addUri(thisAnim.urlAudio,audioelem.duration*1000,'loop'+thisAnim.id);
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

  // Méthodes privées

  this.newScreen = function() {
    var tmpscreen = jQuery('#tmpscreen');
    var thisdiv = tmpscreen.find('#anim'+this.id);
    if (thisdiv.length == 0) {
      thisdiv = jQuery('<div />').attr('id','anim'+this.id);
      thisdiv.appendTo(tmpscreen);
    }
    thisdiv.html('');
  };

  this.addTile = function(tileid, x, y) {
    var tmpscreen = jQuery('#tmpscreen').find('#anim'+this.id);
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
    });
    ourdiv.appendTo(tmpscreen);
    return true;
  };

  this.addFrame = function(frameid) {
    var ourframe = this.frames[frameid];
    var val = 0;
    if (ourframe.nbimg > 0) {
      var offsetx = ourframe.img[0].ox;
      var offsety = ourframe.img[0].oy;
      var sizex = ourframe.img[0].sx;
      var sizey = ourframe.img[0].sy;
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
    var screen = jQuery('#screen');
    var thisdiv = screen.find('#anim'+this.id);
    var tmpscreen = jQuery('#tmpscreen').find('#anim'+this.id);
    if (thisdiv.length == 0) {
      thisdiv = jQuery('<div />').attr('id','anim'+this.id).css({
        'position':'absolute'
      });
      thisdiv.appendTo(screen);
    }
    screen.find('.markedAsRemoved').remove(); // Supprimer les éléments marqués
    thisdiv.html(tmpscreen.html()); // Meilleure façon de déplacer les éléments ?

    /*
    // Chrome n'aime pas cette façon non plus (en fait il aime pas en local uniquement... il gère le cache des images différemment il faut croire ?)
    var newscreen = jQuery('#tmpscreen').clone(true);
    newscreen.attr('id','screen').attr('style',jQuery('#screen').attr('style'));
     jQuery('#screen').replaceWith(newscreen);
    */

    this.newScreen();
  };

  this.triggerEnd = function(idx) {
    for(var i = 0; i < this.endedFunctions[idx].functions.length; i++) {
      this.endedFunctions[idx].functions[i].call(this);
    }
  }
}

YDKJAnimation.prototype.ready = function(f) {
  if (!this.preloaded) this.readyFunctions.push(f); else f.call(this);
};

YDKJAnimation.prototype.ended = function(f,msbeforeend) {
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

YDKJAnimation.prototype.delay = function(f,delay) {
  var thisAnim = this;
  if (delay) setTimeout(function(){f.call(thisAnim)},delay); else f.call(this);
};

YDKJAnimation.prototype.play = function() {
  if (!this.preloaded) return false; // Ou bien attendre le preload ?

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
      jQuery('#debuglive').html('frame '+framenum+'/'+(thisAnim.frames.length-1)+' ; val:'+val);
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
      this.seamlessLoop.volume=audiospecs.maxVolume;
      this.seamlessLoop.start('loop'+this.id);
    } else {
      var audiofile = this.audio.res;
      if (audiofile) {
        var audioelem = audiofile.get(0);
        var ended = function() {
          thisAnim.audiostopTimer = 0;
          if (!thisAnim.loop) {
            setTimeout(function() {
              audioelem.pause();
              audioelem.currentTime = 0;
            }, audiospecs.stopDelay);
          }
        };
        thisAnim.audiostopTimer = setTimeout(ended, audioelem.duration*1000+audiospecs.playDelay);
        if (audioelem.currentTime) audioelem.currentTime = 0;
        audioelem.volume=audiospecs.maxVolume;
        audioelem.play();
      }
    }
  }

  // this.triggerEnd lorsque l'animation est terminée, basée sur this.length()
  // Dans le cas d'une boucle, il faudrait exécuter le "end" à la fin de chaque boucle ?
  if (!thisAnim.loop) {
      var lth = this.length();
      for(var i = 0; i < this.endedFunctions.length; i++) {
        (function(i){
          thisAnim.endedFunctions[i].endTimeout = setTimeout(function(){thisAnim.triggerEnd(i);},Math.max(0,lth-thisAnim.endedFunctions[i].ms));
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
        audioelem.pause();
        audioelem.currentTime = 0;
      }
    }
  }
};

YDKJAnimation.prototype.reset = function() {
  this.stop();
  if (this.urlGif != '') {
    this.newScreen();
    this.nextScreen();
  }
};

YDKJAnimation.prototype.free = function() {
  this.stop();
  if (this.gif) this.gif.free();
  if (this.js) this.js.free();
  if (this.audio) this.audio.free();
  jQuery('#screen').find('#anim'+this.id).addClass('markedAsRemoved'); // Sera retiré réellement à la prochaine animation (pour éviter les écrans noirs entre animations)
  jQuery('#tmpscreen').find('#anim'+this.id).remove();
};

YDKJAnimation.prototype.setVolume = function(vol) {
  if (vol > 1) vol = vol/100;
  vol = vol*audiospecs.maxVolume;

  if (this.audio) {
    if ((this.loop) && (this.seamlessLoop)) {
      this.seamlessLoop.setVolume(vol);
    } else {
      var audiofile = this.audio.res;
      if (audiofile) {
        var audioelem = audiofile.get(0);
        audioelem.volume = vol;
      }
    }
  }
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
      var ourframe = this.frames[frameid];
      val = this.getFrameVal(frameid);
    }
    length = (frameid-framestart)*speed;
    if (length > maxlength) maxlength = length;
  }

  if (this.audio) {
    var audiofile = this.audio.res;
    if (audiofile) {
      var audioelem = audiofile.get(0);
      length = audioelem.duration*1000;
      if (length > maxlength) maxlength = length;
    }
  }

  return maxlength;
};
