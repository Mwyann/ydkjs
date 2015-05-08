/********** YDKJAPI **********/

function YDKJAPI(game, demomode) {
    this.game = game;
    if (demomode) this.initdemo(); else this.initgame();
}

YDKJAPI.prototype.initdemo = function() {
    var thisAPI = this;

    YDKJAPI.prototype.gamemode = function(currentmode) {
        var newmode;
        if (currentmode === undefined) newmode = new YDKJMode(thisAPI.game, 'Intro', {});
        //if (currentmode === undefined) newmode = new YDKJMode(thisAPI.game, 'Category', {category: 1, questionnumber: 2}); // Ligne DEBUG
        if (currentmode instanceof ModeIntro) newmode = new YDKJMode(thisAPI.game, 'Category', {category: 1, questionnumber: 1, chooseplayer: 3});
        if ((currentmode instanceof ModeQuestion) || (currentmode instanceof ModeDisOrDat)) newmode = new YDKJMode(thisAPI.game, 'Category', {category: 1, questionnumber: currentmode.options.questionnumber+1});

        return function(f) {f(newmode)}
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
            return function(f) {f(reslist)}
        }
        else if (mode instanceof ModeCategory) {
            reslist = {
                'Category/SFXShowCategoryScreen': 0,
                'Category/MusicChooseCategoryStart': 0,
                'Category/MusicChooseCategoryLoop':0,
                'Category/ShowCategories': 0,
                'Category/CategoryTitles': 0,
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
                questions = shuffle(['ABB', 'ABE', 'ACB', 'AJM']);
                questiontitles = {'ABB': 'Keuf you !', 'ABE': 'Ma meilleure boum', 'ACB': 'Se noyer dans un verre d’eau', 'AJM': 'C’est dur vraiment plus longtemps'};
                reslist['questiontitles'] = [];

                for (i=1; i<=3; i++) {
                    reslist['questiontitles'].push(questiontitles[questions[i-1]]);
                    reslist['question'+i] = new YDKJMode(thisAPI.game, 'Question', {category:mode.options.category,questionnumber:mode.options.questionnumber,id:questions[i-1]}); // Preload des questions suivantes
                }
            } else { // Couci-Couça
                questions = shuffle(['DAC', 'DAL', 'DAP']);
                questiontitles = {'DAC': 'Du travail bien fait', 'DAL': 'L’envers de la médaille, c’est l’autre côté', 'DAP': 'La tête dans le bol'};
                reslist['questiontitles'] = [];

                for (i=1; i<=3; i++) {
                    reslist['questiontitles'].push(questiontitles[questions[i-1]]);
                    reslist['question'+i] = new YDKJMode(thisAPI.game, 'DisOrDat', {category:mode.options.category,questionnumber:mode.options.questionnumber,id:questions[i-1]}); // Preload des questions suivantes
                }
            }
            return function(f) {f(reslist)}
        }
        else if (mode instanceof ModeQuestion) {
            reslist = {
                'Question/AnnounceCategory': 0,
                'Question/ShowCategory': 0,
                'Question/TimerComesIn': 0,
                'Question/PrepareTimer': 0,
                'Question/JingleReadQuestion': 0,
                'Question/JingleTimer': 0,
                'Question/TimerTimeOut': 0,
                'Question/ShowHeader': 0,
                'Question/ShowQuestion': 0,
                'Question/HideQuestion': 0,
                'Question/SFXPlayerBuzz': 0,
                'Question/SFXPlayerKey': 0,
                'Question/SFXPlayerLose': 0,
                'Question/SFXPlayerCorrect': 0,
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
                'Question/ShowAnswer1': 0,
                'Question/ShowAnswer2': 0,
                'Question/ShowAnswer3': 0,
                'Question/ShowAnswer4': 0,
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
                'Question/LastPlayers23': 0,
                'Question/RevealAnswer': 0
            };
            for(r in reslist) if (reslist.hasOwnProperty(r)) reslist[r] = demores(r);

            var SFXWrongAnswer = demores('Question/SFXWrongAnswer');
            reslist['Question/WrongAnswer1']['urlAudio'] = SFXWrongAnswer['urlAudio'];
            reslist['Question/WrongAnswer2']['urlAudio'] = SFXWrongAnswer['urlAudio'];
            reslist['Question/WrongAnswer3']['urlAudio'] = SFXWrongAnswer['urlAudio'];
            reslist['Question/WrongAnswer4']['urlAudio'] = SFXWrongAnswer['urlAudio'];
            reslist['Question/TimeOut1'] = demores('Question/TimeOut');
            reslist['Question/TimeOut2'] = demores('Question/TimeOut');
            reslist['Question/TimeOut3'] = demores('Question/TimeOut');

            // Valeurs spécifiques à la question
            if (mode.options.questionnumber == 1) { // Charger les bonnes ressources en fonction du n° de la question
                reslist['Question/JingleQuestion'] = demores('Question/JingleQuestion1');
                reslist['Question/BGQuestion'] = demores('Question/BGQuestion1');
            }
            if (mode.options.questionnumber == 2) {
                reslist['Question/JingleQuestion'] = demores('Question/JingleQuestion2');
                reslist['Question/BGQuestion'] = demores('Question/BGQuestion2');
            }
            if (mode.options.questionnumber >= 3) {
                reslist['Question/JingleQuestion'] = demores('Question/JingleQuestion3');
                reslist['Question/BGQuestion'] = demores('Question/BGQuestion3');
            }

            if (mode.options.id == 'ABB') {
                mode.options.correctanswer = 3;
                mode.options.value = 2000;
            }
            else if (mode.options.id == 'ABE') {
                mode.options.correctanswer = 3;
                mode.options.value = 2000;
            }
            else if (mode.options.id == 'ACB') {
                mode.options.correctanswer = 3;
                mode.options.value = 2000;
            }
            else if (mode.options.id == 'AJM') {
                mode.options.correctanswer = 4;
                mode.options.value = 2000;
            }
            mode.options.correctanswerisdefault = 0;

            var res = 'res/QFold1/'+mode.options.id;

            reslist['Question/AnnounceValue'] = demores('Question/AnnounceValue'+mode.options.value+'F');
            reslist['Question/VoiceAnnounceValue'] = demores('Question/VoiceAnnounceValue'+mode.options.value+'F');
            reslist['Question/HideValue'] = demores('Question/HideValue'+mode.options.value+'F');

            reslist['Question/QuestionTitle'] = {urlAudio: res+'/snd/1'};
            if (mode.options.id != 'ACB') reslist['Question/PreQuestion'] = {urlAudio: res+'/snd/2'};
            else reslist['Question/PreQuestion'] = {urlAudio: 'res/5QDemo/Mc15/1'};
            reslist['Question/Question'] = {urlAudio: res+'/snd/3'};
            reslist['Question/Answers'] = {urlAudio: res+'/snd/5'};
            reslist['Question/EndQuestion'] = {urlAudio: res+'/snd/6'};
            reslist['Question/Answer1'] = {urlAudio: res+'/snd/7'};
            reslist['Question/Answer2'] = {urlAudio: res+'/snd/8'};
            reslist['Question/Answer3'] = {urlAudio: res+'/snd/9'};
            reslist['Question/Answer4'] = {urlAudio: res+'/snd/10'};
            if (mode.options.id != 'AJM') reslist['Question/AboutToRevealAnswer'] = {urlAudio: res+'/snd/11'};
            else reslist['Question/AboutToRevealAnswer'] = demores('Question/DefaultRevealAnswer');

            mode.options.timer = new YDKJTimer(10);
            var timer10ready = thisAPI.resources(mode.options.timer);
            timer10ready(function(resources) {
                mode.options.timer.preload(resources);
            });

            var strjs = getYDKJFile('js',res+'/STR.js');
            return function(f) {
                strjs.ready(function() {
                    mode.STR = strjs.res;
                    f(reslist);
                });
            };
        }
        else if (mode instanceof ModeDisOrDat) {
            reslist = {
                'DisOrDat/AnnounceCategory':0,
                'DisOrDat/AnnounceTimer':0,
                'DisOrDat/BadScoreSoFar':0,
                'DisOrDat/CannotSkipLast':0,
                'DisOrDat/ChoicePlayer1':0,
                'DisOrDat/ChoicePlayer1on1':0,
                'DisOrDat/ChoicePlayer1on2':0,
                'DisOrDat/ChoicePlayer1on3':0,
                'DisOrDat/ChoicePlayer2':0,
                'DisOrDat/ChoicePlayer2on2':0,
                'DisOrDat/ChoicePlayer2on3':0,
                'DisOrDat/ChoicePlayer3':0,
                'DisOrDat/ChoicePlayer3on3':0,
                'DisOrDat/GameStart':0,
                'DisOrDat/JingleStartPlay1':0,
                'DisOrDat/JingleStartPlay2':0,
                'DisOrDat/LastQuestionAnnounce':0,
                'DisOrDat/LastQuestionHurryUp':0,
                'DisOrDat/Intro':0,
                'DisOrDat/MusicLoopPlay1':0,
                'DisOrDat/MusicLoopPlay2':0,
                'DisOrDat/MusicLoopPlay3':0,
                'DisOrDat/MusicLoopPlay4':0,
                'DisOrDat/MusicLoopRules1':0,
                'DisOrDat/MusicLoopRules2':0,
                'DisOrDat/MusicLoopScore':0,
                'DisOrDat/MusicPlayEnd':0,
                'DisOrDat/MusicEndTimeOut':0,
                'DisOrDat/Public0on71':0,
                'DisOrDat/Public0on72':0,
                'DisOrDat/Public0on73':0,
                'DisOrDat/Public7on71':0,
                'DisOrDat/Public7on72':0,
                'DisOrDat/Public7on73':0,
                'DisOrDat/QuestionSkipped':0,
                'DisOrDat/RestartSkipped1':0,
                'DisOrDat/RestartSkipped2':0,
                'DisOrDat/RulesExplain1000FCorrect':0,
                'DisOrDat/RulesExplain1000FWrong':0,
                'DisOrDat/RulesExplain500FCorrect':0,
                'DisOrDat/RulesExplain500FWrong':0,
                'DisOrDat/RulesExplainBoth':0,
                'DisOrDat/RulesExplainSkip':0,
                'DisOrDat/RulesSkipExplain':0,
                'DisOrDat/SFXCorrect':0,
                'DisOrDat/SFXHidePrice':0,
                'DisOrDat/SFXKeyPress':0,
                'DisOrDat/SFXKeyPress2':0,
                'DisOrDat/SFXShowKey':0,
                'DisOrDat/SFXShowPriceCorrect':0,
                'DisOrDat/SFXShowPriceWrong':0,
                'DisOrDat/SFXTimeOut1':0,
                'DisOrDat/SFXTimeOut2':0,
                'DisOrDat/SFXWrong':0,
                'DisOrDat/SFXScoreWin':0,
                'DisOrDat/SFXScoreLose':0,
                'DisOrDat/Score10on7':0,
                'DisOrDat/Score11on7':0,
                'DisOrDat/Score12on7':0,
                'DisOrDat/Score13on7':0,
                'DisOrDat/Score14on7':0,
                'DisOrDat/Score15on7':0,
                'DisOrDat/Score16on7':0,
                'DisOrDat/Score17on7':0,
                'DisOrDat/Score20on7':0,
                'DisOrDat/Score21on7':0,
                'DisOrDat/Score22on7':0,
                'DisOrDat/Score23on7':0,
                'DisOrDat/Score24on7':0,
                'DisOrDat/Score25on7':0,
                'DisOrDat/Score26on7':0,
                'DisOrDat/Score27on7':0,
                'DisOrDat/Score3Positive':0,
                'DisOrDat/Score36on7':0,
                'DisOrDat/Score35on7':0,
                'DisOrDat/Score34on7':0,
                'DisOrDat/Score3Negative':0,
                'DisOrDat/Score32on7':0,
                'DisOrDat/Score31on7':0,
                'DisOrDat/Score30on7':0,
                'DisOrDat/ShowFinalScore':0,
                'DisOrDat/SuggestSkip1':0,
                'DisOrDat/SuggestSkip2':0,
                'DisOrDat/SuggestSkip3':0,
                'DisOrDat/TimeOut':0,
                'DisOrDat/TimeOutLose1000FMoreQuestions':0,
                'DisOrDat/TimeOutLose1000FOneQuestion':0,
                'DisOrDat/TimeOutLose500FMoreQuestions':0,
                'DisOrDat/TimeOutLose500FOneQuestion':0,
                'DisOrDat/TimerComesIn':0,
                'DisOrDat/WrongItWasBoth':0,
                'DisOrDat/WrongKeyToSkip':0,

                'DisOrDat/IntroStill':0,
                'DisOrDat/PrepareTimer':0,
                'DisOrDat/TimerTimeOut':0,
                'DisOrDat/ShowHeader':0,
                'DisOrDat/ShowCategory':0,
                'DisOrDat/HideCategory':0,
                'DisOrDat/ShowSubject':0,
                'DisOrDat/HideSubject':0,
                'DisOrDat/ShowQuestion':0,
                'DisOrDat/HideQuestionSkip':0,
                'DisOrDat/HideQuestionWrong':0,
                'DisOrDat/HideQuestionCorrect':0,
                'DisOrDat/HideQuestionTimeout':0,

                'DisOrDat/Button1of4ComesIn':0,
                'DisOrDat/Button1of4StandbyLoop':0,
                'DisOrDat/Button1of4Ready':0,
                'DisOrDat/Button1of4Push':0,
                'DisOrDat/Button1of4Leave':0,

                'DisOrDat/Button2of4ComesIn':0,
                'DisOrDat/Button2of4StandbyLoop':0,
                'DisOrDat/Button2of4Ready':0,
                'DisOrDat/Button2of4Push':0,
                'DisOrDat/Button2of4Leave':0,

                'DisOrDat/Button3of4ComesIn':0,
                'DisOrDat/Button3of4StandbyLoop':0,
                'DisOrDat/Button3of4Ready':0,
                'DisOrDat/Button3of4Push':0,
                'DisOrDat/Button3of4Leave':0,

                'DisOrDat/Button4of4ComesIn':0,
                'DisOrDat/Button4of4StandbyLoop':0,
                'DisOrDat/Button4of4Ready':0,
                'DisOrDat/Button4of4Push':0,
                'DisOrDat/Button4of4Leave':0,

                'DisOrDat/Button1of3ComesIn':0,
                'DisOrDat/Button1of3StandbyLoop':0,
                'DisOrDat/Button1of3Ready':0,
                'DisOrDat/Button1of3Push':0,
                'DisOrDat/Button1of3Leave':0,

                'DisOrDat/Button2of3ComesIn':0,
                'DisOrDat/Button2of3StandbyLoop':0,
                'DisOrDat/Button2of3Ready':0,
                'DisOrDat/Button2of3Push':0,
                'DisOrDat/Button2of3Leave':0,

                'DisOrDat/Button4of3ComesIn':0,
                'DisOrDat/Button4of3StandbyLoop':0,
                'DisOrDat/Button4of3Ready':0,
                'DisOrDat/Button4of3Push':0,
                'DisOrDat/Button4of3Leave':0,

                'DisOrDat/Value500FComesIn':0,
                'DisOrDat/Value500FMinus':0,
                'DisOrDat/Value500FLeave':0,
                'DisOrDat/Value1000FComesIn':0,
                'DisOrDat/Value1000FMinus':0,
                'DisOrDat/Value1000FLeave':0,

                'DisOrDat/MessageSpaceBarComesIn':0,
                'DisOrDat/MessageSpaceBarLeave':0,

                'DisOrDat/Player1ComesIn':0,
                'DisOrDat/Player1WinGrow':0,
                'DisOrDat/Player1WinBig':0,
                'DisOrDat/Player1Win':0,
                'DisOrDat/Player1LoseGrow':0,
                'DisOrDat/Player1LoseBig':0,
                'DisOrDat/Player1Lose':0,

                'DisOrDat/Player2ComesIn':0,
                'DisOrDat/Player2WinGrow':0,
                'DisOrDat/Player2WinBig':0,
                'DisOrDat/Player2Win':0,
                'DisOrDat/Player2LoseGrow':0,
                'DisOrDat/Player2LoseBig':0,
                'DisOrDat/Player2Lose':0,

                'DisOrDat/Player3ComesIn':0,
                'DisOrDat/Player3WinGrow':0,
                'DisOrDat/Player3WinBig':0,
                'DisOrDat/Player3Win':0,
                'DisOrDat/Player3LoseGrow':0,
                'DisOrDat/Player3LoseBig':0,
                'DisOrDat/Player3Lose':0,

                'DisOrDat/TempScoreShow':0,
                'DisOrDat/TempScoreCorrectStart':0,
                'DisOrDat/TempScoreCorrect':0,
                'DisOrDat/TempScoreCorrectStop':0,
                'DisOrDat/TempScoreWrongStart':0,
                'DisOrDat/TempScoreWrong':0,
                'DisOrDat/TempScoreWrongStop':0,
                'DisOrDat/TempScoreHide':0,

                'DisOrDat/FinalScoreWinShow':0,
                'DisOrDat/FinalScoreWinHide':0,
                'DisOrDat/FinalScoreLoseShow':0,
                'DisOrDat/FinalScoreLoseHide':0,

                'Question/SFXPlayerCorrect':0,
                'Question/SFXPlayerLose':0
            };
            for(r in reslist) if (reslist.hasOwnProperty(r)) reslist[r] = demores(r);

            mode.options.value = 500;

            var resDD = 'res/QFold1/'+mode.options.id;

            reslist['DisOrDat/QuestionTitle'] = {urlAudio: resDD+'/snd/1'};
            reslist['DisOrDat/QuestionIntro1'] = {urlAudio: resDD+'/snd/2'};
            reslist['DisOrDat/QuestionIntro2'] = {urlAudio: resDD+'/snd/3'};
            reslist['DisOrDat/QuestionAnswer1'] = {urlAudio: resDD+'/snd/4'};
            reslist['DisOrDat/QuestionAnswer2'] = {urlAudio: resDD+'/snd/5'};

            reslist['DisOrDat/Question1'] = {urlAudio: resDD+'/snd/6'};
            reslist['DisOrDat/Question2'] = {urlAudio: resDD+'/snd/7'};
            reslist['DisOrDat/Question3'] = {urlAudio: resDD+'/snd/8'};
            reslist['DisOrDat/Question4'] = {urlAudio: resDD+'/snd/9'};
            reslist['DisOrDat/Question5'] = {urlAudio: resDD+'/snd/10'};
            reslist['DisOrDat/Question6'] = {urlAudio: resDD+'/snd/11'};
            reslist['DisOrDat/Question7'] = {urlAudio: resDD+'/snd/12'};

            reslist['DisOrDat/Public0on7'] = reslist['DisOrDat/Public0on7'+(Math.floor(Math.random()*3)+1)];
            reslist['DisOrDat/Public7on7'] = reslist['DisOrDat/Public7on7'+(Math.floor(Math.random()*3)+1)];
            reslist['DisOrDat/RestartSkipped'] = reslist['DisOrDat/RestartSkipped'+(Math.floor(Math.random()*2)+1)];

            mode.options.timer = new YDKJTimer(30);
            var timer30ready = thisAPI.resources(mode.options.timer);
            timer30ready(function(resources) {
                mode.options.timer.preload(resources);
            });

            var strjsDD = getYDKJFile('js',resDD+'/STR.js');
            return function(f) {
                strjsDD.ready(function() {
                    mode.STR = strjsDD.res;
                    f(reslist);
                });
            };
        }
        else if (mode instanceof YDKJTimer) {
            var resName10 = 'res/5QDemo/off4/8018';
            var resName30 = 'res/5QDemo/off4/8021';
            reslist = {'Common/Timer10': {urlGif: resName10+'.gif', urlJS: resName10+'.js', framestart: 73, loop: 0, framestop: 75},
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
                       },
                       'Common/Timer30': {urlGif: resName30+'.gif', urlJS: resName30+'.js', framestart: 79, loop: 0, framestop: 79},
                       'Common/Timer30/Frames': {
                            'Still':{
                                30:{framestart:79},
                                29:{framestart:99},
                                28:{framestart:118},
                                27:{framestart:139},
                                26:{framestart:160},
                                25:{framestart:180},
                                24:{framestart:201},
                                23:{framestart:221},
                                22:{framestart:241},
                                21:{framestart:261},
                                20:{framestart:281},
                                19:{framestart:300},
                                18:{framestart:320},
                                17:{framestart:340},
                                16:{framestart:360},
                                15:{framestart:380},
                                14:{framestart:401},
                                13:{framestart:421},
                                12:{framestart:441},
                                11:{framestart:461},
                                10:{framestart:481},
                                9:{framestart:500},
                                8:{framestart:519},
                                7:{framestart:537},
                                6:{framestart:556},
                                5:{framestart:575},
                                4:{framestart:594},
                                3:{framestart:612},
                                2:{framestart:630},
                                1:{framestart:648},
                                0:{framestart:673}
                            },
                            'Hide':{
                                30:{framestart:83,framestop:85},
                                29:{framestart:102,framestop:104},
                                28:{framestart:122,framestop:124},
                                27:{framestart:144,framestop:146},
                                26:{framestart:164,framestop:166},
                                25:{framestart:184,framestop:186},
                                24:{framestart:205,framestop:207},
                                23:{framestart:225,framestop:227},
                                22:{framestart:245,framestop:247},
                                21:{framestart:265,framestop:267},
                                20:{framestart:284,framestop:286},
                                19:{framestart:304,framestop:306},
                                18:{framestart:324,framestop:326},
                                17:{framestart:344,framestop:346},
                                16:{framestart:364,framestop:366},
                                15:{framestart:384,framestop:386},
                                14:{framestart:405,framestop:407},
                                13:{framestart:425,framestop:427},
                                12:{framestart:445,framestop:447},
                                11:{framestart:465,framestop:467},
                                10:{framestart:485,framestop:487},
                                9:{framestart:504,framestop:506},
                                8:{framestart:522,framestop:524},
                                7:{framestart:541,framestop:543},
                                6:{framestart:560,framestop:562},
                                5:{framestart:579,framestop:581},
                                4:{framestart:597,framestop:599},
                                3:{framestart:615,framestop:617},
                                2:{framestart:633,framestop:635},
                                1:{framestart:651,framestop:653},
                                0:{framestart:676,framestop:678}
                            },
                            'Show':{
                                30:{framestart:79,framestop:79}, // Il n'y a pas d'animation pour montrer le 30, puisqu'on n'y revient jamais
                                29:{framestart:89,framestop:95},
                                28:{framestart:108,framestop:114},
                                27:{framestart:128,framestop:134},
                                26:{framestart:150,framestop:156},
                                25:{framestart:170,framestop:176},
                                24:{framestart:190,framestop:196},
                                23:{framestart:211,framestop:217},
                                22:{framestart:231,framestop:237},
                                21:{framestart:251,framestop:257},
                                20:{framestart:271,framestop:277},
                                19:{framestart:290,framestop:296},
                                18:{framestart:310,framestop:316},
                                17:{framestart:330,framestop:336},
                                16:{framestart:350,framestop:356},
                                15:{framestart:370,framestop:376},
                                14:{framestart:390,framestop:396},
                                13:{framestart:411,framestop:417},
                                12:{framestart:431,framestop:437},
                                11:{framestart:451,framestop:457},
                                10:{framestart:471,framestop:477},
                                9:{framestart:491,framestop:497},
                                8:{framestart:510,framestop:516},
                                7:{framestart:528,framestop:534},
                                6:{framestart:547,framestop:553},
                                5:{framestart:566,framestop:572},
                                4:{framestart:585,framestop:591},
                                3:{framestart:603,framestop:609},
                                2:{framestart:621,framestop:627},
                                1:{framestart:639,framestop:645},
                                0:{framestart:657,framestop:663}
                            }
                       }
            };
            return function(f) {f(reslist)}
        }

        return function(f) {f(reslist)}
    };

    YDKJAPI.prototype.players = function() {
        var playernames = shuffle(['David','Marité','Marjorie','Frédéric','Olivier','Mathieu','Alicia','Fabrice','Jackqueline','Bruno','Natacha','Jeff','Henri','Barbara','Christophe','Luc','Danièle','Serge','Anita','Alain','Denise','Marcel','Lucette','Gilles','Julien','Adrienne','Camille','Anna','Laurel','Diane','Michelle']);
        var players = [
            {name:playernames[0],score:0,keycode:113},
            {name:playernames[1],score:0,keycode:98},
            {name:playernames[2],score:0,keycode:112}
        ];

        return function(f) {f(players)}
    };
};

YDKJAPI.prototype.initgame = function() {
    var thisAPI = this;

    // Extrait les valeurs retournées par un appel Ajax
    var getHeaderJSON = function(xhr) {
        var json;
        try { json = xhr.getResponseHeader('X-JSON') }
        catch(e) {}

        if (json) {
            return JSON.parse(json);
            //var data = eval('(' + json + ')'); // or JSON.parse or whatever you like
            //return data
        }
        return [];
    };

    YDKJAPI.prototype.gamemode = function(currentmode) {
        var data = {call: 'gamemode'};

        if (currentmode === undefined) data['currentmode'] = 'None';
        if (currentmode instanceof ModeIntro) data['currentmode'] = 'Intro';
        if ((currentmode instanceof ModeQuestion) || (currentmode instanceof ModeDisOrDat)) {data['currentmode'] = 'Category'; data['category'] = 1; data['questionnumber'] = parseInt(currentmode.options.questionnumber)+1;}

        var newmode;
        var ready = 0;
        var readyfunctions = [];

        jQuery.ajax({
            url: 'api/',
            type: 'post',
            data: data,
            success: function(html, status, xhr) {
                var data = getHeaderJSON(xhr);

                var newmodedata = data['newmode'];

                if (newmodedata['mode'] == 'Intro') newmode = new YDKJMode(thisAPI.game, 'Intro', {});
                if (newmodedata['mode'] == 'Category') newmode = new YDKJMode(thisAPI.game, 'Category', {category: newmodedata['category'], questionnumber: newmodedata['questionnumber'], chooseplayer: newmodedata['chooseplayer']});

                ready = 1;
                for(var i = 0; i < readyfunctions.length; i++) {
                    readyfunctions[i].call(this,newmode);
                }
            },
            error: function (xhr, ajaxOptions, thrownError){
                //displayLoader(false);
            }
        });

        return function(f) {
            if (!ready) readyfunctions.push(f); else f.call(this,newmode);
        };
    };

    YDKJAPI.prototype.resources = function(mode) {
        var data = {call: 'resources'};

        if (mode instanceof ModeIntro) {
            data['mode'] = 'Intro';
        }
        else if (mode instanceof ModeCategory) {
            data['mode'] = 'Category';
            data['category'] = mode.options.category;
            data['questionnumber'] = mode.options.questionnumber;
        }
        else if (mode instanceof ModeQuestion) {
            data['mode'] = 'Question';
            data['category'] = mode.options.category;
            data['questionnumber'] = mode.options.questionnumber;
            data['id'] = mode.options.id;
        }
        else if (mode instanceof ModeDisOrDat) {
            data['mode'] = 'DisOrDat';
            data['category'] = mode.options.category;
            data['id'] = mode.options.id;
        }
        else if (mode instanceof YDKJTimer) {
            data['mode'] = 'Timer'+mode.timerType;
        }

        var reslist;
        var ready = 0;
        var readyfunctions = [];

        jQuery.ajax({
            url: 'api/',
            type: 'post',
            data: data,
            success: function(html, status, xhr) {
                var data = getHeaderJSON(xhr);
                var strtmp;

                reslist = data['reslist'];

                if (mode instanceof ModeCategory) {
                    // Précharger les questions avec l'interface de catégorie
                    for (i = 1; i <= 3; i++) {
                        reslist['question'+i] = new YDKJMode(thisAPI.game, reslist['questiontype'+i], {category: mode.options.category, questionnumber: mode.options.questionnumber, id: reslist['question'+i]}); // Preload des questions suivantes
                    }
                }

                if (mode instanceof ModeQuestion) {
                    strtmp = [];
                    eval('strtmp = '+reslist['STR']);
                    mode.STR = strtmp;
                    mode.options.value = parseInt(reslist['value']);
                    mode.options.correctanswer = reslist['correctanswer'];
                    mode.options.correctanswerisdefault = reslist['correctanswerisdefault'];
                    mode.options.timer = new YDKJTimer(10);
                    var timer10ready = thisAPI.resources(mode.options.timer);
                    timer10ready(function(resources) {
                        mode.options.timer.preload(resources);
                    });
                }

                if (mode instanceof ModeDisOrDat) {
                    strtmp = [];
                    eval('strtmp = '+reslist['STR']);
                    mode.STR = strtmp;
                    mode.options.value = parseInt(reslist['value']);
                    mode.options.timer = new YDKJTimer(30);
                    var timer30ready = thisAPI.resources(mode.options.timer);
                    timer30ready(function(resources) {
                        mode.options.timer.preload(resources);
                    });
                }

                ready = 1;
                for(var i = 0; i < readyfunctions.length; i++) {
                    readyfunctions[i].call(this,reslist);
                }
            },
            error: function (xhr, ajaxOptions, thrownError){
                //displayLoader(false);
            }
        });

        return function(f) {
            if (!ready) readyfunctions.push(f); else f.call(this,reslist);
        };
    };

    YDKJAPI.prototype.players = function() {
        var data = {call: 'players'};

        var players;
        var ready = 0;
        var readyfunctions = [];

        jQuery.ajax({
            url: 'api/',
            type: 'post',
            data: data,
            success: function(html, status, xhr) {
                var data = getHeaderJSON(xhr);

                players = data['players'];

                ready = 1;
                for(var i = 0; i < readyfunctions.length; i++) {
                    readyfunctions[i].call(this,players);
                }
            },
            error: function (xhr, ajaxOptions, thrownError){
                //displayLoader(false);
            }
        });

        return function(f) {
            if (!ready) readyfunctions.push(f); else f.call(this,players);
        };
    };
};
