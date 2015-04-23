/********** YDKJFont **********/

function YDKJFont() {
    this.strings = {};
    this.fontdata = {};
}

YDKJFont.prototype.preload = function(callback){
    var thisFont = this;
    var fonts = ['JackCondensed','JackExtraCond','JackInput','JackRoman'];
    var testheight = 300;
    this.waitForWebFonts(fonts, function() {
        for(var i = 0, l = fonts.length; i < l; ++i) {
            (function(font) {
                var height = thisFont.measureTextHeight('giItT1WQy@!-/#', testheight.toString() + 'px "' + font + '"', 10, 10, parseInt(Math.round(testheight*1.5)), 1500);
                thisFont.fontdata[font] = {heightratio: testheight / height['height'], topratio: testheight/height['top']};
            })(fonts[i]);
        }
        callback();
    });
};

YDKJFont.prototype.waitForWebFonts = function(fonts, callback) {
    var loadedFonts = 0;
    for(var i = 0, l = fonts.length; i < l; ++i) {
        (function(font) {
            var node = document.createElement('canvas');
            // Characters that vary significantly among different fonts
            var text = 'giItT1WQy@!-/#';
            //node.innerHTML = text;
            // Visible - so we can measure it - but not on the screen
            node.style.position      = 'absolute';
            node.style.left          = '-10000px';
            node.style.top           = '-10000px';
            // Large font size makes even subtle changes obvious
            node.style.fontSize      = '300px';
            // Reset any font properties
            node.style.fontFamily    = 'sans-serif';
            node.style.fontVariant   = 'normal';
            node.style.fontStyle     = 'normal';
            node.style.fontWeight    = 'normal';
            node.style.letterSpacing = '0';
            document.body.appendChild(node);

            var ctx = node.getContext('2d');

            // Remember width with no applied web font
            ctx.font = "300px sans-serif";
            var width = ctx.measureText(text).width;

            ctx.font = '300px '+font;
            node.style.fontFamily = font;
            var widthChanged = 0;
            var timeOut = 20;

            var interval;
            var checkFont = function() {
                if (node) {
                    timeOut--;
                    // Compare current width with original width
                    if (ctx.measureText(text).width != width) { // If width has changed
                        widthChanged = 1;
                        width = ctx.measureText(text).width;
                    } else {
                        if (widthChanged) { // When width has stopped changing
                            timeOut = 0;
                        }
                    }

                    if (timeOut <= 0) {
                        ++loadedFonts;
                        node.parentNode.removeChild(node);
                        node = null;
                    }

                    // If all fonts have been loaded
                    if (loadedFonts >= fonts.length) {
                        if (interval) {
                            clearInterval(interval);
                        }
                        if (loadedFonts == fonts.length) {
                            callback();
                            return true;
                        }
                    }
                }
            };

            if(!checkFont()) {
                interval = setInterval(checkFont, 50);
            }
        })(fonts[i]);
    }
};

YDKJFont.prototype.measureTextHeight = function(text, font, left, top, width, height) {
    var tmpdiv = $('<div />');
    tmpdiv.html('gM');
    tmpdiv.css({'position':'absolute', 'left':'-1000px', 'top':'-1000px', 'font':font});
    $('body').append(tmpdiv);
    //var textheight = parseInt($(tmpdiv).css('font-size'),10); // font size (only one line)
    var textheight = parseInt($(tmpdiv).height(),10); // font height (with line break support)
    // DEBUG STUFF
    //tmpdiv.css({'position':'', 'left':'', 'top':'', 'float':'left'});
    //tmpdiv.html(text.replace("\n","<br/>"));
    // NO DEBUG
    tmpdiv.remove();

    // DEBUG STUFF
    var fontDraw = document.createElement("canvas");
    //$('body').append(fontDraw);
    // here we expect that font size will be less canvas geometry
    fontDraw.setAttribute("height", height);
    fontDraw.setAttribute("width", width);

    var ctx = fontDraw.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top'; // important!
    ctx.font = font;

    var tmptop = top+1;
    var sp = text.split("\n");
    $(sp).each(function(idx, el) {
        ctx.fillText(el, left, tmptop);
        tmptop += textheight;
    });

    // Get the pixel data from the canvas
    var data = ctx.getImageData(left, top, width, height).data,
        first = false,
        last = false,
        r = height,
        c = 0;

    // Find the last line with a non-white pixel
    while(!last && r) {
        r--;
        for(c = 0; c < width; c++) {
            if(data[r * width * 4 + c * 4 + 3]) {
                last = r;
                break;
            }
        }
    }

    // Find the first line with a non-white pixel
    r = 0;
    while(!first && (r < last)) {
        for(c = 0; c < width; c++) {
            if(data[r * width * 4 + c * 4 + 3]) {
                first = r;
                break;
            }
        }
        r++;
    }

    return {height: last - first + 1, top: first - top};
};

YDKJFont.prototype.displayText = function(string, posx, posy, width, height, transforms) {
    // string : format "text [id]"

    /* Text styles:
     0: normal style, eventually get the maximum font size (keeping ratio) until it fits (line breaks allowed)
     1: same as previous, just italics
     2: to be found out, not sure...
     4: shrink the text on one or both axis if it doesn’t fit (for example answers on standard questions - also used in JackAttack - 15000 - not sure if it’s correct there)
     5: don’t shrink text, instead hide anything outside the boundaries
     6: to be found out, used in 15000 and 3300
     7: 66% opacity (approx.)
     8: 33% opacity (approx.)
     */

};