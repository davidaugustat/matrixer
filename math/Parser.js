class Parser {

    /**
     * Checks if text is a valid math expression. If not, an exception containing the approximate reason of failure will be thrown.
     *
     * Note: This method will only ever return true or throw an exception. It will never return false!
     *
     * Following criteria will be checked:
     * - Is order and quantity of each bracket type correct?
     * - Does text only contains valid numbers and characters?
     *  Note: On Fields other than R, numbers in R will also be accepted
     *  at every position. This is because real numbers must be allowed for exponentiation
     *  - Invalid operator positions will be checked, e.g. multiplication sign at beginning, multiple operators in series
     *  - Are function operators (e.g. rowreduce) followed by opening round bracket?
     *  - Do all matrices match the matrix regex for the given field?
     *  - Do all vectors match the matrix regex for the given field?
     *  - Are comma and semicolon used outside of matrices or vector?
     *
     * @param {number} field The field that is used in the expression
     * @param {string} text The expression to be checked
     * @returns {boolean} Does the expression fulfill every criteria?
     * */
    isValidMathExpression(field, text){
        text = removeSpacesAndLineBreaks(text);

        if(!this.isValidBracketMatching(text)){
            throw "Brackets not correct!";
        }

        if(!this.containsOnlyValidNumbersAndCharacters(field, text)){
            throw "Contains invalid characters or numbers!";
        }

        if(this.containsOperatorsAtWrongPosition(text)){
            throw "Contains operators at disallowed position!";
        }

        if(!this.areFunctionOperatorsFollowedByBracket(text)){
            throw "Function operators must be followed by opening round bracket!"
        }

        if(!this.areAllMatricesValid(field, text)){
            throw "Incorrect matrix!";
        }

        if(!this.areAllVectorsValid(field, text)){
            throw "Incorrect vector!";
        }

        if(this.commaAndSemicolonUsedOutsideMatrixAndVector(text)){
            throw "Use of , or ; forbidden outside of matrix or vector!"
        }
        return true;
    }

    /**
     * Checks if brackets are used in correct order and quantity.
     *
     *  this simulates a pushdown automaton to check if the word is in the language of correct parenthesis.
     *
     *  <a href="https://en.wikipedia.org/wiki/Pushdown_automaton">Wikipedia / Pushdown automaton</a>
     *
     * @param {string} text
     * @returns {boolean}
     * */
    isValidBracketMatching(text){
        text = this.removeEveryThingButBrackets(text);

        const characterStack = [];
        for(let i = 0; i < text.length; i++){
            const currentChar = text.charAt(i);
            if(isOpeningBracket(currentChar)){
                characterStack.push(currentChar);
            } else if(isClosingBracket(currentChar)){
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
     * @param  {number} field
     * @param {string} text
     * @returns {boolean}
     * */
    containsOnlyValidNumbersAndCharacters(field, text) {
       return this.getValidNumbersAndCharactersRegex(field).test(text.toLowerCase());
    }

    /**
     * Checks for several syntax errors facing operators
     *
     * - Checks for invalid start operators: *, /, ^  (e.g. "*5+5")
     * - Checks for invalid end operators: +, -, *, /, ^  (e.g. "5+5+")
     * - Checks for invalid sequences including operators: (*, (/, (^, -), +), *), /), ^), ++, --, //, ^^,....  (e.g. (*5+5), 5++ )
     *
     * @param  {string} text
     * @returns {boolean}
     * */
    containsOperatorsAtWrongPosition(text){
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
     * @param {string} text
     * @returns {boolean}
     * */
    areFunctionOperatorsFollowedByBracket(text){
        const functionOperatorsRegex = "(" + functionOperators.join("|") + ")";
        const separatedByFunctionOperators = text.split(RegExp(functionOperatorsRegex))
            .filter(substring => !functionOperators.includes(substring));
        const expressionPartsWithoutFirst = separatedByFunctionOperators.slice(1);
        return expressionPartsWithoutFirst.every(substring => substring.startsWith('('));
    }

    /**
     * Extracts all matrices (marked by curly brackets) from the expression and matches them against the
     * matrix regex.
     *
     * This method does NOT check if all rows have the same amount of columns!
     *
     * @param {number} field
     * @param {string} text
     * */
    areAllMatricesValid(field, text){
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

        const matrixRegex = RegExp(getMatrixRegex(field));
        return matrixStrings.every(matrixString => matrixRegex.test(matrixString));
    }

    /**
     * Extracts all vectors (marked by square brackets) from the expression and matches them against the
     * vector regex.
     *
     * @param {number} field
     * @param {string} text
     * */
    areAllVectorsValid(field, text){
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

        const vectorRegex = RegExp(getVectorRegex(field));
        return vectorStrings.every(vectorString => vectorRegex.test(vectorString));
    }

    commaAndSemicolonUsedOutsideMatrixAndVector(text){
        const commaAndSemicolon = [',', ';'];
        const textWithoutMatricesAndVectors = this.removeMatrixAndVectorStrings(text);
        return commaAndSemicolon.some(character => textWithoutMatricesAndVectors.includes(character));
    }

    removeMatrixAndVectorStrings(text){
        const simplifiedMatrixRegex = /{[\S]*?}/g;
        const simplifiedVectorRegex = /\[[\S]*?]/g;
        const textWithoutMatrices = text.replace(simplifiedMatrixRegex, '');
        return textWithoutMatrices.replace(simplifiedVectorRegex, '');
    }

    /**
     * @param {string} text
     * @returns {string}
     * */
    removeEveryThingButBrackets(text){
        const everyThingButBracketsRegex = /[^(){}\[\]]/g;
        return text.replace(everyThingButBracketsRegex, '');
    }

    /**
     * @param {number} field
     * @returns {[string]}
     * */
    getValidNumbersAndCharacters(field){
        // because of exponentiation, all Fields must allow real numbers as well:
        const charactersUsedByAll = generalCharacters
            .concat(listOfAllOperators)
            .map(character => this.escapeCharacterForUseInRegex(character))
            .concat(getRealNumberRegex(false));

        //concat(getRealNumberRegex(false));
       if(isRealNumbersField(field)){
           return charactersUsedByAll;
       } else if(isPrimeField(field)){
           return charactersUsedByAll.concat(getPrimeFieldRegex(false));
       } else if(field === Field.F4){
            return charactersUsedByAll.concat(getF4Regex(false));
        } else if(field === Field.F8){
            return charactersUsedByAll.concat(getF8Regex(false));
        } else if(field === Field.F9){
            return charactersUsedByAll.concat(getF9Regex(false));
        }
    }

    /**
     * @param {number} field
     * @returns {RegExp}
     * */
    getValidNumbersAndCharactersRegex(field){
        let validCharactersList = this.getValidNumbersAndCharacters(field);
        let regexString = "^(";
        regexString += validCharactersList.join('|');
        regexString += ")+$";
        return RegExp(regexString);
        //return regexString;
    }

    escapeCharacterForUseInRegex(character) {
        return character.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    }
}
