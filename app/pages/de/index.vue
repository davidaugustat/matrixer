<script setup>
/**
 * @file Defines the German calculator route and its SEO metadata.
 */

definePageMeta({ locale: "de" });

const baseUrl = useRuntimeConfig().public.baseUrl;
const description = "Ein Online-Rechner der endliche algebraische Körper (F2, F3, F4, ...) und lineare Algebra wie z.B. Matrizen, Vektoren und Lineare Gleichungssysteme unterstützt.";
const socialTitle = "Matrixer - Online-Rechner für endliche Körper und lineare Algebra";

useHead({
    title: "Matrixer - Rechner für endliche Körper und lineare Algebra",
    meta: [
        { name: "description", content: description },
        { property: "og:locale", content: "de_DE" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: socialTitle },
        { property: "og:description", content: description },
        { property: "og:url", content: `${baseUrl}/de/` },
        { property: "og:site_name", content: "David Augustat" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:description", content: description },
        { name: "twitter:title", content: socialTitle }
    ],
    link: [
        { rel: "canonical", href: `${baseUrl}/de/` }
    ]
});
</script>

<template>
    <CalculatorPage locale="de" />
</template>
