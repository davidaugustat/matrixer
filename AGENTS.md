# Matrixer
An online calculator with support for finite fields and linear algebra

## About the project
This is an online calculator built using JavaScript. It is a pure frontend application with all the code running in the browser and no code being executed in the backend.

## Features
**All functions work with real numbers and on the finite fields F2, F3, F4, F5, F7, F8, F9, F11, F13, F17 and F19.**

- Doing **basic math** (addition, subtraction, multiplication, division, exponentiation) with numbers
- Calculating the **multiplicative inverse** of a number or invertible matrix
- Calculating the **additive inverse** of a number
- **Multiplication, addition and subtraction of matrices**
- **Transposing** matrices
- **Multiplication of matrices by vectors**
- **Multiplication, addition and subtraction of vectors**
- Solving **homogeneous equation systems**
- Converting a matrix to 
**[reduced row echelon form](https://en.wikipedia.org/wiki/Row_echelon_form#Reduced_row_echelon_form)**
- Calculating the **determinant** of a matrix

The English input syntax is described in `./app/components/content/InstructionsEn.vue`.

## Repository Structure
```
.
├── README.md                     # README file
├── app                           # Nuxt application code
│   ├── assets                    # CSS processed by Vite
│   ├── components                # shared Vue UI and localized content components
│   ├── composables               # calculator state and Vue Router query synchronization
│   ├── layouts                   # shared page shell
│   ├── locales                   # English and German UI copy
│   ├── pages                     # explicit routes for the six existing URLs
│   ├── plugins                   # client-side integrations such as SPA analytics tracking
│   └── utils                     # browser UI utilities
├── public                        # assets copied unchanged to the generated site
├── shared                        # public route metadata shared by generation, sitemap output and tests
├── server                        # build-time routes for generated robots and sitemap text files
├── source
│   └── mathEngine                # expression parsing, calculation and result string generation
│       ├── math                  # actual calculation logic
│       └── stringInterpretation  # input string parsing and output string generation
│           └── result            # classes to represent and format the final result of a calculation
├── tests
│   ├── logic                     # Vitest regression tests for the public math-engine facade
│   └── e2e                       # Playwright tests against the generated static site
├── distribution                  # Static Nuxt output. Generated and gitignored.
├── other                         # Nothing important. Some screenshots and logo images for the Readme and some unused code.
├── nuxt.config.js                # Nuxt static-generation, asset and math-engine alias configuration
├── package.json                  # node.js package file
└── package-lock.json             # node.js package lock file
```

## Build System
This project uses Nuxt 4 with Vue and Vite. `npm run build` runs `nuxt generate` and writes the complete static site
to `distribution`. Production hosting must serve that directory as static files; it does not run Nuxt or Node.js.
The production base URL is configured by `BASE_URL` in `nuxt.config.js`; it supplies page metadata and the generated
`robots.txt` and plain-text sitemap. `HOST_ENABLE_ANALYTICS` separately defines the hostname on which Matomo tracking
is enabled.

## Test System
`npm run lint` checks JavaScript and Vue files with ESLint, including lightweight JSDoc validation.
`npm run test:logic` runs the Node-based Vitest math-engine suite. `npm run test:coverage` runs the same suite and writes
text, HTML and JSON coverage reports to `coverage`. `npm run test:e2e` runs Chromium through Playwright against a build
in `distribution`; Playwright manages the static test server, and the browser can be installed once with
`npx playwright install chromium`. `npm test` runs the logic suite, production generation and the browser suite;
linting remains a separate `npm run lint` command. GitHub Actions uses separate code-quality, math-engine,
production-build and browser-test jobs for every pull request and for pushes to `master`. The browser job consumes the
build artifact; any failed job fails the workflow.

## Internals
The URL structure is intentionally asymmetric and must remain unchanged: English calculator content is at
`/`, English secondary pages are below `/en/`, and all German pages are below `/de/`. Localization uses explicit
pages and shared locale data rather than an i18n routing module. Public route metadata is centralized in
`shared/publicRoutes.js` for generation, sitemap output and browser tests. Bootstrap 4 CSS and Roboto remain externally
hosted, while KaTeX is bundled from NPM. Internal navigation uses Vue Router through `NuxtLink`, and calculator query
state is synchronized through a composable rather than direct History API access.

## Coding Style
- Clean code: Code must be well-structured. Create methods and classes where appropriate.
- JSDoc: Every class and method must have JSDoc. The JSDoc must include type definitions for parameters and the return value. Each non-class JavaScript or Vue file needs file-level JSDoc with an `@file` tag explaining what this file is for.
- Parts that may be difficult to understand must have explanatory comments.
- Use LF (`\n`) encoding for line endings.
- Code must be properly formatted.
- When writing German text (e.g., in frontend text or error messages), feel free to use the characters ä,ö,ü,ß,Ä,Ö,Ü,ẞ.
- Keep `AGENTS.md` and `README.md` up-to-date. After completing a coding task, check if your changes require adapting the `AGENTS.md` and/or `README.md` file.
- Bash scripts and CI configs must have explanatory comments explaining every semantic step.
