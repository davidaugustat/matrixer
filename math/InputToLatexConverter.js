class InputToLatexConverter {
    /**
     * Converts a user input into an equivalent latex math expression.
     * @param {string} text
     * @returns {string}
     * */
    toLatex(text){
        text = this.convertFieldNumberStrings(text);
        console.log(text);
        text = this.convertMatrices(text);
        console.log(text);
        text = this.convertVectors(text);
        console.log(text);
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
        console.log(convertedSubstrings);
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
