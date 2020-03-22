function getMatrixRegex(field) {
    const generalMatrixRegex = "\{(([a-zA-Z0-9.+-]+,)*[a-zA-Z0-9.+-]+;)*([a-zA-Z0-9.+-]+,)*[a-zA-Z0-9.+-]+\}";

    // const templateMatrixRegex = "\{((number+,)*number+;)*(number+,)*number+\}";
    const templateMatrixRegex = "\{((number,)*number;)*(number,)*number\}";
    if(isRealNumbersField(field)){
        return templateMatrixRegex.split("number").join(getRealNumberRegex());
    } else if(isPrimeField(field)){
        return templateMatrixRegex.split("number").join(getPrimeFieldRegex());
    } else if(field == Field.F4){
        return templateMatrixRegex.split("number").join(getF4Regex());
    } else if(field == Field.F8){
        return templateMatrixRegex.split("number").join(getF8Regex());
    } else if(field == Field.F9){
        return templateMatrixRegex.split("number").join(getF9Regex());
    }
    return generalMatrixRegex;
}

function getRealNumberRegex(){
     const realNumberRegex = "^((-)?([0-9]+\\.[0-9]+|[0-9]+))$";
    return realNumberRegex;
}

function getPrimeFieldRegex(){
    const primeFieldRegex = "(-)?([0-9]+)";
    return primeFieldRegex;
}

function getF4Regex(){
    const f4Regex = "(0|1|a|a\\+1|1\\+a)";
    return f4Regex;
}

function getF8Regex(){
    const f8Regex = "(0|1|b|1\\+b|b\\+1|bs|1\\+bs|bs\\+1|b\\+bs|bs\\+b|1\\+b\\+bs|1\\+bs\\+b|b\\+1\\+bs|b\\+bs\\+1|bs\\+1\\+b|bs\\+b\\+1)";
    return f8Regex;
}

function getF9Regex(){
     const f9Regex = "(0|1|\\-1|j|j\\+1|1\\+j|j\\-1|\\-1\\+j|\\-j|\\-j\\+1|1\\-j|\\-j\\-1|\\-1\\-j)";
    //const f9Regex = "(0|1|-1|j|j\\+1|1\\+j|j-1|-1\\+j|-j|-j\\+1|1-j|-j-1|-1-j)";
    return f9Regex;
}

function isRealNumbersField(field){
    return field == Field.R;
}

function isPrimeField(field){
    return [Field.F2, Field.F3, Field.F5, Field.F7, Field.F11, Field.F13, Field.F17, Field.F19].includes(field);
}

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


