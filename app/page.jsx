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
    <main className="min-h-screen bg-[#f7f5f0] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center">
          <img src="/logo.png" alt="Vastgoed Direct Nederland" className="max-h-14 w-auto max-w-[220px] object-contain" />

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
            <a href="#werkwijze" className="hover:text-[#0A2540]">Werkwijze</a>
            <a href="#voordelen" className="hover:text-[#0A2540]">Voordelen</a>
            <a href="#faq" className="hover:text-[#0A2540]">FAQ</a>
            <a href="tel:0681158003" className="hover:text-[#0A2540]">06 81 15 80 03</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href="https://wa.me/31681158003" target="_blank" rel="noopener noreferrer" className="hidden rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-sm hover:opacity-90 sm:inline-flex">WhatsApp</a>
            <a href="#aanvraag" className="rounded-full bg-[#ff6a00] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#e85f00]">Gratis bod</a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(10,37,64,0.12),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-[#ff6a00]">
              Binnen 24 uur reactie · Gratis en vrijblijvend
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-[#0A2540] md:text-6xl">
              Verkoop uw woning snel, zeker en zonder gedoe.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Vastgoed Direct Nederland koopt woningen in elke staat. Geen makelaar, geen eindeloze bezichtigingen en snel duidelijkheid over uw verkoopmogelijkheden.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Geen makelaar nodig", "Ook bij schade", "Vrijblijvend bod"].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold shadow-sm">✓ {item}</div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#aanvraag" className="rounded-full bg-[#ff6a00] px-8 py-4 text-center text-base font-black text-white shadow-lg hover:bg-[#e85f00]">Ontvang gratis bod</a>
              <a href="https://wa.me/31681158003" target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-300 bg-white px-8 py-4 text-center text-base font-black text-[#0A2540] shadow-sm hover:bg-slate-50">Stuur WhatsApp</a>
            </div>
          </div>

          <section id="aanvraag" className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70 md:p-8">
            <div className="mb-6 flex justify-center border-b border-slate-100 pb-5">
              <img src="/logo.png" alt="Vastgoed Direct Nederland" className="h-16 w-auto max-w-[300px] object-contain" />
            </div>

            {!submitted ? (
              <form onSubmit={submitLead}>
                <div className="mb-6">
                  <p className="text-sm font-black uppercase tracking-wide text-[#ff6a00]">Stap {step} van 4</p>
                  <h2 className="mt-1 text-3xl font-black text-[#0A2540]">Gratis verkoopvoorstel</h2>
                  <p className="mt-2 text-slate-500">Vul uw gegevens in. Wij nemen snel contact met u op.</p>
                </div>

                {step === 1 && (
                  <div className="space-y-4">
                    <input name="postcode" value={form.postcode} onChange={updateForm} placeholder="Postcode" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 outline-none focus:border-[#0A2540]" required />
                    <input name="huisnummer" value={form.huisnummer} onChange={updateForm} placeholder="Huisnummer" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 outline-none focus:border-[#0A2540]" required />
                    <button type="button" onClick={nextStep} className="w-full rounded-full bg-[#0A2540] py-4 font-black text-white hover:bg-[#12395d]">Volgende</button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <select name="woningtype" value={form.woningtype} onChange={updateForm} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4" required>
                      <option value="">Type woning</option>
                      <option>Appartement</option>
                      <option>Rijtjeshuis</option>
                      <option>Twee-onder-een-kap</option>
                      <option>Vrijstaande woning</option>
                      <option>Beleggingspand</option>
                    </select>
                    <select name="staat" value={form.staat} onChange={updateForm} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4" required>
                      <option value="">Staat van de woning</option>
                      <option>Goed onderhouden</option>
                      <option>Normaal bewoond</option>
                      <option>Renovatie nodig</option>
                      <option>Slechte staat / schade</option>
                    </select>
                    <div className="flex gap-3">
                      <button type="button" onClick={previousStep} className="w-1/3 rounded-full border border-slate-300 py-4 font-bold">Terug</button>
                      <button type="button" onClick={nextStep} className="w-2/3 rounded-full bg-[#0A2540] py-4 font-black text-white hover:bg-[#12395d]">Volgende</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <select name="reden" value={form.reden} onChange={updateForm} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4" required>
                      <option value="">Reden van verkoop</option>
                      <option>Snel verkopen</option>
                      <option>Erfenis</option>
                      <option>Scheiding</option>
                      <option>Financiële situatie</option>
                      <option>Verhuurde woning verkopen</option>
                      <option>Anders</option>
                    </select>
                    <div className="flex gap-3">
                      <button type="button" onClick={previousStep} className="w-1/3 rounded-full border border-slate-300 py-4 font-bold">Terug</button>
                      <button type="button" onClick={nextStep} className="w-2/3 rounded-full bg-[#0A2540] py-4 font-black text-white hover:bg-[#12395d]">Volgende</button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <input name="naam" value={form.naam} onChange={updateForm} placeholder="Naam" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4" required />
                    <input name="email" value={form.email} onChange={updateForm} placeholder="E-mail" type="email" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4" required />
                    <input name="telefoon" value={form.telefoon} onChange={updateForm} placeholder="Telefoonnummer" className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4" required />
                    <div className="flex gap-3">
                      <button type="button" onClick={previousStep} className="w-1/3 rounded-full border border-slate-300 py-4 font-bold">Terug</button>
                      <button type="submit" className="w-2/3 rounded-full bg-[#ff6a00] py-4 font-black text-white hover:bg-[#e85f00]">Aanvraag versturen</button>
                    </div>
                    <p className="text-xs text-slate-500">Wij nemen contact op over uw vrijblijvende aanvraag.</p>
                  </div>
                )}
              </form>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">✓</div>
                <h2 className="mb-2 text-3xl font-black text-[#0A2540]">Aanvraag ontvangen</h2>
                <p className="text-slate-600">Wij nemen zo snel mogelijk contact met u op.</p>
              </div>
            )}
          </section>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#0A2540] text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:grid-cols-4">
          {["Binnen 24 uur reactie", "Geen makelaarskosten", "Ook slechte staat", "Vrijblijvend voorstel"].map((item) => (
            <div key={item} className="text-center text-lg font-black">{item}</div>
          ))}
        </div>
      </section>

      <section id="werkwijze" className="mx-auto max-w-7xl px-5 py-20">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 font-black uppercase tracking-wide text-[#ff6a00]">Simpel proces</p>
          <h2 className="text-4xl font-black tracking-tight text-[#0A2540] md:text-5xl">Zo werkt direct verkopen</h2>
          <p className="mt-4 text-lg text-slate-600">Geen lange verkooptrajecten, geen open huizen en geen onzekerheid over kopers.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["1", "Aanvraag", "U laat kort uw woninggegevens en contactgegevens achter."],
            ["2", "Contact", "Wij bespreken uw situatie en beoordelen uw woning."],
            ["3", "Voorstel", "U ontvangt een vrijblijvend voorstel en beslist zelf."],
          ].map(([num, title, text]) => (
            <div key={title} className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/80 ring-1 ring-slate-200">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff6a00] text-2xl font-black text-white">{num}</div>
              <h3 className="mb-3 text-2xl font-black text-[#0A2540]">{title}</h3>
              <p className="leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="voordelen" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 font-black uppercase tracking-wide text-[#ff6a00]">Waarom direct verkopen?</p>
            <h2 className="text-4xl font-black tracking-tight text-[#0A2540] md:text-5xl">Rust, snelheid en duidelijkheid.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Soms wilt u niet maanden wachten op een koper. Wij helpen eigenaren die snel willen schakelen en zonder traditionele verkoopstress duidelijkheid willen.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Geen verkoopstyling nodig", "Geen open huis", "Ook verhuurde woningen", "Direct contact"].map((item) => (
                <div key={item} className="rounded-2xl bg-[#f7f5f0] p-5 font-bold text-[#0A2540]">✓ {item}</div>
              ))}
            </div>
          </div>
          <div className="rounded-[2.5rem] bg-[#0A2540] p-8 text-white shadow-2xl">
            <h3 className="text-3xl font-black">Wij kopen onder andere</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Opknapwoningen", "Erfeniswoningen", "Woningen met schade", "Leegstaande huizen", "Beleggingspanden", "Appartementen"].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4 font-bold">✓ {item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-5 py-20">
        <div className="mb-10 text-center">
          <p className="mb-3 font-black uppercase tracking-wide text-[#ff6a00]">FAQ</p>
          <h2 className="text-4xl font-black text-[#0A2540]">Veelgestelde vragen</h2>
        </div>
        <div className="space-y-4">
          {[
            ["Is de aanvraag gratis?", "Ja, de aanvraag is volledig gratis en vrijblijvend."],
            ["Kopen jullie ook huizen in slechte staat?", "Ja, ook woningen met schade, achterstallig onderhoud of renovatiebehoefte."],
            ["Heb ik een makelaar nodig?", "Nee, u kunt rechtstreeks een aanvraag doen via de website."],
            ["Hoe snel nemen jullie contact op?", "Wij proberen zo snel mogelijk te reageren, vaak dezelfde dag."],
          ].map(([q, a]) => (
            <div key={q} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-black text-[#0A2540]">{q}</h3>
              <p className="leading-7 text-slate-600">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0A2540] px-5 py-20 text-center text-white">
        <h2 className="text-4xl font-black md:text-5xl">Wilt u snel duidelijkheid?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">Vraag gratis een bod aan of stuur direct een WhatsApp bericht.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#aanvraag" className="rounded-full bg-[#ff6a00] px-8 py-4 text-lg font-black text-white hover:bg-[#e85f00]">Gratis bod aanvragen</a>
          <a href="https://wa.me/31681158003" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-8 py-4 text-lg font-black text-white hover:opacity-90">WhatsApp direct</a>
        </div>
      </section>

      <footer className="bg-slate-950 px-5 py-10 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div>
           <img src="/logo.png" alt="Vastgoed Direct Nederland" className="max-h-14 w-auto max-w-[220px] object-contain" />
            <p className="text-sm leading-6 text-slate-400">Vastgoed Direct Nederland helpt woningeigenaren met snelle en duidelijke verkoopmogelijkheden.</p>
          </div>
          <div>
            <h3 className="mb-3 font-black text-white">Contact</h3>
            <p>info@verkoopjehuisdirect.nl</p>
            <p>06 81 15 80 03</p>
          </div>
          <div>
            <h3 className="mb-3 font-black text-white">Website</h3>
            <p>verkoopjehuisdirect.nl</p>
            <p className="mt-3 text-xs text-slate-500">© 2026 Vastgoed Direct Nederland</p>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/31681158003" target="_blank" rel="noopener noreferrer" className="fixed bottom-5 right-5 z-50 rounded-full bg-[#25D366] px-6 py-4 font-black text-white shadow-2xl hover:opacity-90">WhatsApp</a>
    </main>
  );
}
