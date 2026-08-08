<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getLanguageSwitchUrl, getPagePath, URL_CHANGE_EVENT } from "../routing";

const props = defineProps({
    locale: {
        type: String,
        required: true
    },
    page: {
        type: String,
        required: true
    }
});

const { t } = useI18n();
const currentSearch = ref(window.location.search);
const homeUrl = computed(() => getPagePath(props.locale, "calculator"));
const languageUrl = computed(() => getLanguageSwitchUrl(props.locale, props.page, currentSearch.value));
const languageImage = computed(() => props.locale === "de"
    ? "/assets/img/united-kingdom-flag.svg"
    : "/assets/img/germany-flag.svg");

/**
 * Synchronizes the language link with the browser's current query parameters.
 *
 * @returns {void}
 */
function updateCurrentSearch() {
    currentSearch.value = window.location.search;
}

onMounted(() => {
    window.addEventListener("popstate", updateCurrentSearch);
    window.addEventListener(URL_CHANGE_EVENT, updateCurrentSearch);
});

onBeforeUnmount(() => {
    window.removeEventListener("popstate", updateCurrentSearch);
    window.removeEventListener(URL_CHANGE_EVENT, updateCurrentSearch);
});
</script>

<template>
    <header>
        <nav class="navbar navbar-expand-md navbar-light">
            <a class="navbar-brand" :href="homeUrl">
                <img
                    class="logo"
                    :alt="locale === 'de' ? 'Matrixer Logo' : 'Matrixer logo'"
                    :src="'/assets/img/matrixer-logo.svg'"
                >
            </a>
            <div class="ml-auto">
                <a
                    id="language-header-link"
                    class="header-link"
                    :href="languageUrl"
                    :title="t('header.switchLanguage')"
                >
                    <img
                        id="language-icon"
                        :alt="t('header.languageImageAlt')"
                        :src="languageImage"
                    >
                </a>
                <a
                    id="github-header-link"
                    class="header-link"
                    href="https://github.com/davidaugustat/matrixer"
                    target="_blank"
                    rel="noopener noreferrer"
                    :title="t('header.githubTitle')"
                >
                    <img
                        id="github-icon"
                        :alt="t('header.githubImageAlt')"
                        :src="'/assets/img/github-logo.png'"
                    >
                </a>
            </div>
        </nav>
    </header>
</template>
