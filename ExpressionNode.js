class ExpressionNode {

    /** @type {ExpressionNode} */
    leftNode;

    /** @type {ExpressionNode} */
    rightNode;

    /** @type {string} */
    operator;

    /** @type {number} */
    terminalNumber;

    /** @type {boolean} */
    isTerminal;

    /** @type {Field} */
    field;

    /**
     * @param {ExpressionNode} leftNode
     * @param {ExpressionNode} rightNode
     * @param {string} operator
     * @param {number} terminalNumber
     * @param {number} field
     * */
    constructor(leftNode, rightNode, operator, terminalNumber, field) {
        this.leftNode = leftNode;
        this.rightNode = rightNode;
        this.operator = operator;
        this.terminalNumber = terminalNumber;
        this.field = new Field(field);

        this.isTerminal = terminalNumber != null;
    }

    /**
     * @returns {number}
     * */
    calculate(){
        if(this.isTerminal){
            return this.terminalNumber;
        } else{
            switch (this.operator) {
                case operators.ADD:
                    // return this.leftNode.calculate() + this.rightNode.calculate();
                    return this.field.add(this.leftNode.calculate(), this.rightNode.calculate());
                case operators.MULTIPLY:
                    // return this.leftNode.calculate() * this.rightNode.calculate();
                    return this.field.multiply(this.leftNode.calculate(), this.rightNode.calculate());
                case operators.SUBTRACT:
                    // return this.leftNode.calculate() - this.rightNode.calculate();
                    throw "Subtraction not yet implemented";
                default:
                    throw "Invalid Operator";
            }
        }
    }

}