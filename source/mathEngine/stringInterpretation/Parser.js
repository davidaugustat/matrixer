/**
 * A class that serves the purpose of checking if a mathematical expression is lexically correct.
 * Semantic errors are not checked however.
 *
 * @author David Augustat
 * */
class Parser {

    /**
     * Checks if text is a valid math expression. If not, an exception containing the approximate reason of failure
     * will be thrown.
     *
     * Note: This method will only ever return true or throw an exception. It will never return false!
     *
     * Following criteria will be checked:
     * - Is order and quantity of each bracket type correct?
     * - Does text only contains valid numbers and characters?
     *  Note: On Fields other than R, numbers in R will also be accepted at every position. This is because
     *  real numbers must be allowed for exponentiation
     *  - Invalid operator positions will be checked, e.g. multiplication sign at beginning, multiple operators
     *  in series
     *  - Are function operators (e.g. rowreduce) followed by opening round bracket?
     *  - Do all matrices match the matrix regex for the given field?
     *  - Do all vectors match the matrix regex for the given field?
     *  - Are comma and semicolon used outside of matrices or vector?
     *
     * @param {number} field The field that is used in the expression
     * @param {string} text The expression to be checked
     * @returns {boolean} Returns true if the provided string matches every if the listed criteria. Otherwise false.
     * */
    isValidMathExpression(field, text){
        text = Helper.removeSpacesAndLineBreaks(text);

        if(!this._isValidBracketMatching(text)){
            throw Exceptions.InvalidBracketsException;
        }

        if(!this._containsOnlyValidNumbersAndCharacters(field, text)){
            throw Exceptions.InvalidNumbersOrCharactersException;
        }

        if(this._containsOperatorsAtWrongPosition(text)){
            throw Exceptions.OperatorsAtInvalidPositionException;
        }

        if(!this._areFunctionOperatorsFollowedByBracket(text)){
            throw Exceptions.FunctionOperatorNotFollowedByBracketException;
        }

        if(!this._areAllMatricesValid(field, text)){
            throw Exceptions.InvalidMatrixException;
        }

        if(!this._areAllVectorsValid(field, text)){
            throw Exceptions.InvalidVectorException;
        }

        if(this._commaAndSemicolonUsedOutsideMatrixAndVector(text)){
            throw Exceptions.CommaOrSemicolonOutsideOfMatrixAndVectorException;
        }
        return true;
    }

    /**
     * Checks if the brackets are used in correct order and quantity in a provided math expression.
     *
     *  This simulates a pushdown automaton to check if the word is in the language of correct parenthesis.
     *  Supported bracket types are (), {}, and [].
     *
     *  <a href="https://en.wikipedia.org/wiki/Pushdown_automaton">Wikipedia / Pushdown automaton</a>
     *
     * @param {string} text The math expression to check
     * @returns {boolean} True if all bracket types are used in correct order and quantity. Otherwise false.
     * => True = Good
     * */
    _isValidBracketMatching(text){
        text = this._removeEveryThingButBrackets(text);

        const characterStack = [];
        for(let i = 0; i < text.length; i++){
            const currentChar = text.charAt(i);
            if(Helper.isOpeningBracket(currentChar)){
                characterStack.push(currentChar);
            } else if(Helper.isClosingBracket(currentChar)){
                const respectiveOpeningBracket = characterStack[characterStack.length-1];
                if((currentChar === ')' && respectiveOpeningBracket === '(')
                    || (currentChar === '}' && respectiveOpeningBracket === '{')
                    || (currentChar === ']' && respectiveOpeningBracket === '[')){
                    characterStack.pop();
                } else{
                    return false;
                }
            }
        }
        return characterStack.length === 0;
    }

    /**
     * Checks if only valid numbers and characters are used inside the expression.
     *
     * Valid characters are brackets (), {}, [], comma, semicolon, all operators (infix and function operators)
     * as well as all real numbers and the numbers of the provided field.
     *
     * Note that real numbers are always allowed, because the exponent of an exponentiation must always be a real
     * number.
     *
     * @param  {number} field The field to be used for the expression (except exponents)
     * @param {string} text The math expression to check
     * @returns {boolean} True if the expression only contains valid characters. Otherwise false.
     * => True = Good
     * */
    _containsOnlyValidNumbersAndCharacters(field, text) {
       return this._getValidNumbersAndCharactersRegex(field).test(text.toLowerCase());
    }

    /**
     * Checks for several syntax errors facing operators
     *
     * - Checks for invalid start operators: *, /, ^  (e.g. "*5+5")
     * - Checks for invalid end operators: +, -, *, /, ^  (e.g. "5+5+")
     * - Checks for invalid sequences including operators: (*, (/, (^, -), +), *), /), ^), ++, --, //, ^^,....  (e.g. (*5+5), 5++ )
     *
     * @param  {string} text The math expression to check
     * @returns {boolean} True if an error facing operators at wrong position has been found. If the expression
     * doesn't have such issues, false will be returned. => True = Bad
     * */
    _containsOperatorsAtWrongPosition(text){
        const invalidCharacterSequences = ['(*', '(/', '(^', '-)', '+)', '*)', '/)', '^)',
            '++','+-','+*','+/','+^', '-+', '--', '-*', '-/', '-^', '*+', '*-', '**', '*/', '*^',
            '/+' ,'/-' ,'/*' ,'//' ,'/^' ,'^+' ,'^-' ,'^*' ,'^/' ,'^^'];
        const invalidStartCharacters = ['*', '/', '^'];
        const invalidEndCharacters = ['+', '-', '*', '/', '^'];

        const containsInvalidCharacterSequence = invalidCharacterSequences.some(invalidCharacterSequence => {
            return text.includes(invalidCharacterSequence);
        });
        const containsInvalidStartCharacter = invalidStartCharacters.some(invalidStartCharacter => {
            return text.startsWith(invalidStartCharacter);
        });
        const containsInvalidEndCharacter = invalidEndCharacters.some(invalidEndCharacter => {
            return text.endsWith(invalidEndCharacter);
        });

        return containsInvalidCharacterSequence || containsInvalidStartCharacter || containsInvalidEndCharacter;
    }

    /**
     * Checks if all function operators are followed by a round bracket.
     *
     * e.g. "abs5+5" or "abs+5" return false while abs(5+5) returns true
     *
     * Note that true will be returned, if no function operator is used.
     *
     * @param {string} text The math expression to check
     * @returns {boolean} True if all function operators are followed by a round bracket or no function operator is
     * used. If an issue facing this has been found, false will be returned. => True = Good
     * */
    _areFunctionOperatorsFollowedByBracket(text){
        const functionOperatorsRegex = "(" + functionOperators.join("|") + ")";
        const separatedByFunctionOperators = text.split(RegExp(functionOperatorsRegex))
            .filter(substring => !functionOperators.includes(substring));
        const expressionPartsWithoutFirst = separatedByFunctionOperators.slice(1);
        return expressionPartsWithoutFirst.every(substring => substring.startsWith('('));
    }

    /**
     * Extracts all matrices (marked by curly brackets) from the expression and matches them against the
     * matrix regex to check if they are valid.
     *
     * This method does NOT check if all rows have the same amount of columns!
     * Note that true will be returned, when the expression does not contain any matrices.

     *
     * @param {number} field The field on which the matrix element numbers should be
     * @param {string} text The expression to check
     * @returns {boolean} True if all matrices are valid or no matrices are present. Otherwise false.
     * => True = Good
     * */
    _areAllMatricesValid(field, text){
        const matrixStrings = [];
        let lastOpeningCurlyBracketPosition = 0;
        let insideMatrix = false;
        for(let i = 0; i < text.length; i++){
            const currentChar = text.charAt(i);
            if(currentChar === '{'){
                if(insideMatrix){
                    return false;
                }
                insideMatrix = true;
                lastOpeningCurlyBracketPosition = i;
            } else if(currentChar === '}'){
                const matrixString = text.substring(lastOpeningCurlyBracketPosition, i+1);
                matrixStrings.push(matrixString);
                insideMatrix = false;
            }
        }

        const matrixRegex = RegExp(Helper.getMatrixRegex(field));
        return matrixStrings.every(matrixString => matrixRegex.test(matrixString));
    }

    /**
     * Extracts all vectors (marked by square brackets) from the expression and matches them against the
     * vector regex to check if they are valid.
     *
     * Note that true will be returned, when the expression does not contain any vectors.
     *
     * @param {number} field The field on which the vector element numbers should be
     * @param {string} text The expression to check.
     * @returns {boolean} True if all vectors are valid or if no vectors are present. Otherwise false.
     * => True = Good
     * */
    _areAllVectorsValid(field, text){
        const vectorStrings = [];
        let lastOpeningSquareBracketPosition = 0;
        for(let i = 0; i < text.length; i++){
            const currentChar = text.charAt(i);
            if(currentChar === '['){
                lastOpeningSquareBracketPosition = i;
            } else if(currentChar === ']'){
                const vectorString = text.substring(lastOpeningSquareBracketPosition, i+1);
                vectorStrings.push(vectorString);
            }
        }

        const vectorRegex = RegExp(Helper.getVectorRegex(field));
        return vectorStrings.every(vectorString => vectorRegex.test(vectorString));
    }

    /**
     * Checks if ',' or ';' are used outside of matrices of vectors (which they shouldn't).
     *
     * E.g. "5,6*[1,2,3]" returns true while "5-6*[1,2,3]" returns false.
     *
     * @param {string} text The expression to check
     * @returns {boolean} True if ',' or ';' has been found outside of matrices or vectors. Otherwise false.
     * => True = Bad
     * */
    _commaAndSemicolonUsedOutsideMatrixAndVector(text){
        const commaAndSemicolon = [',', ';'];
        const textWithoutMatricesAndVectors = this._removeMatrixAndVectorStrings(text);
        return commaAndSemicolon.some(character => textWithoutMatricesAndVectors.includes(character));
    }

    /**
     * Removes all matrices and vectors from the provided expression.
     *
     * E.g. "5*(3-5)*{1,2;3,4}*[1,2]" becomes "5*(3-5)**"
     *
     * If the expression does not contain any matrices and vectors, the output will be equal to the input.
     *
     * @param {string} text The expression to process
     * @returns {string} The expression with matrices and vectors removed
     * */
    _removeMatrixAndVectorStrings(text){
        const simplifiedMatrixRegex = /{[\S]*?}/g;
        const simplifiedVectorRegex = /\[[\S]*?]/g;
        const textWithoutMatrices = text.replace(simplifiedMatrixRegex, '');
        return textWithoutMatrices.replace(simplifiedVectorRegex, '');
    }

    /**
     * Removes everything except brackets (), {}, [] from a string.
     *
     * E.g. "5*4*(rowreduce({1,2,3,4}))+{5,6;7,8}" becomes "(({})){}".
     *
     * @param {string} text The expression to remove brackets from
     * @returns {string} The expression with only brackets left.
     * */
    _removeEveryThingButBrackets(text){
        const everyThingButBracketsRegex = /[^(){}\[\]]/g;
        return text.replace(everyThingButBracketsRegex, '');
    }

    /**
     * Compiles an array or all valid numbers an characters as regex parts for an mathematical expression over a
     * given field.
     *
     * E.g. for field == Field.F4, following array is returned:
     * [",", ";", "\(", "\)", "\{", "\}", "\[", "\]", "\+", "-", "\*", "\^", "\/", "rowreduce", "det", "abs",
     * "((-)?([0-9]+\.[0-9]+|[0-9]+))", "(0|1|a|a\+1|1\+a)"]
     *
     * Note that real numbers are included as valid numbers for every field, because exponents must always be
     * real numbers.
     *
     * @param {number} field The field to get the valid characters and numbers for.
     * @returns {[string]} All regex parts that can be used to match valid characters and numbers
     * */
    _getValidNumbersAndCharacters(field){
        const charactersUsedByAll = generalCharacters
            .concat(listOfAllOperators)
            .map(character => this._escapeCharacterForUseInRegex(character))
            .concat(Helper.getRealNumberRegex(false));

       if(Helper.isRealNumbersField(field)){
           return charactersUsedByAll;
       } else if(Helper.isPrimeField(field)){
           return charactersUsedByAll.concat(Helper.getPrimeFieldRegex(false));
       } else if(field === Field.F4){
            return charactersUsedByAll.concat(Helper.getF4Regex(false));
        } else if(field === Field.F8){
            return charactersUsedByAll.concat(Helper.getF8Regex(false));
        } else if(field === Field.F9){
            return charactersUsedByAll.concat(Helper.getF9Regex(false));
        }
    }

    /**
     * Creates a regex that matches all numbers and characters that are allowed in an mathematical expression over
     * the given field.
     *
     * Note that real numbers are included in the regex for every field, because exponents must always be real numbers.
     *
     * @param {number} field The field to create the regex for
     * @returns {RegExp} The regex that has been created
     * */
    _getValidNumbersAndCharactersRegex(field){
        let validCharactersList = this._getValidNumbersAndCharacters(field);
        let regexString = "^(";
        regexString += validCharactersList.join('|');
        regexString += ")+$";
        return RegExp(regexString);
    }

    /**
     * Escapes special characters for use in regex strings.
     *
     * If no escaping is necessary for the provided character, the output will be equal to the input.
     *
     * @param {string} character The character without escaping
     * @returns {string} The escaped version of the character.
     * */
    _escapeCharacterForUseInRegex(character) {
        return character.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    }
}
