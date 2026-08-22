/**
 * @file Verifies the generated Matrixer site, localized routes, and calculator journeys in Chromium.
 */

import { expect, test as base } from "@playwright/test";

const test = base.extend({
    page: async ({ page }, use) => {
        const pageErrors = [];
        page.on("pageerror", (error) => pageErrors.push(error.message));

        await use(page);

        expect(pageErrors, "The page emitted uncaught JavaScript errors").toEqual([]);
    }
});

const PUBLIC_ROUTES = [
    {
        path: "/",
        title: "Matrixer - Calculator for Finite Fields and Linear Algebra",
        language: "en",
        distinguishingText: "Matrixer is a simple calculator"
    },
    {
        path: "/de/",
        title: "Matrixer - Rechner für endliche Körper und lineare Algebra",
        language: "de",
        distinguishingText: "Matrixer ist ein Online-Rechner"
    },
    {
        path: "/en/about/",
        title: "About - Matrixer",
        language: "en",
        distinguishingText: "About This Website"
    },
    {
        path: "/de/about/",
        title: "Über diese Webseite - Matrixer",
        language: "de",
        distinguishingText: "Über diese Webseite"
    },
    {
        path: "/en/report-error/",
        title: "Report an Error - Matrixer",
        language: "en",
        distinguishingText: "Report an Error"
    },
    {
        path: "/de/report-error/",
        title: "Fehler melden - Matrixer",
        language: "de",
        distinguishingText: "Fehler melden"
    }
];

/**
 * Navigates without waiting for externally hosted stylesheet requests.
 *
 * @param {import("@playwright/test").Page} page Browser page to navigate.
 * @param {string} path Site-relative URL.
 * @returns {Promise<import("@playwright/test").Response|null>} Main-document response.
 */
async function openPage(page, path) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
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
    for (const route of PUBLIC_ROUTES) {
        test(`${route.path} loads its localized page`, async ({ page }) => {
            const response = await openPage(page, route.path);

            expect(response?.status()).toBe(200);
            await expect(page).toHaveTitle(route.title);
            await expect(page.locator("html")).toHaveAttribute("lang", route.language);
            await expect(page.getByText(route.distinguishingText, { exact: false }).first()).toBeVisible();
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
        for (const route of PUBLIC_ROUTES) {
            expect(sitemap).toContain(`https://matrixer.davidaugustat.com${route.path}`);
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
