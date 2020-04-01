import GeneralNumber from "./GeneralNumber";
import {Exceptions} from "../Exceptions";

/**
 * Class for storing numbers over an algebraic prime number finite field.
 *
 * Prime number finite fields are algebraic fields that have the same number of elements as a prime number.
 * E.g. F5 has 5 elements and is a prime number field because 5 is a prime number.
 *
 * Supported prime number fields are F2, F3, F5, F7, F11, F13, F17, F19.
 *
 * @author David Augustat
 * */
export default class PrimeFieldNumber  extends GeneralNumber {

    /**
     * @param {number} field The prime number finite field that should be used.
     * Non-Prime-Fields like R or F4 are not allowed here!
     * @param {number} value Can be any whole number, because it will be parsed to it's representative
     * (e.g. 13 will be stored as 3 in F5)
     * */
    constructor(field, value) {
        super(field, PrimeFieldNumber._valueToRepresentative(field, value));
    }

    /**
     * Factor must be a prime field number over the same field
     *
     * @param {PrimeFieldNumber} factor
     * @returns {PrimeFieldNumber}
     * */
    _multiplyWithNumber(factor) {
        return new PrimeFieldNumber(this.field, this.value * factor.value);
    }

    /**
     * Summand must be a prime field number over the same field
     *
     * @param {PrimeFieldNumber} summand
     * @returns {PrimeFieldNumber}
     * */
    _addNumber(summand) {
        return new PrimeFieldNumber(this.field,this.value + summand.value);
    }

    /**
     * Subtrahend must be a prime field number over the same field
     *
     * @param {PrimeFieldNumber} subtrahend
     * @returns {PrimeFieldNumber}
     * */
    _subtractNumber(subtrahend) {
        return new PrimeFieldNumber(this.field, this.value - subtrahend.value);
    }

    /**
     * Divisor must be a prime field number over the same field
     *
     * @param {PrimeFieldNumber} divisor
     * @returns {PrimeFieldNumber}
     * */
    _divideByNumber(divisor) {
        //return new PrimeFieldNumber(this.value / divisor.value);
        return new PrimeFieldNumber(this.field,this.value * divisor.getMultiplicativeInverse().value)
    }

    /**
     * Calculates the multiplicative inverse of the current PrimeFieldNumber object using the extended Euclidean algorithm.
     *
     *
     * This is done by first executing the Euclidean algorithm which finds the greatest common divisor
     * of the current value and the field number (e.g. for F5 the field number is 5). During the execution
     * all calculated multiples are stored.
     *
     * Afterwards the stored values are used to find values for a and b so that the Equation
     * value * a + fieldNumber * b = gcd(value, fieldValue) is saturated.
     *
     * See here for more details:
     * https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm#Simple_algebraic_field_extensions
     *
     * @returns {PrimeFieldNumber}
     * */
    getMultiplicativeInverse() {
        // This method uses the Extended Euclidean Algorithm:
        let multiples = [1];
        // calculate greatest common divider while storing all used multiples:
        let u1 = 0;
        let u2 = this.field;
        let u3 = this.value;

        while(u3 > 0){
            u1 = u2;
            u2 = u3;
            u3 = u1 % u2;
            multiples.push((u1-u3)/u2);
        }

        multiples = multiples.reverse();

        // use the stored multiples to find the prime field inverse
        let wPrePrevious = 0;
        let wPrevious = 0;
        let wCurrent = 1;
        for(let i = 0; i < multiples.length - 2; i++){
            wPrePrevious = wPrevious;
            wPrevious = wCurrent;
            wCurrent = wPrePrevious - multiples[i+1] * wPrevious;
        }
        return new PrimeFieldNumber(this.field, this._valueToRepresentative(wCurrent));
    }

    /**
     * Returns the additive inverse of the current prime field number.
     *
     * The additive inverse can easily be calculated by subtracting the current value from the field number.
     *
     * E.g. for F5: 5 - 4 = 1  -> 1 is the additive inverse of 4
     *
     * @returns {PrimeFieldNumber}
     * */
    getAdditiveInverse() {
        return new PrimeFieldNumber(this.field,this.field - this.value);
    }

    /**
     * @returns {string}
     * */
    toString() {
         return this.value.toString();
    }

    /**
     * @returns {string}
     * */
    toLatex() {
        return this.toString();
    }

    /**
     * @returns {string}
     * */
    toUserInputString() {
        return this.toString();
    }

    /**
     * Returns an object that is identical to the current one, but not the same object.
     *
     * @returns {PrimeFieldNumber}
     * */
    getCopy() {
        return new PrimeFieldNumber(this.field, this.value);
    }


    _valueToRepresentative(value){
        return ((value % this.field) + this.field) % this.field;
    }

    /**
     * This duplicate is necessary, because only static methods can be called as first call in constructor.
     *
     * @param {number} field;
     * @param {number} value;
     * @returns {number}
     * */
    static _valueToRepresentative(field, value){
        return ((value % field) + field) % field;
    }

    /**
     * @param {number} field
     * @param {string} text
     * @returns {PrimeFieldNumber}
     * */
    static fromString(field, text){
        const numberValue = parseInt(text);
        if(isNaN(numberValue) || numberValue !== parseFloat(text)){
            throw Exceptions.InvalidNumberException;
        }
        return new PrimeFieldNumber(field, numberValue);
    }
}
