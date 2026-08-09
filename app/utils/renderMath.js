import renderMathInElement from "katex/contrib/auto-render";

/**
 * Renders LaTeX delimiters inside the provided browser element with KaTeX.
 *
 * @param {HTMLElement|null} element Element containing LaTeX text.
 * @returns {void}
 */
export function renderMath(element) {
    if (element == null) {
        return;
    }

    renderMathInElement(element);
}
