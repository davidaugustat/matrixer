class GeneralNumber extends MathElement{


    /**
     * @returns {GeneralNumber}
     * */
    getMultiplicativeInverse(){
        throw "This is not implemented!";
    }

    /**
     * @returns {GeneralNumber}
     * */
    getAdditiveInverse(){
        throw "This is not implemented!";
    }

    toLatex() {
        return this.toString();
    }

    /**
     * @param {Matrix2} factor
     * @returns {Matrix2}
     * */
    multiplyWithMatrix(factor) {
        return factor.multiplyWithNumber(this);
    }

    /**
     * @param {Vector2} factor
     * @returns {Vector2}
     * */
    multiplyWithVector(factor) {
        return factor.multiplyWithNumber(this);
    }

    addMatrix(summand) {
        throw "Addition of a matrix to a number is not allowed";
    }

    addVector(summand) {
        throw "Addition of a vector to a number is not allowed";
    }

    subtractMatrix(subtrahend) {
        throw "Subtraction of a matrix from a number is not allowed";
    }

    subtractVector(subtrahend) {
        throw "Subtraction of a vector from a number is not allowed";
    }

}