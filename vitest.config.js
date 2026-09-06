/**
 * @file Configures isolated Node-based regression tests for the math engine.
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        include: ["tests/logic/**/*.test.js"],
        reporters: ["verbose"],
        coverage: {
            provider: "v8",
            include: ["source/mathEngine/**/*.js"],
            reporter: ["text", "html", "json-summary"],
            reportsDirectory: "coverage",
        }
    }
});
