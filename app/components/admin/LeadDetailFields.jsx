"use client";

// Kleine, herbruikbare formuliervelden voor de lead-detailpagina (ARCH-05).
// Gedeeld door LeadContactForm en ProposalForm.

export function Info({ label, value }) {
  return <div className="info"><span>{label}</span><strong>{value || "-"}</strong></div>;
}

export function Field({ label, children }) {
  return <label><span>{label}</span>{children}</label>;
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select value={value || ""} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </Field>
  );
}
