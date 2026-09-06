/**
 * @file Generates the robots.txt file using the configured public base URL.
 */

/**
 * Returns the robots.txt file contents.
 *
 * @param {import("h3").H3Event} event Request event used to set the response content type.
 * @returns {string} Plain-text robots policy.
 */
export default defineEventHandler((event) => {
    const baseUrl = useRuntimeConfig(event).public.baseUrl;

    setResponseHeader(event, "content-type", "text/plain; charset=utf-8");

    return `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/assets/other/sitemap.txt\n`;
});
