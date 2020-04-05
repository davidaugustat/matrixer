import {Constants, MathElementType, Operators} from "../Constants";
import Helper from "../Helper";
import Interpreter from "./Interpreter";
import {Exceptions} from "../Exceptions";
import Matrix from "../math/Matrix";
import HomogeneousEquationSystemResult from "./result/HomogeneousEquationSystemResult";
import InputToLatexConverter from "./InputToLatexConverter";

/**
 * This class can interpret operators that do not return a MathElement as a result.
 *
 * They need to be treated separately because they cannot be nested in or combined with other calculations, since
 * their return value is not a MathElement.
 *
 * An example for a Non-MathElement-Operator is "solvehom", an operator for solving a homogeneous equation system.
 * This operator returns an object containing a set of vectors, a trivial solution vector as well as a matrix, and
 * therefore doesn't return a direct subtype of MathElement, but a collection of several MathElements.
 *
 * @author David Augustat
 * */
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

    /**
     * Checks if a given expression string uses a non-math-element operator and returns true if so. Otherwise false.
     *
     * This is achieved by checking if the expression string starts with one of the defined non-math-element
     * operator strings. Since non-math-element operators cannot be nested or combined, checking the beginning of
     * the string is sufficient.
     *
     * @param {string} expression The expression to check
     * @returns {boolean} True if expression uses non-math-element operator
     * */
    static isNonMathElementExpression(expression){
        expression = Helper.removeSpacesAndLineBreaks(expression);
        expression = expression.toLowerCase();
        return Constants.nonMathElementOperators.some(operator => expression.startsWith(operator));
    }

    /**
     * Interprets a non-math-element operator and returns a Result object that matches the return type of the operator.
     *
     * This is achieved by extracting the operator name and the inner expression (in the outermost brackets) from
     * the string. the inner expression is then interpreted and calculated as a normal MathElement using Interpreter.js.
     *
     * According to which operator has been detected, the calculated inner MathElement gets passed to another method
     * which applies the operator on that inner MathElement and returns a matching subtype of Result.js.
     *
     * Note that this method expects a VALID math expression that uses only a non-math-element operator as the outermost
     * part of the expression. Invalid expressions won't be checked and might lead to unexpected behavior.
     *
     * @param {string} expression The complete expression string in user-input-notation
     * @returns {Result} Result object that matches the return type of the operator, e.g.
     * HomogeneousEquationSystemResult in case of the operator being "solvehom"
     * */
    interpret(expression){
        expression = Helper.removeSpacesAndLineBreaks(expression);
        expression = expression.toLowerCase();
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
     * Extracts the used non-math-element-operator name from the expression.
     *
     * This is achieved by splitting the expression string at the first opening round bracket and then returning the
     * part before that bracket.
     *
     * E.g. "solvehom({1,2;3,4})" becomes "solvehom"
     *
     * @param {string} expression
     * @returns {string}
     * */
    _getOperatorName(expression){
        return expression.split('(', 2)[0];
    }

    /**
     * Extracts the inner expression string from the expression.
     *
     * This is achieved by splitting the input string at the first opening and last closing bracket and then
     * returning the part between those brackets.
     *
     * E.g. "solvehom({1,2;3,4})" becomes "{1,2;3,4}"
     *
     * @param {string} expression
     * @returns {string}
     * */
    _getInnerExpression(expression){
        const firstOpeningBracketPosition = expression.indexOf('(');
        const lastClosingBracketPosition = expression.lastIndexOf(')');
        return expression.substring(firstOpeningBracketPosition+1, lastClosingBracketPosition);
    }

    /**
     * Handles the "solvehom" operator which solves a homogeneous equation system by taking a matrix as an input and
     * providing a span of vectors, a trivial vector (zero vector), and the given matrix in row-echelon-form as an
     * output.
     *
     * This method generates all latex outputs and returns a result object that can directly be passed to the GUI.
     *
     * If the input (matrix) is not a Matrix object, an exception will be thrown.
     *
     * @param {Matrix} matrix The Matrix object to use for solving the homogeneous equation system
     * @param {string} expression The complete string expression in user-input-notation (necessary to generate a
     * Latex representation of the user input)
     * @returns {HomogeneousEquationSystemResult}
     * */
    _solveHomogeneousEquationSystem(matrix, expression){
        if(!(matrix.type === MathElementType.MATRIX)){
            throw Exceptions.NoMatrixInHomogeneousEquationOperatorException;
        }

        const solution = matrix.solveHomogeneousEquationSystem();
        const hasNonTrivialSolution = solution.vectorSolution.length > 0;

        const trivialSolutionLatex = solution.trivialSolution.toLatex();
        let nonTrivialSolutionLatex;
        if(hasNonTrivialSolution) {
            nonTrivialSolutionLatex = this._nonTrivialSolutionToLatex(solution.vectorSolution);
        } else{
            nonTrivialSolutionLatex = null;
        }
        const rowReducedMatrixLatex = solution.rowReducedMatrix.toLatex();
        const latexUserInput = new InputToLatexConverter().toLatex(expression);

        return new HomogeneousEquationSystemResult(latexUserInput, hasNonTrivialSolution, nonTrivialSolutionLatex,
            trivialSolutionLatex, rowReducedMatrixLatex);
    }

    /**
     * Converts an array of vectors to a latex representation of a vectors span and returns it as a string.
     *
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