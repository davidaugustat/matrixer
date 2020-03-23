
/**
 * @param {number} field
 * @returns {string}
 * */
function getMatrixRegex(field) {
    //const generalMatrixRegex = "\{(([a-zA-Z0-9.+-]+,)*[a-zA-Z0-9.+-]+;)*([a-zA-Z0-9.+-]+,)*[a-zA-Z0-9.+-]+\}";

    const templateMatrixRegex = "^\{((number,)*number;)*(number,)*number\}$";
    return templateMatrixRegex.split("number").join(getRegexForField(field));
}

/**
 * @returns {string}
 * */
function getRealNumberRegex(){
     const realNumberRegex = "^((-)?([0-9]+\\.[0-9]+|[0-9]+))$";
    return realNumberRegex;
}

/**
 * @returns {string}
 * */
function getPrimeFieldRegex(){
    const primeFieldRegex = "^(-)?([0-9]+)$";
    return primeFieldRegex;
}

/**
 * @returns {string}
 * */
function getF4Regex(){
    const f4Regex = "^(0|1|a|a\\+1|1\\+a)$";
    return f4Regex;
}

/**
 * @returns {string}
 * */
function getF8Regex(){
    const f8Regex = "^(0|1|b|1\\+b|b\\+1|bs|1\\+bs|bs\\+1|b\\+bs|bs\\+b|1\\+b\\+bs|1\\+bs\\+b|b\\+1\\+bs|b\\+bs\\+1|bs\\+1\\+b|bs\\+b\\+1)$";
    return f8Regex;
}

/**
 * @returns {string}
 * */
function getF9Regex(){
     const f9Regex = "^(0|1|\\-1|j|j\\+1|1\\+j|j\\-1|\\-1\\+j|\\-j|\\-j\\+1|1\\-j|\\-j\\-1|\\-1\\-j)$";
    return f9Regex;
}

/**
 * @param {number} field
 * @returns {string}
 * */
function getRegexForField(field){
    if(isRealNumbersField(field)){
        return getRealNumberRegex();
    } else if(isPrimeField(field)){
        return getPrimeFieldRegex();
    } else if(isExtendedField(field)){
        switch (field) {
            case Field.F4:
                return getF4Regex();
            case Field.F8:
                return getF8Regex();
            case Field.F9:{
                return getF9Regex();
            }
        }
    }
}

/**
 * @param {number} field
 * @returns {boolean}
 * */
function isRealNumbersField(field){
    return field == Field.R;
}

/**
 * @param {number} field
 * @returns {boolean}
 * */
function isPrimeField(field){
    return [Field.F2, Field.F3, Field.F5, Field.F7, Field.F11, Field.F13, Field.F17, Field.F19].includes(field);
}

/**
 * @param {number} field
 * @returns {boolean}
 * */
function isExtendedField(field){
    return [Field.F4, Field.F8, Field.F9].includes(field);
}

/**
 * Removes all spaces from a string.
 *
 * @param {string} text The string with spaces
 * @returns string The string without spaces
 * */
function removeSpaces(text){
    return text.split(' ').join('');
}

/**
 * Converts a string into a number. Works for every available field.
 *
 * @param {string} numberString The string representation of the number. This must NOT contain spaces!
 * @param {number} field The field in which the number should be parsed
 * @returns number The number equivalent to numberString
 * */
function getNumberFromNumberString(numberString, field){
    console.log(numberString);
    if(isRealNumbersField(field) || isPrimeField(field)){
        return parseFloat(numberString);
    } else if(field == Field.F4){
        return this.getF4NumberFromString(numberString);
    } else if(field == Field.F8){
        return this.getF8NumberFromString(numberString);
    } else if(field == Field.F9){
        return this.getF9NumberFromString(numberString);
    }
}

/**
 * @param {string} numberString
 * @returns {number}
 * */
function getF4NumberFromString(numberString){
    if(numberString == "0"){
        return Field.F4Zero;
    } else if(numberString == "1"){
        return Field.F4One;
    } else if(numberString == "a"){
        return Field.F4Alpha;
    } else if(["a+1", "1+a"].includes(numberString)){
        return Field.F4AlphaPlusOne;
    }
}

/**
 * @param {string} numberString
 * @returns {number}
 * */
function getF8NumberFromString(numberString){
    if(numberString == "0"){
        return Field.F8Zero;
    } else if(numberString == "1"){
        return Field.F8One;
    } else if(numberString == "b"){
        return Field.F8Beta;
    } else if(numberString == "bs"){
        return Field.F8BetaSquare;
    } else if(["1+b", "b+1"].includes(numberString)){
        return Field.F8OnePlusBeta;
    } else if(["1+bs", "bs+1"].includes(numberString)){
        return Field.F8OnePlusBetaSquare;
    } else if(["b+bs", "bs+b"].includes(numberString)){
        return Field.F8BetaPlusBetaSquare;
    } else if(["1+b+bs", "1+bs+b", "b+1+bs", "b+bs+1", "bs+1+b", "bs+b+1"].includes(numberString)){
        return Field.F8OnePlusBetaPlusBetaSquare;
    }
}

/**
 * @param {string} numberString
 * @returns {number}
 * */
function getF9NumberFromString(numberString){
    if(numberString == "0"){
        return Field.F9Zero;
    } else if(numberString == "1"){
        return Field.F9One;
    } else if(numberString == "-1"){
        return Field.F9MinusOne;
    } else if(numberString == "j"){
        return Field.F9Iota;
    } else if(numberString == "-j"){
        return Field.F9MinusIota;
    } else if(["j+1", "1+j"].includes(numberString)){
        return Field.F9IotaPlusOne;
    } else if(["j-1", "-1+j"].includes(numberString)){
        return Field.F9IotaMinusOne;
    } else if(["-j+1", "1-j"].includes(numberString)){
        return Field.F9MinusIotaPlusOne;
    } else if(["-j-1", "-1-j"].includes(numberString)){
        return Field.F9MinusIotaMinusOne;
    }
}

function numberIsInteger(number) {
    return number === parseInt(number);
}

/**
 * @param {number} number
 * @returns {number}
 * */
function preventNegativeZero(number){
    return number + 0;
}


