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
     * @param {[GeneralNumber]} value
     * */
    set value(value){
        this._value = value;
        this.size = value.length;
    }

    /**
     * @returns {[GeneralNumber]}
     * */
    get value(){
        return this._value;
    }

    /**
     * @returns {GeneralNumber}
     * */
    getRow(rowPos){
        return this.value[rowPos];
    }

    /**
     * @param {number} rowPos
     * @param {GeneralNumber} value
     * */
    set(rowPos, value){
        this.value[rowPos] = value;
    }

    /**
     * @returns {number}
     * */
    getSize(){
        return this.size;
    }

    /**
     * @returns {Matrix2}
     * */
    toMatrix(){
        const matrix = new Matrix(this.field, null,1, this.size);
        matrix.setData(this.value);
        return matrix.transpose();
    }

    /**
     * @param {GeneralNumber} value
     * */
    addRow(value){
        this.value.push(value);
        this.size = this.value.length;
    }

    print(){
        let output = "";
        this.value.forEach((rowElement) => {
            output += rowElement.toString() + "\n";
        });
        console.log(output);
    }

    /**
     * @param {GeneralNumber} factor
     * @returns {Vector}
     * */
    multiplyWithNumber(factor) {
        const resultValue = this.value.map(number => number.multiplyWith(factor));
        return new Vector(this.field, resultValue, 0);
    }

    multiplyWithMatrix(factor) {
        throw "A vector cannot be multiplied with a Matrix this way around.";
    }

    /**
     * @param {Vector} factor
     * @returns {GeneralNumber}
     * */
    multiplyWithVector(factor) {
        if(this.size !== factor.size){
            throw "Both vectors must have same dimensions for multiplication";
        }

        let result = parseValueToFittingNumberObject(this.field, 0);
        for(let rowPos = 0; rowPos < this.size; rowPos++){
            result = result.add(this.getRow(rowPos).multiplyWith(factor.getRow(rowPos)));
        }
        return result;
    }

    addNumber(summand) {
        throw "Addition of numbers to a vector is not allowed";
    }

    addMatrix(summand) {
        throw "Addition of matrices to a vector is not allowed";
    }

    /**
     * @param {Vector} summand
     * @return {Vector}
     * */
    addVector(summand) {
        if(summand.size !== this.size){
            throw "Both vectors must have same dimensions for addition";
        }

        let result = new Vector(this.field, null, 0);
        for(let rowPos = 0; rowPos < this.size; rowPos++){
            result.addRow(this.value[rowPos].add(summand.value[rowPos]));
        }
        return result;
    }

    subtractNumber(subtrahend) {
        throw "Subtraction of numbers from a vector is not allowed";
    }

    subtractMatrix(subtrahend) {
        throw "Subtraction of matrices from a vector is not allowed";
    }

    /**
     * @param {Vector} subtrahend
     * */
    subtractVector(subtrahend) {
        const summand2Value = subtrahend.value.map(number => number.getAdditiveInverse());
        return this.addVector(new Vector(subtrahend.field, summand2Value));
    }

    toString() {
        let output = "";
        this.value.forEach((rowElement) => {
            output += rowElement.toString() + "\n";
        });
        return output;
    }

    toLatex() {
        let output = "\\begin{pmatrix}";
        this.value.forEach(number => {
            output += number.toLatex() + "\\\\";
        });
        output += "\\end{pmatrix}";
        return output;
    }

    getCopy() {
        const resultValue = this.value.map(value => value.getCopy());
        return new Vector(this.field, resultValue);
    }

    /**
     * @param {number} field
     * @param {[number]} data
     * @returns {Vector}
     * */
    static fromRawData(field, data){
        const resultData = data.map(number => parseValueToFittingNumberObject(field, number));
        return new Vector(field, resultData);
    }

    /**
     * @param {string} text
     * @param {number} field
     * @returns {Vector}
     * */
    static fromString(field, text){
        text = removeSpaces(text);
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