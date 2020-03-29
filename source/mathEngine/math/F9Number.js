/**
 * Class for storing numbers over the F9 field with the 9 elements 0, 1, -1, j, j+1, j-1, -j, -j+1, -j-1 (j is iota).
 *
 * @author David Augustat
 * */
class F9Number extends GeneralNumber{

    /**
     * @param {number} value
     * */
    constructor(value) {
        super(Field.F9, value);
    }

    /**
     * @param {F9Number} factor
     * @returns {F9Number}
     * */
    _multiplyWithNumber(factor) {
        const resultValue = F9MultiplicationLookup
            .find(object => object.factor1 === this.value && object.factor2 === factor.value).result;
        return new F9Number(resultValue);
    }

    /**
     * @param {F9Number} summand
     * @returns {F9Number}
     * */
    _addNumber(summand) {
        const resultValue = F9AdditionLookup
            .find(object => object.summand1 === this.value && object.summand2 === summand.value).result;
        return new F9Number(resultValue);
    }

    /**
     * @param {F9Number} subtrahend
     * @return {F9Number}
     * */
    _subtractNumber(subtrahend) {
        return this._addNumber(subtrahend.getAdditiveInverse());
    }

    /**
     * @param {F9Number} divisor
     * @returns {F9Number}
     * */
    _divideByNumber(divisor) {
        return this._multiplyWithNumber(divisor.getMultiplicativeInverse());
    }

    /**
     * Retrieves the multiplicative inverse from a lookup table.
     *
     * @returns {F9Number}
     * */
    getMultiplicativeInverse() {
        const resultValue = F9MultiplicationInverseLookup.find(object => object.number === this.value).inverse;
        return new F9Number(resultValue);
    }

    /**
     * Retrieves the additive inverse from a lookup table.
     *
     * @returns {F9Number}
     * */
    getAdditiveInverse() {
        const resultValue = F9AdditionInverseLookup.find(object => object.number === this.value).inverse;
        return new F9Number(resultValue);
    }

    /**
     * Retrieves the corresponding string value from a lookup table.
     *
     * @returns {string}
     * */
    toString() {
        return F9ElementsNameLookup.find(object => object.number === this.value).name;
    }

    /**
     * Retrieves the corresponding user input string value from a lookup table.
     *
     * @returns {string}
     * */
    toUserInputString() {
        return F9ElementsUserInputLookup.find(object => object.number === this.value).inputString;
    }

    /**
     * Returns an object that is identical to the current one, but not the same object.
     *
     * @returns {F9Number}
     * */
    getCopy() {
        return new F9Number(this.value);
    }

    /**
     * Compares the input string with all allowed values. If none matches, an exception is thrown.
     *
     * @param {?number} field
     * @param {string} text
     * @returns {F9Number}
     * */
    static fromString(field, text){
        let result;
        if(text === "0"){
            result = Field.F9Zero;
        } else if(text === "1"){
            result = Field.F9One;
        } else if(text === "-1"){
            result = Field.F9MinusOne;
        } else if(text === "j"){
            result = Field.F9Iota;
        } else if(text === "-j"){
            result = Field.F9MinusIota;
        } else if(["j+1", "1+j"].includes(text)){
            result = Field.F9IotaPlusOne;
        } else if(["j-1", "-1+j"].includes(text)){
            result = Field.F9IotaMinusOne;
        } else if(["-j+1", "1-j"].includes(text)){
            result = Field.F9MinusIotaPlusOne;
        } else if(["-j-1", "-1-j"].includes(text)){
            result = Field.F9MinusIotaMinusOne;
        } else{
            throw Exceptions.InvalidNumberException;
        }
        return new F9Number(result);
    }
}
