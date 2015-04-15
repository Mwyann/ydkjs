/********** YDKJFont **********/

function YDKJFont() {

}

YDKJFont.prototype.preload = function(callback){
    this.waitForWebFonts(['JackCondensed','JackExtraCond','JackInput','JackRoman'], callback);
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
                }

                if (timeOut <= 0) {
                    ++loadedFonts;
                    node.parentNode.removeChild(node);
                    node = null;
                }

                // If all fonts have been loaded
                if(loadedFonts >= fonts.length) {
                    if(interval) {
                        clearInterval(interval);
                    }
                    if(loadedFonts == fonts.length) {
                        callback();
                        return true;
                    }
                }
            };

            if(!checkFont()) {
                interval = setInterval(checkFont, 50);
            }
        })(fonts[i]);
    }
};