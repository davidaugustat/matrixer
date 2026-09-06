/**
 * @file Defines the public pages shared by static generation, sitemap output, and browser tests.
 */

export const PUBLIC_PAGES = Object.freeze([
    {
        path: "/",
        title: "Matrixer - Calculator for Finite Fields and Linear Algebra",
        language: "en"
    },
    {
        path: "/de/",
        title: "Matrixer - Rechner für endliche Körper und lineare Algebra",
        language: "de"
    },
    {
        path: "/en/about/",
        title: "About - Matrixer",
        language: "en"
    },
    {
        path: "/de/about/",
        title: "Über diese Webseite - Matrixer",
        language: "de"
    },
    {
        path: "/en/report-error/",
        title: "Report an Error - Matrixer",
        language: "en"
    },
    {
        path: "/de/report-error/",
        title: "Fehler melden - Matrixer",
        language: "de"
    }
]);

export const PUBLIC_ROUTE_PATHS = Object.freeze(PUBLIC_PAGES.map(({ path }) => path));

/**
 * Returns the public metadata registered for a route.
 *
 * @param {string} path Public route path.
 * @returns {object} Registered page metadata.
 * @throws {Error} When the requested route is not registered.
 */
export function getPublicPage(path) {
    const page = PUBLIC_PAGES.find((candidate) => candidate.path === path);

    if (page == null) {
        throw new Error(`Unknown public route: ${path}`);
    }

    return page;
}
