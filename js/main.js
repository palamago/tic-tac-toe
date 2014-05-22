var TicTacToe;

;(function(global, document, $,ko){

    "use strict";

    //Fix strange bug using jquery2 and bootstrap3
    HTMLDivElement.prototype.remove = function(){};

    TicTacToe = global.TicTacToe = global.TicTacToe || {};

    TicTacToe.initialBoard = [
            ko.observableArray([ko.observable(undefined),ko.observable(undefined),ko.observable(undefined)]),
            ko.observableArray([ko.observable(undefined),ko.observable(undefined),ko.observable(undefined)]),
            ko.observableArray([ko.observable(undefined),ko.observable(undefined),ko.observable(undefined)])
            ];

    //Var definitions
    TicTacToe.bindings = {
        board : ko.observableArray(TicTacToe.initialBoard),
        loading: ko.observable(false)
    };

    //methods
    TicTacToe.init = function () {
        //Initialize board tiles click
        $("#main-content").on("click", ".board-tile", function() {
            var $obj = $(this);
            if(TicTacToe.bindings.loading() === false && $obj.hasClass('clickeable')){
                TicTacToe.userMove($(this).attr('rel').split('|'));
            }
        });

        //Clear session
        TicTacToe.apiCall({ action:'clear' },
            function(data) {
                ko.applyBindings(TicTacToe.bindings);
                TicTacToe.bindings.loading(false);
            });
    };

    TicTacToe.userMove = function(position){
        this.bindings.loading(true);
        this.setTileValue(position,'icon-radio-unchecked');
        this.cpuMove(position);
    };

    TicTacToe.cpuMove = function(position){
        var that = this;

        TicTacToe.apiCall({ action:'move', position: position },
            function(data) {
                that.bindings.loading(false);
                that.setTileValue(data.position,'icon-cancel-2');
                console.log(data);
            });
    };
    
    TicTacToe.apiCall = function(params,callback){
        $.post("api/index.php", params, 
            function(data, textStatus, jqXHR) {
                callback(data);
            },"json")
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error(textStatus);
            });
    };

    TicTacToe.setTileValue = function (position,value) {
        TicTacToe.bindings.board()[position[0]]()[position[1]](value);
    };

})(window, document,jQuery,ko);
