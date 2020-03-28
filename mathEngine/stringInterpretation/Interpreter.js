/**
 * Class that is able to convert a math expression string in user-input-notation into a binary tree
 * consisting of ExpressionNodes. This tree can then be used to recursively calculate the result of the
 * expression.
 *
 * @author David Augustat
 * */
class Interpreter {
    /**
     * Field on that the expressions should be interpreted
     * @type{number} */
    field;

    /**
     * @param {number} field
     * */
    constructor(field) {
        this.field = field;
    }

    /**
     * Infix-Operators in their correct processing order. The most significant operator must be the next-to-last one
     * in the list. In this case the exponentiation operator is the most significant.
     * The Operators.TERMINAL operator must always be the last element in the list, to indicate the interpreter, that
     * no more significant operator exists.
     * @type {[string]} */
    operatorsInCorrectOrder = [Operators.ADD, Operators.SUBTRACT, Operators.MULTIPLY, Operators.DIVIDE,
        Operators.EXPONENTIATE, Operators.TERMINAL];

    /**
     * Converts a lexically-correct mathematical expression in user-input-notation to a binary tree consisting of
     * ExpressionNode objects. During the interpretation, several semantic rules will be checked (e.g. invalid field)
     * and an exception will be thrown if this is the case.
     *
     * Note that the input expression must have been verified by the Parser.js class so that only lexically-correct
     * expressions enter the interpreter. If lexically-incorrect expressions are interpreted, the interpreter might
     * behave unintended.
     *
     * @param {string} expression The expression to interpret in user-input-notation
     * @returns {ExpressionNode} Root-Node of an expression binary tree
     * */
    interpret(expression){
        expression = removeSpacesAndLineBreaks(expression);
        const expressionParts = this._tokenize(expression);
        return this._interpretOperator(expressionParts, this.operatorsInCorrectOrder);
    }

    /**
     * This operation recursively interprets a tokenized expression.
     *
     * If the provided tokenized expression array contains only a terminal (number, matrix, vector) a terminal node
     * will be returned. Otherwise the expression array will be processed from left to right operator by operator.
     * This method can thereby only process expressions in infix notations directly.
     *
     * Expressions with function operators are however supported as well. A (sub)expression with a function operator
     * at the beginning (e.g. rowreduce) will be processed by the _interpretFunction method, which then uses this
     * method again to interpret the expression inside the function operator brackets.
     *
     * @param {[string]} expression The tokenized expression. To tokenize the expression _tokenize method must be used.
     * @param {[string]} operatorsList An array of the infix operators to use, in the correct order. The first operator
     * in the list will be used by the current execution of this method. For following executions the array will
     * internally be rotated, so that the next execution of this method operates on the next operator.
     * @returns {ExpressionNode} The final expression note that is equivalent to the expression.
     * */
    _interpretOperator(expression, operatorsList){

        const operator = operatorsList[0];
        if(operator === Operators.TERMINAL){
            return this.interpret(expression[0]);
        }

        if(this._isValidNumber(expression)){
            return new ExpressionNode(null, null, null,
                getNumberFromNumberString(this.field, expression[0]));
        } else if(this._isAnyNumber(expression)){
            throw "Number is not supported on this field!";
        } else if(this._isMatrix(expression)){
            return new ExpressionNode(null, null, null,
                Matrix.fromString(this.field, expression[0]));
        } else if(this._isVector(expression)){
            return new ExpressionNode(null, null, null,
                Vector.fromString(this.field, expression[0]));
        } else if(this._isFunction(expression)){
            return this._interpretFunction(expression[0]);
        }

        if(this._expressionContainsOperator(expression, operator)){
            const expressionSeparatedByOperator = this._splitListByFirstOperatorOccurrence(expression, operator);
            const expressionBeforeOperator = expressionSeparatedByOperator[0];
            const expressionAfterOperator = expressionSeparatedByOperator[1];

            const leftNode = this._interpretOperator(expressionBeforeOperator, this._getRotatedOperators(operatorsList));

            let rightNode;
            if(operator === Operators.EXPONENTIATE){
                // right node MUST be a real number. Therefore parse it using a real number interpreter:
                rightNode = new Interpreter(Field.R)._interpretOperator(expressionAfterOperator, operatorsList);
            } else {
                rightNode = this._interpretOperator(expressionAfterOperator, operatorsList);
            }
            return new ExpressionNode(leftNode, rightNode, operator, null);
        }

        return this._interpretOperator(expression, this._getRotatedOperators(operatorsList));
    }

    /**
     * Internal method that decomposes the provided mathematical expression into an array of sub-expressions and
     * operators.
     *
     * The method will first apply several pre-processors on the expressions:
     * - convert all uppercase letters to lowercase
     * - complete leading plus and minus operators, e.g. -5*4 becomes 0-5*4
     * - complete omitted multiplication operators, e.g. 5(4+3) becomes 5*(4+3)
     *
     * Afterwards the operation will split the expression by all operators. Note that only the outermost
     * layer of the expression will be split, therefore sub-expressions in brackets will not be touched.
     *
     * Function operators will stay attached to the parenthesis containing their parameter.
     *
     * Example:
     * "-5(4+3*(3-6))*rowreduce({1,2;3,4})*2" will result in the output:
     * ["0", "-", "5", "4+3*(3-6)", "*", "rowreduce({1,2;3,4}", "*", "2"]
     *
     * @param {string} expression The math expression to be tokenized
     * @returns {[string]} An array of the individual tokens
     * */
    _tokenize(expression){
        expression = expression.toLowerCase();
        expression = this._completeLeadingPlusAndMinus(expression);
        expression = this._completeOmittedMultiplicationOperator(expression);

        let result = [];
        let roundBracketLevel = 0;
        let curlyBracketLevel = 0;
        let squareBracketLevel = 0;
        let lastSplitPosition = 0;
        let functionStarting = false;

        for(let i = 0; i < expression.length; i++){
            let currentChar = expression.charAt(i);
            if(roundBracketLevel === 0 && curlyBracketLevel === 0 && squareBracketLevel === 0){
                if(this._isInfixOperator(currentChar)){
                    result.push(expression.substring(lastSplitPosition, i));
                    result.push(currentChar);
                    lastSplitPosition = i+1;
                } else if(currentChar === '(' && !functionStarting){
                    result.push(expression.substring(lastSplitPosition, i));
                    lastSplitPosition = i+1;
                } else if(currentChar === '(' && functionStarting){
                    functionStarting = false;
                } else if(this._startsWithFunctionOperator(expression, i)){
                    result.push(expression.substring(lastSplitPosition, i));
                    functionStarting = true;
                }
            } else if(roundBracketLevel === 1 && curlyBracketLevel === 0 && squareBracketLevel === 0 && currentChar === ')'){
                result.push(expression.substring(lastSplitPosition, i));
                lastSplitPosition = i+1;
            }

            if(currentChar === '('){
                roundBracketLevel++;
            } else if(currentChar === ')'){
                roundBracketLevel--;
            } else if(currentChar === '{'){
                curlyBracketLevel++;
            } else if(currentChar === '}'){
                curlyBracketLevel--;
            }else if(currentChar === '['){
                squareBracketLevel++;
            } else if(currentChar === ']'){
                squareBracketLevel--;
            }
        }

        result.push(expression.substring(lastSplitPosition));
        result = this._removeEmptyElements(result);
        return result;
    }

    /**
     * Internal method that converts expressions wrapped into a function operator into a single-outgoing expression
     * node.
     *
     * This expression node will contain the sub-expression from the parenthesis as the left sub-node.
     * The function operator will be the operator of the expression node.
     *
     * Note that this method can only deal with input strings, that contain nothing else but a single expression
     * wrapped into a function operator.
     *
     * E.g. "rowreduce(5*{1,2;3,4})" is a valid input.
     *
     * @param {String} expression
     * @returns {ExpressionNode} The node of a binary tree containing the expression.
     * */
    _interpretFunction(expression){
        const splitExpression = expression.split('(', 2);
        const functionName = splitExpression[0];
        const innerExpression = splitExpression[1];

        const innerResult = this.interpret(innerExpression).calculate();
        const innerResultNode = new ExpressionNode(null, null, null, innerResult);
        return new ExpressionNode(innerResultNode, null, functionName, null);
    }

    /**
     * Checks if the provided expression string starts with a function operator (e.g. rowreduce) at a given
     * position in the string.
     *
     * @param {string} expression The expression to be checked.
     * @param {number} startPosition The position in the string where the function operator should begin at
     * @returns {boolean} True if the expression starts with a function operator at the given position. Otherwise
     * false.
     * */
    _startsWithFunctionOperator(expression, startPosition=0){
        return functionOperators.some(operator => expression.startsWith(operator, startPosition));
    }

    /**
     * Checks if the provided string contains only an infix operator.
     *
     * @param {string} character
     * @returns {boolean}
     * */
    _isInfixOperator(character){
        return infixOperators.includes(character);
    }

    /**
     * Checks if a tokenized expression string array contains the given operator string as a direct element of the
     * array. This does NOT check for operators contained in strings, that also hold other characters.
     *
     * E.g.
     * ["5" "-" "(4+3)"] would return true because of the "-" operator.
     * ["(4+5)"] would return false.
     *
     * @param {[string]} expression
     * @param {string} operator
     * @returns {boolean}
     * */
    _expressionContainsOperator(expression, operator){
        return expression.includes(operator);
    }

    /**
     * Completes a leading "-" sign to "0-", so that it can be processed by the interpreter as a normal subtraction.
     *
     * E.g.
     * -5+(3+4) becomes 0-5+(3+4)
     *
     * If the expression does not contain a leading minus, the output will be equal to the input.
     *
     * @param {string} expression
     * @returns {string} expression with 0 attached before leading minus
     */
    _completeLeadingPlusAndMinus(expression){
        if(expression.startsWith(Operators.SUBTRACT) || expression.startsWith(Operators.ADD)){
            return "0" + expression;
        }
        return expression;
    }

    /**
     * Completes omitted "*" signs so that the interpreter understands it as a normal multiplication.
     *
     * E.g.
     * 5(4+6) becomes 5*(4+6)
     *
     * If the expression does not have omitted multiplication signs, the output will be equal to the input.
     *
     * @param {string} expression
     * @returns {string} expression
     * */
    _completeOmittedMultiplicationOperator(expression){
        let functionStarting = false;
        for(let i = 0; i < expression.length; i++){
            const currentChar = expression.charAt(i);
            if(this._startsWithFunctionOperator(expression, i)){
                functionStarting = true;
            } else if(currentChar === '(' && functionStarting){
                functionStarting = false;
            } else if(!functionStarting){
               expression = this._fixOmittedMultiplicationOperatorOnce(expression, i);
            }
        }
        return expression;
    }

    /**
     * Fixes a missing multiplication sign at one given position in the string and returns the corrected string.
     *
     * E.g. 5(4+5)(2+7) becomes 5(4+5)*(2+7) given that the startPosition is 5.
     *
     * If the expression doesn't have any missing multiplication problem at the provided position,
     * the ouput will be equal to the input.
     *
     * @param {string} expression Expression that may contain a missing multiplication sign
     * @param {number} startPosition Position which should be checked for a missing multiplication sign. This must be
     * the position of the number or bracket BEFORE the missing multiplication sign.
     * @returns {string} The string with an additional inserted multiplication sign if one was missing at the given
     * position
     * */
    _fixOmittedMultiplicationOperatorOnce(expression, startPosition=0){
        const expressionFromPosition = expression.substring(startPosition);
        const possibilities = this._getOmittedMultiplicationOperatorPossibilities();
        possibilities.forEach(possibility => {
            if(expressionFromPosition.startsWith(possibility.value)){
                const expressionBeforePosition = expression.substring(0, startPosition);
                const fixedExpressionFromPosition =expressionFromPosition.replace(possibility.value, possibility.replacement);
                expression = expressionBeforePosition + fixedExpressionFromPosition;
            }
        });
        return expression;
    }

    /**
     * Returns an array of all possible character sequences in which a multiplication sign might have been omitted
     * as well as a version of that sequence in which the multiplication sign has been added.
     *
     * @returns {[{value: string, replacement: string}]}
     * */
    _getOmittedMultiplicationOperatorPossibilities(){
        const possibilities = [
            {value: ')(', replacement: ')*('},
            {value: '){', replacement: ')*{'},
            {value: ')[', replacement: ')*['},
            {value: '}(', replacement: '}*('},
            {value: '}{', replacement: '}*{'},
            {value: '}[', replacement: '}*['},
            {value: '](', replacement: ']*('},
            {value: ']{', replacement: ']*{'},
            {value: '][', replacement: ']*['}
            ];

        let fieldCharacters = [];
        if(isRealNumbersField(this.field)){
            fieldCharacters = realNumberCharactersWithoutDot;
        } else if(isPrimeField(this.field)){
            fieldCharacters = primeFieldNumberCharacters;
        } else if(this.field === Field.F4){
            fieldCharacters = f4NumberCharacters;
        } else if(this.field === Field.F8){
            fieldCharacters = f8NumberCharacters;
        } else if(this.field === Field.F9){
            fieldCharacters = f9NumberCharacters;
        }
        fieldCharacters.forEach(character => {
            possibilities.push({value: character + '(', replacement: character + '*('});
            possibilities.push({value: character + '{', replacement: character + '*{'});
            possibilities.push({value: character + '[', replacement: character + '*['});
            possibilities.push({value: ')' + character, replacement: ')*' + character});
            possibilities.push({value: '}' + character, replacement: '}*' + character});
            possibilities.push({value: ']' + character, replacement: ']*' + character});
        });
        return possibilities;
    }

    /**
     * Removes all empty strings from a string array.
     *
     * @param {[string]} list
     * @returns {[string]} list without empty elements
     * */
    _removeEmptyElements(list){
        return list.filter(item => item.length > 0);
    }

    /**
     * Skims a string array for the first occurrence of string that contains only the provided operator symbol.
     * When such an element is found, the array is split in two parts:
     * - Part of the array before the operator
     * - Part of the array after the operator
     *
     * These two part arrays are then returned as an array of string arrays. Note that the operator itself will not
     * be contained in the result.
     *
     * @param {[string]} list Parts of the expression separated by operator symbols
     * @param {string} operatorSymbol The operator to split by
     * @returns {[[string]]} The two parts of the splitting contained in an outer array
     * */
    _splitListByFirstOperatorOccurrence(list, operatorSymbol){
        let result = Array();
        for(let i = 0; i < list.length; i++){
            if(list[i] === operatorSymbol){
                result.push(list.slice(0, i));
                result.push(list.slice(i+1));
                break;
            }
        }
        return result;
    }

    /**
     * Checks if the provided array contains only one element which is a valid number over the field stored in
     * this.field.
     *
     * @param {[string]} expression
     * @returns boolean True if the expression is a valid number. Otherwise false.
     * */
    _isValidNumber(expression){
        if(Array.isArray(expression) && expression.length === 1){
            return RegExp(getRegexForField(this.field)).test(expression[0]);
        }
        return false;
    }

    /**
     * Checks if the provided array contains only one element which is a valid matrix over the field stored in
     * this.field.
     *
     * @param {[string]} expression
     * @returns {boolean} True if the expression is a valid matrix. Otherwise false.
     * */
    _isMatrix(expression){
        if(Array.isArray(expression) && expression.length === 1) {
            return RegExp(getMatrixRegex(this.field)).test(expression[0]);
        }
        return false;
    }

    /**
     * Checks if the provided array contains only one element which is a valid vector over the field stored in
     * this.field.
     *
     * @param {[string]} expression
     * @returns {boolean} True if the expression is a valid vector. Otherwise false.
     * */
    _isVector(expression){
        if(Array.isArray(expression) && expression.length === 1) {
            return RegExp(getVectorRegex(this.field)).test(expression[0]);
        }
        return false;
    }

    /**
     * Checks if the given array contains only one element which is any number from any field.
     *
     * E.g. even when this.field == Field.R, this method will return true for 'a+1' because 'a+1' is a valid
     * number from F4.
     *
     * @param {[string]} expression
     * @returns {boolean} True if the expression is a valid number from any field. Otherwise false.
     * */
    _isAnyNumber(expression){
        if(Array.isArray(expression) && expression.length === 1) {
            return RegExp(getAnyNumberRegex()).test(expression[0]);
        }
        return false;
    }

    /**
     *  Checks if the provided array contains only one element which is a valid function (e.g. rowreduce).
     *
     *  E.g. ["rowreduce({1,2;3,4})"] returns true, but ["5*rowreduce({1,2;3,4})"] or ["5+6"] returns false.
     *
     * @param {[string]} expression
     * @returns {boolean} True if the expression is a valid function, otherwise false.
     * */
    _isFunction(expression){
        if(Array.isArray(expression) && expression.length === 1){
            return this._startsWithFunctionOperator(expression[0], 0);
        }
        return false;
    }

    /**
     * Shifts all elements in the provided array to the left by one element. The outer left element will become
     * the last element in the array.
     *
     * @param {[string]} operatorList
     * @returns {[string]}
     * */
    _getRotatedOperators(operatorList){
        const rotatedList = operatorList.slice(1);
        rotatedList.push(operatorList[0]);
        return rotatedList;
    }
}
