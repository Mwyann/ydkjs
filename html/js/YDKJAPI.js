/********** YDKJAPI **********/

function YDKJAPI(game, demomode) {
    this.game = game;
    if (demomode) this.initdemo(); else this.initgame();
}

YDKJAPI.prototype.initdemo = function() {
    YDKJAPI.prototype.gamemode = function() {
        return new YDKJMode(this.game, 'Intro', {}, []);
        //return new YDKJMode(this.game, 'Category', {category: 1, questionnumber: 1}, []);
        //return new YDKJMode(this.game, 'Question', {questionnumber:1,res:'QFold1/AJM',correctanswer:4}, []);
    };

    YDKJAPI.prototype.questions = function() {
        return [
            {name:'Jeff',score:0},
            {name:'David',score:0},
            {name:'Alicia',score:0}
        ];
    };

    YDKJAPI.prototype.players = function() {
        return [
            {name:'Jeff',score:0},
            {name:'David',score:0},
            {name:'Alicia',score:0}
        ];
    };
};

YDKJAPI.prototype.initgame = function() {
    YDKJAPI.prototype.gamemode = function() {
        return new YDKJMode(this.game, 'Intro', {}, []);
        //return new YDKJMode(this.game, 'Category', {category: 1, questionnumber: 1}, []);
        //return new YDKJMode(this.game, 'Question', {questionnumber:1,res:'QFold1/AJM',correctanswer:4}, []);
    };

    YDKJAPI.prototype.questions = function() {
        return [
            {name:'Jeff',score:0},
            {name:'David',score:0},
            {name:'Alicia',score:0}
        ];
    };

    YDKJAPI.prototype.players = function() {
        return [
            {name:'Player1',score:0},
            {name:'Player2',score:0},
            {name:'Player3',score:0}
        ];
    };
};
