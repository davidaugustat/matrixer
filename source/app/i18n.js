import { createI18n } from "vue-i18n";

const messages = {
    en: {
        header: {
            switchLanguage: "Switch to German",
            languageImageAlt: "German website",
            githubTitle: "View Code on GitHub",
            githubImageAlt: "GitHub icon"
        },
        footer: {
            github: "View Code on GitHub",
            about: "About this Website",
            contact: "Contact",
            privacy: "Privacy",
            errorPrompt: "You found an error? Something doesn't work?",
            report: "Report it to me!"
        },
        calculator: {
            introduction: "Matrixer is a simple calculator that can not only calculate with real numbers, but also with several finite fields like F3, F4 or F8. Additionally as the name suggests, Matrixer is able to calculate with matrices as well as vectors.",
            placeholder: "Enter your expression...",
            field: "Field:",
            realNumbers: "R (real numbers)",
            finiteField: "F{field} ({count} elements)",
            calculate: "Calculate",
            errorHeading: "Oh no! Matrixer has detected an error:",
            inputCorrect: "You are sure that your input is correct?",
            reportError: "Report an error!",
            yourInput: "Your Input:",
            result: "Result:",
            code: "Code:",
            copy: "Copy",
            span: "Span:",
            trivialSolution: "Trivial Solution:",
            rowReducedMatrix: "Row-Reduced Matrix:",
            noSolution: "No Solution"
        }
    },
    de: {
        header: {
            switchLanguage: "Switch to English",
            languageImageAlt: "English website",
            githubTitle: "Code auf GitHub",
            githubImageAlt: "GitHub Logo"
        },
        footer: {
            github: "Code auf GitHub",
            about: "Über diese Webseite",
            contact: "Kontakt",
            privacy: "Datenschutz",
            errorPrompt: "Fehler gefunden? Etwas funktioniert nicht?",
            report: "Melde es mir!"
        },
        calculator: {
            introduction: "Matrixer ist ein Online-Rechner, der nicht nur mit reellen Zahlen, sondern auch über endlichen Körpern wie z.B. F3, F4 oder F8 rechnen kann. Wie der Name schon sagt, kann Matrixer zusätzlich auch mit Matrizen sowie Vektoren rechnen.",
            placeholder: "Gib einen mathematischen Ausdruck ein...",
            field: "Körper:",
            realNumbers: "R (reelle Zahlen)",
            finiteField: "F{field} ({count} Elemente)",
            calculate: "Berechnen",
            errorHeading: "Matrixer hat einen Fehler erkannt:",
            inputCorrect: "Du bist dir sicher, dass deine Eingabe korrekt ist?",
            reportError: "Melde einen Fehler.",
            yourInput: "Deine Eingabe:",
            result: "Ergebnis:",
            code: "Code:",
            copy: "Kopieren",
            span: "Aufspann:",
            trivialSolution: "Triviale Lösung:",
            rowReducedMatrix: "Matrix in Zeilen-Stufen-Form:",
            noSolution: "Keine Lösung"
        }
    }
};

/**
 * Creates the application localization service.
 *
 * @param {import("./routing").Locale} locale The page locale.
 * @returns {import("vue-i18n").I18n} The configured Vue I18n instance.
 */
export function createLocalization(locale) {
    return createI18n({
        legacy: false,
        locale,
        fallbackLocale: "en",
        messages
    });
}
