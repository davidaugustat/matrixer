const operators = {
    ADD: '+',
    SUBTRACT: '-',
    MULTIPLY: '*'
};

class MathExpressionInterpreter {

    /**
     * Creates a string array of the individual tokens inside the expression.
     * Every number, bracket and operator is an individual token.
     *
     * Example: (12+3)*(7.8-5) becomes to ["(", "12", "+", "3", ")", "*" "(", "7.8", "-", "5", ")"]
     *
     * @param {string} expression The math expression to be tokenized
     * @param {number}  field The field on which the expression should be parsed
     * @returns {[string]} An array of the individual tokens
     * */
    tokenize(expression, field){
        const splitRegex = /([+\-*()])/;
        expression = removeSpaces(expression);
        return expression.split(splitRegex).filter(token => token.length > 0);
    }

    /**
     * @param {string} character
     * @returns {boolean}
     * */
    isOperator(character){
        return [operators.ADD, operators.SUBTRACT, operators.MULTIPLY].includes(character);
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
     * @returns boolean
     * */
    isValidNumber(expression){
        if(Array.isArray(expression) && expression.length == 1){
            return RegExp(getRealNumberRegex()).test(expression[0]);
        } else{
            return RegExp(getRealNumberRegex()).test(expression[0]);
        }
    }



}