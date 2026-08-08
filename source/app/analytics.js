/**
 * @file Initializes Matomo and records calculator-specific analytics events.
 */

const MATOMO_SCRIPT_ID = "matomo-tracker-script";

/**
 * Initializes Matomo page-view and link tracking.
 *
 * @returns {void}
 */
export function initializeAnalytics() {
    window._paq = window._paq || [];
    window._paq.push(["trackPageView"]);
    window._paq.push(["enableHeartBeatTimer", 15]);
    window._paq.push(["enableLinkTracking"]);
    window._paq.push(["setTrackerUrl", "https://analytics.davidaugustat.com/matomo.php"]);
    window._paq.push(["setSiteId", "2"]);

    if (document.getElementById(MATOMO_SCRIPT_ID) !== null) {
        return;
    }

    const script = document.createElement("script");
    script.id = MATOMO_SCRIPT_ID;
    script.async = true;
    script.src = "https://analytics.davidaugustat.com/matomo.js";
    document.head.appendChild(script);
}

/**
 * Sends the result of a calculation to Matomo.
 *
 * @param {{isSuccessful: boolean}} result The calculation result.
 * @returns {void}
 */
export function trackCalculation(result) {
    const value = result.isSuccessful ? 1 : 0;
    window._paq?.push(["trackEvent", "button click", "Matrixer Calculate Button", "Matrixer", value]);
}
