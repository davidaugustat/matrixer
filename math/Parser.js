class Parser {

    /*
    * TODO:
    *  - check if function is followed by bracket!
    *  - check if ',' and ';' are only used in matrices and vectors respectively
    *  - check correctness of matrices and vectors
    * */

    /**
     * Checks if text is a valid math expression. If not, an exception containing the approximate reason of failure will be thrown.
     *
     * @param {number} field;
     * @param {string} text
     * @returns {boolean}
     * */
    isValidMathExpression(field, text){
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
        console.log(expressionPartsWithoutFirst);
        return expressionPartsWithoutFirst.every(substring => substring.startsWith('('));
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
            return charactersUsedByAll.concat(getF8Regex());
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