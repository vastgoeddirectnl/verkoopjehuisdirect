const whatsappBase = "https://wa.me/31612238051";

const internalLinks = [
  ["/huis-snel-verkopen", "Huis snel verkopen"],
  ["/huis-direct-verkopen", "Huis direct verkopen"],
  ["/woning-verkopen-zonder-makelaar", "Woning verkopen zonder makelaar"],
  ["/opknapwoning-verkopen", "Opknapwoning verkopen"],
  ["/leegstaand-huis-verkopen", "Leegstaand huis verkopen"],
  ["/huis-verkopen-zonder-leeghalen", "Huis verkopen zonder leeghalen"],
  ["/huis-verkopen-zonder-opknappen", "Huis verkopen zonder opknappen"],
  ["/woning-verkopen-die-nog-vol-staat", "Woning verkopen die nog vol staat"],
  ["/geerfde-woning-verkopen-zonder-leeghalen", "Geërfde woning verkopen zonder leeghalen"],
  ["/opknapwoning-verkopen-zonder-makelaar", "Opknapwoning verkopen zonder makelaar"],
  ["/leegstaand-huis-verkopen-wat-zijn-de-opties", "Leegstaand huis verkopen: opties"],
  ["/huis-verkopen-bij-dubbele-lasten", "Huis verkopen bij dubbele lasten"],
  ["/huis-verkopen-zonder-bezichtigingen-uitleg", "Huis verkopen zonder bezichtigingen"],
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

const situationMeta = {
  "/huis-snel-verkopen": {
    title: "Snel duidelijkheid",
    text: "Voor situaties waarin u snel wilt weten wat verkoop zonder lang traject kan betekenen.",
    icon: "↗",
  },
  "/huis-direct-verkopen": {
    title: "Direct verkoopvoorstel",
    text: "Eerst vrijblijvend een eerste bod en daarna rustig beoordelen of dit bij u past.",
    icon: "→",
  },
  "/opknapwoning-verkopen": {
    title: "Opknapwoning",
    text: "Ook als de woning onderhoud nodig heeft of niet verkoopklaar is.",
    icon: "⌂",
  },
  "/huis-verkopen-met-achterstallig-onderhoud": {
    title: "Achterstallig onderhoud",
    text: "Laat de mogelijkheden bekijken voordat u nog investeert in herstel of renovatie.",
    icon: "✓",
  },
  "/leegstaand-huis-verkopen": {
    title: "Leegstaande woning",
    text: "Voorkom dat leegstand, risico’s of dubbele lasten onnodig lang doorlopen.",
    icon: "⌁",
  },
  "/huis-verkopen-bij-dubbele-lasten": {
    title: "Dubbele lasten",
    text: "Krijg inzicht in een verkooproute met duidelijke planning en afwikkeling.",
    icon: "€",
  },
  "/huis-verkopen-bij-erfenis": {
    title: "Erfenis of nalatenschap",
    text: "Rustig duidelijkheid krijgen, ook als de woning nog vol spullen staat.",
    icon: "∞",
  },
  "/geerfde-woning-verkopen-zonder-leeghalen": {
    title: "Geërfde woning",
    text: "Bespreek verkoop zonder eerst alles uit te zoeken, leeg te halen of op te knappen.",
    icon: "∞",
  },
  "/huis-verkopen-bij-scheiding": {
    title: "Scheiding",
    text: "Een duidelijke route kan helpen wanneer snel overzicht en afspraken nodig zijn.",
    icon: "•",
  },
  "/verhuurde-woning-verkopen": {
    title: "Verhuurde woning",
    text: "Ook bij verhuur kan een verkoopvoorstel inzicht geven in de mogelijkheden.",
    icon: "↔",
  },
  "/huis-verkopen-zonder-leeghalen": {
    title: "Zonder leeghalen",
    text: "Ook als de woning nog vol meubels, spullen of inboedel staat.",
    icon: "▣",
  },
  "/huis-verkopen-zonder-opknappen": {
    title: "Zonder opknappen",
    text: "Eerst duidelijkheid zonder schilderwerk, renovatie of verkoopklaar maken.",
    icon: "✓",
  },
  "/woning-verkopen-die-nog-vol-staat": {
    title: "Woning staat nog vol",
    text: "Laat de situatie beoordelen zonder vooraf alles leeg te halen.",
    icon: "▦",
  },
  "/woning-verkopen-zonder-makelaar": {
    title: "Zonder makelaar",
    text: "Een alternatief als u geen regulier verkooptraject met open huis wilt.",
    icon: "○",
  },
  "/huis-verkopen-zonder-bezichtigingen": {
    title: "Zonder bezichtigingen",
    text: "Geen reeks kijkers door de woning, maar gericht bekijken wat mogelijk is.",
    icon: "◦",
  },
  "/huis-verkopen-zonder-bezichtigingen-uitleg": {
    title: "Zonder bezichtigingen",
    text: "Een rustige uitleg over verkopen zonder open huis of verkooprondes.",
    icon: "◦",
  },
  "/huis-verkopen-aan-opkoper": {
    title: "Aan opkoper verkopen",
    text: "Vergelijk zorgvuldig wat een directe verkooproute voor uw situatie betekent.",
    icon: "↘",
  },
  "/woning-verkopen-met-schade": {
    title: "Woning met schade",
    text: "Ook bij schade of gebreken kunt u laten bekijken wat verkoop in huidige staat betekent.",
    icon: "!",
  },
  "/huis-verkopen-zonder-verkoopklaar-maken": {
    title: "Niet verkoopklaar",
    text: "Eerst inzicht krijgen zonder styling, herstel of extra voorbereiding.",
    icon: "✓",
  },
  "/huis-verkopen-zonder-funda": {
    title: "Zonder Funda",
    text: "Een verkooproute zonder openbare presentatie of veel kijkers vergelijken.",
    icon: "○",
  },
  "/woning-verkopen-zonder-open-huis": {
    title: "Zonder open huis",
    text: "Minder drukte en meer controle over het verkoopproces.",
    icon: "◦",
  },
};

const regionMeta = {
  "/huis-verkopen-groningen": {
    title: "Groningen",
    text: "Voor woningeigenaren in stad en provincie Groningen die rustig verkoopmogelijkheden willen bekijken.",
    icon: "NL",
  },
  "/woning-verkopen-drenthe": {
    title: "Drenthe",
    text: "Van dorpen tot buitengebied: eerst duidelijkheid over de verkooproute.",
    icon: "NL",
  },
  "/woning-verkopen-friesland": {
    title: "Friesland",
    text: "Ook bij leegstand, onderhoud of woningen die niet verkoopklaar zijn.",
    icon: "NL",
  },
  "/woning-verkopen-overijssel": {
    title: "Overijssel",
    text: "Een rustige verkoopoplossing met duidelijke planning en notariële afwikkeling.",
    icon: "NL",
  },
  "/huis-verkopen-assen": {
    title: "Assen",
    text: "Duidelijkheid voor woningen in Assen en omgeving.",
    icon: "NL",
  },
  "/huis-verkopen-emmen": {
    title: "Emmen",
    text: "Ook bij onderhoud, leegstand of een korte gewenste verkooptermijn.",
    icon: "NL",
  },
  "/huis-verkopen-stadskanaal": {
    title: "Stadskanaal",
    text: "Voor woningeigenaren in de Kanaalstreek die snel overzicht willen.",
    icon: "NL",
  },
  "/huis-verkopen-veendam": {
    title: "Veendam",
    text: "Rustig inzicht in verkoopmogelijkheden zonder direct open huis.",
    icon: "NL",
  },
  "/huis-verkopen-winschoten": {
    title: "Winschoten",
    text: "Een duidelijk voorstel voor woningen in de regio Oldambt.",
    icon: "NL",
  },
  "/huis-verkopen-gieten": {
    title: "Gieten",
    text: "Voor woningen in en rond de Hondsrugregio.",
    icon: "NL",
  },
  "/huis-verkopen-borger": {
    title: "Borger",
    text: "Duidelijkheid over verkoop in huidige staat in Borger en omgeving.",
    icon: "NL",
  },
};

const defaultSituationCards = [
  ["/opknapwoning-verkopen", "Opknapwoning verkopen"],
  ["/leegstaand-huis-verkopen", "Leegstaand huis verkopen"],
  ["/huis-verkopen-zonder-leeghalen", "Huis verkopen zonder leeghalen"],
  ["/huis-verkopen-bij-erfenis", "Huis verkopen bij erfenis"],
  ["/huis-verkopen-bij-dubbele-lasten", "Huis verkopen bij dubbele lasten"],
  ["/woning-verkopen-zonder-makelaar", "Woning verkopen zonder makelaar"],
];

const defaultRegionCards = [
  ["/huis-verkopen-groningen", "Huis verkopen in Groningen"],
  ["/woning-verkopen-drenthe", "Woning verkopen in Drenthe"],
  ["/woning-verkopen-friesland", "Woning verkopen in Friesland"],
  ["/woning-verkopen-overijssel", "Woning verkopen in Overijssel"],
];

function uniqueLinks(links) {
  const seen = new Set();
  return links.filter(([href]) => {
    if (seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}

function relatedLinksFor(page) {
  if (Array.isArray(page.relatedLinks) && page.relatedLinks.length) {
    return uniqueLinks(page.relatedLinks.filter(([href]) => href !== page.slug)).slice(0, 12);
  }

  return uniqueLinks(internalLinks.filter(([href]) => href !== page.slug)).slice(0, 12);
}

function cardForLink([href, label], metaMap) {
  const meta = metaMap[href] || {};
  return {
    href,
    label,
    title: meta.title || label,
    text: meta.text || "Bekijk de mogelijkheden voor deze situatie.",
    icon: meta.icon || "✓",
  };
}

function selectCards(page, relatedLinks, metaMap, fallbackLinks, max = 6) {
  const source = uniqueLinks([...relatedLinks, ...fallbackLinks]).filter(([href]) => href !== page.slug && metaMap[href]);
  return source.slice(0, max).map((link) => cardForLink(link, metaMap));
}

export default function SeoLandingPage({ page }) {
  const faqs = Array.isArray(page.faqs) ? page.faqs : [];
  const sections = Array.isArray(page.sections) ? page.sections : [];
  const benefits = Array.isArray(page.benefits) ? page.benefits : [];
  const comparisonRows = Array.isArray(page.comparisonRows) ? page.comparisonRows : [];
  const relatedLinks = relatedLinksFor(page);
  const situationCards = selectCards(page, relatedLinks, situationMeta, defaultSituationCards, 6);
  const regionCards = selectCards(page, relatedLinks, regionMeta, defaultRegionCards, 4);
  const extraLinks = relatedLinks.filter(([href]) => !situationMeta[href] && !regionMeta[href]).slice(0, 6);
  const example = page.exampleSituation;
  const showFaqSchema = faqs.length > 0;

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
    `Hallo, ik wil graag meer informatie over: ${page.breadcrumb}. Kunt u contact met mij opnemen?`
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
          --orange-dark:#B85216;
          --cream:#f5f2ec;
          --card:#fffdf9;
          --line:#e8e3db;
          --muted:#5f7083;
          --soft:#FFF1E6;
          font-family:Arial,Helvetica,sans-serif;
          color:var(--navy);
          background:linear-gradient(180deg,#fffdf9 0%,#f5f2ec 100%);
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
        .btn-orange{background:var(--orange);color:#fff;box-shadow:0 12px 28px rgba(217,106,28,.18)}
        .btn-orange:hover{background:var(--orange-dark)}
        .btn-blue{background:var(--navy);color:#fff}
        .btn-light{background:#fff;color:var(--navy);border:1px solid #e3ded6}
        .btn-soft{background:var(--soft);color:var(--orange-dark);border:1px solid #F2B885}
        .btn-green{background:#3E8F5E;color:#fff;box-shadow:0 12px 28px rgba(62,143,94,.16)}
        .hero{position:relative;overflow:hidden;background:radial-gradient(circle at 84% 6%,rgba(217,106,28,.10),transparent 30%),linear-gradient(180deg,#fffdf9 0%,#f6f2eb 100%)}
        .hero-grid{display:grid;grid-template-columns:minmax(0,1.04fr) minmax(350px,.74fr);gap:42px;align-items:center;padding:54px 0 42px}
        .badge{display:inline-flex;color:#B85216;background:var(--soft);border:1px solid #F2B885;border-radius:999px;padding:9px 14px;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;margin-bottom:17px}
        h1{font-size:clamp(40px,4.4vw,62px);line-height:.98;letter-spacing:-2.2px;margin:0;color:var(--navy);max-width:760px}
        .lead{font-size:19px;line-height:1.62;color:#526274;max-width:720px;margin:20px 0 0}
        .hero-cta-row{display:flex;gap:11px;flex-wrap:wrap;align-items:center;margin:25px 0 0}
        .micro-note{font-size:13px;color:#647386;margin:13px 0 0;font-weight:850}
        .mobile-trust-line{display:none}
        .trust-micro{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:23px 0 0;max-width:760px}
        .trust-micro div{background:#fff;border:1px solid var(--line);border-radius:16px;padding:13px 14px;font-size:14px;font-weight:900;color:var(--navy);box-shadow:0 10px 22px rgba(7,31,58,.055)}
        .cta-card{background:#fff;border:1px solid var(--line);border-radius:30px;padding:24px;box-shadow:0 24px 72px rgba(7,31,58,.12)}
        .cta-logo{width:205px;max-width:100%;display:block;margin:0 auto 16px;padding-bottom:15px;border-bottom:1px solid #eee9e2}
        .cta-card h2{font-size:28px;line-height:1.08;letter-spacing:-.9px;margin:0 0 10px;color:var(--navy)}
        .cta-card p{color:#617184;line-height:1.55;margin:0 0 14px}
        .mini-checks{display:grid;gap:8px;margin:16px 0}
        .mini-checks div{display:flex;gap:8px;background:#f8f5ef;border:1px solid #eee8df;border-radius:14px;padding:10px 12px;color:#24364a;font-size:13px;font-weight:850;line-height:1.35}
        .mini-checks span{color:var(--orange);font-weight:900}
        .review-mini{margin-top:14px;background:#071f3a;color:#fff;border-radius:20px;padding:16px;text-decoration:none;display:block;transition:.18s ease}
        .review-mini:hover{transform:translateY(-1px);background:#102f52}
        .review-mini strong{display:block;font-size:17px;margin-bottom:4px}
        .stars{color:#f5a400;letter-spacing:1.5px;font-weight:900}
        .review-mini p{color:#d7e3ef;font-size:13px;line-height:1.45;margin:8px 0 0}
        .page-nav-wrap{background:#fff;border-bottom:1px solid var(--line)}
        .page-nav{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;padding:12px 0}
        .page-nav a{display:inline-flex;border:1px solid var(--line);background:#fff;border-radius:999px;padding:9px 13px;font-size:13px;font-weight:900;color:#24364a;text-decoration:none}
        .page-nav a:hover{border-color:#F2B885;color:var(--orange-dark);background:#fffaf5}
        .section{padding:58px 0}
        .section-white{background:#fff}
        .section-tight{padding:48px 0}
        .section-head{max-width:790px;margin:0 auto 30px;text-align:center}
        .section-head.left{text-align:left;margin-left:0;margin-right:0;max-width:820px}
        .eyebrow{color:var(--orange);font-weight:900;text-transform:uppercase;letter-spacing:.08em;margin:0 0 9px;font-size:12px}
        h2{font-size:clamp(31px,3.4vw,46px);line-height:1.06;letter-spacing:-1.4px;margin:0;color:var(--navy)}
        h3{font-size:22px;line-height:1.18;letter-spacing:-.35px;margin:0 0 9px;color:var(--navy)}
        .section-head p,.text{color:#647386;font-size:16px;line-height:1.62;margin-bottom:0}
        .short-answer h2{font-size:clamp(26px,2.4vw,38px);line-height:1.1;letter-spacing:-.9px}
        .section-head h2{font-size:clamp(28px,2.8vw,40px);line-height:1.1;letter-spacing:-1px}
        .card{background:#fff;border:1px solid var(--line);border-radius:26px;padding:26px;box-shadow:0 16px 44px rgba(7,31,58,.06)}
        .short-answer{display:grid;grid-template-columns:.76fr 1.24fr;gap:24px;align-items:center}
        .benefit-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-top:22px}
        .benefit-item{background:#fff;border:1px solid var(--line);border-radius:18px;padding:13px 15px;font-size:15px;font-weight:900;color:#24364a;box-shadow:0 12px 30px rgba(7,31,58,.045)}
        .overview-flow{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:24px}
        .overview-card{background:#fff;border:1px solid var(--line);border-radius:24px;padding:22px;box-shadow:0 14px 34px rgba(7,31,58,.055)}
        .overview-card span{display:inline-flex;width:34px;height:34px;align-items:center;justify-content:center;border-radius:13px;background:var(--soft);color:var(--orange-dark);font-weight:900;margin-bottom:12px}
        .overview-card strong{display:block;font-size:18px;margin-bottom:8px;color:var(--navy)}
        .overview-card p{margin:0;color:#647386;font-size:14.5px;line-height:1.55}
        .why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:26px}
        .why-card{background:#fff;border:1px solid var(--line);border-radius:26px;padding:24px;box-shadow:0 16px 44px rgba(7,31,58,.06)}
        .why-card strong{display:block;font-size:18px;line-height:1.2;color:var(--navy);margin-bottom:9px}
        .why-card p{margin:0;color:#647386;line-height:1.55;font-size:15px}
        .content-grid{display:grid;gap:18px}
        .content-block{background:#fff;border:1px solid var(--line);border-radius:26px;padding:26px;box-shadow:0 14px 38px rgba(7,31,58,.05)}
        .content-block h2{font-size:clamp(24px,2vw,32px);line-height:1.14;letter-spacing:-.7px;margin:0 0 12px}
        .content-block p{color:#647386;font-size:16px;line-height:1.62;margin:0 0 12px}
        .content-block p:last-child{margin-bottom:0}
        .example-card{background:linear-gradient(135deg,#F7F2EC 0%,#ffffff 100%);border:1px solid #F2B885;border-radius:28px;padding:28px;box-shadow:0 16px 44px rgba(217,106,28,.07)}
        .example-card h2{font-size:clamp(24px,2.1vw,33px);line-height:1.12;letter-spacing:-.75px;margin-bottom:10px}
        .example-card p{color:#5f7083;font-size:16px;line-height:1.62;margin:0}
        .list{display:grid;gap:10px;margin:12px 0 0;padding:0;list-style:none}
        .list li{background:#f8f5ef;border:1px solid #eee8df;border-radius:15px;padding:10px 13px;color:#24364a;font-size:15px;font-weight:850;line-height:1.35}
        .steps{counter-reset:step;display:grid;gap:10px;margin:14px 0 0;padding:0;list-style:none}
        .steps li{display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:center;background:#f8f5ef;border:1px solid #eee8df;border-radius:16px;padding:10px 12px;color:#24364a;font-size:15px;font-weight:850}
        .steps li:before{counter-increment:step;content:counter(step);width:38px;height:38px;border-radius:14px;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900}
        .comparison-wrap{background:linear-gradient(135deg,var(--navy) 0%,var(--navy2) 100%);border-radius:32px;padding:32px;color:#fff;box-shadow:0 22px 66px rgba(7,31,58,.16)}
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
        .link-section{background:#fff}
        .link-split{display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start}
        .link-panel{background:#fff;border:1px solid var(--line);border-radius:28px;padding:24px;box-shadow:0 14px 38px rgba(7,31,58,.05)}
        .link-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:16px}
        .link-panel-head h2{font-size:26px;line-height:1.12;letter-spacing:-.6px}
        .link-panel-head p{margin:7px 0 0;color:#647386;font-size:14.5px;line-height:1.5}
        .visual-link-grid{display:grid;gap:10px}
        .visual-link-card{display:grid;grid-template-columns:42px 1fr;gap:12px;align-items:start;text-decoration:none;color:inherit;background:#fffdf9;border:1px solid #eee8df;border-radius:18px;padding:13px;transition:.18s ease}
        .visual-link-card:hover{border-color:#F2B885;transform:translateY(-1px);background:#fffaf5}
        .visual-link-card .icon{width:42px;height:42px;border-radius:15px;background:var(--soft);display:flex;align-items:center;justify-content:center;color:var(--orange-dark);font-size:13px;font-weight:900}
        .visual-link-card strong{display:block;color:var(--navy);font-size:15.5px;line-height:1.2;margin:1px 0 5px}
        .visual-link-card p{margin:0;color:#647386;font-size:13.5px;line-height:1.42}
        .link-footer{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
        .text-links{margin-top:18px;border-top:1px solid var(--line);padding-top:14px;display:flex;gap:8px;flex-wrap:wrap}
        .text-links a{display:inline-flex;background:#f8f5ef;border:1px solid #eee8df;border-radius:999px;padding:8px 11px;font-size:13px;font-weight:900;color:#24364a;text-decoration:none}
        .text-links a:hover{border-color:#F2B885;color:var(--orange-dark)}
        .final-cta{background:linear-gradient(135deg,var(--navy) 0%,var(--navy2) 100%);color:#fff;padding:54px 0;text-align:center}
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
        .whatsapp-float{position:fixed;right:18px;bottom:18px;z-index:80;background:#3E8F5E;color:#fff;border-radius:999px;padding:13px 17px;font-weight:900;box-shadow:0 14px 32px rgba(62,143,94,.22);font-size:14px;text-decoration:none}

        @media(min-width:761px){
          .section{padding:46px 0}
          .section-tight{padding:36px 0}
          .section-head{max-width:720px;margin:0 auto 24px}
          .section-head.left{margin-left:0;margin-right:0}
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
        }
        @media(max-width:1040px){
          .header-inner{grid-template-columns:auto auto}
          .nav{grid-column:1/-1;justify-content:flex-start;overflow-x:auto;gap:18px;padding:0 0 12px;scrollbar-width:none}
          .nav::-webkit-scrollbar{display:none}
          .hero-grid,.comparison-top,.short-answer,.link-split{grid-template-columns:1fr}
          .trust-micro,.benefit-grid,.overview-flow{grid-template-columns:repeat(2,1fr)}
          .why-grid{grid-template-columns:1fr}
          .cta-card{max-width:620px;margin:0 auto}
          .footer-grid{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:760px){
          .container{width:min(100% - 28px,1120px)}
          .top-strip{display:none}
          .header{position:relative}
          .header-inner{display:flex;align-items:center;min-height:auto;padding:12px 0;gap:10px}
          .logo{width:178px}
          .nav{display:none}
          .header-actions{margin-left:auto}
          .header-actions .btn-green,.header-actions .btn-blue{display:none}
          .header-actions .btn-orange{padding:11px 13px;font-size:13px}
          .hero-grid{padding:30px 0 30px;gap:22px}
          .badge{display:none}
          h1{font-size:clamp(35px,10vw,45px);line-height:1.04;letter-spacing:-1.1px}
          .lead{font-size:17px;line-height:1.52;margin-top:15px}
          .hero-cta-row{margin-top:20px}
          .hero-cta-row .btn,.cta-buttons .btn{width:100%}
          .hero-cta-row .btn-light{display:none}
          .micro-note{display:none}
          .mobile-trust-line{display:block;font-size:13px;color:#647386;font-weight:900;margin-top:12px;line-height:1.45}
          .trust-micro{display:none}
          .page-nav{justify-content:flex-start;overflow-x:auto;flex-wrap:nowrap;scrollbar-width:none;padding:10px 0}
          .page-nav::-webkit-scrollbar{display:none}
          .page-nav a{white-space:nowrap}
          .benefit-grid,.compare-columns,.overview-flow{grid-template-columns:1fr}
          .section{padding:42px 0}.section-tight{padding:38px 0}
          .section-head{text-align:left;margin-bottom:20px}
          .card,.content-block,.cta-card,.comparison-wrap,.why-card,.example-card,.link-panel{border-radius:22px;padding:20px}
          .content-block h2,.example-card h2{font-size:24px;line-height:1.15;letter-spacing:-.5px}
          .section-head h2,.short-answer h2{font-size:28px;line-height:1.12;letter-spacing:-.65px}
          .content-block p,.example-card p,.section-head p,.text{font-size:15px;line-height:1.58}
          .cta-logo{display:none}
          .cta-card h2{font-size:24px}
          .review-mini{display:none}
          .compare-row{grid-template-columns:1fr;gap:5px}
          .faq-item{display:block}
          .faq-item h3{margin-bottom:7px}
          .link-panel-head{display:block}
          .footer-grid{grid-template-columns:1fr}
          .whatsapp-float{display:none}
          .footer{padding-bottom:42px}
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
            <a href="/#aanvraag">Aanvraag</a>
            <a href="#mogelijkheden">Mogelijkheden</a>
            <a href="#waarom-anders">Waarom anders</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="header-actions">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-green">WhatsApp</a>
            <a href="tel:0612238051" className="btn btn-blue">Bel direct</a>
            <a href="/#aanvraag" className="btn btn-orange">Aanvraag starten</a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="badge">Ook als de woning niet verkoopklaar is</div>
            <h1>{page.h1}</h1>
            <p className="lead">{page.lead}</p>

            <div className="hero-cta-row">
              <a href="/#aanvraag" className="btn btn-orange">Vrijblijvend laten meekijken</a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-light">Eerst even overleggen</a>
            </div>

            <p className="micro-note">De woning hoeft niet eerst opgeknapt of leeggehaald te worden. U zit nergens aan vast.</p>
            <p className="mobile-trust-line">Niet opknappen · Niet leeghalen · Vrijblijvend</p>

            <div className="trust-micro" aria-label="Voordelen">
              <div>✓ Niet eerst opknappen</div>
              <div>✓ Niet leeghalen</div>
              <div>✓ Geen open huis</div>
              <div>✓ Vrijblijvend</div>
            </div>
          </div>

          <aside className="cta-card">
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="cta-logo" />
            <h2>Rustig weten wat mogelijk is</h2>
            <p>
              Postcode, type woning en uw situatie zijn genoeg voor het eerste contact. Ook als de woning nog vol staat, onderhoud nodig heeft of niet verkoopklaar is.
            </p>
            <div className="mini-checks">
              <div><span>✓</span> Geen open huis of reeks bezichtigingen</div>
              <div><span>✓</span> Niet eerst opknappen of leeghalen</div>
              <div><span>✓</span> U beslist zelf of u verder wilt</div>
            </div>
            <a href="/#aanvraag" className="btn btn-orange" style={{ width: "100%" }}>Bekijk mijn mogelijkheden</a>

            <a className="review-mini" href="https://www.google.com/search?q=Vastgoed+Direct+Nederland+reviews" target="_blank" rel="noopener noreferrer">
              <strong>5,0 op Google · 2 reviews</strong>
              <div className="stars">★★★★★</div>
              <p>Verkopers waarderen vooral de duidelijke communicatie en het persoonlijke contact.</p>
            </a>
          </aside>
        </div>
      </section>

      <div className="page-nav-wrap">
        <nav className="container page-nav" aria-label="Paginanavigatie">
          <a href="#kort">Kort antwoord</a>
          <a href="#mogelijkheden">Verkooproutes</a>
          <a href="#waarom-anders">Waarom anders</a>
          {comparisonRows.length > 0 && <a href="#vergelijking">Vergelijking</a>}
          {faqs.length > 0 && <a href="#faq">Vragen</a>}
        </nav>
      </div>

      <section id="kort" className="section section-white">
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

      <section id="mogelijkheden" className="section-tight">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Verkooproutes</p>
            <h2>U hoeft niet direct te kiezen. Eerst overzicht.</h2>
            <p>
              Iedere woning en situatie is anders. Daarom is het verstandig om de belangrijkste routes kort naast elkaar te zetten voordat u beslist wat past.
            </p>
          </div>
          <div className="overview-flow">
            <div className="overview-card">
              <span>1</span>
              <strong>Regulier verkopen</strong>
              <p>Geschikt als de woning verkoopklaar is en u tijd heeft voor presentatie, bezichtigingen en biedingen.</p>
            </div>
            <div className="overview-card">
              <span>2</span>
              <strong>Zelf voorbereiden</strong>
              <p>U kunt eerst opknappen, leeghalen of verkoopklaar maken. Dat vraagt wel tijd, kosten en organisatie.</p>
            </div>
            <div className="overview-card">
              <span>3</span>
              <strong>Vrijblijvend voorstel</strong>
              <p>U laat rustig bekijken wat verkoop in de huidige situatie kan betekenen, zonder open huis of verplichting.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="waarom-anders" className="section-tight section-white">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Waarom anders</p>
            <h2>Geen standaard verkooptraject. Eerst rustig duidelijkheid.</h2>
            <p>
              Veel verkopers willen vooral weten waar ze aan toe zijn. Daarom maken we het laagdrempelig: u hoeft de woning niet eerst op te knappen, leeg te halen of verkoopklaar te maken om een voorstel aan te vragen.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <strong>Niet eerst opknappen of leeghalen</strong>
              <p>Ook als de woning nog vol spullen staat, onderhoud nodig heeft of niet verkoopklaar is, kijken wij met u mee.</p>
            </div>
            <div className="why-card">
              <strong>Geen open huis of verkoopdruk</strong>
              <p>U vraagt rustig informatie aan. Daarna beslist u zelf of het eerste bod en het vervolg bij uw situatie passen.</p>
            </div>
            <div className="why-card">
              <strong>Voorstel dat u kunt beoordelen</strong>
              <p>U krijgt eerst een eerste vrijblijvend bod. Als beoordeling nodig is, volgt daarna een definitief voorstel met het bod, de planning en duidelijke uitleg over het vervolg.</p>
            </div>
          </div>
        </div>
      </section>

      {example && (
        <section className="section-tight section-white">
          <div className="container">
            <div className="example-card">
              <p className="eyebrow">Voorbeeldsituatie</p>
              <h2>{example.title}</h2>
              <p>{example.text}</p>
            </div>
          </div>
        </section>
      )}

      <section className="section-tight section-white">
        <div className="container content-grid">
          {sections.map((section) => (
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
              {section.steps?.length > 0 && (
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

      {comparisonRows.length > 0 && (
        <section id="vergelijking" className="section-tight">
          <div className="container comparison-wrap">
            <div className="comparison-top">
              <div>
                <p className="eyebrow">Vergelijking</p>
                <h2>Niet alleen de prijs telt. Ook rust, tijd en duidelijkheid.</h2>
              </div>
              <p>
                Bij verkoop gaat het niet alleen om het hoogste bod. Ook kosten, bezichtigingen,
                oplevering, spullen in de woning, koopovereenkomst en overdrachtsdatum zijn belangrijk.
              </p>
            </div>

            <div className="compare-columns">
              <div className="compare-box">
                <div className="compare-title">Traditionele verkoop</div>
                {comparisonRows.map((row) => (
                  <div className="compare-row" key={`normal-${row[0]}`}>
                    <strong>{row[0]}</strong>
                    <span>{row[1]}</span>
                  </div>
                ))}
              </div>

              <div className="compare-box">
                <div className="compare-title orange">Vastgoed Direct Nederland</div>
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

      {(situationCards.length > 0 || regionCards.length > 0) && (
        <section className="section-tight link-section">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Verder oriënteren</p>
              <h2>Bekijk rustig wat past bij uw situatie of regio.</h2>
              <p>
                Geen lange linklijst, maar een paar logische ingangen. De volledige overzichten staan apart gegroepeerd.
              </p>
            </div>

            <div className="link-split">
              {situationCards.length > 0 && (
                <div className="link-panel">
                  <div className="link-panel-head">
                    <div>
                      <h2>Situaties</h2>
                      <p>Veelvoorkomende verkoopvragen bij onderhoud, leegstand, erfenis of dubbele lasten.</p>
                    </div>
                  </div>
                  <div className="visual-link-grid">
                    {situationCards.map((card) => (
                      <a href={card.href} className="visual-link-card" key={card.href}>
                        <span className="icon">{card.icon}</span>
                        <span>
                          <strong>{card.title}</strong>
                          <p>{card.text}</p>
                        </span>
                      </a>
                    ))}
                  </div>
                  <div className="link-footer">
                    <a href="/situaties" className="btn btn-soft">Bekijk alle situaties</a>
                  </div>
                </div>
              )}

              {regionCards.length > 0 && (
                <div className="link-panel">
                  <div className="link-panel-head">
                    <div>
                      <h2>Regio’s</h2>
                      <p>Actief in Noord- en Oost-Nederland, met nadruk op duidelijke communicatie en rustige afwikkeling.</p>
                    </div>
                  </div>
                  <div className="visual-link-grid">
                    {regionCards.map((card) => (
                      <a href={card.href} className="visual-link-card" key={card.href}>
                        <span className="icon">{card.icon}</span>
                        <span>
                          <strong>{card.title}</strong>
                          <p>{card.text}</p>
                        </span>
                      </a>
                    ))}
                  </div>
                  <div className="link-footer">
                    <a href="/regios" className="btn btn-soft">Bekijk alle regio’s</a>
                  </div>
                </div>
              )}
            </div>

            {extraLinks.length > 0 && (
              <div className="text-links" aria-label="Aanvullende pagina's">
                {extraLinks.map(([href, label]) => (
                  <a href={href} key={href}>{label}</a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="final-cta">
        <div className="container">
          <h2>{page.ctaTitle}</h2>
          <p>{page.ctaText}</p>
          <div className="cta-buttons">
            <a href="/#aanvraag" className="btn btn-orange">Vrijblijvend laten meekijken</a>
            <a href="tel:0612238051" className="btn btn-light">Bel direct</a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-green">WhatsApp</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="footer-logo" />
            <p>Verkoopjehuisdirect.nl is de website van Vastgoed Direct Nederland.</p>
            <p>Voor woningeigenaren die duidelijkheid willen zonder gedoe.</p>
          </div>

          <div>
            <h3>Contact</h3>
            <p>info@vastgoeddirectnederland.nl</p>
            <p>06 12 23 80 51</p>
            <p><a href="tel:0612238051">Bel direct</a></p>
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
            <p><a href="/situaties">Alle situaties</a></p>
            <p><a href="/regios">Alle regio’s</a></p>
            <p><a href="/huis-verkopen-zonder-leeghalen">Zonder leeghalen</a></p>
            <p><a href="/huis-verkopen-zonder-opknappen">Zonder opknappen</a></p>
          </div>
        </div>
      </footer>

      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-float">WhatsApp</a>
    </main>
  );
}
