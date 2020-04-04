import {Constants, MathElementType, Operators} from "../Constants";
import Helper from "../Helper";
import Interpreter from "./Interpreter";
import {Exceptions} from "../Exceptions";
import Matrix from "../math/Matrix";
import HomogeneousEquationSystemResult from "./result/HomogeneousEquationSystemResult";
import InputToLatexConverter from "./InputToLatexConverter";

export default class NonMathElementInterpreter {

    /**
     * @type {number}
     * */
    field;

    /**
     * @param {number} field
     * */
    constructor(field) {
        this.field = field;
    }

    static isNonMathElementExpression(expression){
        expression = Helper.removeSpacesAndLineBreaks(expression);
        return Constants.nonMathElementOperators.some(operator => expression.startsWith(operator));
    }

    /**
     * @param {string} expression
     * @returns {Result}
     * */
    interpret(expression){
        const innerMathElement = new Interpreter(this.field).interpret(this._getInnerExpression(expression)).calculate();
        const operator = this._getOperatorName(expression);
        switch(operator){
            case Operators.SOLVE_HOMOGENEOUS:
                return this._solveHomogeneousEquationSystem(innerMathElement, expression);
            default:
                throw Exceptions.InvalidOperatorException;
        }
    }

    /**
     * @param {string} expression
     * @returns {string}
     * */
    _getOperatorName(expression){
        return expression.split('(', 2)[0];
    }

    /**
     * @param {string} expression
     * @returns {string}
     * */
    _getInnerExpression(expression){
        const firstOpeningBracketPosition = expression.indexOf('(');
        const lastClosingBracketPosition = expression.lastIndexOf(')');
        return expression.substring(firstOpeningBracketPosition+1, lastClosingBracketPosition);
    }

    /**
     * @param {Matrix} matrix
     * @param {string} expression
     * @returns {HomogeneousEquationSystemResult}
     * */
    _solveHomogeneousEquationSystem(matrix, expression){
        if(!(matrix.type === MathElementType.MATRIX)){
            throw Exceptions.NoMatrixInHomogeneousEquationOperatorException;
        }

        const solution = matrix.solveHomogeneousEquationSystem();
        const hasNonTrivialSolution = solution.vectorSolution.length > 0;

        const trivialSolutionLatex = solution.trivialSolution.toLatex();
        const nonTrivialSolutionLatex = this._nonTrivialSolutionToLatex(solution.vectorSolution);
        const rowReducedMatrixLatex = solution.rowReducedMatrix.toLatex();
        const latexUserInput = new InputToLatexConverter().toLatex(expression);

        return new HomogeneousEquationSystemResult(true, latexUserInput, hasNonTrivialSolution, nonTrivialSolutionLatex,
            trivialSolutionLatex, rowReducedMatrixLatex);
    }

    /**
     * @param {[Vector]} nonTrivialSolution
     * @returns {string}
     * */
    _nonTrivialSolutionToLatex(nonTrivialSolution){
        let latex = "\\langle";
        for(let i = 0; i < nonTrivialSolution.length; i++){
            latex += nonTrivialSolution[i].toLatex();
            if(i < nonTrivialSolution.length - 1){
                latex += ",";
            }
        }
        latex += "\\rangle";
        return latex;
    }


}