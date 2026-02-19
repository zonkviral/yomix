import tseslint from "typescript-eslint"
import nextPlugin from "@next/eslint-plugin-next"
import reactPlugin from "eslint-plugin-react"

export default [
    // TypeScript base config (this registers the plugin correctly)
    ...tseslint.configs.recommended,

    {
        plugins: {
            "@next/next": nextPlugin,
            react: reactPlugin,
        },

        rules: {
            // Next.js
            ...nextPlugin.configs["core-web-vitals"].rules,

            // TypeScript
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": "error",

            // React
            "react/self-closing-comp": "error",
            "react/jsx-curly-brace-presence": ["warn", "never"],

            // General
            "no-console": "error",
            "prefer-const": "error",
        },
    },

    {
        ignores: [".next/**", "node_modules/**"],
    },
]
