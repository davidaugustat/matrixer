<script setup>
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
        <nav class="navbar navbar-expand-md navbar-light">
            <a class="navbar-brand" :href="copy.homeHref">
                <img class="logo" :alt="copy.logoAlt" src="/assets/img/matrixer-logo.svg">
            </a>
            <div class="ml-auto">
                <a :href="copy.languageHref" :title="copy.languageTitle" class="header-link" id="language-header-link">
                    <img id="language-icon" :alt="copy.languageAlt" :src="copy.languageIcon">
                </a>
                <a href="https://github.com/davidaugustat/matrixer" :title="copy.githubTitle" class="header-link"
                   id="github-header-link" target="_blank">
                    <img id="github-icon" :alt="copy.githubAlt" src="/assets/img/github-logo.png">
                </a>
            </div>
        </nav>
    </header>
</template>
