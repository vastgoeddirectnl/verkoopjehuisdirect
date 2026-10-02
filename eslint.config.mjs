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
    // Een aanroep van een functie die niet geïmporteerd is, faalt pas tijdens
    // het renderen. Zo crashte in 5.5.0 de lead-detailpagina op een vergeten
    // import in LeadTimeline.jsx. Deze regel vangt dat al bij `npm run lint`.
    rules: {
      "no-undef": "error",
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "public/**"],
  },
];

export default eslintConfig;
