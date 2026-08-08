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
        expect(english.text()).toContain("jQuery is a library which makes manipulating the graphical user interface");
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
    });
});
