import { reviewData, reviewDisplayText } from "../../lib/reviewData";

export default function SeoReviewBand() {
  return (
    <section className="seo-review-band" aria-label={`${reviewData.source}-beoordelingen`}>
      <div className="container">
        <a
          className="seo-review-link"
          href={reviewData.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bekijk de Google-beoordelingen van Vastgoed Direct Nederland"
        >
          <div className="seo-review-score">
            <strong>{reviewData.rating}</strong>
            <span>
              ★★★★★
              <small>{reviewDisplayText(reviewData)}</small>
            </span>
          </div>
          <div className="seo-review-copy">
            <p className="eyebrow">Ervaringen</p>
            <h2>Rustig en duidelijk contact wordt gewaardeerd.</h2>
            <p>Bekijk de actuele Google-beoordelingen. Wij gebruiken alleen controleerbare review-informatie en voegen geen verzonnen klantverhalen toe.</p>
          </div>
          <span className="seo-review-cta">Bekijk op Google →</span>
        </a>
      </div>
    </section>
  );
}
