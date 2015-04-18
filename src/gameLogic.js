angular.module('myApp',[]).factory('gameLogic', function () {

    'use strict';

    var maxRow = 7;
    var maxCol = 7;

    function isEqual(object1, object2) {
        return angular.equals(object1, object2);
    }

    function copyObject(object) {
        return angular.copy(object);
    }

    function isEmptySquare(coordinates) {
        if (coordinates.board [coordinates.row][coordinates.col] === '') {
            return true;
        }
        return false;
    }

    function desiredAdjPiece(board, row, col, directions, colourOpponentPiece) {

        if (row > 0) {
            if (board [row - 1][col] === colourOpponentPiece) {
                directions.push('V1');
            }
        }

        if (row < 7) {
            if (board [row + 1][col] === colourOpponentPiece) {
                directions.push('V2');
            }
        }

        if (col > 0) {
            if (board [row][col - 1] === colourOpponentPiece) {
                directions.push('H1');
            }
        }

        if (col < 7) {
            if (board [row][col + 1] === colourOpponentPiece) {
                directions.push('H2');
            }
        }

        if ((row > 0) && (col > 0)) {
            if (board [row - 1][col - 1] === colourOpponentPiece) {
                directions.push('D1');
            }
        }

        if ((row > 0) && (col < 7)) {
            if (board [row - 1][col + 1] === colourOpponentPiece) {
                directions.push('D2');
            }
        }

        if ((row < 7) && (col < 7)) {
            if (board [row + 1][col + 1] === colourOpponentPiece) {
                directions.push('D3');
            }
        }

        if ((row < 7) && (col > 0)) {
            if (board [row + 1][col - 1] === colourOpponentPiece) {
                directions.push('D4');
            }
        }

        if (directions.length) {
            return true;
        }
        return false;
    }

    function sandwich(board, row, col, directions, colourPlayerPiece, colourOpponentPiece) {
        var ct = 0;
        var tempBoard = copyObject(board);
        for (var i = 0; i < directions.length; i++) {
            switch (directions [i]) {
                case 'V1':
                    var loc = -1;
                    var flag = 1;

                    for (var k = row - 1; k >= 0; k--) {
                        if (board [k][col] === colourPlayerPiece) {
                            loc = k;
                            break;
                        }
                    }

                    if (loc === -1) {
                        break;
                    }

                    for (var k = row - 1; k > loc; k--) {
                        if (board [k][col] !== colourOpponentPiece) {
                            flag = 0;
                            break;
                        }
                    }
                    if (flag) {
                        for (var k = row - 1; k > loc; k--) {
                            tempBoard [k][col] = colourPlayerPiece;
                        }
                        tempBoard [row][col] = colourPlayerPiece;
                        ct++;
                    }

                    break;

                case 'V2':
                    var loc = -1;
                    var flag = 1;

                    for (var k = row + 1; k <= maxRow; k++) {
                        if (board [k][col] === colourPlayerPiece) {
                            loc = k;
                            break;
                        }
                    }

                    if (loc === -1) {
                        break;
                    }

                    for (var k = row + 1; k < loc; k++) {
                        if (board [k][col] !== colourOpponentPiece) {
                            flag = 0;
                            break;
                        }
                    }
                    if (flag) {
                        for (var k = row + 1; k < loc; k++) {
                            tempBoard [k][col] = colourPlayerPiece;
                        }
                        tempBoard [row][col] = colourPlayerPiece;
                        ct++;
                    }

                    break;

                case 'H1':
                    var loc = -1;
                    var flag = 1;

                    for (var k = col - 1; k >= 0; k--) {
                        if (board [row][k] === colourPlayerPiece) {
                            loc = k;
                            break;
                        }
                    }

                    if (loc === -1) {
                        break;
                    }

                    for (var k = col - 1; k > loc; k--) {
                        if (board [row][k] !== colourOpponentPiece) {
                            flag = 0;
                            break;
                        }
                    }
                    if (flag) {
                        for (var k = col - 1; k > loc; k--) {
                            tempBoard [row][k] = colourPlayerPiece;
                        }
                        tempBoard [row][col] = colourPlayerPiece;
                        ct++;
                    }

                    break;

                case 'H2':
                    var loc = -1;
                    var flag = 1;

                    for (var k = col + 1; k <= maxCol; k++) {
                        if (board [row][k] === colourPlayerPiece) {
                            loc = k;
                            break;
                        }
                    }
                    if (loc === -1) {
                        break;
                    }
                    for (var k = col + 1; k < loc; k++) {
                        if (board [row][k] !== colourOpponentPiece) {
                            flag = 0;
                            break;
                        }
                    }
                    if (flag) {
                        for (var k = col + 1; k < loc; k++) {
                            tempBoard[row][k] = colourPlayerPiece;
                        }
                        tempBoard [row][col] = colourPlayerPiece;
                        ct++;
                    }
                    break;

                case 'D1':
                    var locRow = -1;
                    var locCol = -1;
                    var flag = 1;

                    for (var k = row - 1, l = col - 1; (k >= 0 && l >= 0); k--, l--) {
                        if (board [k][l] === colourPlayerPiece) {
                            locRow = k;
                            locCol = l;
                            break;
                        }
                    }

                    if (locRow === -1) {
                        break;
                    }

                    for (var k = row - 1, l = col - 1; (k > locRow) && (l > locCol); k--, l--) {
                        if (board [k][l] !== colourOpponentPiece) {
                            flag = 0;
                            break;
                        }
                    }
                    if (flag) {
                        for (var k = row - 1, l = col - 1; (k > locRow) && (l > locCol); k--, l--) {
                            tempBoard [k][l] = colourPlayerPiece;
                        }
                        tempBoard [row][col] = colourPlayerPiece;
                        ct++;
                    }
                    break;

                case 'D2':
                    var locRow = -1;
                    var locCol = -1;
                    var flag = 1;

                    for (var k = row - 1, l = col + 1; (k >= 0 && l <= maxCol); k--, l++) {
                        if (board [k][l] === colourPlayerPiece) {
                            locRow = k;
                            locCol = l;
                            break;
                        }
                    }

                    if (locRow === -1) {
                        break;
                    }

                    for (var k = row - 1, l = col + 1; (k > locRow) && (l < locCol); k--, l++) {
                        if (board [k][l] !== colourOpponentPiece) {
                            flag = 0;
                            break;
                        }
                    }
                    if (flag) {
                        for (var k = row - 1, l = col + 1; (k > locRow) && (l < locCol); k--, l++) {
                            tempBoard [k][l] = colourPlayerPiece;
                        }
                        tempBoard [row][col] = colourPlayerPiece;
                        ct++;
                    }

                    break;

                case 'D3':
                    var locRow = -1;
                    var locCol = -1;
                    var flag = 1;

                    for (var k = row + 1, l = col + 1; (k <= maxRow && l <= maxCol); k++, l++) {
                        if (board [k][l] === colourPlayerPiece) {
                            locRow = k;
                            locCol = l;
                            break;
                        }
                    }

                    if (locRow === -1) {
                        break;
                    }

                    for (var k = row + 1, l = col + 1; (k < locRow) && (l < locCol); k++, l++) {
                        if (board [k][l] !== colourOpponentPiece) {
                            flag = 0;
                            break;
                        }
                    }
                    if (flag) {
                        for (var k = row + 1, l = col + 1; (k < locRow) && (l < locCol); k++, l++) {
                            tempBoard [k][l] = colourPlayerPiece;
                        }
                        tempBoard [row][col] = colourPlayerPiece;
                        ct++;
                    }

                    break;

                case 'D4':
                    var locRow = -1;
                    var locCol = -1;
                    var flag = 1;

                    for (var k = row + 1, l = col - 1; (k <= maxRow && l >= 0); k++, l--) {
                        if (board [k][l] === colourPlayerPiece) {
                            locRow = k;
                            locCol = l;
                            break;
                        }
                    }

                    if (locRow === -1) {
                        break;
                    }
                    for (var k = row + 1, l = col - 1; (k < locRow) && (l > locCol); k++, l--) {
                        if (board [k][l] !== colourOpponentPiece) {
                            flag = 0;
                            break;
                        }
                    }
                    if (flag) {
                        for (var k = row + 1, l = col - 1; (k < locRow) && (l > locCol); k++, l--) {
                            tempBoard [k][l] = colourPlayerPiece;
                        }
                        tempBoard [row][col] = colourPlayerPiece;
                        ct++;
                    }

                    break;
            }
        }

        if (ct) {
            return {count: ct, tempBoard: tempBoard, status: true};
        }

        return {count: ct, status: false};
    }

    function createMove(board, row, col, turnIndexBeforeMove) {
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
        if (!isEmptySquare({board: board, row: row, col: col})) {
            throw new Error("One can only make a move in an empty position!");
            ;
        }
        var colourOpponentPiece = (turnIndexBeforeMove === 0 ? 'W' : 'B');
        var directions = [];
        if (!desiredAdjPiece(board, row, col, directions, colourOpponentPiece)) {
            throw new Error("One can only make a move next to the opponent's piece!");
        }
        var colourPlayerPiece = (turnIndexBeforeMove === 0 ? 'B' : 'W');
        var result = sandwich(board, row, col, directions, colourPlayerPiece, colourOpponentPiece);
        if (!result.status) {
            throw new Error("One must sandwich opponent's pieces on every move!");
        }

        var firstOperation;
        var boardAfterMove = copyObject(board);
        boardAfterMove [row][col] = (turnIndexBeforeMove === 0 ? 'B' : 'W');
        var end = gameOver(result.tempBoard);
        if (end.status) {
            firstOperation = {
                endMatch: {
                    endMatchScores: (end.winner === 'B' ? [1, 0]
                        : (end.winner === 'W' ? [0, 1] : [0, 0]))
                }
            };
        }
        else {
            var toBeOpponent = turnIndexBeforeMove == 0 ? 'W' : 'B';
            var currentPlayer = turnIndexBeforeMove == 0 ? 'B' : 'W';
            var turn = hasValidMoves(toBeOpponent, currentPlayer, result.tempBoard);
            if (turn) {
                firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
            }
            else {
                firstOperation = {setTurn: {turnIndex: turnIndexBeforeMove}};
            }
        }
        return [firstOperation,
            {set: {key: 'board', value: result.tempBoard}},
            {set: {key: 'delta', value: {row: row, col: col}}}];
    }

    function hasValidMoves(colourPlayerPiece, colourOpponentPiece, board) {
        var flag = 0;
        for (var i = 0; i <= maxRow; i++) {
            for (var j = 0; j <= maxCol; j++) {
                if (!isEmptySquare({board: board, row: i, col: j})) {
                    continue;
                }
                var directions = [];
                if (!desiredAdjPiece(board, i, j, directions, colourOpponentPiece)) {
                    continue;
                }
                var result = sandwich(board, i, j, directions, colourPlayerPiece, colourOpponentPiece);
                if (!result.status) {
                    continue;
                }
                if (result.count) {
                    flag = 1;
                    break;
                }
            }

            if (flag) {
                break;
            }
        }
        if (flag) {
            return true;
        }
        return false;
    }

    function gameOver(board) {
        var emptyCells = 0;
        var result;
        for (var i = 0; i <= maxRow; i++) {
            for (var j = 0; j <= maxCol; j++) {
                if (board [i][j] === '') {
                    emptyCells++;
                }
            }
        }
        if (!emptyCells) {
            result = getWinner(board);
            return {winner: result, status: true};
        }

        else if ((!hasValidMoves('W', 'B', board)) && (!hasValidMoves('B', 'W', board))) {
            result = getWinner(board);
            return {winner: result, status: true};
        }
        return {status: false};
    }

    function getWinner(board) {
        var wCount = 0;
        var bCount = 0;
        for (var i = 0; i <= maxRow; i++) {
            for (var j = 0; j <= maxCol; j++) {
                if (board[i][j] === 'W') {
                    wCount++;
                }
                else if (board[i][j] === 'B') {
                    bCount++;
                }
            }
        }
        if (wCount > bCount) {
            return 'W';
        }
        else if (bCount > wCount) {
            return 'B';
        }
        return 'T';
    }

    function isMoveOk(params) {
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;
        var board = stateBeforeMove.board;
        var move = params.move;

        try {
            var row = move[2].set.value.row;
            var col = move[2].set.value.col;
            var expectedMove = createMove(board, row, col, turnIndexBeforeMove);

            if (!isEqual(move, expectedMove)) {
                return false;
            }
        } catch (e) {
            return false;
        }
        return true;
    }

    function exampleMoves(initTurnIndex, initState, arrayOfRowColComment) {
        var state = initState;
        var temp;
        var store = [];
        var turnIndex = initTurnIndex;

        for (var i = 0; i < arrayOfRowColComment.length; i++) {
            var rowColComment = arrayOfRowColComment[i];

            temp = createMove(state.board, rowColComment.row,
                rowColComment.col, turnIndex);

            var stateAfterMove = {board: temp[1].set.value, delta: temp[2].set.value};
            store.push({
                stateBeforeMove: state,
                stateAfterMove: stateAfterMove,
                turnIndexBeforeMove: turnIndex,
                turnIndexAfterMove: temp[0].setTurn.turnIndex,
                comment: {en: rowColComment.comment},
                move: temp
            });
            turnIndex = temp[0].setTurn.turnIndex;
            state = stateAfterMove;
        }
        return store;
    }


    function exampleGame() {
        return (exampleMoves(0,
            {
                board: [['', '', 'B', 'W', 'W', 'W', '', ''],
                    ['', '', 'B', 'B', 'W', 'W', '', ''],
                    ['W', 'W', 'B', 'W', 'W', 'W', 'B', 'B'],
                    ['W', 'B', 'W', 'W', 'B', 'W', 'B', 'B'],
                    ['W', 'W', 'B', 'W', 'B', 'B', 'B', 'B'],
                    ['W', 'W', 'W', 'B', 'W', 'B', 'W', 'W'],
                    ['', '', 'W', 'W', 'B', 'B', '', ''],
                    ['', '', 'W', 'B', 'B', 'B', '', '']],
                delta: {row: 2, col: 0}
            },
            [{row: 0, col: 6, comment: "Black plays on square (0,6)"}
                ,
                {row: 0, col: 1, comment: "White plays on square (0,1)"}
                ,
                {row: 7, col: 1, comment: "Black plays row 7, col 1"},
                {row: 6, col: 6, comment: "Uh oh, white plays in x-Square"},
                {row: 7, col: 7, comment: "Black captures bottom-left corner!"},
                {row: 6, col: 7, comment: "White plays (6,7)"}
            ]));
    }

    function riddles() {
        return ([
            exampleMoves(1,
                {
                    board: [['', '', 'B', 'W', 'W', 'W', 'B', ''],
                        ['', 'B', 'B', 'B', 'W', 'W', 'W', ''],
                        ['W', 'W', 'B', 'W', 'W', 'W', 'B', 'B'],
                        ['W', 'B', 'W', 'W', 'B', 'W', 'B', 'B'],
                        ['W', 'W', 'B', 'W', 'B', 'B', 'B', 'B'],
                        ['W', 'W', 'W', 'B', 'W', 'B', 'W', 'W'],
                        ['', '', 'W', 'W', 'B', 'B', '', ''],
                        ['', '', 'W', 'B', 'B', 'B', '', '']],
                    delta: {row: 2, col: 0}
                },
                [{row: 0, col: 0, comment: "Where should White play to get an advantage on his next turn?"},
                    {row: 6, col: 6, comment: "Black plays row 6, col 6"},
                    {row: 7, col: 7, comment: "White captures diagonal!"}]),
            exampleMoves(0,
                {
                    board: [['', 'B', 'B', 'B', 'B', 'B', 'B', ''],
                        ['', '', 'B', 'B', 'W', 'W', '', ''],
                        ['W', 'W', 'B', 'W', 'W', 'W', 'B', 'B'],
                        ['W', 'B', 'W', 'W', 'B', 'W', 'B', 'B'],
                        ['W', 'W', 'B', 'W', 'B', 'B', 'B', 'B'],
                        ['W', 'W', 'W', 'B', 'W', 'B', 'W', 'W'],
                        ['', '', 'W', 'W', 'B', 'B', '', ''],
                        ['', '', 'B', 'B', 'B', 'B', 'B', '']],
                    delta: {row: 3, col: 0}
                },
                [{row: 7, col: 1, comment: "Where should Black play to not give White an advantage on his next turn?"},
                    {row: 1, col: 7, comment: "White in (1,7)"}])
        ]
        );
    }

    function createComputerMove(board, turnIndexBeforeMove) {
        var possibleMoves = [];
        var i, j;
        for (i = 0; i < 8; i++) {
            for (j = 0; j < 8; j++) {
                try {
                    possibleMoves.push(createMove(board, i, j, turnIndexBeforeMove));
                } catch (e) {
                    //invalid move, don't add it to the array.
                }
            }
        }
        var randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return randomMove;
    }

    return {
        createMove: createMove,
        isMoveOk: isMoveOk,
        exampleGame: exampleGame,
        riddles: riddles,
        createComputerMove: createComputerMove
    };
});
