import MathElement from "./MathElement";
import {Exceptions} from "../Exceptions";
import {MathElementType} from "../Constants";

/**
 * General (abstract) class for storing a number over a field.
 *
 * Known subtypes of this class are RealNumber, PrimeFieldNumber, F4Number, F8Number and F9Number
 *
 * Do not create objects from this class but from their subtypes.
 *
 * @author David Augustat
 * */
export default class GeneralNumber extends MathElement{

    constructor(field, value) {
        super(field, value, MathElementType.NUMBER);
    }

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
        throw Exceptions.MethodNotImplementedException;
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
        throw Exceptions.MethodNotImplementedException;
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
        throw Exceptions.AdditionOfMatrixToNumberException;
    }

    /**
     * Addition of a vector to a number is not allowed. Therefore an exception will be thrown.
     *
     * @param {Vector} summand
     * */
    _addVector(summand) {
        throw Exceptions.AdditionOfVectorToNumberException;
    }

    /**
     * Subtraction of a matrix from a number is not allowed. Therefore an exception will be thrown.
     *
     * @param {Matrix} subtrahend
     * */
    _subtractMatrix(subtrahend) {
        throw Exceptions.SubtractionOfMatrixFromNumberException;
    }

    /**
     * Subtraction of a vector from a number is not allowed. Therefore an exception will be thrown.
     *
     * @param {Vector} subtrahend
     * */
    _subtractVector(subtrahend) {
        throw Exceptions.SubtractionOfVectorFromNumberException;
    }

    /**
     * Checks if the value stored in the GeneralNumber object equals the provided value
     *
     * @param {number} value The value to compare to
     * @returns {boolean} true if the values are equal, otherwise false
     */
    equalsValue(value){
        return this.value === value;
    }
}
