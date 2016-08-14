/********** ModeCategory **********/

function ModeCategory() {}

ModeCategory.prototype.preload = function(resources) {
    var thisMode = this;

    this.SFXShowCategoryScreen = new YDKJAnimation(resources['Category/SFXShowCategoryScreen']);

    this.MusicChooseCategoryStart = new YDKJAnimation(resources['Category/MusicChooseCategoryStart']);
    this.MusicChooseCategoryLoop = new YDKJAnimation(resources['Category/MusicChooseCategoryLoop']);
    this.MusicChooseCategoryStart.volume(70);
    this.MusicChooseCategoryLoop.volume(70);
    this.ShowCategories = new YDKJAnimation(resources['Category/ShowCategories']);
    this.CategoryTitles = new YDKJAnimation(resources['Category/CategoryTitles']);

    this.MusicChooseCategoryStart.ended(function(){
        thisMode.MusicChooseCategoryLoop.play();
    });

    this.ChooseCategory = new YDKJAnimation(resources['Category/ChooseCategory']);
    this.ChooseCategoryText = new YDKJAnimation(resources['Category/ChooseCategoryText']);

    this.ChooseCategoryPlayer1 = new YDKJAnimation(resources['Category/ChooseCategoryPlayer1']);
    this.ChooseCategoryPlayer2 = new YDKJAnimation(resources['Category/ChooseCategoryPlayer2']);
    this.ChooseCategoryPlayer3 = new YDKJAnimation(resources['Category/ChooseCategoryPlayer3']);

    this.SFXChoiceCategory = new YDKJAnimation(resources['Category/SFXChoiceCategory']);

    this.LoopCategory1 = new YDKJAnimation(resources['Category/LoopCategory1']);
    this.LoopCategory2 = new YDKJAnimation(resources['Category/LoopCategory2']);
    this.LoopCategory3 = new YDKJAnimation(resources['Category/LoopCategory3']);
    this.ChoiceCategory1 = new YDKJAnimation(resources['Category/ChoiceCategory1']);
    this.ChoiceCategory2 = new YDKJAnimation(resources['Category/ChoiceCategory2']);
    this.ChoiceCategory3 = new YDKJAnimation(resources['Category/ChoiceCategory3']);

    this.questiontitles = resources['questiontitles'];
    this.question1 = resources['question1'];
    this.question2 = resources['question2'];
    this.question3 = resources['question3'];

    if (this.options.chooseplayer) this.chooseplayer = this.options.chooseplayer;
};

ModeCategory.prototype.start = function() {
    var thisMode = this;

    if (!this.chooseplayer) this.chooseplayer = 1; // Déterminer un joueur qui pourra choisir la catégorie
    this.question1.modeObj.chooseplayer = this.chooseplayer;
    this.question2.modeObj.chooseplayer = this.chooseplayer;
    this.question3.modeObj.chooseplayer = this.chooseplayer;

    if (this.chooseplayer == 1) this.ChooseCategoryPlayer = this.ChooseCategoryPlayer1;
    if (this.chooseplayer == 2) this.ChooseCategoryPlayer = this.ChooseCategoryPlayer2;
    if (this.chooseplayer == 3) this.ChooseCategoryPlayer = this.ChooseCategoryPlayer3;

    var listener;
    var nextquestion = 0;

    var doChooseCategory = function(chosen) {
        var choice;
        if (chosen == -1) { // Timeout
            // TODO A gérer
        }
        if (chosen) {
            doChooseCategory = false;
            unbindKeyListener(listener);
            switch (chosen) {
                case 1:
                    choice = thisMode.ChoiceCategory1;
                    break;
                case 2:
                    choice = thisMode.ChoiceCategory2;
                    break;
                case 3:
                    choice = thisMode.ChoiceCategory3;
                    break;
            }
            thisMode.ChooseCategoryPlayer.free();
            thisMode.MusicChooseCategoryLoop.free();
            thisMode.CategoryTitles.free();
            thisMode.LoopCategory1.free();
            thisMode.LoopCategory2.free();
            thisMode.LoopCategory3.free();

            thisMode.SFXChoiceCategory.ended(function () {
                thisMode.ChooseCategory.free();
                thisMode.ChooseCategoryText.free();
                choice.free();
            });

            thisMode.SFXChoiceCategory.play();
            choice.play();
        }
    };

    var chooseCategory = function(chosen) {
        thisMode.game.api.postaction({action: 'selectCategory', value: chosen});
        if (doChooseCategory) doChooseCategory(chosen);
    };

    this.SFXChoiceCategory.ended(100,function(){
        thisMode.ChooseCategoryPlayer.play();
        thisMode.SFXChoiceCategory.reset(true);
        if (thisMode.game.players[thisMode.chooseplayer-1].keycode) { // Joueur local
            listener = bindKeyListener(function (choice) {
                var chosed = 0;
                if (choice == 49) chosed = 1;
                else if (choice == 50) chosed = 2;
                else if (choice == 51) chosed = 3;
                if (chosed) chooseCategory(chosed);
            }); // TODO 10 secondes de timeout
            thisMode.LoopCategory1.click(function(){chooseCategory(1)});
            thisMode.LoopCategory2.click(function(){chooseCategory(2)});
            thisMode.LoopCategory3.click(function(){chooseCategory(3)});
            thisMode.CategoryTitles.click(function(i){
                if (i == 1010) chooseCategory(1);
                if (i == 1020) chooseCategory(2);
                if (i == 1030) chooseCategory(3);
            });
        }
        thisMode.game.api.registeraction('selectCategory', function(data){
            data.value = parseInt(data.value);
            if (data.value > 0) {
                switch (data.value) {
                    case 1:
                        thisMode.question2.free();
                        thisMode.question3.free();
                        nextquestion = thisMode.question1;
                        break;
                    case 2:
                        thisMode.question1.free();
                        thisMode.question3.free();
                        nextquestion = thisMode.question2;
                        break;
                    case 3:
                        thisMode.question1.free();
                        thisMode.question2.free();
                        nextquestion = thisMode.question3;
                        break;
                }
            } // TODO gérer le cas -1 (timeout)
            if (doChooseCategory) doChooseCategory(data.value);
            var registerSelectCategory = function() { // Fonction qui ne fait rien, puisqu'on va recevoir l'action en loopback
                thisMode.game.api.registeraction('selectCategory', function(data){
                    registerSelectCategory();
                });
            };
            thisMode.SFXChoiceCategory.ended(function() {
                this.free();
                nextquestion.start();
            });
        });
    });

    this.game.font.strings[100] = this.game.players[this.chooseplayer-1].name;
    this.game.font.strings[102] = this.game.players[this.chooseplayer-1].name;
    this.game.font.strings[103] = this.game.players[this.chooseplayer-1].name;

    this.ShowCategories.ended(300,function(){
        thisMode.SFXChoiceCategory.play();
        thisMode.ChooseCategoryText.play();
        thisMode.LoopCategory1.play();
        thisMode.LoopCategory2.play();
        thisMode.LoopCategory3.play();
        this.free();
        thisMode.CategoryTitles.play();
    });

    this.game.font.strings[1010] = this.questiontitles[0];
    this.game.font.strings[1020] = this.questiontitles[1];
    this.game.font.strings[1030] = this.questiontitles[2];

    this.ChooseCategory.ended(300,function(){
        thisMode.game.api.synchronize(function() {
            thisMode.ShowCategories.play();
        });
    });

    this.SFXShowCategoryScreen.ended(function(){
        if ((!thisMode.MusicChooseCategoryStart.isplaying) && (!thisMode.MusicChooseCategoryLoop.isplaying)) thisMode.MusicChooseCategoryStart.play();
    });

    // Jouer l'animation du zoom bleu
    var blueZoom = function() {
        var step=0;
        var sizes=[{x:40,y:30}, // Tailles d'origine du jeu, svp
                   {x:80,y:60},
                   {x:160,y:120},
                   {x:240,y:180},
                   {x:320,y:240},
                   {x:400,y:300},
                   {x:480,y:360},
                   {x:560,y:420},
                   {x:640,y:480}];
        var blueDiv = jQuery('<div />').css('z-index','2000');
        blueDiv.appendTo(thisMode.game.html.screen);
        var interval = 0;
        var nextStep = function() {
            if (step < 9) {
                blueDiv.css({
                    'background-color':'#00C',
                    'width':(sizes[step].x)+'px',
                    'height':(sizes[step].y)+'px',
                    'position':'absolute',
                    'left':Math.round((640-sizes[step].x)/2)+'px',
                    'top':Math.round((480-sizes[step].y)/2)+'px'
                });
                step++;
            } else {
                clearInterval(interval);
                var bluehtml = jQuery('<div />').append(blueDiv.css('z-index','')).html();
                thisMode.game.html.screen.html(bluehtml); // On ne garde que le grand cadre bleu.
                thisMode.ChooseCategory.play();
            }
        };
        interval = setInterval(nextStep,40);
    };


    this.SFXShowCategoryScreen.play();
    blueZoom();
    this.MusicChooseCategoryStart.volume(100);
    this.MusicChooseCategoryLoop.volume(100);
};
