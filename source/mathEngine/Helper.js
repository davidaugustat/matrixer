import {F4Number, F8Number, F9Number, PrimeFieldNumber, RealNumber, GeneralNumber, Field} from 'mathEngine/imports.js';

/**
 * This class contains several helper methods that are used by the math engine.
 *
 * @author David Augustat
 * */
export default class Helper{

    /**
     * Returns the regex string for matching a matrix over a given field.
     *
     * @param {number} field The field of the numbers used inside the matrix
     * @param {boolean} hasStartStopMarkers True if regex should include "^" at the beginning and "$" at the end so
     * that it can directly be used as an input for RegExp(). Set to false, if this regex should be part of another regex.
     * @returns {string}
     * */
    static getMatrixRegex(field, hasStartStopMarkers=true) {
        const templateMatrixRegex = "\{((number,)*number;)*(number,)*number\}";
        const regex = templateMatrixRegex.split("number").join(Helper.getRegexForField(field, false));
        return Helper.prepareRegex(regex, hasStartStopMarkers);
    }
    
    /**
     * Returns the regex string for matching a vector over a given field.
     *
     * @param {number} field The field of the numbers used inside the vector
     * @param {boolean} hasStartStopMarkers True if regex should include "^" at the beginning and "$" at the end so
     * that it can directly be used as an input for RegExp(). Set to false, if this regex should be part of another regex.
     * @returns {string}
     * */
    static getVectorRegex(field, hasStartStopMarkers=true){
        const templateVectorRegex = "\\[(number,)*number\\]";
        const regex = templateVectorRegex.split("number").join(Helper.getRegexForField(field, false));
        return Helper.prepareRegex(regex, hasStartStopMarkers);
    }
    
    /**
     * Returns the regex string for matching real numbers.
     *
     * @param {boolean} hasStartStopMarkers True if regex should include "^" at the beginning and "$" at the end so
     * that it can directly be used as an input for RegExp(). Set to false, if this regex should be part of another regex.
     * @returns {string}
     * */
    static getRealNumberRegex(hasStartStopMarkers=true){
         const realNumberRegex = "((-)?([0-9]+\\.[0-9]+|[0-9]+))";
        return Helper.prepareRegex(realNumberRegex, hasStartStopMarkers);
    }
    
    /**
     * Returns the regex string for matching prime field numbers (any prime field will be matched).
     *
     * @param {boolean} hasStartStopMarkers True if regex should include "^" at the beginning and "$" at the end so
     * that it can directly be used as an input for RegExp(). Set to false, if this regex should be part of another regex.
     * @returns {string}
     * */
    static getPrimeFieldRegex(hasStartStopMarkers=true){
        const primeFieldRegex = "(-)?([0-9]+)";
        return Helper.prepareRegex(primeFieldRegex, hasStartStopMarkers);
    }
    
    /**
     * Returns the regex string for matching numbers on the F4 field.
     *
     * @param {boolean} hasStartStopMarkers True if regex should include "^" at the beginning and "$" at the end so
     * that it can directly be used as an input for RegExp(). Set to false, if this regex should be part of another regex.
     * @returns {string}
     * */
    static getF4Regex(hasStartStopMarkers=true){
        const f4Regex = "(0|1|a|a\\+1|1\\+a)";
        return Helper.prepareRegex(f4Regex, hasStartStopMarkers);
    }
    
    /**
     * Returns the regex string for matching numbers on the F8 field.
     *
     * @param {boolean} hasStartStopMarkers True if regex should include "^" at the beginning and "$" at the end so
     * that it can directly be used as an input for RegExp(). Set to false, if this regex should be part of another regex.
     * @returns {string}
     * */
    static getF8Regex(hasStartStopMarkers=true){
        const f8Regex = "(0|1|b|1\\+b|b\\+1|bs|1\\+bs|bs\\+1|b\\+bs|bs\\+b|1\\+b\\+bs|1\\+bs\\+b|b\\+1\\+bs|b\\+bs\\+1|bs\\+1\\+b|bs\\+b\\+1)";
        return Helper.prepareRegex(f8Regex, hasStartStopMarkers);
    }
    
    /**
     * Returns the regex string for matching numbers on the F9 field.
     *
     * @param {boolean} hasStartStopMarkers True if regex should include "^" at the beginning and "$" at the end so
     * that it can directly be used as an input for RegExp(). Set to false, if this regex should be part of another regex.
     * @returns {string}
     * */
    static getF9Regex(hasStartStopMarkers=true){
         const f9Regex = "(0|1|\\-1|j|j\\+1|1\\+j|j\\-1|\\-1\\+j|\\-j|\\-j\\+1|1\\-j|\\-j\\-1|\\-1\\-j)";
        return Helper.prepareRegex(f9Regex, hasStartStopMarkers);
    }
    
    /**
     * Returns the regex string for matching numbers on any field. This regex will match any number, regardless of
     * what field the number is on.
     *
     * @param {boolean} hasStartStopMarkers True if regex should include "^" at the beginning and "$" at the end so
     * that it can directly be used as an input for RegExp(). Set to false, if this regex should be part of another regex.
     * @returns {string}
     * */
    static getAnyNumberRegex(hasStartStopMarkers=true){
        const anyNumberRegex ='(' + Helper.getRealNumberRegex(false) + '|'
            + Helper.getPrimeFieldRegex(false) + '|' + Helper.getF4Regex(false) + '|'
            + Helper.getF8Regex(false) + '|' + Helper.getF9Regex(false) + ')';
        return Helper.prepareRegex(anyNumberRegex, hasStartStopMarkers);
    }
    
    /**
     * Returns a regex that matches all numbers of the provided field.
     *
     * @param {number} field The field the regex should match for
     * @param {boolean} hasStartStopMarkers True if regex should include "^" at the beginning and "$" at the end so
     * that it can directly be used as an input for RegExp(). Set to false, if this regex should be part of another regex.
     * @returns {string}
     * */
    static getRegexForField(field, hasStartStopMarkers=true){
        if(Helper.isRealNumbersField(field)){
            return Helper.getRealNumberRegex(hasStartStopMarkers);
        } else if(Helper.isPrimeField(field)){
            return Helper.getPrimeFieldRegex(hasStartStopMarkers);
        } else if(Helper.isExtendedField(field)){
            switch (field) {
                case Field.F4:
                    return Helper.getF4Regex(hasStartStopMarkers);
                case Field.F8:
                    return Helper.getF8Regex(hasStartStopMarkers);
                case Field.F9:{
                    return Helper.getF9Regex(hasStartStopMarkers);
                }
            }
        }
    }
    
    /**
     * Attaches start and stop markers "^" and "$" to the beginning and end to the regex string if hasStartStopMarkers is
     * true. Otherwise, the provided regex will return as is.
     *
     * @param {string} regex The regex string to apply the changes to
     * @param {boolean} hasStartStopMarkers True if regex should include "^" at the beginning and "$" at the end so
     * that it can directly be used as an input for RegExp(). Set to false, if the provided regex should be part of
     * another regex.
     * @returns {string}
     * */
    static prepareRegex(regex, hasStartStopMarkers){
        if(hasStartStopMarkers){
            return "^" + regex + "$";
        }
        return regex;
    }
    
    /**
     * Returns true if field is Field.R.
     *
     * @param {number} field
     * @returns {boolean}
     * */
    static isRealNumbersField(field){
        return field === Field.R;
    }
    
    /**
     * Returns true, if field is a prime number field (e.g. F3, F5, F7)
     *
     * @param {number} field
     * @returns {boolean}
     * */
    static isPrimeField(field){
        return [Field.F2, Field.F3, Field.F5, Field.F7, Field.F11, Field.F13, Field.F17, Field.F19].includes(field);
    }
    
    /**
     * Returns true, if field is either F4, F8 or F9.
     *
     * @param {number} field
     * @returns {boolean}
     * */
    static isExtendedField(field){
        return [Field.F4, Field.F8, Field.F9].includes(field);
    }
    
    /**
     * Removes all spaces from a string.
     *
     * @param {string} text The string with spaces
     * @returns string The string without spaces
     * */
    static removeSpacesAndLineBreaks(text){
        let result = Helper.removeCharacter(text, ' ');
        result = result.replace(/\r?\n|\r/g, '');
        return result;
    }
    
    /**
     * Removes all occurrences of a character from a string
     *
     * @param {string} text The string with the character
     * @param {string} characterToRemove The character to remove
     * @returns string The string without character
     * */
    static removeCharacter(text, characterToRemove){
        return text.split(characterToRemove).join('');
    }
    
    /**
     * Converts a string into a number. Works for every available field.
     *
     * @param {string} numberString The string representation of the number. This must NOT contain spaces!
     * @param {number} field The field in which the number should be parsed
     * @returns {GeneralNumber} The number equivalent to numberString
     * */
    static getNumberFromNumberString(field,numberString){
        if(Helper.isRealNumbersField(field)){
            return new RealNumber(parseFloat(numberString));
        } else if(Helper.isPrimeField(field)){
            return PrimeFieldNumber.fromString(field, numberString);
        } else if(field === Field.F4){
            return F4Number.fromString(field, numberString);
        } else if(field === Field.F8){
            return F8Number.fromString(field, numberString);
        } else if(field === Field.F9){
            return F9Number.fromString(field, numberString);
        }
    }
    
    /**
     * Returns true if the provided number is an integer value (meaning it does not have decimals)
     *
     * E.g. 3.5 will return false, but 3.0 will return true.
     *
     * @param {number} number
     * @returns {boolean} True when number is an integer
     * */
    static numberIsInteger(number) {
        return number === parseInt(Helper.number);
    }
    
    /**
     * Solves the problem, that in JavaScript there exists a positive zero (0) as well as a negative zero (-0).
     *
     * This method converts any negative zero to a positive zero. If the number is not 0, then the number will
     * be returned unchanged.
     *
     * @param {number} number
     * @returns {number}
     * */
    static preventNegativeZero(number){
        //Yes, it's actually meant to be like that, and fixes the problem:
        return number + 0;
    }
    
    /**
     * Creates a new number object from a number value that matches the provided field.
     *
     * E.g. for field == Field.F4 and value == 0, the result will be new F4Number(Field.F4Zero)
     *
     * @param {number} field field to parse the number to
     * @param {number} value The number value to use as a value in the number object
     * @returns {GeneralNumber} The created fitting number object
     * */
    static parseValueToFittingNumberObject(field, value){
        if(Helper.isRealNumbersField(field)){
            return new RealNumber(value);
        } else if(Helper.isPrimeField(field)){
            return new PrimeFieldNumber(field, value);
        } else if(Helper.isExtendedField(field)){
            switch (field) {
                case Field.F4:
                    return new F4Number(value);
                case Field.F8:
                    return new F8Number(value);
                case Field.F9:
                    return new F9Number(value);
            }
        }
    }
    
    /**
     * Returns true if the provided character is an opening bracket.
     *
     * Supported bracket types are (, { and [.
     *
     * @param {string} character The character to check
     * @returns {boolean}
     * */
    static isOpeningBracket(character){
        return character === '(' || character === '{' || character === '[';
    }
    
    /**
     * Returns true if the provided character is a closing bracket.
     *
     * Supported bracket types are ), } and ].
     *
     * @param {string} character The character to check
     * @returns {boolean}
     * */
    static isClosingBracket(character){
        return character === ')' || character === '}' || character === ']';
    }
    
    /**
     * Rounds a float number to a given number of decimals. Trailing zeros are removed.
     *
     * e.g. round(5.12345, 3) becomes 5.123 and round(5.1, 3) becomes 5.1
     *
     * @param {number} number The number to round
     * @param {number} numberOfDecimals The maximum number of digits after the floating point
     * @returns {string} The rounded number
     * */
    static round(number, numberOfDecimals){
        return parseFloat(number.toFixed(numberOfDecimals)).toString();
    }

}
