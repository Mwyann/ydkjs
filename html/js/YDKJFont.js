/********** YDKJFont **********/

function YDKJFont() {
    this.strings = {};
    this.fontdata = {};
    this.textdata = {
        // Player's names and scores
        110: {font:'JackRoman',size:23,color:['#FFF']}, // Player 1's name
        115: {font:'JackRoman',size:23,color:['#FFF']}, // Player 1's score
        120: {font:'JackRoman',size:23,color:['#FFF']}, // Player 2's name
        125: {font:'JackRoman',size:23,color:['#FFF']}, // Player 2's score
        130: {font:'JackRoman',size:23,color:['#FFF']}, // Player 3's name
        135: {font:'JackRoman',size:23,color:['#FFF']}, // Player 3's score
        // ModeCategory
        100: {font:'JackRoman',size:38,color:['#FFF']}, // Player name with shadow
        102: {font:'JackRoman',size:38,color:['#FFF'],opacity:0.15},
        103: {font:'JackRoman',size:38,color:['#FFF'],opacity:0.40},
        1010:{font:'JackRoman',size:29,color:['#FC0'],halign:'l'}, // Categories text
        1020:{font:'JackRoman',size:29,color:['#FC0'],halign:'l'},
        1030:{font:'JackRoman',size:29,color:['#FC0'],halign:'l'},
        // Questions
        1100:{font:'JackExtraCond',size:60,color:['#FFF','#666','#AAA']}, // Big category title TODO: font size can change with text length, also check real font size
        1200:{font:'JackRoman',size:20,color:['#33F'],halign:'l'}, // Category title, header TODO: check real font size
        1205:{font:'JackRoman',size:20,color:['#33F'],halign:'r'}, // Category value, header TODO: check real font size
        1210:{font:'JackExtraCond',size:40,color:['#FFF']}, // Question TODO: font size can change with text length, also check real font size
        1211:{font:'JackCondensed',size:26,color:['#FC0','#FC0'],halign:'l'}, // Answer 1 TODO: check real font size ; 2nd color should be #F00 once good answer is found
        1212:{font:'JackCondensed',size:26,color:['#FC0','#FC0'],halign:'l'}, // Answer 2 TODO: check real font size
        1213:{font:'JackCondensed',size:26,color:['#FC0','#FC0'],halign:'l'}, // Answer 3 TODO: check real font size
        1214:{font:'JackCondensed',size:26,color:['#FC0','#FC0'],halign:'l'}, // Answer 4 TODO: check real font size
        //JackAttack
        1499:{font:'JackCondensed',size:40,color:['#FFF','#666','#AAA']}, // Hint TODO: check real font size
        1510:{font:'JackCondensed',size:28,color:['#FFF','#666','#AAA']}, // Answers TODO: check real font size
        1511:{font:'JackCondensed',size:28,color:['#FFF']},
        1512:{font:'JackCondensed',size:28,color:['#FFF'],opacity:0.40},
        1513:{font:'JackCondensed',size:28,color:['#FFF'],opacity:0.15},
        211:{font:'JackRoman',size:20,color:['#FFF']}, // Players names when lost
        221:{font:'JackRoman',size:20,color:['#FFF']},
        231:{font:'JackRoman',size:20,color:['#FFF']},
        216:{font:'JackRoman',size:20,color:['#F00','#A00','#600']}, // 2000F when lost
        226:{font:'JackRoman',size:20,color:['#F00','#A00','#600']},
        236:{font:'JackRoman',size:20,color:['#F00','#A00','#600']},
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

YDKJFont.prototype.makeText = function(textid, width, height, transforms, val, debug) {
    // string : string id

    /* Text styles:
     0: normal style, eventually get the maximum font size (keeping ratio) until it fits (line breaks allowed)
     1: same as previous, just italics
     2: Seems to be an information about the normal text size, for example when used in conjunction with style 4 and 5 (see 10000 - Categories and 14000 - DisOrDat).
     4: shrink the text on one or both axis if it doesn’t fit (for example answers on standard questions - also used in JackAttack - 15000 - not sure if it’s correct there)
     5: don’t shrink text, instead hide anything outside the boundaries
     6: First color to apply (color by default). To be found out, used in 15000 and 3300...
     7: Second color, or opacity (for ex. 66%)
     8: Third color, or opacity (for ex. 33%)

     Val & 1 : text is horizontally reversed (used in conjunction with style 4) (or maybe it is defined in the style 6/7, see 15000).

     Usage of style 2 and 4:
     Get the final size with the style 2 (like for the style 5), then apply the transformation so that the final box fits into the temporary box.
     So you just need to apply the transformation ratio between the current width/height and the final width/height.
     */

    if (transforms === undefined) transforms = 0;
    if (debug === undefined) debug = 0;

    var div = jQuery('<div />');
    var container = jQuery('<div />');
    div.appendTo(container);

    var string = textid+'/'+transforms+'/'+val;

    if ((!debug) && ((this.textdata[textid] !== undefined) && (this.textdata[textid]['font'] !== undefined))) {
        if (this.strings[textid] !== undefined) string = this.strings[textid];

        var textdata = this.textdata[textid];
        var font = textdata['font'];
        var fontsize = Math.floor(textdata['size']*this.fontdata[font].heightratio).toFixed(0);
        var left = 0;
        //var top = -2-Math.floor(textdata['size']*this.fontdata[font].topratio).toFixed(0);
        var top = -3;
        var colorid = 0;
        if (textdata.colorid !== undefined) colorid = textdata.colorid;
        if (textdata['color'][colorid] === undefined) colorid = 0;

        container.css({
            'width': (width)+'px',
            'height': (height)+'px'
        });
        div.css({
            'width': (width)+'px',
            'position': 'relative',
            'left': left+'px',
            'top': top+'px',
            'color': textdata['color'][colorid],
            'font': (fontsize)+'px/'+(fontsize)+'px "'+font+'"'
        }).html(string.replace(/(\n)+/g, '<br />').replace(/ /g,'&#8197;')); // Line breaks and thin spaces

        var halign = 'c';
        if (textdata.halign !== undefined) halign = textdata.halign;
        if (halign == 'l') {
            div.css({
                'text-align':'left'
            });
        }
        if (halign == 'c') {
            div.css({
                'text-align':'center'
            });
        }
        if (halign == 'r') {
            div.css({
                'text-align':'right'
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
        //if (transforms == 7) opacity = opacity*0.66;
        //if (transforms == 8) opacity = opacity*0.33;
        div.css({
            'opacity':opacity
        });

        if (transforms == 1) {
            div.css({
                'font-style':'italic'
            });
        }

        if (transforms == 2) {
            if (this.textdata[textid] === undefined) this.textdata[textid] = {};
            this.textdata[textid]['fullwidth'] = width;
            this.textdata[textid]['fullheight'] = height;
            return false;
        }

        if (transforms == 4) {
            var realcontainer = jQuery('<div />');
            container.appendTo(realcontainer);
            var fullwidth = width;
            if (this.textdata[textid]['fullwidth'] !== undefined) fullwidth = this.textdata[textid]['fullwidth'];
            else if (this.textdata[Math.floor(textid/10)*10] !== undefined) if (this.textdata[Math.floor(textid/10)*10]['fullwidth'] !== undefined) fullwidth = this.textdata[Math.floor(textid/10)*10]['fullwidth'];

            var fullheight = height;
            if (this.textdata[textid]['fullheight'] !== undefined) fullheight = this.textdata[textid]['fullheight'];
            else if (this.textdata[Math.floor(textid/10)*10] !== undefined) if (this.textdata[Math.floor(textid/10)*10]['fullheight'] !== undefined) fullheight = this.textdata[Math.floor(textid/10)*10]['fullheight'];

            var side = 1;
            if (val & 1) side = -1;

            div.css({
                'width': fullwidth+'px'
            });
            container.css({
                'position': 'relative',
                'left': (0-((fullwidth-width)/2).toFixed(0))+'px',
                'top': (0-((fullheight-height)/2).toFixed(0))+'px',
                'width': fullwidth+'px',
                'height': fullheight+'px',
                'line-height': fullheight+'px',
                'transform': 'scale('+(side*width/fullwidth).toFixed(2)+','+(height/fullheight).toFixed(2)+')',
                'display':'inline-block'
            });

            realcontainer.css({
                'width': fullwidth+'px',
                'height': fullheight+'px',
                'line-height': (fullheight)+'px'
            });
            container = realcontainer;
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

        if (transforms >= 6) {
            this.textdata[textid]['colorid'] = transforms-6;
            return false;
        }
    }

    if (debug) {
        if (transforms == 2) {
            if (this.textdata[textid] === undefined) this.textdata[textid] = {};
            this.textdata[textid]['fullwidth'] = width;
            this.textdata[textid]['fullheight'] = height;
            //return false;
        }

        div.css({
            'background-color': '#999',
            'opacity': '0.5',
            'width': (width) + 'px',
            'height': (height) + 'px'
        }).html(string);

        if (transforms == 2) div.css({
            'background-color': '#F99'
        });
        if (transforms >= 6) {
            if (this.textdata[textid] === undefined) this.textdata[textid] = {};
            this.textdata[textid]['colorid'] = transforms-6;

            div.css({
                'background-color': '#9F9'
            });
        }
    }

    return container;
};