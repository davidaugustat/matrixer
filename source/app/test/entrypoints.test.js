/**
 * @file Verifies every Vite HTML entry point and its SEO compatibility metadata.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = resolve(import.meta.dirname, "../..");
const entries = [
    ["index.html", "en", "calculator", "https://matrixer.davidaugustat.com/"],
    ["de/index.html", "de", "calculator", "https://matrixer.davidaugustat.com/de/"],
    ["en/about/index.html", "en", "about", "https://matrixer.davidaugustat.com/en/about/"],
    ["de/about/index.html", "de", "about", "https://matrixer.davidaugustat.com/de/about/"],
    ["en/report-error/index.html", "en", "report-error", "https://matrixer.davidaugustat.com/en/report-error/"],
    ["de/report-error/index.html", "de", "report-error", "https://matrixer.davidaugustat.com/de/report-error/"]
];

describe("Vite page entry points", () => {
    it.each(entries)("defines metadata for %s", (path, locale, page, canonicalUrl) => {
        const html = readFileSync(resolve(sourceRoot, path), "utf8");

        expect(html).toContain(`<html lang="${locale}"`);
        expect(html).toContain(`data-locale="${locale}"`);
        expect(html).toContain(`data-page="${page}"`);
        expect(html).toContain(`<link rel="canonical" href="${canonicalUrl}">`);
        expect(html).toContain("hreflang=\"en\"");
        expect(html).toContain("hreflang=\"de\"");
        expect(html).toContain("hreflang=\"x-default\"");
        expect(html).toContain("<script type=\"module\" src=\"/app/main.js\"></script>");
    });

    it("preserves the existing calculator SEO copy", () => {
        const english = readFileSync(resolve(sourceRoot, "index.html"), "utf8");
        const german = readFileSync(resolve(sourceRoot, "de/index.html"), "utf8");

        expect(english).toContain("An online calculator that supports finite fields (F2, F3, F4, ...) and linear algebra like matrices, vectors and linear equation systems");
        expect(german).toContain("Ein Online-Rechner der endliche algebraische Körper (F2, F3, F4, ...) und lineare Algebra wie z.B. Matrizen, Vektoren und Lineare Gleichungssysteme unterstützt.");
        expect(english).toContain('<meta property="og:site_name" content="David Augustat">');
        expect(german).toContain('<meta property="og:site_name" content="David Augustat">');
    });

    it("keeps spacing between the raw result and its copy button", () => {
        const css = readFileSync(resolve(sourceRoot, "assets/css/main.css"), "utf8");

        expect(css).toMatch(/#result-code-copy-btn\s*\{[^}]*margin-left:\s*5px;/);
    });
});
