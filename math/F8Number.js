class F8Number extends GeneralNumber{

    constructor(value) {
        super(Field.F8, value);
    }

    multiplyWithNumber(factor) {
        const resultValue = F8MultiplicationLookup
            .find(object => object.factor1 === this.value && object.factor2 === factor.value).result;
        return new F8Number(resultValue);
    }

    addNumber(summand) {
        const resultValue = F8AdditionLookup
            .find(object => object.summand1 === this.value && object.summand2 === summand.value).result;
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
        const resultValue = F8MultiplicationInverseLookup.find(object => object.number === this.value).inverse;
        return new F8Number(resultValue);
    }

    getAdditiveInverse() {
        const resultValue = F8AdditionInverseLookup.find(object => object.number === this.value).inverse;
        return new F8Number(resultValue);
    }

    toString() {
        return F8ElementsNameLookup.find(object => object.number === this.value).name;
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
            throw "Invalid number!";
        }
        return new F8Number(result);
    }
}
