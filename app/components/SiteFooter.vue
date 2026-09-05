<script setup>
/**
 * @file Renders the localized site footer and its internal Nuxt navigation.
 */

import { getSiteLocale } from "~/locales/site";

const props = defineProps({
    locale: {
        type: String,
        required: true
    }
});

const copy = computed(() => getSiteLocale(props.locale));
const currentYear = ref(null);

onMounted(() => {
    currentYear.value = new Date().getFullYear();
});
</script>

<template>
    <footer class="footer mt-auto py-3">
        <div class="container">
            <div class="nav justify-content-center" id="footer-nav">
                <a class="nav-link text-light" href="https://github.com/davidaugustat/matrixer" target="_blank">{{ copy.footer.github }}</a>
                <NuxtLink class="nav-link text-light" :to="copy.footer.aboutHref">{{ copy.footer.about }}</NuxtLink>
                <a class="nav-link text-light" :href="copy.footer.contactHref">{{ copy.footer.contact }}</a>
                <a class="nav-link text-light" href="https://davidaugustat.com/datenschutz">{{ copy.footer.privacy }}</a>
            </div>
            <p class="text-light footer-text text-center">
                {{ copy.footer.reportPrefix }} <NuxtLink class="text-light" :to="copy.footer.reportHref" target="_blank">{{ copy.footer.reportText }}</NuxtLink>
            </p>
            <p class="text-light footer-text text-center">
                ©<span v-if="currentYear != null">&nbsp;{{ currentYear }}</span>&nbsp;David Augustat
            </p>
        </div>
    </footer>
</template>
