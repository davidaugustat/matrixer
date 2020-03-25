/**
 A class that can store and manipulate a mathematical matrix over several fields.

 @author David Augustat
 */

class Matrix{
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
     * @param {number} rows
     * @param {number} columns
     * @param {number} fieldName
     * */
    constructor(rows = 0, columns = 0, fieldName = Field.R){
        this.rows = rows;
        this.columns = columns;
        this.data = new Array(rows).fill(0).map(() => new Array(columns).fill(0));
        this.nonStepColumns = new Array();
        this.field = new Field(fieldName);
    }

    /**
     * @param {[[number]]} data
     * */
    setData(data){
        this.data = data;
        this.rows = data.length;
        this.columns = data[0].length;
    }

    /**
     * @returns {[[number]]}
     * */
    getData(){
        return this.data;
    }

    transpose(){
        const transposed = new Array(this.columns).fill(0).map(() => new Array(this.rows).fill(0));
        for(let row = 0; row<this.rows; row++){
            for(let column = 0; column <this.columns; column++){
                transposed[column][row] = this.data[row][column];
            }
        }
        this.data = transposed;
        [this.rows, this.columns] = [this.columns, this.rows];
    }

    /**
     * @returns {[number]}
     * */
    getRow(position){
        return this.data[position]
    }

    /**
     * @returns {[number]}
     * */
    getColumn(position){
        const column = new Array();
        this.data.forEach((row) => {
            column.push(row[position]);
        });
        return column;
    }

    /**
     * @returns {number}
     * */
    getValue(rowPos, columnPos){
        return this.data[rowPos][columnPos];
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
        this.data.forEach((row) => {
            row.forEach((value) => {
                output += this.field.getString(value) + "\t";
            });
            output += "\n";
        });
        console.log(output);
    }

    /**
     * @param {boolean} isDisplayMode
     * @returns {string}
     * */
    getLatex(isDisplayMode=false){
        let output = "";

        if(isDisplayMode){
            output += "\\[";
        } else{
            output += "\\(";
        }

        output += "\\begin{pmatrix}";
        this.data.forEach((row) => {
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

        if(isDisplayMode){
            output += "\\]";
        } else{
            output += "\\)";
        }

        return output;
    }

    /**
     * @param {number} rowPos
     * @param {number} columnPos
     * @param {number} value
     * */
    set(rowPos, columnPos, value){
        this.data[rowPos][columnPos] = value;
    }

    /**
     * @param {number} rowPos
     * @param {number} factor
     * */
    multiplyRow(rowPos, factor){
        const row = this.data[rowPos];
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
            this.data[targetRowPos][column] = this.field.add(this.data[targetRowPos][column], this.field.multiply( this.data[sourceRowPos][column], factor));
        }
    }

    /**
     * @param {number} rowPos
     * @param {number} columnPos
     */
    reduceColumn(rowPos, columnPos){
        const factor = this.field.getMultiplicationInverse(this.data[rowPos][columnPos]);
        this.multiplyRow(rowPos, factor);

        for(let row = 0; row<this.rows; row++){
            if(row != rowPos){
                // var rowFactor = -this.data[row][columnPos];
                const rowFactor = this.field.getAdditionInverse(this.data[row][columnPos]);
                this.addRowToOther(rowPos, row, rowFactor);
            }
        }
    }

    /**
     * @param {number} rowPos
     * @param {number} targetPos
     */
    moveRow(rowPos, targetPos){
        const cutOut = this.data.splice(rowPos, 1)[0];
        this.data.splice(targetPos, 0, cutOut);
    }

    rowReduce(){
        let row = 0;
        let column = 0;
        while(row < this.rows && column < this.columns){
            if(this.data[row][column] != 0){
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
        while(this.data[rowPos][columnPos] == 0 && numMoves < this.rows-rowPos-1){
            this.moveRow(rowPos, this.rows-1);
            numMoves++;
        }
        return this.data[rowPos][columnPos] != 0;
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
                    solutionVector.add(this.field.getAdditionInverse(this.data[rowPos][currentNonStepColumnPos]));
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
        const copyMatrix = new Matrix(this.rows, this.columns, this.field.getName());
        for(let rowPos = 0; rowPos < this.rows; rowPos++){
            for(let columnPos = 0; columnPos < this.columns; columnPos++){
                copyMatrix.set(rowPos, columnPos, this.data[rowPos][columnPos]);
            }
        }
        return copyMatrix;
    }

    /**
     * @returns {Matrix}
    * */
    getEmptyCopy(){
        return new Matrix(this.rows, this.columns, this.field.getName());
    }

}