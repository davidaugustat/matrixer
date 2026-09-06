<script setup>
/**
 * @file Defines the shared localized header, content area, footer, and document language.
 */

import { getSiteLocale } from "~/locales/site";

const route = useRoute();
const locale = computed(() => route.meta.locale === "de" ? "de" : "en");
const copy = computed(() => getSiteLocale(locale.value));

useHead(() => ({
    htmlAttrs: {
        lang: copy.value.code,
        class: "h-100"
    },
    bodyAttrs: {
        class: "d-flex flex-column h-100"
    }
}));
</script>

<template>
    <SiteHeader :locale="locale" />
    <main role="main" class="flex-shrink-0">
        <div class="container main-content">
            <slot />
        </div>
    </main>
    <SiteFooter :locale="locale" />
</template>
