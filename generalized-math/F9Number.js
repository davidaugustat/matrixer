class F9Number extends GeneralNumber{
    constructor(value) {
        super(Field.F9, value);
    }

    multiplyWithNumber(factor) {
        const resultValue = F9MultiplicationLookup
            .find(object => object.factor1 === this.value && object.factor2 === factor.value).result;
        return new F9Number(resultValue);
    }

    addNumber(summand) {
        const resultValue = F9AdditionLookup
            .find(object => object.summand1 === this.value && object.summand2 === summand.value).result;
        return new F9Number(resultValue);
    }

    /**
     * @param {F9Number} subtrahend
     * @return {F9Number}
     * */
    subtractNumber(subtrahend) {
        return this.addNumber(subtrahend.getAdditiveInverse());
    }

    /**
     * @param {F9Number} divisor
     * @returns {F9Number}
     * */
    divideByNumber(divisor) {
        return this.multiplyWithNumber(divisor.getMultiplicativeInverse());
    }

    getMultiplicativeInverse() {
        const resultValue = F9MultiplicationInverseLookup.find(object => object.number === this.value).inverse;
        return new F9Number(resultValue);
    }

    getAdditiveInverse() {
        const resultValue = F9AdditionInverseLookup.find(object => object.number === this.value).inverse;
        return new F9Number(resultValue);
    }

    toString() {
        return F9ElementsNameLookup.find(object => object.number === this.value).name;
    }

    /**
     * Returns an object that is identical to the current one, but not the same object.
     *
     * @returns {F9Number}
     * */
    getCopy() {
        return new F9Number(this.value);
    }
}