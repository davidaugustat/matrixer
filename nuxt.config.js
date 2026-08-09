import { fileURLToPath } from "node:url";

/**
 * Resolves a project-relative path to an absolute filesystem path.
 *
 * @param {string} relativePath Path relative to the repository root.
 * @returns {string} Absolute filesystem path.
 */
const projectPath = (relativePath) => fileURLToPath(new URL(relativePath, import.meta.url));

export default defineNuxtConfig({
    compatibilityDate: "2026-08-09",
    devtools: { enabled: false },
    telemetry: false,
    alias: {
        "@mathEngine": projectPath("./source/mathEngine")
    },
    css: [
        "katex/dist/katex.min.css",
        "~/assets/css/main.css"
    ],
    app: {
        head: {
            charset: "UTF-8",
            viewport: "width=device-width, initial-scale=1",
            link: [
                { rel: "stylesheet", href: "https://static.davidaugustat.com/fonts/roboto/roboto-font.css" },
                { rel: "stylesheet", href: "https://static.davidaugustat.com/bootstrap-4.6.0/css/bootstrap.min.css" },
                { rel: "apple-touch-icon", sizes: "180x180", href: "/assets/img/favicons/apple-touch-icon.png" },
                { rel: "icon", type: "image/png", sizes: "32x32", href: "/assets/img/favicons/favicon-32x32.png" },
                { rel: "icon", type: "image/png", sizes: "16x16", href: "/assets/img/favicons/favicon-16x16.png" },
                { rel: "manifest", href: "/assets/img/favicons/site.webmanifest" },
                { rel: "mask-icon", href: "/assets/img/favicons/safari-pinned-tab.svg", color: "#5bbad5" },
                { rel: "shortcut icon", href: "/assets/img/favicons/favicon.ico" }
            ],
            meta: [
                { name: "apple-mobile-web-app-title", content: "Matrixer" },
                { name: "application-name", content: "Matrixer" },
                { name: "msapplication-TileColor", content: "#ffffff" },
                { name: "msapplication-config", content: "/assets/img/favicons/browserconfig.xml" },
                { name: "theme-color", content: "#ffffff" }
            ],
            script: [
                {
                    type: "text/javascript",
                    innerHTML: `
                        var _paq = window._paq = window._paq || [];
                        _paq.push(['trackPageView']);
                        _paq.push(['enableHeartBeatTimer', 15]);
                        _paq.push(['enableLinkTracking']);
                        (function() {
                            var u="https://analytics.davidaugustat.com/";
                            _paq.push(['setTrackerUrl', u+'matomo.php']);
                            _paq.push(['setSiteId', '2']);
                            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                            g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
                        })();
                    `
                }
            ]
        }
    },
    nitro: {
        output: {
            publicDir: projectPath("./distribution")
        },
        prerender: {
            crawlLinks: false,
            routes: [
                "/",
                "/de/",
                "/en/about/",
                "/de/about/",
                "/en/report-error/",
                "/de/report-error/"
            ]
        }
    }
});
