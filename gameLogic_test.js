describe("In Reversi ", function() {
	function validMove(turnIndexBeforeMove, stateBeforeMove, move) {

		expect(isMoveOk.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
			stateBeforeMove: stateBeforeMove, move: move})).toBe(true);
	}

	function invalidMove(turnIndexBeforeMove, stateBeforeMove, move) {
		expect(isMoveOk.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
			stateBeforeMove: stateBeforeMove, move: move})).toBe(false);
	}
	it("checks that placing B in (3,2) is valid", function() {
		validMove(0, {}, [{setTurn: {turnIndex: 1}},
	         {set: {key: 'board', value: [['', '', '', '', '', '', '', ''],
	                        			 ['', '', '', '', '', '', '', ''],
	                        			 ['', '', '', '', '', '', '', ''],
	                        			 ['', '', 'B', 'W', 'B', '', '', ''],
	                        			 ['', '', '', 'B', 'W', '', '', ''],
	                        			 ['', '', '', '', '', '', '', ''],
	                        			 ['', '', '', '', '', '', '', ''],
	                        			 ['', '', '', '', '', '', '', '']
	                        			 ]}},
	         {set: {key: 'delta', value: {row: 3, col: 2}}}]);
	});

	it("checks that placing W in (2,4) after B plays is valid", function() {
		validMove(1,
					 {board: [['', '', '', '', '', '', '', ''],
	                          ['', '', '', '', '', '', '', ''],
	                          ['', '', '', '', '', '', '', ''],
	                          ['', '', 'B', 'W', 'B', '', '', ''],
	                          ['', '', '', 'B', 'W', '', '', ''],
	                          ['', '', '', '', '', '', '', ''],
	                          ['', '', '', '', '', '', '', ''],
	                          ['', '', '', '', '', '', '', '']],
	                  delta: {row: 3, col: 2}},
	                  [{setTurn: {turnIndex: 0}},
	         		  {set: {key: 'board', value: [['', '', '', '', '', '', '', ''],
	                          					   ['', '', '', '', '', '', '', ''],
	                          					   ['', '', '', '', 'W', '', '', ''],
	                          					   ['', '', 'B', 'W', 'B', '', '', ''],
	                         				       ['', '', '', 'B', 'W', '', '', ''],
	                        					   ['', '', '', '', '', '', '', ''],
	                      					       ['', '', '', '', '', '', '', ''],
	                      						   ['', '', '', '', '', '', '', '']
	                      						   ]}},
	                   {set: {key: 'delta', value: {row: 2, col: 4}}}]);
	});

	it("checks that setting the turn back to the player (B) when opponent has no valid move is valid", function() {
		validMove(0,
					{board:  [['B', 'B', 'B', 'B', 'B', 'B', 'B', ''],
	                		  ['W', 'B', 'W', 'B', 'B', 'W', '', ''],
	                          ['W', 'B', 'B', 'B', 'B', 'W', 'W', ''],
	                          ['W', 'B', 'B', 'W', 'W', 'B', 'W', ''],
	                          ['W', 'B', 'W', 'W', 'W', 'W', 'W', 'W'],
	                          ['W', '', '', '', '', '', '', ''],
	                          ['', '', '', '', '', '', '', ''],
	                          ['', '', '', '', '', '', '', '']],
	                delta: {row: 5, col: 0}},
	                [{setTurn: {turnIndex: 0}},
	         		{set: {key: 'board', value: [['B', 'B', 'B', 'B', 'B', 'B', 'B', ''],
	                		        			 ['W', 'B', 'W', 'B', 'B', 'W', '', ''],
	                        					 ['W', 'B', 'B', 'B', 'B', 'W', 'W', ''],
	                        					 ['W', 'B', 'B', 'W', 'W', 'B', 'W', ''],
	                        			 		 ['W', 'B', 'W', 'W', 'W', 'W', 'W', 'W'],
	                        			 		 ['W', '', '', '', '', '', '', ''],
	                        					 ['B', '', '', '', '', '', '', ''],
	                        					 ['', '', '', '', '', '', '', '']
	                        					 ]}},
	        		{set: {key: 'delta', value: {row: 6, col: 0}}}]);
	});
	
	it("checks that the game ends when both players are out of valid moves", function() { //white plays disk in (3,7) as final move
		validMove(1,
					{board:  [['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
	                		  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
	                          ['W', 'W', 'W', 'W', 'W', 'W', 'W', ''],
	                          ['W', 'W', 'W', 'W', 'W', 'W', 'B', ''],
	                          ['W', 'W', 'W', 'W', 'W', 'W', '', ''],
	                          ['W', 'W', 'W', 'W', 'W', 'W', '', 'B'],
	                          ['W', 'W', 'W', 'W', 'W', 'W', 'W', ''],
	                          ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W']],
	                delta: {row: 0, col: 6}},
	                [{endMatch: {endMatchScores: [0,1]}},
	         		{set: {key: 'board', value: [['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
	                		 					 ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
	                         					 ['W', 'W', 'W', 'W', 'W', 'W', 'W', ''],
	                         					 ['W', 'W', 'W', 'W', 'W', 'W', 'B', 'W'],
	                         					 ['W', 'W', 'W', 'W', 'W', 'W', '', ''],
	                         					 ['W', 'W', 'W', 'W', 'W', 'W', '', 'B'],
	                         					 ['W', 'W', 'W', 'W', 'W', 'W', 'W', ''],
	                         					 ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W']
	                         					 ]}},
	                        					 {set: {key: 'delta', value: {row: 3, col: 7}}}]);
	});

	it("checks that setting the turn back to oneself when opponent has no valid move is valid", function() {
		validMove(0,
					{board:  [['B', 'B', 'B', 'B', 'B', 'B', 'B', ''],
	                		  ['W', 'B', 'W', 'B', 'B', 'W', '', ''],
	                          ['W', 'B', 'B', 'B', 'B', 'W', 'W', ''],
	                          ['W', 'B', 'B', 'W', 'W', 'B', 'W', ''],
	                          ['W', 'B', 'W', 'W', 'W', 'W', 'W', 'W'],
	                          ['W', '', '', '', '', '', '', ''],
	                          ['', '', '', '', '', '', '', ''],
	                          ['', '', '', '', '', '', '', '']],
	                delta: {row: 5, col: 0}},
	                [{setTurn: {turnIndex: 0}},  //set back to self as opponent has no move on his turn
	         		{set: {key: 'board', value: [['B', 'B', 'B', 'B', 'B', 'B', 'B', ''],
	                		        			 ['W', 'B', 'W', 'B', 'B', 'W', '', ''],
	                        					 ['W', 'B', 'B', 'B', 'B', 'W', 'W', ''],
	                        					 ['W', 'B', 'B', 'W', 'W', 'B', 'W', ''],
	                        			 		 ['W', 'B', 'W', 'W', 'W', 'W', 'W', 'W'],
	                        			 		 ['W', '', '', '', '', '', '', ''],
	                        					 ['B', '', '', '', '', '', '', ''],
	                        					 ['', '', '', '', '', '', '', '']
	                        					 ]}},
	        		{set: {key: 'delta', value: {row: 6, col: 0}}}]);
	});

	it("checks that the game ends when there are no more empty squares (white wins)", function() {
	validMove(1,
					{board:  [['W', 'B', 'B', 'B', 'B', 'B', 'B', ''],
	                		  ['W', 'W', 'W', 'W', 'W', 'B', 'B', 'W'],
	                          ['W', 'W', 'W', 'B', 'B', 'W', 'B', 'B'],
	                          ['W', 'B', 'B', 'B', 'W', 'W', 'B', 'B'],
	                          ['W', 'W', 'B', 'W', 'W', 'B', 'W', 'B'],
	                          ['W', 'B', 'W', 'B', 'B', 'B', 'B', 'B'],
	                          ['W', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	                          ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W']],
	                delta: {row: 0, col: 6}},
	                [{endMatch: {endMatchScores: [0,1]}},					//white wins
	         		{set: {key: 'board', value: [['W', 'B', 'B', 'B', 'B', 'B', 'B', 'W'],
	                							 ['W', 'W', 'W', 'W', 'W', 'B', 'B', 'W'],
	                         					 ['W', 'W', 'W', 'B', 'B', 'W', 'B', 'B'],
	                         					 ['W', 'B', 'B', 'B', 'W', 'W', 'B', 'B'],
	                         					 ['W', 'W', 'B', 'W', 'W', 'B', 'W', 'B'],
	                         					 ['W', 'B', 'W', 'B', 'B', 'B', 'B', 'B'],
	                         					 ['W', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	                         					 ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W']
	                          					 ]}},
	                        					 {set: {key: 'delta', value: {row: 0, col: 7}}}]);
	});
	
	it("checks that the game ends when there are no more empty squares (black wins)", function() {
	validMove(0,
					{board:  [['W', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	                		  ['W', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	                          ['W', 'W', 'B', 'B', 'B', 'B', 'B', 'B'],
	                          ['B', 'B', 'B', 'B', 'W', 'W', 'B', 'B'],
	                          ['B', 'W', 'B', 'B', 'W', 'B', 'W', 'B'],
	                          ['B', 'B', 'W', 'B', 'B', 'B', 'W', 'B'],
	                          ['B', 'B', 'B', 'B', 'B', 'B', 'W', 'B'],
	                          ['W', 'W', 'W', 'W', 'W', '', 'W', 'B']],
	                delta: {row: 7, col: 6}},
	                [{endMatch: {endMatchScores: [1,0]}},					//black wins
	         		{set: {key: 'board', value: [['W', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	                		  					 ['W', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	                        					 ['W', 'W', 'B', 'B', 'B', 'B', 'B', 'B'],
	                         					 ['B', 'B', 'B', 'B', 'W', 'W', 'B', 'B'],
	                         					 ['B', 'W', 'B', 'B', 'W', 'B', 'W', 'B'],
	                        					 ['B', 'B', 'W', 'B', 'B', 'B', 'W', 'B'],
	                         					 ['B', 'B', 'B', 'B', 'B', 'B', 'W', 'B'],
	                         					 ['W', 'W', 'W', 'W', 'W', 'B', 'W', 'B']
	                         					 ]}},
	                        					 {set: {key: 'delta', value: {row: 7, col: 5}}}]);
	});

	it("checks that placing a disk in a non-empty square (3,3) is invalid", function() {
		invalidMove(0, {}, [{setTurn: {turnIndex: 1}},
	         {set: {key: 'board', value: [['', '', '', '', '', '', '', ''],
	                        			 ['', '', '', '', '', '', '', ''],
	                        			 ['', '', '', '', '', '', '', ''],
	                        			 ['', '', '', 'B', 'B', '', '', ''],
	                        			 ['', '', '', 'B', 'W', '', '', ''],
	                        			 ['', '', '', '', '', '', '', ''],
	                        			 ['', '', '', '', '', '', '', ''],
	                        			 ['', '', '', '', '', '', '', '']
	                        			 ]}},
	         {set: {key: 'delta', value: {row: 3, col: 3}}}]);
	});

	it("checks that placing a disk in a cell not adjacent to one with the opponent's disk is invalid", function() {
		invalidMove(1,
					{board:  [['', '', '', '', '', '', '', ''],
	                ['', '', '', '', '', '', '', ''],
	                ['', '', '', '', '', '', '', ''],
	                ['', '', 'B', 'B', 'B', '', '', ''],
	                ['', '', '', 'B', 'W', '', '', ''],
	                ['', '', '', '', '', '', '', ''],
	                ['', '', '', '', '', '', '', ''],
	                ['', '', '', '', '', '', '', '']],
	                delta: {row: 3, col: 2}},
	                [{setTurn: {turnIndex: 0}},
	         		{set: {key: 'board', value: [['W', '', '', '', '', '', '', ''],
	                		        			 ['', '', '', '', '', '', '', ''],
	                        					 ['', '', '', '', '', '', '', ''],
	                        					 ['', '', 'B', 'B', 'B', '', '', ''],
	                        			 		 ['', '', '', 'B', 'W', '', '', ''],
	                        			 		 ['', '', '', '', '', '', '', ''],
	                        					 ['', '', '', '', '', '', '', ''],
	                        					 ['', '', '', '', '', '', '', '']
	                        					 ]}},
	        		{set: {key: 'delta', value: {row: 0, col: 0}}}]);
	});
	
	it("checks that placing a disk in a cell without forming a sandwich is invalid", function() {
		invalidMove(1,
					{board:  [['', '', '', '', '', '', '', ''],
	                ['', '', '', '', '', '', '', ''],
	                ['', '', '', '', '', '', '', ''],
	                ['', '', 'B', 'B', 'B', '', '', ''],
	                ['', '', '', 'B', 'W', '', '', ''],
	                ['', '', '', '', '', '', '', ''],
	                ['', '', '', '', '', '', '', ''],
	                ['', '', '', '', '', '', '', '']],
	                delta: {row: 3, col: 2}},
	                [{setTurn: {turnIndex: 0}},
	         		{set: {key: 'board', value: [['', '', '', '', '', '', '', ''],
	                		        			 ['', '', '', '', '', '', '', ''],
	                        					 ['', '', '', '', '', '', '', ''],
	                        					 ['', '', 'B', 'B', 'B', 'W', '', ''],
	                        			 		 ['', '', '', 'B', 'W', '', '', ''],
	                        			 		 ['', '', '', '', '', '', '', ''],
	                        					 ['', '', '', '', '', '', '', ''],
	                        					 ['', '', '', '', '', '', '', '']
	                        					 ]}},
	        		{set: {key: 'delta', value: {row: 3, col: 5}}}]);
	});
	
	it("checks that placing a disk outside the board (8,7) is invalid", function() {
		invalidMove(1,
					{board:  [['', '', '', '', '', '', '', ''],
	                		 ['', '', '', '', '', '', '', ''],
	                         ['', '', '', '', 'B', 'B', 'B', ''],
	                         ['', '', 'B', 'B', 'B', 'B', 'B', ''],
	                         ['', '', 'W', 'W', 'B', 'W', 'W', 'W'],
	                         ['', '', '', '', '', 'B', 'W', 'B'],
	                         ['', '', '', '', '', 'B', 'W', 'B'],
	                         ['', '', '', '', '', '', '', '']],
	                delta: {row: 6, col: 7}},
	                [{setTurn: {turnIndex: 0}},
	         		{set: {key: 'board', value: [['', '', '', '', '', '', '', ''],
	                		        			 ['', '', '', '', '', '', '', ''],
	                        					 ['', '', '', '', 'B', 'B', 'B', ''],
	                        					 ['', '', 'B', 'B', 'B', 'B', 'B', ''],
	                        			 		 ['', '', 'W', 'W', 'B', 'W', 'W', 'W'],
	                        			 		 ['', '', '', '', '', 'B', 'W', 'B'],
	                        					 ['', '', '', '', '', 'B', 'W', 'B'],
	                        					 ['', '', '', '', '', '', '', 'W']
	                        					 ]}},
	        		{set: {key: 'delta', value: {row: 8, col: 7}}}]);
	});

	it("checks that placing a disk on a correct cell (7,5), but setting the board wrong is invalid", function() {
		invalidMove(1,
					{board:  [['', '', '', '', '', '', '', ''],
	                		 ['', '', '', '', '', '', '', ''],
	                         ['', '', '', '', 'B', 'B', 'B', ''],
	                         ['', '', 'B', 'B', 'B', 'B', 'B', ''],
	                         ['', '', 'W', 'W', 'B', 'W', 'W', 'W'],
	                         ['', '', '', '', '', 'B', 'W', 'B'],
	                         ['', '', '', '', '', 'B', 'W', 'B'],
	                         ['', '', '', '', '', '', '', '']],
	                delta: {row: 6, col: 7}},
	                [{setTurn: {turnIndex: 0}},
	         		{set: {key: 'board', value: [['', '', '', '', '', '', '', ''],
	                		        			 ['', '', '', '', '', '', '', ''],
	                        					 ['', '', '', '', 'B', 'B', 'B', ''],
	                        					 ['', '', 'B', 'B', 'B', 'B', 'B', ''],
	                        			 		 ['', '', 'W', 'W', 'B', 'W', 'W', 'W'],
	                        			 		 ['', '', '', '', '', 'B', 'W', 'B'],
	                        					 ['', '', '', '', '', 'B', 'W', 'B'],
	                        					 ['', '', '', '', '', '', '', 'W']
	                        					 ]}},
	        		{set: {key: 'delta', value: {row: 7, col: 5}}}]);
	});

	it("checks that setting the turn to self when the opponent has a valid next move is invalid", function() {
		invalidMove(1,
					{board:  [['', '', '', '', '', '', '', ''],
	                		 ['', '', '', '', '', '', '', ''],
	                         ['', '', '', '', 'B', 'B', 'B', ''],
	                         ['', '', 'B', 'B', 'B', 'B', 'B', ''],
	                         ['', '', 'W', 'W', 'B', 'W', 'W', 'W'],
	                         ['', '', '', '', '', 'B', 'W', 'B'],
	                         ['', '', '', '', '', 'B', 'W', 'B'],
	                         ['', '', '', '', '', '', '', '']],
	                delta: {row: 6, col: 7}},
	                [{setTurn: {turnIndex: 1}},
	         		{set: {key: 'board', value: [['', '', '', '', '', '', '', ''],
	                		        			 ['', '', '', '', '', '', '', ''],
	                        					 ['', '', '', '', 'B', 'B', 'B', ''],
	                        					 ['', '', 'B', 'B', 'B', 'B', 'B', ''],
	                        			 		 ['', '', 'W', 'W', 'B', 'W', 'W', 'W'],
	                        			 		 ['', '', '', '', '', 'B', 'W', 'B'],
	                        					 ['', '', '', '', '', 'B', 'W', 'B'],
	                        					 ['', '', '', '', '', 'W', '', '']
	                        					 ]}},
	        		{set: {key: 'delta', value: {row: 7, col: 5}}}]);
	});

	it("checks that setting the turn to the opponent (W) when he has no valid move is invalid", function() {
		invalidMove(0,
					{board:  [['B', 'B', 'B', 'B', 'B', 'B', 'B', ''],
	                		  ['W', 'B', 'W', 'B', 'B', 'W', '', ''],
	                          ['W', 'B', 'B', 'B', 'B', 'W', 'W', ''],
	                          ['W', 'B', 'B', 'W', 'W', 'B', 'W', ''],
	                          ['W', 'B', 'W', 'W', 'W', 'W', 'W', 'W'],
	                          ['W', '', '', '', '', '', '', ''],
	                          ['', '', '', '', '', '', '', ''],
	                          ['', '', '', '', '', '', '', '']],
	                delta: {row: 5, col: 0}},
	                [{setTurn: {turnIndex: 1}},
	         		{set: {key: 'board', value: [['B', 'B', 'B', 'B', 'B', 'B', 'B', ''],
	                		        			 ['W', 'B', 'W', 'B', 'B', 'W', '', ''],
	                        					 ['W', 'B', 'B', 'B', 'B', 'W', 'W', ''],
	                        					 ['W', 'B', 'B', 'W', 'W', 'B', 'W', ''],
	                        			 		 ['W', 'B', 'W', 'W', 'W', 'W', 'W', 'W'],
	                        			 		 ['W', '', '', '', '', '', '', ''],
	                        					 ['B', '', '', '', '', '', '', ''],
	                        					 ['', '', '', '', '', '', '', '']
	                        					 ]}},
	        		{set: {key: 'delta', value: {row: 6, col: 0}}}]);
	});

	it("checks that move without board is invalid", function() {
	invalidMove(0, {}, [{setTurn: {turnIndex: 1}},
	        		{set: {key: 'delta', value: {row: 6, col: 0}}}]);
	});

	it("checks that null move is invalid", function() {
	invalidMove(0, {}, null);
	});

	it("checks that move without delta is invalid", function() {
	invalidMove(0,
					{board:  [['B', 'B', 'B', 'B', 'B', 'B', 'B', ''],
	                		  ['W', 'B', 'W', 'B', 'B', 'W', '', ''],
	                          ['W', 'B', 'B', 'B', 'B', 'W', 'W', ''],
	                          ['W', 'B', 'B', 'W', 'W', 'B', 'W', ''],
	                          ['W', 'B', 'W', 'W', 'W', 'W', 'W', 'W'],
	                          ['W', '', '', '', '', '', '', ''],
	                          ['', '', '', '', '', '', '', ''],
	                          ['', '', '', '', '', '', '', '']],
	                delta: {row: 5, col: 0}},
	                [{setTurn: {turnIndex: 0}},
	         		{set: {key: 'board', value: [['B', 'B', 'B', 'B', 'B', 'B', 'B', ''],
	                		        			 ['W', 'B', 'W', 'B', 'B', 'W', '', ''],
	                        					 ['W', 'B', 'B', 'B', 'B', 'W', 'W', ''],
	                        					 ['W', 'B', 'B', 'W', 'W', 'B', 'W', ''],
	                        			 		 ['W', 'B', 'W', 'W', 'W', 'W', 'W', 'W'],
	                        			 		 ['W', '', '', '', '', '', '', ''],
	                        					 ['B', '', '', '', '', '', '', ''],
	                        					 ['', '', '', '', '', '', '', '']
	                        					 ]}}]);
	});

function checkExamples(temp) {
	for(var i = 0; i < temp.length; i ++) {
		 validMove(temp[i].turnIndexBeforeMove, temp[i].stateBeforeMove, temp[i].move);
	}
}

it("checks that exampleGame is valid", function() {
	var eg = isMoveOk.exampleGame();
	checkExamples(eg);
	expect(eg.length).toBe(6);
});

it("checks that riddles is valid", function() {
	var r =isMoveOk.riddles();
	for(var i = 0; i < r.length; i ++) {
		checkExamples(r[i]);
	}
	expect(r.length).toBe(2);
});
}); //describe
