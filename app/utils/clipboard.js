/**
 * @file Copies calculator output with the modern Clipboard API and a legacy browser fallback.
 */

/**
 * Copies text with a temporary textarea for browsers without a usable Clipboard API.
 *
 * @param {string} text Text to copy.
 * @returns {boolean} Whether the browser reported a successful copy operation.
 */
function copyTextWithTextarea(text) {
    const mockInput = document.createElement("textarea");
    mockInput.value = text;
    mockInput.setAttribute("readonly", "");
    mockInput.style.position = "fixed";
    mockInput.style.left = "-9999px";
    document.body.appendChild(mockInput);
    mockInput.select();
    const wasCopied = document.execCommand("copy");
    document.body.removeChild(mockInput);
    return wasCopied;
}

/**
 * Copies text to the system clipboard.
 *
 * @param {string} text Text to copy.
 * @returns {Promise<void>} Resolves after the copy attempt finishes.
 */
export async function copyText(text) {
    if (navigator.clipboard?.writeText != null) {
        try {
            await navigator.clipboard.writeText(text);
            return;
        } catch {
            // Continue with the compatibility fallback when clipboard permission is denied.
        }
    }

    copyTextWithTextarea(text);
}
