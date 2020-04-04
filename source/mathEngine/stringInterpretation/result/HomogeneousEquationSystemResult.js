import Result from "./Result";

export default class HomogeneousEquationSystemResult extends Result{

    /**
     * True, if a non-trivial solution for the homogeneous equation system exists., otherwise false.
     * Null if an error occurred.
     * @type {boolean}
     * */
    hasNonTrivialSolution;

    /**
     * Contains all vectors that belong to the linear span that build the solution of the equation system.
     * Null if an error occurred.
     * @type {string}
     * */
    nonTrivialSolutionLatex;

    /**
     * Trivial solution of the homogeneous equation system, which is always a single vector containing only zeroes.
     * Null if an error occurred.
     * @type {string}
     * */
    trivialSolutionLatex;

    /**
     * Row-reduced matrix that has been created as a byproduct of solving the homogeneous equation system.
     * Null if an error occurred.
     * @type {string}
     * */
    rowReducedMatrixLatex;

    /**
     * @param {boolean} isSuccessful
     * @param {string} latexUserInput
     * @param {?boolean} hasNonTrivialSolution
     * @param {?string} nonTrivialSolutionLatex
     * @param {?string} trivialSolutionLatex
     * @param {?string} rowReducedMatrixLatex
     * */
    constructor(isSuccessful, latexUserInput, hasNonTrivialSolution=null,
                nonTrivialSolutionLatex=null, trivialSolutionLatex=null, rowReducedMatrixLatex=null) {

        super(isSuccessful, null, latexUserInput);

        this.hasNonTrivialSolution = hasNonTrivialSolution;
        this.nonTrivialSolutionLatex = nonTrivialSolutionLatex;
        this.trivialSolutionLatex = trivialSolutionLatex;
        this.rowReducedMatrixLatex = rowReducedMatrixLatex;
    }
}