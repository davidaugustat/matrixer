class Interpreter2 {
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

    functionOperators = [Operators.ROW_REDUCE, Operators.DETERMINANT, Operators.ABSOLUTE_VALUE];

    /**
     * @param {string} expression
     * @returns {ExpressionNode2}
     * */
    interpret(expression){
        const expressionParts = this.tokenize(expression);
        return this.interpretOperator(expressionParts, this.operatorsInCorrectOrder);
    }

    /**
     * @param {[string]} expression
     * @param {[string]} operatorsList
     * @returns {ExpressionNode2}
     * */
    interpretOperator(expression, operatorsList){

        const operator = operatorsList[0];
        if(operator === Operators.TERMINAL){
            return this.interpret(expression[0]);
        }

        if(this.isValidNumber(expression)){
            return new ExpressionNode2(null, null, null, getNumberFromNumberString(this.field, expression[0]));
        } else if(this.isMatrix(expression)){
            return new ExpressionNode2(null, null, null, Matrix2.fromString(this.field, expression[0]));
        } else if(this.isVector(expression)){
            return new ExpressionNode2(null, null, null, Vector2.fromString(this.field, expression[0]));
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
                rightNode = new Interpreter2(Field.R).interpretOperator(expressionAfterOperator, operatorsList);
            } else {
                rightNode = this.interpretOperator(expressionAfterOperator, operatorsList);
            }
            return new ExpressionNode2(leftNode, rightNode, operator, null);
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
        expression = this.completeLeadingMinus(expression);

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
     * @returns {ExpressionNode2}
     * */
    interpretFunction(expression){
        const splitExpression = expression.split('(', 2);
        const functionName = splitExpression[0];
        const innerExpression = splitExpression[1];

        const innerResult = this.interpret(innerExpression).calculate();
        const innerResultNode = new ExpressionNode2(null, null, null, innerResult);
        return new ExpressionNode2(innerResultNode, null, functionName, null);
    }

    /**
     * @param {string} expression
     * @param {number} startPosition
     * @returns {boolean}
     * */
    startsWithFunctionOperator(expression, startPosition=0){
        return this.functionOperators.some(operator => expression.startsWith(operator, startPosition));
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
    completeLeadingMinus(expression){
        if(expression.startsWith(Operators.SUBTRACT)){
            return "0" + expression;
        }
        return expression;
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