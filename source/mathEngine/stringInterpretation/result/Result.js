/**
 * General class that represents a result which is passed from the math engine to the GUI. This class
 * can hold a boolean stating if the calculation was successful, an exception (in case an error occurred) and a
 * latex representation of the user input.
 *
 * This class may only be used for Result objects that contain an exception. Do not create objects of this class to
 * return a successful result. Instead use the according subtype for it.
 *
 * Known subtypes of this class are MathElementResult and HomogeneousEquationSystemResult.
 *
 * @author David Augustat
 * */
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

    /**
     * @param {boolean} isSuccessful
     * @param {?{englishMessage: string, germanMessage: string}} exception
     * @param {?string} latexUserInput
     * */
    constructor(isSuccessful, exception=null, latexUserInput=null) {
        this.isSuccessful = isSuccessful;
        this.exception = exception;
        this.latexUserInput = latexUserInput;
    }
}