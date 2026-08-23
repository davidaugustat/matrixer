/**
 * @file Generates the plain-text sitemap using the configured public base URL.
 */

import { PUBLIC_ROUTE_PATHS } from "#shared/publicRoutes";

/**
 * Returns the sitemap containing every public page URL.
 *
 * @param {import("h3").H3Event} event Request event used to set the response content type.
 * @returns {string} Plain-text sitemap.
 */
export default defineEventHandler((event) => {
    const baseUrl = useRuntimeConfig(event).public.baseUrl;

    setResponseHeader(event, "content-type", "text/plain; charset=utf-8");

    return `${PUBLIC_ROUTE_PATHS.map((route) => `${baseUrl}${route}`).join("\n")}\n`;
});
