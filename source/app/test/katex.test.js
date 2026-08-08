/**
 * @file Verifies that the KaTeX integration renders supported math delimiters.
 */

import { describe, expect, it } from "vitest";
import { renderElementMath } from "../katex";

describe("KaTeX integration", () => {
    it("renders inline and display math delimiters", () => {
        const element = document.createElement("div");
        element.textContent = "Inline \\(x^2\\) and display \\[x+1\\]";

        renderElementMath(element);

        expect(element.querySelectorAll(".katex")).toHaveLength(2);
        expect(element.querySelector(".katex-display")).not.toBeNull();
    });
});
