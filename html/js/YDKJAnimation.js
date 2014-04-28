/********** YDKJAnimation **********/

var animID=0;
function YDKJAnimation(urlGif,urlJS,urlAudio,framestart,loop,framestop) {
  this.id = animID++;
  this.urlGif = urlGif;
  this.urlJS = urlJS;
  this.urlAudio = urlAudio;
  if (typeof(framestart) === 'undefined') framestart = 0;
  if (typeof(loop) === 'undefined') loop = 0;
  if (typeof(framestop) === 'undefined') framestop = 0;
  this.framestart = framestart;
  this.loop = loop;
  this.framestop = framestop;
  this.seamlessLoop = 0;
  
  this.isplaying = 0;
  this.end = 0;
  this.endedFunctions = [];

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

  var thisAnim = this;
  
  var seamlessloopready = function() {
    thisAnim.preloaded = 1;
    for(var i = 0; i < thisAnim.readyFunctions.length; i++) {
      thisAnim.readyFunctions[i].call(thisAnim);
    }
  }
  
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
  }
  
  var jsready = function() {
    if (thisAnim.js) {
      thisAnim.tiles = thisAnim.js.res['tiles'];
      thisAnim.frames = thisAnim.js.res['frames'];
    }
    if (thisAnim.audio) thisAnim.audio.ready(audioready); else audioready();
  }
  
  var gifready = function() {
    if (thisAnim.js) thisAnim.js.ready(jsready); else jsready();
  }
  
  if (this.gif) this.gif.ready(gifready); else gifready();
  
  // Méthodes privées
    
  this.newScreen = function() {
    var thisdiv = $('#tmpscreen').find('#anim'+this.id);
    if (thisdiv.length == 0) {
      thisdiv = jQuery('<div />').attr('id','anim'+this.id);
      thisdiv.appendTo($('#tmpscreen'));
    }
    thisdiv.html('');
  }
  
  this.addTile = function(tileid, x, y) {
    var tmpscreen = $('#tmpscreen').find('#anim'+this.id);
    var ourtile = this.tiles[tileid];
    if (!ourtile) return false;
    var ourdiv = $('<div />');
    ourdiv.css({
      'background-image':'url("'+this.urlGif+'")',
      'background-repeat':'none',
      'background-position':(0-ourtile.x)+'px '+(0-ourtile.y)+'px',
      'width':(ourtile.w)+'px',
      'height':(ourtile.h)+'px',
      'position':'absolute',
      'left':x+'px',
      'top':y+'px',
    });
    ourdiv.appendTo(tmpscreen);
  }
  
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
  }
  
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
  }
  
  this.nextScreen = function() {
    // Ne pas remplacer tout le screen (uniquement supprimer lorsqu'on destroy l'animation (pas stop, on peut vouloir stopper sans supprimer))
    var thisdiv = $('#screen').find('#anim'+this.id);
    var tmpscreen = $('#tmpscreen').find('#anim'+this.id);
    if (thisdiv.length == 0) {
      thisdiv = jQuery('<div />').attr('id','anim'+this.id).css({
        'position':'absolute',
      });
      thisdiv.appendTo($('#screen'));
    }
    $('#screen').find('.markedAsRemoved').remove(); // Supprimer les éléments marqués
    thisdiv.html(tmpscreen.html()); // Meilleure façon de déplacer les éléments ?
    
    /*
    // Chrome n'aime pas cette façon non plus (en fait il aime pas en local uniquement... il gère le cache des images différemment il faut croire ?)
    var newscreen = $('#tmpscreen').clone(true);
    newscreen.attr('id','screen').attr('style',$('#screen').attr('style'));
    $('#screen').replaceWith(newscreen);
    */
  
    this.newScreen();
  }
  
  this.endTrigger = function(e) {
    if (this.end == 255) return false;
    // e = 1 : animation, e = 2 : audio
    this.end = this.end | e;
    if (((this.urlGif == '') && (this.urlAudio != '') && (this.end == 2)) 
     || ((this.urlGif != '') && (this.urlAudio == '') && (this.end == 1)) 
     || ((this.urlGif != '') && (this.urlAudio != '') && (this.end == 3))) {
      this.isplaying = 0;
      this.end = 255; // Pour éviter de relancer le trigger
      for(var i = 0; i < this.endedFunctions.length; i++) {
        this.endedFunctions[i].call(this);
      }
    }
  }
}

YDKJAnimation.prototype.ready = function(f) {
  if (!this.preloaded) this.readyFunctions.push(f); else f.call(this);
};

YDKJAnimation.prototype.ended = function(f) {
  if (this.end != 255) this.endedFunctions.push(f); else f.call(this);
}

YDKJAnimation.prototype.playAnim = function() {
  if (!this.preloaded) return false; // Ou bien attendre le preload ?
  
  this.isplaying = 1;
  this.end = 0;
  var thisAnim = this;
  
  if (this.urlGif != '') {
    this.newScreen();

    var framenum = this.framestart;
    var framestop = this.frames.length-1;
    if (this.framestop) framestop = this.framestop;
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
          thisAnim.endTrigger(1);
          clearInterval(intervaltimer);
          thisAnim.intervalTimer = 0;
        }
      }
    }
  
    //runanim();
    intervaltimer = setInterval(runanim,66); // Pourrait être calculé depuis frames[x].fps1/frames[x].fps2
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
            thisAnim.endTrigger(2);
          }
        }
        thisAnim.audiostopTimer = setTimeout(ended, audioelem.duration*1000+audiospecs.playDelay);
        if (audioelem.currentTime) audioelem.currentTime = 0;
        audioelem.volume=audiospecs.maxVolume;
        audioelem.play();
      }
    }
  }
}

YDKJAnimation.prototype.stopAnim = function() {
  this.isplaying = 0;
  
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
}

YDKJAnimation.prototype.resetAnim = function() {
  this.stopAnim();
  if (this.urlGif != '') {
    this.newScreen();
    this.nextScreen();
  }
}

YDKJAnimation.prototype.free = function() {
  this.stopAnim();
  if (this.gif) this.gif.free();
  if (this.js) this.js.free();
  if (this.audio) this.audio.free();
  jQuery('#screen').find('#anim'+this.id).addClass('markedAsRemoved'); // Sera retiré réellement à la prochaine animation (pour éviter les écrans noirs entre animations)
  jQuery('#tmpscreen').find('#anim'+this.id).remove();
}

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
}

YDKJAnimation.prototype.setAnimCallback = function(callback) {
  this.animCallback = callback;
}
