class MatrixManager{

    multiplyMatrixByFactor(matrix, factor){
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
               const numberValue = this.getNumberFromNumberString(stringValue, field);
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
     * Converts a string into a number. Works for every available field.
     *
     * @param {string} numberString The string representation of the number. This must NOT contain spaces!
     * @param {number} field The field in which the number should be parsed
     * @returns number The number equivalent to numberString
     * */
    getNumberFromNumberString(numberString, field){
        if(isRealNumbersField(field) || isPrimeField(field)){
            return parseFloat(numberString);
        } else if(field == Field.F4){
            return this.getF4NumberFromString(numberString);
        } else if(field == Field.F8){
            return this.getF8NumberFromString(numberString);
        } else if(field == Field.F9){
            return this.getF9NumberFromString(numberString);
        }
    }

    getF4NumberFromString(numberString){
        if(numberString == "0"){
            return Field.F4Zero;
        } else if(numberString == "1"){
            return Field.F4One;
        } else if(numberString == "a"){
            return Field.F4Alpha;
        } else if(["a+1", "1+a"].includes(numberString)){
            return Field.F4AlphaPlusOne;
        }
    }

    getF8NumberFromString(numberString){
        if(numberString == "0"){
            return Field.F8Zero;
        } else if(numberString == "1"){
            return Field.F8One;
        } else if(numberString == "b"){
            return Field.F8Beta;
        } else if(numberString == "bs"){
            return Field.F8BetaSquare;
        } else if(["1+b", "b+1"].includes(numberString)){
            return Field.F8OnePlusBeta;
        } else if(["1+bs", "bs+1"].includes(numberString)){
            return Field.F8OnePlusBetaSquare;
        } else if(["b+bs", "bs+b"].includes(numberString)){
            return Field.F8BetaPlusBetaSquare;
        } else if(["1+b+bs", "1+bs+b", "b+1+bs", "b+bs+1", "bs+1+b", "bs+b+1"].includes(numberString)){
            return Field.F8OnePlusBetaPlusBetaSquare;
        }
    }

    getF9NumberFromString(numberString){
        if(numberString == "0"){
            return Field.F9Zero;
        } else if(numberString == "1"){
            return Field.F9One;
        } else if(numberString == "-1"){
            return Field.F9MinusOne;
        } else if(numberString == "j"){
            return Field.F9Iota;
        } else if(numberString == "-j"){
            return Field.F9MinusIota;
        } else if(["j+1", "1+j"].includes(numberString)){
            return Field.F9IotaPlusOne;
        } else if(["j-1", "-1+j"].includes(numberString)){
            return Field.F9IotaMinusOne;
        } else if(["-j+1", "1-j"].includes(numberString)){
            return Field.F9MinusIotaPlusOne;
        } else if(["-j-1", "-1-j"].includes(numberString)){
            return Field.F9MinusIotaMinusOne;
        }
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
