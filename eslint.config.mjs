import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Pravila gradnje 4.6: vse povezave gredo prek SmartLink (nov zavihek za zunanje, isti za notranje).
    files: ["src/**/*.tsx"],
    ignores: ["src/components/SmartLink.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name='a']",
          message: "Uporabi <SmartLink> (src/components/SmartLink.tsx) namesto surovega <a>.",
        },
        {
          selector: "ImportDeclaration[source.value='next/link']",
          message: "Uporabi <SmartLink> (src/components/SmartLink.tsx) namesto next/link.",
        },
      ],
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
