"use client";

import { useEffect } from "react";
import { captureLandingAttribution } from "../lib/attribution";

// Onthoudt bij de eerste paginalading waar de bezoeker vandaan kwam, zodat een
// aanvraag op een latere pagina nog het juiste kanaal krijgt. Staat in de
// layout; die blijft bij navigatie binnen de site staan, dus dit draait één
// keer per volledige paginalading.
export default function LandingAttribution() {
  useEffect(() => {
    captureLandingAttribution();
  }, []);
  return null;
}
