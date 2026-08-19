"use client";

import { useEffect, useRef } from "react";

function sessionKeyFor(token) {
  const storageKey = `vdn-proposal-session:${token}`;
  try {
    let value = sessionStorage.getItem(storageKey);
    if (!value) {
      value = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(storageKey, value);
    }
    return value;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export default function ProposalViewTracker({ token, enabled = true }) {
  const visibleStartedAt = useRef(null);
  const visibleMs = useRef(0);
  const sent = useRef(false);

  useEffect(() => {
    if (!enabled || !token || sent.current) return undefined;

    const sessionKey = sessionKeyFor(token);
    let timer;

    const addVisibleTime = () => {
      if (visibleStartedAt.current) {
        visibleMs.current += Date.now() - visibleStartedAt.current;
        visibleStartedAt.current = null;
      }
    };

    const schedule = () => {
      clearTimeout(timer);
      if (document.visibilityState !== "visible" || sent.current) return;
      if (!visibleStartedAt.current) visibleStartedAt.current = Date.now();

      const remaining = Math.max(0, 4000 - visibleMs.current);
      timer = window.setTimeout(async () => {
        addVisibleTime();
        if (visibleMs.current < 4000 || sent.current) return;
        sent.current = true;
        try {
          await fetch(`/api/proposal/${token}/event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            keepalive: true,
            body: JSON.stringify({
              event: "view",
              session_key: sessionKey,
              page_visible_ms: visibleMs.current,
              viewport: `${window.innerWidth}x${window.innerHeight}`,
            }),
          });
        } catch {
          // Tracking mag de voorstelervaring nooit blokkeren.
        }
      }, remaining);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        schedule();
      } else {
        clearTimeout(timer);
        addVisibleTime();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    schedule();

    return () => {
      clearTimeout(timer);
      addVisibleTime();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, token]);

  return null;
}
