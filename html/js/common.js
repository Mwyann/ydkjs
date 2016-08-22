/********** Quelques fonctions pour le son **********/

function AudioSpecs() {
    this.mobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent)) ;

    this.is = {
        ff: Boolean(!(window.mozInnerScreenX == null) && /firefox/.test( navigator.userAgent.toLowerCase() )),
        ie: Boolean(document.all && !window.opera),
        opera: Boolean(window.opera),
        chrome: Boolean(window.chrome),
        safari: Boolean(!window.chrome && /safari/.test( navigator.userAgent.toLowerCase() ) && window.getComputedStyle && !window.globalStorage && !window.opera)
    };
    this.playDelay = -30; // IE 1500
    this.stopDelay = 30;  // IE 20
    this.lengthOffset = 0;
    this.maxVolume = 1;
    if(this.is.chrome) {
        if(!this.mobile) { // Chrome Desktop
            this.playDelay = -25;
            this.stopDelay = 25;
            this.maxVolume = 0.5;
        } else { // Chrome Mobile (en fait mêmes caractéristiques que la version Desktop désormais)
            this.playDelay = -25;
            this.stopDelay = 25;
            this.maxVolume = 0.5;
            //this.lengthOffset = -600;
        }
    }
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
        .on('load', function(e) {
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
    if (typeof(timeout) === 'undefined') timeout = 0; // TODO ?
    var listener = function(event){callback(event.which)};
    var listenerbackspace = function(event){if (event.keyCode==8) callback(event.which);};
    jQuery(window).on('keypress',listener);
    jQuery(window).on('keydown',listenerbackspace);
    return [listener,listenerbackspace];
}

function unbindKeyListener(listener) {
    if (listener) jQuery(window).off('keypress',listener[0]).off('keydown',listener[1]);
}

function getSTRfromID(STR,type,id) {
    for(var i = 0; i < STR.length; i++) if ((STR[i].type == type) && (STR[i].id == id)) return STR[i].data;
    return '';
}

/********** Saisie d'une réponse au clavier **********/

/* Valeurs à intégrer à l'objet :
  - game
  Animations :
  - TextFrameShow
  - TextFrameEnter
  - ShowAnswerTyping
  - ShowAnswerTextFrame
  Sons :
  - SFXShowTextFrame (set aussi à afficher la bonne réponse)
  - SFXTypeHeartBeat
  - SFXTypeAnswer
  - SFXTypeBack
  - SFXAnswerEntered
  - SFXEraseAnswer
  Méthodes :
  - onEnter(text)
  - onTimeOut
 */
var ITFcursordata = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAZAQMAAADdfEb1AAAABlBMVEUAAAD//wCI23BQAAAAAXRSTlMAQObYZgAAABZJREFUCNdj+P2AgY+BgYUyxMcANAcAnC8EJ8go5jgAAAAASUVORK5CYII=';

function InputTextFrame() {}

InputTextFrame.prototype.start = function() {
    var thisFrame = this;

    var cursorblinkInterval = 0;
    var cursor;
    this.inputframe = 0;
    this.text = '';

    this.resetblink = function() {
        cursor.css('visibility','');
        if (cursorblinkInterval) clearInterval(cursorblinkInterval);
        cursorblinkInterval = setInterval(function() {
            if (cursor.css('visibility') == 'hidden') cursor.css('visibility',''); else cursor.css('visibility','hidden');
        },700);
    };

    this.enter = function() {
        cursor.css('visibility','');
        if (cursorblinkInterval) clearInterval(cursorblinkInterval);
        thisFrame.SFXTypeHeartBeat.reset();
        thisFrame.SFXAnswerEntered.reset(true);
        if (thisFrame.onEnter) thisFrame.SFXAnswerEntered.ended(function(){thisFrame.onEnter(thisFrame.text)});
        thisFrame.SFXAnswerEntered.play();
    };

    this.SFXShowTextFrame.reset(true);
    this.SFXShowTextFrame.ended(function() {
        cursor = thisFrame.game.html.screen.find('.cursor');
        thisFrame.inputframe = thisFrame.game.html.screen.find('.inputframe');
        thisFrame.SFXTypeHeartBeat.play();
        thisFrame.resetblink();
    });

    this.game.font.strings[11] = '<span class="inputframe"></span><img src="'+ITFcursordata+'" style="vertical-align:-8px;padding-bottom:3px;visibility:hidden;margin-left:-4px" class="cursor">';
    this.SFXTypeHeartBeat.reset();
    this.TextFrameShow.reset();
    this.TextFrameShow.play();
    this.SFXShowTextFrame.play();
};

/* Méthode à appeler pour presser une touche */
InputTextFrame.prototype.sendKeypress = function(key) {
    if (!this.inputframe) return false;
    if (key == 13) { // Entrée
        this.game.font.strings[11] = this.inputframe.html();
        this.inputframe = 0;
        this.enter();
        return true;
    }
    if (key == 8) { // Effacement
        if (this.text == '') return false;
        this.SFXTypeBack.reset();
        this.SFXTypeBack.play();
        this.text = this.text.substr(0,this.text.length-1);
    } else {
        if (this.text.length >= 40) return false;
        key = String.fromCharCode(key);
        if (key == "'") key = '’';
        this.text = this.text+key;
        this.SFXTypeAnswer.reset();
        this.SFXTypeAnswer.play();
    }
    this.resetblink();
    this.inputframe.html(this.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));
    return true;
};

/* Méthode qui efface la mauvaise réponse du joueur */
InputTextFrame.prototype.wrong = function(callback) {
    var thisFrame = this;
    this.SFXEraseAnswer.play();
    var inputframe = this.game.html.screen.find('.inputframe');

    var eraseInterval = setInterval(function() {
        if (thisFrame.text == '') {
            thisFrame.game.font.strings[11] = '<img src="'+ITFcursordata+'" style="vertical-align:-8px;padding-bottom:3px;margin-left:-4px" class="cursor">';
            clearInterval(eraseInterval);
            thisFrame.SFXEraseAnswer.reset();
            if (callback) callback();
            return false;
        }
        thisFrame.text = thisFrame.text.substr(0,thisFrame.text.length-1);
        inputframe.html(thisFrame.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));
    },66);
};

/* Méthode qui affiche la bonne réponse */
InputTextFrame.prototype.showAnswer = function(answer,callback) {
    var thisFrame = this;
    this.SFXShowTextFrame.reset(true);
    // On boucle à la sauvage
    this.SFXShowTextFrame.ended(function() {
        this.reset();
        this.play();
    });
    this.SFXShowTextFrame.play();
    this.game.font.strings[11] = '<span class="inputframe"></span>';
    this.ShowAnswerTyping.play();
    var inputframe = this.game.html.screen.find('.inputframe');
    this.text = '';

    var showAnswer = setInterval(function() {
        if (answer == '') {
            thisFrame.game.font.strings[11] = inputframe.html();
            clearInterval(showAnswer);
            thisFrame.SFXShowTextFrame.free();
            thisFrame.ShowAnswerTyping.free();
            thisFrame.ShowAnswerTextFrame.play();
            if (callback) callback();
            return false;
        }
        thisFrame.text = thisFrame.text + answer.substr(0,1);
        answer = answer.substr(1);
        inputframe.html(thisFrame.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));
    },66);
};

// Pris depuis http://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
var defaultDiacriticsRemovalMap = [
    {'base':'A', 'letters':'\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'},
    {'base':'AA','letters':'\uA732'},
    {'base':'AE','letters':'\u00C6\u01FC\u01E2'},
    {'base':'AO','letters':'\uA734'},
    {'base':'AU','letters':'\uA736'},
    {'base':'AV','letters':'\uA738\uA73A'},
    {'base':'AY','letters':'\uA73C'},
    {'base':'B', 'letters':'\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'},
    {'base':'C', 'letters':'\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'},
    {'base':'D', 'letters':'\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'},
    {'base':'DZ','letters':'\u01F1\u01C4'},
    {'base':'Dz','letters':'\u01F2\u01C5'},
    {'base':'E', 'letters':'\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'},
    {'base':'F', 'letters':'\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'},
    {'base':'G', 'letters':'\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'},
    {'base':'H', 'letters':'\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'},
    {'base':'I', 'letters':'\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'},
    {'base':'J', 'letters':'\u004A\u24BF\uFF2A\u0134\u0248'},
    {'base':'K', 'letters':'\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'},
    {'base':'L', 'letters':'\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'},
    {'base':'LJ','letters':'\u01C7'},
    {'base':'Lj','letters':'\u01C8'},
    {'base':'M', 'letters':'\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'},
    {'base':'N', 'letters':'\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'},
    {'base':'NJ','letters':'\u01CA'},
    {'base':'Nj','letters':'\u01CB'},
    {'base':'O', 'letters':'\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'},
    {'base':'OI','letters':'\u01A2'},
    {'base':'OO','letters':'\uA74E'},
    {'base':'OU','letters':'\u0222'},
    {'base':'OE','letters':'\u008C\u0152'},
    {'base':'oe','letters':'\u009C\u0153'},
    {'base':'P', 'letters':'\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'},
    {'base':'Q', 'letters':'\u0051\u24C6\uFF31\uA756\uA758\u024A'},
    {'base':'R', 'letters':'\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'},
    {'base':'S', 'letters':'\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'},
    {'base':'T', 'letters':'\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'},
    {'base':'TZ','letters':'\uA728'},
    {'base':'U', 'letters':'\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'},
    {'base':'V', 'letters':'\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'},
    {'base':'VY','letters':'\uA760'},
    {'base':'W', 'letters':'\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'},
    {'base':'X', 'letters':'\u0058\u24CD\uFF38\u1E8A\u1E8C'},
    {'base':'Y', 'letters':'\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'},
    {'base':'Z', 'letters':'\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'},
    {'base':'a', 'letters':'\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'},
    {'base':'aa','letters':'\uA733'},
    {'base':'ae','letters':'\u00E6\u01FD\u01E3'},
    {'base':'ao','letters':'\uA735'},
    {'base':'au','letters':'\uA737'},
    {'base':'av','letters':'\uA739\uA73B'},
    {'base':'ay','letters':'\uA73D'},
    {'base':'b', 'letters':'\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'},
    {'base':'c', 'letters':'\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'},
    {'base':'d', 'letters':'\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'},
    {'base':'dz','letters':'\u01F3\u01C6'},
    {'base':'e', 'letters':'\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'},
    {'base':'f', 'letters':'\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'},
    {'base':'g', 'letters':'\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'},
    {'base':'h', 'letters':'\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'},
    {'base':'hv','letters':'\u0195'},
    {'base':'i', 'letters':'\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'},
    {'base':'j', 'letters':'\u006A\u24D9\uFF4A\u0135\u01F0\u0249'},
    {'base':'k', 'letters':'\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'},
    {'base':'l', 'letters':'\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'},
    {'base':'lj','letters':'\u01C9'},
    {'base':'m', 'letters':'\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'},
    {'base':'n', 'letters':'\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'},
    {'base':'nj','letters':'\u01CC'},
    {'base':'o', 'letters':'\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'},
    {'base':'oi','letters':'\u01A3'},
    {'base':'ou','letters':'\u0223'},
    {'base':'oo','letters':'\uA74F'},
    {'base':'p','letters':'\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'},
    {'base':'q','letters':'\u0071\u24E0\uFF51\u024B\uA757\uA759'},
    {'base':'r','letters':'\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'},
    {'base':'s','letters':'\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'},
    {'base':'t','letters':'\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'},
    {'base':'tz','letters':'\uA729'},
    {'base':'u','letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'},
    {'base':'v','letters':'\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'},
    {'base':'vy','letters':'\uA761'},
    {'base':'w','letters':'\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'},
    {'base':'x','letters':'\u0078\u24E7\uFF58\u1E8B\u1E8D'},
    {'base':'y','letters':'\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'},
    {'base':'z','letters':'\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'}
];

var diacriticsMap = {};
for (var i=0; i < defaultDiacriticsRemovalMap .length; i++){
    var letters = defaultDiacriticsRemovalMap [i].letters;
    for (var j=0; j < letters.length ; j++){
        diacriticsMap[letters[j]] = defaultDiacriticsRemovalMap [i].base;
    }
}

// "what?" version ... http://jsperf.com/diacritics/12
function removeDiacritics (str) {
    return str.replace(/[^\u0000-\u007E]/g, function(a){
        return diacriticsMap[a] || a;
    });
}

function cleanText(str) {
    return removeDiacritics(str).toLowerCase().replace(/[^0-9a-z\s]/g, '').replace(/\s+/g, ' ').trim();
}

function checkTextWrds(text,wrds) {
    // Fonction qui vérifie une réponse donnée en texte, contre les infos Wrds.
    // Renvoie : 0 si le texte est vraiment faux, 1 s'il est presque bon, et 2 si la réponse est correcte.
    text = ' '+cleanText(text)+' ';
    var numcorrectwords = 0;
    var numfoundwords = 0;
    for(var i = 0; i < wrds.length; i++) {
        var currentwords = wrds[i];
        var bestpos = 999;
        var bestword = '';
        // On cherche le mot le plus long, qui entre le mieux dans la case (le plus à gauche)
        for(var j = 0; j < currentwords.length; j++) {
            var word = cleanText(currentwords[j]);
            if (word != '') {
                var p = text.indexOf(' ' + word + ' ');
                if ((p >= 0) && ((bestpos > p) || ((bestpos == p) && (currentwords[j].length > word.length)))) {
                    bestpos = p;
                    bestword = word;
                }
            }
        }
        if (bestpos == 0) numcorrectwords++; // Mot correct !
        if (bestword != '') { // Mot trouvé !
            numfoundwords++;
            text = text.substr(bestpos+bestword.length+1) + text.substr(1,bestpos+bestword.length+1); // On met le meilleur mot à la fin, si on l'a trouvé. Cela permet de trouver tous les mots, même s'ils sont dans le mauvais ordre.
        }
    }
    if (numcorrectwords == wrds.length) return 2;
    if (numfoundwords >= wrds.length/2) return 1;
    return 0;
}

/********** Timer **********/

function YDKJTimer(timerType) {
    this.timerType = timerType;
}

YDKJTimer.prototype.preload = function(resources) {
    this.frames = resources['Common/Timer'+this.timerType+'/Frames'];
    this.animation = new YDKJAnimation(resources['Common/Timer'+this.timerType]);
    var thisTimer = this;
    this.step = 0; // 0 = Still, 1 = Hiding, 2 = Showing
    this.current = this.timerType;
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
};

YDKJTimer.prototype.ready = function(f) {
    this.animation.ready(f);
};

YDKJTimer.prototype.free = function() {
    if (this.animation) this.animation.free();
    this.animation = 0;
};

YDKJTimer.prototype.reset = function() {
    this.animation.reset();
};

YDKJTimer.prototype.playTimer = function(next) {
    if (typeof next == 'undefined') next = this.current-1;
    if ((next < 0) || (next > this.timerType)) return false;
    var thisTimer = this;
    this.animation.ready(function() {
        thisTimer.animation.html = thisTimer.html;
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

/********** MersenneTwister **********/

/*
 If you want to use this as a substitute for Math.random(), use the random()
 method like so:

 var m = new MersenneTwister();
 var randomNumber = m.random();

 You can also call the other genrand_{foo}() methods on the instance.

 If you want to use a specific seed in order to get a repeatable random
 sequence, pass an integer into the constructor:

 var m = new MersenneTwister(123);

 and that will always produce the same random sequence.

 Sean McCullough (banksean@gmail.com)
 */

/*
 A C-program for MT19937, with initialization improved 2002/1/26.
 Coded by Takuji Nishimura and Makoto Matsumoto.

 Before using, initialize the state by using init_genrand(seed)
 or init_by_array(init_key, key_length).

 Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:

 1. Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.

 3. The names of its contributors may not be used to endorse or promote
 products derived from this software without specific prior written
 permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


 Any feedback is very welcome.
 http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
 email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
 */

var MersenneTwister = function(seed) {
    if (seed == undefined) {
        seed = new Date().getTime();
    }
    /* Period parameters */
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 0x9908b0df;   /* constant vector a */
    this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
    this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

    this.mt = new Array(this.N); /* the array for the state vector */
    this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

    this.init_genrand(seed);
};

/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(s) {
    this.mt[0] = s >>> 0;
    for (this.mti=1; this.mti<this.N; this.mti++) {
        var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
        this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
            + this.mti;
        /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
        /* In the previous versions, MSBs of the seed affect   */
        /* only MSBs of the array mt[].                        */
        /* 2002/01/09 modified by Makoto Matsumoto             */
        this.mt[this.mti] >>>= 0;
        /* for >32 bit machines */
    }
};

/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function() {
    var y;
    var mag01 = new Array(0x0, this.MATRIX_A);
    /* mag01[x] = x * MATRIX_A  for x=0,1 */

    if (this.mti >= this.N) { /* generate N words at one time */
        var kk;

        if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
            this.init_genrand(5489); /* a default initial seed is used */

        for (kk=0;kk<this.N-this.M;kk++) {
            y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
            this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        for (;kk<this.N-1;kk++) {
            y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
            this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
        this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

        this.mti = 0;
    }

    y = this.mt[this.mti++];

    /* Tempering */
    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >>> 18);

    return y >>> 0;
};

// Some code from http://chancejs.com/

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function () {
    return this.genrand_int32() * (1.0 / 4294967296.0);
    /* divided by 2^32 */
};

/**
 *  Return a random integer
 *
 *  NOTE the max and min are INCLUDED in the range. So:
 *  chance.integer({min: 1, max: 3});
 *  would return either 1, 2, or 3.
 *
 *  @param {Number} [min] can specify a min
 *  @param {Number} [max] can specify a max
 *  @returns {Number} a single random integer number
 */
MersenneTwister.prototype.integer = function (min,max) {
    // 9007199254740992 (2^53) is the max integer number in JavaScript
    // See: http://vq.io/132sa2j
    return Math.floor(this.random() * (max - min + 1) + min);
};

/*
 jquery.fullscreen 1.1.4
 https://github.com/kayahr/jquery-fullscreen-plugin
 Copyright (C) 2012 Klaus Reimer <k@ailis.de>
 Licensed under the MIT license
 (See http://www.opensource.org/licenses/mit-license)
 */
function d(b){var c,a;if(!this.length)return this;c=this[0];c.ownerDocument?a=c.ownerDocument:(a=c,c=a.documentElement);if(null==b){if(!a.cancelFullScreen&&!a.webkitCancelFullScreen&&!a.mozCancelFullScreen)return null;b=!!a.fullScreen||!!a.webkitIsFullScreen||!!a.mozFullScreen;return!b?b:a.fullScreenElement||a.webkitCurrentFullScreenElement||a.mozFullScreenElement||b}b?(b=c.requestFullScreen||c.webkitRequestFullScreen||c.mozRequestFullScreen)&&b.call(c,Element.ALLOW_KEYBOARD_INPUT):(b=a.cancelFullScreen||
    a.webkitCancelFullScreen||a.mozCancelFullScreen)&&b.call(a);return this}jQuery.fn.fullScreen=d;jQuery.fn.toggleFullScreen=function(){return d.call(this,!d.call(this))};var e,f,g;e=document;e.webkitCancelFullScreen?(f="webkitfullscreenchange",g="webkitfullscreenerror"):e.mozCancelFullScreen?(f="mozfullscreenchange",g="mozfullscreenerror"):(f="fullscreenchange",g="fullscreenerror");jQuery(document).bind(f,function(){jQuery(document).trigger(new jQuery.Event("fullscreenchange"))});
jQuery(document).bind(g,function(){jQuery(document).trigger(new jQuery.Event("fullscreenerror"))});