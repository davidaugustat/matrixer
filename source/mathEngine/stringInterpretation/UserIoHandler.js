import Parser from "./Parser";
import InputToLatexConverter from "./InputToLatexConverter";
import Interpreter from "./Interpreter";
import NonMathElementInterpreter from "./NonMathElementInterpreter";
import Result from "./result/Result";
import MathElementResult from "./result/MathElementResult";

/**
 * Class that handles the connection between the user interface and the math engine.
 *
 * This includes the validation, interpretation and calculation of a mathematical expresion string as well as the
 * feedback of the math engine to the UI including solution feedback and error feedback.
 *
 * @author David Augustat
 * */
export default class UserIoHandler {

    /**
     * Handles the entire process of validating and evaluating the user input and calculating the result.
     *
     * Takes in a math expression entered by the user. The math expression is then checked for several
     * lexical and syntactical errors by Parser.js.
     * If the parser didn't find any errors, the string will be passed to the interpreter (Interpreter.js for
     * expressions that return a MathElement, NonMathElementInterpreter.js for those who not), which interprets the
     * input and creates a tree structure consisting of TreeNode.js objects. The created tree is equivalent to
     * the user input.
     * When this tree has been created, it's mathematical solution is calculated recursively. The output of the
     * calculated tree will be a MathElement which contains the final solution. This solution is then converted to
     * a Latex string representation for outputting as well as a user input string representation that the user can
     * use in another calculation.
     * Additionally this method also generates a Latex representation of the user input, so that it can be displayed
     * on screen along with the solution.
     *
     * If an error occurred during this whole process, an exception is thrown by the according module. This
     * exception will be caught here and the error message is then included in the returned object.
     *
     * @param {number} field
     * @param {string} input
     * @returns {Result} The result object containing all Latex strings, Exception and other parameters related to
     * the input and result of the calculation.
     */
    processCalculation(field, input){
        try {
            if(new Parser().isValidMathExpression(field, input)){
                if(NonMathElementInterpreter.isNonMathElementExpression(input)){
                    return this._processNonMathElementExpression(field, input);
                } else {
                    return this._processMathElementExpression(field, input);
                }
            }

        } catch (exception) {
            return new Result(false, exception);
        }
    }

    /**
     * Processes calculations for operators that do NOT return a MathElement and can't therefore be used in further
     * calculations.
     *
     * @param {number} field The field to calculate on
     * @param {string} input The complete input string from the user input
     * @returns {Result} A result object that can directly be passed to the GUI and contains all important result data.
     * */
    _processNonMathElementExpression(field, input){
        return new NonMathElementInterpreter(field).interpret(input);
    }

    /**
     * Processes calculations for operators that return a MathElement. This is the regular case.
     *
     * @param {number} field The field to calculate on
     * @param {string} input The complete input string from the user input
     * @returns {MathElementResult} An object that includes the result in latex and user-input-notation, as well as
     * the user input as a latex representation and a boolean that tells that the calculation was successful.
     * */
    _processMathElementExpression(field, input){
        const resultNode = new Interpreter(field).interpret(input);
        const mathElementResult = resultNode.calculate();

        const latexResult = mathElementResult.toLatex();
        const codeResult = mathElementResult.toUserInputString();
        const latexUserInput = new InputToLatexConverter().toLatex(input);

        return new MathElementResult(latexUserInput, latexResult, codeResult);
    }
}