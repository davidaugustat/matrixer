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
     * @param {string} text
     * @returns {string}
     * */
    removeEveryThingButBrackets(text){
        const everyThingButBracketsRegex = /[^(){}\[\]]/g;
        return text.replace(everyThingButBracketsRegex, '');
    }

    isOpeningBracket(character){
        return character === '(' || character === '{' || character === '[';
    }

    isClosingBracket(character){
        return character === ')' || character === '}' || character === ']';
    }
}