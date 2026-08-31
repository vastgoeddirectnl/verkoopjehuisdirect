"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent, trackGoogleAdsConversion } from "../lib/googleAds";

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
      const customEvent = anchor.dataset?.analyticsEvent;

      if (customEvent) {
        trackAnalyticsEvent(customEvent, {
          component: anchor.dataset?.analyticsComponent || "link",
        });
      }

      if (href.startsWith("tel:")) {
        trackAnalyticsEvent("phone_click", { link_type: "phone" });
        trackGoogleAdsConversion("call");
        return;
      }

      if (href.includes("wa.me/") || href.includes("api.whatsapp.com/")) {
        trackAnalyticsEvent("whatsapp_click", { link_type: "whatsapp" });
        trackGoogleAdsConversion("whatsapp");
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
