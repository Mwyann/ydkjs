/********** ModeCategory **********/

function ModeCategory() {}

ModeCategory.prototype.preload = function(resources) {
    this.questiontitles = resources['questiontitles']; delete resources['questiontitles'];
    this.question1 = resources['question1']; delete resources['question1'];
    this.question2 = resources['question2']; delete resources['question2'];
    this.question3 = resources['question3']; delete resources['question3'];

    this.animations = new YDKJAnimList(resources);
    var anim = this.animations;

    anim.volume('MusicChooseCategoryStart', 70) // Volume changé dès le preload car la musique est susceptible d'être déclenchée par le mode précédent
        .volume('MusicChooseCategoryLoop', 70)
        .ended('MusicChooseCategoryStart', function() {
            anim.play('MusicChooseCategoryLoop');
        });

    if (this.options.chooseplayer) this.chooseplayer = this.options.chooseplayer;
};

ModeCategory.prototype.start = function() {
    var thisMode = this;
    var anim = this.animations;

    if (!this.chooseplayer) this.chooseplayer = 1; // Déterminer un joueur qui pourra choisir la catégorie
    this.question1.modeObj.chooseplayer = this.chooseplayer;
    this.question2.modeObj.chooseplayer = this.chooseplayer;
    this.question3.modeObj.chooseplayer = this.chooseplayer;

    var listener;
    var nextquestion = 0;

    var doChooseCategory = function(chosen) {
        if (chosen == -1) { // Timeout
            // TODO A gérer
        }
        if (chosen) {
            doChooseCategory = false;
            unbindKeyListener(listener);
            anim.free('ChooseCategoryPlayer')
                .free('MusicChooseCategoryLoop')
                .free('CategoryTitles')
                .free('LoopCategory1')
                .free('LoopCategory2')
                .free('LoopCategory3')
                .ended('SFXChoiceCategory', function() {
                    anim.free('ChooseCategory');
                    anim.free('ChooseCategoryText');
                    anim.free('ChoiceCategory1');
                    anim.free('ChoiceCategory2');
                    anim.free('ChoiceCategory3');
                })
                .play('SFXChoiceCategory')
                .play('ChoiceCategory'+chosen);
        }
    };

    var chooseCategory = function(chosen) {
        thisMode.game.api.postaction({action: 'selectCategory', value: chosen});
        if (doChooseCategory) doChooseCategory(chosen);
    };

    anim.ended('SFXChoiceCategory', 100, function() {
        anim.play('ChooseCategoryPlayer'+thisMode.chooseplayer)
            .reset('SFXChoiceCategory', true);

        if (hasKeycode(thisMode.game.players[thisMode.chooseplayer-1].keycode)) { // Joueur local
            listener = bindKeyListener(function (choice) {
                var chosed = 0;
                if (choice == 49) chosed = 1;
                else if (choice == 50) chosed = 2;
                else if (choice == 51) chosed = 3;
                if (chosed) chooseCategory(chosed);
            }); // TODO 10 secondes de timeout
            anim.click('LoopCategory1', function(){chooseCategory(1)})
                .click('LoopCategory2', function(){chooseCategory(2)})
                .click('LoopCategory3', function(){chooseCategory(3)})
                .click('CategoryTitles', function(i){
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
            anim.ended('SFXChoiceCategory', function() {
                this.free();
                nextquestion.start();
            });
        });
    });

    this.game.font.strings[100] = this.game.players[this.chooseplayer-1].name;
    this.game.font.strings[102] = this.game.players[this.chooseplayer-1].name;
    this.game.font.strings[103] = this.game.players[this.chooseplayer-1].name;

    anim.ended('ShowCategories', 300, function() {
        this.free();
        anim.play('SFXChoiceCategory')
            .play('ChooseCategoryText')
            .play('LoopCategory1')
            .play('LoopCategory2')
            .play('LoopCategory3')
            .play('CategoryTitles');
    });

    this.game.font.strings[1010] = this.questiontitles[0];
    this.game.font.strings[1020] = this.questiontitles[1];
    this.game.font.strings[1030] = this.questiontitles[2];

    anim.ended('ChooseCategory', 300, function() {
        thisMode.game.api.synchronize(function() {
            anim.play('ShowCategories');
        });
    });

    anim.ended('SFXShowCategoryScreen', function() {
        if ((!anim.get('MusicChooseCategoryStart').isplaying) && (!anim.get('MusicChooseCategoryLoop').isplaying)) anim.play('MusicChooseCategoryStart');
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
                anim.play('ChooseCategory');
            }
        };
        interval = setInterval(nextStep,40);
    };

    anim.play('SFXShowCategoryScreen')
        .volume('MusicChooseCategoryStart',100)
        .volume('MusicChooseCategoryLoop',100);
    blueZoom();
};
