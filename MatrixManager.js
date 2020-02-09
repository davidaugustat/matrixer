class MatrixManager{

  multiplMatrixByFactor(matrix, factor){
    var result = matrix.getEmptyCopy();
    matrix.getData().forEach((row, rowPos) => {
      row.forEach((value, columnPos) => {
        result.getRow(rowPos)[columnPos] = value * factor;
      });
    });
    return result;
  }

  multiplyMatrices(matrixA, matrixB){
    if(matrixA.getColumnCount() != matrixB.getRowCount()){
      throw "Result of matrix multiplication not defined! (wrong dimensions)";
    }

    var result = new Matrix(matrixA.getRowCount(), matrixB.getColumnCount());

    for(var rowPos = 0; rowPos < result.getRowCount(); rowPos++){
      for(var columnPos = 0; columnPos < result.getColumnCount(); columnPos++){
        var sourceRow = matrixA.getRow(rowPos);
        var sourceColumn = matrixB.getColumn(columnPos);
        result.set(rowPos, columnPos, this.multiplyRowWithColumn(sourceRow, sourceColumn));
      }
    }
    return result;
  }

  multiplyRowWithColumn(row, column){
    var result = 0;
    for(var pos = 0; pos < row.length; pos++){
      result += row[pos] * column[pos];
    }
    return result;
  }
}
