<script setup>
/**
 * @file Defines the legacy German About-page route and title.
 */

import { getPublicPage } from "#shared/publicRoutes";

definePageMeta({ locale: "de" });
useHead({ title: getPublicPage("/de/about/").title });
</script>

<template>
    <ContentAboutDe />
</template>
