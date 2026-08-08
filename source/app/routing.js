/** @typedef {"en" | "de"} Locale */
/** @typedef {"calculator" | "about" | "report-error"} PageId */

export const URL_CHANGE_EVENT = "matrixer:url-changed";

const PAGE_PATHS = Object.freeze({
    en: Object.freeze({
        calculator: "/",
        about: "/en/about/",
        "report-error": "/en/report-error/"
    }),
    de: Object.freeze({
        calculator: "/de/",
        about: "/de/about/",
        "report-error": "/de/report-error/"
    })
});

/**
 * Returns the other supported locale.
 *
 * @param {Locale} locale The current locale.
 * @returns {Locale} The alternate locale.
 */
export function getAlternateLocale(locale) {
    return locale === "de" ? "en" : "de";
}

/**
 * Returns the public path for a localized page.
 *
 * @param {Locale} locale The target locale.
 * @param {PageId} page The target page.
 * @returns {string} The page path.
 */
export function getPagePath(locale, page) {
    return PAGE_PATHS[locale][page];
}

/**
 * Builds the language-switch URL for the equivalent page.
 *
 * Calculator query parameters are retained so a shared calculation remains visible after switching languages.
 *
 * @param {Locale} locale The current locale.
 * @param {PageId} page The current page.
 * @param {string} search The current URL search string.
 * @returns {string} The localized URL.
 */
export function getLanguageSwitchUrl(locale, page, search = "") {
    const targetLocale = getAlternateLocale(locale);
    const query = page === "calculator" ? search : "";
    return `${getPagePath(targetLocale, page)}${query}`;
}
