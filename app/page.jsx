"use client";
import React, { useState } from "react";

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

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((current) => Math.min(current + 1, 4));
  const previousStep = () => setStep((current) => Math.max(current - 1, 1));

  const submitLead = async (e) => {
    e.preventDefault();

    // Later koppelen aan Supabase / backend.
    console.log("Nieuwe lead:", form);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold">
              VD
            </div>
            <div>
              <p className="font-bold leading-tight">Vastgoed Direct Nederland</p>
              <p className="text-xs text-slate-500">verkoopjehuisdirect.nl</p>
            </div>
          </div>
          <a href="tel:+31000000000" className="hidden md:inline-flex bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-800">
            Bel direct
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-800 via-blue-700 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="inline-flex bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
              Gratis en vrijblijvend bod binnen 24 uur
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Verkoop je huis direct, zonder gedoe.
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Wij kopen woningen in alle condities: verhuurd, beschadigd, verouderd, leegstaand of met achterstallig onderhoud.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-2xl p-4">Geen makelaar nodig</div>
              <div className="bg-white/10 rounded-2xl p-4">Geen verborgen kosten</div>
              <div className="bg-white/10 rounded-2xl p-4">Snelle afhandeling</div>
            </div>
          </div>

          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl p-6 md:p-8">
            {!submitted ? (
              <form onSubmit={submitLead}>
                <div className="mb-6">
                  <p className="text-sm text-blue-700 font-semibold">Stap {step} van 4</p>
                  <h2 className="text-2xl font-bold">Ontvang een gratis bod</h2>
                </div>

                {step === 1 && (
                  <div className="space-y-4">
                    <input name="postcode" value={form.postcode} onChange={updateForm} placeholder="Postcode" className="w-full border border-slate-300 rounded-xl px-4 py-3" required />
                    <input name="huisnummer" value={form.huisnummer} onChange={updateForm} placeholder="Huisnummer" className="w-full border border-slate-300 rounded-xl px-4 py-3" required />
                    <button type="button" onClick={nextStep} className="w-full bg-blue-700 text-white rounded-xl py-3 font-semibold hover:bg-blue-800">Volgende</button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <select name="woningtype" value={form.woningtype} onChange={updateForm} className="w-full border border-slate-300 rounded-xl px-4 py-3" required>
                      <option value="">Type woning</option>
                      <option>Appartement</option>
                      <option>Rijtjeshuis</option>
                      <option>Twee-onder-een-kap</option>
                      <option>Vrijstaande woning</option>
                      <option>Beleggingspand</option>
                    </select>
                    <select name="staat" value={form.staat} onChange={updateForm} className="w-full border border-slate-300 rounded-xl px-4 py-3" required>
                      <option value="">Staat van de woning</option>
                      <option>Goed onderhouden</option>
                      <option>Normaal bewoond</option>
                      <option>Renovatie nodig</option>
                      <option>Slechte staat / schade</option>
                    </select>
                    <div className="flex gap-3">
                      <button type="button" onClick={previousStep} className="w-1/3 border border-slate-300 rounded-xl py-3">Terug</button>
                      <button type="button" onClick={nextStep} className="w-2/3 bg-blue-700 text-white rounded-xl py-3 font-semibold hover:bg-blue-800">Volgende</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <select name="reden" value={form.reden} onChange={updateForm} className="w-full border border-slate-300 rounded-xl px-4 py-3" required>
                      <option value="">Reden van verkoop</option>
                      <option>Snel verkopen</option>
                      <option>Erfenis</option>
                      <option>Scheiding</option>
                      <option>Financiële situatie</option>
                      <option>Verhuurde woning verkopen</option>
                      <option>Anders</option>
                    </select>
                    <div className="flex gap-3">
                      <button type="button" onClick={previousStep} className="w-1/3 border border-slate-300 rounded-xl py-3">Terug</button>
                      <button type="button" onClick={nextStep} className="w-2/3 bg-blue-700 text-white rounded-xl py-3 font-semibold hover:bg-blue-800">Volgende</button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <input name="naam" value={form.naam} onChange={updateForm} placeholder="Naam" className="w-full border border-slate-300 rounded-xl px-4 py-3" required />
                    <input name="email" value={form.email} onChange={updateForm} placeholder="E-mail" type="email" className="w-full border border-slate-300 rounded-xl px-4 py-3" required />
                    <input name="telefoon" value={form.telefoon} onChange={updateForm} placeholder="Telefoonnummer" className="w-full border border-slate-300 rounded-xl px-4 py-3" required />
                    <div className="flex gap-3">
                      <button type="button" onClick={previousStep} className="w-1/3 border border-slate-300 rounded-xl py-3">Terug</button>
                      <button type="submit" className="w-2/3 bg-orange-500 text-white rounded-xl py-3 font-bold hover:bg-orange-600">Aanvraag versturen</button>
                    </div>
                    <p className="text-xs text-slate-500">Door te verzenden ga je akkoord dat wij contact opnemen over je aanvraag.</p>
                  </div>
                )}
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-bold mb-2">Aanvraag ontvangen</h2>
                <p className="text-slate-600">Wij nemen zo snel mogelijk contact met je op voor een vrijblijvend bod.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <h3 className="font-bold text-xl mb-2">Binnen 24 uur bod</h3>
          <p className="text-slate-600">Snel duidelijkheid zonder lange verkooptrajecten.</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <h3 className="font-bold text-xl mb-2">Elke woningconditie</h3>
          <p className="text-slate-600">Ook woningen met schade, huurders of renovatieproblemen.</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <h3 className="font-bold text-xl mb-2">Geen verkoopkosten</h3>
          <p className="text-slate-600">Geen makelaar, geen advertentiekosten en geen verplichtingen.</p>
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-10">Hoe werkt het?</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {["Aanvraag", "Woninganalyse", "Vrijblijvend bod", "Akkoord", "Notaris"].map((item, index) => (
              <div key={item} className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center">
                <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">{index + 1}</div>
                <p className="font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Wij kopen onder andere</h2>
        <div className="grid md:grid-cols-4 gap-5">
          {["Opknapwoningen", "Verhuurde woningen", "Erfeniswoningen", "Woningen met schade", "Leegstaande huizen", "Beleggingspanden", "Appartementen", "Huizen zonder makelaar"].map((service) => (
            <div key={service} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm font-semibold">{service}</div>
          ))}
        </div>
      </section>

      <section className="bg-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Wil je snel weten wat jouw woning waard is?</h2>
          <p className="text-blue-100 mb-8">Start de gratis aanvraag en ontvang snel een vrijblijvend voorstel.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold">
            Gratis bod aanvragen
          </button>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-300 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4 text-sm">
          <p>© 2026 Vastgoed Direct Nederland</p>
          <p>verkoopjehuisdirect.nl · info@verkoopjehuisdirect.nl</p>
        </div>
      </footer>
    </main>
  );
}
