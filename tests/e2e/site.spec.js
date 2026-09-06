/**
 * @file Verifies the generated Matrixer site, localized routes, and calculator journeys in Chromium.
 */

import { expect, test as base } from "@playwright/test";
import { PUBLIC_PAGES } from "../../shared/publicRoutes.js";

const DISTINGUISHING_TEXT_BY_PATH = {
    "/": "Matrixer is a simple calculator",
    "/de/": "Matrixer ist ein Online-Rechner",
    "/en/about/": "About This Website",
    "/de/about/": "Über diese Webseite",
    "/en/report-error/": "Report an Error",
    "/de/report-error/": "Fehler melden"
};

const test = base.extend({
    page: async ({ page }, use) => {
        const pageErrors = [];
        page.on("pageerror", (error) => pageErrors.push(error.message));

        await use(page);

        expect(pageErrors, "The page emitted uncaught JavaScript errors").toEqual([]);
    }
});

/**
 * Navigates to a generated page and waits for the Nuxt application to hydrate.
 *
 * @param {import("@playwright/test").Page} page Browser page to navigate.
 * @param {string} path Site-relative URL.
 * @returns {Promise<import("@playwright/test").Response|null>} Main-document response.
 */
async function openPage(page, path) {
    const response = await page.goto(path, { waitUntil: "load" });
    await page.waitForFunction(() => Boolean(document.querySelector("#__nuxt")?.__vue_app__));
    return response;
}

/**
 * Reads the committed calculator parameters from the current URL.
 *
 * @param {import("@playwright/test").Page} page Browser page containing calculator state.
 * @returns {{field: string|null, expression: string|null}} Parsed query state.
 */
function getCalculatorQuery(page) {
    const query = new URL(page.url()).searchParams;
    return {
        field: query.get("field"),
        expression: query.get("exp")
    };
}

test.describe("generated routes", () => {
    for (const route of PUBLIC_PAGES) {
        test(`${route.path} loads its localized page`, async ({ page }) => {
            const response = await openPage(page, route.path);

            expect(response?.status()).toBe(200);
            await expect(page).toHaveTitle(route.title);
            await expect(page.locator("html")).toHaveAttribute("lang", route.language);
            await expect(page.getByText(DISTINGUISHING_TEXT_BY_PATH[route.path], { exact: false }).first()).toBeVisible();
            await expect(page.locator("header .navbar-brand img")).toBeVisible();
            await expect(page.locator("footer")).toBeVisible();
        });
    }

    test("robots and sitemap resources describe all public routes", async ({ request }) => {
        const robotsResponse = await request.get("/robots.txt");
        const sitemapResponse = await request.get("/assets/other/sitemap.txt");

        expect(robotsResponse.status()).toBe(200);
        expect(await robotsResponse.text()).toContain(
            "Sitemap: https://matrixer.davidaugustat.com/assets/other/sitemap.txt"
        );
        expect(sitemapResponse.status()).toBe(200);

        const sitemap = await sitemapResponse.text();
        for (const route of PUBLIC_PAGES) {
            expect(sitemap).toContain(`https://matrixer.davidaugustat.com${route.path}`);
        }
    });

    test("serves Bootstrap and Roboto from generated same-origin assets", async ({ page }) => {
        await openPage(page, "/");
        await page.evaluate(() => document.fonts.ready);

        const assetDetails = await page.evaluate(() => {
            const fontFaces = [];

            for (const stylesheet of document.styleSheets) {
                for (const rule of stylesheet.cssRules) {
                    if (rule.type !== CSSRule.FONT_FACE_RULE) {
                        continue;
                    }

                    const family = rule.style.getPropertyValue("font-family").replaceAll(/["']/g, "").trim();
                    if (family !== "Roboto") {
                        continue;
                    }

                    const source = rule.style.getPropertyValue("src");
                    const sourceUrl = source.match(/url\(["']?([^"')]+)["']?\)/)?.[1];
                    fontFaces.push({
                        style: rule.style.getPropertyValue("font-style"),
                        weight: rule.style.getPropertyValue("font-weight"),
                        url: sourceUrl == null ? null : new URL(sourceUrl, stylesheet.href ?? location.href).href
                    });
                }
            }

            return {
                bodyFontFamily: getComputedStyle(document.body).fontFamily,
                bootstrapPrimary: getComputedStyle(document.documentElement).getPropertyValue("--bs-primary").trim(),
                fontFaces,
                resourceUrls: performance.getEntriesByType("resource").map((entry) => entry.name),
                stylesheetUrls: [...document.querySelectorAll('link[rel="stylesheet"]')].map((link) => link.href)
            };
        });

        expect(assetDetails.bodyFontFamily).toContain("Roboto");
        expect(assetDetails.bootstrapPrimary).toBe("#0d6efd");
        expect(assetDetails.fontFaces.map((fontFace) => fontFace.weight)).toEqual(["300", "400", "500", "700"]);
        expect(assetDetails.fontFaces.every((fontFace) => fontFace.style === "normal")).toBe(true);

        const providerPattern = /(?:static\.davidaugustat\.com|fonts\.(?:googleapis|gstatic)\.com)/;
        expect([...assetDetails.stylesheetUrls, ...assetDetails.resourceUrls].filter((url) => providerPattern.test(url)))
            .toEqual([]);

        const applicationOrigin = new URL(page.url()).origin;
        const fontUrls = [...new Set(assetDetails.fontFaces.map((fontFace) => fontFace.url))];
        expect(fontUrls.length).toBeGreaterThan(0);

        for (const fontUrl of fontUrls) {
            expect(fontUrl).not.toBeNull();
            expect(new URL(fontUrl).origin).toBe(applicationOrigin);
            expect(new URL(fontUrl).pathname).toMatch(/^\/_fonts\/.*\.woff2$/);

            const response = await page.request.get(fontUrl);
            expect(response.ok()).toBe(true);
            expect(response.headers()["content-type"]).toContain("font/woff2");
        }
    });

    test("language and localized footer navigation use the intended routes", async ({ page }) => {
        await openPage(page, "/");

        await page.locator("#language-header-link").click();
        await expect(page).toHaveURL(/\/de\/$/);
        await expect(page.locator("html")).toHaveAttribute("lang", "de");

        await page.getByRole("link", { name: "Über diese Webseite", exact: true }).click();
        await expect(page).toHaveURL(/\/de\/about\/$/);
        await expect(page.getByRole("heading", { name: "Über diese Webseite" })).toBeVisible();
    });
});

test.describe("calculator", () => {
    test("shows a visible focus indicator for keyboard users", async ({ page }) => {
        await openPage(page, "/");

        await page.locator("#expression-input").focus();
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");

        const calculateButton = page.locator("#calculate-btn");
        await expect(calculateButton).toBeFocused();
        await expect(calculateButton).toHaveCSS("outline-style", "solid");
        await expect(calculateButton).toHaveCSS("outline-width", "3px");
    });

    test("calculates real and finite-field expressions through both submit controls", async ({ page }) => {
        await openPage(page, "/");

        await expect(page.locator("#field-select option")).toHaveCount(12);
        await expect(page.locator("#field-select")).toHaveValue("100");

        await page.locator("#expression-input").fill("2+3*4");
        await page.locator("#calculate-btn").click();
        await expect(page.locator("#math-element-result-code-output")).toHaveText("14");
        await expect(page.locator("#math-element-result-div .katex").first()).toBeVisible();
        expect(getCalculatorQuery(page)).toEqual({ field: "100", expression: "2+3*4" });

        await page.locator("#field-select").selectOption("5");
        await page.locator("#expression-input").fill("4+3");
        await page.locator("#expression-input").press("Enter");
        await expect(page.locator("#math-element-result-code-output")).toHaveText("2");
        expect(getCalculatorQuery(page)).toEqual({ field: "5", expression: "4+3" });
    });

    test("restores shareable calculator state on reload and history navigation", async ({ page }) => {
        await openPage(page, "/?field=5&exp=4%2B3");

        await expect(page.locator("#field-select")).toHaveValue("5");
        await expect(page.locator("#expression-input")).toHaveValue("4+3");
        await expect(page.locator("#math-element-result-code-output")).toHaveText("2");

        await page.reload({ waitUntil: "domcontentloaded" });
        await expect(page.locator("#math-element-result-code-output")).toHaveText("2");

        await page.locator("#expression-input").fill("2+2");
        await page.locator("#calculate-btn").click();
        await expect(page.locator("#math-element-result-code-output")).toHaveText("4");

        await page.goBack({ waitUntil: "domcontentloaded" });
        await expect(page.locator("#expression-input")).toHaveValue("4+3");
        await expect(page.locator("#math-element-result-code-output")).toHaveText("2");

        await page.goForward({ waitUntil: "domcontentloaded" });
        await expect(page.locator("#expression-input")).toHaveValue("2+2");
        await expect(page.locator("#math-element-result-code-output")).toHaveText("4");
    });

    test("renders homogeneous equation-system results", async ({ page }) => {
        const expression = encodeURIComponent("solvehom({1,j,-j;1-j,0,-1})");
        await openPage(page, `/?field=9&exp=${expression}`);

        await expect(page.locator("#homogeneous-equation-system-result-div")).toBeVisible();
        await expect(page.locator("#hom-es-non-trivial-solution-output .katex")).toBeVisible();
        await expect(page.locator("#hom-es-trivial-solution-output .katex")).toBeVisible();
        await expect(page.locator("#hom-es-matrix-output .katex")).toBeVisible();
    });

    test("localizes calculation errors", async ({ page }) => {
        await openPage(page, "/?field=5&exp=1%2F0");
        await expect(page.locator("#result-error-info-paragraph")).toHaveText("Division by zero is not allowed.");
        await expect(page.locator("#result-error-box").getByRole("link", { name: "Report an error!" })).toHaveAttribute(
            "href",
            "/en/report-error/"
        );

        await openPage(page, "/de/?field=5&exp=1%2F0");
        await expect(page.locator("#result-error-info-paragraph")).toHaveText("Man darf nicht durch Null teilen.");
        await expect(page.locator("#result-error-box").getByRole("link", { name: "Melde einen Fehler." })).toHaveAttribute(
            "href",
            "/de/report-error/"
        );
    });

    test("renders localized matrix and vector results", async ({ page }) => {
        await openPage(page, "/de/?field=5&exp=%7B1%2C2%3B3%2C4%7D%2B%7B4%2C3%3B2%2C1%7D");

        await expect(page.locator("#input-feedback-div")).toContainText("Deine Eingabe:");
        await expect(page.locator("#math-element-result-div")).toContainText("Ergebnis:");
        await expect(page.locator("#math-element-result-code-output")).toHaveText("{0, 0; 0, 0}");
        await expect(page.locator("#math-element-latex-result-output .katex")).toBeVisible();
        await expect(page.locator("#result-code-copy-btn")).toHaveText("Kopieren");

        await page.locator("#expression-input").fill("[1,2,3]+[3,2,1]");
        await page.locator("#calculate-btn").click();

        await expect(page.locator("#math-element-result-code-output")).toHaveText("[4, 4, 4]");
        await expect(page.locator("#math-element-latex-result-output .katex")).toBeVisible();
    });

    test("copies reusable result code", async ({ browser }) => {
        const context = await browser.newContext({
            permissions: ["clipboard-read", "clipboard-write"]
        });
        const page = await context.newPage();
        const pageErrors = [];
        page.on("pageerror", (error) => pageErrors.push(error.message));

        await openPage(page, "/?field=5&exp=4%2B3");
        await expect(page.locator("#math-element-result-code-output")).toHaveText("2");
        await page.locator("#result-code-copy-btn").click();

        const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
        expect(clipboardText).toBe("2");
        expect(pageErrors, "The page emitted uncaught JavaScript errors").toEqual([]);
        await context.close();
    });
});
