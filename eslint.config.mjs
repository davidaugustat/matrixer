/**
 * @file Configures lightweight JavaScript, Vue, and JSDoc linting.
 */

import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import vue from "eslint-plugin-vue";
import globals from "globals";

export default [
    {
        ignores: [
            ".nuxt/**",
            "coverage/**",
            "distribution/**",
            "node_modules/**",
            "other/**",
            "playwright-report/**",
            "test-results/**"
        ]
    },
    js.configs.recommended,
    ...vue.configs["flat/essential"],
    {
        files: ["**/*.{js,mjs,vue}"],
        rules: {
            // Allow unused parameters when they start with an underscore
            "no-unused-vars": ["error", {
                argsIgnorePattern: "^_"
            }],
            "vue/multi-word-component-names": "off"
        }
    },
    {
        files: [
            "app/**/*.{js,vue}",
            "server/**/*.js",
            "shared/**/*.js",
            "source/**/*.js",
            "tests/**/*.js",
            "*.{js,mjs}"
        ],
        plugins: {
            jsdoc
        },
        rules: {
            "jsdoc/check-param-names": "error",
            "jsdoc/check-property-names": "error",
            "jsdoc/check-types": "error",
            "jsdoc/require-param-name": "error",
            "jsdoc/require-param-type": "error",
            "jsdoc/require-returns-type": "error",
            "jsdoc/valid-types": "error"
        }
    },
    {
        files: ["app/**/*.{js,vue}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                computed: "readonly",
                defineNuxtPlugin: "readonly",
                definePageMeta: "readonly",
                onMounted: "readonly",
                onNuxtReady: "readonly",
                ref: "readonly",
                shallowRef: "readonly",
                toRef: "readonly",
                useHead: "readonly",
                useNuxtApp: "readonly",
                useRoute: "readonly",
                useRouter: "readonly",
                useRuntimeConfig: "readonly",
                watch: "readonly"
            }
        }
    },
    {
        files: [
            "server/**/*.js",
            "tests/**/*.js",
            "*.{js,mjs}"
        ],
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    },
    {
        files: ["tests/e2e/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser
            }
        }
    },
    {
        files: ["source/**/*.js"],
        languageOptions: {
            globals: {
                console: "readonly"
            }
        }
    },
    {
        files: ["server/**/*.js"],
        languageOptions: {
            globals: {
                defineEventHandler: "readonly",
                setResponseHeader: "readonly",
                useRuntimeConfig: "readonly"
            }
        }
    },
    {
        files: ["nuxt.config.js"],
        languageOptions: {
            globals: {
                defineNuxtConfig: "readonly"
            }
        }
    }
];
