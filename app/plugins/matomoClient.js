/**
 * @file Provides Matomo calculation events and client-side Nuxt page-navigation tracking.
 */

import { nextTick } from "vue";

/**
 * Sends the unchanged calculator event to Matomo Analytics.
 *
 * @param {{isSuccessful: boolean}} result Calculation result.
 * @returns {void}
 */
function sendCalculateEventToAnalytics(result) {
    const value = result.isSuccessful ? 1 : 0;
    window._paq = window._paq || [];
    window._paq.push(["trackEvent", "button click", "Matrixer Calculate Button", "Matrixer", value]);
}

/**
 * Tracks a client-side page navigation in Matomo.
 *
 * @returns {void}
 */
function trackPageNavigation() {
    window._paq = window._paq || [];
    window._paq.push(["setCustomUrl", window.location.href]);
    window._paq.push(["setDocumentTitle", document.title]);
    window._paq.push(["trackPageView"]);
}

/**
 * Waits for Unhead to apply document metadata after Nuxt finishes rendering a page.
 *
 * @returns {Promise<void>} Resolves in the next browser task.
 */
function waitForDocumentHeadUpdate() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Registers Matomo tracking after Nuxt has mounted the initially tracked page.
 *
 * @param {import("nuxt/app").NuxtApp} nuxtApp Active Nuxt application.
 * @returns {void}
 */
function registerMatomoPageTracking(nuxtApp) {
    const router = nuxtApp.$router;
    let hasPendingPageNavigation = false;

    /**
     * Marks completed page-path changes without treating calculator query updates as page views.
     *
     * @param {import("vue-router").RouteLocationNormalized} to Destination route.
     * @param {import("vue-router").RouteLocationNormalized} from Previous route.
     * @param {import("vue-router").NavigationFailure|void} failure Navigation failure, when present.
     * @returns {void}
     */
    function markPageNavigation(to, from, failure) {
        if (failure == null && to.path !== from.path) {
            hasPendingPageNavigation = true;
        }
    }

    /**
     * Tracks a pending page navigation after Nuxt has rendered its content and document title.
     *
     * @returns {Promise<void>} Resolves after the document head update and tracking call.
     */
    async function trackFinishedPage() {
        if (hasPendingPageNavigation) {
            hasPendingPageNavigation = false;
            await nextTick();
            await waitForDocumentHeadUpdate();
            trackPageNavigation();
        }
    }

    /**
     * Starts observing navigation after the server-rendered page has mounted.
     *
     * @returns {void}
     */
    function startTrackingNavigation() {
        router.afterEach(markPageNavigation);
        nuxtApp.hook("page:finish", trackFinishedPage);
    }

    nuxtApp.hook("app:mounted", startTrackingNavigation);
}

/**
 * Configures the Matomo client integration and exposes calculator-event tracking to the Nuxt UI.
 *
 * @param {import("nuxt/app").NuxtApp} nuxtApp Active Nuxt application.
 * @returns {{provide: {matomoClient: {sendCalculateEventToAnalytics: function({isSuccessful: boolean}): void}}}}
 *     Nuxt injection for calculator analytics.
 */
function configureMatomoClient(nuxtApp) {
    if (import.meta.client) {
        registerMatomoPageTracking(nuxtApp);
    }

    return {
        provide: {
            matomoClient: {
                sendCalculateEventToAnalytics
            }
        }
    };
}

export default defineNuxtPlugin(configureMatomoClient);
