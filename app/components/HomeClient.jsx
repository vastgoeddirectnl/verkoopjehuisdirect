"use client";

import React, { useState } from "react";
import { trackGoogleAdsConversion } from "../lib/googleAds";

const whatsappLink =
  "https://wa.me/31612238051?text=Hallo%2C%20ik%20wil%20graag%20mijn%20woning%20direct%20verkopen.%20Kunt%20u%20contact%20met%20mij%20opnemen%3F";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Vastgoed Direct Nederland",
  url: "https://www.verkoopjehuisdirect.nl",
  logo: "https://www.verkoopjehuisdirect.nl/logo.png",
  image: "https://www.verkoopjehuisdirect.nl/logo.png",
  telephone: "+31612238051",
  email: "info@verkoopjehuisdirect.nl",
  description:
    "Vastgoed Direct Nederland helpt woningeigenaren die hun woning zonder gedoe willen verkopen. Ook als de woning onderhoud nodig heeft, nog vol spullen staat of niet verkoopklaar is.",
  areaServed: ["Groningen", "Drenthe", "Friesland", "Overijssel", "Nederland"],
  priceRange: "Vrijblijvend verkoopvoorstel",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+31612238051",
    contactType: "customer service",
    areaServed: "NL",
    availableLanguage: ["Dutch"],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Kan ik mijn woning verkopen zonder makelaar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, u kunt rechtstreeks een vrijblijvend verkoopvoorstel aanvragen zonder traditioneel verkooptraject met een makelaar.",
      },
    },
    {
      "@type": "Question",
      name: "Moet mijn woning verkoopklaar zijn?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nee, de woning hoeft niet verkoopklaar te zijn. Ook woningen met onderhoud, schade of een woning die nog vol spullen staat kunnen worden aangemeld.",
      },
    },
    {
      "@type": "Question",
      name: "Betaal ik makelaarskosten?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nee, u betaalt geen makelaarskosten voor een aanvraag via Vastgoed Direct Nederland.",
      },
    },
    {
      "@type": "Question",
      name: "Kan ik verkopen zonder bezichtigingen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In veel situaties is dat mogelijk. Wij bespreken de verkoopmogelijkheden zonder traditioneel bezichtigingstraject of open huis.",
      },
    },
  ],
};

const situations = [
  ["Niet eerst opknappen", "Ook als de woning onderhoud nodig heeft of niet verkoopklaar is."],
  ["Niet eerst leeghalen", "Staat de woning nog vol spullen? Dan kunt u toch vrijblijvend informeren."],
  ["Geen bezichtigingen", "Prettig bij privacy, verhuur of als u geen onbekenden over de vloer wilt."],
  ["Erfenis, scheiding of leegstand", "Rust en overzicht zonder onnodige stappen vooraf."],
];

const processSteps = [
  ["01", "Aanvraag", "U vult kort uw adres en situatie in."],
  ["02", "Contact", "Wij nemen persoonlijk contact met u op."],
  ["03", "Voorstel", "U hoort wat er mogelijk is."],
  ["04", "Notaris", "Bij akkoord wordt alles netjes vastgelegd."],
];

const comparisonRows = [
  ["Woning verkoopklaar maken", "Vaak gewenst", "Niet eerst nodig"],
  ["Woning leeghalen", "Vaak zelf regelen", "Niet eerst nodig"],
  ["Bezichtigingen / open huis", "Meerdere momenten", "Geen open huis nodig"],
  ["Makelaarskosten", "Gebruikelijk", "Geen makelaarskosten"],
  ["Privacy", "Meerdere partijen", "Discreter contact"],
];

const whyDifferent = [
  [
    "Niet eerst opknappen of leeghalen",
    "De woning hoeft niet verkoopklaar te zijn. Ook als er onderhoud nodig is of de woning nog vol spullen staat, kunt u vrijblijvend informeren.",
  ],
  [
    "Eerst gewoon duidelijkheid",
    "U hoort rustig wat er mogelijk is. Daarna beslist u zelf of u verder wilt. Zonder druk en zonder verplichting.",
  ],
  [
    "Persoonlijk contact",
    "Geen standaardreactie of callcenter. We kijken naar uw woning, de situatie en wat voor u praktisch haalbaar is.",
  ],
];

const woningTypes = [
  "Tussenwoning",
  "Hoekwoning",
  "Twee-onder-een-kapwoning",
  "Vrijstaande woning",
  "Appartement",
  "Benedenwoning",
  "Bovenwoning",
  "Maisonette",
  "Woonboerderij",
  "Bungalow",
  "Recreatiewoning",
  "Chalet",
  "Anders / weet ik niet zeker",
];

const verkoopSituaties = [
  "Geen bijzonderheden",
  "Achterstallig onderhoud",
  "Leegstand",
  "Verhuurde woning",
  "Erfenis / nalatenschap",
  "Scheiding",
  "Dubbele lasten",
  "Financiële druk",
  "Geen zin in bezichtigingen",
  "Behoefte aan privacy",
  "Woning staat nog vol spullen",
  "Woning is niet verkoopklaar",
  "Woning moet nog leeggehaald worden",
  "Snel duidelijkheid gewenst",
  "Anders",
];

const termijnen = [
  "Zo snel mogelijk",
  "Binnen 1 maand",
  "Binnen 3 maanden",
  "Binnen 6 maanden",
  "Later dit jaar",
  "Ik oriënteer mij alleen",
  "Anders",
];

const popularLinks = [
  ["/huis-direct-verkopen", "Huis direct verkopen"],
  ["/huis-snel-verkopen", "Huis snel verkopen"],
  ["/woning-verkopen-zonder-makelaar", "Zonder makelaar verkopen"],
  ["/huis-verkopen-zonder-bezichtigingen", "Zonder bezichtigingen"],
  ["/huis-verkopen-zonder-funda", "Zonder Funda verkopen"],
  ["/huis-verkopen-zonder-verkoopklaar-maken", "Zonder verkoopklaar maken"],
  ["/woning-verkopen-met-schade", "Woning met schade verkopen"],
  ["/huis-verkopen-met-spoed", "Huis verkopen met spoed"],
  ["/huis-verkopen-na-overlijden", "Huis verkopen na overlijden"],
  ["/leegstaand-huis-verkopen", "Leegstaand huis verkopen"],
  ["/opknapwoning-verkopen", "Opknapwoning verkopen"],
  ["/huis-verkopen-met-achterstallig-onderhoud", "Achterstallig onderhoud"],
  ["/huis-verkopen-bij-erfenis", "Huis verkopen bij erfenis"],
  ["/huis-verkopen-bij-scheiding", "Huis verkopen bij scheiding"],
  ["/verhuurde-woning-verkopen", "Verhuurde woning verkopen"],
  ["/huis-verkopen-groningen", "Huis verkopen in Groningen"],
  ["/woning-verkopen-drenthe", "Woning verkopen in Drenthe"],
  ["/woning-verkopen-friesland", "Woning verkopen in Friesland"],
  ["/woning-verkopen-overijssel", "Woning verkopen in Overijssel"],
  ["/huis-verkopen-stadskanaal", "Huis verkopen in Stadskanaal"],
  ["/huis-verkopen-veendam", "Huis verkopen in Veendam"],
  ["/huis-verkopen-winschoten", "Huis verkopen in Winschoten"],
  ["/huis-verkopen-assen", "Huis verkopen in Assen"],
  ["/huis-verkopen-emmen", "Huis verkopen in Emmen"],
  ["/huis-verkopen-borger", "Huis verkopen in Borger"],
  ["/huis-verkopen-gieten", "Huis verkopen in Gieten"],
];

export default function HomeClient() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    postcode: "",
    huisnummer: "",
    woningtype: "",
    situatie: "",
    termijn: "",
    toelichting: "",
    naam: "",
    email: "",
    telefoon: "",
  });
  const [showMobileSticky, setShowMobileSticky] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setShowMobileSticky(window.scrollY > 720);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateForm = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const nextStep = () => {
    if (step === 1 && (!form.postcode || !form.huisnummer || !form.woningtype)) {
      alert("Vul postcode, huisnummer en type woning in om door te gaan.");
      return;
    }
    if (step === 2 && !form.situatie) {
      alert("Kies kort welke situatie het beste past. De gewenste termijn en toelichting zijn optioneel.");
      return;
    }
    setStep((current) => Math.min(current + 1, 3));
  };
  const previousStep = () => setStep((current) => Math.max(current - 1, 1));

  const submitLead = async (event) => {
    event.preventDefault();

    const params = new URLSearchParams(window.location.search);

    const lead = {
      naam: form.naam,
      email: form.email,
      telefoon: form.telefoon,
      postcode: form.postcode,
      huisnummer: form.huisnummer,
      woningtype: form.woningtype,
      staat: form.situatie,
      reden: [
        form.termijn ? `Termijn: ${form.termijn}` : "",
        form.toelichting ? `Toelichting: ${form.toelichting}` : "",
      ].filter(Boolean).join(" | "),
      situatie: form.situatie,
      termijn: form.termijn,
      toelichting: form.toelichting,
      pagina: window.location.pathname,
      bron: params.get("utm_source") || params.get("source") || document.referrer || "direct",
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Aanvraag verzenden mislukt.");
      }

      trackGoogleAdsConversion("lead");
      setSubmitted(true);
    } catch (error) {
      alert("Er ging iets mis. Probeer opnieuw of neem contact op via WhatsApp.");
      console.error(error);
    }
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <style jsx global>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          color: #071f3a;
          background: #f5f2ec;
        }
        a { color: inherit; text-decoration: none; }
        button, input, select { font: inherit; }
        .container { width: min(1180px, calc(100% - 44px)); margin: 0 auto; }

        .top-strip {
          background: #071f3a;
          color: #fff;
          font-size: 13px;
          font-weight: 900;
        }
        .top-strip-inner {
          min-height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          text-align: center;
        }
        .top-strip-inner span { white-space: nowrap; }

        .header {
          position: sticky;
          top: 0;
          z-index: 80;
          background: rgba(255, 255, 255, .95);
          border-bottom: 1px solid #e8e3db;
          backdrop-filter: blur(14px);
        }
        .header-inner {
          min-height: 76px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 22px;
        }
        .logo {
          display: block;
          width: 230px;
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }
        .nav {
          display: flex;
          justify-content: center;
          gap: 20px;
          color: #24364a;
          font-size: 14px;
          font-weight: 900;
        }
        .nav a:hover { color: #ff6a00; }
        .header-actions { display: flex; align-items: center; gap: 8px; }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 999px;
          padding: 13px 19px;
          font-weight: 900;
          cursor: pointer;
          transition: .18s ease;
          white-space: nowrap;
          line-height: 1;
        }
        .btn:hover { transform: translateY(-1px); }
        .btn-orange {
          background: #ff6a00;
          color: #fff;
          box-shadow: 0 12px 28px rgba(255, 106, 0, .23);
        }
        .btn-blue { background: #071f3a; color: #fff; }
        .btn-light { background: #fff; color: #071f3a; border: 1px solid #e3ded6; }
        .btn-green {
          background: #25d366;
          color: #fff;
          box-shadow: 0 12px 28px rgba(37, 211, 102, .2);
        }

        .hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 84% 6%, rgba(255, 106, 0, .15), transparent 30%),
            linear-gradient(180deg, #fffdf9 0%, #f6f2eb 100%);
        }
        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(360px, .72fr);
          gap: 46px;
          align-items: center;
          padding: 52px 0 54px;
        }
        .badge {
          display: inline-flex;
          color: #9a3d00;
          background: #fff3e7;
          border: 1px solid #ffd5b6;
          border-radius: 999px;
          padding: 9px 14px;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .06em;
          margin-bottom: 18px;
        }
        h1 {
          font-size: clamp(42px, 4.5vw, 64px);
          line-height: .97;
          letter-spacing: -2.4px;
          margin: 0;
          color: #071f3a;
          max-width: 740px;
        }
        .hero-lead {
          font-size: 19px;
          line-height: 1.62;
          color: #526274;
          max-width: 660px;
          margin: 20px 0 0;
        }
        .hero-lead-mobile { display: none; }
        .mobile-proof-line { display: none; }
        .hero-cta-row {
          display: flex;
          gap: 11px;
          flex-wrap: wrap;
          align-items: center;
          margin: 26px 0 0;
        }
        .micro-note {
          font-size: 13px;
          color: #647386;
          margin: 13px 0 0;
          font-weight: 850;
        }
        .trust-micro {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 9px;
          margin: 24px 0 0;
          max-width: 720px;
        }
        .trust-micro div {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 16px;
          padding: 13px 14px;
          font-size: 14px;
          font-weight: 900;
          color: #071f3a;
          box-shadow: 0 10px 22px rgba(7, 31, 58, .06);
        }

        .form-card {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 26px 80px rgba(7, 31, 58, .15);
          scroll-margin-top: 92px;
        }
        .form-logo-wrap {
          display: flex;
          justify-content: center;
          padding-bottom: 16px;
          margin-bottom: 18px;
          border-bottom: 1px solid #eee9e2;
        }
        .form-logo {
          width: 212px;
          max-width: 100%;
          height: auto;
          display: block;
        }
        .form-benefits {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin: 0 0 15px;
        }
        .form-benefits span {
          background: #fff7ef;
          border: 1px solid #ffd5b6;
          color: #8c3a00;
          border-radius: 999px;
          padding: 8px 9px;
          text-align: center;
          font-size: 12px;
          font-weight: 900;
        }
        .mobile-form-kicker { display: none; }
        .form-sub-mobile { display: none; }
        .step-label {
          margin: 0;
          color: #ff6a00;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .06em;
          font-size: 12px;
        }
        .form-title {
          margin: 6px 0 8px;
          font-size: 29px;
          line-height: 1.05;
          color: #071f3a;
          letter-spacing: -1px;
        }
        .form-sub {
          margin: 0 0 15px;
          color: #687789;
          line-height: 1.5;
        }
        .form-part {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 10px;
          color: #071f3a;
          font-weight: 900;
          font-size: 14px;
        }
        .form-part span {
          width: 25px;
          height: 25px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #fff3e7;
          color: #ff6a00;
          border: 1px solid #ffd5b6;
          font-size: 12px;
        }
        .field-label {
          display: grid;
          gap: 6px;
          color: #24364a;
          font-size: 13px;
          font-weight: 900;
        }
        textarea.field {
          min-height: 92px;
          resize: vertical;
          line-height: 1.45;
        }
        .form-assurance {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 10px;
        }
        .form-assurance span {
          background: #f8f5ef;
          border: 1px solid #eee8df;
          border-radius: 999px;
          padding: 7px 9px;
          color: #24364a;
          font-size: 12px;
          font-weight: 900;
        }
        .notice {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          padding: 11px 13px;
          border-radius: 15px;
          font-weight: 850;
          margin-bottom: 14px;
          font-size: 14px;
        }
        .field {
          width: 100%;
          border: 1px solid #d9d5ce;
          background: #faf9f6;
          border-radius: 16px;
          padding: 15px 16px;
          font-size: 16px;
          outline: none;
          min-height: 55px;
        }
        .field:focus { border-color: #071f3a; background: #fff; }
        .form-stack { display: grid; gap: 12px; }
        .form-actions { display: grid; grid-template-columns: .8fr 1.6fr; gap: 9px; }
        .small-note {
          font-size: 12px;
          color: #798698;
          margin: 3px 0 0;
          line-height: 1.45;
        }
        .form-receive {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #eee9e2;
          display: grid;
          gap: 8px;
        }
        .form-receive strong {
          display: block;
          font-size: 14px;
          margin-bottom: 2px;
        }
        .form-receive div {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          background: #f8f5ef;
          border: 1px solid #eee8df;
          border-radius: 14px;
          padding: 10px 12px;
          color: #24364a;
          font-size: 13px;
          font-weight: 850;
        }
        .form-receive span { color: #ff6a00; font-weight: 900; }
        .success { text-align: center; padding: 28px 8px; }
        .success-icon {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: #dcfce7;
          color: #15803d;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
          font-size: 32px;
          font-weight: 900;
        }

        .review-band {
          background: #fff;
          border-top: 1px solid #e8e3db;
          border-bottom: 1px solid #e8e3db;
          padding: 24px 0;
        }
        .review-compact {
          display: grid;
          grid-template-columns: .9fr 1.55fr auto;
          gap: 22px;
          align-items: center;
        }
        .review-score {
          background: #071f3a;
          color: #fff;
          border-radius: 24px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .review-score strong {
          display: block;
          font-size: 42px;
          line-height: .9;
          letter-spacing: -1.5px;
        }
        .stars {
          color: #f5a400;
          letter-spacing: 1.5px;
          font-size: 16px;
          font-weight: 900;
          margin-top: 4px;
        }
        .review-score span {
          color: #d7e3ef;
          font-size: 13px;
          font-weight: 850;
        }
        .review-quote h2 {
          font-size: 30px;
          line-height: 1.12;
          margin: 0 0 8px;
          letter-spacing: -.8px;
        }
        .review-quote p {
          color: #526274;
          line-height: 1.58;
          margin: 0;
          font-size: 16px;
        }
        .review-author {
          min-width: 160px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #5967c8;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 20px;
        }
        .review-author strong,
        .review-author span {
          display: block;
        }
        .review-author strong { font-size: 15px; }
        .review-author span {
          color: #647386;
          font-size: 13px;
          margin-top: 2px;
          font-weight: 850;
        }

        .section { padding: 62px 0; }
        .section-tight { padding: 52px 0; }
        .section-white { background: #fff; }
        .section-head {
          max-width: 790px;
          margin: 0 auto 32px;
          text-align: center;
        }
        .eyebrow {
          color: #ff6a00;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .08em;
          margin: 0 0 9px;
          font-size: 12px;
        }
        h2 {
          font-size: clamp(32px, 3.5vw, 48px);
          line-height: 1.05;
          letter-spacing: -1.5px;
          margin: 0;
          color: #071f3a;
        }
        .section-head p {
          color: #647386;
          font-size: 17px;
          line-height: 1.62;
          margin-bottom: 0;
        }

        .different-section {
          background:
            radial-gradient(circle at 10% 8%, rgba(255, 106, 0, .10), transparent 28%),
            linear-gradient(180deg, #fffdf9 0%, #f5f2ec 100%);
          border-top: 1px solid #eee8df;
          border-bottom: 1px solid #eee8df;
        }
        .different-intro {
          max-width: 820px;
          margin: 0 auto 26px;
          text-align: center;
        }
        .different-intro h2 {
          margin-bottom: 14px;
        }
        .different-intro p {
          margin: 0 auto;
          color: #647386;
          font-size: 17px;
          line-height: 1.62;
          max-width: 750px;
        }
        .different-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .different-card {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, .92);
          border: 1px solid #e8e3db;
          border-radius: 26px;
          padding: 24px;
          box-shadow: 0 18px 52px rgba(7, 31, 58, .08);
          min-height: 205px;
        }
        .different-card:before {
          content: "";
          position: absolute;
          inset: 0 auto auto 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #ff6a00, rgba(255, 106, 0, .12));
        }
        .different-number {
          width: 42px;
          height: 42px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #071f3a;
          color: #fff;
          font-weight: 900;
          margin-bottom: 16px;
        }
        .different-card:nth-child(2) .different-number { background: #ff6a00; }
        .different-card h3 {
          margin: 0 0 10px;
          color: #071f3a;
          font-size: 22px;
          line-height: 1.14;
          letter-spacing: -.4px;
        }
        .different-card p {
          margin: 0;
          color: #647386;
          line-height: 1.6;
        }

        .problem-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }
        .problem-card {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 14px 38px rgba(7, 31, 58, .06);
          min-height: 184px;
        }
        .problem-icon {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          background: #fff3e7;
          color: #ff6a00;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          margin-bottom: 15px;
        }
        .problem-card h3,
        .premium-card h3 {
          margin: 0 0 9px;
          color: #071f3a;
          font-size: 21px;
          line-height: 1.15;
          letter-spacing: -.35px;
        }
        .problem-card p,
        .premium-card p {
          margin: 0;
          color: #647386;
          line-height: 1.58;
        }

        .comparison-wrap {
          background: linear-gradient(135deg, #071f3a 0%, #123a67 100%);
          border-radius: 32px;
          padding: 34px;
          color: #fff;
          box-shadow: 0 22px 66px rgba(7, 31, 58, .18);
        }
        .comparison-top {
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 28px;
          align-items: end;
          margin-bottom: 24px;
        }
        .comparison-top h2 { color: #fff; }
        .comparison-top p {
          color: #d7e3ef;
          line-height: 1.62;
          font-size: 17px;
          margin: 0;
        }
        .compare-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .compare-box {
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 24px;
          overflow: hidden;
        }
        .compare-title {
          padding: 16px 18px;
          background: rgba(255,255,255,.12);
          color: #fff;
          font-weight: 900;
          text-align: center;
        }
        .compare-title.orange { background: #ff6a00; }
        .compare-list { display: grid; }
        .compare-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 13px 16px;
          border-top: 1px solid rgba(255,255,255,.14);
          color: #dbe7f3;
          line-height: 1.35;
        }
        .compare-row strong {
          color: #fff;
          font-size: 14px;
        }
        .compare-row span {
          font-size: 14px;
          color: #d7e3ef;
          font-weight: 850;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .step-card {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 14px 38px rgba(7, 31, 58, .06);
        }
        .step-number {
          width: 46px;
          height: 46px;
          border-radius: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #071f3a;
          color: #fff;
          font-weight: 900;
          margin-bottom: 16px;
        }
        .step-card:nth-child(2) .step-number,
        .step-card:nth-child(4) .step-number {
          background: #ff6a00;
        }
        .step-card h3 {
          margin: 0 0 7px;
          font-size: 22px;
          color: #071f3a;
        }
        .step-card p {
          margin: 0;
          color: #647386;
          line-height: 1.55;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: center;
        }
        .premium-card {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 18px 54px rgba(7, 31, 58, .08);
        }
        .premium-list {
          display: grid;
          gap: 10px;
          margin-top: 20px;
        }
        .premium-list div {
          display: flex;
          gap: 9px;
          background: #f8f5ef;
          border: 1px solid #eee8df;
          border-radius: 15px;
          padding: 12px 13px;
          font-weight: 900;
          color: #24364a;
          line-height: 1.35;
        }
        .premium-list span { color: #ff6a00; }
        .dark-card {
          background: #071f3a;
          color: #fff;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 18px 54px rgba(7, 31, 58, .16);
        }
        .dark-card h3 {
          color: #fff;
          font-size: 31px;
          letter-spacing: -.8px;
          margin: 0 0 13px;
        }
        .dark-card p {
          color: #d7e3ef;
          line-height: 1.62;
          font-size: 16px;
        }
        .contact-lines {
          display: grid;
          gap: 10px;
          margin-top: 19px;
        }
        .contact-lines a,
        .contact-lines div {
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 15px;
          padding: 14px;
          font-weight: 900;
        }

        .examples-and-links {
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          gap: 24px;
          align-items: start;
        }
        .example-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .example-card {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 14px 38px rgba(7, 31, 58, .06);
        }
        .example-card small {
          display: inline-flex;
          background: #fff3e7;
          border: 1px solid #ffd5b6;
          color: #8c3a00;
          border-radius: 999px;
          padding: 6px 9px;
          font-weight: 900;
          margin-bottom: 12px;
        }
        .example-card strong {
          display: block;
          font-size: 20px;
          margin-bottom: 8px;
        }
        .example-card p {
          color: #647386;
          line-height: 1.55;
          margin: 0;
        }
        .popular-box {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 14px 38px rgba(7, 31, 58, .06);
        }
        .popular-box h3 {
          margin: 0 0 12px;
          font-size: 22px;
        }
        .popular-grid {
          display: grid;
          gap: 8px;
        }
        .popular-grid a {
          background: #f8f5ef;
          border: 1px solid #eee8df;
          border-radius: 13px;
          padding: 11px 12px;
          font-size: 14px;
          font-weight: 900;
        }
        .popular-grid a:hover {
          border-color: #ff6a00;
        }

        .faq {
          display: grid;
          gap: 10px;
          max-width: 930px;
          margin: 0 auto;
        }
        .faq-item {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 18px;
          padding: 17px 19px;
          display: grid;
          grid-template-columns: minmax(220px, .42fr) 1fr;
          gap: 22px;
          align-items: start;
        }
        .faq-item h3 {
          margin: 0;
          color: #071f3a;
          font-size: 17px;
          line-height: 1.28;
        }
        .faq-item p {
          margin: 0;
          color: #647386;
          line-height: 1.55;
        }

        .final-cta {
          background: linear-gradient(135deg, #071f3a 0%, #123a67 100%);
          color: #fff;
          padding: 64px 0;
          text-align: center;
        }
        .final-cta h2 { color: #fff; }
        .final-cta p {
          color: #d7e3ef;
          font-size: 18px;
          line-height: 1.6;
          max-width: 730px;
          margin: 16px auto 0;
        }
        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 11px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .footer {
          background: #061523;
          color: #cbd5e1;
          padding: 38px 0 46px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.15fr .8fr 1fr 1fr 1fr;
          gap: 28px;
        }
        .footer-logo {
          width: 205px;
          max-width: 100%;
          height: auto;
          background: #fff;
          border-radius: 15px;
          padding: 8px;
          object-fit: contain;
        }
        .footer h3 { color: #fff; margin: 0 0 10px; }
        .footer p {
          margin: 6px 0;
          color: #b8c3d0;
          line-height: 1.42;
        }
        .footer a:hover { color: #fff; }

        .whatsapp-float {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 80;
          background: #25d366;
          color: #fff;
          border-radius: 999px;
          padding: 13px 17px;
          font-weight: 900;
          box-shadow: 0 14px 32px rgba(37,211,102,.32);
          font-size: 14px;
        }
        .mobile-bottom-cta { display: none; }


        @media (min-width: 1141px) and (max-height: 850px) {
          .top-strip-inner {
            min-height: 30px;
            font-size: 12px;
          }
          .header-inner {
            min-height: 64px;
          }
          .logo {
            width: 205px;
          }
          .nav {
            font-size: 13px;
            gap: 16px;
          }
          .btn {
            padding: 11px 16px;
            font-size: 14px;
          }
          .hero-grid {
            padding: 34px 0 36px;
            gap: 34px;
            align-items: center;
          }
          h1 {
            font-size: clamp(38px, 4vw, 54px);
            line-height: .98;
          }
          .hero-lead {
            font-size: 17px;
            line-height: 1.52;
            margin-top: 16px;
          }
          .hero-cta-row {
            margin-top: 20px;
          }
          .micro-note {
            margin-top: 10px;
          }
          .trust-micro {
            margin-top: 18px;
            gap: 8px;
          }
          .trust-micro div {
            padding: 10px 12px;
            font-size: 13px;
            border-radius: 14px;
          }
          .form-card {
            padding: 20px;
            border-radius: 26px;
          }
          .form-logo-wrap {
            padding-bottom: 10px;
            margin-bottom: 12px;
          }
          .form-logo {
            width: 175px;
          }
          .form-benefits {
            margin-bottom: 10px;
          }
          .form-benefits span {
            padding: 6px 8px;
            font-size: 11px;
          }
          .form-title {
            font-size: 24px;
            margin-bottom: 6px;
          }
          .form-sub {
            font-size: 14px;
            line-height: 1.42;
            margin-bottom: 10px;
          }
          .notice {
            padding: 9px 11px;
            margin-bottom: 10px;
            font-size: 13px;
            border-radius: 13px;
          }
          .field {
            min-height: 48px;
            padding: 12px 14px;
            border-radius: 14px;
            font-size: 15px;
          }
          .form-stack {
            gap: 9px;
          }
          .form-receive {
            margin-top: 12px;
            padding-top: 12px;
            gap: 6px;
          }
          .form-receive strong {
            font-size: 13px;
          }
          .form-receive div {
            padding: 8px 10px;
            font-size: 12px;
            border-radius: 12px;
          }
        }

        @media (min-width: 1141px) and (max-height: 760px) {
          .form-receive div:nth-of-type(3) {
            display: none;
          }
          .hero-grid {
            padding-top: 28px;
            padding-bottom: 30px;
          }
          .badge {
            margin-bottom: 14px;
            padding: 8px 12px;
          }
        }

        @media (max-width: 1140px) {
          .header-inner { grid-template-columns: auto auto; }
          .nav {
            grid-column: 1 / -1;
            justify-content: flex-start;
            overflow-x: auto;
            gap: 18px;
            padding: 0 0 13px;
            scrollbar-width: none;
          }
          .nav::-webkit-scrollbar { display: none; }
          .hero-grid,
          .comparison-top,
          .two-col,
          .examples-and-links,
          .review-compact {
            grid-template-columns: 1fr;
          }
          .different-grid {
            grid-template-columns: 1fr;
          }
          .trust-micro,
          .problem-grid,
          .steps {
            grid-template-columns: repeat(2, 1fr);
          }
          .form-card {
            max-width: 620px;
            margin: 0 auto;
          }
          .footer-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 760px) {
          .container { width: min(100% - 28px, 1180px); }
          .top-strip { display: none; }
          .header { position: relative; }
          .header-inner {
            display: flex;
            flex-wrap: wrap;
            min-height: auto;
            padding: 14px 0 0;
            gap: 12px;
          }
          .logo { width: 205px; }
          .header-actions { margin-left: auto; }
          .header-actions .btn-green,
          .header-actions .btn-blue { display: none; }
          .header-actions .btn-orange {
            padding: 12px 15px;
            font-size: 14px;
          }
          .nav {
            width: 100%;
            order: 3;
            border-top: 1px solid #f0eee9;
            padding: 12px 0 11px;
            font-size: 14px;
          }
          .hero-grid {
            padding: 34px 0 36px;
            gap: 28px;
          }
          .badge {
            width: 100%;
            justify-content: center;
            text-align: center;
            border-radius: 22px;
            line-height: 1.35;
          }
          h1 {
            font-size: clamp(38px, 11vw, 50px);
            line-height: 1.02;
            letter-spacing: -1.3px;
          }
          .hero-lead { font-size: 18px; line-height: 1.55; }
          .hero-cta-row .btn,
          .cta-buttons .btn { width: 100%; }
          .trust-micro,
          .problem-grid,
          .steps,
          .example-grid,
          .footer-grid,
          .form-benefits {
            grid-template-columns: 1fr;
          }
          .form-card,
          .comparison-wrap,
          .premium-card,
          .dark-card,
          .popular-box {
            border-radius: 24px;
            padding: 22px;
          }
          .form-title { font-size: 26px; }
          .form-sub { font-size: 14px; }
          .form-actions { grid-template-columns: 1fr; }
          .different-card { min-height: 0; padding: 21px; }
          .review-band { padding: 22px 0; }
          .review-score {
            border-radius: 22px;
            padding: 18px;
          }
          .review-quote h2 { font-size: 27px; }
          .review-author { min-width: 0; }
          .section { padding: 50px 0; }
          .section-tight { padding: 44px 0; }
          .compare-columns { grid-template-columns: 1fr; }
          .compare-row { grid-template-columns: 1fr; gap: 5px; }
          .faq-item { display: block; }
          .faq-item h3 { margin-bottom: 7px; }
          .popular-grid {
            max-height: 390px;
            overflow: auto;
            padding-right: 2px;
          }
          .whatsapp-float { display: none; }
          .mobile-bottom-cta {
            position: fixed;
            left: 10px;
            right: 10px;
            bottom: 10px;
            z-index: 90;
            display: grid;
            grid-template-columns: 1.25fr .75fr;
            gap: 8px;
            background: rgba(255, 255, 255, .94);
            border: 1px solid #e8e3db;
            border-radius: 22px;
            padding: 8px;
            box-shadow: 0 18px 50px rgba(7,31,58,.18);
            backdrop-filter: blur(14px);
          }
          .mobile-bottom-cta a {
            min-height: 48px;
            padding: 12px 10px;
            font-size: 14px;
          }
          .final-cta { padding-bottom: 112px; }
          .footer { padding-bottom: 108px; }

          /* Rustige mobile-first conversie-optimalisatie */
          .header {
            position: sticky;
            top: 0;
          }
          .header-inner {
            padding: 10px 0;
          }
          .logo { width: 172px; }
          .nav { display: none; }
          .header-actions .btn-orange {
            padding: 11px 13px;
            font-size: 13px;
          }
          .hero-grid {
            padding: 22px 0 24px;
            gap: 16px;
            align-items: start;
          }
          .badge {
            display: none;
          }
          h1 {
            font-size: clamp(31px, 9.2vw, 38px);
            line-height: 1.06;
            letter-spacing: -.9px;
            max-width: 620px;
          }
          .hero-lead-desktop { display: none; }
          .hero-lead-mobile {
            display: block;
            font-size: 15px;
            line-height: 1.45;
            margin-top: 10px;
          }
          .hero-cta-row {
            margin-top: 13px;
            gap: 6px;
          }
          .hero-cta-row .btn-light {
            display: none;
          }
          .micro-note {
            display: none;
          }
          .mobile-proof-line {
            display: block;
            margin-top: 10px;
            color: #526274;
            font-size: 12px;
            line-height: 1.35;
            font-weight: 850;
          }
          .trust-micro {
            display: none;
          }
          .trust-micro div {
            background: transparent;
            border: 0;
            box-shadow: none;
            padding: 0;
            border-radius: 0;
            font-size: 12px;
            line-height: 1.25;
            color: #24364a;
          }
          .form-card {
            padding: 17px;
            border-radius: 22px;
            box-shadow: 0 18px 42px rgba(7,31,58,.12);
            scroll-margin-top: 14px;
          }
          .form-logo-wrap { display: none; }
          .form-benefits {
            display: none;
          }
          .form-benefits span {
            padding: 7px 5px;
            font-size: 11px;
          }
          .mobile-form-kicker {
            display: none;
          }
          .step-label {
            font-size: 11px;
          }
          .form-title {
            font-size: 21px;
            letter-spacing: -.4px;
            margin: 5px 0 5px;
            line-height: 1.12;
          }
          .form-sub-desktop { display: none; }
          .form-sub-mobile {
            display: block;
            margin-bottom: 10px;
          }
          .notice {
            display: none;
          }
          .form-part {
            margin-bottom: 8px;
            font-size: 13px;
          }
          .form-stack { gap: 9px; }
          .field {
            min-height: 49px;
            padding: 12px 13px;
            border-radius: 14px;
            font-size: 16px;
          }
          textarea.field { min-height: 78px; }
          .form-receive { display: none; }
          .review-band {
            padding: 14px 0;
          }
          .review-compact {
            gap: 10px;
          }
          .review-score {
            border-radius: 18px;
            padding: 12px 14px;
            gap: 11px;
          }
          .review-score strong {
            font-size: 31px;
          }
          .stars {
            font-size: 13px;
          }
          .review-quote h2 {
            font-size: 22px;
            margin-bottom: 0;
          }
          .review-quote p { display: none; }
          .review-author {
            gap: 8px;
          }
          .avatar {
            width: 36px;
            height: 36px;
            font-size: 17px;
          }
          .different-section {
            border-top: 0;
          }
          .different-intro p,
          .section-head p {
            font-size: 15px;
            line-height: 1.5;
          }
          .different-card,
          .problem-card,
          .step-card,
          .example-card {
            padding: 18px;
            border-radius: 20px;
          }
          .section { padding: 40px 0; }
          .section-tight { padding: 36px 0; }
          .mobile-bottom-cta {
            display: flex;
            left: 18px;
            right: 18px;
            bottom: 12px;
            padding: 6px;
            border-radius: 18px;
          }
          .mobile-bottom-cta a {
            width: 100%;
            min-height: 44px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>✓ Vrijblijvend voorstel</span>
          <span>✓ Geen makelaarskosten</span>
          <span>✓ Geen open huis nodig</span>
          <span>✓ Notariële afwikkeling</span>
        </div>
      </div>

      <header className="header">
        <div className="container header-inner">
          <a href="/" aria-label="Vastgoed Direct Nederland">
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="logo" />
          </a>

          <nav className="nav" aria-label="Hoofdnavigatie">
            <a href="#wanneer">Wanneer geschikt?</a>
            <a href="#vergelijking">Vergelijking</a>
            <a href="#werkwijze">Werkwijze</a>
            <a href="#over-ons">Over ons</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="header-actions">
            <a href={whatsappLink} onClick={() => trackGoogleAdsConversion("whatsapp")} target="_blank" rel="noopener noreferrer" className="btn btn-green">WhatsApp</a>
            <a href="tel:0612238051" onClick={() => trackGoogleAdsConversion("call")} className="btn btn-blue">Bel direct</a>
            <a href="#aanvraag" className="btn btn-orange">Start aanvraag</a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="badge">Ook als de woning nog niet verkoopklaar is</div>
            <h1>Uw woning verkopen zonder gedoe?</h1>
            <p className="hero-lead hero-lead-desktop">
              Wilt u weten wat er mogelijk is met uw woning? Vraag vrijblijvend een voorstel aan. Ook als de woning
              onderhoud nodig heeft, nog vol spullen staat of niet verkoopklaar is.
            </p>
            <p className="hero-lead hero-lead-mobile">
              Vraag vrijblijvend een voorstel aan. Ook als de woning nog vol spullen staat, onderhoud nodig heeft of niet verkoopklaar is.
            </p>

            <div className="hero-cta-row">
              <a href="#aanvraag" className="btn btn-orange">Bekijk mijn verkoopmogelijkheden</a>
              <a href={whatsappLink} onClick={() => trackGoogleAdsConversion("whatsapp")} target="_blank" rel="noopener noreferrer" className="btn btn-light">Eerst even overleggen</a>
            </div>

            <p className="micro-note">Niet eerst opknappen. Niet eerst leeghalen. Vrijblijvend voorstel.</p>
            <div className="mobile-proof-line">Niet eerst opknappen · Niet leeghalen · Vrijblijvend</div>

            <div className="trust-micro" aria-label="Voordelen">
              <div>✓ Gratis en vrijblijvend</div>
              <div>✓ Niet eerst opknappen</div>
              <div>✓ Niet eerst leeghalen</div>
              <div>✓ Persoonlijk contact</div>
            </div>
          </div>

          <section id="aanvraag" className="form-card">
            <div className="form-logo-wrap">
              <img src="/logo.png" alt="Vastgoed Direct Nederland" className="form-logo" />
            </div>

            {!submitted ? (
              <form onSubmit={submitLead}>
                <div className="form-benefits">
                  <span>Niet opknappen</span>
                  <span>Niet leeghalen</span>
                  <span>Vrijblijvend</span>
                </div>
                <div className="mobile-form-kicker">Binnen 1 minuut aangevraagd</div>

                <p className="step-label">Stap {step} van 3</p>
                <h2 className="form-title">Vertel kort om welke woning het gaat</h2>
                <p className="form-sub form-sub-desktop">
                  Vul uw adres en situatie in. Ook als de woning nog vol staat, onderhoud nodig heeft of niet
                  verkoopklaar is.
                </p>
                <p className="form-sub form-sub-mobile">
                  Ook als de woning nog vol staat, onderhoud nodig heeft of niet verkoopklaar is.
                </p>
                <div className="notice">Gratis en vrijblijvend. U hoeft de woning niet eerst op te knappen of leeg te halen.</div>

                {step === 1 && (
                  <div className="form-stack">
                    <div className="form-part"><span>1</span> Uw woning</div>
                    <input name="postcode" value={form.postcode} onChange={updateForm} placeholder="Postcode" className="field" required />
                    <input name="huisnummer" value={form.huisnummer} onChange={updateForm} placeholder="Huisnummer" className="field" required />
                    <select name="woningtype" value={form.woningtype} onChange={updateForm} className="field" required>
                      <option value="">Type woning</option>
                      {woningTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                    <button type="button" onClick={nextStep} className="btn btn-blue">Volgende stap</button>
                  </div>
                )}

                {step === 2 && (
                  <div className="form-stack">
                    <div className="form-part"><span>2</span> Uw situatie</div>
                    <select name="situatie" value={form.situatie} onChange={updateForm} className="field" required>
                      <option value="">Situatie</option>
                      {verkoopSituaties.map((situatie) => (
                        <option key={situatie}>{situatie}</option>
                      ))}
                    </select>
                    <select name="termijn" value={form.termijn} onChange={updateForm} className="field">
                      <option value="">Gewenste termijn (optioneel)</option>
                      {termijnen.map((termijn) => (
                        <option key={termijn}>{termijn}</option>
                      ))}
                    </select>
                    <textarea
                      name="toelichting"
                      value={form.toelichting}
                      onChange={updateForm}
                      placeholder="Korte toelichting (optioneel)"
                      className="field"
                    />
                    <div className="form-actions">
                      <button type="button" onClick={previousStep} className="btn btn-light">Terug</button>
                      <button type="button" onClick={nextStep} className="btn btn-blue">Naar laatste stap</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="form-stack">
                    <div className="form-part"><span>3</span> Contactgegevens</div>
                    <input name="naam" value={form.naam} onChange={updateForm} placeholder="Naam" className="field" required />
                    <input name="telefoon" value={form.telefoon} onChange={updateForm} placeholder="Telefoonnummer" className="field" required />
                    <input name="email" value={form.email} onChange={updateForm} placeholder="E-mailadres" type="email" className="field" required />
                    <div className="form-actions">
                      <button type="button" onClick={previousStep} className="btn btn-light">Terug</button>
                      <button type="submit" className="btn btn-orange">Bekijk mijn verkoopmogelijkheden</button>
                    </div>
                    <p className="small-note">Wij gebruiken uw gegevens alleen om persoonlijk contact op te nemen over uw aanvraag.</p>
                    <div className="form-assurance">
                      <span>Niet eerst opknappen</span>
                      <span>Niet eerst leeghalen</span>
                      <span>Vrijblijvend</span>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <div className="success">
                <div className="success-icon">✓</div>
                <h2 className="form-title">Aanvraag ontvangen</h2>
                <p className="form-sub">Wij nemen zo snel mogelijk persoonlijk contact met u op.</p>
                <a href={whatsappLink} onClick={() => trackGoogleAdsConversion("whatsapp")} target="_blank" rel="noopener noreferrer" className="btn btn-green">Aanvullen via WhatsApp</a>
              </div>
            )}

            <div className="form-receive">
              <strong>Wat u ontvangt:</strong>
              <div><span>✓</span> Duidelijkheid zonder dat u eerst hoeft op te knappen</div>
              <div><span>✓</span> Ook mogelijk als de woning nog vol spullen staat</div>
              <div><span>✓</span> Persoonlijk contact zonder verplichting</div>
            </div>
          </section>
        </div>
      </section>

      <section className="review-band">
        <div className="container review-compact">
          <div className="review-score">
            <strong>5,0</strong>
            <div>
              <div className="stars">★★★★★</div>
              <span>Google-review</span>
            </div>
          </div>

          <div className="review-quote">
            <h2>“Precies de oplossing die ik zocht.”</h2>
            <p>
              “Het contact was prettig en duidelijk. Er werd goed uitgelegd hoe het proces zou verlopen
              en afspraken werden snel opgepakt. De woning is uiteindelijk binnen enkele weken verkocht.”
            </p>
          </div>

          <div className="review-author">
            <div className="avatar">L</div>
            <div>
              <strong>Laura vd Zalm</strong>
              <span>via Google</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section different-section">
        <div className="container">
          <div className="different-intro">
            <p className="eyebrow">Onderscheidend en persoonlijk</p>
            <h2>Waarom Vastgoed Direct Nederland anders werkt</h2>
            <p>
              Veel partijen praten vooral over snelheid. Wij maken het liever concreet: wat is er mogelijk met uw woning,
              ook als deze nog niet leeg, opgeknapt of verkoopklaar is?
            </p>
          </div>

          <div className="different-grid">
            {whyDifferent.map(([title, text], index) => (
              <article className="different-card" key={title}>
                <div className="different-number">0{index + 1}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="wanneer" className="section section-white">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Wanneer past dit bij u?</p>
            <h2>Als u zonder gedoe wilt weten wat mogelijk is.</h2>
            <p>
              Bijvoorbeeld als de woning onderhoud nodig heeft, nog vol spullen staat, leegstaat of als u geen open huis
              en bezichtigingen wilt.
            </p>
          </div>

          <div className="problem-grid">
            {situations.map(([title, text]) => (
              <article className="problem-card" key={title}>
                <div className="problem-icon">✓</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="vergelijking" className="section-tight">
        <div className="container comparison-wrap">
          <div className="comparison-top">
            <div>
              <p className="eyebrow">Waarom rechtstreeks verkopen?</p>
              <h2>Niet eerst opruimen, opknappen of bezichtigingen plannen.</h2>
            </div>
            <p>
              Een verkoopbedrag is belangrijk, maar ook de tijd, moeite en kosten vooraf tellen mee. Soms wilt u vooral
              duidelijkheid zonder eerst alles verkoopklaar te maken.
            </p>
          </div>

          <div className="compare-columns">
            <div className="compare-box">
              <div className="compare-title">Traditioneel verkopen</div>
              <div className="compare-list">
                {comparisonRows.map(([label, normal]) => (
                  <div className="compare-row" key={`normal-${label}`}>
                    <strong>{label}</strong>
                    <span>{normal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="compare-box">
              <div className="compare-title orange">Via Vastgoed Direct Nederland</div>
              <div className="compare-list">
                {comparisonRows.map(([label, , direct]) => (
                  <div className="compare-row" key={`direct-${label}`}>
                    <strong>{label}</strong>
                    <span>{direct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="werkwijze" className="section section-white">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">De werkwijze</p>
            <h2>Van korte aanvraag naar duidelijk voorstel.</h2>
            <p>U hoeft nog niet alles klaar of opgeruimd te hebben. Een adres en korte toelichting zijn genoeg om te starten.</p>
          </div>

          <div className="steps">
            {processSteps.map(([num, title, text]) => (
              <article className="step-card" key={title}>
                <div className="step-number">{num}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 30 }}>
            <a href="#aanvraag" className="btn btn-orange">Ontvang mijn persoonlijke voorstel</a>
          </div>
        </div>
      </section>

      <section id="over-ons" className="section-tight">
        <div className="container two-col">
          <div className="premium-card">
            <p className="eyebrow">Wat krijgt u concreet?</p>
            <h2>Duidelijkheid zonder dat u eerst alles hoeft te regelen.</h2>
            <p>
              U hoeft de woning niet eerst verkoopklaar te maken. Wij kijken naar de woning zoals die nu is en bespreken
              wat praktisch mogelijk is.
            </p>

            <div className="premium-list">
              <div><span>✓</span> Duidelijkheid over de verkoopmogelijkheid</div>
              <div><span>✓</span> Ook bij onderhoud of achterstallig werk</div>
              <div><span>✓</span> Ook als de woning nog vol spullen staat</div>
              <div><span>✓</span> Persoonlijk contact om vragen te bespreken</div>
            </div>
          </div>

          <div className="dark-card">
            <h3>Persoonlijk contact, geen standaardverhaal.</h3>
            <p>
              U hoeft uw woning niet mooier voor te doen dan hij is. Vertel kort wat er speelt, dan kijken we rustig met u mee.
            </p>
            <div className="contact-lines">
              <a href="tel:0612238051" onClick={() => trackGoogleAdsConversion("call")}>Bel direct: 06 12 23 80 51</a>
              <a href={whatsappLink} onClick={() => trackGoogleAdsConversion("whatsapp")} target="_blank" rel="noopener noreferrer">WhatsApp: meestal snel reactie</a>
              <div>info@verkoopjehuisdirect.nl</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container examples-and-links">
          <div>
            <div className="section-head" style={{ textAlign: "left", margin: "0 0 22px" }}>
              <p className="eyebrow">Voorbeeldsituaties</p>
              <h2>Herkenbare redenen om direct te verkopen.</h2>
            </div>
            <div className="example-grid">
              <article className="example-card">
                <small>Leegstand</small>
                <strong>Geen maanden wachten</strong>
                <p>Snel duidelijkheid over de mogelijkheden zonder lang verkooptraject.</p>
              </article>
              <article className="example-card">
                <small>Onderhoud</small>
                <strong>Niet eerst opknappen of leeghalen</strong>
                <p>Ook als de woning onderhoud nodig heeft of nog vol spullen staat.</p>
              </article>
              <article className="example-card">
                <small>Privacy</small>
                <strong>Geen open huis</strong>
                <p>Een rustiger traject zonder reeks bezichtigingen.</p>
              </article>
            </div>
          </div>

          <aside className="popular-box">
            <p className="eyebrow">Verkoopinformatie</p>
            <h3>Per situatie, regio of plaats</h3>
            <div className="popular-grid">
              {popularLinks.map(([href, label]) => (
                <a href={href} key={href}>✓ {label}</a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section id="faq" className="section section-white">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Veelgestelde vragen</p>
            <h2>Twijfels wegnemen vóórdat u een aanvraag doet.</h2>
          </div>

          <div className="faq">
            <div className="faq-item">
              <h3>Is de aanvraag gratis?</h3>
              <p>Ja, de aanvraag is gratis en vrijblijvend. U zit nergens aan vast.</p>
            </div>
            <div className="faq-item">
              <h3>Moet mijn woning verkoopklaar of leeg zijn?</h3>
              <p>Nee. Ook als de woning onderhoud nodig heeft, schade heeft of nog vol spullen staat, kunt u vrijblijvend informeren.</p>
            </div>
            <div className="faq-item">
              <h3>Betaal ik makelaarskosten?</h3>
              <p>Nee, u doet rechtstreeks een aanvraag via Vastgoed Direct Nederland. Er zijn geen makelaarskosten voor dit traject.</p>
            </div>
            <div className="faq-item">
              <h3>Kan ik verkopen zonder bezichtigingen?</h3>
              <p>In veel situaties is dat mogelijk. Wij bespreken de verkoopmogelijkheden zonder traditioneel bezichtigingstraject of open huis.</p>
            </div>
            <div className="faq-item">
              <h3>Betaal ik notariskosten?</h3>
              <p>Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening. Afwijkingen bespreken we vooraf.</p>
            </div>
            <div className="faq-item">
              <h3>Kan ik eerst alleen overleggen?</h3>
              <p>Ja. U kunt vrijblijvend bellen, WhatsAppen of een aanvraag doen om uw situatie rustig te bespreken.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <h2>Wilt u weten wat er mogelijk is met uw woning?</h2>
          <p>
            Ook als de woning nog vol spullen staat, onderhoud nodig heeft of niet verkoopklaar is. Vraag vrijblijvend een voorstel aan.
          </p>
          <div className="cta-buttons">
            <a href="#aanvraag" className="btn btn-orange">Bekijk mijn verkoopmogelijkheden</a>
            <a href="tel:0612238051" onClick={() => trackGoogleAdsConversion("call")} className="btn btn-light">Bel direct</a>
            <a href={whatsappLink} onClick={() => trackGoogleAdsConversion("whatsapp")} target="_blank" rel="noopener noreferrer" className="btn btn-green">WhatsApp</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="footer-logo" />
            <p>Verkoopjehuisdirect.nl is de website van Vastgoed Direct Nederland.</p>
            <p>Voor woningeigenaren die willen weten wat er mogelijk is, ook als de woning niet verkoopklaar is.</p>
          </div>

          <div>
            <h3>Contact</h3>
            <p>info@verkoopjehuisdirect.nl</p>
            <p>06 12 23 80 51</p>
            <p><a href="tel:0612238051" onClick={() => trackGoogleAdsConversion("call")}>Bel direct</a></p>
          </div>

          <div>
            <h3>Diensten</h3>
            <p><a href="/huis-direct-verkopen">Huis direct verkopen</a></p>
            <p><a href="/huis-snel-verkopen">Huis snel verkopen</a></p>
            <p><a href="/woning-verkopen-zonder-makelaar">Zonder makelaar verkopen</a></p>
            <p><a href="/huis-verkopen-zonder-bezichtigingen">Zonder bezichtigingen verkopen</a></p>
            <p><a href="/huis-verkopen-zonder-funda">Zonder Funda verkopen</a></p>
            <p><a href="/huis-verkopen-met-spoed">Met spoed verkopen</a></p>
          </div>

          <div>
            <h3>Situaties</h3>
            <p><a href="/opknapwoning-verkopen">Opknapwoning verkopen</a></p>
            <p><a href="/huis-verkopen-bij-erfenis">Huis verkopen bij erfenis</a></p>
            <p><a href="/verhuurde-woning-verkopen">Verhuurde woning verkopen</a></p>
            <p><a href="/leegstaand-huis-verkopen">Leegstaand huis verkopen</a></p>
            <p><a href="/woning-verkopen-met-schade">Woning met schade verkopen</a></p>
            <p><a href="/huis-verkopen-na-overlijden">Na overlijden verkopen</a></p>
          </div>

          <div>
            <h3>Regio's</h3>
            <p><a href="/huis-verkopen-groningen">Groningen</a></p>
            <p><a href="/woning-verkopen-friesland">Friesland</a></p>
            <p><a href="/woning-verkopen-drenthe">Drenthe</a></p>
            <p><a href="/woning-verkopen-overijssel">Overijssel</a></p>
            <p><a href="/huis-verkopen-stadskanaal">Stadskanaal</a></p>
            <p><a href="/huis-verkopen-assen">Assen</a></p>
            <p><a href="/privacyverklaring">Privacyverklaring</a></p>
            <p>© 2026 Vastgoed Direct Nederland</p>
          </div>
        </div>
      </footer>

      <a href={whatsappLink} onClick={() => trackGoogleAdsConversion("whatsapp")} target="_blank" rel="noopener noreferrer" className="whatsapp-float">WhatsApp</a>

      {showMobileSticky && (
        <div className="mobile-bottom-cta">
          <a href="#aanvraag" className="btn btn-orange">Gratis voorstel aanvragen</a>
        </div>
      )}
    </main>
  );
}
