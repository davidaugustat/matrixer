export default class Result {

    /**
     * True if the calculation didn't result in an error.
     * @type {boolean}
     * */
    isSuccessful;

    /**
     * Contains an exception object, if an error occured. Otherwise null.
     * @type {?{englishMessage: string, germanMessage:String}}
     * */
    exception;

    /**
     * Latex representation of the user input. Is null if an error occurred.
     * @type {?string}
     * */
    latexUserInput;

    constructor(isSuccessful, exception=null, latexUserInput=null) {
        this.isSuccessful = isSuccessful;
        this.exception = exception;
        this.latexUserInput = latexUserInput;
    }
}