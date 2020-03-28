/**
 * Class for storing and manipulating a mathematical vector over an algebraic field.
 *
 * @author David Augustat
 * */
class Vector extends MathElement{
    /** @type {number} */
    size;

    /**
     * @param {number} field
     * @param {[GeneralNumber]} value
     * @param {number} size
     * */
    constructor(field=Field.R, value, size=0){
        super(field, value);
        if(value !== null){
            this.value = value;
        } else{
            this.value = new Array(size).fill(parseValueToFittingNumberObject(field, 0));
            this.size = size;
        }
    }

    /**
     * Sets all row values in the vector as an array.
     *
     * @param {[GeneralNumber]} value
     * */
    set value(value){
        this._value = value;
        this.size = value.length;
    }

    /**
     * Returns all row values in the vector as an array.
     *
     * @returns {[GeneralNumber]}
     * */
    get value(){
        return this._value;
    }

    /**
     * Returns the value of the given row position.
     *
     * @returns {GeneralNumber}
     * */
    getRow(rowPos){
        return this.value[rowPos];
    }

    /**
     * Sets the provided value at the given row position
     *
     * @param {number} rowPos
     * @param {GeneralNumber} value
     * */
    set(rowPos, value){
        this.value[rowPos] = value;
    }

    /**
     * Returns the number of rows in the current vector.
     *
     * @returns {number}
     * */
    getSize(){
        return this.size;
    }

    /**
     * Returns a Matrix object that is equivalent to the current vector.
     *
     * The matrix has 1 column and as many rows as the vector has.
     *
     * @returns {Matrix}
     * */
    toMatrix(){
        const matrix = new Matrix(this.field, null,1, this.size);
        matrix.value = [this.value];
        return matrix.transpose();
    }

    /**
     * Adds a row to the vector at the bottommost position. The vector size will increase by this.
     *
     * Note that this method modifies the current vector object.
     *
     * @param {GeneralNumber} value
     * */
    addRow(value){
        this.value.push(value);
        this.size = this.value.length;
    }

    /**
     * Prints a string representation of the current vector to the console.
     * */
    print(){
        let output = "";
        this.value.forEach((rowElement) => {
            output += rowElement.toString() + "\n";
        });
        console.log(output);
    }

    /**
     * Multiplies all values in the vector with a constant.
     * This will not modify the current vector but only a copy of it.
     *
     * @param {GeneralNumber} factor
     * @returns {Vector}
     * */
    _multiplyWithNumber(factor) {
        const resultValue = this.value.map(number => number.multiplyWith(factor));
        return new Vector(this.field, resultValue, 0);
    }

    /**
     * The multiplication of a vector by a matrix is mathematically not possible.
     * Therefore an exception will be thrown.
     *
     * Note that the other way around (Matrix * Vector) is allowed.
     *
     * @param {Matrix} factor
     * */
    _multiplyWithMatrix(factor) {
        throw MultiplicationOfVectorByMatrixException;
    }

    /**
     * Multiplies the current vector with another vector.
     *
     * This is done by multiplying each row of the first vector by the according row of the second vector and
     * then adding all multiplied rows together. The result will be a number.
     *
     * Note that this is only possible, if both vectors have the same size. If they don't, an exception will
     * be thrown.
     *
     * @param {Vector} factor
     * @returns {GeneralNumber}
     * */
    _multiplyWithVector(factor) {
        if(this.size !== factor.size){
            throw "Both vectors must have same dimensions for multiplication";
        }

        let result = parseValueToFittingNumberObject(this.field, 0);
        for(let rowPos = 0; rowPos < this.size; rowPos++){
            result = result.add(this.getRow(rowPos).multiplyWith(factor.getRow(rowPos)));
        }
        return result;
    }

    /**
     * Adding a number to a vector is mathematically not possible. Therefore an exception will be thrown.
     *
     * @param {GeneralNumber} summand
     * */
    _addNumber(summand) {
        throw "Addition of numbers to a vector is not allowed";
    }

    /**
     * Adding a matrix to a vector is mathematically not possible. Therefore an exception will be thrown.
     *
     * @param {Matrix} summand
     * */
    _addMatrix(summand) {
        throw "Addition of matrices to a vector is not allowed";
    }

    /**
     * Adds one vector to another one by adding the rows accordingly. The result will be a vector of same size.
     *
     * Note that this is only possible, if both vectors have the same size. If they don't, an exception will
     * be thrown.
     *
     * @param {Vector} summand
     * @return {Vector}
     * */
    _addVector(summand) {
        if(summand.size !== this.size){
            throw "Both vectors must have same dimensions for addition";
        }

        let result = new Vector(this.field, null, 0);
        for(let rowPos = 0; rowPos < this.size; rowPos++){
            result.addRow(this.value[rowPos].add(summand.value[rowPos]));
        }
        return result;
    }

    /**
     * Subtracting a number from a vector is mathematically not possible. Therefore an exception will be thrown.
     *
     * @param {GeneralNumber} subtrahend
     * */
    _subtractNumber(subtrahend) {
        throw "Subtraction of numbers from a vector is not allowed";
    }

    /**
     * Subtracting a matrix from a vector is mathematically not possible. Therefore an exception will be thrown.
     *
     * @param {Matrix} subtrahend
     * */
    _subtractMatrix(subtrahend) {
        throw "Subtraction of matrices from a vector is not allowed";
    }

    /**
     * Subtracts a vector from another one. The result will be a vector of same size.
     *
     * Note that this is only possible, if both vectors have the same size. If they don't, an exception will
     * be thrown.
     *
     * @param {Vector} subtrahend
     * @return {Vector}
     * */
    _subtractVector(subtrahend) {
        const summand2Value = subtrahend.value.map(number => number.getAdditiveInverse());
        return this._addVector(new Vector(subtrahend.field, summand2Value));
    }

    /**
     * Returns a human-readable string representation of the vector.
     *
     * @returns {string}
     * */
    toString() {
        let output = "";
        this.value.forEach((rowElement) => {
            output += rowElement.toString() + "\n";
        });
        return output;
    }

    /**
     * Returns a Latex representation of the vector.
     *
     * @returns {string}
     * */
    toLatex() {
        let output = "\\begin{pmatrix}";
        this.value.forEach(number => {
            output += number.toLatex() + "\\\\";
        });
        output += "\\end{pmatrix}";
        return output;
    }

    /**
     * Returns a string representation of the vector that can be used as an input for the Interpreter.
     *
     * @returns {string}
     * */
    toUserInputString() {
        let output = "[";
        this.value.forEach((number, index, array) => {
            if(index < this.value.length-1) {
                output += number.toUserInputString() + ", ";
            } else{
                output += number.toUserInputString();
            }
        });
        output += "]";
        return output;
    }

    /**
     * Returns an equivalent copy of the current Vector object.
     *
     * @returns {Vector}
     * */
    getCopy() {
        const resultValue = this.value.map(value => value.getCopy());
        return new Vector(this.field, resultValue);
    }

    /**
     * Creates a new Vector object from an array containing the number values
     * (not GeneralNumber, but raw primitive values) that the vector rows should be filled with.
     *
     * @param {number} field
     * @param {[number]} data
     * @returns {Vector}
     * */
    static fromRawData(field, data){
        const resultData = data.map(number => parseValueToFittingNumberObject(field, number));
        return new Vector(field, resultData);
    }

    /**
     * Creates a new Vector object from a string representation of that vector in user-input-notation.
     *
     * E.g. [1,2,3,4] is a valid input for this method when field == Field.R
     *
     * @param {string} text
     * @param {number} field
     * @returns {Vector}
     * */
    static fromString(field, text){
        text = removeSpacesAndLineBreaks(text);
        if(!RegExp(getVectorRegex(field)).test(text)){
            throw "Not a valid input!";
        }
        text = removeCharacter(text, "[");
        text = removeCharacter(text, "]");

        const rows = text.split(",");
        const vectorValues = rows.map(elementString => getNumberFromNumberString(field, elementString));
        return new Vector(field, vectorValues);
    }
}
