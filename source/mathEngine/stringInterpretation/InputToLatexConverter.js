import Helper from "../Helper";
import {Constants} from "../Constants";

/**
 * Class that converts a valid string in user-input-notation into an equivalent latex representation, so that
 * it can be displayed to the user together with the result of the calculation.
 *
 * @author David Augustat
 * */
export default class InputToLatexConverter {
    /**
     * Converts a user input into an equivalent latex math expression and returns it.
     *
     * Note that the string MUST be a valid string in user-input-notation. If the string is invalid, this converter
     * might behave unintended.
     *
     * @param {string} text
     * @returns {string}
     * */
    toLatex(text){
        text = Helper.removeSpacesAndLineBreaks(text);
        text = text.toLowerCase();
        text = this._convertFieldNumberStrings(text);
        text = this._convertMatrices(text);
        text = this._convertVectors(text);
        text = this._convertExponentiatedParenthesis(text);
        text = this._convertExponentiatedNumbers(text);
        return text;
    }

    /**
     * Internal method that finds matrices in user-input-notation in a string and replaces them with the Latex
     * notation for matrices.
     *
     * If no matrices are contained in the input string, the output will be equal to the input.
     *
     * @param {string} text String in user-input-notation
     * @returns string String with matrices converted to Latex notation
     * */
    _convertMatrices(text){
        const textSplitByMatrices = this._splitByParenthesis(text, '{', '}');
        const convertedSubstrings = textSplitByMatrices.map(substring => {
            if(substring.startsWith('{')){
                const curlyBracketsRegex = /([{},;])/g;
                const replaceMap = {
                    "{":"\\begin{pmatrix}",
                    "}":"\\end{pmatrix}",
                    ",":" & ",
                    ";":" \\\\ "
                };
                return this._replaceMultiple(substring, curlyBracketsRegex, replaceMap);
            } else{
                return substring;
            }
        });
        return convertedSubstrings.join('');
    }

    /**
     * Internal method that finds vectors in user-input-notation in a string and replaces them with the Latex
     * notation for vectors.
     *
     * If no vectors are contained in the input string, the output will be equal to the input.
     *
     * @param {string} text String in user-input-notation
     * @returns string String with vectors converted to Latex notation
     * */
    _convertVectors(text){
        const textSplitByVectors = this._splitByParenthesis(text, '[', ']');
        const convertedSubstrings = textSplitByVectors.map(substring => {
            if(substring.startsWith('[')){
                const curlyBracketsRegex = /([\[\],])/g;
                const replaceMap = {
                    "[":"\\begin{pmatrix}",
                    "]":"\\end{pmatrix}",
                    ",":" \\\\ "
                };
                return this._replaceMultiple(substring, curlyBracketsRegex, replaceMap);
            } else{
                return substring;
            }
        });
        return convertedSubstrings.join('');
    }

    /**
     * Internal method that finds field numbers of the fields F4, F8 and F9, in user-input-notation in a string,
     * and converts them to their equivalent Latex representation.
     *
     * E.g. 1*(a+1) is converted to 1*(α+1)
     *
     * If no such numbers are contained in the input string, the output will be equal to the input.
     *
     * @param {string} text String in user-input-notation
     * @returns string String with F4, F8 and F9 numbers converted to Latex notation
     * */
    _convertFieldNumberStrings(text){
        const splitByFunctionOperators = this._splitByFunctionOperators(text);
        const convertedSubstrings = splitByFunctionOperators.map(substring => {
            if(Constants.functionOperators.includes(substring)){
                return substring;
            } else{
                const extendedFieldGreekCharacterRegex = /(a|bs|b|j)/g;
                const replaceMap = {
                    "a":"\\alpha",
                    "bs":"\\beta^2",
                    "b":"\\beta",
                    "j":"\\iota"
                };
                return this._replaceMultiple(substring, extendedFieldGreekCharacterRegex, replaceMap);
            }
        });
        return convertedSubstrings.join('');
    }

    /**
     * Fixes the problem that with exponentiated numbers that have more than 1 digit, only the first digit will
     * be shown as the exponent.
     *
     * The problem is fixed by wrapping the entire exponent number in curly brackets.
     * E.g. 2^34 becomes 2^{34}.
     *
     * If no exponentiated number is contained in the string, the output will be equal to the input.
     *
     * @param {string} text String in user-input-notation
     * @returns {string} String with exponentiated numbers wrapped in curly brackets.
     * */
    _convertExponentiatedNumbers(text){
        const textSplitByExponentiatedNumbers = this._splitByExponentiatedNumbers(text);
        const convertedSubstrings = textSplitByExponentiatedNumbers.map(substring => {
            if(substring.startsWith('^') && Helper.isDigit(substring.charAt(1))){
                return "^{" + substring.substring(1, substring.length) + '}';
            } else{
                return substring;
            }
        });
        return convertedSubstrings.join('');
    }

    /**
     * Fixes the problem that with exponentiated expressions in round brackets only the first bracket will be shown as
     * the exponent.
     *
     * For example in 2^(4+6) only the '(' will be marked as an exponent. To fix this, the outermost round brackets are
     * replaced by curly brackets, e.g. 2^(4*(5+6)) becomes 2^{4*(5+6)}.
     *
     * If no exponentiated parenthesis is contained in the input string, the output will be equal to the input.
     *
     * @param {string} text String in user-input-notation
     * @returns {string} String with exponentiated parenthesis converted to Latex notation
     * */
    _convertExponentiatedParenthesis(text){
       const textSplitByExponentiatedParenthesis = this._splitByExponentiatedParenthesis(text);
       const convertedSubstrings = textSplitByExponentiatedParenthesis.map(substring => {
           if(substring.startsWith("^(")){
               return "^{" + substring.substring(2, substring.length-1) + "}";
           } else{
               return substring;
           }
       });
       return convertedSubstrings.join('');
    }

    /**
     * Skims a string for exponentiated numbers (not brackets!) and splits the string in a way that the exponentiation
     * sign together with the exponent is separated from the rest of the string. The entire string is then returned
     * as an array consisting of normal expression parts and the extracted parts.
     *
     * E.g. "5*34^10-6" will result in ["5*34" + "^10" + "-6"]
     *
     * @param {string} text
     * @returns {[string]}
     * */
    _splitByExponentiatedNumbers(text){
        let result = [];

        let lastSplitPosition = 0;
        let insideExponentiatedNumber = false;

        for(let i = 0; i < text.length; i++){
            const currentChar = text.charAt(i);
            const nextChar = text.charAt(i+1);
            if(currentChar === '^' && Helper.isDigit(nextChar)){
                result.push(text.substring(lastSplitPosition, i));
                lastSplitPosition = i;
                insideExponentiatedNumber = true;
            } else if(insideExponentiatedNumber && !(Helper.isDigit(currentChar) || currentChar === '.')){
                result.push(text.substring(lastSplitPosition, i));
                lastSplitPosition = i;
                insideExponentiatedNumber = false;
            }
        }
        result.push(text.substring(lastSplitPosition, text.length));
        return result;
    }

    /**
     * Skims a string for exponentiated expression in brackets and splits the string in a way that the exponentiation
     * sign together with the exponentiated bracket is separated from the rest of the string. The entire string is then
     * returned as an array consisting of normal expression parts and the extracted parts.
     *
     * e.g. "5+2^(5+7)-9" will result in ["5+2", "^(5+7)", "-9"]
     *
     * @param {string} text
     * @returns {[string]}
     * */
    _splitByExponentiatedParenthesis(text){
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
     * @param {string} text The text to split in user-input-notation
     * @param {string} openingBracketChar The character that should be used as opening bracket
     * @param {string} closingBracketChar The character that should be used as closing bracket
     * @returns {[string]} An array of the individual parts of the original string
     * */
    _splitByParenthesis(text, openingBracketChar, closingBracketChar){
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

    /**
     * Splits a string in user-input-notation by all occurring function operators (e.g. rowreduce) and returns
     * an array of the separated string parts.
     *
     * For example "5*rowreduce({1,2;3,4})" will be converted to ["5*", "rowreduce", "({1,2;3,4})"]
     *
     * @param {string} text The text to split in user-input-notation
     * @returns {[string]} Array of the parts that the input string consists of.
     * */
    _splitByFunctionOperators(text){
        const functionOperatorsRegex = "(" + Constants.functionOperators.join("|") + ")";
        return text.split(RegExp(functionOperatorsRegex));
    }

    /**
     * Replaces multiple substrings in a string by different replacement strings.
     *
     * E.g. every 'a' should be replaced with a 'b' and every 'b' should be replaced with a 'c'.
     *
     * @param {string} text The text to execute the replacement on
     * @param {RegExp} replaceRegex A regex that matches every substring that should be replaced.
     * Note that the regex must contain the global modifier (/.../g) if EVERY occurrence of the substring should be
     * replaced. Otherwise only the first occurrence will be replaced.
     * @param {{string:string, string:string, ...}} replaceMap A map that indicates what substring should be replaced
     * by which replacement string. E.g. {"a":"b", "b":"c"} would be the replacement map for the example at the top.
     * @returns {string} The input string with the substrings replaced accordingly.
     * */
    _replaceMultiple(text, replaceRegex, replaceMap){
        return text.replace(replaceRegex, matchedSubstring => replaceMap[matchedSubstring]);
    }
}
