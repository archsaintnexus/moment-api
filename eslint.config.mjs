// @ts-check
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [
      "dist/**",
      "src/generated/**",
      "node_modules/**",
      "coverage/**",
      "logs/**",
      "jest.config.mjs",
    ],
  },

  eslint.configs.recommended,

  ...tseslint.configs.recommended,

  // Project-wide overrides
  {
    rules: {
      // TypeScript already enforces these via strict compiler options,
      // but ESLint can surface them earlier in the editor
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",

      // General best practices
      "no-console": "warn",
    },
  },
);
