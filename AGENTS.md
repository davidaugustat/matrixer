# Matrixer
An online calculator with support for finite fields and linear algebra

## About the project
This is an online calculator built using JavaScript and Vue.js. It is a pure frontend application with all the code running in the browser and no code being executed in the backend.

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

The input syntax is described in `./source/app/pages/instructions/InstructionsEn.vue`

## Repository Structure
```
.
├── plugins                       # Vite plugins
├── README.md                     # README file
├── source                        # all the code
│   ├── app                       # Vue components, pages, localization and UI-related logic
│   ├── assets                    # CSS resources
│   ├── public                    # images and other static resources copied by Vite
│   ├── mathEngine                # all code related to expression parsing, calculation and result string generation
│   │   ├── math                  # actual calculation logic
│   │   └── stringInterpretation  # input string parsing and output string generation
│   │       └── result            # classes to represent and format the final result of a calculation
│   ├── de                        # minimal German HTML entry files
│   ├── en                        # minimal English HTML entry files
│   └── index.html                # minimal English calculator HTML entry file
├── distribution                  # Output of the bundler. Only contains generated code and is gitignored.
├── other                         # Nothing important. Some screenshots and logo images for the Readme and some unused code.
├── vite.config.js                # Vite configuration file
├── package.json                  # node.js package file
└── package-lock.json             # node.js package lock file
```

## Build System
This project uses Vite to bundle the code into static files. Page-specific metadata is stored in the physical
multi-page HTML entries, while a local Vite plugin injects tags shared by every page. The files are then hosted on a
static HTTP server.

## Coding Style
- Clean code: Code must be well-structured. Create methods and classes where appropriate.
- JSDoc: Every class and method must have JSDoc. The JSDoc must include type definitions for parameters and the return value.
- Use LF (`\n`) encoding for line endings.
- Code must be properly formatted.
- When writing German text (e.g., in frontend text or error messages), feel free to use the characters ä,ö,ü,ß,Ä,Ö,Ü,ẞ.
- Keep `AGENTS.md` and `README.md` up-to-date. After completing a coding task, check if your changes require adapting the `AGENTS.md` and/or `README.md` file.
