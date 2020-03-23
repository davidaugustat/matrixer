class RealNumber extends GeneralNumber{

    constructor(value) {
        super(Field.R, value);
    }

    multiplyWithNumber(factor) {
        return new RealNumber(this.value * factor.value);
    }

    addNumber(summand) {
        return new RealNumber(this.value + summand.value);
    }

    subtractNumber(subtrahend) {
        return new RealNumber(this.value - subtrahend.value);
    }

    divideByNumber(divisor) {
        return new RealNumber(this.value / divisor.value);
    }

    getMultiplicativeInverse() {
        if(this.value === 0){
            throw "Division by 0 not allowed!";
        }
        return new RealNumber(1/this.value);
    }

    getAdditiveInverse() {
        return new RealNumber(preventNegativeZero(-this.value));
    }

    toString() {
        return this.value.toString();
    }
}