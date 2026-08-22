import AdsLeadMiniForm from "./AdsLeadMiniForm";
import SeoReviewBand from "./seo/SeoReviewBand";

const whatsappBase = "https://wa.me/31612238051";
const primaryCta = "Ontvang een vrijblijvend verkoopvoorstel";
const secondaryCta = "Bespreek eerst mijn situatie";

const internalLinks = [
  ["/huis-snel-verkopen", "Huis snel verkopen"],
  ["/huis-direct-verkopen", "Huis direct verkopen"],
  ["/woning-verkopen-zonder-makelaar", "Woning verkopen zonder makelaar"],
  ["/opknapwoning-verkopen", "Opknapwoning verkopen"],
  ["/leegstaand-huis-verkopen", "Leegstaand huis verkopen"],
  ["/huis-verkopen-zonder-leeghalen", "Huis verkopen zonder leeghalen"],
  ["/huis-verkopen-zonder-opknappen", "Huis verkopen zonder opknappen"],
  ["/huis-verkopen-in-huidige-staat", "Huis verkopen in huidige staat"],
  ["/woning-verkopen-die-nog-vol-staat", "Woning verkopen die nog vol staat"],
  ["/geerfde-woning-verkopen-zonder-leeghalen", "Geërfde woning verkopen zonder leeghalen"],
  ["/opknapwoning-verkopen-zonder-makelaar", "Opknapwoning verkopen zonder makelaar"],
  ["/leegstaand-huis-verkopen-wat-zijn-de-opties", "Leegstaand huis verkopen: opties"],
  ["/huis-verkopen-bij-dubbele-lasten", "Huis verkopen bij dubbele lasten"],
  ["/huis-verkopen-bij-erfenis", "Huis verkopen bij erfenis"],
  ["/verhuurde-woning-verkopen", "Verhuurde woning verkopen"],
  ["/huis-verkopen-met-achterstallig-onderhoud", "Huis verkopen met achterstallig onderhoud"],
  ["/huis-verkopen-zonder-bezichtigingen", "Huis verkopen zonder bezichtigingen"],
  ["/huis-verkopen-aan-opkoper", "Huis verkopen aan opkoper"],
  ["/huis-verkopen-groningen", "Huis verkopen in Groningen"],
  ["/woning-verkopen-drenthe", "Woning verkopen in Drenthe"],
  ["/woning-verkopen-friesland", "Woning verkopen in Friesland"],
  ["/woning-verkopen-overijssel", "Woning verkopen in Overijssel"],
];

function relatedLinksFor(page) {
  if (Array.isArray(page.relatedLinks) && page.relatedLinks.length) {
    return page.relatedLinks.filter(([href]) => href !== page.slug).slice(0, 12);
  }

  return internalLinks.filter(([href]) => href !== page.slug).slice(0, 12);
}

const linkDescriptions = {
  "/huis-snel-verkopen": "Wanneer snelheid en duidelijkheid belangrijk zijn.",
  "/huis-direct-verkopen": "Rechtstreeks duidelijkheid over de verkoopmogelijkheden.",
  "/woning-verkopen-zonder-makelaar": "Zonder traditioneel makelaarstraject verkopen.",
  "/opknapwoning-verkopen": "Voor woningen met onderhoud of renovatiebehoefte.",
  "/leegstaand-huis-verkopen": "Bij leegstand, zorgen of doorlopende lasten.",
  "/huis-verkopen-zonder-leeghalen": "Ook wanneer de woning nog niet leeg is.",
  "/huis-verkopen-zonder-opknappen": "Bekijk mogelijkheden zonder eerst te verbouwen.",
  "/huis-verkopen-in-huidige-staat": "Verkoopmogelijkheden zonder eerst verkoopklaar maken.",
  "/woning-verkopen-die-nog-vol-staat": "Voor woningen met spullen of inboedel in de woning.",
  "/geerfde-woning-verkopen-zonder-leeghalen": "Rustig overzicht bij een geërfde woning.",
  "/opknapwoning-verkopen-zonder-makelaar": "Opknapwoning verkopen zonder regulier verkooptraject.",
  "/leegstaand-huis-verkopen-wat-zijn-de-opties": "Bekijk welke routes passen bij leegstand.",
  "/huis-verkopen-bij-dubbele-lasten": "Wanneer planning, zekerheid en lasten meespelen.",
  "/huis-verkopen-bij-erfenis": "Praktische oplossing bij een erfenis of nalatenschap.",
  "/verhuurde-woning-verkopen": "Ook mogelijk wanneer huur of gebruik een rol speelt.",
  "/huis-verkopen-met-achterstallig-onderhoud": "Als onderhoud of herstel niet wenselijk is voor verkoop.",
  "/huis-verkopen-zonder-bezichtigingen": "Geen open huis of reeks kijkers nodig.",
  "/huis-verkopen-aan-opkoper": "Vergelijk rustig wat direct verkopen betekent.",
  "/huis-verkopen-groningen": "Verkoopmogelijkheden in Groningen en omgeving.",
  "/woning-verkopen-drenthe": "Voor woningen in Drenthe, dorpen en buitengebieden.",
  "/woning-verkopen-friesland": "Persoonlijke verkoopoplossing in Friesland.",
  "/woning-verkopen-overijssel": "Ook actief in Overijssel en omliggende regio’s.",
  "/huis-verkopen-stadskanaal": "Lokale verkoopmogelijkheden in en rond Stadskanaal.",
  "/huis-verkopen-veendam": "Voor verkoopvragen in Veendam en omgeving.",
  "/huis-verkopen-winschoten": "Rustig inzicht in verkoopmogelijkheden rond Winschoten.",
  "/huis-verkopen-assen": "Voor verkoopvragen in Assen en omgeving.",
  "/huis-verkopen-emmen": "Voor woningen in Emmen en Zuidoost-Drenthe.",
  "/huis-verkopen-borger": "Voor woningeigenaren in Borger en de Hondsrug-regio.",
  "/huis-verkopen-gieten": "Voor verkoopvragen in Gieten en omgeving.",
};

const geoSlugs = new Set([
  "/huis-verkopen-groningen",
  "/woning-verkopen-drenthe",
  "/woning-verkopen-friesland",
  "/woning-verkopen-overijssel",
  "/huis-verkopen-stadskanaal",
  "/huis-verkopen-veendam",
  "/huis-verkopen-winschoten",
  "/huis-verkopen-assen",
  "/huis-verkopen-emmen",
  "/huis-verkopen-borger",
  "/huis-verkopen-gieten",
]);

function isGeoPage(page) {
  return geoSlugs.has(page.slug) || page.pageType === "region";
}

function relatedSectionCopy(page) {
  if (isGeoPage(page)) {
    return {
      eyebrow: "Ook relevant",
      title: "Veelvoorkomende situaties in deze regio",
      text: "Bekijk verwante verkoopsituaties of nabijgelegen regio’s zonder dat het een losse linklijst wordt.",
      action: "Bekijk meer →",
    };
  }

  return {
    eyebrow: "Ook relevant",
    title: "Gerelateerde verkoopsituaties en regio’s",
    text: "Een paar logische vervolgstappen als u zich verder wilt oriënteren.",
    action: "Lees meer →",
  };
}

function relatedCardsFor(page) {
  return relatedLinksFor(page).map(([href, label, text]) => ({
    href,
    label,
    text: text || linkDescriptions[href] || "Bekijk rustig welke verkooproute hierbij past.",
  }));
}

function normaliseExample(page) {
  if (page.practiceExample) return page.practiceExample;
  if (!page.exampleSituation) return null;

  return {
    situation: page.exampleSituation.title,
    mainProblem: page.exampleSituation.text,
  };
}

function trimText(text, maxLength = 155) {
  if (!text) return "";
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const shortened = clean.slice(0, maxLength).replace(/\s+\S*$/, "").trim();
  return `${shortened}...`;
}

function pageTypeCopy(page) {
  if (page.pageType === "region") {
    return {
      eyebrow: "Regionale verkoopoplossing",
      valueTitle: `Verkopen in ${page.regionName || page.breadcrumb} met duidelijke afspraken`,
      valueText: "Ook regionaal draait het niet alleen om snelheid. We kijken naar de woning, de situatie en de gewenste planning, zodat u eerst rustig kunt beoordelen welke verkooproute past.",
    };
  }

  if (page.pageType === "situation") {
    return {
      eyebrow: "Situatiegericht verkopen",
      valueTitle: "Geen standaard verkooptraject wanneer uw situatie niet standaard is.",
      valueText: "Bij erfenis, onderhoud, leegstand of een volle woning spelen andere vragen dan bij een reguliere verkoop. Daarom kijken we eerst naar de situatie en leggen we afspraken duidelijk vast.",
    };
  }

  return {
    eyebrow: "Hoge koopintentie",
    valueTitle: "Snel duidelijkheid zonder direct een lang verkooptraject te starten.",
    valueText: "U wilt vooral weten wat er concreet mogelijk is. Daarom houden we de aanvraag laagdrempelig en krijgt u waar mogelijk eerst een vrijblijvende inschatting of voorstel.",
  };
}

export default function SeoLandingPage({ page }) {
  const faqs = Array.isArray(page.faqs) ? page.faqs : [];
  const sections = Array.isArray(page.sections) ? page.sections : [];
  const benefits = Array.isArray(page.benefits) ? page.benefits : [];
  const heroBenefits = Array.isArray(page.heroBenefits) && page.heroBenefits.length
    ? page.heroBenefits.slice(0, 4)
    : benefits.slice(0, 4);
  const comparisonRows = Array.isArray(page.comparisonRows) ? page.comparisonRows : [];
  const relatedCards = relatedCardsFor(page);
  const relatedCopy = relatedSectionCopy(page);
  const example = normaliseExample(page);
  const typeCopy = pageTypeCopy(page);
  const showFaqSchema = faqs.length > 0;
  const concernCards = Array.isArray(page.concernCards) ? page.concernCards : [];
  const solutionCards = Array.isArray(page.solutionCards) ? page.solutionCards : [];
  const ownerTasks = Array.isArray(page.ownerTasks) ? page.ownerTasks : [];
  const vdnTasks = Array.isArray(page.vdnTasks) ? page.vdnTasks : [];
  const hasExplicitProcessSteps = Array.isArray(page.processSteps) && page.processSteps.length > 0;
  const fallbackProcessSection = sections.find((section) => Array.isArray(section.steps) && section.steps.length);
  const processSteps = hasExplicitProcessSteps
    ? page.processSteps
    : fallbackProcessSection?.steps || [];
  const processTitle = page.processTitle || fallbackProcessSection?.title || "Zo verloopt een vrijblijvende aanvraag";
  const processIntro = page.processIntro || "De aanvraag is bedoeld om eerst duidelijkheid te krijgen. Een koopovereenkomst ontstaat pas na uitwerking en ondertekening door beide partijen.";
  const contentSections = sections.filter((section) => {
    if (section !== fallbackProcessSection) return true;
    return Boolean(section.paragraphs?.length || section.bullets?.length);
  });
  const formTrustItems = Array.isArray(page.formTrustItems) && page.formTrustItems.length
    ? page.formTrustItems
    : [
        "Vrijblijvende aanvraag",
        "Persoonlijk contact",
        "Schriftelijke afspraken",
        "Notariële overdracht",
      ];
  const afterRequestTitle = page.afterRequestTitle || "Wat gebeurt er na uw aanvraag?";
  const afterRequestText = page.afterRequestText || "Wij beoordelen de woninggegevens en uw situatie. Waar mogelijk ontvangt u een eerste vrijblijvende inschatting of verkoopvoorstel. Als er nog informatie nodig is, nemen wij kort contact met u op.";
  const heroNote = page.heroNote || "Vrijblijvend. U ontvangt eerst duidelijkheid en beslist daarna zelf.";
  const premiumCards = [
    {
      title: page.premiumCardOneTitle || "Eerst duidelijkheid",
      text: trimText(page.shortAnswer || "U vraagt eerst vrijblijvend duidelijkheid aan over prijs, planning en voorwaarden. Daarna beslist u rustig of u verder wilt.", 165),
    },
    {
      title: page.premiumCardTwoTitle || "Minder verkoopgedoe",
      text: trimText(solutionCards[0] || benefits[0] || "Geen standaard traject met onnodige voorbereiding, open huis of verkoopdruk wanneer dat niet bij uw situatie past.", 155),
    },
    {
      title: page.premiumCardThreeTitle || "Schriftelijk en notarieel",
      text: "Bij akkoord worden prijs, planning, oplevering en voorwaarden schriftelijk vastgelegd en loopt de overdracht via de notaris.",
    },
  ];
  const routePreviewCards = relatedCards.slice(0, 4);
  const comparisonProofs = [
    ["Niet alleen prijs", "Vergelijk ook kosten, voorbereiding, doorlooptijd en zekerheid."],
    ["Minder afhankelijkheden", "Geen standaard reeks bezichtigingen of open huis nodig voor een eerste voorstel."],
    ["Meer zekerheid na akkoord", "Afspraken worden uitgewerkt met duidelijke voorwaarden en notariële afwikkeling."],
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.vastgoeddirectnederland.nl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.breadcrumb,
        item: `https://www.vastgoeddirectnederland.nl${page.slug}`,
      },
    ],
  };

  const whatsappText = encodeURIComponent(
    `Hallo, ik wil graag mijn situatie bespreken over: ${page.breadcrumb}. Kunt u met mij meekijken?`
  );
  const whatsappLink = `${whatsappBase}?text=${whatsappText}`;

  return (
    <main className="seo-page">
      {showFaqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <style>{`
        *{box-sizing:border-box}
        body{margin:0}
        .seo-page{
          --navy:#071f3a;
          --navy2:#123a67;
          --orange:#D96A1C;
          --cream:#f5f2ec;
          --card:#fffdf9;
          --line:#e8e3db;
          --muted:#5f7083;
          --soft:#FFF1E6;
          font-family:Arial,Helvetica,sans-serif;
          color:var(--navy);
          background:linear-gradient(180deg,#fffdf9 0%,#f5f2ec 100%);
          overflow-x:hidden;
        }
        .container{width:min(1120px,calc(100% - 44px));margin:0 auto}
        .top-strip{background:var(--navy);color:#fff;font-size:13px;font-weight:900}
        .top-strip-inner{min-height:36px;display:flex;align-items:center;justify-content:center;gap:20px;text-align:center}
        .top-strip-inner span{white-space:nowrap}
        .header{position:sticky;top:0;z-index:70;background:rgba(255,255,255,.95);border-bottom:1px solid var(--line);backdrop-filter:blur(14px)}
        .header-inner{min-height:76px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:22px}
        .logo{display:block;width:225px;max-width:100%;height:auto;object-fit:contain}
        .nav{display:flex;justify-content:center;gap:20px;color:#24364a;font-size:14px;font-weight:900}
        .nav a{color:inherit;text-decoration:none;white-space:nowrap}
        .nav a:hover{color:var(--orange)}
        .header-actions{display:flex;align-items:center;gap:8px}
        .btn{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:999px;padding:13px 19px;font-weight:900;cursor:pointer;transition:.18s ease;white-space:nowrap;line-height:1;text-decoration:none}
        .btn:hover{transform:translateY(-1px)}
        .btn-orange{background:var(--orange);color:#fff;box-shadow:0 12px 28px rgba(217,106,28,.20)}
        .btn-blue{background:var(--navy);color:#fff}
        .btn-light{background:#fff;color:var(--navy);border:1px solid #e3ded6}
        .btn-green{background:#3E8F5E;color:#fff;box-shadow:0 12px 28px rgba(62,143,94,.18)}
        .hero{position:relative;overflow:hidden;background:radial-gradient(circle at 84% 6%,rgba(217,106,28,.13),transparent 30%),linear-gradient(180deg,#fffdf9 0%,#f6f2eb 100%)}
        .hero-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(420px,.82fr);gap:46px;align-items:center;padding:54px 0 56px}
        .badge{display:inline-flex;color:#B85216;background:var(--soft);border:1px solid #F2B885;border-radius:999px;padding:9px 14px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;margin-bottom:17px}
        h1{font-size:clamp(40px,4.4vw,62px);line-height:.98;letter-spacing:-2.2px;margin:0;color:var(--navy);max-width:760px}
        .lead{font-size:19px;line-height:1.62;color:#526274;max-width:720px;margin:20px 0 0}
        .hero-cta-row{display:flex;gap:11px;flex-wrap:wrap;align-items:center;margin:25px 0 0}
        .micro-note{font-size:13px;color:#647386;margin:13px 0 0;font-weight:850}
        .mobile-trust-line{display:none}
        .trust-micro{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:23px 0 0;max-width:760px}
        .trust-micro div{background:#fff;border:1px solid var(--line);border-radius:16px;padding:13px 14px;font-size:14px;font-weight:900;color:var(--navy);box-shadow:0 10px 22px rgba(7,31,58,.06)}
        .cta-card{background:#fff;border:1px solid #e7ded2;border-radius:28px;padding:24px;box-shadow:0 18px 52px rgba(7,31,58,.10)}
        .cta-logo{display:none}
        .cta-card h2{font-size:29px;line-height:1.08;letter-spacing:-.9px;margin:0 0 10px;color:var(--navy)}
        .cta-card p{color:#617184;line-height:1.5;margin:0 0 12px;font-size:14.5px}
        .ad-mini-form{display:grid;gap:9px;margin-top:12px}
        .ad-mini-form label{display:grid;gap:4px;color:#24364a;font-size:12px;font-weight:900}
        .ad-mini-form input,.ad-mini-form select{width:100%;border:1px solid #ded6cb;border-radius:12px;background:#fff;padding:10px 11px;color:#071f3a;font-size:14px;outline:none;min-height:42px}
        .ad-mini-form input:focus,.ad-mini-form select:focus{border-color:#D96A1C;box-shadow:0 0 0 3px rgba(217,106,28,.12)}
        .ad-mini-form-row.two{display:grid;grid-template-columns:1fr .56fr;gap:8px}
        .ad-mini-section{display:grid;gap:8px;background:#fbfaf7;border:1px solid #eee8df;border-radius:16px;padding:10px}.ad-mini-section-title{font-size:12px;font-weight:900;color:#071f3a;letter-spacing:.02em}.ad-mini-submit{width:100%;margin-top:1px;min-height:46px}
        .ad-mini-note{font-size:11.5px!important;line-height:1.35!important;margin:0!important;color:#647386!important;text-align:center}
        .ad-mini-error{background:#fff1f1;border:1px solid #f2b4b4;color:#8b1c1c!important;border-radius:12px;padding:9px 11px;font-size:13px!important;margin:0!important;line-height:1.35!important;font-weight:850}
        .ad-mini-success{background:#f0fff5;border:1px solid #bfe7cc;border-radius:16px;padding:14px;color:#103b22;margin-top:14px}
        .ad-mini-success strong{display:block;margin-bottom:5px;color:#103b22}
        .ad-mini-success p{margin:0!important;color:#315b3f!important;font-size:14px!important;line-height:1.45!important}
        .form-conversion-grid{display:grid;grid-template-columns:1fr;gap:12px;align-items:start;margin-top:10px}
        .form-trust-box{background:#fffaf4;border:1px solid #ead7c2;border-radius:16px;padding:12px 13px;display:grid;gap:9px;box-shadow:none}
        .form-trust-box strong{display:block;color:#071f3a;font-size:13.5px;line-height:1.25}
        .form-trust-box ul{display:grid;grid-template-columns:repeat(2,1fr);gap:7px 12px;list-style:none;margin:0;padding:0}.form-trust-box .form-contact-list{border-top:1px solid #ead7c2;padding-top:8px;gap:6px;grid-template-columns:repeat(2,1fr)}
        .form-trust-box li{font-size:12.5px;line-height:1.32;color:#405167;font-weight:850}
        .form-trust-box a{color:#071f3a;text-decoration:none;font-weight:900}
        .form-trust-box a:hover{color:#D96A1C}
        .after-request{display:grid;gap:4px;margin-top:11px;background:#fffaf4;border:1px solid #ead7c2;border-left:3px solid #D96A1C;border-radius:14px;padding:11px 12px;color:#24364a;font-size:12.8px;line-height:1.4}
        .after-request strong{color:#071f3a;font-size:13.5px}
        .seo-review-band{background:#fffdf9;border-top:1px solid #eadfd3;border-bottom:1px solid #eadfd3;padding:16px 0}
        .seo-review-link{display:grid;grid-template-columns:auto 1fr auto;gap:18px;align-items:center;text-decoration:none;color:inherit}
        .seo-review-score{background:#fff;border:1px solid var(--line);border-radius:18px;padding:13px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 10px 24px rgba(7,31,58,.045)}
        .seo-review-score strong{font-size:31px;line-height:.95;letter-spacing:-1px;color:var(--navy)}
        .seo-stars{color:#f5a400;letter-spacing:1.3px;font-size:15px;font-weight:900;line-height:1}
        .seo-review-score span{display:block;color:#647386;font-size:12.5px;font-weight:850;margin-top:4px}
        .seo-review-copy h2{font-size:24px;line-height:1.1;letter-spacing:-.5px;margin:0 0 5px;color:var(--navy)}
        .seo-review-copy p{margin:0;color:#647386;font-size:14.5px;line-height:1.5}
        .seo-review-cta{font-size:13px;font-weight:900;color:var(--orange);white-space:nowrap}
        .seo-premium-section{background:linear-gradient(180deg,#fff 0%,#fbf3e8 100%);border-top:1px solid #eadfd3;border-bottom:1px solid #eadfd3}
        .seo-premium-wrap{display:grid;gap:24px}
        .premium-intro{display:grid;grid-template-columns:.78fr 1.22fr;gap:28px;align-items:end}
        .premium-intro h2{font-size:clamp(28px,2.8vw,40px);line-height:1.08;letter-spacing:-1px;margin:0;color:var(--navy)}
        .premium-intro p{margin:0;color:#526274;line-height:1.62;font-size:16px;max-width:650px}
        .premium-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
        .premium-card{position:relative;background:linear-gradient(180deg,#fff 0%,#fffaf4 100%);border:1px solid #dccbb8;border-radius:24px;padding:22px;box-shadow:0 16px 42px rgba(7,31,58,.08);overflow:hidden;min-height:178px}
        .premium-card:before{content:"";position:absolute;left:0;top:0;right:0;height:4px;background:linear-gradient(90deg,var(--orange) 0%,#F2B885 100%)}
        .premium-number{width:38px;height:38px;border-radius:14px;background:#FFF1E6;color:var(--orange);display:inline-flex;align-items:center;justify-content:center;font-weight:900;margin-bottom:13px}
        .premium-card h3{font-size:20px;line-height:1.16;margin:0 0 8px;color:var(--navy)}
        .premium-card p{margin:0;color:#526274;line-height:1.52;font-size:15px}
        .seo-route-strip{padding:50px 0;background:linear-gradient(180deg,#fffaf3 0%,#f7efe5 100%);border-top:1px solid #e4d3c0;border-bottom:1px solid #e4d3c0}
        .seo-route-head{display:flex;align-items:end;justify-content:space-between;gap:28px;margin-bottom:20px}
        .seo-route-head h2{font-size:clamp(28px,2.8vw,40px);line-height:1.1;letter-spacing:-.9px;margin:0;max-width:650px;color:var(--navy)}
        .seo-route-head p{max-width:430px;margin:0;color:#425266;line-height:1.55;font-size:16px}
        .seo-route-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
        .seo-route-card{position:relative;background:linear-gradient(180deg,#fff 0%,#fffaf4 100%);border:1px solid #dccbb8;border-radius:22px;padding:19px;text-decoration:none;color:inherit;box-shadow:0 16px 38px rgba(7,31,58,.09);display:grid;gap:10px;min-height:190px;transition:.18s ease;overflow:hidden}
        .seo-route-card:before{content:"";position:absolute;left:0;top:0;right:0;height:4px;background:linear-gradient(90deg,var(--orange) 0%,#F2B885 100%)}
        .seo-route-card:hover{border-color:#ffc49a;transform:translateY(-1px);box-shadow:0 18px 42px rgba(7,31,58,.12)}
        .seo-route-tag{width:36px;height:36px;border-radius:14px;background:#FFF1E6;color:var(--orange);display:inline-flex;align-items:center;justify-content:center;font-weight:900}
        .seo-route-card h3{margin:0;font-size:18px;line-height:1.18;color:var(--navy);letter-spacing:-.25px}
        .seo-route-card p{margin:0;color:#4f6074;line-height:1.48;font-size:14px}
        .seo-route-card span:last-child{margin-top:auto;color:var(--orange);font-weight:900;font-size:14px}
        .comparison-proof-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 18px}
        .comparison-proof{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.16);border-radius:18px;padding:14px 15px;color:#dbe7f3;line-height:1.42;font-size:14px}
        .comparison-proof strong{display:block;color:#fff;font-size:15px;margin-bottom:5px}
        .section{padding:58px 0}
        .section-white{background:#fff}
        .section-tight{padding:48px 0}
        .section-head{max-width:790px;margin:0 auto 30px;text-align:center}
        .eyebrow{color:var(--orange);font-weight:900;text-transform:uppercase;letter-spacing:.08em;margin:0 0 9px;font-size:12px}
        h2{font-size:clamp(31px,3.4vw,46px);line-height:1.06;letter-spacing:-1.4px;margin:0;color:var(--navy)}
        h3{font-size:22px;line-height:1.18;letter-spacing:-.35px;margin:0 0 9px;color:var(--navy)}
        .section-head p,.text{color:#647386;font-size:16px;line-height:1.62;margin-bottom:0}
        .short-answer h2{font-size:clamp(26px,2.4vw,38px);line-height:1.1;letter-spacing:-.9px}
        .section-head h2{font-size:clamp(28px,2.8vw,40px);line-height:1.1;letter-spacing:-1px}
        .card{background:#fff;border:1px solid var(--line);border-radius:26px;padding:26px;box-shadow:0 16px 44px rgba(7,31,58,.07)}
        .short-answer{display:grid;grid-template-columns:.76fr 1.24fr;gap:24px;align-items:center}
        .benefit-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-top:22px}
        .benefit-item{background:#fff;border:1px solid var(--line);border-radius:18px;padding:13px 15px;font-size:15px;font-weight:900;color:#24364a;box-shadow:0 12px 30px rgba(7,31,58,.055)}
        .insight-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
        .insight-card{background:#fff;border:1px solid var(--line);border-radius:26px;padding:24px;box-shadow:0 16px 44px rgba(7,31,58,.07)}
        .insight-card h2{font-size:clamp(24px,2.1vw,34px);line-height:1.14;letter-spacing:-.75px;margin-bottom:12px}
        .insight-list{display:grid;gap:10px;margin:0;padding:0;list-style:none}
        .insight-list li{background:#f8f5ef;border:1px solid #eee8df;border-radius:15px;padding:11px 13px;color:#24364a;font-size:15px;font-weight:850;line-height:1.42}
        .why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:26px}
        .why-card{background:#fff;border:1px solid var(--line);border-radius:26px;padding:24px;box-shadow:0 16px 44px rgba(7,31,58,.07)}
        .why-card strong{display:block;font-size:18px;line-height:1.2;color:var(--navy);margin-bottom:9px}
        .why-card p{margin:0;color:#647386;line-height:1.55;font-size:15px}
        .two-column-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px}
        .task-card{background:#fff;border:1px solid var(--line);border-radius:24px;padding:22px;box-shadow:0 14px 38px rgba(7,31,58,.055)}
        .task-card h3{font-size:21px;margin-bottom:12px}
        .content-grid{display:grid;gap:18px}
        .content-block{background:#fff;border:1px solid var(--line);border-radius:26px;padding:26px;box-shadow:0 14px 38px rgba(7,31,58,.055)}
        .content-block h2{font-size:clamp(24px,2vw,32px);line-height:1.14;letter-spacing:-.7px;margin:0 0 12px}
        .content-block p{color:#647386;font-size:16px;line-height:1.62;margin:0 0 12px}
        .content-block p:last-child{margin-bottom:0}
        .example-card{background:linear-gradient(135deg,#F7F2EC 0%,#ffffff 100%);border:1px solid #F2B885;border-radius:28px;padding:28px;box-shadow:0 16px 44px rgba(217,106,28,.08)}
        .example-card h2{font-size:clamp(24px,2.1vw,33px);line-height:1.12;letter-spacing:-.75px;margin-bottom:10px}
        .example-card p{color:#5f7083;font-size:16px;line-height:1.62;margin:0}
        .example-details{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:18px}
        .example-detail{background:#fff;border:1px solid #eadbca;border-radius:16px;padding:13px 14px}
        .example-detail strong{display:block;color:#071f3a;font-size:13px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:5px}
        .example-detail span{display:block;color:#526274;font-size:14px;line-height:1.45}
        .list{display:grid;gap:10px;margin:12px 0 0;padding:0;list-style:none}
        .list li{background:#f8f5ef;border:1px solid #eee8df;border-radius:15px;padding:10px 13px;color:#24364a;font-size:15px;font-weight:850;line-height:1.35}
        .steps{counter-reset:step;display:grid;gap:10px;margin:14px 0 0;padding:0;list-style:none}
        .steps li{display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:center;background:#f8f5ef;border:1px solid #eee8df;border-radius:16px;padding:10px 12px;color:#24364a;font-size:15px;font-weight:850}
        .steps li:before{counter-increment:step;content:counter(step);width:38px;height:38px;border-radius:14px;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900}
        .steps li small{display:block;color:#647386;font-weight:750;font-size:13.5px;line-height:1.42;margin-top:3px}
        .comparison-wrap{background:linear-gradient(135deg,var(--navy) 0%,var(--navy2) 100%);border-radius:32px;padding:32px;color:#fff;box-shadow:0 22px 66px rgba(7,31,58,.18)}
        .comparison-top{display:grid;grid-template-columns:.9fr 1.1fr;gap:26px;align-items:end;margin-bottom:22px}
        .comparison-top h2{color:#fff}
        .comparison-top p{color:#d7e3ef;line-height:1.62;font-size:17px;margin:0}
        .compare-columns{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .compare-box{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:24px;overflow:hidden}
        .compare-title{padding:16px 18px;background:rgba(255,255,255,.12);color:#fff;font-weight:900;text-align:center}
        .compare-title.orange{background:var(--orange)}
        .compare-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:13px 16px;border-top:1px solid rgba(255,255,255,.14);line-height:1.35}
        .compare-row strong{color:#fff;font-size:14px}
        .compare-row span{font-size:14px;color:#d7e3ef;font-weight:850}
        .faq{display:grid;gap:10px;max-width:940px;margin:0 auto}
        .faq-item{background:#fff;border:1px solid var(--line);border-radius:18px;padding:15px 18px;display:grid;grid-template-columns:minmax(220px,.42fr) 1fr;gap:22px;align-items:start}
        .faq-item p{margin:0;color:#647386;font-size:15px;line-height:1.55}
        .related-wrap{background:linear-gradient(180deg,#fff 0%,#fffaf4 100%);border:1px solid #dccbb8;border-radius:28px;padding:24px;box-shadow:0 18px 46px rgba(7,31,58,.085)}
        .related-wrap .section-head{margin-bottom:22px}
        .related-wrap .section-head p:not(.eyebrow){max-width:720px;margin-left:auto;margin-right:auto;color:#526274}
        .related-card-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        .related-card{background:linear-gradient(180deg,#fff 0%,#fffaf4 100%);border:1px solid #dfd2c4;border-left:4px solid #F2B885;border-radius:18px;padding:17px 18px;min-height:108px;display:grid;grid-template-columns:1fr;gap:0;align-items:start;color:#071f3a;text-decoration:none;box-shadow:0 10px 26px rgba(7,31,58,.055);transition:.18s ease}
        .related-card:hover{border-color:#D96A1C;border-left-color:#D96A1C;transform:translateY(-1px);box-shadow:0 14px 32px rgba(7,31,58,.10)}
        .related-card-content{display:grid;gap:6px}
        .related-card strong{display:block;font-size:17px;line-height:1.2;color:#071f3a}
        .related-card p{margin:0;color:#526274;line-height:1.5;font-size:14px;font-weight:400}
        .related-card span:not(.related-card-content){margin-top:2px;color:var(--orange);font-weight:900;font-size:14px}
        .final-cta{background:linear-gradient(135deg,var(--navy) 0%,var(--navy2) 100%);color:#fff;padding:58px 0;text-align:center}
        .final-cta h2{color:#fff}
        .final-cta p{color:#d7e3ef;font-size:18px;line-height:1.6;max-width:730px;margin:16px auto 0}
        .cta-buttons{display:flex;justify-content:center;gap:11px;flex-wrap:wrap;margin-top:24px}
        .footer{background:#061523;color:#cbd5e1;padding:36px 0 42px}
        .footer-grid{display:grid;grid-template-columns:1.15fr .8fr 1fr 1fr;gap:28px}
        .footer-logo{width:205px;max-width:100%;height:auto;background:#fff;border-radius:15px;padding:8px;object-fit:contain}
        .footer h3{color:#fff;margin:0 0 10px}
        .footer p{margin:6px 0;color:#b8c3d0;line-height:1.42}
        .footer a{color:inherit;text-decoration:none}
        .footer a:hover{color:#fff}
        .whatsapp-float{position:fixed;right:18px;bottom:18px;z-index:80;background:#3E8F5E;color:#fff;border-radius:999px;padding:13px 17px;font-weight:900;box-shadow:0 14px 32px rgba(62,143,94,.24);font-size:14px;text-decoration:none}
        .mobile-bottom-cta{display:none}

        @media(min-width:761px){
          .section{padding:46px 0}
          .section-tight{padding:36px 0}
          .section-head{max-width:720px;margin:0 auto 24px}
          .section-head h2{font-size:32px;line-height:1.12;letter-spacing:-.75px}
          .section-head p,.text{font-size:15.5px;line-height:1.58}
          .short-answer{gap:20px}
          .short-answer h2{font-size:28px;line-height:1.14;letter-spacing:-.6px}
          .content-grid{max-width:960px;margin:0 auto;gap:14px}
          .content-block{padding:20px 24px;border-radius:22px}
          .content-block h2{font-size:22px;line-height:1.22;letter-spacing:-.35px;margin:0 0 7px}
          .content-block p{font-size:14.5px;line-height:1.55;margin:0 0 8px}
          .example-card{max-width:960px;margin:0 auto;padding:20px 24px;border-radius:22px}
          .example-card h2{font-size:24px;line-height:1.15;letter-spacing:-.45px;margin:0 0 8px}
          .example-card p:not(.eyebrow){font-size:14.5px;line-height:1.55}
          .list{gap:6px;margin-top:9px}
          .list li{font-size:13.5px;line-height:1.28;padding:8px 12px;border-radius:12px}
          .steps{gap:7px;margin-top:10px}
          .steps li{font-size:14px;line-height:1.35;padding:8px 10px;border-radius:13px}
          .faq-item{padding:14px 16px;gap:18px;border-radius:16px}
          .faq-item h3{font-size:17px;line-height:1.25;letter-spacing:-.2px;margin:0}
          .faq-item p{font-size:14.5px;line-height:1.5}
          .related-wrap{padding:20px;border-radius:24px}
          .related-card{font-size:14px;padding:14px;border-radius:16px}
        }
        @media(max-width:1040px){
          .header-inner{grid-template-columns:auto auto}
          .nav{grid-column:1/-1;justify-content:flex-start;overflow-x:auto;gap:18px;padding:0 0 12px;scrollbar-width:none}
          .nav::-webkit-scrollbar{display:none}
          .hero-grid,.comparison-top,.short-answer,.insight-grid{grid-template-columns:1fr}
          .trust-micro,.benefit-grid{grid-template-columns:repeat(2,1fr)}
          .why-grid,.two-column-cards{grid-template-columns:1fr}
          .cta-card{max-width:620px;margin:0 auto}
          .footer-grid{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:760px){
          .container{width:min(100% - 32px,1120px);max-width:100%;overflow:visible}
          .top-strip{display:none}
          .header{position:relative}
          .header-inner{display:flex;align-items:center;min-height:auto;padding:11px 0;gap:10px;max-width:100%}
          .logo{width:min(176px,47vw)}
          .nav{display:none}
          .header-actions{margin-left:auto}
          .header-actions .btn-green,.header-actions .btn-blue{display:none}
          .header-actions .btn-orange{padding:10px 13px;font-size:13px;max-width:43vw;white-space:normal;text-align:center;line-height:1.1}
          .hero-grid{padding:22px 0 22px;gap:16px;max-width:100%;overflow:hidden}
          .badge{display:none}
          h1{font-size:clamp(32px,8.4vw,37px);line-height:1.1;letter-spacing:-.65px;max-width:100%;overflow-wrap:break-word;hyphens:auto}
          .lead{font-size:15.8px;line-height:1.48;margin-top:12px;max-width:100%}
          .hero-cta-row{margin-top:20px}
          .hero-cta-row .btn,.cta-buttons .btn{width:100%;max-width:100%;white-space:normal;text-align:center;line-height:1.15;min-height:46px}
          .hero-cta-row .btn-light{display:none}
          .micro-note{display:none}
          .mobile-trust-line{display:block;font-size:13px;color:#647386;font-weight:900;margin-top:12px;line-height:1.45}
          .trust-micro{display:none}
          .benefit-grid,.compare-columns,.related-card-grid,.example-details{grid-template-columns:1fr}
          .premium-intro,.premium-grid,.seo-route-grid,.comparison-proof-grid{grid-template-columns:1fr}
          .premium-intro{gap:12px}.premium-card{min-height:0}.seo-route-head{display:grid;gap:10px}.seo-route-grid{gap:10px}.seo-route-card{min-height:0;padding:17px}.comparison-proof-grid{margin-bottom:12px}
          .related-card{min-height:0;padding:15px 16px}.related-card p{line-height:1.42}
          .section{padding:34px 0}.section-tight{padding:30px 0}
          .section-head{text-align:left;margin-bottom:17px}
          .card,.content-block,.cta-card,.comparison-wrap,.why-card,.example-card,.insight-card,.task-card{border-radius:20px;padding:18px}
          .content-block h2,.example-card h2{font-size:24px;line-height:1.15;letter-spacing:-.5px}
          .section-head h2,.short-answer h2{font-size:28px;line-height:1.12;letter-spacing:-.65px}
          .content-block p,.example-card p,.section-head p,.text{font-size:15px;line-height:1.54}
          .cta-logo{display:none}
          .cta-card h2{font-size:24px}
          .form-conversion-grid{grid-template-columns:1fr;gap:12px}
          .form-trust-box{order:2}
          .form-trust-box ul,.form-trust-box .form-contact-list{grid-template-columns:1fr}
          .ad-mini-section{padding:9px;border-radius:14px}.ad-mini-form{gap:8px}.ad-mini-form label{font-size:12px}.ad-mini-form input,.ad-mini-form select{min-height:42px;font-size:16px;padding:9px 10px;border-radius:12px}.ad-mini-form-row.two{gap:7px}.ad-mini-submit{min-height:48px;white-space:normal;line-height:1.15;padding:12px 14px}.ad-mini-note{font-size:11.5px!important;line-height:1.35!important;padding:0 8px}.after-request{font-size:12.5px;line-height:1.42;padding:10px 11px;margin-top:10px}.after-request strong{font-size:13.2px}.form-trust-box{padding:10px 11px;border-radius:14px}.form-trust-box li{font-size:12px}
          .seo-review-link{grid-template-columns:1fr;gap:10px}
          .seo-review-score{width:100%;justify-content:flex-start}
          .seo-review-copy h2{font-size:22px}
          .seo-review-cta{display:none}
          .compare-row{grid-template-columns:1fr;gap:5px}
          .faq-item{display:block}
          .faq-item h3{margin-bottom:7px}
          .footer-grid{grid-template-columns:1fr}
          .whatsapp-float{display:none}
          .mobile-bottom-cta{position:fixed;left:10px;right:10px;bottom:10px;z-index:90;display:grid;grid-template-columns:1fr .72fr;gap:7px;background:rgba(255,255,255,.94);border:1px solid var(--line);border-radius:22px;padding:7px;box-shadow:0 18px 50px rgba(7,31,58,.18);backdrop-filter:blur(14px);max-width:calc(100vw - 20px)}
          .mobile-bottom-cta a{width:100%;min-width:0;min-height:46px;padding:11px 8px;font-size:13.5px;white-space:normal;text-align:center;line-height:1.1}
          .final-cta{padding-bottom:100px}
          .footer{padding-bottom:102px}
        }
        @media(max-width:380px){
          .container{width:min(100% - 24px,1120px)}
          .logo{width:min(160px,45vw)}
          .header-actions .btn-orange{font-size:12px;padding:9px 11px}
          h1{font-size:30px;line-height:1.1}
          .lead{font-size:15.5px}
          .mobile-bottom-cta{grid-template-columns:1fr .64fr}
          .mobile-bottom-cta a{font-size:12.5px}
        }

      `}</style>

      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>✓ Niet eerst opknappen</span>
          <span>✓ Niet leeghalen</span>
          <span>✓ Geen open huis nodig</span>
          <span>✓ Vrijblijvend voorstel</span>
        </div>
      </div>

      <header className="header">
        <div className="container header-inner">
          <a href="/" aria-label="Vastgoed Direct Nederland">
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="logo" />
          </a>

          <nav className="nav" aria-label="Navigatie">
            <a href="#aanvraag">Aanvraag</a>
            <a href="#voordelen">Voordelen</a>
            <a href="#vergelijking">Vergelijking</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="header-actions">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-green" data-analytics-event="secondary_cta_click" data-analytics-component="header_whatsapp">WhatsApp</a>
            <a href="tel:0612238051" className="btn btn-blue" data-analytics-event="secondary_cta_click" data-analytics-component="header_phone">Bel direct</a>
            <a href="#aanvraag" className="btn btn-orange" data-analytics-event="primary_cta_click" data-analytics-component="header">Voorstel aanvragen</a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="badge">{page.eyebrow || typeCopy.eyebrow}</div>
            <h1>{page.h1}</h1>
            <p className="lead">{page.lead}</p>

            <div className="hero-cta-row">
              <a href="#aanvraag" className="btn btn-orange" data-analytics-event="primary_cta_click" data-analytics-component="hero">{primaryCta}</a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-light" data-analytics-event="secondary_cta_click" data-analytics-component="hero_whatsapp">{secondaryCta}</a>
            </div>

            <p className="micro-note">{heroNote}</p>
            <p className="mobile-trust-line">Vrijblijvend · Schriftelijke afspraken · Notariële afwikkeling</p>

            {heroBenefits.length > 0 && (
              <div className="trust-micro" aria-label="Voordelen">
                {heroBenefits.map((item) => <div key={item}>✓ {item}</div>)}
              </div>
            )}
          </div>

          <aside className="cta-card" id="aanvraag">
            <h2>Vraag vrijblijvend een voorstel aan</h2>
            <p>
              Vul kort de woning en uw contactgegevens in. Wij bekijken uw aanvraag en geven waar mogelijk een eerste inschatting of verkoopvoorstel.
            </p>
            <div className="form-conversion-grid">
              <div>
                <AdsLeadMiniForm
                  pageTitle={page.breadcrumb}
                  pageSlug={page.slug}
                  defaultSituation={page.defaultSituation || page.breadcrumb}
                  submitLabel={page.formSubmitLabel || primaryCta}
                  successText={page.formSuccessText}
                  privacyNote={page.formPrivacyNote}
                />
                <div className="after-request">
                  <strong>{afterRequestTitle}</strong>
                  <span>{afterRequestText}</span>
                </div>
              </div>

              <div className="form-trust-box" aria-label="Waarom aanvragen">
                <strong>Bij uw aanvraag</strong>
                <ul>
                  {formTrustItems.slice(0, 4).map((item) => <li key={item}>✓ {item}</li>)}
                </ul>
                <ul className="form-contact-list">
                  <li><a href="tel:0612238051" data-analytics-event="secondary_cta_click" data-analytics-component="form_trust_phone">Bel 06 12 23 80 51</a></li>
                  <li><a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-analytics-event="secondary_cta_click" data-analytics-component="form_trust_whatsapp">WhatsApp uw situatie</a></li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <SeoReviewBand />

      <section className="seo-premium-section section-tight" aria-labelledby="seo-premium-title">
        <div className="container seo-premium-wrap">
          <div className="premium-intro">
            <div>
              <p className="eyebrow">Duidelijke verkooproute</p>
              <h2 id="seo-premium-title">Dezelfde duidelijke route, toegespitst op deze situatie.</h2>
            </div>
            <p>
              Specifiek voor {page.breadcrumb.toLowerCase()} ziet u direct wat er mogelijk is, welke onzekerheden kunnen worden beperkt en hoe afspraken zorgvuldig worden vastgelegd.
            </p>
          </div>
          <div className="premium-grid">
            {premiumCards.map((card, index) => (
              <article className="premium-card" key={card.title}>
                <span className="premium-number">{index + 1}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="short-answer card">
            <div>
              <p className="eyebrow">Kort antwoord</p>
              <h2>{page.breadcrumb}</h2>
            </div>
            <p className="text">{page.shortAnswer}</p>
          </div>

          {benefits.length > 0 && (
            <div id="voordelen" className="benefit-grid">
              {benefits.map((item) => (
                <div className="benefit-item" key={item}>✓ {item}</div>
              ))}
            </div>
          )}
        </div>
      </section>

      {(concernCards.length > 0 || solutionCards.length > 0) && (
        <section className="section-tight">
          <div className="container insight-grid">
            {concernCards.length > 0 && (
              <div className="insight-card">
                <p className="eyebrow">Herkenbaar</p>
                <h2>{page.concernTitle || "Welke zorgen spelen vaak?"}</h2>
                <ul className="insight-list">
                  {concernCards.map((item) => <li key={item}>✓ {item}</li>)}
                </ul>
              </div>
            )}
            {solutionCards.length > 0 && (
              <div className="insight-card">
                <p className="eyebrow">Oplossing</p>
                <h2>{page.solutionTitle || "Wat kan Vastgoed Direct Nederland vereenvoudigen?"}</h2>
                <ul className="insight-list">
                  {solutionCards.map((item) => <li key={item}>✓ {item}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <section id="waarom-vdn" className="section-tight">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{typeCopy.eyebrow}</p>
            <h2>{page.valueTitle || typeCopy.valueTitle}</h2>
            <p>{page.valueText || typeCopy.valueText}</p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <strong>Duidelijkheid vóór verplichtingen</strong>
              <p>U vraagt eerst vrijblijvend een voorstel aan. Pas als het voorstel past, worden afspraken verder uitgewerkt.</p>
            </div>
            <div className="why-card">
              <strong>Schriftelijke afspraken</strong>
              <p>Prijs, planning, oplevering en bijzondere voorwaarden worden helder vastgelegd voordat er sprake is van verkoop.</p>
            </div>
            <div className="why-card">
              <strong>Correcte notariële afwikkeling</strong>
              <p>Bij akkoord loopt de juridische levering via de notaris. Zo blijft duidelijk wie waarvoor verantwoordelijk is.</p>
            </div>
          </div>
        </div>
      </section>

      {(ownerTasks.length > 0 || vdnTasks.length > 0) && (
        <section className="section-tight section-white">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Rollen en verwachtingen</p>
              <h2>Wat hoeft u niet zelf te doen en wat blijft belangrijk?</h2>
            </div>
            <div className="two-column-cards">
              {vdnTasks.length > 0 && (
                <div className="task-card">
                  <h3>Wat wij kunnen vereenvoudigen</h3>
                  <ul className="list">
                    {vdnTasks.map((item) => <li key={item}>✓ {item}</li>)}
                  </ul>
                </div>
              )}
              {ownerTasks.length > 0 && (
                <div className="task-card">
                  <h3>Wat u zelf moet weten of regelen</h3>
                  <ul className="list">
                    {ownerTasks.map((item) => <li key={item}>✓ {item}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {example && (
        <section className="section-tight section-white">
          <div className="container">
            <div className="example-card">
              <p className="eyebrow">Geanonimiseerde voorbeeldsituatie</p>
              <h2>{example.situation || example.title || "Praktijkvoorbeeld"}</h2>
              {example.mainProblem && <p>{example.mainProblem}</p>}
              <div className="example-details">
                {example.propertyType && <div className="example-detail"><strong>Type woning</strong><span>{example.propertyType}</span></div>}
                {example.region && <div className="example-detail"><strong>Regio</strong><span>{example.region}</span></div>}
                {example.solution && <div className="example-detail"><strong>Oplossing</strong><span>{example.solution}</span></div>}
                {example.delivery && <div className="example-detail"><strong>Oplevering</strong><span>{example.delivery}</span></div>}
                {example.transfer && <div className="example-detail"><strong>Overdracht</strong><span>{example.transfer}</span></div>}
                {example.nextStep && <div className="example-detail"><strong>Vervolgstap</strong><span>{example.nextStep}</span></div>}
              </div>
            </div>
          </div>
        </section>
      )}

      {contentSections.length > 0 && (
        <section className="section-tight section-white">
          <div className="container content-grid">
            {contentSections.map((section) => (
              <section className="content-block" key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets?.length > 0 && (
                  <ul className="list">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>✓ {bullet}</li>
                    ))}
                  </ul>
                )}
                {!processSteps.length && section.steps?.length > 0 && (
                  <ol className="steps">
                    {section.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
          </div>
        </section>
      )}

      {processSteps.length > 0 && (
        <section className="section-tight">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Proces</p>
              <h2>{processTitle}</h2>
              <p>{processIntro}</p>
            </div>
            <ol className="steps">
              {processSteps.map((step) => {
                const key = typeof step === "string" ? step : `${step.title}-${step.text}`;
                return (
                  <li key={key}>
                    {typeof step === "string" ? step : <span><strong>{step.title}</strong>{step.text ? <small>{step.text}</small> : null}</span>}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}

      {comparisonRows.length > 0 && (
        <section id="vergelijking" className="section-tight">
          <div className="container comparison-wrap">
            <div className="comparison-top">
              <div>
                <p className="eyebrow">Vergelijking</p>
                <h2>Reguliere verkoop of directe verkoop?</h2>
              </div>
              <p>
                Een reguliere verkoop kan soms een hogere opbrengst opleveren. Directe verkoop kan juist aantrekkelijk zijn als rust, snelheid, minder voorbereiding en duidelijke afspraken zwaarder wegen.
              </p>
            </div>

            <div className="comparison-proof-grid">
              {comparisonProofs.map(([title, text]) => (
                <div className="comparison-proof" key={title}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="compare-columns">
              <div className="compare-box">
                <div className="compare-title">Reguliere verkoop via een makelaar</div>
                {comparisonRows.map((row) => (
                  <div className="compare-row" key={`normal-${row[0]}`}>
                    <strong>{row[0]}</strong>
                    <span>{row[1]}</span>
                  </div>
                ))}
              </div>

              <div className="compare-box">
                <div className="compare-title orange">Directe verkoop aan VDN</div>
                {comparisonRows.map((row) => (
                  <div className="compare-row" key={`direct-${row[0]}`}>
                    <strong>{row[0]}</strong>
                    <span>{row[2]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section id="faq" className="section section-white">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Veelgestelde vragen</p>
              <h2>Duidelijkheid voordat u een aanvraag doet.</h2>
            </div>

            <div className="faq">
              {faqs.map((faq) => (
                <div className="faq-item" key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {routePreviewCards.length > 0 && (
        <section className="seo-route-strip" aria-labelledby="seo-route-title">
          <div className="container">
            <div className="seo-route-head">
              <div>
                <p className="eyebrow">Verder oriënteren</p>
                <h2 id="seo-route-title">Vergelijk deze route met verwante verkoopsituaties.</h2>
              </div>
              <p>Bekijk verwante verkoopsituaties die vaak samenhangen met deze vraag. Zo kunt u rustig vergelijken welke route het beste past.</p>
            </div>
            <div className="seo-route-grid">
              {routePreviewCards.map((card, index) => (
                <a href={card.href} key={card.href} className="seo-route-card">
                  <span className="seo-route-tag">{index + 1}</span>
                  <h3>{card.label}</h3>
                  <p>{card.text}</p>
                  <span>Bekijk route →</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedCards.length > 0 && (
        <section className="section-tight">
          <div className="container">
            <div className="related-wrap">
              <div className="section-head">
                <p className="eyebrow">{relatedCopy.eyebrow}</p>
                <h2>{relatedCopy.title}</h2>
                <p>{relatedCopy.text}</p>
              </div>
              <div className="related-card-grid">
                {relatedCards.map((card) => (
                  <a href={card.href} key={card.href} className="related-card">
                    <span className="related-card-content">
                      <strong>{card.label}</strong>
                      <p>{card.text}</p>
                      <span>{relatedCopy.action}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="final-cta">
        <div className="container">
          <h2>{page.ctaTitle}</h2>
          <p>{page.ctaText}</p>
          <div className="cta-buttons">
            <a href="#aanvraag" className="btn btn-orange" data-analytics-event="primary_cta_click" data-analytics-component="final_cta">{primaryCta}</a>
            <a href="tel:0612238051" className="btn btn-light" data-analytics-event="secondary_cta_click" data-analytics-component="final_phone">Bel direct</a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-green" data-analytics-event="secondary_cta_click" data-analytics-component="final_whatsapp">Stuur uw situatie via WhatsApp</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="footer-logo" />
            <p>Vastgoed Direct Nederland helpt woningeigenaren die duidelijkheid willen zonder traditioneel verkooptraject.</p>
            <p>Ook actief via VerkoopJeHuisDirect.nl als ondersteunend domein.</p>
          </div>

          <div>
            <h3>Contact</h3>
            <p>info@vastgoeddirectnederland.nl</p>
            <p>06 12 23 80 51</p>
            <p><a href="tel:0612238051" data-analytics-event="secondary_cta_click" data-analytics-component="footer_phone">Bel direct</a></p>
          </div>

          <div>
            <h3>Populair</h3>
            <p><a href="/huis-direct-verkopen">Huis direct verkopen</a></p>
            <p><a href="/huis-snel-verkopen">Huis snel verkopen</a></p>
            <p><a href="/woning-verkopen-zonder-makelaar">Zonder makelaar verkopen</a></p>
            <p><a href="/opknapwoning-verkopen">Opknapwoning verkopen</a></p>
          </div>

          <div>
            <h3>Kennisbank</h3>
            <p><a href="/huis-verkopen-zonder-leeghalen">Zonder leeghalen</a></p>
            <p><a href="/huis-verkopen-zonder-opknappen">Zonder opknappen</a></p>
            <p><a href="/woning-verkopen-die-nog-vol-staat">Woning staat nog vol</a></p>
            <p><a href="/huis-verkopen-bij-dubbele-lasten">Dubbele lasten</a></p>
          </div>
        </div>
      </footer>

      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-float" data-analytics-event="secondary_cta_click" data-analytics-component="floating_whatsapp">WhatsApp</a>

      <div className="mobile-bottom-cta">
        <a href="#aanvraag" className="btn btn-orange" data-analytics-event="primary_cta_click" data-analytics-component="mobile_sticky">Voorstel aanvragen</a>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-green" data-analytics-event="secondary_cta_click" data-analytics-component="mobile_sticky_whatsapp">WhatsApp</a>
      </div>
    </main>
  );
}
