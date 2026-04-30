"use client";

import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://izoysowkxttkwggazgfl.supabase.co",
  "sb_publishable__e7ilYxa3-a_aWyoCvrTow_dkqk105H"
);
<div className="flex items-center justify-between px-6 py-4">
  <img src="/logo.png" className="h-12 md:h-14" />

  <a
    href="https://wa.me/31681158003"
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold"
  >
    WhatsApp
  </a>
</div>

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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="h-12 w-auto md:h-14" />
          </a>
          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-700 lg:flex">
            <a href="#werkwijze" className="hover:text-blue-800">Werkwijze</a>
            <a href="#woningen" className="hover:text-blue-800">Woningen</a>
            <a href="#faq" className="hover:text-blue-800">FAQ</a>
            <a href="mailto:info@verkoopjehuisdirect.nl" className="hover:text-blue-800">info@verkoopjehuisdirect.nl</a>
            <a href="tel:0681158003" className="hover:text-blue-800">06 81 15 80 03</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="https://wa.me/31681158003" target="_blank" rel="noopener noreferrer" className="hidden rounded-xl bg-green-500 px-4 py-3 text-sm font-black text-white shadow-md hover:bg-green-600 sm:inline-flex">WhatsApp</a>
            <a href="#aanvraag" className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white shadow-md hover:bg-orange-600">Gratis bod</a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-slate-950 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="mb-8 w-full max-w-xl rounded-3xl bg-white/95 p-4 shadow-2xl" />
            <div className="mb-5 inline-flex rounded-full border border-orange-300/40 bg-orange-500 px-4 py-2 text-sm font-black text-white shadow-lg">
              Binnen 24 uur reactie · Gratis en vrijblijvend
            </div>
            <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
              Verkoop uw huis direct — in elke staat.
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-8 text-blue-100">
              Snel duidelijkheid zonder makelaar, bezichtigingsstress of maanden wachten. Ook bij schade, verhuur, erfenis of achterstallig onderhoud.
            </p>
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 font-bold">✓ Geen makelaar</div>
              <div className="rounded-2xl bg-white/10 p-4 font-bold">✓ Geen kosten</div>
              <div className="rounded-2xl bg-white/10 p-4 font-bold">✓ Snelle verkoop</div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#aanvraag" className="inline-flex justify-center rounded-2xl bg-orange-500 px-8 py-4 text-lg font-black text-white shadow-xl hover:bg-orange-600">Ontvang direct een bod</a>
              <a href="https://wa.me/31681158003" target="_blank" rel="noopener noreferrer" className="inline-flex justify-center rounded-2xl bg-green-500 px-8 py-4 text-lg font-black text-white shadow-xl hover:bg-green-600">WhatsApp direct</a>
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
                    <p className="text-xs text-slate-500">We nemen zo snel mogelijk contact met u op over een vrijblijvend bod.</p>
                  </div>
                )}
              </form>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
                <h2 className="mb-2 text-3xl font-black">Aanvraag ontvangen</h2>
                <p className="text-slate-600">Wij nemen zo snel mogelijk contact met u op.</p>
              </div>
            )}
          </section>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:grid-cols-4">
          {["Binnen 24 uur reactie", "Geen makelaarskosten", "Ook woningen met schade", "Vrijblijvend voorstel"].map((item) => (
            <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center font-black shadow-sm">{item}</div>
          ))}
        </div>
      </section>

      <section id="werkwijze" className="mx-auto max-w-7xl px-5 py-16">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 font-black uppercase tracking-wide text-orange-500">Simpel proces</p>
          <h2 className="text-4xl font-black md:text-5xl">Zo werkt direct verkopen</h2>
          <p className="mt-4 text-lg text-slate-600">Geen lange verkooptrajecten, geen open huizen en geen onzekerheid over kopers.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["1", "Vul uw aanvraag in", "U laat kort uw woninggegevens en contactgegevens achter."],
            ["2", "Wij nemen contact op", "Wij bespreken uw situatie en beoordelen de woning snel."],
            ["3", "Ontvang een voorstel", "U ontvangt een vrijblijvend bod en bepaalt zelf of u akkoord gaat."],
          ].map(([num, title, text]) => (
            <div key={title} className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-800 text-2xl font-black text-white">{num}</div>
              <h3 className="mb-3 text-2xl font-black">{title}</h3>
              <p className="leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="woningen" className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-3 font-black uppercase tracking-wide text-orange-500">Alle condities</p>
              <h2 className="text-4xl font-black md:text-5xl">Wij kopen diverse woningen</h2>
            </div>
            <a href="#aanvraag" className="rounded-2xl bg-blue-800 px-6 py-4 text-center font-black text-white shadow-lg hover:bg-blue-900">Vraag bod aan</a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {["Opknapwoningen", "Verhuurde woningen", "Erfeniswoningen", "Woningen met schade", "Leegstaande huizen", "Beleggingspanden", "Appartementen", "Huizen zonder makelaar"].map((item) => (
              <div key={item} className="rounded-3xl bg-white p-6 font-black shadow-md ring-1 ring-slate-200">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">✓</div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="rounded-[2rem] bg-blue-950 p-8 text-white shadow-2xl md:p-10">
            <p className="mb-3 font-black uppercase tracking-wide text-orange-400">Waarom kiezen voor ons?</p>
            <h2 className="mb-6 text-4xl font-black">Snel, duidelijk en zonder verrassingen.</h2>
            <p className="mb-8 text-lg leading-8 text-blue-100">Wij richten ons op verkopers die snel duidelijkheid willen. U zit nergens aan vast en bepaalt zelf of u het voorstel accepteert.</p>
            <a href="https://wa.me/31681158003" target="_blank" rel="noopener noreferrer" className="inline-flex rounded-2xl bg-green-500 px-7 py-4 font-black text-white hover:bg-green-600">Bespreek uw situatie via WhatsApp</a>
          </div>
          <div className="grid gap-5">
            {["Vrijblijvende aanvraag", "Ook als de woning niet verkoopklaar is", "Geen bezichtigingen met tientallen kijkers", "Direct contact met een echte partij"].map((item) => (
              <div key={item} className="rounded-3xl bg-white p-6 text-lg font-black shadow-md ring-1 ring-slate-200">✓ {item}</div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-5">
          <div className="mb-10 text-center">
            <p className="mb-3 font-black uppercase tracking-wide text-orange-500">Veelgestelde vragen</p>
            <h2 className="text-4xl font-black">Vragen over direct verkopen</h2>
          </div>
          <div className="space-y-4">
            {[
              ["Is de aanvraag gratis?", "Ja, de aanvraag is gratis en vrijblijvend. U zit nergens aan vast."],
              ["Kopen jullie ook huizen in slechte staat?", "Ja, wij kijken ook naar woningen met schade, achterstallig onderhoud of renovatiebehoefte."],
              ["Moet ik een makelaar inschakelen?", "Nee, dat is niet nodig. U kunt rechtstreeks contact opnemen via de website."],
              ["Hoe snel nemen jullie contact op?", "Wij proberen zo snel mogelijk te reageren, vaak dezelfde dag."],
            ].map(([q, a]) => (
              <div key={q} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="mb-2 text-xl font-black">{q}</h3>
                <p className="leading-7 text-slate-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-950 to-blue-800 px-5 py-16 text-center text-white">
        <h2 className="mb-4 text-4xl font-black md:text-5xl">Wilt u snel duidelijkheid?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">Start vandaag nog uw gratis aanvraag of stuur direct een WhatsApp bericht.</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#aanvraag" className="rounded-2xl bg-orange-500 px-8 py-4 text-lg font-black text-white shadow-xl hover:bg-orange-600">Gratis bod aanvragen</a>
          <a href="https://wa.me/31681158003" target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-green-500 px-8 py-4 text-lg font-black text-white shadow-xl hover:bg-green-600">WhatsApp direct</a>
        </div>
      </section>

      <footer className="bg-slate-950 px-5 py-10 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div>
            <img src="/logo.png" alt="Vastgoed Direct Nederland" className="mb-4 h-14 w-auto rounded-xl bg-white p-2" />
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

      <a href="https://wa.me/31681158003" target="_blank" rel="noopener noreferrer" className="fixed bottom-5 right-5 z-50 rounded-full bg-green-500 px-6 py-4 font-black text-white shadow-2xl hover:bg-green-600">WhatsApp</a>
    </main>
  );
}
