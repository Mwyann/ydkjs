/********** YDKJFont **********/

function YDKJFont() {
    this.strings = {};
    this.fontdata = {};
    this.textdata = {
        // ModeCategory
        100: {font:'JackRoman',size:38,color:'#FFF'}, // Player name with shadow
        102: {font:'JackRoman',size:38,color:'#FFF',opacity:0.15},
        103: {font:'JackRoman',size:38,color:'#FFF',opacity:0.40},
        1010:{font:'JackRoman',size:29,color:'#FC0',halign:'l'}, // Categories text
        1020:{font:'JackRoman',size:29,color:'#FC0',halign:'l'},
        1030:{font:'JackRoman',size:29,color:'#FC0',halign:'l'}
    };
}

YDKJFont.prototype.preload = function(callback){
    var thisFont = this;
    var fonts = ['JackCondensed','JackExtraCond','JackInput','JackRoman'];
    var testheight = 300;
    this.waitForWebFonts(fonts, function() {
        for(var i = 0, l = fonts.length; i < l; ++i) {
            (function(font) {
                var height = thisFont.measureTextHeight('giItT1WQy@!-/#', testheight.toString() + 'px "' + font + '"', 10, 10, parseInt(Math.round(testheight*1.5)), 1500);
                thisFont.fontdata[font] = {heightratio: testheight / height['height'], topratio: height['top']/testheight};
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

YDKJFont.prototype.makeText = function(textid, width, height, transforms) {
    // string : string id

    /* Text styles:
     0: normal style, eventually get the maximum font size (keeping ratio) until it fits (line breaks allowed)
     1: same as previous, just italics
     2: Seems to be an information about the final size, for example when used in conjunction with style 5 (see 10000 - Categories). Or it might be "val & 8".
     4: shrink the text on one or both axis if it doesn’t fit (for example answers on standard questions - also used in JackAttack - 15000 - not sure if it’s correct there)
     5: don’t shrink text, instead hide anything outside the boundaries
     6: to be found out, used in 15000 and 3300
     7: 66% opacity (approx.)
     8: 33% opacity (approx.)
     */

    if (transforms === undefined) transforms = 0;

    var div = jQuery('<div />');
    var container = jQuery('<div />');
    div.appendTo(container);

    var string = textid+'/'+transforms;

    if (this.textdata[textid] !== undefined) {
        if (this.strings[textid] !== undefined) string = this.strings[textid];

        var textdata = this.textdata[textid];
        var font = textdata['font'];
        var fontsize = Math.floor(textdata['size']*this.fontdata[font].heightratio).toFixed(0);
        var left = -2;
        var top = -2-Math.floor(textdata['size']*this.fontdata[font].topratio).toFixed(0);

        container.css({
            'width': (width)+'px',
            'height': (height)+'px'
        });
        div.css({
            'width': (width)+'px',
            'position': 'relative',
            'left': left+'px',
            'top': top+'px',
            'color': this.textdata[textid]['color'],
            'font': (fontsize)+'px/'+(fontsize)+'px "'+font+'"'
        }).html(string.replace(/(\n)+/g, '<br />').replace(/ /g,'&#8197;')); // Line breaks and thin spaces

        var halign = 'c';
        if (textdata.halign !== undefined) halign = textdata.halign;
        if (halign == 'c') {
            div.css({
                'text-align':'center'
            });
        }

        var valign = 'c';
        if (textdata.valign !== undefined) valign = textdata.valign;
        if (valign == 'c') {
            div.css({
                'vertical-align':'middle',
                'display':'inline-block'
            });
            container.css({
                'height': (height)+'px',
                'line-height': (height)+'px'
            });
        }

        var opacity = 1;
        if (textdata.opacity !== undefined) opacity = textdata.opacity;
        if (transforms == 7) opacity = opacity*0.66;
        if (transforms == 8) opacity = opacity*0.33;
        div.css({
            'opacity':opacity
        });

        if (transforms == 2) {
            this.textdata[textid]['fullwidth'] = width;
            this.textdata[textid]['fullheight'] = height;
            return false;
        }

        if (transforms == 5) {
            var fullwidth = width;
            if (this.textdata[textid]['fullwidth'] !== undefined) fullwidth = this.textdata[textid]['fullwidth'];

            div.css({
                'width': fullwidth+'px'
            });
            container.css({
                'width': width+'px',
                'overflow': 'hidden'
            });
        }
    } else {
        div.css({
            'background-color': '#999',
            'opacity': '0.5',
            'width': (width) + 'px',
            'height': (height) + 'px'
        }).html(string);
    }

    return container;
};