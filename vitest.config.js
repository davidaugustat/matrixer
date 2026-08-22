/**
 * @file Configures isolated Node-based regression tests for the math engine.
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        include: ["tests/logic/**/*.test.js"]
    }
});
