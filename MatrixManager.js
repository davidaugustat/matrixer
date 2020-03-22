class MatrixManager{

    /**
     * @param {Matrix} matrix
     * @param {number} factor
     * @returns {Matrix}
     * */
    multiplyMatrixByFactor(matrix, factor){
        var result = matrix.getEmptyCopy();
        matrix.getData().forEach((row, rowPos) => {
            row.forEach((value, columnPos) => {
                result.getRow(rowPos)[columnPos] = value * factor;
            });
        });
        return result;
    }

    /**
     * @param {Matrix} matrixA
     * @param {Matrix} matrixB
     * @returns {Matrix}
     * */
    multiplyMatrices(matrixA, matrixB){
        if(matrixA.getColumnCount() != matrixB.getRowCount()){
            throw "Result of matrix multiplication not defined! (wrong dimensions)";
        }

        const result = new Matrix(matrixA.getRowCount(), matrixB.getColumnCount());

        for(let rowPos = 0; rowPos < result.getRowCount(); rowPos++){
            for(let columnPos = 0; columnPos < result.getColumnCount(); columnPos++){
                const sourceRow = matrixA.getRow(rowPos);
                const sourceColumn = matrixB.getColumn(columnPos);
                result.set(rowPos, columnPos, this.multiplyRowWithColumn(sourceRow, sourceColumn));
            }
        }
        return result;
    }

    /**
     * @param {[number]} row
     * @param {[number]} column
     * @returns {number}
     * */
    multiplyRowWithColumn(row, column){
        let result = 0;
        for(let pos = 0; pos < row.length; pos++){
            result += row[pos] * column[pos];
        }
        return result;
    }


    /**
     * Interprets a string and returns a matrix object that equals the matrix represented by the string.
     *
     * Matrices must be in following format: <b>{1, 2, 3; 4, 5, 6; 7, 8, 9}</b>
     * <br>Whereas each column inside
     * one row is divided by a comma and each row is divided by a semicolon. The entire matrix is enclosed into
     * one set of curly brackets. Spaces do NOT matter and can be omitted.
     *
     * @param {string} text The string representation of the matrix
     * @param {number} field The field in which the matrix should be interpreted
     *
     * @returns Matrix The matrix that is equivalent to the string
     * */
    getMatrixFromText(text, field){
        text = this.removeCharacter(text, " ");
        if(!RegExp(getMatrixRegex(field)).test(text)){
            throw "Not a valid input!";
        }
        text = this.removeCharacter(text, "{");
        text = this.removeCharacter(text, "}");

        const rows = text.split(";");
        const matrixData = new Array();

        let numColumns = 0;
        rows.forEach(rowString => {
           const rowStringValues =  rowString.split(",");
           const rowNumbers = new Array();
           rowStringValues.forEach(stringValue => {
               const numberValue = getNumberFromNumberString(stringValue, field);
               rowNumbers.push(numberValue);
           });
           if(numColumns > 0 && rowNumbers.length != numColumns){
               throw "Unequal amount of columns";
           }
           numColumns = rowNumbers.length;
           matrixData.push(rowNumbers);
        });

        const matrix = new Matrix(0,0,field);
        matrix.setData(matrixData);
        return matrix;
    }



    /**
     * Removes all occurrences of a character from a string
     *
     * @param {string} text The string with the character
     * @param {string} characterToRemove The character to remove
     * @returns string The string without character
     * */
    removeCharacter(text, characterToRemove){
        return text.split(characterToRemove).join('');
    }
}
