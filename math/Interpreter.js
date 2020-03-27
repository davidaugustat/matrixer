class Interpreter {
    /** @type{number} */
    field;

    /**
     * @param {number} field
     * */
    constructor(field) {
        this.field = field;
    }

    /** @type {[string]} */
    operatorsInCorrectOrder = [Operators.ADD, Operators.SUBTRACT, Operators.MULTIPLY, Operators.DIVIDE, Operators.EXPONENTIATE, Operators.TERMINAL];

    /**
     * @param {string} expression
     * @returns {ExpressionNode}
     * */
    interpret(expression){
        const expressionParts = this.tokenize(expression);
        return this.interpretOperator(expressionParts, this.operatorsInCorrectOrder);
    }

    /**
     * @param {[string]} expression
     * @param {[string]} operatorsList
     * @returns {ExpressionNode}
     * */
    interpretOperator(expression, operatorsList){

        const operator = operatorsList[0];
        if(operator === Operators.TERMINAL){
            return this.interpret(expression[0]);
        }

        if(this.isValidNumber(expression)){
            return new ExpressionNode(null, null, null, getNumberFromNumberString(this.field, expression[0]));
        } else if(this.isAnyNumber(expression)){
            throw "Number is not supported on this field!";
        } else if(this.isMatrix(expression)){
            return new ExpressionNode(null, null, null, Matrix.fromString(this.field, expression[0]));
        } else if(this.isVector(expression)){
            return new ExpressionNode(null, null, null, Vector.fromString(this.field, expression[0]));
        } else if(this.isFunction(expression)){
            return this.interpretFunction(expression[0]);
        }

        if(this.expressionContainsOperator(expression, operator)){
            const expressionSeparatedByOperator = this.splitListByFirstOperatorOccurrence(expression, operator);
            const expressionBeforeOperator = expressionSeparatedByOperator[0];
            const expressionAfterOperator = expressionSeparatedByOperator[1];

            const leftNode = this.interpretOperator(expressionBeforeOperator, this.getRotatedOperators(operatorsList));

            let rightNode;
            if(operator === Operators.EXPONENTIATE){
                // right node MUST be a real number. Therefore parse it using a real number interpreter:
                rightNode = new Interpreter(Field.R).interpretOperator(expressionAfterOperator, operatorsList);
            } else {
                rightNode = this.interpretOperator(expressionAfterOperator, operatorsList);
            }
            return new ExpressionNode(leftNode, rightNode, operator, null);
        }

        return this.interpretOperator(expression, this.getRotatedOperators(operatorsList));
    }

    /**
     *
     *
     * @param {string} expression The math expression to be tokenized
     * @returns {[string]} An array of the individual tokens
     * */
    tokenize(expression){
        expression = expression.toLowerCase();
        expression = this.completeLeadingPlusAndMinus(expression);
        expression = this.completeOmittedMultiplicationOperator(expression);

        let result = [];
        let roundBracketLevel = 0;
        let curlyBracketLevel = 0;
        let squareBracketLevel = 0;
        let lastSplitPosition = 0;
        let functionStarting = false;

        for(let i = 0; i < expression.length; i++){
            let currentChar = expression.charAt(i);
            if(roundBracketLevel === 0 && curlyBracketLevel === 0 && squareBracketLevel === 0){
                if(this.isOperator(currentChar)){
                    result.push(expression.substring(lastSplitPosition, i));
                    result.push(currentChar);
                    lastSplitPosition = i+1;
                } else if(currentChar === '(' && !functionStarting){
                    result.push(expression.substring(lastSplitPosition, i));
                    lastSplitPosition = i+1;
                } else if(currentChar === '(' && functionStarting){
                    functionStarting = false;
                } else if(this.startsWithFunctionOperator(expression, i)){
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
        result = this.removeEmptyElements(result);
        return result;
    }

    /**
     * @param {String} expression
     * @returns {ExpressionNode}
     * */
    interpretFunction(expression){
        const splitExpression = expression.split('(', 2);
        const functionName = splitExpression[0];
        const innerExpression = splitExpression[1];

        const innerResult = this.interpret(innerExpression).calculate();
        const innerResultNode = new ExpressionNode(null, null, null, innerResult);
        return new ExpressionNode(innerResultNode, null, functionName, null);
    }

    /**
     * @param {string} expression
     * @param {number} startPosition
     * @returns {boolean}
     * */
    startsWithFunctionOperator(expression, startPosition=0){
        return functionOperators.some(operator => expression.startsWith(operator, startPosition));
    }

    /**
     * @param {string} character
     * @returns {boolean}
     * */
    isOperator(character){
        return this.operatorsInCorrectOrder.includes(character);
    }

    /**
     * @param {[string]} expression
     * @param {string} operator
     * @returns {boolean}
     * */
    expressionContainsOperator(expression, operator){
        return expression.includes(operator);
    }

    /**
     * @param {string} expression
     * @returns {string}
     */
    completeLeadingPlusAndMinus(expression){
        if(expression.startsWith(Operators.SUBTRACT) || expression.startsWith(Operators.ADD)){
            return "0" + expression;
        }
        return expression;
    }

    /**
     * @param {string} expression
     * @returns {string}
     * */
    completeOmittedMultiplicationOperator(expression){
        let functionStarting = false;
        for(let i = 0; i < expression.length; i++){
            const currentChar = expression.charAt(i);
            if(this.startsWithFunctionOperator(expression, i)){
                functionStarting = true;
            } else if(currentChar === '(' && functionStarting){
                functionStarting = false;
            } else if(!functionStarting){
               expression = this.fixOmittedMultiplicationOperatorOnce(expression, i);

            }
        }
        return expression;
    }

    /**
     * @param {string} expression
     * @param {number} startPosition
     * @returns {string}
     * */
    fixOmittedMultiplicationOperatorOnce(expression, startPosition=0){
        const expressionFromPosition = expression.substring(startPosition);
        const possibilities = this.getOmittedMultiplicationOperatorPossibilities();
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
     * @returns {[{value: string, replacement: string}]}
     * */
    getOmittedMultiplicationOperatorPossibilities(){
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
     * @param {[string]} list
     * @returns {[string]}
     * */
    removeEmptyElements(list){
        return list.filter(item => item.length > 0);
    }

    /**
     * @param {[string]} list
     * @param {string} operatorSymbol
     * @returns {[[string]]}
     * */
    splitListByFirstOperatorOccurrence(list, operatorSymbol){
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
     * @param {[string]} expression
     * @returns boolean
     * */
    isValidNumber(expression){
        if(Array.isArray(expression) && expression.length === 1){
            return RegExp(getRegexForField(this.field)).test(expression[0]);
        }
        return false;
    }

    /**
     * @param {[string]} expression
     * @returns {boolean}
     * */
    isMatrix(expression){
        if(Array.isArray(expression) && expression.length === 1) {
            return RegExp(getMatrixRegex(this.field)).test(expression[0]);
        }
        return false;
    }

    /**
     * @param {[string]} expression
     * @returns {boolean}
     * */
    isVector(expression){
        if(Array.isArray(expression) && expression.length === 1) {
            return RegExp(getVectorRegex(this.field)).test(expression[0]);
        }
        return false;
    }

    /**
     * Checks if the given expression is any number from any field.
     *
     * E.g. even when this.field == Field.R, this method will return true for 'a+1' because 'a+1' is a valid
     * number from F4.
     *
     * @param {[string]} expression
     * @returns {boolean}
     * */
    isAnyNumber(expression){
        if(Array.isArray(expression) && expression.length === 1) {
            return RegExp(getAnyNumberRegex()).test(expression[0]);
        }
        return false;
    }

    /**
     * @param {[string]} expression
     * @returns {boolean}
     * */
    isFunction(expression){
        if(Array.isArray(expression) && expression.length === 1){
            return this.startsWithFunctionOperator(expression[0], 0);
        }
        return false;
    }

    /**
     * @param {[string]} operatorList
     * @returns {[string]}
     * */
    getRotatedOperators(operatorList){
        const rotatedList = operatorList.slice(1);
        rotatedList.push(operatorList[0]);
        return rotatedList;
    }

}