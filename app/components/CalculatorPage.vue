<script setup>
/**
 * @file Composes the localized calculator, introduction, and instruction content.
 */

import { getSiteLocale } from "~/locales/site";
import { renderMath } from "~/utils/renderMath";

const props = defineProps({
    locale: {
        type: String,
        required: true
    }
});

const copy = computed(() => getSiteLocale(props.locale));
const documentation = ref(null);

onMounted(() => {
    renderMath(documentation.value);
});
</script>

<template>
    <p class="lead text-muted" id="introduction-text">{{ copy.introduction }}</p>
    <CalculatorForm :locale="locale" />
    <div ref="documentation">
        <ContentInstructionsDe v-if="locale === 'de'" />
        <ContentInstructionsEn v-else />
    </div>
</template>
