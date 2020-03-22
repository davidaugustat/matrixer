class ExpressionNode {
    leftNode;
    rightNode;
    operator;
    terminalNumber;
    isTerminal;

    constructor(leftNode, rightNode, operator, terminalNumber) {
        this.leftNode = leftNode;
        this.rightNode = rightNode;
        this.operator = operator;
        this.terminalNumber = terminalNumber;

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
                    return this.leftNode.calculate() + this.rightNode.calculate();
                case operators.MULTIPLY:
                    return this.leftNode.calculate() * this.rightNode.calculate();
                case operators.SUBTRACT:
                    return this.leftNode.calculate() - this.rightNode.calculate();
                default:
                    throw "Invalid Operator";
            }
        }
    }

}