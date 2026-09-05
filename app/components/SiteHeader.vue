<script setup>
/**
 * @file Renders the localized site header and its internal Nuxt navigation.
 */

import { getSiteLocale } from "~/locales/site";

const props = defineProps({
    locale: {
        type: String,
        required: true
    }
});

const copy = computed(() => getSiteLocale(props.locale));
</script>

<template>
    <header>
        <nav class="navbar navbar-expand-md px-3">
            <NuxtLink class="navbar-brand" :to="copy.homeHref">
                <img class="logo" :alt="copy.logoAlt" src="/assets/img/matrixer-logo.svg">
            </NuxtLink>
            <div class="ms-auto">
                <NuxtLink :to="copy.languageHref" :title="copy.languageTitle" class="header-link" id="language-header-link">
                    <img id="language-icon" :alt="copy.languageAlt" :src="copy.languageIcon">
                </NuxtLink>
                <a href="https://github.com/davidaugustat/matrixer" :title="copy.githubTitle" class="header-link"
                   id="github-header-link" target="_blank">
                    <img id="github-icon" :alt="copy.githubAlt" src="/assets/img/github-logo.png">
                </a>
            </div>
        </nav>
    </header>
</template>
