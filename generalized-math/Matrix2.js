/**
 A class that can store and manipulate a mathematical matrix over several fields.

 @author David Augustat
 */

class Matrix2 extends MathElement{


    /** @type {[[number]]} */
    data;

    /** @type {number} */
    rows;

    /** @type {number} */
    columns;

    /** @type {Field} */
    field;

    /** @type {[number]} */
    nonStepColumns;

    /**
     * @param {number} field
     * @param {[[number]]} value
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

    set value(value) {
        this._value = value;
        this.rows = value.length;
        this.columns = value[0].length;
    }


    transpose(){
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
     * @returns {[number]}
     * */
    getRow(position){
        return this.value[position]
    }

    /**
     * @returns {[number]}
     * */
    getColumn(position){
        const column = new Array();
        this.value.forEach((row) => {
            column.push(row[position]);
        });
        return column;
    }

    /**
     * @returns {number}
     * */
    getValue(rowPos, columnPos){
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
            row.forEach((value) => {
                output += this.field.getString(value) + "\t";
            });
            output += "\n";
        });
        console.log(output);
    }

    toString(){
        let output = "";
        this.value.forEach((row) => {
            row.forEach((value) => {
                output += this.field.getString(value) + "\t";
            });
            output += "\n";
        });
        return output;
    }

    /**
     * @param {boolean} isDisplayMode
     * @returns {string}
     * */
    toLatex(){
        let output = "\\begin{pmatrix}";
        this.value.forEach((row) => {
            row.forEach((value, index, array) => {
                if(index < array.length-1) {
                    output += this.field.getString(value) + " & ";
                } else{
                    output += this.field.getString(value);
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
     * @param {number} value
     * */
    set(rowPos, columnPos, value){
        this.value[rowPos][columnPos] = value;
    }

    /**
     * @param {number} rowPos
     * @param {number} factor
     * */
    multiplyRow(rowPos, factor){
        const row = this.value[rowPos];
        for(let column = 0; column < this.columns; column++){
            row[column] = this.field.multiply(row[column], factor);
        }
    }

    /**
     * @param {number} sourceRowPos
     * @param {number} targetRowPos
     * @param {number} factor
     * */
    addRowToOther(sourceRowPos, targetRowPos, factor){
        for(let column = 0; column < this.columns; column++){
            this.value[targetRowPos][column] = this.field.add(this.value[targetRowPos][column], this.field.multiply( this.value[sourceRowPos][column], factor));
        }
    }

    /**
     * @param {number} rowPos
     * @param {number} columnPos
     */
    reduceColumn(rowPos, columnPos){
        const factor = this.field.getMultiplicationInverse(this.value[rowPos][columnPos]);
        this.multiplyRow(rowPos, factor);

        for(let row = 0; row<this.rows; row++){
            if(row != rowPos){
                // var rowFactor = -this.value[row][columnPos];
                const rowFactor = this.field.getAdditionInverse(this.value[row][columnPos]);
                this.addRowToOther(rowPos, row, rowFactor);
            }
        }
    }

    /**
     * @param {number} rowPos
     * @param {number} targetPos
     */
    moveRow(rowPos, targetPos){
        const cutOut = this.value.splice(rowPos, 1)[0];
        this.value.splice(targetPos, 0, cutOut);
    }

    rowReduce(){
        let row = 0;
        let column = 0;
        while(row < this.rows && column < this.columns){
            if(this.value[row][column] != 0){
                this.reduceColumn(row, column);
                row++;
                column++;
            }
            else{
                const isCurrentPositionNotZero = this.moveRowWithoutZeroAtCurrentPosition(row, column);
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
    moveRowWithoutZeroAtCurrentPosition(rowPos, columnPos){
        let numMoves = 0;
        while(this.value[rowPos][columnPos] == 0 && numMoves < this.rows-rowPos-1){
            this.moveRow(rowPos, this.rows-1);
            numMoves++;
        }
        return this.value[rowPos][columnPos] != 0;
    }

    solveHomogeneousEquationSystem(){
        const solution = {
            trivialSolution: new Array(this.rows).fill(0), // Array of values
            vectorSolution: new Array(), // Array of vectors
        };

        this.rowReduce();

        this.nonStepColumns.forEach((currentNonStepColumnPos) => {
            let rowPos = 0;
            const solutionVector = new Vector(0, this.field.getName());
            for(let pos = 0; pos < this.columns; pos++){
                if(this.nonStepColumns.includes(pos)){
                    if(pos == currentNonStepColumnPos){
                        solutionVector.add(1);
                    } else{
                        solutionVector.add(0);
                    }
                } else{
                    solutionVector.add(this.field.getAdditionInverse(this.value[rowPos][currentNonStepColumnPos]));
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
        const copyMatrix2 = new Matrix2(this.rows, this.columns, this.field.getName());
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
        return new Matrix2(this.rows, this.columns, this.field.getName());
    }
    
}