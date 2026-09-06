<script setup>
/**
 * @file Defines the legacy English error-reporting route and title.
 */

import { getPublicPage } from "#shared/publicRoutes";

definePageMeta({ locale: "en" });
useHead({ title: getPublicPage("/en/report-error/").title });
</script>

<template>
    <ContentReportErrorEn />
</template>
