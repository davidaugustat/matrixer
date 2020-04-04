import Result from "./Result";

/**
 * Class that represents the result of solving a homogeneous equation system.
 *
 * This class extends the Result class by adding attributes for a trivial and non-trivial solution in latex
 * representation as well as the row-reduced matrix in latex representation. Additionally a boolean states if a
 * non-trivial solution exists.
 *
 * Do not create objects from this class in case an error occurred. Create an object of the Result class directly
 * instead.
 *
 * @author David Augustat
 * */
export default class HomogeneousEquationSystemResult extends Result{

    /**
     * True, if a non-trivial solution for the homogeneous equation system exists, otherwise false.
     * @type {boolean}
     * */
    hasNonTrivialSolution;

    /**
     * Contains all vectors that belong to the linear span that build the solution of the equation system.
     * If no non-trivial solution exists, this is null.
     * @type {?string}
     * */
    nonTrivialSolutionLatex;

    /**
     * Trivial solution of the homogeneous equation system, which is always a single vector containing only zeroes.
     * @type {string}
     * */
    trivialSolutionLatex;

    /**
     * Row-reduced matrix that has been created as a byproduct of solving the homogeneous equation system.
     * @type {string}
     * */
    rowReducedMatrixLatex;

    /**
     * @param {string} latexUserInput
     * @param {boolean} hasNonTrivialSolution
     * @param {?string} nonTrivialSolutionLatex
     * @param {string} trivialSolutionLatex
     * @param {string} rowReducedMatrixLatex
     * */
    constructor(latexUserInput, hasNonTrivialSolution,
                nonTrivialSolutionLatex=null, trivialSolutionLatex, rowReducedMatrixLatex) {

        super(true, null, latexUserInput);

        this.hasNonTrivialSolution = hasNonTrivialSolution;
        this.nonTrivialSolutionLatex = nonTrivialSolutionLatex;
        this.trivialSolutionLatex = trivialSolutionLatex;
        this.rowReducedMatrixLatex = rowReducedMatrixLatex;
    }
}