/**
 * @file Exercises the localized application shell, content pages and language-switch behavior.
 */

import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it, vi } from "vitest";
import App from "../App.vue";
import { createLocalization } from "../i18n";

/**
 * Mounts a complete localized page.
 *
 * @param {"en"|"de"} locale The page locale.
 * @param {"calculator"|"about"|"report-error"} page The page identifier.
 * @returns {Promise<import("@vue/test-utils").VueWrapper>} The mounted application.
 */
async function mountPage(locale, page) {
    const wrapper = mount(App, {
        props: { locale, page },
        global: {
            plugins: [createLocalization(locale)],
            directives: {
                katex: () => {}
            }
        }
    });
    await vi.dynamicImportSettled();
    await flushPromises();
    return wrapper;
}

describe("application shell", () => {
    it("renders English and German informational pages", async () => {
        const english = await mountPage("en", "about");
        const german = await mountPage("de", "report-error");

        expect(english.get("h1").text()).toBe("About This Website");
        expect(english.text()).toContain("My math class at university involves a lot of calculations on finite fields.");
        expect(english.text()).toContain("Vue.js is a JavaScript framework for building user interfaces.");
        expect(english.text()).toContain("Vite is an NPM-based frontend build tool.");
        expect(english.text()).toContain("Bootstrap is a CSS framework");
        expect(english.text()).not.toContain("jQuery is a library");
        expect(english.text()).not.toContain("Webpack is an");
        expect(english.text()).not.toContain("Babel is a tool");
        expect(german.get("h1").text()).toBe("Fehler melden");
        expect(german.text()).toContain("Der Text, den du versucht hast, einzugeben");
    });

    it("links to the equivalent localized page", async () => {
        const about = await mountPage("en", "about");
        expect(about.get("#language-header-link").attributes("href")).toBe("/de/about/");

        window.history.replaceState("", "", "/?field=5&exp=3%2B4");
        const calculator = await mountPage("en", "calculator");
        expect(calculator.get("#language-header-link").attributes("href"))
            .toBe("/de/?field=5&exp=3%2B4");

        await calculator.get("#expression-input").setValue("6*7");
        await calculator.get("#field-select").setValue(100);
        await calculator.get("#expression-input-form").trigger("submit");
        await nextTick();
        expect(calculator.get("#language-header-link").attributes("href"))
            .toBe("/de/?field=100&exp=6*7");
    });

    it("renders localized footer navigation", async () => {
        const german = await mountPage("de", "about");
        expect(german.get("#footer-nav").text()).toContain("Über diese Webseite");
        expect(german.get("#footer-nav a[href='/de/about/']").exists()).toBe(true);
        expect(german.get("#language-header-link").attributes("title")).toBe("Switch to English");
        expect(german.get("#language-icon").attributes("alt")).toBe("English website");
        expect(german.get("#github-header-link").attributes("title")).toBe("Code auf GitHub");
        expect(german.text()).toContain("Vue.js ist ein JavaScript-Framework zum Erstellen von Benutzeroberflächen.");
        expect(german.text()).toContain("Vite ist ein NPM-basiertes Frontend-Build-Tool.");
        expect(german.text()).toContain("Boostrap ist ein CSS-Framework");
        expect(german.text()).not.toContain("jQuery ist eine JavaScript-Bibliothek");
        expect(german.text()).not.toContain("Webpack ist ein");
        expect(german.text()).not.toContain("Babel ist ein Werkzeug");
    });
});
