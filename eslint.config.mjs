import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"
import tseslint from "typescript-eslint"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

export default tseslint.config(
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            // TypeScript
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "warn",

            // React
            "react/self-closing-comp": "warn",
            "react/jsx-curly-brace-presence": ["warn", "never"],

            // General
            "no-console": "warn",
            "prefer-const": "error",
        },
    },
    {
        ignores: [".next/**", "node_modules/**"],
    },
)
