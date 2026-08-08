import { afterEach, vi } from "vitest";

afterEach(() => {
    document.body.innerHTML = "";
    window.history.replaceState("", "", "/");
    window._paq = [];
    vi.restoreAllMocks();
});
