/**
 * @file Configures Nuxt static generation, global assets, aliases, and legacy public routes.
 */

import { fileURLToPath } from "node:url";

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
                "/de/report-error/"
            ]
        }
    }
});
