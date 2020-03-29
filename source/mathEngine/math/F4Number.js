/**
 * Class for storing numbers over the F4 field with the 4 elements 0, 1, a, a+1 (a is alpha).
 *
 * @author David Augustat
 * */
class F4Number extends GeneralNumber{

    /**
     * @param {number} value
     * */
    constructor(value) {
        super(Field.F4, value);
    }

    /**
     * @param {F4Number} factor
     * @returns {F4Number}
     * */
    _multiplyWithNumber(factor) {
        const resultValue = FieldLookupTables.F4MultiplicationLookup
            .find(object => object.factor1 === this.value && object.factor2 === factor.value).result;
        return new F4Number(resultValue);
    }

    /**
     * @param {F4Number} summand
     * @returns {F4Number}
     * */
    _addNumber(summand) {
        const resultValue = FieldLookupTables.F4AdditionLookup
            .find(object => object.summand1 === this.value && object.summand2 === summand.value).result;
        return new F4Number(resultValue);
    }

    /**
     * @param {F4Number} subtrahend
     * @return {F4Number}
     * */
    _subtractNumber(subtrahend) {
        return this._addNumber(subtrahend.getAdditiveInverse());
    }

    /**
     * @param {F4Number} divisor
     * @returns {F4Number}
     * */
    _divideByNumber(divisor) {
        return this._multiplyWithNumber(divisor.getMultiplicativeInverse());
    }

    /**
     * Retrieves the multiplicative inverse from a lookup table.
     *
     * @returns {F4Number}
     * */
    getMultiplicativeInverse() {
        const resultValue = FieldLookupTables.F4MultiplicationInverseLookup
            .find(object => object.number === this.value).inverse;
        return new F4Number(resultValue);
    }

    /**
     * Retrieves the additive inverse from a lookup table.
     *
     * @returns {F4Number}
     * */
    getAdditiveInverse() {
        const resultValue = FieldLookupTables.F4AdditionInverseLookup
            .find(object => object.number === this.value).inverse;
        return new F4Number(resultValue);
    }

    /**
     * Retrieves the corresponding string value from a lookup table.
     *
     * @returns {string}
     * */
    toString() {
        return FieldLookupTables.F4ElementsNameLookup.find(object => object.number === this.value).name;
    }

    /**
     * Retrieves the corresponding user input string value from a lookup table.
     *
     * @returns {string}
     * */
    toUserInputString() {
        return FieldLookupTables.F4ElementsUserInputLookup
            .find(object => object.number === this.value).inputString;
    }

    /**
     * Returns an object that is identical to the current one, but not the same object.
     *
     * @returns {F4Number}
     * */
    getCopy() {
        return new F4Number(this.value);
    }

    /**
     * Compares the input string with all allowed values. If none matches, an exception is thrown.
     *
     * @param {?number} field
     * @param {string} text
     * @returns {F4Number}
     * */
    static fromString(field, text){
        let result;
        if(text === "0"){
            result = Field.F4Zero;
        } else if(text === "1"){
            result = Field.F4One;
        } else if(text === "a"){
            result =  Field.F4Alpha;
        } else if(["a+1", "1+a"].includes(text)){
            result = Field.F4AlphaPlusOne;
        } else{
            throw Exceptions.InvalidNumberException;
        }
        return new F4Number(result);
    }
}
