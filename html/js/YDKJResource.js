/********** YDKJResource **********/

function YDKJResource(resourceName) {
  this.resourceName = resourceName;
  
  this.preloaded = 0;
  this.readyFunctions = [];
  
  this.isplaying = 0;
  this.end = 0;
  this.endedFunctions = [];
  
  var sp = resourceName.split('/');
  var resGif = '';
  var resJS = '';
  var resAudio = '';
  var resFramestart = 0;
  var resFramestop = 0;
  var resLoop = 0;
  if ((YDKJanim[sp[0]]) && (YDKJanim[sp[0]][sp[1]])) {
    var resGif = 'res/'+YDKJanim[sp[0]][sp[1]]['res']+'/'+YDKJanim[sp[0]][sp[1]]['name']+'.gif';
    var resJS = 'res/'+YDKJanim[sp[0]][sp[1]]['res']+'/'+YDKJanim[sp[0]][sp[1]]['name']+'.js';
    var resFramestart = YDKJanim[sp[0]][sp[1]]['framestart'];
    if (YDKJanim[sp[0]][sp[1]]['loop']) var resLoop = 1;
    if (YDKJanim[sp[0]][sp[1]]['framestop']) var resFramestop = YDKJanim[sp[0]][sp[1]]['framestop'];
  }
  
  if ((YDKJsnd[sp[0]]) && (YDKJsnd[sp[0]][sp[1]])) {
    var resAudio = 'res/'+YDKJsnd[sp[0]][sp[1]]['res']+'/'+YDKJsnd[sp[0]][sp[1]]['name']+'/'+YDKJsnd[sp[0]][sp[1]]['min'];
    if (YDKJsnd[sp[0]][sp[1]]['loop']) var resLoop = 1;
  } else if ((YDKJsnd[sp[0]]) && (YDKJsnd[sp[0]]['SFX'+sp[1]])) {
    var resAudio = 'res/'+YDKJsnd[sp[0]]['SFX'+sp[1]]['res']+'/'+YDKJsnd[sp[0]]['SFX'+sp[1]]['name']+'/'+YDKJsnd[sp[0]]['SFX'+sp[1]]['min'];
    if (YDKJsnd[sp[0]]['SFX'+sp[1]]['loop']) var resLoop = 1;
  }
  
  this.animation = new YDKJAnimation(resGif,resJS,resAudio,resFramestart,resLoop,resFramestop);

  var thisResource = this;

  this.animation.ended(function() {
    thisResource.isplaying = 0;
    thisResource.end = 1;
    for(var i = 0; i < thisResource.endedFunctions.length; i++) {
      thisResource.endedFunctions[i].call(thisResource);
    }
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

YDKJResource.prototype.ended = function(f) {
  if (!this.end) this.endedFunctions.push(f); else f.call(this);
};

YDKJResource.prototype.delay = function(f,delay) {
  var thisResource = this;
  if (delay) setTimeout(function(){f.call(thisResource)},delay); else f.call(this);
}

YDKJResource.prototype.play = function() {
  var thisResource = this;
  this.end = 0;
  this.animation.ready(function(){
    thisResource.isplaying = 1;
    thisResource.animation.play();
  });
}

YDKJResource.prototype.stop = function() {
  this.isplaying = 0;
  this.animation.stop();
}

YDKJResource.prototype.reset = function() {
  this.isplaying = 0;
  this.animation.reset();
}

YDKJResource.prototype.setAnimCallback = function(callback) {
  this.animation.setAnimCallback(callback);
}

YDKJResource.prototype.free = function() {
  this.isplaying = 0;
  this.animation.free();
}
