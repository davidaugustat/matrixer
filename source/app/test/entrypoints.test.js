/**
 * @file Verifies the minimal Vite HTML entries and their injected SEO metadata.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { createHtmlPagesPlugin } from "../../../plugins/html-pages-plugin.js";

const sourceRoot = resolve(import.meta.dirname, "../..");
const entries = [
    ["index.html", "en", "calculator", "Matrixer - Calculator for Finite Fields and Linear Algebra", "https://matrixer.davidaugustat.com/"],
    ["de/index.html", "de", "calculator", "Matrixer - Rechner für endliche Körper und lineare Algebra", "https://matrixer.davidaugustat.com/de/"],
    ["en/about/index.html", "en", "about", "About - Matrixer", "https://matrixer.davidaugustat.com/en/about/"],
    ["de/about/index.html", "de", "about", "Über diese Webseite - Matrixer", "https://matrixer.davidaugustat.com/de/about/"],
    ["en/report-error/index.html", "en", "report-error", "Report an Error - Matrixer", "https://matrixer.davidaugustat.com/en/report-error/"],
    ["de/report-error/index.html", "de", "report-error", "Fehler melden - Matrixer", "https://matrixer.davidaugustat.com/de/report-error/"]
];
const htmlPlugin = createHtmlPagesPlugin();
const transformEntryHtml = htmlPlugin.transformIndexHtml.handler;

/**
 * Applies the local Vite HTML plugin to a physical entry.
 *
 * @param {string} path The entry path relative to Vite's source root.
 * @returns {{html: string, tags: import("vite").HtmlTagDescriptor[]}} The transform result.
 */
function transformEntry(path) {
    const filename = resolve(sourceRoot, path);
    const html = readFileSync(filename, "utf8");

    return transformEntryHtml(html, { filename, path: `/${path}` });
}

/**
 * Finds tag descriptors with a particular tag name and set of attributes.
 *
 * @param {import("vite").HtmlTagDescriptor[]} tags The descriptors to search.
 * @param {string} tagName The HTML tag name.
 * @param {Record<string, string>} [attributes] The required attributes.
 * @returns {import("vite").HtmlTagDescriptor[]} The matching tag descriptors.
 */
function findTags(tags, tagName, attributes = {}) {
    return tags.filter((tag) => tag.tag === tagName && Object.entries(attributes).every(
        ([name, value]) => tag.attrs?.[name] === value
    ));
}

describe("Vite page entry points", () => {
    it.each(entries)("keeps page metadata in %s and injects shared tags", (path, locale, page, title, canonicalUrl) => {
        const sourceHtml = readFileSync(resolve(sourceRoot, path), "utf8");
        const transformed = transformEntry(path);

        expect(sourceHtml).toContain(`<html lang="${locale}"`);
        expect(sourceHtml).toContain(`data-locale="${locale}"`);
        expect(sourceHtml).toContain(`data-page="${page}"`);
        expect(sourceHtml).toContain(`<title>${title}</title>`);
        expect(sourceHtml).toContain(`<link rel="canonical" href="${canonicalUrl}">`);
        expect(sourceHtml).toContain("hreflang=\"en\"");
        expect(sourceHtml).toContain("hreflang=\"de\"");
        expect(sourceHtml).toContain("hreflang=\"x-default\"");
        expect(sourceHtml).not.toContain("roboto-font.css");
        expect(sourceHtml).not.toContain("/app/main.js");
        expect(transformed.html).toBe(sourceHtml);
        expect(findTags(transformed.tags, "title")).toHaveLength(0);
        expect(findTags(transformed.tags, "link", { rel: "canonical" })).toHaveLength(0);
        expect(findTags(transformed.tags, "meta", { charset: "UTF-8" })).toHaveLength(1);
        expect(findTags(transformed.tags, "meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
        })).toHaveLength(1);
        expect(findTags(transformed.tags, "link", {
            href: "https://static.davidaugustat.com/fonts/roboto/roboto-font.css"
        })).toHaveLength(1);
        expect(findTags(transformed.tags, "link", {
            href: "https://static.davidaugustat.com/bootstrap-4.6.0/css/bootstrap.min.css"
        })).toHaveLength(1);
        expect(findTags(transformed.tags, "link", {
            href: "/assets/img/favicons/apple-touch-icon.png"
        })).toHaveLength(1);
        expect(findTags(transformed.tags, "script", {
            type: "module",
            src: "/app/main.js"
        })).toEqual([expect.objectContaining({ injectTo: "body" })]);
    });

    it("preserves the existing calculator SEO copy", () => {
        const englishHtml = readFileSync(resolve(sourceRoot, "index.html"), "utf8");
        const germanHtml = readFileSync(resolve(sourceRoot, "de/index.html"), "utf8");
        const englishDescription = "An online calculator that supports finite fields (F2, F3, F4, ...) and linear algebra like matrices, vectors and linear equation systems";
        const germanDescription = "Ein Online-Rechner der endliche algebraische Körper (F2, F3, F4, ...) und lineare Algebra wie z.B. Matrizen, Vektoren und Lineare Gleichungssysteme unterstützt.";

        expect(englishHtml).toContain(`<meta name="description" content="${englishDescription}">`);
        expect(germanHtml).toContain(`<meta name="description" content="${germanDescription}">`);
        expect(englishHtml).toContain('<meta property="og:site_name" content="David Augustat">');
        expect(germanHtml).toContain('<meta property="og:site_name" content="David Augustat">');
    });

    it("keeps spacing between the raw result and its copy button", () => {
        const css = readFileSync(resolve(sourceRoot, "assets/css/main.css"), "utf8");

        expect(css).toMatch(/#result-code-copy-btn\s*\{[^}]*margin-left:\s*5px;/);
    });
});
