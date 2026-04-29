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

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="h-14 w-auto rounded-xl" />
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <a href="mailto:info@verkoopjehuisdirect.nl" className="font-semibold text-slate-700 hover:text-blue-800">info@verkoopjehuisdirect.nl</a>
            <a href="tel:0681158003" className="font-semibold text-slate-700 hover:text-blue-800">📞 06 81 15 80 03</a>
            <a href="https://wa.me/31681158003" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-green-500 px-5 py-3 font-bold text-white shadow-lg hover:bg-green-600">WhatsApp</a>
            <a href="#aanvraag" className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg hover:bg-orange-600">Gratis bod</a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-slate-950 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="mb-8 w-full max-w-xl rounded-3xl bg-white/95 p-4 shadow-2xl" />
            <div className="mb-6 inline-flex rounded-full border border-orange-300/40 bg-orange-500 px-4 py-2 text-sm font-black text-white shadow-lg">
              Binnen 24 uur een vrijblijvend bod
            </div>
            <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
              Verkoop uw huis direct — in elke staat.
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-8 text-blue-100">
              Ontvang snel duidelijkheid zonder makelaar, bezichtigingsstress of maanden wachten. Ook bij schade, verhuur, erfenis of achterstallig onderhoud.
            </p>
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 font-bold">✓ Geen makelaarskosten</div>
              <div className="rounded-2xl bg-white/10 p-4 font-bold">✓ Ook slechte staat</div>
              <div className="rounded-2xl bg-white/10 p-4 font-bold">✓ Snelle afwikkeling</div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#aanvraag" className="inline-flex justify-center rounded-2xl bg-orange-500 px-8 py-4 text-lg font-black text-white shadow-xl hover:bg-orange-600">
                Ontvang direct een bod
              </a>
              <a href="https://wa.me/31681158003" target="_blank" rel="noopener noreferrer" className="inline-flex justify-center rounded-2xl bg-green-500 px-8 py-4 text-lg font-black text-white shadow-xl hover:bg-green-600">
                WhatsApp direct
              </a>
            </div>
          </div>

          <section id="aanvraag" className="rounded-[2rem] border-4 border-orange-400 bg-white p-6 text-slate-900 shadow-2xl md:p-8">
            {!submitted ? (
              <form onSubmit={submitLead}>
                <div className="mb-6">
                  <p className="mb-2 text-sm font-black uppercase tracking-wide text-orange-500">Stap {step} van 4</p>
                  <h2 className="text-3xl font-black">Ontvang gratis bod</h2>
                  <p className="mt-2 text-slate-500">Laat uw gegevens achter. Wij nemen snel contact op.</p>
                </div>

                {step === 1 && (
                  <div className="space-y-4">
                    <input name="postcode" value={form.postcode} onChange={updateForm} placeholder="Postcode" className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-700" required />
                    <input name="huisnummer" value={form.huisnummer} onChange={updateForm} placeholder="Huisnummer" className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-blue-700" required />
                    <button type="button" onClick={nextStep} className="w-full rounded-xl bg-blue-800 py-4 font-black text-white shadow-lg hover:bg-blue-900">Volgende</button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <select name="woningtype" value={form.woningtype} onChange={updateForm} className="w-full rounded-xl border border-slate-300 px-4 py-4" required>
                      <option value="">Type woning</option>
                      <option>Appartement</option>
                      <option>Rijtjeshuis</option>
                      <option>Twee-onder-een-kap</option>
                      <option>Vrijstaande woning</option>
                      <option>Beleggingspand</option>
                    </select>
                    <select name="staat" value={form.staat} onChange={updateForm} className="w-full rounded-xl border border-slate-300 px-4 py-4" required>
                      <option value="">Staat van de woning</option>
                      <option>Goed onderhouden</option>
                      <option>Normaal bewoond</option>
                      <option>Renovatie nodig</option>
                      <option>Slechte staat / schade</option>
                    </select>
                    <div className="flex gap-3">
                      <button type="button" onClick={previousStep} className="w-1/3 rounded-xl border border-slate-300 py-4 font-bold">Terug</button>
                      <button type="button" onClick={nextStep} className="w-2/3 rounded-xl bg-blue-800 py-4 font-black text-white hover:bg-blue-900">Volgende</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <select name="reden" value={form.reden} onChange={updateForm} className="w-full rounded-xl border border-slate-300 px-4 py-4" required>
                      <option value="">Reden van verkoop</option>
                      <option>Snel verkopen</option>
                      <option>Erfenis</option>
                      <option>Scheiding</option>
                      <option>Financiële situatie</option>
                      <option>Verhuurde woning verkopen</option>
                      <option>Anders</option>
                    </select>
                    <div className="flex gap-3">
                      <button type="button" onClick={previousStep} className="w-1/3 rounded-xl border border-slate-300 py-4 font-bold">Terug</button>
                      <button type="button" onClick={nextStep} className="w-2/3 rounded-xl bg-blue-800 py-4 font-black text-white hover:bg-blue-900">Volgende</button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <input name="naam" value={form.naam} onChange={updateForm} placeholder="Naam" className="w-full rounded-xl border border-slate-300 px-4 py-4" required />
                    <input name="email" value={form.email} onChange={updateForm} placeholder="E-mail" type="email" className="w-full rounded-xl border border-slate-300 px-4 py-4" required />
                    <input name="telefoon" value={form.telefoon} onChange={updateForm} placeholder="Telefoonnummer" className="w-full rounded-xl border border-slate-300 px-4 py-4" required />
                    <div className="flex gap-3">
                      <button type="button" onClick={previousStep} className="w-1/3 rounded-xl border border-slate-300 py-4 font-bold">Terug</button>
                      <button type="submit" className="w-2/3 rounded-xl bg-orange-500 py-4 font-black text-white shadow-lg hover:bg-orange-600">Aanvraag versturen</button>
                    </div>
                    <p className="text-xs text-slate-500">We nemen zo snel mogelijk contact met je op over een vrijblijvend bod.</p>
                  </div>
                )}
              </form>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
                <h2 className="mb-2 text-3xl font-black">Aanvraag ontvangen</h2>
                <p className="text-slate-600">Wij nemen zo snel mogelijk contact met je op.</p>
              </div>
            )}
          </section>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200"><p className="text-3xl font-black text-blue-800">24 uur</p><p className="mt-2 font-bold">Gemiddeld snelle reactie</p></div>
        <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200"><p className="text-3xl font-black text-blue-800">0%</p><p className="mt-2 font-bold">Geen makelaarskosten</p></div>
        <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200"><p className="text-3xl font-black text-blue-800">Elke staat</p><p className="mt-2 font-bold">Ook renovatie of schade</p></div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 text-center text-4xl font-black">Hoe werkt het?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {["Vul je aanvraag in", "Wij beoordelen je woning", "Ontvang vrijblijvend bod"].map((title, index) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-800 text-xl font-black text-white">{index + 1}</div>
                <h3 className="mb-3 text-xl font-black">{title}</h3>
                <p className="text-slate-600">Snel, duidelijk en zonder verplichtingen.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-10 text-center text-4xl font-black">Wij kopen onder andere</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Opknapwoningen", "Verhuurde woningen", "Erfeniswoningen", "Woningen met schade", "Leegstaande huizen", "Beleggingspanden", "Appartementen", "Huizen zonder makelaar"].map((item) => (
            <div key={item} className="rounded-2xl bg-white p-5 font-bold shadow-md ring-1 ring-slate-200">✓ {item}</div>
          ))}
        </div>
      </section>

      <section className="bg-blue-950 px-6 py-16 text-center text-white">
        <h2 className="mb-4 text-4xl font-black">Wil je snel duidelijkheid?</h2>
        <p className="mb-8 text-blue-100">Start vandaag nog je gratis aanvraag.</p>
        <a href="#aanvraag" className="inline-flex rounded-2xl bg-orange-500 px-8 py-4 text-lg font-black text-white shadow-xl hover:bg-orange-600">Gratis bod aanvragen</a>
      </section>

      <footer className="bg-slate-950 px-6 py-8 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm md:flex-row">
          <p>© 2026 Vastgoed Direct Nederland</p>
          <p>info@verkoopjehuisdirect.nl · verkoopjehuisdirect.nl</p>
        </div>
      </footer>
    <a
        href="https://wa.me/31681158003"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-6 py-4 font-black text-white shadow-2xl hover:bg-green-600"
      >
        WhatsApp
      </a>
    </main>
  );
}
