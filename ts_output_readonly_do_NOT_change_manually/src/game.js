var game;
(function (game) {
    //'use strict';
    // function ($scope, $log, $timeout,
    //       gameLogic) {
    game.rowsNum = 8;
    game.colsNum = 8;
    var board;
    var delta;
    var turnIndex;
    var isYourTurn = false;
    /**
     * handle the Drag Event using DragAndDropListener
     * @param type
     * @param clientX
     * @param clientY
     */
    function handleDragEvent(type, clientX, clientY) {
        var draggingLines = document.getElementById("draggingLines");
        var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
        var verticalDraggingLine = document.getElementById("verticalDraggingLine");
        var clickToDragPiece = document.getElementById("clickToDragPiece");
        var gameArea = document.getElementById("gameArea");
        // Center point in gameArea
        var x = clientX - gameArea.offsetLeft;
        var y = clientY - gameArea.offsetTop;
        // Is outside gameArea?
        if (!isYourTurn || x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
            clickToDragPiece.style.display = "none";
            draggingLines.style.display = "none";
            return;
        }
        // Inside gameArea. Let's find the containing square's row and col
        var col = Math.floor(game.colsNum * x / gameArea.clientWidth);
        var row = Math.floor(game.rowsNum * y / gameArea.clientHeight);
        // check if can place piece here
        // and decide whether to show the piece on drag or not
        if (isMoveLegal(row, col)) {
            clickToDragPiece.style.display = "inline";
            draggingLines.style.display = "inline";
            horizontalDraggingLine.style.stroke = "green";
            verticalDraggingLine.style.stroke = "green";
        }
        else {
            clickToDragPiece.style.display = "none";
            draggingLines.style.display = "inline";
            horizontalDraggingLine.style.stroke = "red";
            verticalDraggingLine.style.stroke = "red";
        }
        var centerXY = getSquareCenterXY(row, col);
        verticalDraggingLine.setAttribute("x1", centerXY.x);
        verticalDraggingLine.setAttribute("x2", centerXY.x);
        horizontalDraggingLine.setAttribute("y1", centerXY.y);
        horizontalDraggingLine.setAttribute("y2", centerXY.y);
        var topLeft = getSquareTopLeft(row, col);
        clickToDragPiece.style.left = topLeft.left + "px";
        clickToDragPiece.style.top = topLeft.top + "px";
        if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
            // drag ended
            clickToDragPiece.style.display = "none";
            draggingLines.style.display = "none";
            dragDone(row, col);
        }
        /**
         * get Square Width Height of board (square position)
         * @returns {{width: number, height: number}}
         */
        function getSquareWidthHeight() {
            return {
                width: gameArea.clientWidth / game.colsNum,
                height: gameArea.clientHeight / game.rowsNum
            };
        }
        /**
         * get Square Top Left position
         * @param row
         * @param col
         * @returns {{top: number, left: number}}
         */
        function getSquareTopLeft(row, col) {
            var size = getSquareWidthHeight();
            return { top: row * size.height, left: col * size.width };
        }
        /**
         * get Square Center X and Y
         * @param row
         * @param col
         * @returns {{x: number, y: number}}
         */
        function getSquareCenterXY(row, col) {
            var size = getSquareWidthHeight();
            return {
                x: (col * size.width + size.width / 2).toString(),
                y: (row * size.height + size.height / 2).toString()
            };
        }
    }
    /**
     * drag Done listener
     * @param row
     * @param col
     */
    function dragDone(row, col) {
        if (!isYourTurn) {
            return;
        }
        try {
            var move = gameLogic.createMove(board, row, col, turnIndex);
            isYourTurn = false; // to prevent making another move
            gameService.makeMove(move);
        }
        catch (e) {
            log.info(["wrong move", row, col]);
            return;
        }
    }
    function getIntegersTill(number) {
        var res = [];
        for (var i = 0; i < number; i++) {
            res.push(i);
        }
        return res;
    }
    /**
     * check if can place piece at the position
     * @param row
     * @param col
     * @returns {boolean}
     */
    function isMoveLegal(row, col) {
        try {
            gameLogic.createMove(board, row, col, turnIndex);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    /**
     * send the computer move
     */
    function sendComputerMove() {
        gameService.makeMove(gameLogic.createComputerMove(board, turnIndex));
    }
    /**
     * updateUI function
     * @param params
     */
    function updateUI(params) {
        // check if commented: $rootScope.jsonState = angular.toJson(params.stateAfterMove, true);
        board = params.stateAfterMove.board;
        delta = params.stateAfterMove.delta;
        if (board === undefined) {
            board = [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', 'W', 'B', '', '', ''],
                ['', '', '', 'B', 'W', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ];
        }
        isYourTurn = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove; //it's my turn
        turnIndex = params.turnIndexAfterMove;
        // Is it the computer's turn?
        if (isYourTurn
            && params.playersInfo[params.yourPlayerIndex].playerId === '') {
            log.info("set isYourTurn to false in update UI");
            isYourTurn = false;
            $timeout(sendComputerMove, 1000);
        }
    }
    game.getPreviewSrc = function () {
        return turnIndex === 1 ? "res/pieceWhite.png" : "res/pieceBlack.png";
    };
    game.shouldSlowlyAppear = function (row, col) {
        return delta !== undefined
            && delta.row === row && delta.col === col;
    };
    game.isWhite = function (row, col) {
        if (board[row][col] === 'W') {
            return true;
        }
        else {
            return false;
        }
    };
    game.isBlack = function (row, col) {
        if (board[row][col] === 'B') {
            return true;
        }
        else {
            return false;
        }
    };
    game.oddSum = function (row, col) {
        if ((row + col) % 2 !== 0) {
            return true;
        }
        else {
            return false;
        }
    };
    game.evenSum = function (row, col) {
        if ((row + col) % 2 === 0) {
            return true;
        }
        else {
            return false;
        }
    };
    game.rows = getIntegersTill(game.rowsNum);
    game.cols = getIntegersTill(game.colsNum);
    function init() {
        dragAndDropService.addDragListener("gameArea", handleDragEvent);
        //make game size scalable
        resizeGameAreaService.setWidthToHeight(1);
        //fake update UI for game initial
        updateUI({ stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2 });
        gameService.setGame({
            gameDeveloperEmail: "yw1981@nyu.edu",
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            exampleGame: gameLogic.exampleGame(),
            riddles: gameLogic.riddles(),
            isMoveOk: gameLogic.isMoveOk,
            updateUI: updateUI
        });
    }
    game.init = init;
})(game || (game = {}));
//
// angular.module('myApp').controller('Ctrl',
//     ['$scope', '$log', '$timeout',
//         'gameLogic', function () {
//           $rootScope['game'] = game;
//           // any translation?
//           game.init();
//
//     }]);
angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
    .run(function () {
    $rootScope['game'] = game;
    translate.setLanguage('en', {
        "RULES_OF_REVERSI": "Rules of Reversi",
        "RULES_SLIDE1": "Game is on an 8×8 uncheckered board.There are sixty-four identical game pieces called disks,which are light on one side and dark on the other.",
        "RULES_SLIDE2": "During a play, any disks of the opponent's color that are in a straight line and bounded by the disk just placed and another disk of the current player's color are turned over to the current player's color.",
        "RULES_SLIDE3": "It's not legal to put a piece on a spot that would not result any piece color change.",
        "RULES_SLIDE4": "The object of the game is to have the majority of disks turned to display your color when the last playable empty square is filled. The player has more piece in the board win the game.",
        "CLOSE": "Close"
    });
    game.init();
});
// angular.module('myApp', ['$scope', '$log', '$timeout', '$rootScope', 'gameLogic'] )
//   .run( function() {
//       $rootScope['game'] = game;
//       // any translation?
//       game.init();
// });
