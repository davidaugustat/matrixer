/**
 * @file Configures Vite's Vue plugin, HTML metadata, multi-page inputs and Vitest environment.
 */

import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { createHtmlPagesPlugin } from "./plugins/html-pages-plugin.js";

const sourceRoot = resolve(import.meta.dirname, "source");
const htmlEntryPaths = [
    "index.html",
    "de/index.html",
    "en/about/index.html",
    "de/about/index.html",
    "en/report-error/index.html",
    "de/report-error/index.html"
];

/**
 * Vite configuration for Matrixer's static multi-page application.
 *
 * @returns {import("vite").UserConfig} The Vite configuration.
 */
export default defineConfig({
    root: sourceRoot,
    cacheDir: resolve(import.meta.dirname, "node_modules/.vite"),
    publicDir: "public",
    plugins: [createHtmlPagesPlugin(), vue()],
    build: {
        outDir: resolve(import.meta.dirname, "distribution"),
        emptyOutDir: true,
        rolldownOptions: {
            input: htmlEntryPaths.map((path) => resolve(sourceRoot, path))
        }
    },
    test: {
        environment: "jsdom",
        setupFiles: resolve(sourceRoot, "app/test/setup.js")
    }
});
