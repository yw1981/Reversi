'use strict';

angular.module('myApp',
    ['myApp.messageService', 'myApp.gameLogic', 'platformApp'])
  .controller('Ctrl', function (
      $window, $scope, $log,
      messageService, stateService, gameLogic) {

    var isLocalTesting = $window.parent === $window;

    function updateUI(params) {
      $scope.jsonState = angular.toJson(params.stateAfterMove, true);
      $scope.board = params.stateAfterMove.board;
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
    }

    function sendMakeMove(move) {
      $log.info(["Making move:", move]);
      if (isLocalTesting) {
        stateService.makeMove(move);
      } else {
        messageService.sendMessage({makeMove: move});
      }
    }

    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});
    var game = {
      gameDeveloperEmail: "purnima.p01@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      exampleGame: gameLogic.exampleGame(),
      riddles: gameLogic.riddles()
    };

    $scope.move = "[{setTurn: {turnIndex: 1}}, {set: {key: 'board', value: [['', '', '', '', '', '', '', ''],['', '', '', '', '', '', '', ''],['', '', '', '', '', '', '', ''],['', '', 'B', 'B', 'B', '', '', ''],['', '', '', 'B', 'W', '', '', ''],['', '', '', '', '', '', '', ''],['', '', '', '', '', '', '', ''],['', '', '', '', '', '', '', '']]}}, {set: {key: 'delta', value: {row: 3, col: 2}}}]";
    $scope.makeMove = function () {
      sendMakeMove(eval($scope.move));
    };

    $scope.cellClicked = function (row, col) {
      $log.info(["Clicked on cell:", row, col]);
      if (!$scope.isYourTurn) {
        return;
      }

    try {
        var move = gameLogic.createMove($scope.board, row, col, $scope.turnIndex);
        $scope.isYourTurn = false; // to prevent making another move
        sendMakeMove(move);
      } catch (e) {
        $log.info(["Cell is already full in position or you have to form a sandwich!", row, col]);
        return;
      }
    };

      if (isLocalTesting) {
      game.isMoveOk = gameLogic.isMoveOk;
      game.updateUI = updateUI;
      stateService.setGame(game);
    } else {
      messageService.addMessageListener(function (message) {
        if (message.isMoveOk !== undefined) {
          var isMoveOkResult = gameLogic.isMoveOk(message.isMoveOk);
          messageService.sendMessage({isMoveOkResult: isMoveOkResult});
        } else if (message.updateUI !== undefined) {
          updateUI(message.updateUI);
        }
      });
      messageService.sendMessage({gameReady : game});
    }
  });
