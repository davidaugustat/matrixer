class Parser {

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

        if(this.containsInvalidCharacters(field, text)){
            throw "Contains invalid characters!";
        }
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
            if(this.isOpeningBracket(currentChar)){
                characterStack.push(currentChar);
            } else if(this.isClosingBracket(currentChar)){
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
    containsInvalidCharacters(field, text) {
       return this.getValidCharactersRegex(field).test(text.toLowerCase());
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
     * @param {string} character
     * @returns {boolean}
     * */
    isOpeningBracket(character){
        return character === '(' || character === '{' || character === '[';
    }

    /**
     * @param {string} character
     * @returns {boolean}
     * */
    isClosingBracket(character){
        return character === ')' || character === '}' || character === ']';
    }

    /**
     * @param {number} field
     * @returns {[string]}
     * */
    getValidCharacters(field){
        const charactersUsedByAll = generalCharacters.concat(listOfAllOperators);
       if(isRealNumbersField(field)){
           return charactersUsedByAll.concat(realNumberCharacters);
       } else if(isPrimeField(field)){
           return charactersUsedByAll.concat(primeFieldNumberCharacters);
       } else if(field === Field.F4){
            return charactersUsedByAll.concat(f4NumberCharacters);
        } else if(field === Field.F8){
            return charactersUsedByAll.concat(f8NumberCharacters);
        } else if(field === Field.F9){
            return charactersUsedByAll.concat(f9NumberCharacters);
        }
    }

    /**
     * @param {number} field
     * @returns {RegExp}
     * */
    getValidCharactersRegex(field){
        let validCharactersList = this.getValidCharacters(field);
        validCharactersList = validCharactersList.map(character => this.escapeCharacterForUseInRegex(character));
        let regexString = "^(";
        validCharactersList.forEach(character => regexString += character + '|');
        // remove last '|' from regexString:
        regexString = regexString.substring(0, regexString.length-1);
        regexString += ")+$";
        return RegExp(regexString);
        //return regexString;
    }

    escapeCharacterForUseInRegex(character) {
        return character.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    }
}