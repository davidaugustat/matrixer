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
├── source
│   └── mathEngine                # expression parsing, calculation and result string generation
│       ├── math                  # actual calculation logic
│       └── stringInterpretation  # input string parsing and output string generation
│           └── result            # classes to represent and format the final result of a calculation
├── distribution                  # Static Nuxt output. Generated and gitignored.
├── other                         # Nothing important. Some screenshots and logo images for the Readme and some unused code.
├── nuxt.config.js                # Nuxt static-generation, asset and math-engine alias configuration
├── package.json                  # node.js package file
└── package-lock.json             # node.js package lock file
```

## Build System
This project uses Nuxt 4 with Vue and Vite. `npm run build` runs `nuxt generate` and writes the complete static site
to `distribution`. Production hosting must serve that directory as static files; it does not run Nuxt or Node.js.

## Internals
The URL structure is intentionally asymmetric and must remain unchanged: English calculator content is at
`/`, English secondary pages are below `/en/`, and all German pages are below `/de/`. Localization uses explicit
pages and shared locale data rather than an i18n routing module. Bootstrap 4 CSS and Roboto remain externally hosted,
while KaTeX is bundled from NPM. Internal navigation uses Vue Router through `NuxtLink`, and calculator query state is
synchronized through a composable rather than direct History API access.

## Coding Style
- Clean code: Code must be well-structured. Create methods and classes where appropriate.
- JSDoc: Every class and method must have JSDoc. The JSDoc must include type definitions for parameters and the return value. Each non-class JavaScript or Vue file needs file-level JSDoc with an `@file` tag explaining what this file is for.
- Use LF (`\n`) encoding for line endings.
- Code must be properly formatted.
- When writing German text (e.g., in frontend text or error messages), feel free to use the characters ä,ö,ü,ß,Ä,Ö,Ü,ẞ.
- Keep `AGENTS.md` and `README.md` up-to-date. After completing a coding task, check if your changes require adapting the `AGENTS.md` and/or `README.md` file.
