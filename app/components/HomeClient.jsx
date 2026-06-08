"use client";

import React, { useState } from "react";

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
    "Vastgoed Direct Nederland helpt woningeigenaren die hun woning snel, duidelijk en zonder verkoopstress willen verkopen. Wij bieden een directe verkoopoplossing voor woningen in uiteenlopende situaties, zoals achterstallig onderhoud, leegstand, verhuur, erfenis, scheiding of financiële druk.",
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
        text: "Nee, ook woningen met achterstallig onderhoud, schade, leegstand of renovatiebehoefte kunnen worden aangemeld.",
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
      name: "Betaal ik notariskosten?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bij een passende verkoop nemen wij de standaard notariskosten voor de levering voor onze rekening. Eventuele afwijkende kosten of bijzondere afspraken bespreken we vooraf duidelijk.",
      },
    },
    {
      "@type": "Question",
      name: "Kan ik verkopen zonder bezichtigingen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, in veel situaties is dat mogelijk. Wij bespreken de verkoopmogelijkheden zonder traditioneel bezichtigingstraject of open huis.",
      },
    },
  ],
};

const situations = [
  {
    title: "Ik wil geen bezichtigingen",
    text: "Prettig bij privacy, verhuur, persoonlijke omstandigheden of als u geen onbekenden over de vloer wilt.",
  },
  {
    title: "Mijn woning heeft onderhoud nodig",
    text: "Ook woningen met achterstallig onderhoud, schade of renovatiebehoefte kunnen worden aangemeld.",
  },
  {
    title: "Ik wil snel duidelijkheid",
    text: "Geen maandenlange onzekerheid, maar een concreet voorstel met voorwaarden en vervolgstappen.",
  },
  {
    title: "Erfenis, scheiding of leegstand",
    text: "Rust, overzicht en duidelijke afspraken in een periode waarin u geen onnodige verkoopdruk wilt.",
  },
];

const processSteps = [
  ["01", "Aanvraag", "U vult de belangrijkste woninggegevens in. Dit is gratis, discreet en vrijblijvend."],
  ["02", "Persoonlijk contact", "Wij bespreken uw situatie, gewenste planning en eventuele bijzonderheden."],
  ["03", "Voorstel", "U ontvangt een helder verkoopvoorstel met bedrag, voorwaarden en vervolgstappen."],
  ["04", "Notaris", "Bij akkoord worden de afspraken zorgvuldig en notarieel vastgelegd."],
];

const comparisonRows = [
  ["Woning verkoopklaar maken", "Vaak gewenst of noodzakelijk", "Niet altijd nodig"],
  ["Bezichtigingen / open huis", "Meerdere momenten mogelijk", "Geen open huis nodig"],
  ["Makelaarskosten", "Gebruikelijk van toepassing", "Geen makelaarskosten"],
  ["Doorlooptijd", "Afhankelijk van markt en kijkers", "Snel duidelijkheid mogelijk"],
  ["Privacy", "Meerdere partijen over de vloer", "Discreter traject"],
  ["Afspraken", "Onderhandeling en voorbehouden", "Helder voorstel vooraf"],
];

const popularLinks = [
  ["/leegstaand-huis-verkopen", "Leegstaand huis verkopen"],
  ["/opknapwoning-verkopen", "Opknapwoning verkopen"],
  ["/huis-verkopen-met-achterstallig-onderhoud", "Achterstallig onderhoud"],
  ["/huis-verkopen-groningen", "Huis verkopen in Groningen"],
  ["/woning-verkopen-friesland", "Woning verkopen in Friesland"],
  ["/huis-direct-verkopen", "Huis direct verkopen"],
  ["/huis-snel-verkopen", "Huis snel verkopen"],
  ["/woning-verkopen-zonder-makelaar", "Zonder makelaar verkopen"],
  ["/huis-verkopen-zonder-bezichtigingen", "Zonder bezichtigingen"],
  ["/huis-verkopen-bij-erfenis", "Huis verkopen bij erfenis"],
  ["/huis-verkopen-bij-scheiding", "Huis verkopen bij scheiding"],
  ["/verhuurde-woning-verkopen", "Verhuurde woning verkopen"],
  ["/woning-verkopen-drenthe", "Woning verkopen in Drenthe"],
  ["/woning-verkopen-overijssel", "Woning verkopen in Overijssel"],
];

export default function HomeClient() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    postcode: "",
    huisnummer: "",
    woningtype: "",
    staat: "",
    reden: "",
    naam: "",
    email: "",
    telefoon: "",
  });

  const updateForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const nextStep = () => setStep((current) => Math.min(current + 1, 4));
  const previousStep = () => setStep((current) => Math.max(current - 1, 1));

  const submitLead = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);

    const lead = {
      naam: form.naam,
      email: form.email,
      telefoon: form.telefoon,
      postcode: form.postcode,
      huisnummer: form.huisnummer,
      woningtype: form.woningtype,
      staat: form.staat,
      reden: form.reden,
      pagina: window.location.pathname,
      bron:
        params.get("utm_source") ||
        params.get("source") ||
        document.referrer ||
        "direct",
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
        .container { width: min(1240px, calc(100% - 44px)); margin: 0 auto; }
        .top-strip {
          background: #071f3a;
          color: #fff;
          font-size: 14px;
          font-weight: 900;
        }
        .top-strip-inner {
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          text-align: center;
        }
        .top-strip-inner span { white-space: nowrap; }
        .header {
          position: sticky;
          top: 0;
          z-index: 70;
          background: rgba(255, 255, 255, .94);
          border-bottom: 1px solid #e8e3db;
          backdrop-filter: blur(14px);
        }
        .header-inner {
          min-height: 88px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 22px;
        }
        .logo {
          display: block;
          width: 260px;
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }
        .nav {
          display: flex;
          justify-content: center;
          gap: 21px;
          color: #24364a;
          font-size: 15px;
          font-weight: 900;
        }
        .nav a { white-space: nowrap; }
        .nav a:hover { color: #ff6a00; }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 999px;
          padding: 14px 21px;
          font-weight: 900;
          cursor: pointer;
          transition: .2s ease;
          white-space: nowrap;
          line-height: 1;
        }
        .btn:hover { transform: translateY(-1px); }
        .btn-orange {
          background: #ff6a00;
          color: #fff;
          box-shadow: 0 14px 30px rgba(255, 106, 0, .24);
        }
        .btn-blue { background: #071f3a; color: #fff; }
        .btn-light { background: #fff; color: #071f3a; border: 1px solid #e3ded6; }
        .btn-green {
          background: #25d366;
          color: #fff;
          box-shadow: 0 14px 30px rgba(37, 211, 102, .22);
        }
        .hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 82% 2%, rgba(255, 106, 0, .18), transparent 32%),
            radial-gradient(circle at 6% 90%, rgba(7, 31, 58, .12), transparent 34%),
            linear-gradient(180deg, #fffdf9 0%, #f7f3ec 100%);
        }
        .hero::before {
          content: "";
          position: absolute;
          right: -110px;
          top: 110px;
          width: 330px;
          height: 330px;
          border-radius: 999px;
          border: 52px solid rgba(255, 106, 0, .11);
        }
        .hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(430px, .82fr);
          gap: 58px;
          align-items: start;
          padding: 70px 0 74px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #9a3d00;
          background: #fff3e7;
          border: 1px solid #ffd5b6;
          border-radius: 999px;
          padding: 10px 15px;
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .06em;
          margin-bottom: 20px;
        }
        h1 {
          font-size: clamp(42px, 5vw, 70px);
          line-height: .94;
          letter-spacing: -2.9px;
          margin: 0;
          color: #071f3a;
          max-width: 760px;
        }
        .hero-lead {
          font-size: 20px;
          line-height: 1.68;
          color: #526274;
          max-width: 680px;
          margin: 24px 0 0;
        }
        .hero-cta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: flex-start;
          margin: 30px 0 0;
        }
        .micro-note {
          font-size: 13px;
          color: #637286;
          margin: 9px 0 0;
          font-weight: 800;
        }
        .trust-micro {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin: 28px 0 0;
          max-width: 760px;
        }
        .trust-micro div {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 18px;
          padding: 15px;
          font-weight: 900;
          color: #071f3a;
          box-shadow: 0 12px 28px rgba(7, 31, 58, .06);
        }
        .proposal-visual {
          display: grid;
          gap: 18px;
        }
        .proposal-card {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 34px;
          padding: 26px;
          box-shadow: 0 30px 90px rgba(7, 31, 58, .16);
          overflow: hidden;
          position: relative;
        }
        .proposal-card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 112px;
          background: linear-gradient(135deg, #071f3a, #123a67);
        }
        .proposal-card-inner { position: relative; z-index: 1; }
        .proposal-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
          color: #fff;
          min-height: 92px;
        }
        .proposal-top span {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .07em;
          font-weight: 900;
          color: #d9e6f5;
        }
        .proposal-top strong {
          display: block;
          margin-top: 5px;
          font-size: 20px;
          line-height: 1.1;
        }
        .proposal-pill {
          background: rgba(255, 255, 255, .14);
          border: 1px solid rgba(255, 255, 255, .22);
          border-radius: 999px;
          padding: 8px 11px;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }
        .amount-preview {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 26px;
          padding: 22px;
          box-shadow: 0 18px 42px rgba(7, 31, 58, .1);
          margin-bottom: 15px;
        }
        .amount-preview small {
          display: block;
          color: #647386;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .06em;
        }
        .amount-preview strong {
          display: block;
          font-size: 43px;
          color: #ff6a00;
          letter-spacing: -1.8px;
          margin-top: 7px;
        }
        .proposal-list {
          display: grid;
          gap: 10px;
        }
        .proposal-list div {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          background: #f8f5ef;
          border: 1px solid #eee8df;
          border-radius: 17px;
          padding: 13px 14px;
          color: #24364a;
          font-weight: 850;
        }
        .proposal-list span {
          color: #ff6a00;
          font-weight: 900;
        }
        .confidence-card {
          background: #071f3a;
          color: #fff;
          border-radius: 28px;
          padding: 22px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          box-shadow: 0 18px 50px rgba(7, 31, 58, .13);
        }
        .confidence-card div {
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 18px;
          padding: 15px;
        }
        .confidence-card strong, .confidence-card span { display: block; }
        .confidence-card strong { font-size: 22px; color: #fff; }
        .confidence-card span { color: #d9e6f5; font-size: 13px; margin-top: 4px; line-height: 1.35; }
        .form-card {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 34px;
          padding: 30px;
          box-shadow: 0 30px 90px rgba(7, 31, 58, .16);
        }
        .form-logo-wrap {
          display: flex;
          justify-content: center;
          padding-bottom: 20px;
          margin-bottom: 22px;
          border-bottom: 1px solid #eee9e2;
        }
        .form-logo {
          width: 235px;
          max-width: 100%;
          height: auto;
          display: block;
        }
        .form-benefits {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin: 0 0 18px;
        }
        .form-benefits span {
          background: #fff7ef;
          border: 1px solid #ffd5b6;
          color: #8c3a00;
          border-radius: 999px;
          padding: 8px 10px;
          text-align: center;
          font-size: 12px;
          font-weight: 900;
        }
        .step-label {
          margin: 0;
          color: #ff6a00;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .06em;
          font-size: 13px;
        }
        .form-title {
          margin: 6px 0 8px;
          font-size: 31px;
          line-height: 1.06;
          color: #071f3a;
          letter-spacing: -1.1px;
        }
        .form-sub {
          margin: 0 0 18px;
          color: #687789;
          line-height: 1.55;
        }
        .notice {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          padding: 12px 14px;
          border-radius: 16px;
          font-weight: 850;
          margin-bottom: 18px;
        }
        .field {
          width: 100%;
          border: 1px solid #d9d5ce;
          background: #faf9f6;
          border-radius: 18px;
          padding: 16px 18px;
          font-size: 16px;
          outline: none;
          min-height: 58px;
        }
        .field:focus { border-color: #071f3a; background: #fff; }
        .form-stack { display: grid; gap: 14px; }
        .form-actions { display: grid; grid-template-columns: .9fr 1.8fr; gap: 10px; }
        .small-note {
          font-size: 12px;
          color: #798698;
          margin: 4px 0 0;
          line-height: 1.45;
        }
        .success { text-align: center; padding: 34px 10px; }
        .success-icon {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #dcfce7;
          color: #15803d;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 34px;
          font-weight: 900;
        }
        .section { padding: 82px 0; }
        .section-white { background: #fff; }
        .section-head {
          max-width: 820px;
          margin: 0 auto 42px;
          text-align: center;
        }
        .eyebrow {
          color: #ff6a00;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .08em;
          margin: 0 0 10px;
          font-size: 13px;
        }
        h2 {
          font-size: clamp(34px, 4vw, 54px);
          line-height: 1.04;
          letter-spacing: -1.8px;
          margin: 0;
          color: #071f3a;
        }
        .section-head p {
          color: #647386;
          font-size: 18px;
          line-height: 1.7;
          margin-bottom: 0;
        }
        .problem-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .problem-card {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 18px 48px rgba(7, 31, 58, .07);
          min-height: 230px;
        }
        .problem-icon {
          width: 46px;
          height: 46px;
          border-radius: 16px;
          background: #fff3e7;
          color: #ff6a00;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          margin-bottom: 18px;
        }
        .problem-card h3, .premium-card h3 {
          margin: 0 0 10px;
          color: #071f3a;
          font-size: 23px;
          line-height: 1.15;
          letter-spacing: -.4px;
        }
        .problem-card p, .premium-card p {
          margin: 0;
          color: #647386;
          line-height: 1.65;
        }
        .comparison-wrap {
          background: linear-gradient(135deg, #071f3a 0%, #123a67 100%);
          border-radius: 38px;
          padding: 38px;
          color: #fff;
          box-shadow: 0 26px 80px rgba(7, 31, 58, .2);
        }
        .comparison-intro {
          display: grid;
          grid-template-columns: 1fr .85fr;
          gap: 28px;
          align-items: end;
          margin-bottom: 26px;
        }
        .comparison-intro h2 { color: #fff; }
        .comparison-intro p {
          color: #d7e3ef;
          line-height: 1.7;
          font-size: 18px;
        }
        .comparison-table {
          display: grid;
          grid-template-columns: 1.05fr 1fr 1.05fr;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 24px;
          overflow: hidden;
          background: rgba(255,255,255,.07);
        }
        .comparison-table div {
          padding: 17px 18px;
          border-right: 1px solid rgba(255,255,255,.16);
          border-bottom: 1px solid rgba(255,255,255,.16);
          color: #dbe7f3;
          line-height: 1.42;
        }
        .comparison-table div:nth-child(3n) { border-right: 0; }
        .comparison-table .head {
          background: rgba(255,255,255,.12);
          color: #fff;
          font-weight: 900;
          text-align: center;
        }
        .comparison-table .head.orange { background: #ff6a00; }
        .comparison-table .label-cell {
          font-weight: 900;
          color: #fff;
        }
        .comparison-table .direct-cell {
          background: rgba(255, 106, 0, .1);
          color: #fff;
          font-weight: 900;
        }
        .steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          position: relative;
        }
        .step-card {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 30px;
          padding: 26px;
          box-shadow: 0 18px 44px rgba(7, 31, 58, .08);
        }
        .step-number {
          width: 58px;
          height: 58px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #071f3a;
          color: #fff;
          font-weight: 900;
          font-size: 18px;
          margin-bottom: 20px;
        }
        .step-card:nth-child(2) .step-number,
        .step-card:nth-child(4) .step-number {
          background: #ff6a00;
        }
        .step-card h3 {
          margin: 0 0 9px;
          font-size: 24px;
          color: #071f3a;
        }
        .step-card p {
          margin: 0;
          color: #647386;
          line-height: 1.65;
        }
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
          align-items: center;
        }
        .premium-card {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 34px;
          padding: 32px;
          box-shadow: 0 24px 70px rgba(7, 31, 58, .1);
        }
        .premium-list {
          display: grid;
          gap: 11px;
          margin-top: 22px;
        }
        .premium-list div {
          display: flex;
          gap: 10px;
          background: #f8f5ef;
          border: 1px solid #eee8df;
          border-radius: 18px;
          padding: 14px 15px;
          font-weight: 900;
          color: #24364a;
        }
        .premium-list span { color: #ff6a00; }
        .dark-card {
          background: #071f3a;
          color: #fff;
          border-radius: 34px;
          padding: 34px;
          box-shadow: 0 24px 70px rgba(7, 31, 58, .18);
        }
        .dark-card h3 {
          color: #fff;
          font-size: 32px;
          letter-spacing: -.8px;
          margin: 0 0 16px;
        }
        .dark-card p {
          color: #d7e3ef;
          line-height: 1.7;
          font-size: 17px;
        }
        .contact-lines {
          display: grid;
          gap: 12px;
          margin-top: 22px;
        }
        .contact-lines a, .contact-lines div {
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 18px;
          padding: 16px;
          font-weight: 900;
        }
        .example-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        .example-card {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 30px;
          padding: 28px;
          box-shadow: 0 18px 48px rgba(7, 31, 58, .07);
        }
        .example-card small {
          display: inline-flex;
          background: #fff3e7;
          border: 1px solid #ffd5b6;
          color: #8c3a00;
          border-radius: 999px;
          padding: 7px 10px;
          font-weight: 900;
          margin-bottom: 16px;
        }
        .example-card strong {
          display: block;
          font-size: 22px;
          margin-bottom: 10px;
        }
        .example-card p {
          color: #647386;
          line-height: 1.65;
          margin: 0;
        }
        .faq {
          display: grid;
          gap: 12px;
          max-width: 980px;
          margin: 0 auto;
        }
        .faq-item {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 20px;
          padding: 20px 22px;
          display: grid;
          grid-template-columns: minmax(230px, .42fr) 1fr;
          gap: 22px;
          align-items: start;
        }
        .faq-item h3 {
          margin: 0;
          color: #071f3a;
          font-size: 18px;
          line-height: 1.28;
        }
        .faq-item p {
          margin: 0;
          color: #647386;
          line-height: 1.6;
        }
        .popular-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .popular-grid a {
          background: #fff;
          border: 1px solid #e8e3db;
          border-radius: 20px;
          padding: 18px;
          font-weight: 900;
          box-shadow: 0 12px 30px rgba(7,31,58,.06);
        }
        .popular-grid a:hover {
          border-color: #ff6a00;
          transform: translateY(-1px);
        }
        .final-cta {
          background: linear-gradient(135deg, #071f3a 0%, #123a67 100%);
          color: #fff;
          padding: 84px 0;
          text-align: center;
        }
        .final-cta h2 { color: #fff; }
        .final-cta p {
          color: #d7e3ef;
          font-size: 19px;
          line-height: 1.7;
          max-width: 760px;
          margin: 18px auto 0;
        }
        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }
        .footer {
          background: #061523;
          color: #cbd5e1;
          padding: 46px 0 56px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.15fr .8fr 1fr 1fr 1fr;
          gap: 28px;
        }
        .footer-logo {
          width: 225px;
          max-width: 100%;
          height: auto;
          background: #fff;
          border-radius: 16px;
          padding: 8px;
          object-fit: contain;
        }
        .footer h3 { color: #fff; margin: 0 0 12px; }
        .footer p {
          margin: 7px 0;
          color: #b8c3d0;
          line-height: 1.45;
        }
        .footer a:hover { color: #fff; }
        .whatsapp-float {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 80;
          background: #25d366;
          color: #fff;
          border-radius: 999px;
          padding: 15px 20px;
          font-weight: 900;
          box-shadow: 0 16px 40px rgba(37,211,102,.35);
        }
        .mobile-bottom-cta { display: none; }

        @media (max-width: 1160px) {
          .header-inner {
            grid-template-columns: auto auto;
          }
          .nav {
            grid-column: 1 / -1;
            justify-content: flex-start;
            overflow-x: auto;
            gap: 18px;
            padding: 0 0 14px;
            scrollbar-width: none;
          }
          .nav::-webkit-scrollbar { display: none; }
          .logo { width: 220px; }
          .hero-grid, .comparison-intro, .two-col {
            grid-template-columns: 1fr;
          }
          .proposal-visual {
            max-width: 680px;
            margin: 0 auto;
          }
          .trust-micro, .problem-grid, .steps {
            grid-template-columns: repeat(2, 1fr);
          }
          .popular-grid { grid-template-columns: repeat(3, 1fr); }
          .footer-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 760px) {
          .container { width: min(100% - 28px, 1240px); }
          .top-strip { display: none; }
          .header { position: relative; }
          .header-inner {
            display: flex;
            flex-wrap: wrap;
            min-height: auto;
            padding: 16px 0 0;
            gap: 12px;
          }
          .logo { width: 210px; }
          .header-actions {
            margin-left: auto;
          }
          .header-actions .btn-green,
          .header-actions .btn-blue {
            display: none;
          }
          .header-actions .btn-orange {
            padding: 12px 16px;
            font-size: 14px;
          }
          .nav {
            width: 100%;
            order: 3;
            border-top: 1px solid #f0eee9;
            padding: 13px 0 12px;
            font-size: 14px;
          }
          .hero-grid {
            padding: 40px 0 46px;
            gap: 32px;
          }
          .badge {
            width: 100%;
            justify-content: center;
            text-align: center;
            border-radius: 24px;
            line-height: 1.35;
          }
          h1 {
            font-size: clamp(40px, 12vw, 52px);
            line-height: 1.02;
            letter-spacing: -1.5px;
          }
          .hero-lead { font-size: 19px; line-height: 1.6; }
          .hero-cta-row .btn,
          .cta-buttons .btn {
            width: 100%;
          }
          .trust-micro,
          .problem-grid,
          .steps,
          .example-grid,
          .popular-grid,
          .footer-grid,
          .confidence-card,
          .form-benefits {
            grid-template-columns: 1fr;
          }
          .proposal-card,
          .form-card,
          .comparison-wrap,
          .premium-card,
          .dark-card {
            border-radius: 26px;
            padding: 22px;
          }
          .proposal-top {
            display: grid;
            min-height: 102px;
          }
          .amount-preview strong { font-size: 36px; }
          .form-title { font-size: 30px; }
          .form-actions { grid-template-columns: 1fr; }
          .section { padding: 64px 0; }
          .comparison-table { grid-template-columns: 1fr; }
          .comparison-table .head { text-align: left; }
          .comparison-table div {
            border-right: 0;
          }
          .faq-item {
            display: block;
          }
          .faq-item h3 {
            margin-bottom: 8px;
          }
          .popular-grid {
            display: flex;
            overflow-x: auto;
            gap: 13px;
            padding: 4px 2px 14px;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
          }
          .popular-grid::-webkit-scrollbar { display: none; }
          .popular-grid a {
            min-width: 76%;
            scroll-snap-align: start;
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
          .final-cta { padding-bottom: 118px; }
          .footer { padding-bottom: 112px; }
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
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-green">WhatsApp</a>
            <a href="tel:0612238051" className="btn btn-blue">Bel direct</a>
            <a href="#aanvraag" className="btn btn-orange">Start aanvraag</a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="badge">Discreet · Vrijblijvend · Persoonlijk verkoopvoorstel</div>
            <h1>Uw woning verkopen zonder bezichtigingen, makelaarskosten of onzekerheid?</h1>
            <p className="hero-lead">
              Ontvang een persoonlijk verkoopvoorstel van Vastgoed Direct Nederland.
              Vrijblijvend, duidelijk en afgestemd op uw woning, planning en situatie.
            </p>

            <div className="hero-cta-row">
              <a href="#aanvraag" className="btn btn-orange">Bekijk mijn verkoopmogelijkheden</a>
              <div>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-light">Eerst even overleggen</a>
                <p className="micro-note">🟢 Meestal snel reactie via WhatsApp</p>
              </div>
            </div>

            <div className="trust-micro" aria-label="Voordelen">
              <div>✓ Gratis aanvraag</div>
              <div>✓ Geen verplichting</div>
              <div>✓ Discreet contact</div>
              <div>✓ Eén aanspreekpunt</div>
            </div>
          </div>

          <div className="proposal-visual">
            <div className="proposal-card">
              <div className="proposal-card-inner">
                <div className="proposal-top">
                  <div>
                    <span>Wat u ontvangt</span>
                    <strong>Persoonlijk verkoopvoorstel</strong>
                  </div>
                  <div className="proposal-pill">Binnenkort besproken</div>
                </div>

                <div className="amount-preview">
                  <small>Voorbeeld voorstelkaart</small>
                  <strong>Helder bedrag</strong>
                  <small>met voorwaarden, planning en vervolgstappen</small>
                </div>

                <div className="proposal-list">
                  <div><span>✓</span> Indicatie verkoopmogelijkheid</div>
                  <div><span>✓</span> Duidelijke voorwaarden vooraf</div>
                  <div><span>✓</span> Mogelijke overdrachtsdatum</div>
                  <div><span>✓</span> Vrijblijvend persoonlijk contact</div>
                </div>
              </div>
            </div>

            <div className="confidence-card">
              <div>
                <strong>06 12 23 80 51</strong>
                <span>Rechtstreeks contact met Vastgoed Direct Nederland</span>
              </div>
              <div>
                <strong>Geen open huis</strong>
                <span>Verkooproute zonder standaard bezichtigingsdruk</span>
              </div>
            </div>
          </div>

          <section id="aanvraag" className="form-card">
            <div className="form-logo-wrap">
              <img src="/logo.png" alt="Vastgoed Direct Nederland" className="form-logo" />
            </div>

            {!submitted ? (
              <form onSubmit={submitLead}>
                <div className="form-benefits">
                  <span>1 minuut</span>
                  <span>Gratis</span>
                  <span>Vrijblijvend</span>
                </div>

                <p className="step-label">Stap {step} van 4</p>
                <h2 className="form-title">Ontvang een persoonlijk verkoopvoorstel</h2>
                <p className="form-sub">
                  Vul uw gegevens in. Wij nemen persoonlijk contact met u op om uw situatie rustig te bespreken.
                </p>
                <div className="notice">Uw aanvraag is discreet, gratis en verplicht u tot niets.</div>

                {step === 1 && (
                  <div className="form-stack">
                    <input name="postcode" value={form.postcode} onChange={updateForm} placeholder="Postcode" className="field" required />
                    <input name="huisnummer" value={form.huisnummer} onChange={updateForm} placeholder="Huisnummer" className="field" required />
                    <button type="button" onClick={nextStep} className="btn btn-blue">Start mijn vrijblijvende aanvraag</button>
                  </div>
                )}

                {step === 2 && (
                  <div className="form-stack">
                    <select name="woningtype" value={form.woningtype} onChange={updateForm} className="field" required>
                      <option value="">Type woning</option>
                      <option>Appartement</option>
                      <option>Rijtjeshuis</option>
                      <option>Twee-onder-een-kap</option>
                      <option>Vrijstaande woning</option>
                      <option>Beleggingspand</option>
                      <option>Verhuurde woning</option>
                    </select>
                    <select name="staat" value={form.staat} onChange={updateForm} className="field" required>
                      <option value="">Staat van de woning</option>
                      <option>Goed onderhouden</option>
                      <option>Normaal bewoond</option>
                      <option>Renovatie nodig</option>
                      <option>Slechte staat / schade</option>
                    </select>
                    <div className="form-actions">
                      <button type="button" onClick={previousStep} className="btn btn-light">Terug</button>
                      <button type="button" onClick={nextStep} className="btn btn-blue">Volgende stap</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="form-stack">
                    <select name="reden" value={form.reden} onChange={updateForm} className="field" required>
                      <option value="">Reden van verkoop</option>
                      <option>Snel verkopen</option>
                      <option>Erfenis</option>
                      <option>Scheiding</option>
                      <option>Financiële situatie</option>
                      <option>Verhuurde woning verkopen</option>
                      <option>Leegstand</option>
                      <option>Anders</option>
                    </select>
                    <div className="form-actions">
                      <button type="button" onClick={previousStep} className="btn btn-light">Terug</button>
                      <button type="button" onClick={nextStep} className="btn btn-blue">Naar contactgegevens</button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="form-stack">
                    <input name="naam" value={form.naam} onChange={updateForm} placeholder="Naam" className="field" required />
                    <input name="email" value={form.email} onChange={updateForm} placeholder="E-mail" type="email" className="field" required />
                    <input name="telefoon" value={form.telefoon} onChange={updateForm} placeholder="Telefoonnummer" className="field" required />
                    <div className="form-actions">
                      <button type="button" onClick={previousStep} className="btn btn-light">Terug</button>
                      <button type="submit" className="btn btn-orange">Verkoopmogelijkheden aanvragen</button>
                    </div>
                    <p className="small-note">Wij gebruiken uw gegevens alleen om contact op te nemen over uw aanvraag.</p>
                  </div>
                )}
              </form>
            ) : (
              <div className="success">
                <div className="success-icon">✓</div>
                <h2 className="form-title">Aanvraag ontvangen</h2>
                <p className="form-sub">Wij nemen zo snel mogelijk persoonlijk contact met u op.</p>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-green">Aanvullen via WhatsApp</a>
              </div>
            )}
          </section>
        </div>
      </section>

      <section id="wanneer" className="section section-white">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Wanneer past dit bij u?</p>
            <h2>Voor verkopers die vooral rust en duidelijkheid willen.</h2>
            <p>
              Een traditioneel verkooptraject is niet altijd de beste route. Zeker niet als privacy, snelheid,
              onderhoud of persoonlijke omstandigheden meespelen.
            </p>
          </div>

          <div className="problem-grid">
            {situations.map((item) => (
              <article className="problem-card" key={item.title}>
                <div className="problem-icon">✓</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="vergelijking" className="section">
        <div className="container comparison-wrap">
          <div className="comparison-intro">
            <div>
              <p className="eyebrow">Waarom direct verkopen?</p>
              <h2>Niet alleen de prijs telt. Ook rust, tijd en zekerheid.</h2>
            </div>
            <p>
              Bij woningverkoop kijkt u niet alleen naar een verkoopbedrag, maar ook naar verkoopkosten,
              voorbereiding, bezichtigingen, onzekerheid en doorlooptijd. Dit overzicht maakt het verschil zichtbaar.
            </p>
          </div>

          <div className="comparison-table">
            <div className="head">Onderdeel</div>
            <div className="head">Traditioneel verkopen</div>
            <div className="head orange">Via Vastgoed Direct Nederland</div>

            {comparisonRows.map(([label, normal, direct]) => (
              <React.Fragment key={label}>
                <div className="label-cell">{label}</div>
                <div>{normal}</div>
                <div className="direct-cell">{direct}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section id="werkwijze" className="section section-white">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">De werkwijze</p>
            <h2>Van aanvraag naar duidelijk voorstel.</h2>
            <p>Een overzichtelijk proces zonder onnodige druk. U bepaalt daarna zelf of het voorstel past.</p>
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

          <div style={{ textAlign: "center", marginTop: 38 }}>
            <a href="#aanvraag" className="btn btn-orange">Ontvang mijn persoonlijke voorstel</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div className="premium-card">
            <p className="eyebrow">Wat krijgt u concreet?</p>
            <h2>Een voorstel dat u echt kunt beoordelen.</h2>
            <p>
              Het voorstel is niet alleen een bedrag. U krijgt inzicht in de uitgangspunten, voorwaarden,
              mogelijke overdrachtsdatum en vervolgstappen.
            </p>

            <div className="premium-list">
              <div><span>✓</span> Voorgesteld bedrag of verkoopmogelijkheid</div>
              <div><span>✓</span> Duidelijke uitgangspunten en voorbehouden</div>
              <div><span>✓</span> Mogelijke overdracht en planning</div>
              <div><span>✓</span> Overzicht van wat wel en niet nodig is</div>
              <div><span>✓</span> Persoonlijk contact om vragen te bespreken</div>
            </div>
          </div>

          <div className="dark-card">
            <h3>Persoonlijk contact, geen callcenter.</h3>
            <p>
              U krijgt geen standaardreactie. Wij kijken naar uw woning, uw situatie en uw gewenste planning.
              Daarna bespreken we rustig wat mogelijk is.
            </p>
            <div className="contact-lines">
              <a href="tel:0612238051">Bel direct: 06 12 23 80 51</a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp: meestal snel reactie</a>
              <div>info@verkoopjehuisdirect.nl</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Voorbeeldsituaties</p>
            <h2>Herkenbare situaties waarin direct verkopen rust kan geven.</h2>
            <p>
              Onderstaande voorbeelden laten zien wanneer een verkoopvoorstel zonder traditioneel traject interessant kan zijn.
            </p>
          </div>

          <div className="example-grid">
            <article className="example-card">
              <small>Leegstand</small>
              <strong>Geen zin in maanden wachten</strong>
              <p>De eigenaar wil duidelijkheid over de mogelijkheden en liever geen lang traject met meerdere kijkmomenten.</p>
            </article>
            <article className="example-card">
              <small>Onderhoud</small>
              <strong>Niet eerst alles opknappen</strong>
              <p>De woning hoeft niet altijd volledig verkoopklaar gemaakt te worden voordat wij kunnen meedenken.</p>
            </article>
            <article className="example-card">
              <small>Privacy</small>
              <strong>Geen open huis of reeks bezichtigingen</strong>
              <p>Voor de verkoper is rust belangrijk. Daarom kijken we naar een discreet en overzichtelijk alternatief.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="over-ons" className="section">
        <div className="container two-col">
          <div>
            <p className="eyebrow">Over Vastgoed Direct Nederland</p>
            <h2>Een nuchtere verkooproute met duidelijke afspraken.</h2>
            <p className="hero-lead">
              Vastgoed Direct Nederland helpt woningeigenaren voor wie een traditioneel verkooptraject niet altijd past.
              Denk aan achterstallig onderhoud, leegstand, verhuur, erfenis, scheiding, financiële druk of een woning die lastig verkoopklaar te maken is.
            </p>
            <p className="hero-lead">
              Onze werkwijze is rustig en helder. U ontvangt geen standaardverhaal, maar een verkoopoplossing die past bij uw situatie.
            </p>
          </div>

          <div className="premium-card">
            <h3>Waar wij op letten</h3>
            <div className="premium-list">
              <div><span>✓</span> Uw gewenste snelheid</div>
              <div><span>✓</span> De staat en ligging van de woning</div>
              <div><span>✓</span> Juridische en notariële haalbaarheid</div>
              <div><span>✓</span> Privacy en persoonlijke omstandigheden</div>
              <div><span>✓</span> Een duidelijke overdrachtsdatum</div>
              <div><span>✓</span> Heldere voorwaarden vooraf</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Populaire onderwerpen</p>
            <h2>Meer informatie over uw situatie</h2>
            <p>Bekijk welke verkooproute het beste aansluit op uw woning of regio.</p>
          </div>

          <div className="popular-grid">
            {popularLinks.map(([href, label]) => (
              <a href={href} key={href}>✓ {label}</a>
            ))}
          </div>
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
              <h3>Moet mijn woning verkoopklaar zijn?</h3>
              <p>Nee, niet altijd. Ook woningen met onderhoud, schade of renovatiebehoefte kunnen worden aangemeld.</p>
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
            <div className="faq-item">
              <h3>Voor welke regio’s kan ik een aanvraag doen?</h3>
              <p>U kunt een aanvraag doen voor woningen in Nederland. De focus ligt vooral op Groningen, Drenthe, Friesland en Overijssel.</p>
            </div>
            <div className="faq-item">
              <h3>Wanneer krijg ik duidelijkheid?</h3>
              <p>Na uw aanvraag nemen wij persoonlijk contact op. Daarna kunnen wij beoordelen welke verkoopmogelijkheden passend zijn.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <h2>Wilt u weten wat er mogelijk is voor uw woning?</h2>
          <p>
            Vraag gratis een persoonlijk verkoopvoorstel aan. Discreet, vrijblijvend en zonder traditioneel verkooptraject.
          </p>
          <div className="cta-buttons">
            <a href="#aanvraag" className="btn btn-orange">Bekijk mijn verkoopmogelijkheden</a>
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
            <p>Voor woningeigenaren die snel duidelijkheid willen.</p>
          </div>

          <div>
            <h3>Contact</h3>
            <p>info@verkoopjehuisdirect.nl</p>
            <p>06 12 23 80 51</p>
            <p><a href="tel:0612238051">Bel direct</a></p>
          </div>

          <div>
            <h3>Diensten</h3>
            <p><a href="/huis-direct-verkopen">Huis direct verkopen</a></p>
            <p><a href="/huis-snel-verkopen">Huis snel verkopen</a></p>
            <p><a href="/woning-verkopen-zonder-makelaar">Zonder makelaar verkopen</a></p>
            <p><a href="/huis-verkopen-zonder-bezichtigingen">Zonder bezichtigingen verkopen</a></p>
          </div>

          <div>
            <h3>Situaties</h3>
            <p><a href="/opknapwoning-verkopen">Opknapwoning verkopen</a></p>
            <p><a href="/huis-verkopen-bij-erfenis">Huis verkopen bij erfenis</a></p>
            <p><a href="/verhuurde-woning-verkopen">Verhuurde woning verkopen</a></p>
            <p><a href="/leegstaand-huis-verkopen">Leegstaand huis verkopen</a></p>
          </div>

          <div>
            <h3>Regio's</h3>
            <p><a href="/huis-verkopen-groningen">Groningen</a></p>
            <p><a href="/woning-verkopen-friesland">Friesland</a></p>
            <p><a href="/woning-verkopen-drenthe">Drenthe</a></p>
            <p><a href="/woning-verkopen-overijssel">Overijssel</a></p>
            <p><a href="/privacyverklaring">Privacyverklaring</a></p>
            <p>© 2026 Vastgoed Direct Nederland</p>
          </div>
        </div>
      </footer>

      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-float">WhatsApp</a>

      <div className="mobile-bottom-cta">
        <a href="#aanvraag" className="btn btn-orange">Vrijblijvend voorstel</a>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-green">WhatsApp</a>
      </div>
    </main>
  );
}
