import GeneralNumber from "./GeneralNumber";
import {Exceptions} from "../Exceptions";
import Helper from "../Helper";
import Field from "./Field";

/**
 * Class for storing numbers in the real-number field.
 *
 * The real-number field is the only non-finite field supported by this tool.
 *
 * @author David Augustat
 * */
export default class RealNumber extends GeneralNumber{

    /**
     * The epsilon used as the rounding error to compare two numbers
     *
     * @type {number}
     */
    EPSILON = 1e-9;

    /**
     * @param {number} value
     * */
    constructor(value) {
        super(Field.R, value);
    }

    /**
     * @param {RealNumber} factor
     * @returns {RealNumber}
     * */
    _multiplyWithNumber(factor) {
        return new RealNumber(this.value * factor.value);
    }

    /**
     * @param {RealNumber} summand
     * @returns {RealNumber}
     * */
    _addNumber(summand) {
        return new RealNumber(this.value + summand.value);
    }

    /**
     * @param {RealNumber} subtrahend
     * @returns {RealNumber}
     * */
    _subtractNumber(subtrahend) {
        return new RealNumber(this.value - subtrahend.value);
    }

    /**
     * @param {RealNumber} divisor
     * @returns {RealNumber}
     * */
    _divideByNumber(divisor) {
        if(divisor.value === 0){
            throw Exceptions.DivisionByZeroException;
        }
        return new RealNumber(this.value / divisor.value);
    }

    /**
     * @param {RealNumber} exponent For real numbers, the exponent can be any real number. Doesn't need to be an Integer or >= 0.
     * @returns {RealNumber}
     * */
    exponentiate(exponent) {
        return new RealNumber(Math.pow(this.value, exponent.value));
    }

    /**
     * @returns {RealNumber}
     * */
    getMultiplicativeInverse() {
        if(this.value === 0){
            throw Exceptions.MultiplicativeInverseOfZeroException;
        }
        return new RealNumber(1/this.value);
    }

    /**
     * @returns {RealNumber}
     * */
    getAdditiveInverse() {
        return new RealNumber(Helper.preventNegativeZero(-this.value));
    }

    /**
     * @returns {string}
     * */
    toString() {
        return Helper.round(this.value, 4);
    }

    /**
     * @returns {string}
     * */
    toLatex() {
        return this.toString();
    }

    /**
     * Note: Number will NOT be rounded here to maximize precision when using this output as an input again.
     * Note: If the number is considered zero according to this.EPSILON, then "0" will be returned instead of the
     * exact number to avoid follow-up errors when the user re-inputs the string.
     *
     * @returns {string}
     * */
    toUserInputString() {
        if(this.equalsValue(0)){
            return "0";
        }
        return this.value.toString();
    }

    /**
     * Returns an object that is identical to the current one, but not the same object.
     *
     * @returns {RealNumber}
     * */
    getCopy() {
        return new RealNumber(this.value);
    }

    /**
     * @param {number} field
     * @param {string} text
     * @returns {RealNumber}
     * */
    static fromString(field, text){
        const numberValue = parseFloat(text);
        if(isNaN(numberValue)){
            throw Exceptions.InvalidNumberException;
        }
        return new RealNumber(numberValue);
    }

    /**
     * Checks if value equals this.value. As real numbers are stored as floating point numbers, the constant
     * this.EPSILON is used to mitigate errors due to rounding.
     *
     * @param value
     * @returns {boolean}
     */
    equalsValue(value) {
        return Math.abs(this.value - value) < this.EPSILON;
    }
}
