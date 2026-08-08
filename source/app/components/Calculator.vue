<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import { useI18n } from "vue-i18n";
import Helper from "../../mathEngine/Helper";
import UserIoHandler from "../../mathEngine/stringInterpretation/UserIoHandler";
import HomogeneousEquationSystemResult from "../../mathEngine/stringInterpretation/result/HomogeneousEquationSystemResult";
import MathElementResult from "../../mathEngine/stringInterpretation/result/MathElementResult";
import { trackCalculation } from "../analytics";
import { getPagePath, URL_CHANGE_EVENT } from "../routing";

const FIELD_PARAM_NAME = "field";
const EXPRESSION_PARAM_NAME = "exp";
const FIELD_NUMBERS = Object.freeze([2, 3, 4, 5, 7, 8, 9, 11, 13, 17, 19]);

const props = defineProps({
    locale: {
        type: String,
        required: true
    }
});

const { t } = useI18n();
const userIoHandler = new UserIoHandler();
const expression = ref("");
const field = ref(100);
const result = shallowRef(null);
const resultRevision = ref(0);

const hasResult = computed(() => result.value !== null);
const isSuccessful = computed(() => result.value?.isSuccessful === true);
const isMathElementResult = computed(() => result.value instanceof MathElementResult);
const isHomogeneousEquationSystemResult = computed(() => result.value instanceof HomogeneousEquationSystemResult);
const reportErrorUrl = computed(() => getPagePath(props.locale, "report-error"));
const errorMessage = computed(() => getErrorMessage(result.value));
const userInputLatex = computed(() => isSuccessful.value ? `\\[${result.value.latexUserInput}\\]` : "");
const mathElementLatex = computed(() => isMathElementResult.value ? `\\[${result.value.latexResult}\\]` : "");
const nonTrivialSolutionLatex = computed(() => {
    if (!isHomogeneousEquationSystemResult.value || !result.value.hasNonTrivialSolution) {
        return "";
    }

    return `\\[${result.value.nonTrivialSolutionLatex}\\]`;
});
const trivialSolutionLatex = computed(() => isHomogeneousEquationSystemResult.value
    ? `\\[${result.value.trivialSolutionLatex}\\]`
    : "");
const rowReducedMatrixLatex = computed(() => isHomogeneousEquationSystemResult.value
    ? `\\[${result.value.rowReducedMatrixLatex}\\]`
    : "");

/**
 * Calculates the current expression and updates the shareable URL.
 *
 * @returns {void}
 */
function calculate() {
    const calculationResult = userIoHandler.processCalculation(field.value, expression.value);
    setUrlParameters(field.value, expression.value);
    showResult(calculationResult);
}

/**
 * Makes a calculation result visible and records its analytics event.
 *
 * @param {import("../../mathEngine/stringInterpretation/result/Result").default} calculationResult The result.
 * @returns {void}
 */
function showResult(calculationResult) {
    result.value = calculationResult;
    resultRevision.value += 1;
    trackCalculation(calculationResult);
}

/**
 * Returns the best available localized error message.
 *
 * @param {object|null} calculationResult The unsuccessful result.
 * @returns {string} The localized error description.
 */
function getErrorMessage(calculationResult) {
    if (calculationResult?.isSuccessful !== false) {
        return "";
    }

    const exception = calculationResult.exception;
    if (props.locale === "de" && exception.germanMessage != null) {
        return exception.germanMessage;
    }

    return exception.englishMessage ?? exception.message;
}

/**
 * Changes the current URL to contain the selected field and expression.
 *
 * @param {number} fieldNumber The selected field number.
 * @param {string} expressionString The entered expression.
 * @returns {void}
 */
function setUrlParameters(fieldNumber, expressionString) {
    const parameters = `?${FIELD_PARAM_NAME}=${encodeURIComponent(fieldNumber)}`
        + `&${EXPRESSION_PARAM_NAME}=${encodeURIComponent(expressionString)}`;
    window.history.pushState("", "", `${window.location.pathname}${parameters}`);
    window.dispatchEvent(new Event(URL_CHANGE_EVENT));
}

/**
 * Restores and evaluates a calculation from the current URL when both parameters are valid.
 *
 * @returns {void}
 */
function evaluateUrlParameters() {
    const parameters = new URLSearchParams(window.location.search);
    const fieldNumber = Number.parseInt(parameters.get(FIELD_PARAM_NAME));
    const expressionString = parameters.get(EXPRESSION_PARAM_NAME);

    if (!Number.isNaN(fieldNumber) && Helper.isField(fieldNumber) && expressionString !== null) {
        field.value = fieldNumber;
        expression.value = expressionString;
        showResult(userIoHandler.processCalculation(fieldNumber, expressionString));
    }
}

/**
 * Copies the current code result to the clipboard.
 *
 * @returns {Promise<void>} A promise resolved after the copy attempt.
 */
async function copyResultCode() {
    const text = result.value.codeResult;
    if (navigator.clipboard?.writeText !== undefined) {
        await navigator.clipboard.writeText(text);
        return;
    }

    copyUsingTemporaryInput(text);
}

/**
 * Copies text using a temporary input for browsers without the asynchronous Clipboard API.
 *
 * @param {string} text The text to copy.
 * @returns {void}
 */
function copyUsingTemporaryInput(text) {
    const mockInput = document.createElement("textarea");
    mockInput.value = text;
    mockInput.setAttribute("readonly", "");
    mockInput.style.position = "fixed";
    mockInput.style.opacity = "0";
    document.body.appendChild(mockInput);
    mockInput.select();
    document.execCommand("copy");
    document.body.removeChild(mockInput);
}

onMounted(() => {
    evaluateUrlParameters();
    window.addEventListener("popstate", evaluateUrlParameters);
});

onBeforeUnmount(() => {
    window.removeEventListener("popstate", evaluateUrlParameters);
});
</script>

<template>
    <div id="calculator">
        <div id="expression-input-area" class="text-center">
            <form id="expression-input-form" @submit.prevent="calculate">
                <div class="form-group">
                    <input
                        id="expression-input"
                        v-model="expression"
                        type="text"
                        class="form-control"
                        :placeholder="t('calculator.placeholder')"
                    >
                </div>
                <div class="form-group row justify-content-center">
                    <label class="col-sm-2 col-form-label" for="field-select">{{ t("calculator.field") }}</label>
                    <div class="col-sm-4">
                        <select id="field-select" v-model.number="field" class="form-control">
                            <option :value="100">{{ t("calculator.realNumbers") }}</option>
                            <option v-for="fieldNumber in FIELD_NUMBERS" :key="fieldNumber" :value="fieldNumber">
                                {{ t("calculator.finiteField", { field: fieldNumber, count: fieldNumber }) }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="form-group row justify-content-center">
                    <button id="calculate-btn" type="submit" class="btn btn-primary btn-lg btn-block col-sm-4">
                        {{ t("calculator.calculate") }}
                    </button>
                </div>
            </form>
        </div>

        <Transition name="result-fade" mode="out-in">
            <div v-if="hasResult" id="result-div" :key="resultRevision" v-katex>
                <div v-if="!isSuccessful" id="result-error-box" class="alert alert-danger">
                    <p><b>{{ t("calculator.errorHeading") }}</b></p>
                    <p id="result-error-info-paragraph">{{ errorMessage }}</p>
                    <p>
                        {{ t("calculator.inputCorrect") }}
                        <a :href="reportErrorUrl" target="_blank">{{ t("calculator.reportError") }}</a>
                    </p>
                </div>

                <template v-else>
                    <div id="input-feedback-div" class="result-box">
                        <span><b>{{ t("calculator.yourInput") }}</b></span>
                        <p id="user-input-latex-paragraph">{{ userInputLatex }}</p>
                    </div>

                    <div v-if="isMathElementResult" id="math-element-result-div" class="result-box">
                        <span><b>{{ t("calculator.result") }}</b></span>
                        <p id="math-element-latex-result-output">{{ mathElementLatex }}</p>
                        <p id="math-element-result-code-area" class="text-center">
                            {{ t("calculator.code") }}
                            <span id="math-element-result-code-output" class="input-example">{{ result.codeResult }}</span>
                            <button
                                id="result-code-copy-btn"
                                type="button"
                                class="btn btn-sm btn-outline-primary"
                                @click="copyResultCode"
                            >{{ t("calculator.copy") }}</button>
                        </p>
                    </div>

                    <div v-else-if="isHomogeneousEquationSystemResult" id="homogeneous-equation-system-result-div" class="result-box">
                        <span><b>{{ t("calculator.result") }}</b></span>
                        <div class="text-center">
                            <div class="hom-es-box">
                                <span>{{ t("calculator.span") }}</span>
                                <div id="hom-es-non-trivial-solution-output">
                                    {{ result.hasNonTrivialSolution ? nonTrivialSolutionLatex : t("calculator.noSolution") }}
                                </div>
                            </div>
                            <div class="hom-es-box">
                                <span>{{ t("calculator.trivialSolution") }}</span>
                                <div id="hom-es-trivial-solution-output">{{ trivialSolutionLatex }}</div>
                            </div>
                            <div class="hom-es-box">
                                <span>{{ t("calculator.rowReducedMatrix") }}</span>
                                <div id="hom-es-matrix-output">{{ rowReducedMatrixLatex }}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </Transition>
    </div>
</template>
