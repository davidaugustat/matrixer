class F4Number extends GeneralNumber{

    constructor(value) {
        super(Field.F4, value);
    }

    multiplyWithNumber(factor) {
        const resultValue = F4MultiplicationLookup
            .find(object => object.factor1 == this.value && object.factor2 == factor.value).result;
        return new F4Number(resultValue);
    }

    addNumber(summand) {
        const resultValue = F4AdditionLookup
            .find(object => object.summand1 == this.value && object.summand2 == summand.value).result;
        return new F4Number(resultValue);
    }

    /**
     * @param {F4Number} subtrahend
     * @return {F4Number}
     * */
    subtractNumber(subtrahend) {
        return this.addNumber(subtrahend.getAdditiveInverse());
    }

    /**
     * @param {F4Number} divisor
     * @returns {F4Number}
     * */
    divideByNumber(divisor) {
        return this.multiplyWithNumber(divisor.getMultiplicativeInverse());
    }

    getMultiplicativeInverse() {
        const resultValue = F4MultiplicationInverseLookup.find(object => object.number == this.value).inverse;
        return new F4Number(resultValue);
    }

    getAdditiveInverse() {
        const resultValue = F4AdditionInverseLookup.find(object => object.number == this.value).inverse;
        return new F4Number(resultValue);
    }

    toString() {
        return F4ElementsNameLookup.find(object => object.number == this.value).name;
    }

    /**
     * Returns an object that is identical to the current one, but not the same object.
     *
     * @returns {F4Number}
     * */
    getCopy() {
        return new F4Number(this.value);
    }
}