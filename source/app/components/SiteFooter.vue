<script setup>
/**
 * @file Renders Matrixer's localized footer navigation and copyright notice.
 */

import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { getPagePath } from "../routing";

const props = defineProps({
    locale: {
        type: String,
        required: true
    }
});

const { t } = useI18n();
const aboutUrl = computed(() => getPagePath(props.locale, "about"));
const reportErrorUrl = computed(() => getPagePath(props.locale, "report-error"));
const contactUrl = computed(() => props.locale === "de"
    ? "https://davidaugustat.com/kontakt"
    : "https://davidaugustat.com/contact");
const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="footer mt-auto py3 bg-dark">
        <div class="container">
            <div id="footer-nav" class="nav justify-content-center">
                <a
                    class="nav-link text-light"
                    href="https://github.com/davidaugustat/matrixer"
                    target="_blank"
                    rel="noopener noreferrer"
                >{{ t("footer.github") }}</a>
                <a class="nav-link text-light" :href="aboutUrl">{{ t("footer.about") }}</a>
                <a class="nav-link text-light" :href="contactUrl">{{ t("footer.contact") }}</a>
                <a class="nav-link text-light" href="https://davidaugustat.com/datenschutz">{{ t("footer.privacy") }}</a>
            </div>
            <p class="text-light footer-text text-center">
                {{ t("footer.errorPrompt") }}
                <a class="text-light" :href="reportErrorUrl" target="_blank">{{ t("footer.report") }}</a>
            </p>
            <p class="text-light footer-text text-center">©&nbsp;{{ currentYear }}&nbsp;David Augustat</p>
        </div>
    </footer>
</template>
