/********** YDKJFile **********/

var preloadpool = [];
var preloadfifo = [];
var preloadprocesses = 0;
var preloaddiv = jQuery('<div />').css('display','none').appendTo(jQuery('body'));

function YDKJFile(filetype,url) {
    this.filetype = filetype;
    this.url = url;
    this.res = 0;

    this.preloaded = 0;
    this.readyFunctions = [];

    if (preloadprocesses < 3) {
        preloadprocesses++;
        this.preload();
    } else preloadfifo.push(this);
}

YDKJFile.prototype.preload = function(f) {
    var thisFile = this;

    var isready = function() {
        thisFile.preloaded = 1;

        var nextfile = preloadfifo.shift();
        if (nextfile) nextfile.preload(); else preloadprocesses--;

        for(var i = 0; i < thisFile.readyFunctions.length; i++) {
            thisFile.readyFunctions[i].call(thisFile);
        }
    };

    if (this.filetype == 'gif') {
        this.res = jQuery('<img />').attr('src',this.url);
        preloaddiv.append(this.res);
        this.res.imagesLoaded(isready);
    }

    if (this.filetype == 'js') {
        if (window.location.protocol == 'file:') {
            res = []; // Méthode qui semble fonctionner, mais si il y a une race condition, la variable va être écrasée...
            loadScriptOldSchool(this.url,function() {
                thisFile.res = res;
                isready();
            });
        } else {
            jQuery.ajax({
                url: this.url,
                type: 'get',
                dataType: 'text',
                success: function (html, status, xhr) {
                    var res = [];
                    eval(html);
                    thisFile.res = res;
                    isready();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //displayLoader(false);
                }
            });
        }
    }

    if (this.filetype == 'audio') {
        this.res = YDKJaudiomanager.lease();
        var a = this.res.get(0); // Hope that we got a lease here...
        if (a.canPlayType('audio/ogg')) this.res.append('<source />').children().last().attr('type','audio/ogg').attr('src',this.url+'.ogg');
        else if (a.canPlayType('audio/mpeg')) this.res.append('<source />').children().last().attr('type','audio/mpeg').attr('src',this.url+'.mp3');
        else {
            this.res.append('<source />').children().last().attr('type','audio/ogg').attr('src',this.url+'.ogg');
            this.res.append('<source />').children().last().attr('type','audio/mpeg').attr('src',this.url+'.mp3');
        }
        waitForAudio(this.res,isready);
    }
};

YDKJFile.prototype.ready = function(f) {
    if (!this.preloaded) this.readyFunctions.push(f); else f.call(this);
};

YDKJFile.prototype.free = function() {
    preloadpool[this.url].used--;
    if (preloadpool[this.url].used <= 0) {
        if (this.res) {
            if (this.filetype == 'gif') this.res.remove();
            if (this.filetype == 'audio') YDKJaudiomanager.release(this.res);
        }
        this.res = 0;
        preloadpool[this.url] = 0;
    }
};

function getYDKJFile(filetype,url) {
    if (preloadpool[url]) {
        preloadpool[url].used++;
        return preloadpool[url].file;
    }
    var f = new YDKJFile(filetype,url);
    preloadpool[url] = {file:f,used:1};
    return f;
}
