"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ADS_CONSENT_EVENT, readAdsConsent } from "../lib/adsConsent";

const DEFAULT_META_PIXEL_ID = "1797614041586264";

function ensureMetaPixel(pixelId) {
  if (typeof window === "undefined" || !pixelId) return false;

  if (!window.fbq) {
    const fbq = function fbq() {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    };

    window.fbq = fbq;
    window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  if (!window.__vdnMetaPixelInitialized) {
    window.fbq("init", pixelId);
    window.__vdnMetaPixelInitialized = true;
  }

  window.fbq("consent", "grant");
  return true;
}

export default function MetaPixelTag() {
  const pathname = usePathname();
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || DEFAULT_META_PIXEL_ID;
  const allowTracking = !pathname.startsWith("/admin") && !pathname.startsWith("/voorstel");

  useEffect(() => {
    function updateConsent(status) {
      const granted = status === "granted" && allowTracking;

      if (!granted) {
        if (typeof window.fbq === "function") window.fbq("consent", "revoke");
        return;
      }

      if (!ensureMetaPixel(pixelId)) return;

      if (window.__vdnMetaPixelLastPageView !== pathname) {
        window.fbq("track", "PageView");
        window.__vdnMetaPixelLastPageView = pathname;
      }
    }

    updateConsent(readAdsConsent());

    function handleConsent(event) {
      updateConsent(event.detail?.status);
    }

    window.addEventListener(ADS_CONSENT_EVENT, handleConsent);
    return () => window.removeEventListener(ADS_CONSENT_EVENT, handleConsent);
  }, [allowTracking, pathname, pixelId]);

  return null;
}
