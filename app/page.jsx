"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://izoysowkxttkwggazgfl.supabase.co",
  "sb_publishable__e7ilYxa3-a_aWyoCvrTow_dkqk105H"
);

export default function VerkoopJeHuisDirect() {
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

    const { error } = await supabase.from("leads").insert([
      {
        naam: form.naam,
        telefoon: form.telefoon,
        postcode: form.postcode,
        huisnummer: form.huisnummer,
      },
    ]);

    if (error) {
      alert("Er ging iets mis. Probeer opnieuw.");
      console.error(error);
      return;
    }

    setSubmitted(true);
  };

  return (
    <main>
      <style jsx global>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0a2540; background: #f7f5f0; }
        a { color: inherit; text-decoration: none; }
        .container { width: min(1180px, calc(100% - 40px)); margin: 0 auto; }
        .header { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,.96); border-bottom: 1px solid #e6e2db; }
        .header-inner { min-height: 82px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .logo { display: block; width: 210px; max-width: 100%; height: auto; object-fit: contain; }
        .nav { display: flex; align-items: center; gap: 28px; font-size: 15px; font-weight: 700; color: #24364a; }
        .nav a:hover { color: #ff6a00; }
        .header-actions { display: flex; align-items: center; gap: 10px; }
        .btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; padding: 14px 22px; font-weight: 900; border: none; cursor: pointer; font-size: 15px; transition: .2s ease; white-space: nowrap; }
        .btn-orange { background: #ff6a00; color: #fff; box-shadow: 0 10px 24px rgba(255,106,0,.25); }
        .btn-orange:hover { background: #e85f00; transform: translateY(-1px); }
        .btn-blue { background: #0a2540; color: #fff; }
        .btn-blue:hover { background: #12395d; }
        .btn-green { background: #25d366; color: #fff; }
        .btn-light { background: #fff; color: #0a2540; border: 1px solid #d8d4cc; }
        .hero { background: radial-gradient(circle at 85% 10%, rgba(255,106,0,.13), transparent 32%), radial-gradient(circle at 10% 90%, rgba(10,37,64,.14), transparent 35%), #fff; }
        .hero-grid { display: grid; grid-template-columns: 1.05fr .95fr; gap: 54px; align-items: center; padding: 72px 0; }
        .badge { display: inline-flex; color: #ff6a00; background: #fff2e8; border: 1px solid #ffd5b8; border-radius: 999px; padding: 10px 16px; font-size: 14px; font-weight: 900; margin-bottom: 22px; }
        h1 { font-size: clamp(42px, 5.5vw, 72px); line-height: .98; letter-spacing: -2px; margin: 0; color: #0a2540; }
        .lead { font-size: 20px; line-height: 1.7; color: #536273; max-width: 680px; margin: 26px 0 0; }
        .trust-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 32px 0; }
        .trust-card { background: #fff; border: 1px solid #e6e2db; border-radius: 20px; padding: 18px; font-weight: 900; box-shadow: 0 8px 22px rgba(10,37,64,.06); }
        .hero-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
        .form-card { background: #fff; border: 1px solid #e6e2db; border-radius: 34px; box-shadow: 0 28px 70px rgba(10,37,64,.16); padding: 32px; }
        .form-logo-wrap { display: flex; justify-content: center; padding-bottom: 22px; margin-bottom: 24px; border-bottom: 1px solid #eee9e2; }
        .form-logo { width: 245px; max-width: 100%; height: auto; display: block; object-fit: contain; }
        .step-label { margin: 0; color: #ff6a00; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; font-size: 13px; }
        .form-title { margin: 6px 0 8px; font-size: 32px; line-height: 1.1; color: #0a2540; }
        .form-sub { margin: 0 0 18px; color: #687789; }
        .notice { background: #fff7ed; border: 1px solid #fed7aa; color: #9a3412; padding: 12px 14px; border-radius: 16px; font-weight: 800; margin-bottom: 18px; }
        .field { width: 100%; border: 1px solid #d9d5ce; background: #faf9f6; border-radius: 18px; padding: 16px 18px; font-size: 16px; outline: none; }
        .field:focus { border-color: #0a2540; background: #fff; }
        .form-stack { display: grid; gap: 14px; }
        .form-actions { display: grid; grid-template-columns: 1fr 2fr; gap: 10px; }
        .small-note { font-size: 12px; color: #798698; margin: 4px 0 0; }
        .bar { background: #0a2540; color: #fff; }
        .bar-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 34px 0; text-align: center; font-size: 18px; font-weight: 900; }
        .section { padding: 86px 0; }
        .section-white { background: #fff; }
        .section-head { max-width: 760px; margin: 0 auto 44px; text-align: center; }
        .eyebrow { color: #ff6a00; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; margin: 0 0 10px; }
        h2 { font-size: clamp(34px, 4vw, 54px); line-height: 1.05; letter-spacing: -1px; margin: 0; color: #0a2540; }
        .section-head p { color: #647386; font-size: 18px; line-height: 1.7; }
        .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .card { background: #fff; border: 1px solid #e6e2db; border-radius: 30px; padding: 30px; box-shadow: 0 18px 44px rgba(10,37,64,.08); }
        .number { width: 56px; height: 56px; border-radius: 18px; background: #ff6a00; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; margin-bottom: 22px; }
        .card h3 { margin: 0 0 12px; font-size: 25px; color: #0a2540; }
        .card p { margin: 0; color: #647386; line-height: 1.7; }
        .center-cta { text-align: center; margin-top: 42px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; align-items: center; }
        .checks { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-top: 28px; }
        .check { background: #f7f5f0; border-radius: 18px; padding: 18px; font-weight: 900; }
        .dark-box { background: #0a2540; color: #fff; border-radius: 38px; padding: 38px; box-shadow: 0 20px 60px rgba(10,37,64,.18); }
        .dark-box h3 { font-size: 34px; margin: 0 0 22px; color: #fff; }
        .property-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 13px; }
        .property { background: rgba(255,255,255,.1); border-radius: 18px; padding: 16px; font-weight: 800; }
        .faq { display: grid; gap: 14px; max-width: 900px; margin: 0 auto; }
        .faq-item { background: #fff; border: 1px solid #e6e2db; border-radius: 24px; padding: 24px; }
        .faq-item h3 { margin: 0 0 8px; color: #0a2540; font-size: 20px; }
        .faq-item p { margin: 0; color: #647386; line-height: 1.7; }
        .cta { background: #0a2540; color: #fff; text-align: center; padding: 84px 0; }
        .cta h2 { color: #fff; }
        .cta p { color: #c7d2df; font-size: 19px; line-height: 1.7; }
        .cta-buttons { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
        .footer { background: #071827; color: #cbd5e1; padding: 46px 0; }
        .footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 34px; }
        .footer-logo { width: 220px; max-width: 100%; height: auto; background: #fff; border-radius: 14px; padding: 8px; object-fit: contain; }
        .footer h3 { color: #fff; margin: 0 0 12px; }
        .footer p { margin: 6px 0; color: #b8c3d0; }
        .whatsapp-float { position: fixed; right: 22px; bottom: 22px; z-index: 60; background: #25d366; color: #fff; border-radius: 999px; padding: 16px 22px; font-weight: 900; box-shadow: 0 16px 40px rgba(37,211,102,.35); }
        .success { text-align: center; padding: 34px 10px; }
        .success-icon { width: 66px; height: 66px; border-radius: 50%; background: #dcfce7; color: #15803d; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 34px; font-weight: 900; }
        @media (max-width: 980px) {
          .nav { display: none; }
          .hero-grid, .two-col { grid-template-columns: 1fr; }
          .trust-row, .steps, .bar-grid { grid-template-columns: 1fr; }
          .header-inner { height: auto; padding: 12px 0; }
          .logo { width: 175px; }
        }
        @media (max-width: 560px) {
          .container { width: min(100% - 28px, 1180px); }
          .header-actions .btn-green { display: none; }
          .hero-grid { padding: 42px 0; }
          .form-card { padding: 22px; border-radius: 26px; }
          .form-actions { grid-template-columns: 1fr; }
          .checks, .property-grid, .footer-grid { grid-template-columns: 1fr; }
          .footer-grid { gap: 24px; }
        }
      `}</style>

      <header className="header">
        <div className="container header-inner">
          <a href="/" aria-label="Vastgoed Direct Nederland">
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="logo" />
          </a>
          <nav className="nav">
            <a href="#werkwijze">Werkwijze</a>
            <a href="#voordelen">Voordelen</a>
            <a href="#faq">FAQ</a>
            <a href="tel:0681158003">06 81 15 80 03</a>
          </nav>
          <div className="header-actions">
            <a href="https://wa.me/31681158003?text=Hallo%2C%20ik%20wil%20graag%20mijn%20woning%20direct%20verkopen.%20Kunt%20u%20contact%20met%20mij%20opnemen%3F" target="_blank" rel="noopener noreferrer" className="btn btn-green">WhatsApp</a>
            <a href="#aanvraag" className="btn btn-orange">Gratis bod</a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="badge">Binnen 24 uur reactie · Gratis en vrijblijvend</div>
            <h1>Verkoop uw woning snel, zeker en zonder gedoe.</h1>
            <p className="lead">Vastgoed Direct Nederland koopt woningen in elke staat. Geen makelaar, geen eindeloze bezichtigingen en snel duidelijkheid over uw verkoopmogelijkheden.</p>
            <div className="trust-row">
              <div className="trust-card">⭐ 4.8/5 klanttevredenheid</div>
              <div className="trust-card">⚡ Binnen 24 uur reactie</div>
              <div className="trust-card">✓ Gratis en vrijblijvend</div>
            </div>
            <div className="hero-buttons">
              <a href="#aanvraag" className="btn btn-orange">Ontvang gratis bod</a>
              <a href="https://wa.me/31681158003?text=Hallo%2C%20ik%20wil%20graag%20mijn%20woning%20direct%20verkopen.%20Kunt%20u%20contact%20met%20mij%20opnemen%3F" target="_blank" rel="noopener noreferrer" className="btn btn-light">Direct WhatsApp gesprek</a>
            </div>
          </div>

          <section id="aanvraag" className="form-card">
            <div className="form-logo-wrap">
              <img src="/logo.png" alt="Vastgoed Direct Nederland" className="form-logo" />
            </div>
            {!submitted ? (
              <form onSubmit={submitLead}>
                <p className="step-label">Stap {step} van 4</p>
                <h2 className="form-title">Gratis verkoopvoorstel</h2>
                <p className="form-sub">Vul uw gegevens in. Wij nemen snel contact met u op.</p>
                <div className="notice">Gemiddeld binnen dezelfde dag reactie.</div>

                {step === 1 && (
                  <div className="form-stack">
                    <input name="postcode" value={form.postcode} onChange={updateForm} placeholder="Postcode" className="field" required />
                    <input name="huisnummer" value={form.huisnummer} onChange={updateForm} placeholder="Huisnummer" className="field" required />
                    <button type="button" onClick={nextStep} className="btn btn-blue">Volgende</button>
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
                      <button type="button" onClick={nextStep} className="btn btn-blue">Volgende</button>
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
                      <option>Anders</option>
                    </select>
                    <div className="form-actions">
                      <button type="button" onClick={previousStep} className="btn btn-light">Terug</button>
                      <button type="button" onClick={nextStep} className="btn btn-blue">Volgende</button>
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
                      <button type="submit" className="btn btn-orange">Aanvraag versturen</button>
                    </div>
                    <p className="small-note">Wij nemen contact op over uw vrijblijvende aanvraag.</p>
                  </div>
                )}
              </form>
            ) : (
              <div className="success">
                <div className="success-icon">✓</div>
                <h2 className="form-title">Aanvraag ontvangen</h2>
                <p className="form-sub">Wij nemen zo snel mogelijk contact met u op.</p>
              </div>
            )}
          </section>
        </div>
      </section>

      <section className="bar">
        <div className="container bar-grid">
          <div>Binnen 24 uur reactie</div>
          <div>Geen makelaarskosten</div>
          <div>Ook slechte staat</div>
          <div>Vrijblijvend voorstel</div>
        </div>
      </section>

      <section id="werkwijze" className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Simpel proces</p>
            <h2>Zo werkt direct verkopen</h2>
            <p>Geen lange verkooptrajecten, geen open huizen en geen onzekerheid over kopers.</p>
          </div>
          <div className="steps">
            {[["1", "Aanvraag", "U laat kort uw woninggegevens en contactgegevens achter."], ["2", "Contact", "Wij bespreken uw situatie en beoordelen uw woning."], ["3", "Voorstel", "U ontvangt een vrijblijvend voorstel en beslist zelf."]].map(([num, title, text]) => (
              <div key={title} className="card">
                <div className="number">{num}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className="center-cta">
            <a href="#aanvraag" className="btn btn-orange">Ontvang direct een bod</a>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Vertrouwen</p>
            <h2>Waarom verkopers voor ons kiezen</h2>
            <p>Een woning verkopen is persoonlijk. Daarom houden we het duidelijk, snel en zonder verplichtingen.</p>
          </div>
          <div className="steps">
            <div className="card"><div className="number">✓</div><h3>Geen verborgen kosten</h3><p>U betaalt geen makelaarskosten of advertentiekosten voor uw aanvraag.</p></div>
            <div className="card"><div className="number">✓</div><h3>Ook lastige situaties</h3><p>Erfenis, verhuur, schade of achterstallig onderhoud: we denken graag mee.</p></div>
            <div className="card"><div className="number">✓</div><h3>Snel duidelijkheid</h3><p>Geen maanden wachten op kopers, maar snel weten waar u aan toe bent.</p></div>
          </div>
        </div>
      </section>

      <section id="voordelen" className="section section-white">
        <div className="container two-col">
          <div>
            <p className="eyebrow">Waarom direct verkopen?</p>
            <h2>Rust, snelheid en duidelijkheid.</h2>
            <p className="lead">Soms wilt u niet maanden wachten op een koper. Wij helpen eigenaren die snel willen schakelen en zonder traditionele verkoopstress duidelijkheid willen.</p>
            <div className="checks">
              {["Geen verkoopstyling nodig", "Geen open huis", "Ook verhuurde woningen", "Direct contact"].map((item) => <div key={item} className="check">✓ {item}</div>)}
            </div>
          </div>
          <div className="dark-box">
            <h3>Wij kopen onder andere</h3>
            <div className="property-grid">
              {["Opknapwoningen", "Erfeniswoningen", "Woningen met schade", "Leegstaande huizen", "Beleggingspanden", "Appartementen"].map((item) => <div key={item} className="property">✓ {item}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">FAQ</p>
            <h2>Veelgestelde vragen</h2>
          </div>
          <div className="faq">
            {[["Is de aanvraag gratis?", "Ja, de aanvraag is volledig gratis en vrijblijvend."], ["Kopen jullie ook huizen in slechte staat?", "Ja, ook woningen met schade, achterstallig onderhoud of renovatiebehoefte."], ["Heb ik een makelaar nodig?", "Nee, u kunt rechtstreeks een aanvraag doen via de website."], ["Hoe snel nemen jullie contact op?", "Wij proberen zo snel mogelijk te reageren, vaak dezelfde dag."]].map(([q, a]) => (
              <div key={q} className="faq-item"><h3>{q}</h3><p>{a}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Wilt u snel duidelijkheid?</h2>
          <p>Vraag gratis een bod aan of stuur direct een WhatsApp bericht.</p>
          <div className="cta-buttons">
            <a href="#aanvraag" className="btn btn-orange">Gratis bod aanvragen</a>
            <a href="https://wa.me/31681158003?text=Hallo%2C%20ik%20wil%20graag%20mijn%20woning%20direct%20verkopen.%20Kunt%20u%20contact%20met%20mij%20opnemen%3F" target="_blank" rel="noopener noreferrer" className="btn btn-green">Direct WhatsApp gesprek</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="footer-logo" />
            <p>Vastgoed Direct Nederland helpt woningeigenaren met snelle en duidelijke verkoopmogelijkheden.</p>
          </div>
          <div>
            <h3>Contact</h3>
            <p>info@verkoopjehuisdirect.nl</p>
            <p>06 81 15 80 03</p>
          </div>
          <div>
            <h3>Website</h3>
            <p>verkoopjehuisdirect.nl</p>
            <p>© 2026 Vastgoed Direct Nederland</p>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/31681158003?text=Hallo%2C%20ik%20wil%20graag%20mijn%20woning%20direct%20verkopen.%20Kunt%20u%20contact%20met%20mij%20opnemen%3F" target="_blank" rel="noopener noreferrer" className="whatsapp-float">WhatsApp</a>
    </main>
  );
}
