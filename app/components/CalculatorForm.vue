<script setup>
import UserIoHandler from "@mathEngine/stringInterpretation/UserIoHandler";
import Helper from "@mathEngine/Helper";
import MathElementResult from "@mathEngine/stringInterpretation/result/MathElementResult";
import HomogeneousEquationSystemResult from "@mathEngine/stringInterpretation/result/HomogeneousEquationSystemResult";
import { getSiteLocale } from "~/locales/site";
import { renderMath } from "~/utils/renderMath";

const FIELD_PARAM_NAME = "field";
const EXPRESSION_PARAM_NAME = "exp";

const props = defineProps({
    locale: {
        type: String,
        required: true
    }
});

const copy = computed(() => getSiteLocale(props.locale).calculator);
const expression = ref("");
const field = ref(100);
const resultView = shallowRef(null);
const resultSequence = ref(0);
const userIoHandler = new UserIoHandler();

/**
 * Calculates the current expression and displays its result.
 *
 * @returns {void}
 */
function executeCalculateButtonAction() {
    const result = userIoHandler.processCalculation(field.value, expression.value);
    setUrlParameters(field.value, expression.value);
    displayResult(result);
}

/**
 * Converts a math-engine result into reactive view state.
 *
 * @param {Result} result Calculation result returned by the math engine.
 * @returns {void}
 */
function displayResult(result) {
    resultSequence.value += 1;

    if (!result.isSuccessful) {
        resultView.value = {
            key: resultSequence.value,
            type: "error",
            errorMessage: getErrorMessage(result)
        };
        sendCalculateEventToAnalytics(result);
        return;
    }

    if (result instanceof MathElementResult) {
        resultView.value = {
            key: resultSequence.value,
            type: "math-element",
            latexUserInput: `\\[${result.latexUserInput}\\]`,
            latexResult: `\\[${result.latexResult}\\]`,
            codeResult: result.codeResult
        };
    } else if (result instanceof HomogeneousEquationSystemResult) {
        resultView.value = {
            key: resultSequence.value,
            type: "homogeneous-equation-system",
            latexUserInput: `\\[${result.latexUserInput}\\]`,
            nonTrivialSolution: result.hasNonTrivialSolution
                ? `\\[${result.nonTrivialSolutionLatex}\\]`
                : copy.value.noSolution,
            trivialSolution: `\\[${result.trivialSolutionLatex}\\]`,
            rowReducedMatrix: `\\[${result.rowReducedMatrixLatex}\\]`
        };
    }

    sendCalculateEventToAnalytics(result);
}

/**
 * Selects the localized message for an unsuccessful calculation.
 *
 * @param {Result} result Unsuccessful calculation result.
 * @returns {string} Error text to display.
 */
function getErrorMessage(result) {
    if (props.locale === "de" && result.exception.germanMessage != null) {
        return result.exception.germanMessage;
    }
    if (result.exception.englishMessage != null) {
        return result.exception.englishMessage;
    }
    return result.exception.message;
}

/**
 * Sends the unchanged calculator event to Matomo Analytics.
 *
 * @param {{isSuccessful: boolean}} result Calculation result.
 * @returns {void}
 */
function sendCalculateEventToAnalytics(result) {
    const value = result.isSuccessful ? 1 : 0;
    window._paq = window._paq || [];
    window._paq.push(["trackEvent", "button click", "Matrixer Calculate Button", "Matrixer", value]);
}

/**
 * Copies the result code by using the same temporary-textarea approach as the legacy UI.
 *
 * @returns {void}
 */
function copyResultCode() {
    const mockInput = document.createElement("textarea");
    mockInput.innerHTML = resultView.value.codeResult;
    document.body.appendChild(mockInput);
    mockInput.select();
    document.execCommand("copy");
    document.body.removeChild(mockInput);
}

/**
 * Replaces the current query string with shareable calculator parameters.
 *
 * @param {number} fieldNumber Selected field number.
 * @param {string} expressionString Expression entered by the user.
 * @returns {void}
 */
function setUrlParameters(fieldNumber, expressionString) {
    const currentUrlPathWithoutParams = window.location.pathname;
    const encodedFieldNumber = encodeURIComponent(fieldNumber);
    const encodedExpressionString = encodeURIComponent(expressionString);
    const urlParameters = `?${FIELD_PARAM_NAME}=${encodedFieldNumber}&${EXPRESSION_PARAM_NAME}=${encodedExpressionString}`;
    window.history.pushState("", "", currentUrlPathWithoutParams + urlParameters);
}

/**
 * Restores and calculates a valid expression encoded in the current URL.
 *
 * @returns {void}
 */
function evaluateUrlParameters() {
    const urlParameters = new URLSearchParams(document.location.search.substring(1));
    const urlField = parseInt(urlParameters.get(FIELD_PARAM_NAME));
    const urlExpression = urlParameters.get(EXPRESSION_PARAM_NAME);

    if (!isNaN(urlField) && Helper.isField(urlField) && urlExpression != null) {
        expression.value = urlExpression;
        field.value = urlField;
        displayResult(userIoHandler.processCalculation(urlField, urlExpression));
    }
}

/**
 * Re-evaluates calculator parameters after browser history navigation.
 *
 * @returns {void}
 */
function handlePopState() {
    evaluateUrlParameters();
}

/**
 * Renders the result element before its Vue fade transition begins.
 *
 * @param {Element} element Result element entering the document.
 * @returns {void}
 */
function renderResultMath(element) {
    renderMath(/** @type {HTMLElement} */ (element));
}

onMounted(() => {
    window.addEventListener("popstate", handlePopState);
});

onNuxtReady(() => {
    evaluateUrlParameters();
});

onBeforeUnmount(() => {
    window.removeEventListener("popstate", handlePopState);
});
</script>

<template>
    <div class="text-center" id="expression-input-area">
        <form id="expression-input-form">
            <div class="form-group">
                <input v-model="expression" type="text" class="form-control" id="expression-input"
                       :placeholder="copy.placeholder" @keydown.enter.prevent="executeCalculateButtonAction">
            </div>
            <div class="form-group row justify-content-center">
                <label class="col-sm-2 col-form-label" for="field-select">{{ copy.fieldLabel }}</label>
                <div class="col-sm-4">
                    <select v-model.number="field" class="form-control" id="field-select">
                        <option v-for="option in copy.fieldOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="form-group row justify-content-center">
                <button type="button" class="btn btn-primary btn-lg btn-block col-sm-4" id="calculate-btn"
                        @click="executeCalculateButtonAction">{{ copy.calculate }}</button>
            </div>
        </form>
    </div>

    <Transition name="result-fade" mode="out-in" @before-enter="renderResultMath">
        <div v-if="resultView" :key="resultView.key" id="result-div">
            <div v-if="resultView.type === 'error'" class="alert alert-danger" id="result-error-box">
                <p><b>{{ copy.errorTitle }}</b></p>
                <p id="result-error-info-paragraph">{{ resultView.errorMessage }}</p>
                <p>{{ copy.errorQuestion }}
                    <a :href="`/${locale}/report-error`" target="_blank">{{ copy.reportError }}</a>
                </p>
            </div>

            <template v-else>
                <div class="result-box" id="input-feedback-div">
                    <span><b>{{ copy.inputTitle }}</b></span>
                    <p id="user-input-latex-paragraph" v-html="resultView.latexUserInput"></p>
                </div>

                <div v-if="resultView.type === 'math-element'" class="result-box" id="math-element-result-div">
                    <span><b>{{ copy.resultTitle }}</b></span>
                    <p id="math-element-latex-result-output" v-html="resultView.latexResult"></p>
                    <p class="text-center" id="math-element-result-code-area">
                        {{ copy.codeLabel }} <span class="input-example" id="math-element-result-code-output">{{ resultView.codeResult }}</span>
                        <button type="button" class="btn btn-sm btn-outline-primary" id="result-code-copy-btn"
                                @click="copyResultCode">{{ copy.copy }}</button>
                    </p>
                </div>

                <div v-else class="result-box" id="homogeneous-equation-system-result-div">
                    <span><b>{{ copy.resultTitle }}</b></span>
                    <div class="text-center">
                        <div class="hom-es-box">
                            <span>{{ copy.span }}</span>
                            <div id="hom-es-non-trivial-solution-output" v-html="resultView.nonTrivialSolution"></div>
                        </div>
                        <div class="hom-es-box">
                            <span>{{ copy.trivialSolution }}</span>
                            <div id="hom-es-trivial-solution-output" v-html="resultView.trivialSolution"></div>
                        </div>
                        <div class="hom-es-box">
                            <span>{{ copy.rowReducedMatrix }}</span>
                            <div id="hom-es-matrix-output" v-html="resultView.rowReducedMatrix"></div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </Transition>
</template>
