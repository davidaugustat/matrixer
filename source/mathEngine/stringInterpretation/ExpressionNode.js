import {Operators} from "../Constants";
import {Exceptions} from "../Exceptions";
import Matrix from "../math/Matrix";

/**
 * Class that represents a node of a binary tree that can store mathematical expressions.
 * Each node can have one of the following structures:
 *
 * - The node is a double-outgoing intermediate node, meaning it has two outgoing nodes and and operator. The left and
 * right nodes are sub-expressions, that are conjugated by the operator. E.g. when the left node holds the expression
 * (2+3) and the right node holds the expression (4+5) and the operator is '*', then the current node represents the
 * expression (2+3)*(4+5).
 *
 * - The node is a single-outgoing intermediate node, meaning it only has one outgoing node and an operator.
 * In this case, the left branch must contain the single outgoing node. This structure can be used for function
 * operators that only have one expression as parameter.
 * E.g. rowreduce({1,2:3,4}) is such a case, where rowreduce is the function operator and the contained matrix
 * is the single parameter.
 *
 * - The node is a terminal (leaf), meaning it only holds a single MathElement object (e.g. a RealNumber).
 *
 * @author David Augustat
 * */
export default class ExpressionNode {

    /**
     * The left ExpressionNode containing the sub-expression before the operator
     * @type {ExpressionNode} */
    leftNode;

    /**
     * The right ExpressionNode containing the sub-expression after the operator
     * @type {ExpressionNode} */
    rightNode;

    /**
     * The character of the operator used (+, -, ...). Must be an element of Operators in Constants.js
     * @type {string} */
    operator;

    /**
     * The number that is stored in a leaf node (if the node is a leaf node)
     * @type {MathElement} */
    terminalElement;

    /**
     * indicates if the current node is a leaf
     * @type {boolean} */
    isTerminal;

    /**
     * Indicates if the current node only has one outgoing node. In this case, the only outgoing node MUST be
     * the left node.
     * @type {boolean} */
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
     * Calculates the result of the current node by recursively calculating the results of the left and
     * right nodes attached to this node and then combines them using the operator specified in the node.
     *
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
                    return this._rowReduce();
                case Operators.TRANSPOSE:
                    return this._transpose();
                default:
                    throw Exceptions.InvalidOperatorException;
            }
        }
    }

    /**
     * Internal method to check if the left node is a matrix. If it is, a copy of the matrix in row-echelon-form
     * will be returned. Otherwise an exception will be thrown, because only matrices can be row-reduced.
     *
     * @returns {Matrix}
     * */
    _rowReduce(){
        const innerValue = this.leftNode.calculate();
        if(innerValue instanceof Matrix){
            return innerValue.rowReduce();
        }
        throw Exceptions.RowReduceNotAMatrixException;
    }

    /**
     * Internal method to check if the left node is a matrix. If it is, a copy of the matrix in row-echelon-form
     * will be returned. Otherwise an exception will be thrown, because only matrices can be row-reduced.
     *
     * @returns {Matrix}
     * */
    _transpose(){
        const innerValue = this.leftNode.calculate();
        if(innerValue instanceof Matrix){
            return innerValue.transpose();
        }
        throw Exceptions.RowReduceNotAMatrixException;
    }

}
