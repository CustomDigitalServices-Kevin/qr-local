# QR Studio local

Générateur de QR codes **100% local**. Toute la génération se fait dans le
navigateur : vos données (identifiants Wi-Fi, coordonnées bancaires SEPA,
contacts) ne quittent jamais votre appareil. Aucun envoi, aucun serveur,
aucun cookie de suivi.

Local QR code generator. Everything runs in the browser — your data never
leaves your device. No upload, no server, no tracking cookie.

## Types de contenu

URL, texte libre, réseau Wi-Fi, contact vCard, contact MeCard, e-mail (mailto),
SMS, téléphone, coordonnées GPS (geo), virement SEPA (EPC069-12).

> Les QR codes générés sont **statiques** : leur contenu est figé à la
> création. Le QR dynamique (édition après impression, suivi des scans) exige
> un serveur, impossible en 100% local.

## Stack

- Vite 7 + React 19 + TypeScript 5.8 (strict)
- Tailwind CSS v4 (`@tailwindcss/vite`, config CSS-first)
- PWA (`vite-plugin-pwa`) pour le fonctionnement hors ligne
- CSP stricte injectée au build (`connect-src 'self'` = pas d'upload possible)
- [`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling) (MIT) — moteur QR stylisé
- [`@cantoo/pdf-lib`](https://github.com/cantoo-scribe/pdf-lib) (MIT) — export PDF
- [`jszip`](https://github.com/Stuk/jszip) (MIT) — export batch ZIP

## Scripts

| Commande | Rôle |
|----------|------|
| `npm run dev` | Serveur de développement Vite |
| `npm run build` | `tsc --noEmit` puis build de production |
| `npm run preview` | Prévisualisation du build |
| `npm run lint` | ESLint (TypeScript strict) |
| `npm run typecheck` | Vérification de types |
| `npm run test` | Tests unitaires Vitest |
| `npm run test:e2e` | Tests end-to-end Playwright |
| `npm run check:licenses` | Refuse toute dépendance AGPL/LGPL |

## Confidentialité

L'application n'envoie aucune requête réseau porteuse de données. La CSP
(`connect-src 'self'`) le garantit au niveau du navigateur : un test E2E
Playwright vérifie qu'aucune requête sortante ne quitte `localhost`.

## Licence

MIT — Custom Digital Services (Kevin Tomas).
