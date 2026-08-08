<script setup>
import { computed, defineAsyncComponent } from "vue";
import SiteFooter from "./components/SiteFooter.vue";
import SiteHeader from "./components/SiteHeader.vue";
import AboutDe from "./pages/about/AboutDe.vue";
import AboutEn from "./pages/about/AboutEn.vue";
import ReportErrorDe from "./pages/report-error/ReportErrorDe.vue";
import ReportErrorEn from "./pages/report-error/ReportErrorEn.vue";

const pageComponents = Object.freeze({
    calculator: defineAsyncComponent(() => import("./pages/CalculatorPage.vue")),
    about: Object.freeze({
        en: AboutEn,
        de: AboutDe
    }),
    "report-error": Object.freeze({
        en: ReportErrorEn,
        de: ReportErrorDe
    })
});

const props = defineProps({
    locale: {
        type: String,
        required: true,
        validator: (value) => ["en", "de"].includes(value)
    },
    page: {
        type: String,
        required: true,
        validator: (value) => ["calculator", "about", "report-error"].includes(value)
    }
});

const pageComponent = computed(() => {
    if (props.page === "calculator") {
        return pageComponents.calculator;
    }

    return pageComponents[props.page][props.locale];
});
</script>

<template>
    <SiteHeader :locale="locale" :page="page" />
    <main role="main" class="flex-shrink-0">
        <div class="container main-content">
            <component :is="pageComponent" :locale="locale" />
        </div>
    </main>
    <SiteFooter :locale="locale" />
</template>
