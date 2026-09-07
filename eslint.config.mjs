// Flat config (LINT-01). Vervangt .eslintrc.json.
//
// eslint-config-next levert (in deze versie) nog geen eigen flat config,
// dus FlatCompat vertaalt de oude "extends"-vorm. @eslint/eslintrc is
// daarvoor als devDependency toegevoegd, met een geregenereerde lockfile.

import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: ["node_modules/**", ".next/**", "public/**"],
  },
];

export default eslintConfig;
