class InputToLatexConverter {
    /**
     * Converts a user input into an equivalent latex math expression.
     * @param {string} text
     * @returns {string}
     * */
    toLatex(text){
        text = this.convertFieldNumberStrings(text);
        text = this.convertMatrices(text);
        text = this.convertVectors(text);
        text = this.convertExponentiatedParenthesis(text);
        return text;
    }

    convertMatrices(text){
        const textSplitByMatrices = this.splitByParenthesis(text, '{', '}');
        const convertedSubstrings = textSplitByMatrices.map(substring => {
            if(substring.startsWith('{')){
                const curlyBracketsRegex = /([{},;])/g;
                const replaceMap = {
                    "{":"\\begin{pmatrix}",
                    "}":"\\end{pmatrix}",
                    ",":" & ",
                    ";":" \\\\ "
                };
                return this.replaceMultiple(substring, curlyBracketsRegex, replaceMap);
            } else{
                return substring;
            }
        });
        return convertedSubstrings.join('');
    }

    convertVectors(text){
        const textSplitByVectors = this.splitByParenthesis(text, '[', ']');
        const convertedSubstrings = textSplitByVectors.map(substring => {
            if(substring.startsWith('[')){
                const curlyBracketsRegex = /([\[\],])/g;
                const replaceMap = {
                    "[":"\\begin{pmatrix}",
                    "]":"\\end{pmatrix}",
                    ",":" \\\\ "
                };
                return this.replaceMultiple(substring, curlyBracketsRegex, replaceMap);
            } else{
                return substring;
            }
        });
        return convertedSubstrings.join('');
    }

    convertFieldNumberStrings(text){
        const splitByFunctionOperators = this.splitByFunctionOperators(text);
        const convertedSubstrings = splitByFunctionOperators.map(substring => {
            if(functionOperators.includes(substring)){
                return substring;
            } else{
                return substring.replace(/a/g, 'α')
                    .replace(/bs/g, 'β^2')
                    .replace(/b/g, 'β')
                    .replace(/j/g, 'ι');

            }
        });
        return convertedSubstrings.join();
    }

    /**
     * Fixes the problem that with exponentiated expressions in brackets only the first bracket will be shown as the exponent.
     *
     * For example in 2^(4+6) only the '(' will be marked as an exponent. To fix this, the outermost round brackets are
     * replaced by curly brackets, e.g. 2\^(4\*(5+6)) becomes 2\^{4\*(5+6)}.
     *
     * @param {string} text
     * @returns {string}
     * */
    convertExponentiatedParenthesis(text){
       const textSplitByExponentiatedParenthesis = this.splitByExponentiatedParenthesis(text);
       const convertedSubstrings = textSplitByExponentiatedParenthesis.map(substring => {
           if(substring.startsWith("^")){
               return "^{" + substring.substring(2, substring.length-1) + "}";
           } else{
               return substring;
           }
       });
       return convertedSubstrings.join('');
    }

    /**
     * Skims a string for exponentiated expression in brackets and splits the string in a way that the exponentiation sign
     * together with the exponentiated bracket is separated from the rest of the string. The entire string is then
     * returned as an array consisting of normal expression parts and the extracted parts.
     *
     * e.g. "5+2\^(5+7)-9" will result in ["5+", "2\^(5+7)", "-9"]
     *
     * @param {string} text
     * @returns {[string]}
     * */
    splitByExponentiatedParenthesis(text){
        let textSplitByExponentiation = [];
        let lastSplitPosition = 0;
        let roundBracketLevel = 0;

        for(let i = 0; i < text.length; i++){
            let currentChar = text.charAt(i);
            if(text.startsWith("^(", i)){
                textSplitByExponentiation.push(text.substring(lastSplitPosition, i));
                lastSplitPosition = i;
            } else if(currentChar === '('){
                roundBracketLevel++;
            } else if(currentChar === ')'){
                roundBracketLevel--;
                if(roundBracketLevel === 0){
                    textSplitByExponentiation.push(text.substring(lastSplitPosition, i+1));
                    lastSplitPosition = i+1;
                }
            }
        }
        textSplitByExponentiation.push(text.substring(lastSplitPosition));
        return textSplitByExponentiation;
    }


    /**
     * splits a string at opening and closing bracket position, so that the
     * opening and closing brackets are attached to the string that is inside them.
     *
     * e.g. "5\*(3+6)-7" becomes "5*", "(3+6), "-7" given that openingBracketChar == '(' and closingBracketChar == ')'
     *
     * @param {string} text The text to split
     * @param {string} openingBracketChar The character that should be used as opening bracket
     * @param {string} closingBracketChar The character that should be used as closing bracket
     * @returns {[string]} An array of the individual parts of the original string
     * */
    splitByParenthesis(text, openingBracketChar, closingBracketChar){
        const result = [];
        let lastSplitPosition = 0;
        for(let i = 0; i < text.length; i++){
            let currentChar = text.charAt(i);
            if(currentChar === openingBracketChar){
                const textBeforeParenthesis = text.substring(lastSplitPosition, i);
                result.push(textBeforeParenthesis);
                lastSplitPosition = i;
            } else if(currentChar === closingBracketChar){
                const textInsideParenthesis = text.substring(lastSplitPosition, i+1);
                result.push(textInsideParenthesis);
                lastSplitPosition = i+1;
            }
        }
        result.push(text.substring(lastSplitPosition, text.length));
        return result;
    }

    splitByFunctionOperators(text){
        const functionOperatorsRegex = "(" + functionOperators.join("|") + ")";
        return text.split(RegExp(functionOperatorsRegex));
    }

    replaceMultiple(text, replaceRegex, replaceMap){
        return text.replace(replaceRegex, matchedSubstring => replaceMap[matchedSubstring]);
    }
}
