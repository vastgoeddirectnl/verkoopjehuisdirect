export const reviewData = {
  rating: "5,0",
  source: "Google",
  count: "2 reviews",
  url: "https://www.google.com/search?q=reviews+voor+Vastgoed+Direct+Nederland",
  note: "Controleer deze gegevens handmatig wanneer er nieuwe Google-reviews zijn.",
};

export function reviewDisplayText(data = reviewData) {
  return `${data.source} · ${data.count}`;
}
