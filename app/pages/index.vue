<script setup>
/**
 * @file Defines the English calculator route and its SEO metadata.
 */

definePageMeta({ locale: "en" });

const baseUrl = useRuntimeConfig().public.baseUrl;
const description = "An online calculator that supports finite fields (F2, F3, F4, ...) and linear algebra like matrices, vectors and linear equation systems";
const socialTitle = "Matrixer - Online Calculator for Finite Fields and Linear Algebra";

useHead({
    title: "Matrixer - Calculator for Finite Fields and Linear Algebra",
    meta: [
        { name: "description", content: description },
        { property: "og:locale", content: "en_US" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: socialTitle },
        { property: "og:description", content: description },
        { property: "og:url", content: `${baseUrl}/` },
        { property: "og:site_name", content: "David Augustat" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:description", content: description },
        { name: "twitter:title", content: socialTitle }
    ],
    link: [
        { rel: "canonical", href: `${baseUrl}/` }
    ]
});
</script>

<template>
    <CalculatorPage locale="en" />
</template>
