<script setup>
/**
 * @file Defines the legacy German error-reporting route and title.
 */

import { getPublicPage } from "#shared/publicRoutes";

definePageMeta({ locale: "de" });
useHead({ title: getPublicPage("/de/report-error/").title });
</script>

<template>
    <ContentReportErrorDe />
</template>
