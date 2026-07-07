"use client";

import { useEffect } from "react";
import { trackGoogleAdsConversion } from "../lib/googleAds";

function getAnchorFromEvent(event) {
  const target = event.target;

  if (!target || typeof target.closest !== "function") {
    return null;
  }

  return target.closest("a[href]");
}

export default function GoogleAdsClickTracker() {
  useEffect(() => {
    const handleClick = (event) => {
      const anchor = getAnchorFromEvent(event);
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";

      if (href.startsWith("tel:")) {
        trackGoogleAdsConversion("call");
        return;
      }

      if (href.includes("wa.me/") || href.includes("api.whatsapp.com/")) {
        trackGoogleAdsConversion("whatsapp");
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
