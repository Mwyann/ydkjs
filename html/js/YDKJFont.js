/********** YDKJFont **********/

function YDKJFont() {
    this.strings = {};
    this.fontdata = {};
    this.textdata = {
        // Miscellaneous
        9:   {font:'JackInput',size:23,color:'#000',halign:'l'}, // Player's name input TODO
        11:  {font:'JackInput',size:23,color:'#FF0',top:0}, // Player's free answer input (Question, Gibberish)
        // Player's names and scores
        110: {font:'JackRoman',size:23,color:['#FFF','#0F0','#F00']}, // Player 1's name
        115: {font:'JackRoman',size:23,color:['#FFF','#0F0','#F00']}, // Player 1's score
        120: {font:'JackRoman',size:23,color:['#FFF','#0F0','#F00']}, // Player 2's name
        125: {font:'JackRoman',size:23,color:['#FFF','#0F0','#F00']}, // Player 2's score
        130: {font:'JackRoman',size:23,color:['#FFF','#0F0','#F00']}, // Player 3's name
        135: {font:'JackRoman',size:23,color:['#FFF','#0F0','#F00']}, // Player 3's score
        // Intro
        310: {font:'JackRoman',size:23,color:['#FFF','#999','#333']}, // Player 1's name
        315: {font:'JackRoman',size:23,color:['#FFF','#999','#333']}, // Player 1's score
        320: {font:'JackRoman',size:23,color:['#FFF','#999','#333']}, // Player 2's name
        325: {font:'JackRoman',size:23,color:['#FFF','#999','#333']}, // Player 2's score
        330: {font:'JackRoman',size:23,color:['#FFF','#999','#333']}, // Player 3's name
        335: {font:'JackRoman',size:23,color:['#FFF','#999','#333']}, // Player 3's score
        // ModeCategory
        100: {font:'JackRoman',size:38,color:'#FFF'}, // Player name with shadow
        102: {font:'JackRoman',size:38,color:'#000',opacity:0.15},
        103: {font:'JackRoman',size:38,color:'#000',opacity:0.40},
        1010:{font:'JackRoman',size:29,color:'#FC0',halign:'l'}, // Categories text
        1020:{font:'JackRoman',size:29,color:'#FC0',halign:'l'},
        1030:{font:'JackRoman',size:29,color:'#FC0',halign:'l'},
        1100:{font:'JackExtraCond',size:[83,64,42],color:['#FFF','#666','#AAA']}, // Big category title (TODO check big sizes, like 83)
        // Questions
        1200:{font:'JackRoman',size:20,color:'#33F',halign:'l'}, // Category title, header
        1205:{font:'JackRoman',size:20,color:'#33F',halign:'r'}, // Category value, header
        1210:{font:'JackExtraCond',size:[42,32],color:'#FFF'}, // Question
        1211:{font:'JackCondensed',size:22,color:['#FC0','#F00'],halign:'l',top:-1}, // Answer 1
        1212:{font:'JackCondensed',size:22,color:['#FC0','#F00'],halign:'l',top:-1}, // Answer 2
        1213:{font:'JackCondensed',size:22,color:['#FC0','#F00'],halign:'l',top:-1}, // Answer 3
        1214:{font:'JackCondensed',size:22,color:['#FC0','#F00'],halign:'l',top:-1}, // Answer 4
        1215:{font:'JackRoman',size:[61,38,29,23],color:'#FC0'}, // Revealed answer (probably more than one size here, TODO check sizes like 38, 29, 23)
        // Gibberish
        1305:{font:'JackExtraCond',size:83,color:'#33F',halign:'l'}, // Current price
        1310:{font:'JackExtraCond',size:[64,42],color:'#FFF'}, // Question
        1311:{font:'JackCondensed',size:[20,18],color:'#66F',halign:'r'}, // Clue 1
        1312:{font:'JackCondensed',size:[20,18],color:'#66F',halign:'r'}, // Clue 2
        1313:{font:'JackCondensed',size:[20,18],color:'#66F',halign:'r'}, // Clue 3
        1315:{font:'JackRoman',size:23,color:'#000'},                // Correct free answer revealed
        // DisOrDat
        1400:{font:'JackRoman',size:20,color:'#33F',halign:'l'}, // Category title, header
        1410:{font:'JackRoman',size:29,color:'#FF0'}, // Subject
        1420:{font:'JackExtraCond',size:[64,42],color:'#FFF'}, // Question
        1430:{font:'JackCondensed',size:22,color:['#FF0','#F00'],top:-1}, // First answer
        1435:{font:'JackCondensed',size:32,color:'#F00'}, // First answer, big (pushed)
        1440:{font:'JackCondensed',size:22,color:['#FF0','#F00'],top:-1}, // Second answer
        1445:{font:'JackCondensed',size:32,color:'#F00'}, // Second answer, big (pushed)
        1470:{font:'JackExtraCond',size:83,color:['#090','#33F','#063']}, // Temporary score (bottom left)
        1475:{font:'JackExtraCond',size:83,color:['#0F0','#900','#F00']}, // Temporary score (bottom left), second color scheme
        1480:{font:'JackExtraCond',size:114,color:['#0F0','#0A0','#060']}, // Final score (centered), positive
        1485:{font:'JackExtraCond',size:114,color:['#F00','#A00','#600']}, // Final score (centered), negative
        1487:{font:'JackRoman',size:23,color:['#FFF','#AAA','#666']}, // Player's name, while appearing
        1491:{font:'JackRoman',size:23,color:['#FFF','#0F0','#F00']}, // Player's name
        1492:{font:'JackRoman',size:23,color:['#FFF','#AAA','#666']}, // Player's score
        1497:{font:'JackRoman',size:39,color:['#0F0','#F00']}, // Player's new score
        // JackAttack
        1499:{font:'JackExtraCond',size:64,color:['#F00','#600','#A00']}, // Clue
        1500:{font:'JackRoman',size:[61,38,29,23],color:['#999','#666','#333']}, // Question
        1510:{font:'JackExtraCond',size:[64,42,32],color:['#F00','#600','#A00']}, // Answers
        1511:{font:'JackExtraCond',size:[64,42,32],color:'#F00'},
        1512:{font:'JackExtraCond',size:[64,42,32],color:'#F00',opacity:0.40},
        1513:{font:'JackExtraCond',size:[64,42,32],color:'#F00',opacity:0.15},
        1520:{font:'JackExtraCond',size:[64,42,32],color:'#F00'}, // Correct answer
        210: {font:'JackRoman',size:39,color:['#FFF','#AAA']}, // Players names when correct
        220: {font:'JackRoman',size:39,color:['#FFF','#AAA']},
        230: {font:'JackRoman',size:39,color:['#FFF','#AAA']},
        215: {font:'JackRoman',size:23,color:['#0F0','#0A0','#060']}, // 2000F when correct
        225: {font:'JackRoman',size:23,color:['#0F0','#0A0','#060']},
        235: {font:'JackRoman',size:23,color:['#0F0','#0A0','#060']},
        211: {font:'JackRoman',size:39,color:['#FFF','#666']}, // Players names when wrong
        221: {font:'JackRoman',size:39,color:['#FFF','#666']},
        231: {font:'JackRoman',size:39,color:['#FFF','#666']},
        216: {font:'JackRoman',size:23,color:['#F00','#A00','#600']}, // 2000F when wrong
        226: {font:'JackRoman',size:23,color:['#F00','#A00','#600']},
        236: {font:'JackRoman',size:23,color:['#F00','#A00','#600']},
        // End
        1610:{font:'JackRoman',size:[61,38,29,23],color:'#FFF'}, // TODO: check real font sizes
        1611:{font:'JackRoman',size:[61,38,29,23],color:'#FFF'},
        1615:{font:'JackRoman',size:[61,38,29,23],color:'#FFF'},
        1616:{font:'JackRoman',size:[61,38,29,23],color:'#FFF'},
        1620:{font:'JackRoman',size:[38,29,23],color:'#AAA'},
        1621:{font:'JackRoman',size:[38,29,23],color:'#AAA'},
        1622:{font:'JackRoman',size:[38,29,23],color:'#AAA'},
        1625:{font:'JackRoman',size:[38,29,23],color:'#AAA'},
        1626:{font:'JackRoman',size:[38,29,23],color:'#AAA'},
        1627:{font:'JackRoman',size:[38,29,23],color:'#AAA'},
        1630:{font:'JackRoman',size:[29,23],color:'#666'},
        1635:{font:'JackRoman',size:[29,23],color:'#666'},
    };
}

YDKJFont.prototype.preload = function(callback){
    var thisFont = this;
    var fonts = ['JackCondensed','JackExtraCond','JackInput','JackRoman'];
    var testheight = 300;
    this.waitForWebFonts(fonts, function() {
        for(var i = 0, l = fonts.length; i < l; ++i) {
            var height = thisFont.measureTextHeight('giItT1WQy@!-/#', testheight.toString() + 'px "' + fonts[i] + '"', 10, 10, parseInt(Math.round(testheight*1.5)), 1500);
            if (height === false) height = thisFont.measureTextHeightFallback(fonts[i]);
            thisFont.fontdata[fonts[i]] = {heightratio: testheight / height['height'], topratio: height['top']/testheight};
            //console.log(fonts[i]+' heightratio = '+(thisFont.fontdata[fonts[i]].heightratio)+' topratio = '+(thisFont.fontdata[fonts[i]].topratio));
        }
        if (typeof callback != 'undefined') callback();
    });
};

YDKJFont.prototype.measureTextHeightFallback = function(font) {
    // Le navigateur Brave a désactivé par défaut la fonction getImageData afin d'empêcher le fingerprinting du navigateur.
    // Dans ce genre de cas, on utilisera donc des valeurs précalculées par Chrome.
    switch(font) {
        case 'JackCondensed': return {height: 259, top: 28};
        case 'JackExtraCond': return {height: 259, top: 17};
        case 'JackInput': return {height: 261, top: 14};
        case 'JackRoman': return {height: 278, top: 13};
    }
    return {height: 278, top: 13};
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
                            if (typeof callback != 'undefined') callback();
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

    var fontDraw = document.createElement("canvas");
    // DEBUG STUFF
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

    if (data.length === 0) return false;

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
     4: shrink the text on one or both axis (for example answers on standard questions - also used in JackAttack - 15000)
     5: don’t shrink text, instead hide anything outside the boundaries
     6: First color to apply (color by default). To be found out, used in 15000 and 3300...
     7: Second color, or opacity (for ex. 66%)
     8: Third color, or opacity (for ex. 33%)

     Val & 1 : text (and images too maybe?) is horizontally reversed (used for example in conjunction with style 4)

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

        var colorid = 0;
        if (textdata.colorid !== undefined) colorid = textdata.colorid;
        if (typeof textdata.color == 'string') textdata.color = [textdata.color];
        if (textdata.color[colorid] === undefined) colorid = 0;

        container.css({
            'width': (width) + 'px',
            'height': (height) + 'px'
        });
        div.css({
            'width': (width) + 'px',
            'position': 'relative',
            'color': textdata.color[colorid]
        });

        var font = textdata['font'];

        var sizeid = 0;
        if (textdata.sizeid !== undefined) sizeid = textdata.sizeid;
        if (typeof textdata.size == 'number') textdata.size = [textdata['size']];
        if (textdata.size[sizeid] === undefined) sizeid = 0;

        var lookupsize = 1;
        while (lookupsize && (sizeid < textdata.size.length)) { // If font size is too big for the container, we'd like to try some more
            var fontsize = Math.floor(textdata.size[sizeid] * this.fontdata[font].heightratio).toFixed(0);
            var left = 0;
            //var top = -2-Math.floor(textdata.size[sizeid]*this.fontdata[font].topratio).toFixed(0);
            var top = -3;
            if (typeof textdata.top != "undefined") top = textdata.top;

            if (font != 'JackInput') string = string.replace(/\u00A0/g, '&nbsp;');
            div.css({
                'left': left + 'px',
                'top': top + 'px',
                'font': (fontsize) + 'px/' + (fontsize) + 'px "' + font + '"',
                'word-spacing': '-0.07em'
            }).html(string.replace(/(\n)+/g, '<br/>')); // Line breaks

            if ((textdata.sizeid === undefined) && (textdata.size.length > 1)) { // Try to find the best fitting font size, once and for all
                var tmpdiv = div.clone();
                tmpdiv.css({
                    'width': 'auto',
                    'position': 'absolute',
                    'left': '-10000px'
                });
                $('body').append(tmpdiv);
                var naturalwidth = tmpdiv.width();
                var naturalheight = tmpdiv.height();
                tmpdiv.css({
                    'width':(width) + 'px'
                });
                // If the text is wider than the div but hasn't changed height, then we have one big word not wrapping, and that's bad, try a smaller font.
                if ((!((naturalwidth > width+2) && (tmpdiv.height() == naturalheight))) && (tmpdiv.height() <= height+2)) lookupsize = 0; // Found! (with 2 margin pixels, don't be so picky)
                else if (sizeid+1 < textdata.size.length) sizeid++; // Try next size, if there's one
                else lookupsize = 0; // No lower size, darn it, stop there.
                if (lookupsize == 0) this.textdata[textid]['sizeid'] = sizeid; // If we stopped with some size, save it for future use.
                tmpdiv.remove();
            } else lookupsize = 0; // Only one size, don't even try
        }

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
                'left': (0-((fullwidth-width)/2).toFixed(1))+'px',
                'top': (0-((fullheight-height)/2).toFixed(1))+'px',
                'width': fullwidth+'px',
                'height': fullheight+'px',
                'line-height': fullheight+'px',
                'transform': 'scale('+(side*width/fullwidth).toFixed(4)+','+(height/fullheight).toFixed(4)+')',
                'display': 'inline-block'
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

YDKJFont.prototype.resetTextStyle = function(textid) {
    if (this.textdata[textid] === undefined) this.textdata[textid] = {};
    this.textdata[textid]['sizeid'] = undefined;
    this.textdata[textid]['colorid'] = 0;
};
