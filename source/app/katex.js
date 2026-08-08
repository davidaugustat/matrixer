/**
 * @file Integrates KaTeX auto-rendering with Vue through a reusable custom directive.
 */

import renderMathInElement from "katex/contrib/auto-render";

const renderOptions = Object.freeze({
    throwOnError: false,
    delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
    ]
});

/**
 * Renders all supported LaTeX delimiters inside an element.
 *
 * @param {HTMLElement} element The element containing LaTeX text.
 * @returns {void}
 */
export function renderElementMath(element) {
    renderMathInElement(element, renderOptions);
}

/** @type {import("vue").ObjectDirective<HTMLElement>} */
export const katexDirective = {
    /**
     * Renders math after the element is inserted into the document.
     *
     * @param {HTMLElement} element The mounted element.
     * @returns {void}
     */
    mounted(element) {
        renderElementMath(element);
    },

    /**
     * Renders math after Vue updates the element's text.
     *
     * @param {HTMLElement} element The updated element.
     * @returns {void}
     */
    updated(element) {
        renderElementMath(element);
    }
};
