/**
 * @file Verifies localized route mappings and calculator-query preservation.
 */

import { describe, expect, it } from "vitest";
import { getLanguageSwitchUrl, getPagePath } from "../routing";

describe("localized routing", () => {
    it("maps every public page to its localized counterpart", () => {
        expect(getPagePath("en", "calculator")).toBe("/");
        expect(getPagePath("de", "calculator")).toBe("/de/");
        expect(getLanguageSwitchUrl("en", "about", "?ignored=yes")).toBe("/de/about/");
        expect(getLanguageSwitchUrl("de", "report-error")).toBe("/en/report-error/");
    });

    it("preserves calculator state when switching languages", () => {
        expect(getLanguageSwitchUrl("en", "calculator", "?field=5&exp=3%2B4"))
            .toBe("/de/?field=5&exp=3%2B4");
    });
});
