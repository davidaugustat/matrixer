import UserIoHandler from "./mathEngine/stringInterpretation/UserIoHandler";

$(document).ready(function () {

    // DOM elements:
    const calculateButton = $("#calculate-btn");
    const fieldSelector = $("#field-select");
    const expressionInput = $("#expression-input");

    const errorOutput = $("#result-error-info-paragraph");
    const userInputLatexOutput = $("#user-input-latex-paragraph");
    const resultLatexOutput = $("#result-output-latex-paragraph");
    const resultCodeOutput = $("#result-output-code-span");
    const resultCodeCopyButton = $("#result-code-copy-btn");

    const resultArea = $("#result-div");
    const errorBox = $("#result-error-box");
    const resultBoxes = $(".result-box");

    const userIoHandler = new UserIoHandler();


    calculateButton.click(function () {
        const field = getField();
        const input = expressionInput.val();
        const result = new userIoHandler.processCalculation(field, input);
        displayResult(result);
    });

    resultCodeCopyButton.click(function () {
        copyToClipBoard(resultCodeOutput.text());
    });

    /**
     * Evaluates the result object and displays the result on the UI accordingly.
     *
     * Error messages are also displayed.
     *
     * @param {{isSuccessful: boolean, latexUserInput: string, latexResult: string, codeResult: string,
     * userInputResult: string, ?exception: Object}} result
     * */
    function displayResult(result){
        if(result.isSuccessful){
            displayCorrectResult(result);
        } else{
            displayErrorResult(result);
        }
    }

    /**
     * Displays the result in case there was no error and a result is available.
     *
     * @param {{isSuccessful: boolean, latexUserInput: string, latexResult: string, codeResult: string,
     * userInputResult: string, ?exception: Object}} result
     * */
    function displayCorrectResult(result){
        userInputLatexOutput.empty().append("\\[" + result.latexUserInput + "\\]");
        resultLatexOutput.html("\\[" + result.latexResult + "\\]");
        resultCodeOutput.text(result.codeResult);

        // make MathJax render the updated text:
        MathJax.typeset();

        animateUpdateResultBox(() => {
            errorBox.hide();
            resultBoxes.show();
        });
    }

    /**
     * Displays the result in case there was an error.
     *
     * @param {{isSuccessful: boolean, latexUserInput: string, latexResult: string, codeResult: string,
     * userInputResult: string, ?exception: Object}} result
     * */
    function displayErrorResult(result){
        errorOutput.text(result.exception.englishMessage);
        animateUpdateResultBox(() => {
            errorBox.show();
            resultBoxes.hide();
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

    function copyToClipBoard(text){
       const mockInput = document.createElement("textarea");
       mockInput.innerHTML = text;
       document.body.appendChild(mockInput);

       mockInput.select();
       document.execCommand("copy");

       document.body.removeChild(mockInput);
    }


    function getField() {
        const selectedValue = fieldSelector.children("option:selected").val();
        return parseInt(selectedValue);
    }
});

