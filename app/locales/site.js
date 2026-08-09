const fieldValues = [100, 2, 3, 4, 5, 7, 8, 9, 11, 13, 17, 19];

export const siteLocales = Object.freeze({
    en: {
        code: "en",
        homeHref: "/",
        logoAlt: "Matrixer logo",
        languageHref: "/de",
        languageTitle: "Switch to German",
        languageIcon: "/assets/img/germany-flag.svg",
        languageAlt: "German website",
        githubTitle: "View Code on GitHub",
        githubAlt: "GitHub icon",
        introduction: "Matrixer is a simple calculator that can not only calculate with real numbers, but also with several finite fields like F3, F4 or F8. Additionally as the name suggests, Matrixer is able to calculate with matrices as well as vectors.",
        calculator: {
            placeholder: "Enter your expression...",
            fieldLabel: "Field: ",
            fieldOptions: fieldValues.map((value) => ({
                value,
                label: value === 100 ? "R (real numbers)" : `F${value} (${value} elements)`
            })),
            calculate: "Calculate",
            errorTitle: "Oh no! Matrixer has detected an error:",
            errorQuestion: "You are sure that your input is correct?",
            reportError: "Report an error!",
            inputTitle: "Your Input:",
            resultTitle: "Result:",
            codeLabel: "Code:",
            copy: "Copy",
            span: "Span:",
            trivialSolution: "Trivial Solution:",
            rowReducedMatrix: "Row-Reduced Matrix:",
            noSolution: "No Solution"
        },
        footer: {
            github: "View Code on GitHub",
            about: "About this Website",
            aboutHref: "/en/about",
            contact: "Contact",
            contactHref: "https://davidaugustat.com/contact",
            privacy: "Privacy",
            reportPrefix: "You found an error? Something doesn't work?",
            reportText: "Report it to me!",
            reportHref: "/en/report-error"
        }
    },
    de: {
        code: "de",
        homeHref: "/de",
        logoAlt: "Matrixer Logo",
        languageHref: "/",
        languageTitle: "Switch to English",
        languageIcon: "/assets/img/united-kingdom-flag.svg",
        languageAlt: "English website",
        githubTitle: "Code auf GitHub",
        githubAlt: "GitHub Logo",
        introduction: "Matrixer ist ein Online-Rechner, der nicht nur mit reellen Zahlen, sondern auch über endlichen Körpern wie z.B. F3, F4 oder F8 rechnen kann. Wie der Name schon sagt, kann Matrixer zusätzlich auch mit Matrizen sowie Vektoren rechnen.",
        calculator: {
            placeholder: "Gib einen mathematischen Ausdruck ein...",
            fieldLabel: "Körper: ",
            fieldOptions: fieldValues.map((value) => ({
                value,
                label: value === 100 ? "R (reelle Zahlen)" : `F${value} (${value} Elemente)`
            })),
            calculate: "Berechnen",
            errorTitle: "Matrixer hat einen Fehler erkannt:",
            errorQuestion: "Du bist dir sicher, dass deine Eingabe korrekt ist?",
            reportError: "Melde einen Fehler.",
            inputTitle: "Deine Eingabe:",
            resultTitle: "Ergebnis:",
            codeLabel: "Code:",
            copy: "Kopieren",
            span: "Aufspann:",
            trivialSolution: "Triviale Lösung:",
            rowReducedMatrix: "Matrix in Zeilen-Stufen-Form:",
            noSolution: "Keine Lösung"
        },
        footer: {
            github: "Code auf GitHub",
            about: "Über diese Webseite",
            aboutHref: "/de/about",
            contact: "Kontakt",
            contactHref: "https://davidaugustat.com/kontakt",
            privacy: "Datenschutz",
            reportPrefix: "Fehler gefunden? Etwas funktioniert nicht?",
            reportText: "Melde es mir!",
            reportHref: "/de/report-error"
        }
    }
});

/**
 * Returns the immutable UI copy for a supported locale.
 *
 * @param {string} locale Locale code requested by a page.
 * @returns {object} Localized UI copy.
 */
export function getSiteLocale(locale) {
    return siteLocales[locale] ?? siteLocales.en;
}
