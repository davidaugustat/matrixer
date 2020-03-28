class ExpressionNode {

    /** @type {ExpressionNode} */
    leftNode;

    /** @type {ExpressionNode} */
    rightNode;

    /** @type {string} */
    operator;

    /** @type {MathElement} */
    terminalElement;

    /** @type {boolean} */
    isTerminal;

    /** @type {boolean} */
    isSingleBranchNode;

    /**
     * @param {?ExpressionNode} leftNode
     * @param {?ExpressionNode} rightNode
     * @param {?string} operator
     * @param {?MathElement} terminalElement
     * */
    constructor(leftNode, rightNode, operator, terminalElement) {
        this.leftNode = leftNode;
        this.rightNode = rightNode;
        this.operator = operator;
        this.terminalElement = terminalElement;

        this.isTerminal = terminalElement != null;
        this.isSingleBranchNode = leftNode != null && rightNode == null;
    }

    /**
     * @returns {MathElement}
     * */
    calculate(){
        if(this.isTerminal){
            return this.terminalElement;
        } else{
            switch (this.operator) {
                case Operators.ADD:
                    return this.leftNode.calculate().add(this.rightNode.calculate());
                case Operators.MULTIPLY:
                    return this.leftNode.calculate().multiplyWith(this.rightNode.calculate());
                case Operators.SUBTRACT:
                    return this.leftNode.calculate().subtract(this.rightNode.calculate());
                case Operators.DIVIDE:
                    return this.leftNode.calculate().divideBy(this.rightNode.calculate());
                case Operators.EXPONENTIATE:
                    return this.leftNode.calculate().exponentiate(this.rightNode.calculate());
                case Operators.ROW_REDUCE:
                    return this.rowReduce();
                default:
                    throw "Invalid Operator";
            }
        }
    }

    /**
     * @returns {Matrix}
     * */
    rowReduce(){
        const innerValue = this.leftNode.calculate();
        if(innerValue instanceof Matrix){
            return innerValue.rowReduce();
        }
        throw "Not a matrix. Cannot be row reduced!";
    }

}
