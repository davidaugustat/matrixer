import MathElement from "./MathElement";
import {Exceptions} from "../Exceptions";
import Vector from "./Vector";
import Helper from "../Helper";
import {MathElementType} from "../Constants";
import GeneralNumber from "./GeneralNumber";
import RealNumber from "./RealNumber";
import PrimeFieldNumber from "./PrimeFieldNumber";
import F4Number from "./F4Number";
import F8Number from "./F8Number";
import F9Number from "./F9Number";

/**
 A class that can store and manipulate a mathematical matrix over several fields.

 @author David Augustat
 */
export default class Matrix extends MathElement{

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
        super(field, value, MathElementType.MATRIX);
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
        this.value.forEach((row, rowIndex, outerArray) => {
            row.forEach((cellElement, columnIndex, innerArray) => {
                if(columnIndex < innerArray.length-1) {
                    output += cellElement.toUserInputString() + ", ";
                } else{
                    output += cellElement.toUserInputString();
                }
            });
            if(rowIndex < outerArray.length-1){
                output += "; ";
            }
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
     * Inverts the matrix
     * 
     *  More information on invertable matrices: https://en.wikipedia.org/wiki/Invertible_matrix
     * 
     * The matrix itself will not be modified by this, but only a copy of the current Matrix object.
     *
     *
     * @returns {Matrix}
     * */
     getMultiplicativeInverse(){
        const copy = this.getCopy();
        copy._internalGetMultiplicativeInverse();
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
     * Calculates the determinant of the matrix
     *
     * The matrix itself will not be modified by this, but only a copy of the current Matrix object.
     * @returns {GeneralNumber}
     * */
    getDeterminant(){
        const copy = this.getCopy();
        return copy._internalGetDeterminant();
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
            throw Exceptions.MultiplicationOfMatricesWithInvalidDimensionsException;
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
           throw Exceptions.MultiplicationOfMatrixWithVectorWithInvalidDimensionsException;
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
        throw Exceptions.AdditionOfNumberToMatrixException;
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
            throw Exceptions.AdditionOrSubtractionOfMatricesWithDifferentDimensionsException;
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
        throw Exceptions.AdditionOfVectorToMatrixException;
    }

    /**
     * Subtracting a number from a matrix is mathematically not possible. Therefore an exception will be thrown.
     *
     * @param {GeneralNumber} subtrahend
     * */
    _subtractNumber(subtrahend) {
        throw Exceptions. SubtractionOfNumberFromMatrixException;
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
        let result = Helper.parseValueToFittingNumberObject(this.field, 0);
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
    }

    /**
     * Internal method to invert the matrix.
     *
     * Note that this method modifies the current matrix object.
     * 
     * If the matrix is not invertible, an exception will be thrown.
     * */
     _internalGetMultiplicativeInverse(){
        // Define one and zero for the current field
        const { one, zero } = this._getOneAndZeroInField();
        
        // Check if matrix is invertable
        if(this.rows != this.columns) {
            throw Exceptions.InvertNotInvertable;
        }
        let reducedOriginal = this.rowReduce();
        for(let n = 0; n < this.rows; n++){
            if(reducedOriginal.value[n][n].value != one.value){
                throw Exceptions.InvertNotInvertable;
            }
        }

        // For the given n x n matrix A row-reduce the new matrix (A|E) with E being the n-th identity matrix
        let toReduceValue = new Array(this.rows).fill(0).map(() => new Array(2*this.columns).fill(0));
        
        // Insert original values
        for(let row = 0; row<this.rows; row++){
            for(let column = 0; column <this.columns; column++){
                toReduceValue[row][column] = this.value[row][column];
            }
        }
        
        // Insert identity matrix to the right
        for(let row = 0; row<this.rows; row++){
            for(let column = this.columns; column <(2*this.columns); column++){
                if((column-this.columns) == row){
                    toReduceValue[row][column] = one;
                } else {
                    toReduceValue[row][column] = zero;
                }
            }
        }

        // Row-reduce the new matrix
        let toReduce = new Matrix(this.field, toReduceValue, this.rows, (2*this.columns));
        toReduce._internalRowReduce();

        // The inverse matrix is the right part of the result
        const inverted = new Array(this.columns).fill(0).map(() => new Array(this.rows).fill(0));
        for(let row = 0; row<this.rows; row++){
            for(let column = 0; column <this.columns; column++){
                inverted[row][column] = toReduce.value[row][(this.columns + column)];
            }
        }

        this.value = inverted;
    }

    /**
     * Returns one and zero in the current field of the matrix.
     * 
     * @returns {{ one: GeneralNumber, zero: GeneralNumber }}
     */
    _getOneAndZeroInField(){
        let one, zero;
        switch(this.field){
            case 100:
                one = new RealNumber(1);
                zero = new RealNumber(0);
                break;
            case 4:
                one = new F4Number(1);
                zero = new F4Number(0);
                break;
            case 8:
                one = new F8Number(1);
                zero = new F8Number(0);
                break;
            case 9:
                one = new F9Number(1);
                zero = new F9Number(0);
                break;
            default:
                one = new PrimeFieldNumber(this.field, 1);
                zero = new PrimeFieldNumber(this.field, 0);
                break;
        }
        return { one, zero };
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
     * Internal method that moves a row to a different position in the matrix. The row that originally was on
     * the target position of the row that is moved, will move downwards.
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
            if(!this.value[row][column].equalsValue(0)){
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
        // Add all unchecked columns as non-step-columns, since they must be non-step-columns
        while(column < this.columns){
            this._nonStepColumns.push(column);
            column++;
        }
    }

    /**
     * Internal method that tries to achieve that the current cell does not contain a zero.
     *
     * Note that this method modifies the current matrix object.
     *
     * This is done by moving rows from the bottom to the current row position, until the given cell does
     * not contain a 0 anymore. If this is not possible the current cell will continue containing a zero and false
     * will be returned.
     *
     * @param {number} rowPos
     * @param {number} columnPos
     * @returns {boolean} True if removing the 0 at the current position was successful. Otherwise false.
     */
    _moveRowWithoutZeroAtCurrentPosition(rowPos, columnPos){
        let numMoves = 0;
        while(this.value[rowPos][columnPos].equalsValue(0) && numMoves < this.rows-rowPos-1){
            this._moveRow(rowPos, this.rows-1);
            numMoves++;
        }
        return !this.value[rowPos][columnPos].equalsValue(0);
    }

    /**
     * Internal method that solves the current matrix as an homogeneous equation system.
     *
     * Note that this method modifies the current matrix object.
     *
     * @returns {{trivialSolution: Vector, vectorSolution: [Vector], rowReducedMatrix: Matrix}}
     * */
    _internalSolveHomogeneousEquationSystem(){
        const zeroNumber = Helper.parseValueToFittingNumberObject(this.field, 0);
        const oneNumber = Helper.parseValueToFittingNumberObject(this.field, 1);

        const solution = {
            trivialSolution: new Vector(this.field, null, this.columns),
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
     * Internal method that switches two rows with each other in the matrix.
     *
     * Note that this method modifies the current matrix object.
     *
     * @param {number} rowPos1
     * @param {number} rowPos2
     */
    _switchRows(rowPos1, rowPos2) {
        const row1 = this.value[rowPos1];
        const row2 = this.value.splice(rowPos2, 1, row1)[0];
        this.value.splice(rowPos1, 1, row2);
    }

    /**
     * Internal method that calculates the determinant of the current matrix.
     *
     * Note that this method modifies the current matrix object.
     *
     * @returns {GeneralNumber}
     * */
    _internalGetDeterminant(){
        // Define one and zero for the current field
        const { one, zero } = this._getOneAndZeroInField();

        // Check if matrix is a square matrix
        if(this.rows != this.columns) {
            throw Exceptions.DeterminantNotASquareMatrixException;
        }

        const n = this.rows;
        let evenSwaps = true;

        // convert the matrix to a upper-triangular matrix
        for (let column = 0; column < n - 1; column++) {
            // check if the current diagonal element is zero
            if (this.value[column][column].equalsValue(0)) {
                // get the first lower row with a non-zero element in the current column
                let pivotRow = -1;
                for (let row = column; row < n; row++) {
                    if (!this.value[row][column].equalsValue(0)) {
                        pivotRow = row;
                        break;
                    }
                }

                // there is no row with a non-zero element → determinant is zero
                if (pivotRow == -1) {
                    return zero;
                }

                evenSwaps = !evenSwaps;
                this._switchRows(column, pivotRow);
            }

            // eliminate elements in the current column of the lower rows
            const multInverse = this.value[column][column].getMultiplicativeInverse();
            for (let row = column + 1; row < n; row++) {
                const factor = this.value[row][column].getAdditiveInverse().multiplyWith(multInverse);
                this._addRowToOther(column, row, factor);
            }
        }

        // calculate the determinant by multiplying the diagonal elements
        let det = evenSwaps ? one : one.getAdditiveInverse();
        for (let i = 0; i < n; i++) {
            det = det.multiplyWith(this.value[i][i]);
        }

        return det;
    }

    /**
     * Returns an equivalent copy of the current Matrix object.
     *
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
     * Returns a new matrix object that has the same dimensions and field as the current matrix, but the
     * values are all 0.
     *
     * @returns {Matrix}
     * */
    getEmptyCopy(){
        return new Matrix(this.field, null, this.rows, this.columns);
    }


    /**
     * Creates a new Matrix object from a 2-dimensional array containing the number values
     * (not GeneralNumber, but raw primitive values) that the matrix cells should be filled with.
     *
     * @param{number} field
     * @param{[[number]]} data
     * @returns {Matrix}
     * */
    static fromRawData(field, data, ){
        const resultData = [];
        data.forEach((row) => {
            const resultRow = [];
            row.forEach((cellValue) => {
                resultRow.push(Helper.parseValueToFittingNumberObject(field, cellValue));
            });
            resultData.push(resultRow);
        });
        return new Matrix(field, resultData, 0, 0);
    }

    /**
     * Creates a new Matrix object from a string representation of that matrix in user-input-notation.
     *
     * E.g. {1,2,3;4,5,6} is a valid input for this method when field == Field.R.
     *
     * @param {number} field
     * @param {string} text
     * @returns {Matrix}
     * */
    static fromString(field, text){
        text = Helper.removeSpacesAndLineBreaks(text);
        if(!RegExp(Helper.getMatrixRegex(field)).test(text)){
            throw Exceptions.InvalidMatrixException;
        }
        text = Helper.removeCharacter(text, "{");
        text = Helper.removeCharacter(text, "}");

        const rows = text.split(";");
        const matrixData = [];

        let numColumns = 0;
        rows.forEach(rowString => {
            const rowStringValues =  rowString.split(",");
            const rowNumbers = [];
            rowStringValues.forEach(stringValue => {
                const numberValue = Helper.getNumberFromNumberString(field, stringValue);
                rowNumbers.push(numberValue);
            });
            if(numColumns > 0 && rowNumbers.length !== numColumns){
                throw Exceptions.UnequalAmountOfMatrixColumnsException;
            }
            numColumns = rowNumbers.length;
            matrixData.push(rowNumbers);
        });

        return new Matrix(field, matrixData);
    }
}
