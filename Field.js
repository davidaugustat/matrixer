
/**
 * Class that represents an algebraic number field.
 *
 * Info: https://en.wikipedia.org/wiki/Algebraic_number_field
 * Available fields are the real numbers as well as several prime number fields and the extended fields F4, F8 and F9.
 *
 * @author David Augustat
 * */
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

    /**
     * @param {number} field
     * */
    constructor(field){
        this.field = field;
    }

    /**
     * Returns the name of the field, e.g. Field.F4, Field.F5, Field.R
     *
     * @returns number The name of the field
     * */
    getName(){
        return this.field;
    }

    /**
     * @returns {boolean}
     * */
    isPrimeField(){
        return [Field.F2, Field.F3, Field.F5, Field.F7, Field.F11, Field.F13, Field.F17, Field.F19].includes(this.field);
    }

    /**
     * @returns {boolean}
     * */
    isExtendedField(){
        return [Field.F4, Field.F8, Field.F9].includes(this.field);
    }

    /**
     Multiplies two numbers in a field.

     @param {number} factor1 The first multiplication factor
     @param {number} factor2 The second multiplication factor
     @returns {number}
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

    /**
     * Adds two numbers in a field.
     *
     * @param {number} summand1 The first addition summand
     * @param {number} summand2 The second addition summand
     * @returns {number}
     * */
    add(summand1, summand2){
        if(this.isPrimeField()){
            return this.parse(summand1 + summand2)
        } else if(this.field == Field.R){
            return summand1 + summand2;
        } else if(this.isExtendedField()){
            return this.addInExtendedField(summand1, summand2);
        }
    }

    /**
     * Subtracts two numbers in a field.
     *
     * This is achieved by calculating the additive inverse of the subtrahend and then adding the minuend to that inverse.
     *
     * @param {number} minuend The number before minus
     * @param {number} subtrahend The number after minus
     * @returns {number}
     * */
    subtract(minuend, subtrahend){
        const summand2 = this.getAdditionInverse(subtrahend);
        return this.add(minuend, summand2);
    }

    /**
     * Divides two numbers in a field.
     *
     * This is achieved by calculating the multiplicative inverse of the divisor and then multiplying the dividend by that inverse.
     *
     * @param {number} dividend The number before /
     * @param {number} divisor The number after /
     * @returns {number}
     * */
    divide(dividend, divisor){
        if(divisor == 0){
            throw "Division by 0 is not allowed!";
        }
        const factor2 = this.getMultiplicationInverse(divisor);
        return this.multiply(dividend, factor2);
    }

    /**
     * Exponentiates a base to an exponent.
     *
     * This is achieved by multiplying the base exponent-times by itself. If the exponent is 0, the result is 1.
     *
     * NOTE: The exponent MUST be a integer in real numbers that is >= 0. Even when the field is not R, the
     * exponent must be from R. E.g. (a+1)\^5 is allowed, but (a+1)\^a is not allowed in F4.
     *
     * @param {number} base Base of the exponentiation. This must be a number inside the given field.
     * @param {number} exponent Exponent of the exponentiation. This must be a real integer >= 0.
     * @returns {number}
     * */
    exponentiate(base, exponent){
        if(this.field == Field.R){
            return Math.pow(base, exponent);
        } else if( isPrimeField(this.field) && numberIsInteger(exponent) && exponent >= 0){
            let result = 1;
            for(let i = 0; i < exponent; i++){
                result = this.multiply(result, base);
            }
            return result;
        } else if(isExtendedField(this.field)){
            throw "Exponentiation for extended fields is not yet implemented.";
        }
        throw "In fields other than R only integer values >= 0 are allowed as exponents.";
    }



    /**
     * Returns the multiplication inverse of a number.
     *
     * The multiplication inverse of a number x is a number y for that applies x * y = 1
     *
     * @param {number} num The number to obtain the inverse of
     * @returns {number}
     * */
    getMultiplicationInverse(num){
        if(this.isPrimeField()){
            return this.getPrimeFieldMultiplicationInverse(num);
        } else if(this.field == Field.R){
            return 1 / num;
        } else if(this.isExtendedField()){
            return this.getExtendedFieldMultiplicationInverse(num);
        }
    }

    /**
     * Returns the addition inverse of a number.
     *
     * The addition inverse of a number x is a number y for that applies x + y = 0
     *
     * @param {number} num The number to obtain the inverse of
     * @returns {number}
     * */
    getAdditionInverse(num){
        if(this.isPrimeField()){
            return this.parse(this.field - num);
        } else if(this.field == Field.R){
            return this.preventNegativeZero(-num);
        } else if(this.isExtendedField()){
            return this.getExtendedFieldAdditionInverse(num);
        }
    }

    /**
     * Parses a number to it's representative in the current field.
     *
     * - In real numbers: Each number is it's own representative, e.g. parse(5) = 5
     * - In prime fields: Each number has a representative between 0 and [field order]. e.g. in F5 parse(14) = 4
     * - In extended fields it is not possible to parse a number outside the field to a representative.
     *  For simplicity this function will just return the input without checking.
     *
     *  @param {number} value The value to be parsed
     *  @returns {number}
     * */
    parse(value){
        if(this.isPrimeField()){
            return ((value % this.field) + this.field) % this.field;
        } else if(this.field == Field.R){
            return value;
        } else if(this.isExtendedField()){
            return value;
        }
    }

    /**
     * Returns the number value as a human readable string.
     *
     * - In real numbers: Each number already is human readable by itself. Therefore e.g. getString(5) = 5
     * - In prime fields: The representative of the provided number is returned. e.g. in F5 getString(14) = 4
     * - In extended fields: A human readable text is returned, e.g. in F4 getString(Field.F4AlphaPlusOne) = α+1
     *
     * @param {number} num The value to be converted to a string
     * @returns {string}
     * */
    getString(num){
        if(this.isPrimeField()){
         return this.parse(num).toString();
        } else if(this.field === Field.R){
            return num.toString();
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

    /**
     * @param {number} num
     * @returns {number}
     * */
    getPrimeFieldMultiplicationInverse(num){
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

    /**
     * @param {number} num
     * @returns {number}
     * */
    getExtendedFieldMultiplicationInverse(num){
        if(this.field === Field.F4){
            return F4MultiplicationInverseLookup.find(object => object.number == num).inverse;
        } else if(this.field === Field.F8){
            return F8MultiplicationInverseLookup.find(object => object.number == num).inverse;
        } else if(this.field === Field.F9){
            return F9MultiplicationInverseLookup.find(object => object.number == num).inverse;
        }
    }

    /**
     * @param {number} factor1
     * @param {number} factor2
     * @returns {number}
     * */
    multiplyInExtendedField(factor1, factor2){
        switch (this.field) {
            case Field.F4:
                return F4MultiplicationLookup.find(object => object.factor1 == factor1 && object.factor2 == factor2).result;
            case Field.F8:
                return F8MultiplicationLookup.find(object => object.factor1 == factor1 && object.factor2 == factor2).result;
            case Field.F9:
                return F9MultiplicationLookup.find(object => object.factor1 == factor1 && object.factor2 == factor2).result;
        }
    }

    /**
     * @param {number} summand1
     * @param {number} summand2
     * @returns {number}
     * */
    addInExtendedField(summand1, summand2) {
        switch (this.field) {
            case Field.F4:
                return F4AdditionLookup.find(object => object.summand1 == summand1 && object.summand2 == summand2).result;
            case Field.F8:
                return F8AdditionLookup.find(object => object.summand1 == summand1 && object.summand2 == summand2).result;
            case Field.F9:
                return F9AdditionLookup.find(object => object.summand1 == summand1 && object.summand2 == summand2).result;
        }
    }

    /**
     * @param {number} num
     * @returns {number}
     * */
    getExtendedFieldAdditionInverse(num){
        switch (this.field) {
            case Field.F4:
                return F4AdditionInverseLookup.find(object => object.number == num).inverse;
            case Field.F8:
                return F8AdditionInverseLookup.find(object => object.number == num).inverse;
            case Field.F9:
                return F9AdditionInverseLookup.find(object => object.number == num).inverse;
        }
    }

    /**
     * @param {number} number
     * @returns {number}
     * */
    preventNegativeZero(number){
        return number + 0;
    }


}
