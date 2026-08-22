<script setup>
/**
 * @file Renders calculator controls and connects committed input to calculator and router state.
 */

import { getSiteLocale } from "~/locales/site";
import { useCalculator } from "~/composables/useCalculator";
import { useCalculatorQuery } from "~/composables/useCalculatorQuery";

const props = defineProps({
    locale: {
        type: String,
        required: true
    }
});

const locale = toRef(props, "locale");
const copy = computed(() => getSiteLocale(props.locale).calculator);
const expression = ref("");
const field = ref(100);
const { resultView, calculate, isCurrentCalculation, reset } = useCalculator(locale, copy);

/**
 * Applies calculator state represented by the current Vue Router query.
 *
 * @param {{fieldNumber: number, expressionString: string}|null} query Calculator query or null when it was cleared.
 * @returns {void}
 */
function applyCalculatorQuery(query) {
    if (query == null) {
        expression.value = "";
        field.value = 100;
        reset();
        return;
    }

    expression.value = query.expressionString;
    field.value = query.fieldNumber;
    if (!isCurrentCalculation(query.fieldNumber, query.expressionString)) {
        calculate(query.fieldNumber, query.expressionString);
    }
}

const { setCalculatorQuery } = useCalculatorQuery(applyCalculatorQuery);

/**
 * Calculates the current expression and pushes its shareable URL through Vue Router.
 *
 * @returns {Promise<void>} Resolves after the URL has been updated.
 */
async function executeCalculateButtonAction() {
    calculate(field.value, expression.value);
    await setCalculatorQuery(field.value, expression.value);
}
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

    <CalculatorResult :locale="locale" :copy="copy" :result="resultView" />
</template>
