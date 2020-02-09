/**
A class that can store and manipulate a mathematical matrix over real numbers.

Author: David Augustat
*/

class Matrix{
  data;
  rows;
  columns;

  constructor(rows, columns){
    this.rows = rows;
    this.columns = columns;
    this.data = new Array(rows).fill(0).map(() => new Array(columns).fill(0));
  }

  setData(data){
    this.data = data;
    this.rows = data.length;
    this.columns = data[0].length;
  }

  transpone(){
    var transponed = new Array(this.columns).fill(0).map(() => new Array(this.rows).fill(0));
    for(var row = 0; row<this.rows; row++){
      for(var column = 0; column <this.columns; column++){
        transponed[column][row] = this.data[row][column];
      }
    }
    this.data = transponed;
    [this.rows, this.columns] = [this.columns, this.rows];
  }

  getRow(position){
    return this.data[position]
  }

  getColumn(position){
    var column = new Array();
    this.data.forEach((row) => {
      column.push(row[position]);
    });
    return column;
  }

  print(){
    var output = "";
    this.data.forEach((row) => {
      row.forEach((value) => {
        output += value + "\t";
      });
      output += "\n";
    });
    console.log(output);
  }

  set(rowPos, columnPos, value){
    this.data[rowPos][columnPos] = value;
  }

  multiplyRow(rowPos, factor){
    var row = this.data[rowPos];
    for(var column = 0; column < this.columns; column++){
      row[column] = row[column]*factor;
    }
  }

  addRowToOther(sourceRowPos, targetRowPos, factor){
    for(var column = 0; column < this.columns; column++){
      this.data[targetRowPos][column] = this.data[targetRowPos][column] + this.data[sourceRowPos][column] * factor;
    }
  }

  reduceColumn(rowPos, columnPos){
    var factor = 1/this.data[rowPos][columnPos];
    this.multiplyRow(rowPos, factor);

    for(var row = 0; row<this.rows; row++){
      if(row != rowPos){
        var rowFactor = -this.data[row][columnPos];
        this.addRowToOther(rowPos, row, rowFactor);
      }
    }
  }

  moveRow(rowPos, targetPos){
    var cutOut = this.data.splice(rowPos, 1)[0];
    this.data.splice(targetPos, 0, cutOut);
  }

  rowReduce(){
    var row = 0;
    var column = 0;
    while(row < this.rows && column < this.columns){
      if(this.data[row][column] != 0){
        this.reduceColumn(row, column);
        row++;
        column++;
      }
      else{
        var isCurrentPositionNotZero = this.moveRowWithoutZeroAtCurrentPosition(row, column);
        if(!isCurrentPositionNotZero){
          column++;
        }
      }
    }
  }

  moveRowWithoutZeroAtCurrentPosition(rowPos, columnPos){
    var numMoves = 0;
    while(this.data[rowPos][columnPos] == 0 && numMoves < this.rows-rowPos-1){
      this.moveRow(rowPos, this.rows-1);
    }
    return this.data[rowPos][columnPos] != 0;
  }

}

// old code:
// rowReduce2(){
//   var column = 0;
//   for(var row=0; row<Math.min(this.rows, this.columns); row++){
//     if(column < this.columns){
//       if(this.data[row][column] != 0){
//         this.reduceColumn(row, column);
//       } else{
//         var found = false;
//         for(var movedRows=0; movedRows < (this.rows-row-1); movedRows++){
//           this.moveRow(row, this.rows-1);
//           if(this.data[row][column] != 0){
//             this.reduceColumn(row, column);
//             found = true;
//             break;
//           }
//         }
//         if(!found){
//           row--;
//         }
//       }
//       column++;
//     }
//   }
// }
