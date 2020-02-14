// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function () {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function () {
      return _(_.range(this.get('n'))).map(function (rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function (rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function () {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function (rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function () {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function (rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function (rowIndex) {
      // create a counter variable
      var counter = 0;
      // extract the row of the board using the input
      var row = this.get(rowIndex);
      // iterate through the extracted row

      for (var i = 0; i < row.length; i++) {
        // increase counter when the value of the element is 1
        if (row[i]) {
          counter++;
        }
        // if counter is > 1, return true
        if (counter > 1) {
          return true;
        }
      }
      // return false as default
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function () {
      var myBoard = this.rows();
      // console.log(myBoard);
      // create a loop that iterate through n rows
      //debugger;
      // console.log(this);
      for (var i = 0; i < myBoard.length; i++) {
        // check see if any conflict on each row
        if (this.hasRowConflictAt(i)) {
          // return true
          return true;
        }
      }
      // return false on default
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function (colIndex) {
      // create counter
      var counter = 0;
      // extract column using colIndex
      var myBoard = this.rows();
      var col = [];
      for (var i = 0; i < myBoard.length; i++) {
        col.push(myBoard[i][colIndex]);
      }
      // loop through the extracted column
      for (item of col) {
        // if item === 1, increase counter
        if (item) {
          counter++;
        }
        // if counter > 1, return true
        if (counter > 1) {
          return true;
        }
      }
      // return false on default
      return false;
    },


    hasAnyColConflicts: function () {
      // create board
      // debugger;
      var myBoard = this.rows();
      // loop through columns
      for (var i = 0; i < myBoard.length; i++) {
        // run hasColConflictAt on the current column
        // if true, return true
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      // return false on default
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function (majorDiagonalColumnIndexAtFirstRow) {

      //Create a new board
      let myBoard = this.rows();
      // Create a counter variable
      let counter = 0;
      // create tracker for column index
      let tracker = majorDiagonalColumnIndexAtFirstRow;
      // loop through from 0
      if (majorDiagonalColumnIndexAtFirstRow >= 0) {
        for (let i = 0; i < myBoard.length; i++) {
          // if the element === 1
          if (myBoard[i][tracker] === 1) {
            // increase the counter
            counter++;
          }
          // if counter > 1
          if (counter > 1) {
            return true;
          }
          //return true
          tracker++;
        }
      } else {
        tracker = 0;
        for (let i = (majorDiagonalColumnIndexAtFirstRow * -1); i < myBoard.length; i++) {
          // if the element === 1
          if (myBoard[i][tracker] === 1) {
            // increase the counter
            counter++;
          }
          // if counter > 1
          if (counter > 1) {
            return true;
          }
          //return true
          tracker++;
        }
      }

      //default return

      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function () {
      //extract the board
      let myBoard = this.rows();
      //extract length (n)
      let n = myBoard.length;
      //loop from -n = +1 to n -1
      for (let i = (-n + 1); i < n; i++) {
        //invoke aboive function if true return true
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      //else return default (false)
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function (minorDiagonalColumnIndexAtFirstRow) {
      // extract board
      var myBoard = this.rows();
      // create a counter
      var counter = 0;
      // create tracker for column index
      var tracker = minorDiagonalColumnIndexAtFirstRow;
      // if starting index is less than board range
      if (minorDiagonalColumnIndexAtFirstRow < myBoard.length) {
        // loop row from 0 to board length - 1
        for (var i = 0; i < myBoard.length; i++) {
          // if element === 1
          if (myBoard[i][tracker] === 1) {
            // increase counter by 1
            counter++;
          }
          // if counter > 1
          if (counter > 1) {
            // return true
            return true;
          }
          tracker--;
        }
      } else {
        tracker = myBoard.length - 1;
        // if starting index is greater than board range
        // loop row from 0 to board length - 1
        for (var i = minorDiagonalColumnIndexAtFirstRow - (myBoard.length - 1); i < myBoard.length; i++) {
          // if element === 1
          if (myBoard[i][tracker] === 1) {
            // increase counter by 1
            counter++;
          }
          // if counter > 1
          if (counter > 1) {
            // return true
            return true;
          }
          tracker--;
        }
      }
      // return false on default
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function () {
      // extract the board
      var myBoard = this.rows();
      // create end point
      var end = (myBoard.length - 1) * 2;
      // loop from 0 to end point
      for (var i = 0; i <= end; i++) {
        // feed i into the above function
        // if this is true, return true
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      // return false by default
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function (n) {
    return _(_.range(n)).map(function () {
      return _(_.range(n)).map(function () {
        return 0;
      });
    });
  };

}());
