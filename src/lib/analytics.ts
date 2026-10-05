/**
 * Privacy-friendly analytics (Umami Cloud): no cookies, no personal data, no consent banner needed.
 *
 * To turn it on: create a free site at https://cloud.umami.is, copy its "Website ID" and paste it below.
 * Until then every call here is a harmless no-op.
 */
type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Props) => void };
  }
}

export const UMAMI_WEBSITE_ID = "41041b48-5bf1-41b9-aee2-8d47e675c0ca";
const DOMAINS = ["satyaprabhas.dev", "www.satyaprabhas.dev"]; // never record localhost / preview URLs

const queue: [string, Props | undefined][] = [];
let pending = false;

const optedOut = () =>
  navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

/** Record a custom event (a tab opened, a project viewed, the demo played...). */
export function track(name: string, data?: Props) {
  if (window.umami) { window.umami.track(name, data); return; }
  if (pending && queue.length < 30) queue.push([name, data]);
}

export function initAnalytics() {
  if (!UMAMI_WEBSITE_ID || optedOut() || !DOMAINS.includes(location.hostname)) return;
  pending = true;
  const s = document.createElement("script");
  s.defer = true;
  s.src = "https://cloud.umami.is/script.js";
  s.dataset.websiteId = UMAMI_WEBSITE_ID;
  s.dataset.domains = DOMAINS.join(",");
  s.dataset.excludeHash = "true"; // switching tabs (#about, #projects...) is not a new page view
  s.dataset.doNotTrack = "true";
  s.onload = () => {
    pending = false;
    queue.splice(0).forEach(([n, d]) => window.umami?.track(n, d));
    // Personal links: satyaprabhas.dev/?ref=acme-recruiter shows up as a "tagged_visit" event with that name.
    const ref = new URLSearchParams(location.search).get("ref");
    if (ref) track("tagged_visit", { ref: ref.slice(0, 60) });
  };
  s.onerror = () => { pending = false; queue.length = 0; };
  document.head.appendChild(s);
}
