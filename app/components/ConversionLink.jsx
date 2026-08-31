"use client";

import { trackGoogleAdsConversion } from "../lib/googleAds";

export default function ConversionLink({ eventName, children, ...props }) {
  return (
    <a
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented && eventName) trackGoogleAdsConversion(eventName);
      }}
    >
      {children}
    </a>
  );
}
