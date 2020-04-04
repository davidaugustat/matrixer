import Result from "./Result";

/**
 * Result class specified for results that directly contain a subtype of MathElement as a solution.
 *
 * This class extends Result by adding attributes for a result string in latex representation as well as in
 * user-input-notation ("code").
 *
 * Only create objects of this class in case the calculation was successful. Otherwise create an object directly
 * from the Result class.
 *
 * @author David Augustat
 * */
export default class MathElementResult extends Result{

    /**
     * Latex representation of the result.
     * @type {string}
     * */
    latexResult;

    /**
     * Representation of the result in user-input-notation.
     * @type {string}
     * */
    codeResult;

    /**
     * @param {string} latexUserInput
     * @param {string} latexResult
     * @param {string} codeResult
     * */
    constructor(latexUserInput, latexResult, codeResult) {
        super(true, null, latexUserInput);
        this.latexResult = latexResult;
        this.codeResult = codeResult;
    }
}