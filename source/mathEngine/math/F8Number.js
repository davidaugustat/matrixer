import {GeneralNumber, FieldLookupTables, Field, Exceptions} from 'mathEngine/imports.js';

/**
 * Class for storing numbers over the F8 field with the 8 elements 0, 1, b, 1+b, b², 1+b², b+b², 1+b+b² (b is beta).
 *
 * @author David Augustat
 * */
export default class F8Number extends GeneralNumber{

    /**
     * @param {number} value
     * */
    constructor(value) {
        super(Field.F8, value);
    }

    /**
     * @param {F8Number} factor
     * @returns {F8Number}
     * */
    _multiplyWithNumber(factor) {
        const resultValue = FieldLookupTables.F8MultiplicationLookup
            .find(object => object.factor1 === this.value && object.factor2 === factor.value).result;
        return new F8Number(resultValue);
    }

    /**
     * @param {F8Number} summand
     * @returns {F8Number}
     * */
    _addNumber(summand) {
        const resultValue = FieldLookupTables.F8AdditionLookup
            .find(object => object.summand1 === this.value && object.summand2 === summand.value).result;
        return new F8Number(resultValue);
    }

    /**
     * @param {F8Number} subtrahend
     * @return {F8Number}
     * */
    _subtractNumber(subtrahend) {
        return this._addNumber(subtrahend.getAdditiveInverse());
    }

    /**
     * @param {F8Number} divisor
     * @returns {F8Number}
     * */
    _divideByNumber(divisor) {
        return this._multiplyWithNumber(divisor.getMultiplicativeInverse());
    }

    /**
     * Retrieves the multiplicative inverse from a lookup table.
     *
     * @returns {F8Number}
     * */
    getMultiplicativeInverse() {
        const resultValue = FieldLookupTables.F8MultiplicationInverseLookup
            .find(object => object.number === this.value).inverse;
        return new F8Number(resultValue);
    }

    /**
     * Retrieves the additive inverse from a lookup table.
     *
     * @returns {F8Number}
     * */
    getAdditiveInverse() {
        const resultValue = FieldLookupTables.F8AdditionInverseLookup
            .find(object => object.number === this.value).inverse;
        return new F8Number(resultValue);
    }

    /**
     * Retrieves the corresponding string value from a lookup table.
     *
     * @returns {string}
     * */
    toString() {
        return FieldLookupTables.F8ElementsNameLookup.find(object => object.number === this.value).name;
    }

    /**
     * Retrieves the corresponding user input string value from a lookup table.
     *
     * @returns {string}
     * */
    toUserInputString() {
        return FieldLookupTables.F8ElementsUserInputLookup
            .find(object => object.number === this.value).inputString;
    }

    /**
     * Returns an object that is identical to the current one, but not the same object.
     *
     * @returns {F8Number}
     * */
    getCopy() {
        return new F8Number(this.value);
    }

    /**
     * Compares the input string with all allowed values. If none matches, an exception is thrown.
     *
     * @param {?number} field
     * @param {string} text
     * @returns {F8Number}
     * */
    static fromString(field, text){
        let result;
        if(text === "0"){
            result = Field.F8Zero;
        } else if(text === "1"){
            result = Field.F8One;
        } else if(text === "b"){
            result = Field.F8Beta;
        } else if(text === "bs"){
            result = Field.F8BetaSquare;
        } else if(["1+b", "b+1"].includes(text)){
            result = Field.F8OnePlusBeta;
        } else if(["1+bs", "bs+1"].includes(text)){
            result = Field.F8OnePlusBetaSquare;
        } else if(["b+bs", "bs+b"].includes(text)){
            result = Field.F8BetaPlusBetaSquare;
        } else if(["1+b+bs", "1+bs+b", "b+1+bs", "b+bs+1", "bs+1+b", "bs+b+1"].includes(text)){
            result = Field.F8OnePlusBetaPlusBetaSquare;
        } else{
            throw Exceptions.InvalidNumberException;
        }
        return new F8Number(result);
    }
}
