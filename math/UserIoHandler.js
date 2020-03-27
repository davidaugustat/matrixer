class UserIoHandler {

    /**
     * Handles the entire process of validating and evaluating the user input and calculating the result.
     *
     * Takes in a math expression entered by the user. The math expression is then checked for several
     * lexical and syntactical errors by Parser.js.
     * If the parser didn't find any errors, the string will be passed to the interpreter, which interprets the
     * input and creates a tree structure consisting of TreeNode.js objects. The created tree is equivalent to
     * the user input.
     * When this tree has been created, it's mathematical solution is calculated recursively. The output of the
     * calculated tree will be a MathElement which contains the final solution. This solution is then converted to
     * a Latex string representation for outputting.
     * Additionally this method also generates a Latex representation of the user input, so that it can be displayed
     * on screen along with the solution.
     *
     * If an error occurred during this whole process, an exception is thrown by the according module. This
     * exception will be caught here and the error message is then included in the returned object.
     *
     * @param {number} field
     * @param {string} input
     * @returns {{isSuccessful: boolean, latexUserInput: string, latexResult: string, ?exception: Object}}
     */
    processCalculation(field, input){
        try {
            if(new Parser().isValidMathExpression(field, input)){
                const resultNode = new Interpreter(field).interpret(input);
                const latexResult = resultNode.calculate().toLatex();

                const latexUserInput = new InputToLatexConverter().toLatex(input);

                return {isSuccessful: true, latexUserInput: latexUserInput, latexResult: latexResult, exception: null};
            }

        } catch (exception) {
            return {isSuccessful: false, latexUserInput: "", latexResult: "", exception: exception};
        }
    }
}