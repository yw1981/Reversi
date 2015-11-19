module game{
    //'use strict';


    // function ($scope, $log, $timeout,
    //       gameLogic) {

    var draggingLines = document.getElementById("draggingLines");
    var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
    var verticalDraggingLine = document.getElementById("verticalDraggingLine");
    var clickToDragPiece = document.getElementById("clickToDragPiece");
    var gameArea = document.getElementById("gameArea");
    export var rowsNum = 8;
    export var colsNum = 8;

    var board: Board;
    var delta: BoardDelta;
    var turnIndex: number;
    var isYourTurn: boolean;

    /**
     * handle the Drag Event using DragAndDropListener
     * @param type
     * @param clientX
     * @param clientY
     */
    function handleDragEvent(type: string, clientX: number, clientY: number) {
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
        var col = Math.floor(colsNum * x / gameArea.clientWidth);
        var row = Math.floor(rowsNum * y / gameArea.clientHeight);

        // check if can place piece here
        // and decide whether to show the piece on drag or not
        if (isMoveLegal(row, col)){
            clickToDragPiece.style.display = "inline";
            draggingLines.style.display = "inline";
            horizontalDraggingLine.style.stroke = "green";
            verticalDraggingLine.style.stroke = "green";
        }
        else{
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
    }

    /**
     * get Square Width Height of board (square position)
     * @returns {{width: number, height: number}}
     */
    function getSquareWidthHeight() {
        return {
            width: gameArea.clientWidth / colsNum,
            height: gameArea.clientHeight / rowsNum
        };
    }

    /**
     * get Square Top Left position
     * @param row
     * @param col
     * @returns {{top: number, left: number}}
     */
    function getSquareTopLeft(row: number, col:number) {
        var size = getSquareWidthHeight();
        return {top: row * size.height, left: col * size.width}
    }

    /**
     * get Square Center X and Y
     * @param row
     * @param col
     * @returns {{x: number, y: number}}
     */
    function getSquareCenterXY(row: number, col: number): IXY {
        var size = getSquareWidthHeight();
        return {
            x: (col * size.width + size.width / 2).toString(),
            y: (row * size.height + size.height / 2).toString()
        };
    }

    /**
     * drag Done listener
     * @param row
     * @param col
     */
    function dragDone(row:number , col: number):void {

        if (isYourTurn) {
            return;
        }

        try {
            var move = gameLogic.createMove(board, row, col, turnIndex);
            isYourTurn = false; // to prevent making another move

            gameService.makeMove(move);
        } catch (e) {
            log.info(["wrong move", row, col]);
            return;
        }
    }

    function getIntegersTill(number: number): number[] {
        var res:number[] = [];
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
    function isMoveLegal(row: number, col: number): boolean {
        try {
            gameLogic.createMove(board, row, col, turnIndex);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * send the computer move
     */
    function sendComputerMove() {
        gameService.makeMove(
            gameLogic.createComputerMove(board, turnIndex));
    }

    /**
     * updateUI function
     * @param params
     */
    function updateUI(params: IUpdateUI): void {
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

        isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; //it's my turn
        turnIndex = params.turnIndexAfterMove;
        // Is it the computer's turn?
        if (isYourTurn
            && params.playersInfo[params.yourPlayerIndex].playerId === '') {
            isYourTurn = false;
            $timeout(sendComputerMove, 1000);
        }
    }

    export let getPreviewSrc = function () {
        return  turnIndex === 1 ? "res/pieceWhite.png" : "res/pieceBlack.png";
    };

    export let shouldSlowlyAppear = function (row:number, col: number ): boolean {
        return delta !== undefined
            && delta.row === row && delta.col === col;
    }

    export let isWhite = function (row: number, col: number): boolean {
        if (board[row][col] === 'W') {
            return true;
        }
        else {
            return false;
        }
    }

    export let isBlack = function (row: number, col: number): boolean {
        if (board[row][col] === 'B') {
            return true;
        }
        else {
            return false;
        }
    }

    export let oddSum = function (row: number, col: number): boolean {
        if ((row + col) % 2 !== 0) {
            return true;
        }
        else {
            return false;
        }
    }

    export let evenSum = function (row: number, col:number): boolean {
        if ((row + col) % 2 === 0) {
            return true;
        }
        else {
            return false;
        }
    }

    export let rows = getIntegersTill(rowsNum);
    export let cols = getIntegersTill(colsNum);

    export function init () {
      dragAndDropService.addDragListener("gameArea", handleDragEvent);

      //make game size scalable
      resizeGameAreaService.setWidthToHeight(1);


      //fake update UI for game initial
      updateUI(
        {stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2}
      );

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


}


angular.module('myApp').controller('Ctrl',
    ['$scope', '$log', '$timeout',
        'gameLogic', function () {
          $rootScope['game'] = game;
          // any translation?
          game.init();

    }]);


// angular.module('myApp', ['$scope', '$log', '$timeout', '$rootScope', 'gameLogic'] )
//   .run( function() {
//       $rootScope['game'] = game;
//       // any translation?
//       game.init();
// });
