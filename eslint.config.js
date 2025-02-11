import pluginJs from "@eslint/js"
import react from "eslint-plugin-react"
import globals from "globals"
import tseslint from "typescript-eslint"

/** @type {import("eslint").Linter.Config} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { 
      globals: globals.browser, 
      parser: tseslint.parser,
      parserOptions: {
        'ecmaVersion': 12,
        'sourceType': 'module',
        'project': './tsconfig.json'
      }, 
    },
    plugins: {
      "react": react,
      "@typescript-eslint": tseslint.plugin
    },
    settings: {
      react: {
        version: "detect", // Ceci détecte automatiquement la version de React
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      "react/display-name": "off",
      "react/react-in-jsx-scope": "off",
    },
    ignores: ["node_modules", "scripts", "dist", "build", "eslint.config.js", "vite.config.ts"], // Remplace .eslintignore
  },
]
