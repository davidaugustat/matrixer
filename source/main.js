import UserIoHandler from "./mathEngine/stringInterpretation/UserIoHandler";
import Helper from "./mathEngine/Helper";
import MathElementResult from "./mathEngine/stringInterpretation/result/MathElementResult";
import HomogeneousEquationSystemResult from "./mathEngine/stringInterpretation/result/HomogeneousEquationSystemResult";

/**
 * Main JavaScript file handling everything on the GUI of the website.
 *
 * @author David Augustat
 * */
$(document).ready(function () {

    // Constants:
    const FIELD_PARAM_NAME = "field";
    const EXPRESSION_PARAM_NAME = "exp";

    // DOM elements:
    const calculateButton = $("#calculate-btn");
    const fieldSelector = $("#field-select");
    const expressionInput = $("#expression-input");

    const errorOutput = $("#result-error-info-paragraph");
    const userInputLatexOutput = $("#user-input-latex-paragraph");


    const mathElementLatexResultOutput = $("#math-element-latex-result-output");
    const mathElementResultCodeOutput = $("#math-element-result-code-output");
    const resultCodeCopyButton = $("#result-code-copy-btn");


    const homogeneousEquationSystemVectorSolutionOutput = $("#hom-es-non-trivial-solution-output");
    const homogeneousEquationSystemTrivialSolutionOutput = $("#hom-es-trivial-solution-output");
    const homogeneousEquationSystemMatrixOutput = $("#hom-es-matrix-output");

    const userInputLatexOutputArea = $("#input-feedback-div");
    const mathElementResultArea = $("#math-element-result-div");
    const homogeneousEquationSystemResultArea = $("#homogeneous-equation-system-result-div");
    const errorBox = $("#result-error-box");
    const resultArea = $("#result-div");
    const resultBoxes = $(".result-box");

    const userIoHandler = new UserIoHandler();

    evaluateUrlParameters();
    setupCalculateButton();
    setupEnterKey();
    setupCodeCopyButton();
    setupBackForwardButtonHandling();


    /**
     * Sets up the calculate button, so that the expression and field inputs are evaluated and the result gets
     * calculated, when the user presses that button.
     * */
    function setupCalculateButton(){
        calculateButton.click(function () {
            executeCalculateButtonAction();
        });
    }

    /**
     * Sets up the enter key to act the same as the calculate button.
     *
     * When The enter key is pressed while the expression input field is focused, the entered expression will be
     * calculated.
     * */
    function setupEnterKey(){
        expressionInput.keypress(function (event) {
            if(event.keyCode === 13){
                event.preventDefault();
                executeCalculateButtonAction();
            }
        })
    }

    /**
     * Sets up the code copy button, so that the displayed result code gets copied to the clipboard when the
     * user presses that button.
     * */
    function setupCodeCopyButton(){
        resultCodeCopyButton.click(function () {
            copyToClipBoard(mathElementResultCodeOutput.text());
        });
    }

    /**
     * Sets up a listener that checks if either the back or the forward of the browser got clicked. If this is the
     * case, the new URL will be evaluated and the result will be calculated.
     *
     * This makes it possible for the user to skip back and forth between different calculations.
     * */
    function setupBackForwardButtonHandling(){
        $(window).bind("popstate", function () {
            evaluateUrlParameters();
        });
    }

    function executeCalculateButtonAction(){
        const field = getField();
        const input = expressionInput.val();
        const result = userIoHandler.processCalculation(field, input);
        setUrlParameters(field, input);
        displayResult(result);
    }

    /**
     * Evaluates the result object and displays the result on the UI accordingly.
     *
     * Error messages are also displayed.
     *
     * @param {Result} result
     * */
    function displayResult(result){
        if(result.isSuccessful){
            displayCorrectResult(result);
        } else{
            displayErrorResult(result);
        }
        sendCalculateEventToAnalytics(result);
    }

    /**
     * Displays the result in case there was no error and a result is available.
     *
     * @param {Result} result
     * */
    function displayCorrectResult(result){
        animateUpdateResultBox(() => {
            userInputLatexOutput.empty().append("\\[" + result.latexUserInput + "\\]");

            if(result instanceof MathElementResult){
                displayMathElementResult(result);
            } else if(result instanceof HomogeneousEquationSystemResult){
                displayHomogeneousEquationSystemResult(result);
            }

            // make Katex render the math expressions:
            renderMathInElement(document.getElementById("result-div"));

            errorBox.hide();
            userInputLatexOutputArea.show();
        });
    }

    /**
     * Displays the result in case there was an error.
     *
     * This method checks the current language (German or English) and outputs the error message in the according
     * language.
     *
     * @param {Result} result
     * */
    function displayErrorResult(result){
        let errorMessage;
        if(isGermanLanguage() && result.exception.germanMessage != null){
            errorMessage = result.exception.germanMessage;
        } else if(result.exception.englishMessage != null){
            errorMessage = result.exception.englishMessage;
        } else {
            // Fallback if system-exception has been thrown:
            errorMessage = result.exception.message;
        }

        animateUpdateResultBox(() => {
            errorOutput.text(errorMessage);
            errorBox.show();
            resultBoxes.hide();
        });
    }

    /**
     * @param {MathElementResult} result
     * */
    function displayMathElementResult(result){
        mathElementLatexResultOutput.html("\\[" + result.latexResult + "\\]");
        mathElementResultCodeOutput.text(result.codeResult);

        mathElementResultArea.show();
        homogeneousEquationSystemResultArea.hide();
    }

    /**
     * @param {HomogeneousEquationSystemResult} result
     * */
    function displayHomogeneousEquationSystemResult(result){
        if(result.hasNonTrivialSolution) {
            homogeneousEquationSystemVectorSolutionOutput.html("\\[" + result.nonTrivialSolutionLatex + "\\]");
        } else {
            homogeneousEquationSystemVectorSolutionOutput.html(getNoSolutionText());
        }
        homogeneousEquationSystemTrivialSolutionOutput.html("\\[" + result.trivialSolutionLatex + "\\]");
        homogeneousEquationSystemMatrixOutput.html("\\[" + result.rowReducedMatrixLatex + "\\]");

        mathElementResultArea.hide();
        homogeneousEquationSystemResultArea.show();
    }

    function getNoSolutionText(){
        if(isGermanLanguage()){
            return "Keine Lösung";
        } else {
            return "No Solution";
        }
    }

    /**
     * Sends an event to Google Analytics
     *
     * @param {{isSuccessful: boolean, latexUserInput: string, latexResult: string, codeResult: string,
     * userInputResult: string, ?exception: Object}} result
     * */
    function sendCalculateEventToAnalytics(result){
        const action = "Matrixer Calculate Button";
        const category = "button click";
        const label = "Matrixer";
        // since value must be an integer, 1 means successful and 0 means unsuccessful:
        const value = result.isSuccessful ? 1 : 0;

        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }

    /**
     * Lets the old result fade out. Then the provided callback is executed. Afterwards the new result fades in.
     *
     * @param {function()} updateLayout What should be done when the layout is invisible
     * */
    function animateUpdateResultBox(updateLayout){
        resultArea.fadeOut("fast", function () {
            updateLayout();
            resultArea.fadeIn("fast");
        })
    }

    /**
     * Copies the provided text to the clipboard.
     *
     * This is done by creating a mock textarea DOM element and applying the "copy" command to it. The mock
     * textarea gets deleted as soon as the text is copied.
     *
     * @param {string} text The text to copy to the clipboard.
     * */
    function copyToClipBoard(text){
       const mockInput = document.createElement("textarea");
       mockInput.innerHTML = text;
       document.body.appendChild(mockInput);

       mockInput.select();
       document.execCommand("copy");

       document.body.removeChild(mockInput);
    }

    /**
     * Retrieves the field number of the selected field from the selector DOM element.
     *
     * @returns {number} the number of the selected field. This number matches the constant definition in Field.js.
     * */
    function getField() {
        const selectedValue = fieldSelector.children("option:selected").val();
        return parseInt(selectedValue);
    }

    /**
     * Converts the provided field and mathematical expression into URL parameters and changes the current URL
     * to a URL that has these URL parameters. Any existing parameters will be replaced.
     *
     * @param {number} fieldNumber
     * @param {string} expression
     * */
    function setUrlParameters(fieldNumber, expression){
        const currentUrlPathWithoutParams = window.location.pathname;
        const encodedFieldNumber = encodeURIComponent(fieldNumber);
        const encodedExpressionString = encodeURIComponent(expression);
        const urlParameters = "?" + FIELD_PARAM_NAME + "=" + encodedFieldNumber
            + "&" + EXPRESSION_PARAM_NAME + "=" + encodedExpressionString;
        const newUrl = currentUrlPathWithoutParams + urlParameters;
        window.history.pushState("", "", newUrl);
    }

    /**
     * Checks if the current URL has parameters for field and expression that contain a valid field number
     * and an expression string. If this is the case, these values will be passed to the UserIoHandler for
     * evaluation and calculation. The input values as well as the result will be displayed to the user.
     *
     * This method enables it to pass a field and expression as URL parameters, so that it is possible to share a
     * link that leads to a specific calculation.
     * */
    function evaluateUrlParameters(){
        const urlParameters = new URLSearchParams(document.location.search.substring(1));
        const field = parseInt(urlParameters.get(FIELD_PARAM_NAME));
        const expression = urlParameters.get(EXPRESSION_PARAM_NAME);

        if(field != null && !isNaN(field) && Helper.isField(field) && expression != null){
            expressionInput.val(expression);
            fieldSelector.val(field);
            const result = userIoHandler.processCalculation(field, expression);
            displayResult(result);
        }
    }

    /**
     * Obtains the language from the html "lang" element and returns true, if lang="de". Otherwise returns false.
     *
     * @returns {boolean}
     * */
    function isGermanLanguage(){
        const language = document.documentElement.lang;
        return language === "de";
    }
});

