/**
 * @file Configures Nuxt static generation, global assets, aliases, and legacy public routes.
 */

import { fileURLToPath } from "node:url";

// Public base URL where Matrixer is hosted, without a trailing slash:
const BASE_URL = "https://matrixer.davidaugustat.com";

// URL where Matomo instance is hosted:
const MATOMO_BASE_URL = "https://analytics.davidaugustat.com/";

// Matomo is only activated when Matrixer is served from this domain:
const HOST_ENABLE_ANALYTICS = "matrixer.davidaugustat.com";

/**
 * Resolves a project-relative path to an absolute filesystem path.
 *
 * @param {string} relativePath Path relative to the repository root.
 * @returns {string} Absolute filesystem path.
 */
const projectPath = (relativePath) => fileURLToPath(new URL(relativePath, import.meta.url));

export default defineNuxtConfig({
    compatibilityDate: "2026-08-09",
    devtools: { enabled: false },
    telemetry: false,
    runtimeConfig: {
        public: {
            baseUrl: BASE_URL,
            matomoBaseUrl: MATOMO_BASE_URL,
            hostEnableAnalytics: HOST_ENABLE_ANALYTICS
        }
    },
    alias: {
        "@mathEngine": projectPath("./source/mathEngine")
    },
    css: [
        "katex/dist/katex.min.css",
        "~/assets/css/main.css"
    ],
    nitro: {
        output: {
            publicDir: projectPath("./distribution")
        },
        prerender: {
            crawlLinks: false,
            routes: [
                "/",
                "/de/",
                "/en/about/",
                "/de/about/",
                "/en/report-error/",
                "/de/report-error/",
                "/robots.txt",
                "/assets/other/sitemap.txt"
            ]
        }
    }
});
