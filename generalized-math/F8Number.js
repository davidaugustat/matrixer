class F8Number extends GeneralNumber{

    constructor(value) {
        super(Field.F8, value);
    }

    multiplyWithNumber(factor) {
        const resultValue = F8MultiplicationLookup
            .find(object => object.factor1 == this.value && object.factor2 == factor.value).result;
        return new F8Number(resultValue);
    }

    addNumber(summand) {
        const resultValue = F8AdditionLookup
            .find(object => object.summand1 == this.value && object.summand2 == summand.value).result;
        return new F8Number(resultValue);
    }

    /**
     * @param {F8Number} subtrahend
     * @return {F8Number}
     * */
    subtractNumber(subtrahend) {
        return this.addNumber(subtrahend.getAdditiveInverse());
    }

    /**
     * @param {F8Number} divisor
     * @returns {F8Number}
     * */
    divideByNumber(divisor) {
        return this.multiplyWithNumber(divisor.getMultiplicativeInverse());
    }

    getMultiplicativeInverse() {
        const resultValue = F8MultiplicationInverseLookup.find(object => object.number == this.value).inverse;
        return new F8Number(resultValue);
    }

    getAdditiveInverse() {
        const resultValue = F8AdditionInverseLookup.find(object => object.number == this.value).inverse;
        return new F8Number(resultValue);
    }

    toString() {
        return F8ElementsNameLookup.find(object => object.number == this.value).name;
    }
}