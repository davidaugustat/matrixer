import {RealNumber, GeneralNumber, Vector, Matrix, Exceptions, Helper} from 'mathEngine/imports.js';

/**
 * General abstract class for storing a math element over an algebraic field.
 *
 * Known subtypes of this class are GeneralNumber (of which RealNumber, PrimeFieldNumber, F4Number, F8Number,
 * F9Number are subtypes), Matrix, Vector
 *
 * Do not create objects of this class but of their subtypes.
 *
 * The different available fields can be seen in Field.js
 *
 * @author David Augustat
 * */
export default class MathElement {

    /**
     * The field on which the MathElement operates
     *  @type {number}
     *  */
    _field;

    /**
     * The value that the math element holds (float value, matrix of GeneralNumber's, array of GeneralNumber's,...)
     * @type {number | [[GeneralNumber]] | [GeneralNumber]}*/
    _value;

    constructor(field, value) {
        this._field = field;
        this._value = value;
    }

    /**
     * @returns {number} The field on which the MathElement operates
     * */
    get field() {
        return this._field;
    }

    /**
     * @returns {number | [[GeneralNumber]] | [GeneralNumber]} The value that the math element holds
     * (float value, matrix of GeneralNumber's, array of GeneralNumber's,...)
     * */
    get value() {
        return this._value;
    }

    /**
     * @param {number} value The field on which the MathElement operates
     * */
    set field(value) {
        this._field = value;
    }

    /**
     * @param {number | [[GeneralNumber]] | [GeneralNumber]} value The value that the math element should contain
     * */
    set value(value) {
        this._value = value;
    }

    /**
     * Multiplies a MathElement by another MathElement.
     *
     * @param {MathElement} factor Factor to multiply the current MathElement by
     * @returns {MathElement} Result of the multiplication
     * */
    multiplyWith(factor){
        return this._doAccordingToElementType(factor, () => this._multiplyWithNumber(factor),
            () => this._multiplyWithMatrix(factor), () => this._multiplyWithVector(factor));
    }

    /**
     * Adds a MathElement to another MathElement.
     *
     * @param {MathElement} summand Summand to add to the current MathElement
     * @returns {MathElement} Result of the addition
     * */
    add(summand){
        return this._doAccordingToElementType(summand, () => this._addNumber(summand),
            () => this._addMatrix(summand), () => this._addVector(summand));
    }

    /**
     *  Subtracts a MathElement from another MathElement.
     *
     * @param {MathElement} subtrahend Subtrahend to subtract from the current MathElement
     * @returns {MathElement} result of the division
     * */
    subtract(subtrahend){
        return this._doAccordingToElementType(subtrahend, () => this._subtractNumber(subtrahend),
            () => this._subtractMatrix(subtrahend), () => this._subtractVector(subtrahend));
    }

    /**
     * Divides a MathElement by another MathElement.
     *
     * Note that division cannot be applied on matrices and vectors!
     *
     * @param {MathElement} divisor Divisor to divide the current MathElement by
     * @returns {MathElement} result of the division
     * */
    divideBy(divisor){
        return this._doAccordingToElementType(divisor, () => this._divideByNumber(divisor),
            () => {
            throw Exceptions.DivisionByMatrixException;
            }, () => {
            throw Exceptions.DivisionByVectorException;
        });
    }

    /**
     * Exponentiates a MathElement by a RealNumber
     *
     * @param {RealNumber} exponent This must be an integer >=0. Note that it must be a real number regardless of the current field.
     * Exception: When the base is a RealNumber, the exponent can be any real number (also negative, float,...)
     * @returns {MathElement} result of the exponentiation
     * */
    exponentiate(exponent){
        if(!exponent instanceof RealNumber ||exponent.value < 0 || !Helper.numberIsInteger(exponent.value)){
            throw Exceptions.InvalidExponentException;
        }

        let result = Helper.parseValueToFittingNumberObject(this.field, 1);
        for(let i = 0; i < exponent.value; i++){
            result = result.multiplyWith(this);
        }
        return result;
    }


    /**
     * Returns a human-readable string containing the MathElement's value
     *
     * @returns {string}
     * */
    toString(){
        throw Exceptions.MethodNotImplementedException;
    }

    /**
     * Returns LaTeX representation of the MathElement's value.
     * Note that Latex math mode tags '\\(' and '\\)' or '\\[' and '\\]' are NOT included in this string
     * to allow concatenation with other Latex string representations.
     *
     * @returns {string}
     * */
    toLatex(){
        throw Exceptions.MethodNotImplementedException;
    }

    /**
     * Returns a string representation of the MathElement's value that can be used as an input for the Interpreter.
     * The string does NOT contain any special characters like greek letters.
     *
     * E.g. a MathElement containing Field.F4AlphaPlusOne returns "a+1".
     *
     * @returns {string}
     * */
    toUserInputString(){
        throw Exceptions.MethodNotImplementedException;
    }

    /**
     * Returns an equivalent MathElement object that is a copy of the current object
     *
     * @returns {MathElement}
     * */
    getCopy(){
        throw Exceptions.MethodNotImplementedException;
    }

    /**
     * Generates an equivalent MathElement from a string representation in user-input-notation
     *
     * Note: This must be called on the desired subtype of MathElement! The type (number, matrix, vector)
     * is NOT automatically detected.
     *
     * @param {number} field
     * @param {string} text
     * @returns {MathElement}
     * */
    static fromString(field, text){
        throw Exceptions.MethodNotImplementedException;
    }


    // internal functions that need to be overridden in subtypes:
    // Following functions are not intended to be used as public methods:

    /**
     * @param {MathElement} factor
     * @returns {MathElement}
     * */
    _multiplyWithNumber(factor){
        throw Exceptions.MethodNotImplementedException;
    }

    /**
     * @param {MathElement} factor
     * @returns {MathElement}
     * */
    _multiplyWithMatrix(factor){
        throw Exceptions.MethodNotImplementedException;
    }

    /**
     * @param {MathElement} factor
     * @returns {MathElement}
     * */
    _multiplyWithVector(factor){
        throw Exceptions.MethodNotImplementedException;
    }

    /**
     * @param {MathElement} summand
     * @returns {MathElement}
     * */
    _addNumber(summand){
        throw Exceptions.MethodNotImplementedException;
    }

    /**
     * @param {MathElement} summand
     * @returns {MathElement}
     * */
    _addMatrix(summand){
        throw Exceptions.MethodNotImplementedException;
    }

    /**
     * @param {MathElement} summand
     * @returns {MathElement}
     * */
    _addVector(summand){
        throw Exceptions.MethodNotImplementedException;
    } 
    
    /**
     * @param {MathElement} subtrahend
     * @returns {MathElement}
     * */
    _subtractNumber(subtrahend){
        throw Exceptions.MethodNotImplementedException;
    }

    /**
     * @param {MathElement} subtrahend
     * @returns {MathElement}
     * */
    _subtractMatrix(subtrahend){
        throw Exceptions.MethodNotImplementedException;
    }

    /**
     * @param {MathElement} subtrahend
     * @returns {MathElement}
     * */
    _subtractVector(subtrahend){
        throw Exceptions.MethodNotImplementedException;
    }

    /**
     * @param {MathElement} divisor
     * @returns {MathElement}
     * */
    _divideByNumber(divisor){
        throw Exceptions.MethodNotImplementedException;
    }

    /**
     * @param {MathElement} element
     * @param {function(MathElement): MathElement} numberBehavior
     * @param {function(MathElement): MathElement} matrixBehavior
     * @param {function(MathElement): MathElement} vectorBehavior
     * @returns {MathElement}
     * */
    _doAccordingToElementType(element, numberBehavior, matrixBehavior, vectorBehavior){
        if(element instanceof GeneralNumber){
            return numberBehavior(element);
        } else if(element instanceof Matrix){
            return matrixBehavior(element);
        } else if(element instanceof Vector){
            return vectorBehavior(element);
        }
    }
}
