angular.module('myApp').controller('Ctrl',
    ['$scope', '$log', '$timeout', '$translate',
        'gameService', 'gameLogic',
        'resizeGameAreaService', 'dragAndDropService',
        function ($scope, $log, $timeout, $translate,
                  gameService, gameLogic,
                  resizeGameAreaService, dragAndDropService) {

            'use strict';

            var draggingLines = document.getElementById("draggingLines");
            var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
            var verticalDraggingLine = document.getElementById("verticalDraggingLine");
            var clickToDragPiece = document.getElementById("clickToDragPiece");
            var gameArea = document.getElementById("gameArea");
            var rowsNum = 8;
            var colsNum = 8;

            dragAndDropService.addDragListener("gameArea", handleDragEvent);

            console.log("Translation of 'RULES_OF_REVERSI' is " + $translate('RULES_OF_REVERSI'));

            //make game size scalable
            resizeGameAreaService.setWidthToHeight(1);

            /**
             * handle the Drag Event using DragAndDropListener
             * @param type
             * @param clientX
             * @param clientY
             */
            function handleDragEvent(type, clientX, clientY) {
                // Center point in gameArea
                var x = clientX - gameArea.offsetLeft;
                var y = clientY - gameArea.offsetTop;
                // Is outside gameArea?
                if (x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
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
            function getSquareTopLeft(row, col) {
                var size = getSquareWidthHeight();
                return {top: row * size.height, left: col * size.width}
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
                    x: col * size.width + size.width / 2,
                    y: row * size.height + size.height / 2
                };
            }

            /**
             * drag Done listener
             * @param row
             * @param col
             */
            function dragDone(row, col) {

                if (!$scope.isYourTurn) {
                    return;
                }

                try {
                    var move = gameLogic.createMove($scope.board, row, col, $scope.turnIndex);
                    $scope.isYourTurn = false; // to prevent making another move

                    gameService.makeMove(move);
                } catch (e) {
                    $log.info(["wrong move", row, col]);
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

            $scope.rows = getIntegersTill(rowsNum);
            $scope.cols = getIntegersTill(colsNum);
            $scope.rowsNum = rowsNum;
            $scope.colsNum = colsNum;

            /**
             * check if can place piece at the position
             * @param row
             * @param col
             * @returns {boolean}
             */
            function isMoveLegal(row, col) {
                try {
                    gameLogic.createMove($scope.board, row, col, $scope.turnIndex);
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
                    gameLogic.createComputerMove($scope.board, $scope.turnIndex));
            }

            /**
             * updateUI function
             * @param params
             */
            function updateUI(params) {
                // check if commented: $scope.jsonState = angular.toJson(params.stateAfterMove, true);
                $scope.board = params.stateAfterMove.board;
                $scope.delta = params.stateAfterMove.delta;
                if ($scope.board === undefined) {
                    $scope.board = [
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

                $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
                params.yourPlayerIndex === params.turnIndexAfterMove; //it's my turn
                $scope.turnIndex = params.turnIndexAfterMove;
                // Is it the computer's turn?
                if ($scope.isYourTurn
                    && params.playersInfo[params.yourPlayerIndex].playerId === '') {
                    $scope.isYourTurn = false;
                    $timeout(sendComputerMove, 1000);
                }
            }

            //fake update UI for game initial
            updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});

            $scope.getPreviewSrc = function () {
                return  $scope.turnIndex === 1 ? "res/pieceWhite.png" : "res/pieceBlack.png";
            };

            $scope.shouldSlowlyAppear = function (row, col) {
                return $scope.delta !== undefined
                    && $scope.delta.row === row && $scope.delta.col === col;
            }

            $scope.isWhite = function (row, col) {
                if ($scope.board[row][col] === 'W') {
                    return true;
                }
                else {
                    return false;
                }
            }

            $scope.isBlack = function (row, col) {
                if ($scope.board[row][col] === 'B') {
                    return true;
                }
                else {
                    return false;
                }
            }

            $scope.oddSum = function (row, col) {
                if ((row + col) % 2 !== 0) {
                    return true;
                }
                else {
                    return false;
                }
            }

            $scope.evenSum = function (row, col) {
                if ((row + col) % 2 === 0) {
                    return true;
                }
                else {
                    return false;
                }
            }

            gameService.setGame({
                gameDeveloperEmail: "xiaodongbo627@gmail.com",
                minNumberOfPlayers: 2,
                maxNumberOfPlayers: 2,
                exampleGame: gameLogic.exampleGame(),
                riddles: gameLogic.riddles(),
                isMoveOk: gameLogic.isMoveOk,
                updateUI: updateUI
            });

        }]);
