/**
 * @file Provides Matomo calculation events and client-side Nuxt page-navigation tracking.
 */

/**
 * Returns the shared Matomo command queue.
 *
 * @returns {Array} Matomo command queue.
 */
function getMatomoQueue() {
    window._paq = window._paq || [];
    return window._paq;
}

/**
 * Checks whether analytics may run on the current host.
 *
 * @param {string} hostEnableAnalytics Hostname on which analytics is enabled.
 * @returns {boolean} Whether the browser is on the configured analytics hostname.
 */
function isMatomoTrackingEnabled(hostEnableAnalytics) {
    return window.location.hostname === hostEnableAnalytics;
}

/**
 * Ensures the configured Matomo URL can be safely extended with resource paths.
 *
 * @param {string} matomoBaseUrl Configured Matomo base URL.
 * @returns {string} Matomo URL ending in a slash.
 */
function normalizeMatomoBaseUrl(matomoBaseUrl) {
    return matomoBaseUrl.endsWith("/") ? matomoBaseUrl : `${matomoBaseUrl}/`;
}

/**
 * Initializes Matomo and loads its tracker script once.
 *
 * @param {string} matomoBaseUrl Configured Matomo base URL.
 * @returns {void}
 */
function initializeMatomo(matomoBaseUrl) {
    const normalizedBaseUrl = normalizeMatomoBaseUrl(matomoBaseUrl);
    const queue = getMatomoQueue();

    queue.push(["setTrackerUrl", `${normalizedBaseUrl}matomo.php`]);
    queue.push(["setSiteId", "2"]);
    queue.push(["enableHeartBeatTimer", 15]);
    queue.push(["enableLinkTracking"]);
    queue.push(["trackPageView"]);

    if (document.querySelector("script[data-matomo-tracker]") != null) {
        return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.dataset.matomoTracker = "";
    script.src = `${normalizedBaseUrl}matomo.js`;
    document.head.append(script);
}

/**
 * Sends the unchanged calculator event to Matomo Analytics.
 *
 * @param {{isSuccessful: boolean}} result Calculation result.
 * @param {string} hostEnableAnalytics Hostname on which analytics is enabled.
 * @returns {void}
 */
function sendCalculateEventToAnalytics(result, hostEnableAnalytics) {
    if (!isMatomoTrackingEnabled(hostEnableAnalytics)) {
        return;
    }

    const value = result.isSuccessful ? 1 : 0;
    getMatomoQueue().push([
        "trackEvent",
        "button click",
        "Matrixer Calculate Button",
        "Matrixer",
        value
    ]);
}

/**
 * Tracks a client-side page navigation in Matomo.
 *
 * @returns {void}
 */
function trackPageNavigation() {
    const queue = getMatomoQueue();
    queue.push(["setCustomUrl", window.location.href]);
    queue.push(["setDocumentTitle", document.title]);
    queue.push(["trackPageView"]);
}

/**
 * Waits for Unhead to apply the destination page title to the document.
 *
 * @returns {Promise<void>} Resolves during the next browser task.
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
    let trackedPath = router.currentRoute.value.path;

    /**
     * Tracks completed page-path changes without treating calculator query updates as page views.
     *
     * @returns {Promise<void>} Resolves after any destination title has been applied and tracked.
     */
    async function trackFinishedPage() {
        const currentPath = router.currentRoute.value.path;

        if (currentPath !== trackedPath) {
            trackedPath = currentPath;
            await waitForDocumentHeadUpdate();

            if (router.currentRoute.value.path === currentPath) {
                trackPageNavigation();
            }
        }
    }

    nuxtApp.hook("page:finish", trackFinishedPage);
}

/**
 * Configures the Matomo client integration and exposes calculator-event tracking to the Nuxt UI.
 *
 * @param {import("nuxt/app").NuxtApp} nuxtApp Active Nuxt application.
 * @returns {{provide: {matomoClient: {sendCalculateEventToAnalytics: function({isSuccessful: boolean}): void}}}}
 *     Nuxt injection for calculator analytics.
 */
function configureMatomoClient(nuxtApp) {
    const { hostEnableAnalytics, matomoBaseUrl } = nuxtApp.$config.public;

    if (import.meta.client && isMatomoTrackingEnabled(hostEnableAnalytics)) {
        initializeMatomo(matomoBaseUrl);
        registerMatomoPageTracking(nuxtApp);
    }

    return {
        provide: {
            matomoClient: {
                sendCalculateEventToAnalytics: (result) => {
                    sendCalculateEventToAnalytics(result, hostEnableAnalytics);
                }
            }
        }
    };
}

export default defineNuxtPlugin(configureMatomoClient);
