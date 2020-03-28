/**
 * General (abstract) class for storing a number over a field.
 *
 * Known subtypes of this class are RealNumber, PrimeFieldNumber, F4Number, F8Number and F9Number
 *
 * Do not create objects from this class but from their subtypes.
 *
 * @author David Augustat
 * */
class GeneralNumber extends MathElement{


    /**
     * Calculates and returns a GeneralNumber containing the multiplicative inverse of the value in the current
     * GeneralNumber object.
     *
     * The multiplicative inverse y for a number x is defined as x * y = 1
     *
     * E.g. getMultiplicativeInverse(new RealNumber(5)).value would return 0.5
     *
     * @returns {GeneralNumber}
     * */
    getMultiplicativeInverse(){
        throw "This is not implemented!";
    }

    /**
     * Calculates and returns a GeneralNumber containing the additive inverse of the value in the current
     * GeneralNumber object.
     *
     * The additive inverse y for a number x is defined as x + y = 0
     *
     * E.g. getAdditiveInverse(new RealNumber(5)).value would return -5
     *
     * @returns {GeneralNumber}
     * */
    getAdditiveInverse(){
        throw "This is not implemented!";
    }

    /**
     * @returns {string}
     * */
    toLatex() {
        return this.toString();
    }

    /**
     * @param {Matrix} factor
     * @returns {Matrix}
     * */
    _multiplyWithMatrix(factor) {
        return factor._multiplyWithNumber(this);
    }

    /**
     * @param {Vector} factor
     * @returns {Vector}
     * */
    _multiplyWithVector(factor) {
        return factor._multiplyWithNumber(this);
    }

    /**
     * Addition of a matrix to a number is not allowed. Therefore an exception will be thrown.
     *
     * @param {Matrix} summand
     * */
    _addMatrix(summand) {
        throw "Addition of a matrix to a number is not allowed";
    }

    /**
     * Addition of a vector to a number is not allowed. Therefore an exception will be thrown.
     *
     * @param {Vector} summand
     * */
    _addVector(summand) {
        throw "Addition of a vector to a number is not allowed";
    }

    /**
     * Subtraction of a matrix from a number is not allowed. Therefore an exception will be thrown.
     *
     * @param {Matrix} subtrahend
     * */
    _subtractMatrix(subtrahend) {
        throw "Subtraction of a matrix from a number is not allowed";
    }

    /**
     * Subtraction of a vector from a number is not allowed. Therefore an exception will be thrown.
     *
     * @param {Vector} subtrahend
     * */
    _subtractVector(subtrahend) {
        throw "Subtraction of a vector from a number is not allowed";
    }
}
