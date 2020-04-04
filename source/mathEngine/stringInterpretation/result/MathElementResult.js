import Result from "./Result";

export default class MathElementResult extends Result{

    /**
     * Latex representation of the result. Null if an error occurred.
     * @type {string}
     * */
    latexResult;

    /**
     * Representation of the result in user-input-notation. Null if an error occurred.
     * @type {string}
     * */
    codeResult;

    constructor(isSuccessful, latexUserInput=null, latexResult=null, codeResult=null) {
        super(isSuccessful, null, latexUserInput);
        this.latexResult = latexResult;
        this.codeResult = codeResult;
    }
}