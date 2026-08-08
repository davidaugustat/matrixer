import { createApp } from "vue";
import "katex/dist/katex.min.css";
import "../assets/css/main.css";
import App from "./App.vue";
import { initializeAnalytics } from "./analytics";
import { createLocalization } from "./i18n";
import { katexDirective } from "./katex";

const mountElement = document.getElementById("app");

if (mountElement === null) {
    throw new Error("The Matrixer application mount element is missing.");
}

/** @type {import("./routing").Locale} */
const locale = mountElement.dataset.locale === "de" ? "de" : "en";
/** @type {import("./routing").PageId} */
const page = ["calculator", "about", "report-error"].includes(mountElement.dataset.page)
    ? mountElement.dataset.page
    : "calculator";

document.documentElement.lang = locale;
initializeAnalytics();

const app = createApp(App, { locale, page });
app.use(createLocalization(locale));
app.directive("katex", katexDirective);
app.mount(mountElement);
