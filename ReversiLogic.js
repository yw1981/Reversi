/*jslint devel: true, indent: 1 */
/*global console*/
var isMoveOk = (function () {
  'use strict';

  var maxRow = 7;
  var maxCol = 7;
  
  function isEqual(object1, object2) {
	    if (object1 === object2) {
	      return true;
	    }
	    if (typeof object1 != 'object' && typeof object2 != 'object') {
	      return object1 == object2;
	    }
	    try {
	      var keys1 = Object.keys(object1);
	      var keys2 = Object.keys(object2);
	      var i, key;

	      if (keys1.length != keys2.length) {
	        return false;
	      }
	      keys1.sort();
	      keys2.sort();
	      for (i = keys1.length - 1; i >= 0; i--) {
	        if (keys1[i] != keys2[i])
	          return false;
	      }
	      for (i = keys1.length - 1; i >= 0; i--) {
	        key = keys1[i];
	        if (!isEqual(object1[key], object2[key])) {
	          return false;
	        }
	      }
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }
  
  function copyObject(object) {
   return JSON.parse(JSON.stringify(object));
  }
   
  function isEmptySquare(coordinates) {
	   if (coordinates.board [coordinates.row][coordinates.col] === '') {
		   return true;
	   }
	   return false;
  }
  
  function desiredAdjPiece(board, row, col, directions, colourOpponentPiece){
	
	  if (row > 0) {
		  if (board [row - 1][col] === colourOpponentPiece)
		  {
			  directions.push('V1');
		  }
	  }
	  
	  if (row < 7) {
	   if (board [row + 1][col] === colourOpponentPiece)
	   {
		   directions.push('V2');
	   }
	 }
	  
	  if (col > 0) {
	   if (board [row][col - 1] === colourOpponentPiece)
	   {
		   directions.push('H1');
	   }
	 }
	  
	  if (col < 7) {
	   if (board [row][col + 1] === colourOpponentPiece)
	   {
		   directions.push('H2');
	   }
	 }
	  
	  if ((row > 0) && (col > 0)) {
	   if (board [row - 1][col - 1] === colourOpponentPiece)
	   {
		   directions.push('D1');
	   }
	 }
	  
	  if ((row > 0) && (col < 7)) {
	   if (board [row - 1][col + 1] === colourOpponentPiece)
	   {
		   directions.push('D2');
	   }
	 }
	   
	  if ((row < 7) && (col < 7)) {
	   if (board [row + 1][col + 1] === colourOpponentPiece)
	   {
		   directions.push('D3');
	   }
	 }
	   
	  if ((row < 7) && (col > 0)) {
	   if (board [row + 1][col - 1] === colourOpponentPiece)
	   {
		   directions.push('D4');
	   }
	 }
	  
	   if (directions.length)
	   {
		   return true;
	   }
	   return false;
  }
  
  function sandwich(board, row, col, directions, colourPlayerPiece, colourOpponentPiece) {
	   var ct = 0;
	   var tempBoard = copyObject(board);
	   for (var i = 0; i < directions.length; i ++) {
		   	 switch (directions [i]) {
		   	 case 'V1':
		   	  var loc = -1;
		   	  var flag = 1;
		   	  
		   	  for (var k = row - 1; k >= 0; k --) {
		   	  	    if(board [k][col] === colourPlayerPiece) {
		   	  	    	loc = k;
		   	  	     	break;
		   	  	     }
		   	   }
		   	  
		   	  if (loc === -1) {
		   		  	break; 
		   		  }
		   	  
		   	  for (var k = row - 1; k > loc; k --) {
		   		 if(board [k][col] !== colourOpponentPiece) {
		   			 	flag = 0;
		   			 	break;
		   			 }
		   	   }
		   	  if (flag) {
		   		  for (var k = row - 1; k > loc; k --) {
		   			tempBoard [k][col] = colourPlayerPiece;
		   		  }
		   		  tempBoard [row][col] = colourPlayerPiece;
		   		  ct ++;
		   	   }
		   	  
		   	  break;
		   	 
		   	 case 'V2':
			   	  var loc = -1; 
			   	  var flag = 1;
			   	  
			   	  for(var k = row + 1; k <= maxRow; k ++) {
			   	  	    if(board [k][col] === colourPlayerPiece) {
			   	  	    	loc = k;
			   	  	     	break;
			   	  	     }
			   	   }
			   	  
			   	  if(loc === -1) {
		   		  	break;
		   		  }
			   	  			   	  
			   	  for (var k = row + 1; k < loc; k ++) {
			   		 if(board [k][col] !== colourOpponentPiece) {
			   			 	flag = 0;
			   			 	break;
			   			 }
			   	   }
			   	  if (flag) {
			   		  for (var k = row + 1; k < loc; k ++) {
			   			tempBoard [k][col] = colourPlayerPiece;
			   		  }
			   		  tempBoard [row][col] = colourPlayerPiece;
			   		  ct ++;
			   	   }
			   	  
			   	  break;
			   	  
		   	 case 'H1':
		   		  var loc = -1;
			   	  var flag = 1;
			   	  
			   	  for(var k = col - 1; k >= 0; k --) {
			   	  	    if(board [row][k] === colourPlayerPiece) {
			   	  	    	loc = k;
			   	  	     	break;
			   	  	     }
			   	   }
			   	  
			   	  if(loc === -1) {
			   		  	break; 
			   		  }
			   	  
			   	  for (var k = col - 1; k > loc; k --) {
			   		 if(board [row][k] !== colourOpponentPiece) {
			   			 	flag = 0;
			   			 	break;
			   			 }
			   	   }
			   	  if (flag) {
			   		  for (var k = col - 1; k > loc; k --) {
				   		tempBoard [row][k] = colourPlayerPiece;
				   	  }
			   		  tempBoard [row][col] = colourPlayerPiece;
			   		  ct ++;
			   	   }
			   	  
			   	  break;
			   	  
		   	 case 'H2':
		   		   	  var loc = -1; 
				   	  var flag = 1;
				   	  
				   	  for(var k = col + 1; k <= maxCol; k ++) {
				   	  	    if(board [row][k] === colourPlayerPiece) {
				   	  	    	loc = k;
				   	  	     	break;
				   	  	     }
				   	   }
				   	  if(loc === -1) {
			   		  	break; 
			   		  }
				   	  for (var k = col + 1; k < loc; k ++) {
				   		 if(board [row][k] !== colourOpponentPiece) {
				   			 	flag = 0;
				   			 	break;
				   			 }
				   	   }
				   	  if (flag) {
				   		  for (var k = col + 1; k < loc; k ++) {
				   			tempBoard[row][k] = colourPlayerPiece;
				   		  }
				   		  tempBoard [row][col] = colourPlayerPiece;
				   		  ct ++;
				   	   }
				   	  break;
				   	  
		   	 case 'D1':
			   	  var locRow = -1;
			   	  var locCol = -1;
			   	  var flag = 1;
			   	  
			   	  for(var k = row - 1, l = col - 1; (k >= 0 && l >= 0); k --, l --) {
			   	  	    if(board [k][l] === colourPlayerPiece) {
			   	  	    	locRow = k;
			   	  	    	locCol = l;
			   	  	     	break;
			   	  	     }
			   	   }
			   	  
			   	  if(locRow === -1) {
		   		  	break;
		   		  }
			   	  
			   	  for (var k = row - 1, l = col - 1; (k > locRow) && (l > locCol); k --, l --) {
			   		 if(board [k][l] !== colourOpponentPiece) {
			   			 	flag = 0;
			   			 	break;
			   			 }
			   	   }
			   	  if (flag) {
			   		  for (var k = row - 1, l = col - 1; (k > locRow) && (l > locCol); k --, l --) {
			   			  tempBoard [k][l] = colourPlayerPiece;
			   		  }
			   		  tempBoard [row][col] = colourPlayerPiece;
			   		  ct ++;
			   	   }			   	  
			   	  break;
			   	  
		   	 case 'D2':
			   	  var locRow = -1;
			   	  var locCol = -1;
			   	  var flag = 1;
			   	  
			   	  for(var k = row - 1, l = col + 1; (k >= 0 && l <= maxCol); k --, l ++) {
			   	  	    if(board [k][l] === colourPlayerPiece) {
			   	  	    	locRow = k;
			   	  	    	locCol = l;
			   	  	     	break;
			   	  	     }
			   	   }
			   	  
			   	  if(locRow === -1) {
		   		  	break;
			   	  }
			   	  
			   	  for (var k = row - 1, l = col + 1; (k > locRow) && (l < locCol); k --, l ++) {
			   		 if(board [k][l] !== colourOpponentPiece) {
			   			 	flag = 0;
			   			 	break;
			   			 }
			   	   }
			   	  if (flag) {
			   		  for (var k = row - 1, l = col + 1; (k > locRow) && (l < locCol); k --, l ++) {
		   			  	tempBoard [k][l] = colourPlayerPiece;
		   			  }
			   		  tempBoard [row][col] = colourPlayerPiece;
			   		  ct ++;
			   	   }
			   	  
			   	  break;
			   	  
		   	 case 'D3':
			   	  var locRow = -1;
			   	  var locCol = -1;
			   	  var flag = 1;
			   	  
			   	  for(var k = row + 1, l = col + 1; (k <= maxRow && l <= maxCol); k ++, l ++) {
			   	  	    if(board [k][l] === colourPlayerPiece) {
			   	  	    	locRow = k;
			   	  	    	locCol = l;
			   	  	     	break;
			   	  	     }
			   	   }
			   	  
			   	  if(locRow === -1) {
		   		  	break;
		   		  }
			   	 
			   	  for (var k = row + 1, l = col + 1; (k < locRow) && (l < locCol); k ++, l ++) {
			   		 if(board [k][l] !== colourOpponentPiece) {
			   			 	flag = 0;
			   			 	break;
			   			 }
			   	   }
			   	  if (flag) {
			   		  for (var k = row + 1, l = col + 1; (k < locRow) && (l < locCol); k ++, l ++) {
			   		 	tempBoard [k][l] = colourPlayerPiece;
			   		  }
			   		  tempBoard [row][col] = colourPlayerPiece;
			   		  ct ++;
			   	   }
			   	  
			   	  break;
			   	  
		   	 case 'D4':
			   	  var locRow = -1;
			   	  var locCol = -1;
			   	  var flag = 1;
			   	  
			   	  for(var k = row + 1, l = col - 1; (k <= maxRow && l >= 0); k ++, l --) {
			   	  	    if(board [k][l] === colourPlayerPiece) {
			   	  	    	locRow = k;
			   	  	    	locCol = l;
			   	  	     	break;
			   	  	     }
			   	   }
			   	  
			   	  if(locRow === -1)  {
		   		  	break; 
		   		  }
			   	  for (var k = row + 1, l = col - 1; (k < locRow) && (l > locCol); k ++, l --) {
			   		 if(board [k][l] !== colourOpponentPiece) {
			   			 	flag = 0;
			   			 	break;
			   			 }
			   	   }
			   	  if (flag) {
				   	  for (var k = row + 1, l = col - 1; (k < locRow) && (l > locCol); k ++, l --) {
				   		 tempBoard [k][l] = colourPlayerPiece;
				   	  }
			   		   tempBoard [row][col] = colourPlayerPiece;
			   		   ct ++;
			   	   }
			   	  
			   	  break;
		   	 }
		   }
	   
	   if (ct)  {
		 	return {count: ct, tempBoard: tempBoard, status: true};
		}
	   
	   return {count: ct, status: false}; 
}
  
  function createMove(board, row, col, turnIndexBeforeMove, move)
  {
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
			    throw new Error("One can only make a move in an empty position!");;
			   }
		   var colourOpponentPiece = (turnIndexBeforeMove === 0 ?'W':'B');
		   var directions = [];	   
		   if (!desiredAdjPiece(board, row, col, directions, colourOpponentPiece)) {
			    throw new Error("One can only make a move next to the opponent's piece!");
			   }
		   var colourPlayerPiece = (turnIndexBeforeMove === 0 ? 'B':'W');
		   var result = sandwich(board, row, col, directions, colourPlayerPiece, colourOpponentPiece);
		   if (!result.status) {
			    throw new Error("One must sandwich opponent's pieces on every move!");
			   }
		   
		   var firstOperation;
		   var boardAfterMove = copyObject(board);
		   boardAfterMove [row][col] = (turnIndexBeforeMove === 0 ? 'B':'W');
		   var end = gameOver(result.tempBoard);
		   if (end.status) {
			    firstOperation = {endMatch: {endMatchScores: (end.winner === 'B' ? [1,0]
			    : (end.winner === 'W' ? [0,1] : [0,0]))}};
			   }
		   else  {
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
		   return {move: [firstOperation,
		                  {set: {key: 'board', value: boardAfterMove}},
		                  {set: {key: 'delta', value: {row: row, col: col}}}],
		           boardAfterSandwich: result.tempBoard};
  }
  
  function hasValidMoves(colourPlayerPiece, colourOpponentPiece, board){
	  var flag = 0;
	  for (var i = 0; i <= maxRow; i ++) {
		  for (var j = 0; j <= maxCol; j ++) {
			  if (!isEmptySquare({board: board, row: i, col: j})) {
				continue;
			  }
			  var directions = [];
			  if(!desiredAdjPiece(board, i, j, directions, colourOpponentPiece)) {
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
	  for (var i = 0; i <= maxRow; i ++) {
		   for (var j = 0; j <= maxCol; j ++) {
			   if (board [i][j] === '') {
				    emptyCells ++;
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
	  for (var i = 0; i <= maxRow; i ++) {
	   for (var j = 0; j <= maxCol; j ++) {
		   if (board[i][j] === 'W') {
			    wCount ++;
			   }
		   else if (board[i][j] === 'B') {
			    bCount ++;
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
	   var expectedMove = createMove(board, row, col, turnIndexBeforeMove, move);
	   if (!isEqual(move, expectedMove.move)) {
		     return false;
		   }
   } catch (e) {
	   return false;
   }
   return true;
  }
  
  console.log(isMoveOk({turnIndexBeforeMove: 0, stateBeforeMove: {},
	  		 move: [{setTurn: {turnIndex: 1}},
	         {set: {key: 'board', value: [['', '', '', '', '', '', '', ''],
	                        			 ['', '', '', '', '', '', '', ''],
	                        			 ['', '', '', '', '', '', '', ''],
	                        			 ['', '', 'B', 'W', 'B', '', '', ''],
	                        			 ['', '', '', 'B', 'W', '', '', ''],
	                        			 ['', '', '', '', '', '', '', ''],
	                        			 ['', '', '', '', '', '', '', ''],
	                        			 ['', '', '', '', '', '', '', '']
	                        			 ]}},
	         {set: {key: 'delta', value: {row: 3, col: 2}}}]}),
	         
	         isMoveOk({turnIndexBeforeMove: 1, stateBeforeMove: {board: [['', '', '', '', '', '', '', ''],
	                            	                        			 ['', '', '', '', '', '', '', ''],
	                            	                        			 ['', '', '', '', '', '', '', ''],
	                            	                        			 ['', '', 'B', 'B', 'B', '', '', ''],
	                            	                        			 ['', '', '', 'B', 'W', '', '', ''],
	                            	                        			 ['', '', '', '', '', '', '', ''],
	                            	                        			 ['', '', '', '', '', '', '', ''],
	                            	                        			 ['', '', '', '', '', '', '', '']
	                            	                        			 ],
	                            	                        			 delta: {row: 3, col: 2}},
	       	 move: [{setTurn: {turnIndex: 0}},
	       	 {set: {key: 'board', value: [['', '', '', '', '', '', '', ''],
	       	                        	  ['', '', '', '', '', '', '', ''],
	       	                        	  ['', '', 'W', '', '', '', '', ''],
	       	                        	  ['', '', 'B', 'B', 'B', '', '', ''],
	       	                        	  ['', '', '', 'B', 'W', '', '', ''],
	       	                        	  ['', '', '', '', '', '', '', ''],
	       	                        	  ['', '', '', '', '', '', '', ''],
	       	                        	  ['', '', '', '', '', '', '', '']
	       	                        	  ]}},
	       	         {set: {key: 'delta', value: {row: 2, col: 2}}}]})
  );   
	         
  return isMoveOk;
 })();
