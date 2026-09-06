/**
 * @file Provides calculator orchestration and converts math-engine results into UI state.
 */

import UserIoHandler from "@mathEngine/stringInterpretation/UserIoHandler";
import MathElementResult from "@mathEngine/stringInterpretation/result/MathElementResult";
import HomogeneousEquationSystemResult from "@mathEngine/stringInterpretation/result/HomogeneousEquationSystemResult";

/**
 * Creates reactive calculator state for one localized calculator form.
 *
 * @param {import("vue").Ref<string>} locale Active locale code.
 * @param {import("vue").ComputedRef<object>} copy Localized calculator copy.
 * @returns {{resultView: import("vue").ShallowRef<object|null>, calculate: function(number, string): void,
 *     isCurrentCalculation: function(number, string): boolean, reset: function(): void}} Calculator state and actions.
 */
export function useCalculator(locale, copy) {
    const { $matomoClient } = useNuxtApp();
    const resultView = shallowRef(null);
    const userIoHandler = new UserIoHandler();
    let resultSequence = 0;
    let lastCalculation = null;

    /**
     * Selects the localized message for an unsuccessful calculation.
     *
     * @param {Result} result Unsuccessful calculation result.
     * @returns {string} Error text to display.
     */
    function getErrorMessage(result) {
        if (locale.value === "de" && result.exception.germanMessage != null) {
            return result.exception.germanMessage;
        }
        if (result.exception.englishMessage != null) {
            return result.exception.englishMessage;
        }
        return result.exception.message;
    }

    /**
     * Converts a math-engine result into reactive view state.
     *
     * @param {Result} result Calculation result returned by the math engine.
     * @returns {void}
     */
    function displayResult(result) {
        resultSequence += 1;

        if (!result.isSuccessful) {
            resultView.value = {
                key: resultSequence,
                type: "error",
                errorMessage: getErrorMessage(result)
            };
            $matomoClient.sendCalculateEventToAnalytics(result);
            return;
        }

        if (result instanceof MathElementResult) {
            resultView.value = {
                key: resultSequence,
                type: "math-element",
                latexUserInput: `\\[${result.latexUserInput}\\]`,
                latexResult: `\\[${result.latexResult}\\]`,
                codeResult: result.codeResult
            };
        } else if (result instanceof HomogeneousEquationSystemResult) {
            resultView.value = {
                key: resultSequence,
                type: "homogeneous-equation-system",
                latexUserInput: `\\[${result.latexUserInput}\\]`,
                nonTrivialSolution: result.hasNonTrivialSolution
                    ? `\\[${result.nonTrivialSolutionLatex}\\]`
                    : copy.value.noSolution,
                trivialSolution: `\\[${result.trivialSolutionLatex}\\]`,
                rowReducedMatrix: `\\[${result.rowReducedMatrixLatex}\\]`
            };
        }

        $matomoClient.sendCalculateEventToAnalytics(result);
    }

    /**
     * Calculates an expression and stores its result for rendering.
     *
     * @param {number} fieldNumber Selected field number.
     * @param {string} expressionString Expression entered by the user.
     * @returns {void}
     */
    function calculate(fieldNumber, expressionString) {
        lastCalculation = {
            fieldNumber,
            expressionString
        };
        displayResult(userIoHandler.processCalculation(fieldNumber, expressionString));
    }

    /**
     * Checks whether the displayed result belongs to the given calculator query.
     *
     * @param {number} fieldNumber Selected field number.
     * @param {string} expressionString Expression entered by the user.
     * @returns {boolean} Whether this calculation is already displayed.
     */
    function isCurrentCalculation(fieldNumber, expressionString) {
        return lastCalculation?.fieldNumber === fieldNumber
            && lastCalculation?.expressionString === expressionString;
    }

    /**
     * Clears the displayed result and its associated query state.
     *
     * @returns {void}
     */
    function reset() {
        lastCalculation = null;
        resultView.value = null;
    }

    return {
        resultView,
        calculate,
        isCurrentCalculation,
        reset
    };
}
