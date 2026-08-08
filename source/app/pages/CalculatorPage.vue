<script setup>
import { computed, defineAsyncComponent } from "vue";
import { useI18n } from "vue-i18n";
import Calculator from "../components/Calculator.vue";

const props = defineProps({
    locale: {
        type: String,
        required: true
    }
});

const { t } = useI18n();
const instructionsComponent = computed(() => props.locale === "de"
    ? defineAsyncComponent(() => import("./instructions/InstructionsDe.vue"))
    : defineAsyncComponent(() => import("./instructions/InstructionsEn.vue")));
</script>

<template>
    <p id="introduction-text" class="lead text-muted">{{ t("calculator.introduction") }}</p>
    <Calculator :locale="locale" />
    <component :is="instructionsComponent" />
</template>
