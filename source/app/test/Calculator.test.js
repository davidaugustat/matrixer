/**
 * @file Exercises localized calculator behavior, results, history, clipboard and analytics.
 */

import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Calculator from "../components/Calculator.vue";
import { createLocalization } from "../i18n";

/**
 * Mounts the calculator with its required application services.
 *
 * @param {"en"|"de"} locale The calculator locale.
 * @returns {import("@vue/test-utils").VueWrapper} The mounted component.
 */
function mountCalculator(locale = "en") {
    return mount(Calculator, {
        props: { locale },
        global: {
            plugins: [createLocalization(locale)],
            directives: {
                katex: () => {}
            }
        }
    });
}

/**
 * Submits a calculator expression.
 *
 * @param {import("@vue/test-utils").VueWrapper} wrapper The mounted calculator.
 * @param {string} expression The expression to calculate.
 * @param {number} field The field number.
 * @returns {Promise<void>} A promise resolved after Vue updates the result.
 */
async function calculate(wrapper, expression, field = 100) {
    await wrapper.get("#expression-input").setValue(expression);
    await wrapper.get("#field-select").setValue(field);
    await wrapper.get("#expression-input-form").trigger("submit");
    await nextTick();
}

describe("Calculator", () => {
    beforeEach(() => {
        window._paq = [];
    });

    it("renders the localized form and every supported field", () => {
        const english = mountCalculator("en");
        const german = mountCalculator("de");

        expect(english.get("#calculate-btn").text()).toBe("Calculate");
        expect(german.get("#calculate-btn").text()).toBe("Berechnen");
        expect(english.findAll("#field-select option")).toHaveLength(12);
        expect(german.get("#field-select").text()).toContain("reelle Zahlen");
    });

    it("calculates real and finite-field expressions and updates the URL", async () => {
        const wrapper = mountCalculator();

        await calculate(wrapper, "2+3");
        expect(wrapper.get("#math-element-result-code-output").text()).toBe("5");
        expect(window.location.search).toBe("?field=100&exp=2%2B3");

        await calculate(wrapper, "3+4", 5);
        expect(wrapper.get("#math-element-result-code-output").text()).toBe("2");
        expect(window.location.search).toBe("?field=5&exp=3%2B4");
    });

    it("renders homogeneous-system results", async () => {
        const wrapper = mountCalculator();

        await calculate(wrapper, "solvehom({1,0;0,0})");

        expect(wrapper.find("#homogeneous-equation-system-result-div").exists()).toBe(true);
        expect(wrapper.get("#hom-es-non-trivial-solution-output").text()).toContain("\\[");
        expect(wrapper.get("#hom-es-matrix-output").text()).toContain("\\[");
    });

    it("shows errors in the active language", async () => {
        const english = mountCalculator("en");
        const german = mountCalculator("de");

        await calculate(english, "(");
        await calculate(german, "(");

        expect(english.get("#result-error-box").text()).toContain("Matrixer has detected an error");
        expect(german.get("#result-error-box").text()).toContain("Matrixer hat einen Fehler erkannt");
        expect(english.get("#result-error-info-paragraph").text()).not.toBe("");
        expect(german.get("#result-error-info-paragraph").text()).not.toBe("");
    });

    it("restores calculations from URL parameters and browser history", async () => {
        window.history.replaceState("", "", "/?field=5&exp=3%2B4");
        const wrapper = mountCalculator();
        await nextTick();

        expect(wrapper.get("#expression-input").element.value).toBe("3+4");
        expect(wrapper.get("#field-select").element.value).toBe("5");
        expect(wrapper.get("#math-element-result-code-output").text()).toBe("2");

        window.history.replaceState("", "", "/?field=100&exp=6*7");
        window.dispatchEvent(new PopStateEvent("popstate"));
        await nextTick();
        expect(wrapper.get("#math-element-result-code-output").text()).toBe("42");
    });

    it("copies code results and records calculation analytics", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, "clipboard", {
            configurable: true,
            value: { writeText }
        });
        const wrapper = mountCalculator();

        await calculate(wrapper, "6*7");
        await wrapper.get("#result-code-copy-btn").trigger("click");

        expect(writeText).toHaveBeenCalledWith("42");
        expect(window._paq).toContainEqual([
            "trackEvent",
            "button click",
            "Matrixer Calculate Button",
            "Matrixer",
            1
        ]);
    });
});
