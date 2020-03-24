/**
 A class that can store and manipulate a mathematical matrix over several fields.

 @author David Augustat
 */

class Matrix2 extends MathElement{

    /** @type {number} */
    rows;

    /** @type {number} */
    columns;

    /** @type {[number]} */
    nonStepColumns;

    /**
     * @param {number} field
     * @param {[[GeneralNumber]]} value
     * @param {number} rows
     * @param {number} columns
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

        this.nonStepColumns = new Array();
    }

    /**
     * @param {[[GeneralNumber]]} value
     * */
    set value(value) {
        this._value = value;
        this.rows = value.length;
        this.columns = value[0].length;
    }

    /**
     * @returns {[[GeneralNumber]]}
     * */
    get value(){
        return this._value;
    }

    /**
     * @param {number} position
     * @returns {[GeneralNumber]}
     * */
    getRow(position){
        return this.value[position]
    }

    /**
     * @param {number} position
     * @returns {[GeneralNumber]}
     * */
    getColumn(position){
        const column = new Array();
        this.value.forEach((row) => {
            column.push(row[position]);
        });
        return column;
    }

    /**
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
     * @returns {string}
     * */
    toLatex(){
        let output = "\\begin{pmatrix}";
        this.value.forEach((row) => {
            row.forEach((cellElement, index, array) => {
                if(index < array.length-1) {
                    output += cellElement.getLatex() + " & ";
                } else{
                    output += cellElement.getLatex();
                }
            });
            output += "\\\\";
        });
        output += "\\end{pmatrix}";
        return output;
    }

    /**
     * @param {number} rowPos
     * @param {number} columnPos
     * @param {GeneralNumber} value
     * */
    set(rowPos, columnPos, value){
        this.value[rowPos][columnPos] = value;
    }

    /**
     * @returns {Matrix2}
     * */
    transpose(){
        const copy = this.getCopy();
        copy._internalTranspose();
        return copy;
    }

    /**
     * @returns {Matrix2}
     * */
    rowReduce(){
        const copy = this.getCopy();
        copy._internalRowReduce();
        return copy;
    }

    /**
     * @returns {{trivialSolution: Vector2, vectorSolution: [Vector2], rowReducedMatrix: Matrix2}}
     * */
    solveHomogeneousEquationSystem(){
        const copy = this.getCopy();
        return copy._internalSolveHomogeneousEquationSystem();
    }

    /**
     * @param {GeneralNumber} factor
     * @returns {Matrix2}
     * */
    multiplyWithNumber(factor) {
        const result = this.getEmptyCopy();
        this.value.forEach((row, rowPos) => {
            row.forEach((cellElement, columnPos) => {
                result.getRow(rowPos)[columnPos] = cellElement.multiplyWith(factor);
            });
        });
        return result;
    }

    /**
     * @param {Matrix2} factor
     * */
    multiplyWithMatrix(factor) {
        if(this.getColumnCount() !== factor.getRowCount()){
            throw "Result of matrix multiplication not defined! (wrong dimensions)";
        }

        const result = new Matrix2(this.field, null, this.rows, factor.columns);
        console.log("Res Rows: " + result.rows + " Columns: " + result.columns);
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
     * @param {Vector2} factor
     * @returns {Vector2}
     * */
    multiplyWithVector(factor) {
       if(this.getColumnCount() !== factor.getSize()){
           throw "Result of multiplication of matrix with vector not defined! (wrong dimensions)"
       }

       const result = new Vector2(this.field, null, 0);
       for(let rowPos = 0; rowPos < this.rows; rowPos++){
           result.addRow(this._multiplyRowWithColumn(this.getRow(rowPos), factor.value))
       }
       return result;
    }

    /**
     * @param {[GeneralNumber]} row
     * @param {[GeneralNumber]} column
     * @returns {GeneralNumber}
     * */
    _multiplyRowWithColumn(row, column){
        let result = parseValueToFittingNumberObject(this.field, 0);
        for(let pos = 0; pos < row.length; pos++){
            result = result.addNumber(row[pos].multiplyWith(column[pos]));
        }
        return result;
    }

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
     * @param {number} sourceRowPos
     * @param {number} targetRowPos
     * @param {GeneralNumber} factor
     * */
    _addRowToOther(sourceRowPos, targetRowPos, factor){
        for(let column = 0; column < this.columns; column++){
            this.value[targetRowPos][column] = this.value[targetRowPos][column].add(this.value[sourceRowPos][column].multiplyWith(factor));
        }
    }

    /**
     * @param {number} rowPos
     * @param {number} columnPos
     */
    _reduceColumn(rowPos, columnPos){
        const factor = this.value[rowPos][columnPos].getMultiplicativeInverse();
        this._multiplyRow(rowPos, factor);

        for(let row = 0; row < this.rows; row++){
            if(row !== rowPos){
                // var rowFactor = -this.value[row][columnPos];
                const rowFactor = this.value[row][columnPos].getAdditiveInverse();
                this._addRowToOther(rowPos, row, rowFactor);
            }
        }
    }

    /**
     * @param {number} rowPos
     * @param {number} targetPos
     */
    _moveRow(rowPos, targetPos){
        const cutOut = this.value.splice(rowPos, 1)[0];
        this.value.splice(targetPos, 0, cutOut);
    }

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
                    this.nonStepColumns.push(column);
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
     * @returns {{trivialSolution: Vector2, vectorSolution: [Vector2], rowReducedMatrix: Matrix2}}
     * */
    _internalSolveHomogeneousEquationSystem(){
        const zeroNumber = parseValueToFittingNumberObject(this.field, 0);
        const oneNumber = parseValueToFittingNumberObject(this.field, 1);

        const solution = {
            trivialSolution: new Vector2(this.field, null, this.rows),
            vectorSolution: new Array(), // Array of vectors
            rowReducedMatrix: this
        };

        this._internalRowReduce();

        this.nonStepColumns.forEach((currentNonStepColumnPos) => {
            let rowPos = 0;
            const solutionVector = new Vector2(this.field, null, 0);
            for(let pos = 0; pos < this.columns; pos++){
                if(this.nonStepColumns.includes(pos)){
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
     * @returns {Matrix2}
     * */
    getCopy(){
        const copyMatrix2 = new Matrix2(this. field, null, this.rows, this.columns);
        for(let rowPos = 0; rowPos < this.rows; rowPos++){
            for(let columnPos = 0; columnPos < this.columns; columnPos++){
                copyMatrix2.set(rowPos, columnPos, this.value[rowPos][columnPos]);
            }
        }
        return copyMatrix2;
    }

    /**
     * @returns {Matrix2}
     * */
    getEmptyCopy(){
        return new Matrix2(this.field, null, this.rows, this.columns);
    }


    /**
     * @param{number} field
     * @param{[[number]]} data
     * @returns {Matrix2}
     * */
    static fromRawData(field, data, ){
        const resultData = new Array();
        data.forEach((row) => {
            const resultRow = new Array();
            row.forEach((cellValue) => {
                resultRow.push(parseValueToFittingNumberObject(field, cellValue));
            });
            resultData.push(resultRow);
        });
        return new Matrix2(field, resultData, 0, 0);
    }
    
}