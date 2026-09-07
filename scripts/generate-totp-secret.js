#!/usr/bin/env node
// Eenmalig hulpmiddel om een ADMIN_TOTP_SECRET aan te maken.
//
// Gebruik: npm run totp:generate
//
// De output is bedoeld voor twee plekken:
//  1. ADMIN_TOTP_SECRET in Vercel (Environment Variables).
//  2. De authenticator-app (Google Authenticator, Authy, 1Password, ...),
//     via handmatige invoer van de sleutel of de otpauth-URL.
//
// Er wordt hier bewust geen QR-code getekend: dat vraagt een extra
// dependency voor iets dat elke authenticator-app ook accepteert als
// handmatig ingevoerde sleutel.

import { generateTotpSecret } from "../app/lib/totp.js";

const issuer = "VastgoedDirectNederland";
const label = process.argv[2] || "admin";
const secret = generateTotpSecret();
const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

console.log("Nieuw TOTP-secret — zet dit als ADMIN_TOTP_SECRET in Vercel:");
console.log(`  ${secret}`);
console.log("");
console.log("Handmatige invoer in de authenticator-app:");
console.log(`  Account: ${issuer} (${label})`);
console.log(`  Sleutel: ${secret}`);
console.log("  Type: op tijd gebaseerd, 6 cijfers, 30 seconden, SHA1");
console.log("");
console.log("Of via een QR-generator naar keuze met deze otpauth-URL:");
console.log(`  ${otpauthUrl}`);
console.log("");
console.log("Let op: dit secret bestaat maar één keer. Bewaar het net zo zorgvuldig als ADMIN_PASSWORD.");
