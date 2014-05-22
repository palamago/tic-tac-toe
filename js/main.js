var TicTacToe;

;(function(global, document, $,ko){

    "use strict";

    //Fix strange bug using jquery2 and bootstrap3
    HTMLDivElement.prototype.remove = function(){};

    TicTacToe = global.TicTacToe = global.TicTacToe || {};

    /*
     * To determine a win condition, each square is "tagged" from left
     * to right, top to bottom, with successive powers of 2.  Each cell
     * thus represents an individual bit in a 9-bit string, and a
     * player's squares at any given time can be represented as a
     * unique 9-bit value. A winner can thus be easily determined by
     * checking whether the player's current 9 bits have covered any
     * of the eight "three-in-a-row" combinations.
     *
     *     273                 84
     *        \               /
     *          1 |   2 |   4  = 7
     *       -----+-----+-----
     *          8 |  16 |  32  = 56
     *       -----+-----+-----
     *         64 | 128 | 256  = 448
     *       =================
     *         73   146   292
     *
     * Explanation from: http://jsfiddle.net/rtoal/5wKfF/
     */
    TicTacToe.wins = [7, 56, 448, 73, 146, 292, 273, 84];

    //Knockout binding object
    TicTacToe.bindings = {
        board : ko.observableArray([]),
        loading: ko.observable(false),
        winner: ko.observable(false),
        draw: ko.observable(false)
    };

    //Helpers
    TicTacToe.moves = 0;
    TicTacToe.scores = {
        human: 0,
        cpu:0
    };

    /*
     * Init method
     */
    TicTacToe.init = function () {
        
        //Initialize board tiles click
        $("#main-content").on("click", ".board-tile", function() {
            var $obj = $(this);
            if(TicTacToe.bindings.loading() === false 
                && TicTacToe.bindings.winner() === false 
                && $obj.hasClass('clickeable')){
                TicTacToe.humanMove($(this).attr('rel').split('|'));
            }
        });

        //Clear button click handler
        $('.clear').on('click',function(){ TicTacToe.clear(); });

        //Initialize Knockout data binding
        ko.applyBindings(TicTacToe.bindings);
        
        //Clear information before start
        this.clear();

    };

    /*
     * Process human move
     */
    TicTacToe.humanMove = function(position){
        this.setTileValue(position,'human');
        if(this.moves < 9 && this.bindings.winner() === false){
            this.bindings.loading(true);
            this.cpuMove(position);
        }
    };

    /*
     * Process CPU move
     */
    TicTacToe.cpuMove = function(position){
        var that = this;

        TicTacToe.apiCall({ action:'move', position: position },
            function(data) {
                that.bindings.loading(false);
                that.setTileValue(data.position,'cpu');
            });
    };
    
    /*
     * Generic API call method
     */
    TicTacToe.apiCall = function(params,callback){
        $.post("api/index.php", params, 
            function(data, textStatus, jqXHR) {
                callback(data);
            },"json")
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error(textStatus);
            });
    };
    
    /*
     * Change tile value: circle or cross
     */
    TicTacToe.setTileValue = function (position,player) {
        var tile = this.bindings.board()[position[0]]()[position[1]];
        tile.selected((player=='human')?'icon-radio-unchecked fg-green':'icon-cancel-2 fg-blue');
        TicTacToe.moves++;
        this.checkResults(player,tile.indicator);
    };

    /*
     * Called after every movement, verify is there is a winner
     */
    TicTacToe.checkResults = function(player,i){
        this.scores[player] += i;
        if(this.isWinner(this.scores[player])){
            this.bindings.winner(player);
        }else if(this.moves === 9){
            this.bindings.draw(true);
        }
    };

    /*
     * Returns whether the given score is a winning score.
     */
    TicTacToe.isWinner = function(score) {
        var i;
        for (i = 0; i < this.wins.length; i += 1) {
            if ((this.wins[i] & score) === this.wins[i]) {
                return true;
            }
        }
        return false;
    };

    /*
     * Restart game, clear information 
     */
    TicTacToe.clear = function(){
        var indicator = 1, 
            row,
            cell,
            i,j;

        //Clear board binding
        this.bindings.board([]);
        this.bindings.winner(false);
        this.bindings.draw(false);

        //Clear helpers
        this.moves = 0;
        this.scores = {
            human: 0,
            cpu:0
        };

        //Generate blank board binding
        for (i = 0; i < 3; i += 1) {
            row = ko.observableArray([]);
            for (j = 0; j < 3; j += 1) {
                cell = {
                    selected: ko.observable(undefined),
                    indicator: indicator
                };
                row.push(cell);
                indicator += indicator;
            }
            this.bindings.board.push(row);
        }

        //Clear server side session         
        TicTacToe.apiCall({ action:'clear' },
            function(data) {
                TicTacToe.bindings.loading(false);
            });

    };


})(window, document,jQuery,ko);
