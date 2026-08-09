<script setup>
/**
 * @file Renders localized calculator errors and successful calculation results.
 */

import { renderMath } from "~/utils/renderMath";
import { copyText } from "~/utils/clipboard";

const props = defineProps({
    locale: {
        type: String,
        required: true
    },
    copy: {
        type: Object,
        required: true
    },
    result: {
        type: Object,
        default: null
    }
});

/**
 * Copies the raw result code to the system clipboard.
 *
 * @returns {Promise<void>} Resolves after the copy attempt finishes.
 */
async function copyResultCode() {
    if (props.result?.codeResult != null) {
        await copyText(props.result.codeResult);
    }
}

/**
 * Renders escaped LaTeX text before the Vue fade transition begins.
 *
 * @param {Element} element Result element entering the document.
 * @returns {void}
 */
function renderResultMath(element) {
    renderMath(/** @type {HTMLElement} */ (element));
}
</script>

<template>
    <Transition name="result-fade" mode="out-in" @before-enter="renderResultMath">
        <div v-if="result" :key="result.key" id="result-div">
            <div v-if="result.type === 'error'" class="alert alert-danger" id="result-error-box">
                <p><b>{{ copy.errorTitle }}</b></p>
                <p id="result-error-info-paragraph">{{ result.errorMessage }}</p>
                <p>{{ copy.errorQuestion }}
                    <NuxtLink :to="`/${locale}/report-error/`" target="_blank">{{ copy.reportError }}</NuxtLink>
                </p>
            </div>

            <template v-else>
                <div class="result-box" id="input-feedback-div">
                    <span><b>{{ copy.inputTitle }}</b></span>
                    <p id="user-input-latex-paragraph">{{ result.latexUserInput }}</p>
                </div>

                <div v-if="result.type === 'math-element'" class="result-box" id="math-element-result-div">
                    <span><b>{{ copy.resultTitle }}</b></span>
                    <p id="math-element-latex-result-output">{{ result.latexResult }}</p>
                    <p class="text-center" id="math-element-result-code-area">
                        {{ copy.codeLabel }} <span class="input-example" id="math-element-result-code-output">{{ result.codeResult }}</span>
                        <button type="button" class="btn btn-sm btn-outline-primary" id="result-code-copy-btn"
                                @click="copyResultCode">{{ copy.copy }}</button>
                    </p>
                </div>

                <div v-else class="result-box" id="homogeneous-equation-system-result-div">
                    <span><b>{{ copy.resultTitle }}</b></span>
                    <div class="text-center">
                        <div class="hom-es-box">
                            <span>{{ copy.span }}</span>
                            <div id="hom-es-non-trivial-solution-output">{{ result.nonTrivialSolution }}</div>
                        </div>
                        <div class="hom-es-box">
                            <span>{{ copy.trivialSolution }}</span>
                            <div id="hom-es-trivial-solution-output">{{ result.trivialSolution }}</div>
                        </div>
                        <div class="hom-es-box">
                            <span>{{ copy.rowReducedMatrix }}</span>
                            <div id="hom-es-matrix-output">{{ result.rowReducedMatrix }}</div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </Transition>
</template>
