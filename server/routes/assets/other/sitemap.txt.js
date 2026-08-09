/**
 * @file Generates the plain-text sitemap using the configured public base URL.
 */

const ROUTES = [
    "/",
    "/en/about/",
    "/en/report-error/",
    "/de/",
    "/de/about/",
    "/de/report-error/"
];

/**
 * Returns the sitemap containing every public page URL.
 *
 * @param {import("h3").H3Event} event Request event used to set the response content type.
 * @returns {string} Plain-text sitemap.
 */
export default defineEventHandler((event) => {
    const baseUrl = useRuntimeConfig(event).public.baseUrl;

    setResponseHeader(event, "content-type", "text/plain; charset=utf-8");

    return `${ROUTES.map((route) => `${baseUrl}${route}`).join("\n")}\n`;
});
