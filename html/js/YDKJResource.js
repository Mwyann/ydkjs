/********** YDKJResource **********/

function YDKJResource(resourceName) {
    var sp = resourceName.split('/');
    var resGif = '';
    var resJS = '';
    var resAudio = '';
    var resFramestart = 0;
    var resFramestop = -1;
    var resLoop = 0;
    if ((YDKJanim[sp[0]]) && (YDKJanim[sp[0]][sp[1]])) {
        resGif = 'res/'+YDKJanim[sp[0]][sp[1]]['res']+'/'+YDKJanim[sp[0]][sp[1]]['name']+'.gif';
        resJS = 'res/'+YDKJanim[sp[0]][sp[1]]['res']+'/'+YDKJanim[sp[0]][sp[1]]['name']+'.js';
        resFramestart = YDKJanim[sp[0]][sp[1]]['framestart'];
        if (YDKJanim[sp[0]][sp[1]]['loop']) resLoop = 1;
        if (YDKJanim[sp[0]][sp[1]]['framestop']) resFramestop = YDKJanim[sp[0]][sp[1]]['framestop'];
    }

    if ((YDKJsnd[sp[0]]) && (YDKJsnd[sp[0]][sp[1]])) {
        resAudio = 'res/'+YDKJsnd[sp[0]][sp[1]]['res']+'/'+YDKJsnd[sp[0]][sp[1]]['name']+'/'+YDKJsnd[sp[0]][sp[1]]['min'];
        if (YDKJsnd[sp[0]][sp[1]]['loop']) resLoop = 1;
    } else if ((YDKJsnd[sp[0]]) && (YDKJsnd[sp[0]]['SFX'+sp[1]])) {
        resAudio = 'res/'+YDKJsnd[sp[0]]['SFX'+sp[1]]['res']+'/'+YDKJsnd[sp[0]]['SFX'+sp[1]]['name']+'/'+YDKJsnd[sp[0]]['SFX'+sp[1]]['min'];
        if (YDKJsnd[sp[0]]['SFX'+sp[1]]['loop']) resLoop = 1;
    }

    return {
        urlGif: resGif,
        urlJS: resJS,
        urlAudio: resAudio,
        framestart: resFramestart,
        loop: resLoop,
        framestop: resFramestop
    };
}
