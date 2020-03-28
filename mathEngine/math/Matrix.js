/**
 A class that can store and manipulate a mathematical matrix over several fields.

 @author David Augustat
 */
class Matrix extends MathElement{

    /** @type {number} */
    rows;

    /** @type {number} */
    columns;

    /**
     * internally used field
     * @type {[number]} */
    _nonStepColumns;

    /**
     * @param {number} field
     * @param {?[[GeneralNumber]]} value Numbers to be stored in the matrix (can be null)
     * @param {?number} rows Number of rows of the matrix (if not set, default value is 0)
     * @param {?number} columns Number of columns of the matrix (if not set, default value is 0)
     * */
    constructor(field = Field.R, value, rows = 0, columns = 0){
        super(field, value);
        if(value !== null){
            this.value = value;
        } else{
            this.rows = rows;
            this.columns = columns;
            this.value = new Array(rows).fill(0).map(() => new Array(columns).fill(0));
        }

        this._nonStepColumns = [];
    }

    /**
     * Sets all values of all cells in the matrix  as an 2-dimensional array.
     *
     * @param {[[GeneralNumber]]} value
     * */
    set value(value) {
        this._value = value;
        this.rows = value.length;
        this.columns = value[0].length;
    }

    /**
     * Returns all values of all cells in the matrix as an 2-dimensional array.
     *
     * @returns {[[GeneralNumber]]}
     * */
    get value(){
        return this._value;
    }

    /**
     * Returns an array of all values that are in the given row.
     *
     * @param {number} position
     * @returns {[GeneralNumber]}
     * */
    getRow(position){
        return this.value[position]
    }

    /**
     * Returns an array of all values that are in the given column.
     *
     * @param {number} position
     * @returns {[GeneralNumber]}
     * */
    getColumn(position){
        const column = [];
        this.value.forEach((row) => {
            column.push(row[position]);
        });
        return column;
    }

    /**
     * Returns the cell element of the cell at the given position.
     *
     * @param {number} rowPos
     * @param {number} columnPos
     * @returns {GeneralNumber}
     * */
    getCellValue(rowPos, columnPos){
        return this.value[rowPos][columnPos];
    }

    /**
     * @returns {number}
     * */
    getColumnCount(){
        return this.columns;
    }

    /**
     * @returns {number}
     * */
    getRowCount(){
        return this.rows;
    }

    /**
     * Prints the matrix to the console
     * */
    print(){
        let output = "";
        this.value.forEach((row) => {
            row.forEach((cellElement) => {
                output += cellElement.toString() + "\t";
            });
            output += "\n";
        });
        console.log(output);
    }

    /**
     * Returns a human-readable string representation of the matrix.
     *
     * @returns {string}
     * */
    toString(){
        let output = "";
        this.value.forEach((row) => {
            row.forEach((cellElement) => {
                output += cellElement.toString() + "\t";
            });
            output += "\n";
        });
        return output;
    }

    /**
     * Returns a Latex representation of the matrix.
     *
     * @returns {string}
     * */
    toLatex(){
        let output = "\\begin{pmatrix}";
        this.value.forEach((row) => {
            row.forEach((cellElement, index, array) => {
                if(index < array.length-1) {
                    output += cellElement.toLatex() + " & ";
                } else{
                    output += cellElement.toLatex();
                }
            });
            output += "\\\\";
        });
        output += "\\end{pmatrix}";
        return output;
    }

    /**
     * Returns a string representation of the matrix that can be used as an input for the Interpreter.
     *
     * @returns {string}
     * */
    toUserInputString() {
        let output = "{";
        this.value.forEach((row) => {
            row.forEach((cellElement, index, array) => {
                if(index < array.length-1) {
                    output += cellElement.toUserInputString() + ", ";
                } else{
                    output += cellElement.toUserInputString();
                }
            });
            output += "; ";
        });
        output += "}";
        return output;
    }

    /**
     * Sets the value at a given position in the matrix.
     *
     * @param {number} rowPos
     * @param {number} columnPos
     * @param {GeneralNumber} value
     * */
    set(rowPos, columnPos, value){
        this.value[rowPos][columnPos] = value;
    }

    /**
     *  Returns a transposed variant of the matrix (rows and columns are swapped)
     *
     * @returns {Matrix}
     * */
    transpose(){
        const copy = this.getCopy();
        copy._internalTranspose();
        return copy;
    }

    /**
     * Row reduces the matrix to reduced row-echelon-form.
     *
     * The matrix itself will not be modified by this, but only a copy of the current Matrix object.
     *
     * More information on that: https://en.wikipedia.org/wiki/Row_echelon_form#Reduced_row_echelon_form
     *
     * @returns {Matrix}
     * */
    rowReduce(){
        const copy = this.getCopy();
        copy._internalRowReduce();
        return copy;
    }

    /**
     * Solves the matrix as an homogeneous equation system.
     *
     * The matrix itself will not be modified by this, but only a copy of the current Matrix object.
     *
     * Note: This is NOT an operation to be used in the normal Interpreter.js class, since it's return value is not
     * a MathElement. Therefore it must be treated separately.
     *
     * @returns {{trivialSolution: Vector, vectorSolution: [Vector], rowReducedMatrix: Matrix}} Object that
     * contains the trivial solution (Vector with only zeroes), the vector solution (if exists) and the row
     * reduced matrix object, that has been created during the process.
     * */
    solveHomogeneousEquationSystem(){
        const copy = this.getCopy();
        return copy._internalSolveHomogeneousEquationSystem();
    }

    /**
     * Internal method that multiplies the matrix with a constant.
     *
     * The matrix itself will not be modified by this, but only a copy of the current Matrix object.
     *
     * @param {GeneralNumber} factor
     * @returns {Matrix}
     * */
    _multiplyWithNumber(factor) {
        const result = this.getEmptyCopy();
        this.value.forEach((row, rowPos) => {
            row.forEach((cellElement, columnPos) => {
                result.getRow(rowPos)[columnPos] = cellElement.multiplyWith(factor);
            });
        });
        return result;
    }

    /**
     * Internal method that multiplies the matrix with another matrix. The result is another matrix.
     *
     * The matrix itself will not be modified by this, but only a copy of the current Matrix object.
     *
     * Note that this only possible when the current matrix' column count is equal to the factor matrix' row count.
     * If this is not the case, an exception will be thrown.
     *
     * @param {Matrix} factor
     * */
    _multiplyWithMatrix(factor) {
        if(this.getColumnCount() !== factor.getRowCount()){
            throw "Result of matrix multiplication not defined! (wrong dimensions)";
        }

        const result = new Matrix(this.field, null, this.rows, factor.columns);
        for(let rowPos = 0; rowPos < result.rows; rowPos++){
            for(let columnPos = 0; columnPos < result.columns; columnPos++){
                const sourceRow = this.getRow(rowPos);
                const sourceColumn = factor.getColumn(columnPos);
                result.set(rowPos, columnPos, this._multiplyRowWithColumn(sourceRow, sourceColumn));
            }
        }
        return result;
    }

    /**
     * Internal method that multiplies the matrix with a vector. The result is a vector.
     *
     * The matrix itself will not be modified by this.
     *
     * Note that this is only possible, when the current matrix has the same number of columns as the vector has rows.
     * If this is not the case, an exception will be thrown.
     *
     * @param {Vector} factor
     * @returns {Vector}
     * */
    _multiplyWithVector(factor) {
       if(this.getColumnCount() !== factor.getSize()){
           throw "Result of multiplication of matrix with vector not defined! (wrong dimensions)"
       }

       const result = new Vector(this.field, null, 0);
       for(let rowPos = 0; rowPos < this.rows; rowPos++){
           result.addRow(this._multiplyRowWithColumn(this.getRow(rowPos), factor.value))
       }
       return result;
    }

    /**
     * Adding a number to a matrix is mathematically not possible. Therefore an exception will be thrown.
     *
     * @param {GeneralNumber} summand
     * */
    _addNumber(summand) {
        throw "Addition of numbers to a matrix is not allowed";
    }

    /**
     * Internal method that adds another matrix to the current matrix.
     *
     * The matrix itself will not be modified by this, but only a copy of the current Matrix object.
     *
     * Note that this is only possible if the summand matrix has the same dimensions as the current matrix.
     * If this is not the case, an exception will be thrown.
     *
     * @param {Matrix} summand
     * @returns {Matrix}
     * */
    _addMatrix(summand) {
        if(this.rows !== summand.rows || this.columns !== summand.columns){
            throw "Addition of matrices with different dimensions is not allowed";
        }
        const result = this.getEmptyCopy();
        for(let rowPos = 0; rowPos < this.rows; rowPos++){
            for(let columnPos = 0; columnPos < this.columns; columnPos++){
                const resultCellValue = this.value[rowPos][columnPos].add(summand.value[rowPos][columnPos]);
                result.set(rowPos, columnPos, resultCellValue);
            }
        }
        return result;
    }

    /**
     * Adding a vector to a matrix is mathematically not possible. Therefore an exception will be thrown.
     *
     * @param {GeneralNumber} summand
     * */
    _addVector(summand) {
        throw "Addition of vector to matrix is not allowed";
    }

    /**
     * Subtracting a number from a matrix is mathematically not possible. Therefore an exception will be thrown.
     *
     * @param {GeneralNumber} subtrahend
     * */
    _subtractNumber(subtrahend) {
        throw  "Subtraction of number from matrix is not allowed";
    }

    /**
     * Internal method that subtracts another matrix from the current matrix.
     *
     * The matrix itself will not be modified by this, but only a copy of the current Matrix object.
     *
     * Note that this is only possible if the subtrahend matrix has the same dimensions as the current matrix.
     * If this is not the case, an exception will be thrown.
     *
     * @param {Matrix} subtrahend
     * @returns {Matrix}
     * */
    _subtractMatrix(subtrahend) {
        const summand2Value = subtrahend.value.map(row => row.map(cellElement => cellElement.getAdditiveInverse()));
        return this._addMatrix(new Matrix(this.field, summand2Value));
    }

    /**
     *  Internal method that multiplies a given row with a given column of the current matrix.
     *
     *  This method does not modify the current matrix.
     *
     * @param {[GeneralNumber]} row
     * @param {[GeneralNumber]} column
     * @returns {GeneralNumber}
     * */
    _multiplyRowWithColumn(row, column){
        let result = parseValueToFittingNumberObject(this.field, 0);
        for(let pos = 0; pos < row.length; pos++){
            result = result._addNumber(row[pos].multiplyWith(column[pos]));
        }
        return result;
    }

    /**
     * Internal method to transpose the matrix (swap rows and columns).
     *
     * Note that this method modifies the current matrix object.
     * */
    _internalTranspose(){
        const transposed = new Array(this.columns).fill(0).map(() => new Array(this.rows).fill(0));
        for(let row = 0; row<this.rows; row++){
            for(let column = 0; column <this.columns; column++){
                transposed[column][row] = this.value[row][column];
            }
        }
        this.value = transposed;
        [this.rows, this.columns] = [this.columns, this.rows];
    }

    /**
     * Internal method that replies a given row with a constant factor.
     *
     * Note that this method modifies the current matrix object.
     *
     * @param {number} rowPos
     * @param {GeneralNumber} factor
     * */
    _multiplyRow(rowPos, factor){
        const row = this.value[rowPos];
        for(let column = 0; column < this.columns; column++){
            //row[column] = this.field.multiply(row[column], factor);
            row[column] = row[column].multiplyWith(factor);
        }
    }

    /**
     * Internal method that adds a row to another row .
     *
     * For each column, the value of the same column in the other row is added onto the target row.
     *
     * Note that this method modifies the current matrix object.
     *
     * @param {number} sourceRowPos
     * @param {number} targetRowPos
     * @param {GeneralNumber} factor
     * */
    _addRowToOther(sourceRowPos, targetRowPos, factor){
        for(let column = 0; column < this.columns; column++){
            this.value[targetRowPos][column] = this.value[targetRowPos][column]
                .add(this.value[sourceRowPos][column].multiplyWith(factor));
        }
    }

    /**
     * Reduces a column so that the value of (rowPos, columnPos) is 1 and all other values in the
     * given column are 0.
     *
     * Note that this method modifies the current matrix object.
     *
     * @param {number} rowPos
     * @param {number} columnPos
     */
    _reduceColumn(rowPos, columnPos){
        const factor = this.value[rowPos][columnPos].getMultiplicativeInverse();
        this._multiplyRow(rowPos, factor);

        for(let row = 0; row < this.rows; row++){
            if(row !== rowPos){
                const rowFactor = this.value[row][columnPos].getAdditiveInverse();
                this._addRowToOther(rowPos, row, rowFactor);
            }
        }
    }

    /**
     * Internal method that moves a row to a different position in the matrix. The row that originally was on the target position of the
     * row that is moved, will move downwards.
     *
     * Note that this method modifies the current matrix object.
     *
     * @param {number} rowPos
     * @param {number} targetPos
     */
    _moveRow(rowPos, targetPos){
        const cutOut = this.value.splice(rowPos, 1)[0];
        this.value.splice(targetPos, 0, cutOut);
    }

    /**
     * Internal method that row reduces the current matrix to extended row-echelon-form.
     *
     * Note that this method modifies the current matrix object.
     * */
    _internalRowReduce(){
        let row = 0;
        let column = 0;
        while(row < this.rows && column < this.columns){
            if(this.value[row][column].value !== 0){
                this._reduceColumn(row, column);
                row++;
                column++;
            }
            else{
                const isCurrentPositionNotZero = this._moveRowWithoutZeroAtCurrentPosition(row, column);
                if(!isCurrentPositionNotZero){
                    this._nonStepColumns.push(column);
                    column++;
                }
            }
        }
    }

    /**
     * @param {number} rowPos
     * @param {number} columnPos
     */
    _moveRowWithoutZeroAtCurrentPosition(rowPos, columnPos){
        let numMoves = 0;
        while(this.value[rowPos][columnPos].value === 0 && numMoves < this.rows-rowPos-1){
            this._moveRow(rowPos, this.rows-1);
            numMoves++;
        }
        return this.value[rowPos][columnPos].value !== 0;
    }

    /**
     * @returns {{trivialSolution: Vector, vectorSolution: [Vector], rowReducedMatrix: Matrix}}
     * */
    _internalSolveHomogeneousEquationSystem(){
        const zeroNumber = parseValueToFittingNumberObject(this.field, 0);
        const oneNumber = parseValueToFittingNumberObject(this.field, 1);

        const solution = {
            trivialSolution: new Vector(this.field, null, this.rows),
            vectorSolution: [], // Array of vectors
            rowReducedMatrix: this
        };

        this._internalRowReduce();

        this._nonStepColumns.forEach((currentNonStepColumnPos) => {
            let rowPos = 0;
            const solutionVector = new Vector(this.field, null, 0);
            for(let pos = 0; pos < this.columns; pos++){
                if(this._nonStepColumns.includes(pos)){
                    if(pos === currentNonStepColumnPos){
                        solutionVector.addRow(oneNumber);
                    } else{
                        solutionVector.addRow(zeroNumber);
                    }
                } else{
                    solutionVector.addRow(this.value[rowPos][currentNonStepColumnPos].getAdditiveInverse());
                    rowPos++;
                }
            }
            solution.vectorSolution.push(solutionVector);
        });
        return solution;
    }

    /**
     * @returns {Matrix}
     * */
    getCopy(){
        const copyMatrix2 = new Matrix(this. field, null, this.rows, this.columns);
        for(let rowPos = 0; rowPos < this.rows; rowPos++){
            for(let columnPos = 0; columnPos < this.columns; columnPos++){
                copyMatrix2.set(rowPos, columnPos, this.value[rowPos][columnPos]);
            }
        }
        return copyMatrix2;
    }

    /**
     * @returns {Matrix}
     * */
    getEmptyCopy(){
        return new Matrix(this.field, null, this.rows, this.columns);
    }


    /**
     * @param{number} field
     * @param{[[number]]} data
     * @returns {Matrix}
     * */
    static fromRawData(field, data, ){
        const resultData = [];
        data.forEach((row) => {
            const resultRow = [];
            row.forEach((cellValue) => {
                resultRow.push(parseValueToFittingNumberObject(field, cellValue));
            });
            resultData.push(resultRow);
        });
        return new Matrix(field, resultData, 0, 0);
    }

    /**
     * @param {number} field
     * @param {string} text
     * @returns {Matrix}
     * */
    static fromString(field, text){
        text = removeSpacesAndLineBreaks(text);
        if(!RegExp(getMatrixRegex(field)).test(text)){
            throw "Not a valid input!";
        }
        text = removeCharacter(text, "{");
        text = removeCharacter(text, "}");

        const rows = text.split(";");
        const matrixData = [];

        let numColumns = 0;
        rows.forEach(rowString => {
            const rowStringValues =  rowString.split(",");
            const rowNumbers = [];
            rowStringValues.forEach(stringValue => {
                const numberValue = getNumberFromNumberString(field, stringValue);
                rowNumbers.push(numberValue);
            });
            if(numColumns > 0 && rowNumbers.length !== numColumns){
                throw "Unequal amount of columns";
            }
            numColumns = rowNumbers.length;
            matrixData.push(rowNumbers);
        });

        return new Matrix(field, matrixData);
    }
}
