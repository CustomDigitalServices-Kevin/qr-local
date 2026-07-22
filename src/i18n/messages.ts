export const SUPPORTED_LOCALES = ["fr", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const fr = {
  "app.title": "QR Studio local",
  "app.tagline":
    "URL, Wi-Fi, vCard, virement SEPA : générez vos QR codes directement dans votre navigateur.",
  "app.localBanner":
    "100% local : vos données ne quittent jamais votre navigateur. Aucun envoi, aucun serveur.",

  "nav.home": "Accueil",
  "nav.privacy": "Confidentialité et RGPD",
  "nav.licenses": "Licences tierces",

  "studio.title": "Générateur de QR code",
  "studio.typeLabel": "Type de contenu",
  "studio.previewTitle": "Aperçu",
  "studio.previewPending": "Choisissez un type et renseignez le formulaire pour générer le QR code.",
  "studio.static.title": "QR code statique",
  "studio.static.body":
    "Le QR code généré ici est statique : son contenu est figé au moment de la création. Le QR dynamique (modification du contenu après impression, suivi des scans) nécessite un serveur, impossible en 100% local.",

  "qr.type.url": "Lien URL",
  "qr.type.text": "Texte libre",
  "qr.type.wifi": "Réseau Wi-Fi",
  "qr.type.vcard": "Contact (vCard)",
  "qr.type.mecard": "Contact (MeCard)",
  "qr.type.mailto": "E-mail",
  "qr.type.sms": "SMS",
  "qr.type.tel": "Téléphone",
  "qr.type.geo": "Coordonnées GPS",
  "qr.type.sepa": "Virement SEPA",

  "privacy.title": "Confidentialité et RGPD",
  "privacy.back": "Retour à l'accueil",
  "privacy.intro.title": "Vos données restent chez vous",
  "privacy.intro.body":
    "Ce générateur fonctionne entièrement dans votre navigateur, avec les API web natives. Aucune donnée saisie n'est jamais envoyée à un serveur, y compris le nôtre.",
  "privacy.local.title": "Génération 100% locale",
  "privacy.local.body":
    "Chaque QR code est calculé dans votre navigateur. Le logo éventuel est lu localement via FileReader, sans aucun téléversement. Le code source de l'application est chargé une seule fois, puis l'outil fonctionne hors ligne.",
  "privacy.comparison.title": "Contrairement aux générateurs en ligne",
  "privacy.comparison.body":
    "Les générateurs cloud envoient le contenu de vos QR codes (identifiants Wi-Fi, coordonnées bancaires SEPA, contacts) sur des serveurs tiers, et proposent souvent des QR dynamiques qui suivent vos scans. Avec ce générateur, ce risque n'existe pas : rien n'est téléversé et aucun scan n'est traçable.",
  "privacy.data.title": "Aucune donnée personnelle collectée",
  "privacy.data.body":
    "Nous ne collectons aucune donnée personnelle, aucun identifiant, aucune adresse e-mail. Il n'y a pas de compte utilisateur, pas de base de données, pas d'analytics tiers embarqué sur cette application.",
  "privacy.cookies.title": "Pas de cookies",
  "privacy.cookies.body":
    "Cette application ne dépose aucun cookie de suivi. Votre préférence de langue et votre historique sont conservés uniquement dans le stockage local de votre navigateur, sur votre appareil.",

  "licenses.title": "Licences tierces",
  "licenses.back": "Retour à l'accueil",
  "licenses.intro":
    "Ce générateur est un logiciel libre publié sous licence MIT. Il s'appuie sur les bibliothèques open source suivantes, exécutées entièrement dans votre navigateur.",
  "licenses.columnLibrary": "Bibliothèque",
  "licenses.columnLicense": "Licence",

  "footer.brand": "Custom Digital Services",

  "trust.gdpr.title": "Conforme RGPD par design",
  "trust.gdpr.body":
    "Aucune donnée ne transite : la politique de sécurité (CSP) du navigateur bloque techniquement tout envoi.",
  "trust.offline.title": "Fonctionne hors ligne",
  "trust.offline.body":
    "Une fois chargée, l'application est mise en cache : générez vos QR codes même sans connexion.",
  "trust.opensource.title": "Open source (MIT)",
  "trust.opensource.body":
    "Code source public sous licence MIT. Aucun tracker, aucun cookie, aucune inscription.",

  "form.section.content": "Contenu",
  "form.optional": "(optionnel)",

  "form.url.url": "URL / lien",
  "form.url.url.ph": "https://exemple.com",

  "form.text.text": "Texte",
  "form.text.text.ph": "Votre texte à encoder",

  "form.wifi.ssid": "Nom du réseau (SSID)",
  "form.wifi.password": "Mot de passe",
  "form.wifi.auth": "Sécurité",
  "form.wifi.auth.wpa": "WPA / WPA2",
  "form.wifi.auth.wep": "WEP",
  "form.wifi.auth.nopass": "Aucune (réseau ouvert)",
  "form.wifi.hidden": "Réseau masqué (SSID non diffusé)",

  "form.contact.firstName": "Prénom",
  "form.contact.lastName": "Nom",
  "form.contact.org": "Société",
  "form.contact.title": "Fonction",
  "form.contact.phone": "Téléphone",
  "form.contact.email": "E-mail",
  "form.contact.url": "Site web",
  "form.contact.nameHint": "Renseignez au moins le prénom ou le nom.",

  "form.mailto.to": "Destinataire",
  "form.mailto.to.ph": "contact@exemple.com",
  "form.mailto.subject": "Objet",
  "form.mailto.body": "Message",

  "form.sms.phone": "Numéro",
  "form.sms.message": "Message",

  "form.tel.phone": "Numéro de téléphone",
  "form.tel.phone.ph": "+33612345678",

  "form.geo.lat": "Latitude",
  "form.geo.lon": "Longitude",
  "form.geo.lat.ph": "48.8566",
  "form.geo.lon.ph": "2.3522",
  "form.geo.hint": "Coordonnées en degrés décimaux, séparateur point.",

  "form.sepa.name": "Bénéficiaire",
  "form.sepa.iban": "IBAN",
  "form.sepa.bic": "BIC",
  "form.sepa.amount": "Montant (EUR)",
  "form.sepa.amount.ph": "12.50",
  "form.sepa.amount.hint": "Séparateur décimal : le point. Exemple : 12.50",
  "form.sepa.purpose": "Code motif",
  "form.sepa.reference": "Référence structurée",
  "form.sepa.remittance": "Communication libre",
  "form.sepa.exclusiveHint":
    "Référence structurée et communication libre sont exclusives : remplissez l'une ou l'autre.",
  "form.sepa.info": "Information bénéficiaire",

  "style.title": "Personnalisation",
  "style.fgColor": "Couleur des modules",
  "style.bgColor": "Couleur de fond",
  "style.dotType": "Style des points",
  "style.cornersSquare": "Coins — cadre extérieur",
  "style.cornersDot": "Coins — centre",
  "style.gradient": "Dégradé sur les modules",
  "style.gradientColor": "Couleur de fin du dégradé",
  "style.ecc": "Correction d'erreur",
  "style.ecc.hint": "Niveau de redondance. Forcé au maximum (H) lorsqu'un logo est présent.",
  "style.logo": "Logo au centre",
  "style.logo.add": "Ajouter un logo",
  "style.logo.remove": "Retirer le logo",
  "style.logo.hint": "Lu localement via votre navigateur, jamais téléversé.",
  "style.logoSize": "Taille du logo",

  "style.dot.square": "Carré",
  "style.dot.rounded": "Arrondi",
  "style.dot.dots": "Points",
  "style.dot.classy": "Chic",
  "style.dot.classy-rounded": "Chic arrondi",
  "style.dot.extra-rounded": "Très arrondi",
  "style.corner.square": "Carré",
  "style.corner.dot": "Rond",
  "style.corner.extra-rounded": "Arrondi",

  "style.ecc.L": "L — 7 %",
  "style.ecc.M": "M — 15 %",
  "style.ecc.Q": "Q — 25 %",
  "style.ecc.H": "H — 30 %",

  "preview.contrastWarning":
    "Contraste insuffisant (moins de 3:1) : le QR code risque de ne pas être lisible. Augmentez le contraste entre les modules et le fond.",
  "preview.error": "Aperçu impossible. Vérifiez les valeurs saisies.",
  "preview.data": "Contenu encodé",
  "preview.bytes": "octets",

  "export.title": "Export",
  "export.svg": "SVG",
  "export.png": "PNG HD",
  "export.pdf": "PDF",
  "export.size": "Résolution PNG / PDF",
  "export.pending": "Renseignez le formulaire pour activer l'export.",
  "export.working": "Génération…",
  "export.failed": "Échec de l'export. Réessayez.",

  "batch.title": "Génération par lot",
  "batch.intro":
    "Une entrée par ligne. Chaque ligne devient un QR code, le tout dans une archive ZIP.",
  "batch.valueType": "Type de chaque ligne",
  "batch.valueType.url": "URL",
  "batch.valueType.text": "Texte",
  "batch.input": "Liste des valeurs",
  "batch.input.ph": "https://exemple.com/1\nhttps://exemple.com/2",
  "batch.import": "Importer un fichier .csv ou .txt",
  "batch.format": "Format des fichiers",
  "batch.detected": "valeur(s) détectée(s)",
  "batch.generate": "Générer le ZIP",
  "batch.working": "Génération du ZIP…",
  "batch.empty": "Ajoutez au moins une valeur.",
  "batch.failed": "Échec de la génération du ZIP.",
  "batch.done": "Archive ZIP générée.",

  "history.title": "Historique",
  "history.empty":
    "Aucun QR code généré pour l'instant. Votre historique reste sur cet appareil.",
  "history.restore": "Réutiliser",
  "history.remove": "Supprimer",
  "history.clear": "Vider l'historique",
  "history.note": "Conservé uniquement dans le stockage local de votre navigateur.",

  "error.url.empty": "L'URL est obligatoire.",
  "error.text.empty": "Le texte est obligatoire.",
  "error.wifi.ssid.empty": "Le nom du réseau (SSID) est obligatoire.",
  "error.wifi.password.empty": "Le mot de passe est obligatoire pour un réseau sécurisé.",
  "error.vcard.name.empty": "Renseignez au moins le prénom ou le nom.",
  "error.mecard.name.empty": "Renseignez au moins le prénom ou le nom.",
  "error.mailto.to.empty": "L'adresse du destinataire est obligatoire.",
  "error.sms.phone.empty": "Le numéro est obligatoire.",
  "error.tel.phone.empty": "Le numéro de téléphone est obligatoire.",
  "error.tel.phone.invalid": "Le numéro de téléphone doit contenir des chiffres.",
  "error.geo.latitude.invalid": "La latitude doit être comprise entre -90 et 90.",
  "error.geo.longitude.invalid": "La longitude doit être comprise entre -180 et 180.",
  "error.sepa.name.empty": "Le nom du bénéficiaire est obligatoire.",
  "error.sepa.name.tooLong": "Le nom du bénéficiaire ne doit pas dépasser 70 caractères.",
  "error.sepa.iban.empty": "L'IBAN est obligatoire.",
  "error.sepa.iban.invalid": "Le format de l'IBAN est invalide.",
  "error.sepa.bic.invalid": "Le BIC doit comporter 8 ou 11 caractères.",
  "error.sepa.amount.invalid": "Le montant doit être un nombre décimal (2 décimales maximum).",
  "error.sepa.amount.range": "Le montant doit être compris entre 0.01 et 999999999.99 EUR.",
  "error.sepa.purpose.tooLong": "Le code motif ne doit pas dépasser 4 caractères.",
  "error.sepa.reference.tooLong": "La référence structurée ne doit pas dépasser 25 caractères.",
  "error.sepa.remittance.tooLong": "La communication libre ne doit pas dépasser 140 caractères.",
  "error.sepa.remittance.exclusive":
    "Renseignez soit une référence structurée, soit une communication libre, pas les deux.",
  "error.sepa.info.tooLong": "L'information bénéficiaire ne doit pas dépasser 70 caractères.",
  "error.sepa.tooLarge": "Le contenu dépasse la limite de 331 octets du standard EPC.",
} as const;

export type MessageKey = keyof typeof fr;

const en: Record<MessageKey, string> = {
  "app.title": "Local QR Studio",
  "app.tagline":
    "URL, Wi-Fi, vCard, SEPA transfer: generate your QR codes directly in your browser.",
  "app.localBanner":
    "100% local: your data never leaves your browser. No upload, no server.",

  "nav.home": "Home",
  "nav.privacy": "Privacy & GDPR",
  "nav.licenses": "Third-party licenses",

  "studio.title": "QR code generator",
  "studio.typeLabel": "Content type",
  "studio.previewTitle": "Preview",
  "studio.previewPending": "Pick a type and fill in the form to generate the QR code.",
  "studio.static.title": "Static QR code",
  "studio.static.body":
    "The QR code generated here is static: its content is fixed at creation time. Dynamic QR codes (editing the content after printing, tracking scans) require a server, which is impossible in a 100% local tool.",

  "qr.type.url": "URL link",
  "qr.type.text": "Plain text",
  "qr.type.wifi": "Wi-Fi network",
  "qr.type.vcard": "Contact (vCard)",
  "qr.type.mecard": "Contact (MeCard)",
  "qr.type.mailto": "E-mail",
  "qr.type.sms": "SMS",
  "qr.type.tel": "Phone",
  "qr.type.geo": "GPS coordinates",
  "qr.type.sepa": "SEPA transfer",

  "privacy.title": "Privacy & GDPR",
  "privacy.back": "Back to home",
  "privacy.intro.title": "Your data stays with you",
  "privacy.intro.body":
    "This generator runs entirely in your browser, using native web APIs. No data you enter is ever sent to a server, including ours.",
  "privacy.local.title": "100% local generation",
  "privacy.local.body":
    "Every QR code is computed in your browser. Any logo is read locally via FileReader, with no upload whatsoever. The application code is loaded once, then the tool works offline.",
  "privacy.comparison.title": "Unlike online generators",
  "privacy.comparison.body":
    "Cloud generators send the content of your QR codes (Wi-Fi credentials, SEPA banking details, contacts) to third-party servers, and often offer dynamic QR codes that track your scans. With this generator, that risk does not exist: nothing is uploaded and no scan can be traced.",
  "privacy.data.title": "No personal data collected",
  "privacy.data.body":
    "We collect no personal data, no identifiers, no email address. There is no user account, no database, no third-party analytics embedded in this application.",
  "privacy.cookies.title": "No cookies",
  "privacy.cookies.body":
    "This application sets no tracking cookies. Your language preference and history are kept only in your browser's local storage, on your device.",

  "licenses.title": "Third-party licenses",
  "licenses.back": "Back to home",
  "licenses.intro":
    "This generator is free software released under the MIT license. It relies on the following open source libraries, all running entirely in your browser.",
  "licenses.columnLibrary": "Library",
  "licenses.columnLicense": "License",

  "footer.brand": "Custom Digital Services",

  "trust.gdpr.title": "GDPR-compliant by design",
  "trust.gdpr.body":
    "No data ever transits: the browser's security policy (CSP) technically blocks any upload.",
  "trust.offline.title": "Works offline",
  "trust.offline.body":
    "Once loaded, the application is cached: generate your QR codes even without a connection.",
  "trust.opensource.title": "Open source (MIT)",
  "trust.opensource.body":
    "Publicly available source code under the MIT license. No tracker, no cookie, no sign-up.",

  "form.section.content": "Content",
  "form.optional": "(optional)",

  "form.url.url": "URL / link",
  "form.url.url.ph": "https://example.com",

  "form.text.text": "Text",
  "form.text.text.ph": "Your text to encode",

  "form.wifi.ssid": "Network name (SSID)",
  "form.wifi.password": "Password",
  "form.wifi.auth": "Security",
  "form.wifi.auth.wpa": "WPA / WPA2",
  "form.wifi.auth.wep": "WEP",
  "form.wifi.auth.nopass": "None (open network)",
  "form.wifi.hidden": "Hidden network (SSID not broadcast)",

  "form.contact.firstName": "First name",
  "form.contact.lastName": "Last name",
  "form.contact.org": "Company",
  "form.contact.title": "Job title",
  "form.contact.phone": "Phone",
  "form.contact.email": "E-mail",
  "form.contact.url": "Website",
  "form.contact.nameHint": "Fill in at least the first or last name.",

  "form.mailto.to": "Recipient",
  "form.mailto.to.ph": "contact@example.com",
  "form.mailto.subject": "Subject",
  "form.mailto.body": "Message",

  "form.sms.phone": "Number",
  "form.sms.message": "Message",

  "form.tel.phone": "Phone number",
  "form.tel.phone.ph": "+33612345678",

  "form.geo.lat": "Latitude",
  "form.geo.lon": "Longitude",
  "form.geo.lat.ph": "48.8566",
  "form.geo.lon.ph": "2.3522",
  "form.geo.hint": "Coordinates in decimal degrees, point separator.",

  "form.sepa.name": "Beneficiary",
  "form.sepa.iban": "IBAN",
  "form.sepa.bic": "BIC",
  "form.sepa.amount": "Amount (EUR)",
  "form.sepa.amount.ph": "12.50",
  "form.sepa.amount.hint": "Decimal separator: point. Example: 12.50",
  "form.sepa.purpose": "Purpose code",
  "form.sepa.reference": "Structured reference",
  "form.sepa.remittance": "Free-text remittance",
  "form.sepa.exclusiveHint":
    "Structured reference and free-text remittance are mutually exclusive: fill in one or the other.",
  "form.sepa.info": "Beneficiary information",

  "style.title": "Customization",
  "style.fgColor": "Module color",
  "style.bgColor": "Background color",
  "style.dotType": "Dot style",
  "style.cornersSquare": "Corners — outer frame",
  "style.cornersDot": "Corners — center",
  "style.gradient": "Gradient on modules",
  "style.gradientColor": "Gradient end color",
  "style.ecc": "Error correction",
  "style.ecc.hint": "Redundancy level. Forced to the maximum (H) when a logo is present.",
  "style.logo": "Center logo",
  "style.logo.add": "Add a logo",
  "style.logo.remove": "Remove logo",
  "style.logo.hint": "Read locally in your browser, never uploaded.",
  "style.logoSize": "Logo size",

  "style.dot.square": "Square",
  "style.dot.rounded": "Rounded",
  "style.dot.dots": "Dots",
  "style.dot.classy": "Classy",
  "style.dot.classy-rounded": "Classy rounded",
  "style.dot.extra-rounded": "Extra rounded",
  "style.corner.square": "Square",
  "style.corner.dot": "Round",
  "style.corner.extra-rounded": "Rounded",

  "style.ecc.L": "L — 7%",
  "style.ecc.M": "M — 15%",
  "style.ecc.Q": "Q — 25%",
  "style.ecc.H": "H — 30%",

  "preview.contrastWarning":
    "Insufficient contrast (below 3:1): the QR code may not scan. Increase the contrast between the modules and the background.",
  "preview.error": "Preview unavailable. Check the entered values.",
  "preview.data": "Encoded content",
  "preview.bytes": "bytes",

  "export.title": "Export",
  "export.svg": "SVG",
  "export.png": "HD PNG",
  "export.pdf": "PDF",
  "export.size": "PNG / PDF resolution",
  "export.pending": "Fill in the form to enable export.",
  "export.working": "Generating…",
  "export.failed": "Export failed. Try again.",

  "batch.title": "Batch generation",
  "batch.intro": "One entry per line. Each line becomes a QR code, all packed into a ZIP archive.",
  "batch.valueType": "Type of each line",
  "batch.valueType.url": "URL",
  "batch.valueType.text": "Text",
  "batch.input": "List of values",
  "batch.input.ph": "https://example.com/1\nhttps://example.com/2",
  "batch.import": "Import a .csv or .txt file",
  "batch.format": "File format",
  "batch.detected": "value(s) detected",
  "batch.generate": "Generate ZIP",
  "batch.working": "Generating ZIP…",
  "batch.empty": "Add at least one value.",
  "batch.failed": "ZIP generation failed.",
  "batch.done": "ZIP archive generated.",

  "history.title": "History",
  "history.empty": "No QR code generated yet. Your history stays on this device.",
  "history.restore": "Reuse",
  "history.remove": "Remove",
  "history.clear": "Clear history",
  "history.note": "Kept only in your browser's local storage.",

  "error.url.empty": "URL is required.",
  "error.text.empty": "Text is required.",
  "error.wifi.ssid.empty": "The network name (SSID) is required.",
  "error.wifi.password.empty": "A password is required for a secured network.",
  "error.vcard.name.empty": "Fill in at least the first or last name.",
  "error.mecard.name.empty": "Fill in at least the first or last name.",
  "error.mailto.to.empty": "The recipient address is required.",
  "error.sms.phone.empty": "The number is required.",
  "error.tel.phone.empty": "The phone number is required.",
  "error.tel.phone.invalid": "The phone number must contain digits.",
  "error.geo.latitude.invalid": "Latitude must be between -90 and 90.",
  "error.geo.longitude.invalid": "Longitude must be between -180 and 180.",
  "error.sepa.name.empty": "The beneficiary name is required.",
  "error.sepa.name.tooLong": "The beneficiary name must be 70 characters or fewer.",
  "error.sepa.iban.empty": "IBAN is required.",
  "error.sepa.iban.invalid": "The IBAN format is invalid.",
  "error.sepa.bic.invalid": "The BIC must be 8 or 11 characters.",
  "error.sepa.amount.invalid": "The amount must be a decimal number (2 decimals maximum).",
  "error.sepa.amount.range": "The amount must be between 0.01 and 999999999.99 EUR.",
  "error.sepa.purpose.tooLong": "The purpose code must be 4 characters or fewer.",
  "error.sepa.reference.tooLong": "The structured reference must be 25 characters or fewer.",
  "error.sepa.remittance.tooLong": "The free-text remittance must be 140 characters or fewer.",
  "error.sepa.remittance.exclusive":
    "Provide either a structured reference or free-text remittance, not both.",
  "error.sepa.info.tooLong": "The beneficiary information must be 70 characters or fewer.",
  "error.sepa.tooLarge": "The content exceeds the 331-byte EPC standard limit.",
};

export const messages: Record<Locale, Record<MessageKey, string>> = { fr, en };

export function detectLocale(): Locale {
  const candidates = typeof navigator === "undefined" ? [] : navigator.languages;
  for (const lang of candidates) {
    if (lang.toLowerCase().startsWith("fr")) return "fr";
    if (lang.toLowerCase().startsWith("en")) return "en";
  }
  return "fr";
}
