/**
 * @file Configures Vite's Vue plugin, multi-page production build and Vitest environment.
 */

import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const sourceRoot = resolve(import.meta.dirname, "source");

/**
 * Vite configuration for Matrixer's static multi-page application.
 *
 * @returns {import("vite").UserConfig} The Vite configuration.
 */
export default defineConfig({
    root: sourceRoot,
    cacheDir: resolve(import.meta.dirname, "node_modules/.vite"),
    publicDir: "public",
    plugins: [vue()],
    build: {
        outDir: resolve(import.meta.dirname, "distribution"),
        emptyOutDir: true,
        rolldownOptions: {
            input: [
                resolve(sourceRoot, "index.html"),
                resolve(sourceRoot, "de/index.html"),
                resolve(sourceRoot, "en/about/index.html"),
                resolve(sourceRoot, "de/about/index.html"),
                resolve(sourceRoot, "en/report-error/index.html"),
                resolve(sourceRoot, "de/report-error/index.html")
            ]
        }
    },
    test: {
        environment: "jsdom",
        setupFiles: resolve(sourceRoot, "app/test/setup.js")
    }
});
