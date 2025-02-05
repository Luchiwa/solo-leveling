import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import configPrettier from "eslint-config-prettier"; // Configuration Prettier

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    // Ajout de la configuration Prettier
    extends: [
      "plugin:prettier/recommended", // Active les règles Prettier
      configPrettier, // Désactive les règles ESLint qui peuvent entrer en conflit avec Prettier
    ],
  },
  {
    rules: {
      "prettier/prettier": ["error"], // Force l'application des règles Prettier
    },
  },
];
