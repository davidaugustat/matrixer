const operators = {
    ADD: '+',
    SUBTRACT: '-',
    MULTIPLY: '*',
    EXPONENTIATE: '^',
    DIVIDE: '/',
    TERMINAL: '€'
};

class MathExpressionInterpreter {

    /** @type {[string]} */
    operatorsInCorrectOrder = [operators.ADD, operators.SUBTRACT, operators.MULTIPLY, operators.EXPONENTIATE, operators.DIVIDE, operators.TERMINAL];

    /**
     * @param {string} expression
     * @param {number} field
     * @returns {ExpressionNode}
     * */
    interpret(expression, field){
        const expressionParts = this.tokenize(expression, field);
        return this.interpretOperator(expressionParts, this.operatorsInCorrectOrder, field);
    }

    /**
     * @param {[string]} expression
     * @param {[string]} operatorsList
     * @param {number} field
     * @returns {ExpressionNode}
     * */
    interpretOperator(expression, operatorsList, field){

        const operator = operatorsList[0];
        if(operator == operators.TERMINAL){
            return this.interpret(expression[0], field);
        }

        if(this.isValidNumber(expression, field)){
            return new ExpressionNode(null, null, null, getNumberFromNumberString(expression[0], field), field);
        }

        if(this.expressionContainsOperator(expression, operator)){
            const expressionSeparatedByOperator = this.splitListByFirstOperatorOccurrence(expression, operator);
            const expressionBeforeOperator = expressionSeparatedByOperator[0];
            const expressionAfterOperator = expressionSeparatedByOperator[1];

            const leftNode = this.interpretOperator(expressionBeforeOperator, this.getRotatedOperators(operatorsList), field);
            const rightNode = this.interpretOperator(expressionAfterOperator, operatorsList, field);
            return new ExpressionNode(leftNode, rightNode, operator, null, field);
        }

        return this.interpretOperator(expression, this.getRotatedOperators(operatorsList), field);
    }

    /**
     *
     *
     * @param {string} expression The math expression to be tokenized
     * @param {number}  field The field on which the expression should be parsed
     * @returns {[string]} An array of the individual tokens
     * */
    tokenize(expression, field){
        expression = this.completeLeadingMinus(expression);
        let result = new Array();
        let bracketLevel = 0;
        let lastSplitPosition = 0;

        for(let i = 0; i < expression.length; i++){
            let currentChar = expression.charAt(i);
            if(bracketLevel == 0){
                if(this.isOperator(currentChar)){
                    result.push(expression.substring(lastSplitPosition, i));
                    result.push(currentChar);
                    lastSplitPosition = i+1;
                } else if(currentChar == '('){
                    result.push(expression.substring(lastSplitPosition, i));
                    lastSplitPosition = i+1;
                }
            } else if(bracketLevel == 1 && currentChar == ')'){
                result.push(expression.substring(lastSplitPosition, i));
                lastSplitPosition = i+1;
            }

            if(currentChar == '('){
                bracketLevel++;
            } else if(currentChar == ')'){
                bracketLevel--;
            }
        }

        result.push(expression.substring(lastSplitPosition));
        result = this.removeEmptyElements(result);
        return result;
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
        if(expression.startsWith(operators.SUBTRACT)){
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
            if(list[i] == operatorSymbol){
                result.push(list.slice(0, i));
                result.push(list.slice(i+1));
                break;
            }
        }
        return result;
    }

    /**
     * @param {string | [string]} expression
     * @param {number} field
     * @returns boolean
     * */
    isValidNumber(expression, field){
        if(Array.isArray(expression) && expression.length == 1){
            return RegExp(getRegexForField(field)).test(expression[0]);
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