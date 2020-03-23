class PrimeFieldNumber  extends GeneralNumber {

    constructor(field, value) {
        super(field, value);
    }

    multiplyWithNumber(factor) {
        return new PrimeFieldNumber(this.value * factor.value);
    }

    addNumber(summand) {
        return new PrimeFieldNumber(this.value + summand.value);
    }

    subtractNumber(subtrahend) {
        return new PrimeFieldNumber(this.value - subtrahend.value);
    }

    divideByNumber(divisor) {
        //return new PrimeFieldNumber(this.value / divisor.value);
    }

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
        return new PrimeFieldNumber(this.field, this.parse(wCurrent));
    }

    getAdditiveInverse() {
        return new PrimeFieldNumber(this.valueToRepresentative(this.field - this.value));
    }

    toString() {
        return this.value.toString();
    }

    toLatex() {
        return toString();
    }

    valueToRepresentative(value){
        return ((value % this.field) + this.field) % this.field;
    }

}