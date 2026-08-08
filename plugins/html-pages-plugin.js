/**
 * @file This is a Vite plugin that injects common HTML metadata into the HTML template files.
 */

/**
 * Creates the tags shared by every HTML entry.
 *
 * @returns {import("vite").HtmlTagDescriptor[]} The Vite HTML tag descriptors.
 */
export function createSharedPageTags() {
    return [
        {
            tag: "meta",
            attrs: { charset: "UTF-8" },
            injectTo: "head-prepend"
        },
        {
            tag: "meta",
            attrs: { name: "viewport", content: "width=device-width, initial-scale=1" },
            injectTo: "head-prepend"
        },
        {
            tag: "link",
            attrs: { href: "https://static.davidaugustat.com/fonts/roboto/roboto-font.css", rel: "stylesheet" },
            injectTo: "head"
        },
        {
            tag: "link",
            attrs: { href: "https://static.davidaugustat.com/bootstrap-4.6.0/css/bootstrap.min.css", rel: "stylesheet" },
            injectTo: "head"
        },
        {
            tag: "link",
            attrs: { rel: "apple-touch-icon", sizes: "180x180", href: "/assets/img/favicons/apple-touch-icon.png" },
            injectTo: "head"
        },
        {
            tag: "link",
            attrs: { rel: "icon", type: "image/png", sizes: "32x32", href: "/assets/img/favicons/favicon-32x32.png" },
            injectTo: "head"
        },
        {
            tag: "link",
            attrs: { rel: "icon", type: "image/png", sizes: "16x16", href: "/assets/img/favicons/favicon-16x16.png" },
            injectTo: "head"
        },
        {
            tag: "link",
            attrs: { rel: "manifest", href: "/assets/img/favicons/site.webmanifest" },
            injectTo: "head"
        },
        {
            tag: "link",
            attrs: { rel: "mask-icon", href: "/assets/img/favicons/safari-pinned-tab.svg", color: "#5bbad5" },
            injectTo: "head"
        },
        {
            tag: "link",
            attrs: { rel: "shortcut icon", href: "/assets/img/favicons/favicon.ico" },
            injectTo: "head"
        },
        {
            tag: "meta",
            attrs: { name: "apple-mobile-web-app-title", content: "Matrixer" },
            injectTo: "head"
        },
        {
            tag: "meta",
            attrs: { name: "application-name", content: "Matrixer" },
            injectTo: "head"
        },
        {
            tag: "meta",
            attrs: { name: "msapplication-TileColor", content: "#ffffff" },
            injectTo: "head"
        },
        {
            tag: "meta",
            attrs: { name: "msapplication-config", content: "/assets/img/favicons/browserconfig.xml" },
            injectTo: "head"
        },
        {
            tag: "meta",
            attrs: { name: "theme-color", content: "#ffffff" },
            injectTo: "head"
        },
        {
            tag: "script",
            attrs: { type: "module", src: "/app/main.js" },
            injectTo: "body"
        }
    ];
}

/**
 * Creates the local Vite plugin that adds shared tags to physical HTML entries.
 *
 * @returns {import("vite").Plugin} The Vite HTML transformation plugin.
 */
export function createHtmlPagesPlugin() {
    /**
     * Adds the shared tags to an HTML entry.
     *
     * @param {string} html The entry's original HTML.
     * @returns {{html: string, tags: import("vite").HtmlTagDescriptor[]}} The transformed entry definition.
     */
    function transformEntryHtml(html) {
        return {
            html,
            tags: createSharedPageTags()
        };
    }

    return {
        name: "matrixer-html-pages",
        transformIndexHtml: {
            order: "pre",
            handler: transformEntryHtml
        }
    };
}
