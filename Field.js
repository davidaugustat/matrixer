class Field{
    static F2 = 2;
    static F3 = 3;
    static F4 = 4;
    static F5 = 5;
    static F7 = 7;
    static F8 = 8;
    static F9 = 9;
    static F11 = 11;
    static F13 = 13;
    static F17 = 17;
    static F19 = 19;
    static R = 100; // real numbers

    static F4Zero = 0;
    static F4One = 1;
    static F4Alpha = 2;
    static F4AlphaPlusOne = 3;

    static F8Zero = 0;
    static F8One = 1;
    static F8Beta = 2;
    static F8OnePlusBeta = 3;
    static F8BetaSquare = 4;
    static F8OnePlusBetaSquare = 5;
    static F8BetaPlusBetaSquare = 6;
    static F8OnePlusBetaPlusBetaSquare = 7;

    static F9Zero = 0;
    static F9One = 1;
    static F9MinusOne = 2;
    static F9Iota = 3;
    static F9IotaPlusOne = 4;
    static F9IotaMinusOne = 5;
    static F9MinusIota = 6;
    static F9MinusIotaPlusOne = 7;
    static F9MinusIotaMinusOne = 8;

    static F4Numbers = [Field.F4Zero, Field.F4One, Field.F4Alpha, Field.F4AlphaPlusOne];
    static F8Numbers = [Field.F8Zero, Field.F8One, Field.F8Beta, Field.F8OnePlusBeta, Field.F8BetaSquare,
        Field.F8OnePlusBetaSquare, Field.F8BetaPlusBetaSquare, Field.F8OnePlusBetaPlusBetaSquare];
    static F9Numbers = [Field.F9Zero, Field.F9One, Field.F9MinusOne, Field.F9Iota, Field.F9IotaPlusOne,
        Field.F9IotaMinusOne, Field.F9MinusIota, Field.F9MinusIotaPlusOne, Field.F9MinusIotaMinusOne, ];

    field;
    constructor(field){
        this.field = field;
    }

    isPrimeField(){
        return [Field.F2, Field.F3, Field.F5, Field.F7, Field.F11, Field.F13, Field.F17, Field.F19].includes(this.field);
    }

    isExtendedField(){
        return [Field.F4, Field.F8, Field.F9].includes(this.field);
    }

    /**
     Multiplies two numbers in a field.

     @param {number} factor1 The first multiplication factor
     @param {number} factor2 The second multiplication factor
     */
    multiply(factor1, factor2){
        if(this.isPrimeField()){
            return (factor1 * factor2) % this.field;
        } else if(this.field == Field.R){
            return factor1 * factor2;
        } else if(this.isExtendedField()){
            return this.multiplyInExtendedField(factor1, factor2);
        }
    }

    add(summand1, summand2){
        if(this.isPrimeField()){
            return this.parse(summand1 + summand2)
        } else if(this.field == Field.R){
            return summand1 + summand2;
        } else if(this.isExtendedField()){
            return this.addInExtendedField(summand1, summand2);
        }
    }

    getMultiplicationInverse(num){
        if(this.isPrimeField()){
            return this.getPrimeFieldInverse(num);
        } else if(this.field == Field.R){
            return 1 / num;
        } else if(this.isExtendedField()){
            return this.getExtendedFieldInverse(num);
        }
    }

    getAdditionInverse(num){
        if(this.isPrimeField()){
            return this.parse(this.field - num);
        } else if(this.field == Field.R){
            return -num;
        } else if(this.isExtendedField()){

        }
    }

    parse(value){
        if(this.isPrimeField()){
            return ((value % this.field) + this.field) % this.field;
        } else if(this.field == Field.R){
            return value;
        }
        throw("Extended fields are not parsable. :/");
    }

    getString(num){
        if(this.isPrimeField()){
         return this.parse(num);
        } else if(this.field === Field.R){
            return num;
        } else if(this.isExtendedField()){
            if(this.field === Field.F4){
                return F4ElementsNameLookup.find(object => object.number == num).name;
            } else if(this.field === Field.F8){
                return F8ElementsNameLookup.find(object => object.number == num).name;
            } else if(this.field === Field.F9){
                return F9ElementsNameLookup.find(object => object.number == num).name;
            }
        }
    }

    getPrimeFieldInverse(num){
        // This method uses the Extended Euclidean Algorithm:

        let multiples = [1];
        // calculate greatest common divider while storing all used multiples:
        let u1 = 0;
        let u2 = this.field;
        let u3 = num;

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
        return this.parse(wCurrent);
    }

    getExtendedFieldInverse(num){
        if(this.field === Field.F4){
            return F4MultiplicationInverseLookup.find(object => object.number == num).inverse;
        } else if(this.field === Field.F8){
            return F8MultiplicationInverseLookup.find(object => object.number == num).inverse;
        } else if(this.field === Field.F9){
            return F9MultiplicationInverseLookup.find(object => object.number == num).inverse;
        }
    }

    multiplyInExtendedField(factor1, factor2){
        switch (this.field) {
            case Field.F4:
                return F4MultiplicationLookup.find(object => object.factor1 == factor1 && object.factor2 == factor2).result;
                break;
            case Field.F8:
                return F8MultiplicationLookup.find(object => object.factor1 == factor1 && object.factor2 == factor2).result;
                break;
            case Field.F9:
                return F9MultiplicationLookup.find(object => object.factor1 == factor1 && object.factor2 == factor2).result;
                break;
        }
    }

    addInExtendedField(summand1, summand2) {
        switch (this.field) {
            case Field.F4:
                return F4AdditionLookup.find(object => object.summand1 == summand1 && object.summand2 == summand2).result;
                break;
            case Field.F8:
                return F8AdditionLookup.find(object => object.summand1 == summand1 && object.summand2 == summand2).result;
                break;
            case Field.F9:
                return F9AdditionLookup.find(object => object.summand1 == summand1 && object.summand2 == summand2).result;
                break;
        }
    }
}
