var TicTacToe;

;(function(global, document, $,ko){

    "use strict";

    //Fix strange bug using jquery2 and bootstrap3
    HTMLDivElement.prototype.remove = function(){};

    TicTacToe = global.TicTacToe = global.TicTacToe || {};

    //Var definitions
    this.bindings = {

    };

    //methods
    this.init = function () {
        ko.applyBindings(TicTacToe.bindings);
    };

})(window, document,jQuery,ko);
