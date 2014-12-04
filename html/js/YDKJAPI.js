/********** YDKJAPI **********/

function YDKJAPI(game, demomode) {
    this.game = game;
    if (demomode) this.initdemo(); else this.initgame();
}

YDKJAPI.prototype.initdemo = function() {
    var thisAPI = this;

    YDKJAPI.prototype.gamemode = function(mode) {
        //if (mode === undefined) return new YDKJMode(thisAPI.game, 'Category', {category: 1, questionnumber: 1}); // Ligne DEBUG
        if (mode === undefined) return new YDKJMode(thisAPI.game, 'Intro', {});
        if (mode instanceof ModeIntro) return new YDKJMode(thisAPI.game, 'Category', {category: 1, questionnumber: 1});
        if (mode instanceof ModeQuestion) return new YDKJMode(thisAPI.game, 'Category', {category: 1, questionnumber: mode.options.questionnumber+1});
    };

    var demores = function(resourceName) {
        var sp = resourceName.split('/');
        var resGif = '';
        var resJS = '';
        var resAudio = '';
        var resFramestart = 0;
        var resFramestop = -1;
        var resLoop = 0;
        if ((YDKJDemoAnim[sp[0]]) && (YDKJDemoAnim[sp[0]][sp[1]])) {
            resGif = 'res/'+YDKJDemoAnim[sp[0]][sp[1]]['res']+'/'+YDKJDemoAnim[sp[0]][sp[1]]['name']+'.gif';
            resJS = 'res/'+YDKJDemoAnim[sp[0]][sp[1]]['res']+'/'+YDKJDemoAnim[sp[0]][sp[1]]['name']+'.js';
            resFramestart = YDKJDemoAnim[sp[0]][sp[1]]['framestart'];
            if (YDKJDemoAnim[sp[0]][sp[1]]['loop']) resLoop = 1;
            if (YDKJDemoAnim[sp[0]][sp[1]]['framestop']) resFramestop = YDKJDemoAnim[sp[0]][sp[1]]['framestop'];
        }

        if ((YDKJDemoSnd[sp[0]]) && (YDKJDemoSnd[sp[0]][sp[1]])) {
            resAudio = 'res/'+YDKJDemoSnd[sp[0]][sp[1]]['res']+'/'+YDKJDemoSnd[sp[0]][sp[1]]['name']+'/'+YDKJDemoSnd[sp[0]][sp[1]]['min'];
            if (YDKJDemoSnd[sp[0]][sp[1]]['loop']) resLoop = 1;
        } else if ((YDKJDemoSnd[sp[0]]) && (YDKJDemoSnd[sp[0]]['SFX'+sp[1]])) {
            resAudio = 'res/'+YDKJDemoSnd[sp[0]]['SFX'+sp[1]]['res']+'/'+YDKJDemoSnd[sp[0]]['SFX'+sp[1]]['name']+'/'+YDKJDemoSnd[sp[0]]['SFX'+sp[1]]['min'];
            if (YDKJDemoSnd[sp[0]]['SFX'+sp[1]]['loop']) resLoop = 1;
        }

        return {
            urlGif: resGif,
            urlJS: resJS,
            urlAudio: resAudio,
            framestart: resFramestart,
            loop: resLoop,
            framestop: resFramestop
        };
    };

    var shuffle = function(array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };

    YDKJAPI.prototype.resources = function(mode) {
        var reslist, r, i, questions, questiontitles;
        if (mode instanceof ModeIntro) {
            reslist = {
                'Intro/IntroPreTitle': 0,
                'Intro/IntroJack': 0,
                'Intro/MusicJack': 0,
                'Intro/SFXBang': 0,
                'Intro/SFXJackTitle': 0,
                'Intro/IntroJackTitle': 0,
                'Intro/IntroJackDemo': 0
            };
            for(r in reslist) if (reslist.hasOwnProperty(r)) reslist[r] = demores(r);
            return reslist;
        }
        if (mode instanceof ModeCategory) {
            reslist = {
                'Category/SFXShowCategoryScreen': 0,
                'Category/MusicChooseCategoryStart': 0,
                'Category/MusicChooseCategoryLoop':0,
                'Category/ShowCategories': 0,
                'Category/ChooseCategoryText': 0,
                'Category/ChooseCategoryPlayer1': 0,
                'Category/ChooseCategoryPlayer2': 0,
                'Category/ChooseCategoryPlayer3': 0,
                'Category/SFXChoiceCategory': 0,
                'Category/LoopCategory1': 0,
                'Category/LoopCategory2': 0,
                'Category/LoopCategory3': 0,
                'Category/ChoiceCategory1': 0,
                'Category/ChoiceCategory2': 0,
                'Category/ChoiceCategory3': 0
            };
            for(r in reslist) if (reslist.hasOwnProperty(r)) reslist[r] = demores(r);

            // Valeurs spécifiques à la catégorie
            if (mode.options.category == 1) reslist['Category/ChooseCategory'] = demores('Category/ChooseCategory1');
            if (mode.options.category == 2) reslist['Category/ChooseCategory'] = demores('Category/ChooseCategory2');
            if (mode.options.category == 3) reslist['Category/ChooseCategory'] = demores('Category/ChooseCategory3');

            // Précharger les questions avec l'interface de catégorie
            if ((mode.options.questionnumber % 2) == 1) { // Questions normales
                questions = shuffle(['ABB', 'ABE', 'AJM']);
                questiontitles = {'ABB': 'Keuf you !', 'ABE': 'Ma meilleure boum', 'AJM': 'C’est dur vraiment plus longtemps'};
                reslist['questiontitles'] = [];

                for (i=1; i<=3; i++) {
                    reslist['questiontitles'].push(questiontitles[questions[i-1]]);
                    reslist['question'+i] = new YDKJMode(thisAPI.game, 'Question', {category:mode.options.category,questionnumber:mode.options.questionnumber,res:'QFold1/'+questions[i-1]}); // Preload des questions suivantes
                }
            } else { // Couci-Couça
                questions = shuffle(['DAC', 'DAL', 'DAP']);
                questiontitles = {'DAC': 'Du travail bien fait', 'DAL': 'L’envers de la médaille, c’est l’autre côté', 'DAP': 'La tête dans le bol'};
                reslist['questiontitles'] = [];

                for (i=1; i<=3; i++) {
                    reslist['questiontitles'].push(questiontitles[questions[i-1]]);
                    reslist['question'+i] = new YDKJMode(thisAPI.game, 'DisOrDat', {category:mode.options.category,questionnumber:mode.options.questionnumber,res:'QFold1/'+questions[i-1]}); // Preload des questions suivantes
                }
            }
            return reslist;
        }
        if (mode instanceof ModeQuestion) {
            reslist = {
                'Question/AnnounceCategory': 0,
                'Question/TimerComesIn': 0,
                'Question/PrepareTimer': 0,
                'Question/SFXShowQuestion': 0,
                'Question/JingleReadQuestion': 0,
                'Question/JingleTimer': 0,
                'Question/TimeOut': 0,
                'Question/SFXTimeOut': 0,
                'Question/SFXPlayerBuzz': 0,
                'Question/SFXPlayerKey': 0,
                'Question/SFXPlayerWrong1': 0,
                'Question/SFXPlayerWrong2': 0,
                'Question/SFXPlayerCorrect': 0,
                'Question/SFXRevealAnswer': 0,
                'Question/DefaultRevealAnswer': 0,
                'Question/DefaultRevealLastAnswer': 0,
                'Question/ShowPlayer1Key': 0,
                'Question/Player1Answer': 0,
                'Question/Player1AnswerLoop': 0,
                'Question/PlayerBuzzedPlayer1': 0,
                'Question/Player1Correct': 0,
                'Question/Player1Wrong': 0,
                'Question/Player1Cancel': 0,
                'Question/ShowPlayer2Key': 0,
                'Question/Player2Answer': 0,
                'Question/Player2AnswerLoop': 0,
                'Question/PlayerBuzzedPlayer2': 0,
                'Question/Player2Correct': 0,
                'Question/Player2Wrong': 0,
                'Question/Player2Cancel': 0,
                'Question/ShowPlayer3Key': 0,
                'Question/Player3Answer': 0,
                'Question/Player3AnswerLoop': 0,
                'Question/PlayerBuzzedPlayer3': 0,
                'Question/Player3Correct': 0,
                'Question/Player3Wrong': 0,
                'Question/Player3Cancel': 0,
                'Question/NumberAnswer1': 0,
                'Question/NumberAnswer2': 0,
                'Question/NumberAnswer3': 0,
                'Question/NumberAnswer4': 0,
                'Question/LoopAnswer1': 0,
                'Question/LoopAnswer2': 0,
                'Question/LoopAnswer3': 0,
                'Question/LoopAnswer4': 0,
                'Question/CorrectAnswer1': 0,
                'Question/CorrectAnswer2': 0,
                'Question/CorrectAnswer3': 0,
                'Question/CorrectAnswer4': 0,
                'Question/WrongAnswer1': 0,
                'Question/WrongAnswer2': 0,
                'Question/WrongAnswer3': 0,
                'Question/WrongAnswer4': 0,
                'Question/LastPlayer1': 0,
                'Question/LastPlayer2': 0,
                'Question/LastPlayer3': 0,
                'Question/LastPlayers12': 0,
                'Question/LastPlayers13': 0,
                'Question/LastPlayers23': 0
            };
            for(r in reslist) if (reslist.hasOwnProperty(r)) reslist[r] = demores(r);

            // Valeurs spécifiques à la question
            if (mode.options.questionnumber == 1) { // Charger les bonnes ressources en fonction du n° de la question
                reslist['Category/JingleQuestion'] = demores('Category/JingleQuestion1');
                reslist['Category/BGQuestion'] = demores('Category/BGQuestion1');
            }
            if (mode.options.questionnumber == 2) {
                reslist['Category/JingleQuestion'] = demores('Category/JingleQuestion2');
                reslist['Category/BGQuestion'] = demores('Category/BGQuestion2');
            }
            if (mode.options.questionnumber >= 3) {
                reslist['Category/JingleQuestion'] = demores('Category/JingleQuestion3');
                reslist['Category/BGQuestion'] = demores('Category/BGQuestion3');
            }

            if (mode.options.res == 'QFold1/ABB') {
                mode.options.correctanswer = 3;
                mode.options.value = 2000;
            }
            if (mode.options.res == 'QFold1/ABE') {
                mode.options.correctanswer = 3;
                mode.options.value = 2000;
            }
            if (mode.options.res == 'QFold1/AJM') {
                mode.options.correctanswer = 4;
                mode.options.value = 2000;
            }

            reslist['Question/AnnounceValue'] = demores('Question/AnnounceValue'+mode.options.value+'F');
            reslist['Question/VoiceAnnounceValue'] = demores('Question/VoiceAnnounceValue'+mode.options.value+'F');
            reslist['Question/HideValue'] = demores('Question/HideValue'+mode.options.value+'F');

            reslist['Question/QuestionTitle'] = {urlGif: '', urlJS: '', urlAudio: 'res/'+mode.options.res+'/snd/1', framestart:0, loop:0, framestop:0};
            reslist['Question/PreQuestion'] = {urlGif: '', urlJS: '', urlAudio: 'res/'+mode.options.res+'/snd/2', framestart:0, loop:0, framestop:0};
            reslist['Question/Question'] = {urlGif: '', urlJS: '', urlAudio: 'res/'+mode.options.res+'/snd/3', framestart:0, loop:0, framestop:0};
            reslist['Question/Answers'] = {urlGif: '', urlJS: '', urlAudio: 'res/'+mode.options.res+'/snd/5', framestart:0, loop:0, framestop:0};
            reslist['Question/EndQuestion'] = {urlGif: '', urlJS: '', urlAudio: 'res/'+mode.options.res+'/snd/6', framestart:0, loop:0, framestop:0};
            reslist['Question/Answer1'] = {urlGif: '', urlJS: '', urlAudio: 'res/'+mode.options.res+'/snd/7', framestart:0, loop:0, framestop:0};
            reslist['Question/Answer2'] = {urlGif: '', urlJS: '', urlAudio: 'res/'+mode.options.res+'/snd/8', framestart:0, loop:0, framestop:0};
            reslist['Question/Answer3'] = {urlGif: '', urlJS: '', urlAudio: 'res/'+mode.options.res+'/snd/9', framestart:0, loop:0, framestop:0};
            reslist['Question/Answer4'] = {urlGif: '', urlJS: '', urlAudio: 'res/'+mode.options.res+'/snd/10', framestart:0, loop:0, framestop:0};
            //reslist['Question/RevealAnswer'] = {urlGif: '', urlJS: '', urlAudio: 'res/'+mode.options.res+'/snd/11', framestart:0, loop:0, framestop:0};

            mode.options.strjs = getYDKJFile('js','res/'+mode.options.res+'/STR.js');
            mode.options.timer = new YDKJTimer10();
            mode.options.timer.preload(thisAPI.resources(mode.options.timer));

            return reslist;
        }
        if (mode instanceof ModeDisOrDat) {
            reslist = {
                'DisOrDat/ChoicePlayer1on3': 0,
                'DisOrDat/ChoicePlayer2on3': 0,
                'DisOrDat/ChoicePlayer3on3': 0,
                'DisOrDat/AnnounceCategory': 0,
                'DisOrDat/TimerComesIn': 0,
                'DisOrDat/GameStart': 0,
                'DisOrDat/Intro': 0,
                'DisOrDat/IntroStill': 0,
                'DisOrDat/MusicLoopRules1': 0,
                'DisOrDat/MusicLoopRules2': 0,
                'DisOrDat/ShowQuestion': 0,
                'DisOrDat/MusicLoopPlay1': 0,
                'DisOrDat/MusicLoopPlay2': 0,
                'DisOrDat/MusicLoopPlay3': 0,
                'DisOrDat/MusicLoopPlay4': 0
            };
            for(r in reslist) if (reslist.hasOwnProperty(r)) reslist[r] = demores(r);

            reslist['DisOrDat/QuestionTitle'] = {urlGif: '', urlJS: '', urlAudio: 'res/'+mode.options.res+'/snd/1', framestart:0, loop:0, framestop:0};
            reslist['DisOrDat/QuestionIntro1'] = {urlGif: '', urlJS: '', urlAudio: 'res/'+mode.options.res+'/snd/2', framestart:0, loop:0, framestop:0};
            reslist['DisOrDat/QuestionIntro2'] = {urlGif: '', urlJS: '', urlAudio: 'res/'+mode.options.res+'/snd/3', framestart:0, loop:0, framestop:0};

            return reslist;
        }
        if (mode instanceof YDKJTimer10) {
            var resName = 'res/5QDemo/off4/8018';
            return {'Common/Timer10': {urlGif: resName+'.gif', urlJS: resName+'.js', urlAudio: '',framestart: 73, loop: 0,framestop: 75},
                    'Common/Timer10/Frames': {
                        'Still':{
                            10:{framestart:69},
                            9:{framestart:88},
                            8:{framestart:107},
                            7:{framestart:125},
                            6:{framestart:144},
                            5:{framestart:163},
                            4:{framestart:182},
                            3:{framestart:200},
                            2:{framestart:218},
                            1:{framestart:236},
                            0:{framestart:261}
                        },
                        'Hide':{
                            10:{framestart:73,framestop:75},
                            9:{framestart:92,framestop:94},
                            8:{framestart:110,framestop:112},
                            7:{framestart:129,framestop:131},
                            6:{framestart:148,framestop:150},
                            5:{framestart:167,framestop:169},
                            4:{framestart:185,framestop:187},
                            3:{framestart:203,framestop:205},
                            2:{framestart:221,framestop:223},
                            1:{framestart:239,framestop:241},
                            0:{framestart:264,framestop:266}
                        },
                        'Show':{
                            10:{framestart:59,framestop:65},
                            9:{framestart:79,framestop:85},
                            8:{framestart:98,framestop:104},
                            7:{framestart:116,framestop:122},
                            6:{framestart:135,framestop:141},
                            5:{framestart:154,framestop:160},
                            4:{framestart:173,framestop:179},
                            3:{framestart:191,framestop:197},
                            2:{framestart:209,framestop:215},
                            1:{framestart:227,framestop:233},
                            0:{framestart:245,framestop:251}
                        }
                    }
            };
        }
    };

    YDKJAPI.prototype.players = function() {
        var playernames = shuffle(['David','Marité','Marjorie','Frédéric','Olivier','Mathieu','Alicia','Fabrice','Jackqueline','Bruno','Natacha','Jeff','Henri','Barbara','Christophe','Luc','Danièle','Serge','Anita','Alain','Denise','Marcel','Lucette','Gilles','Julien','Adrienne','Camille','Anna','Laurel','Diane','Michelle']);
        return [
            {name:playernames[0],score:0},
            {name:playernames[1],score:0},
            {name:playernames[2],score:0}
        ];
    };
};

YDKJAPI.prototype.initgame = function() {
    var thisAPI = this;

    YDKJAPI.prototype.gamemode = function() {
        return new YDKJMode(thisAPI.game, 'Intro', {});
        //return new YDKJMode(thisAPI.game, 'Category', {category: 1, questionnumber: 1});
        //return new YDKJMode(thisAPI.game, 'Question', {questionnumber:1,res:'QFold1/AJM',correctanswer:4});
    };

    YDKJAPI.prototype.resources = function() {
        return {};
    };

    YDKJAPI.prototype.players = function() {
        return [
            {name:'Player1',score:0},
            {name:'Player2',score:0},
            {name:'Player3',score:0}
        ];
    };
};
