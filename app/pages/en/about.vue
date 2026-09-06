<script setup>
/**
 * @file Defines the legacy English About-page route and title.
 */

import { getPublicPage } from "#shared/publicRoutes";

definePageMeta({ locale: "en" });
useHead({ title: getPublicPage("/en/about/").title });
</script>

<template>
    <ContentAboutEn />
</template>
