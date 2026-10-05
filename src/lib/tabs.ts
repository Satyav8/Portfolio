import { useSyncExternalStore } from "react";

/** The tabs of the single "work" panel. Every nav link, button and palette command routes through here. */
export const TABS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "demo", label: "Voice demo" },
  { id: "experience", label: "Experience" },
  { id: "recognition", label: "Recognition" },
  { id: "media", label: "Media" },
] as const;

export type TabId = (typeof TABS)[number]["id"];
const IDS: string[] = TABS.map((t) => t.id);
export const isTabId = (s: string): s is TabId => IDS.includes(s);

const hashTab = (): TabId | null => {
  if (typeof location === "undefined") return null;
  const h = location.hash.slice(1);
  return isTabId(h) ? h : null;
};

let current: TabId = hashTab() ?? "about";
const subs = new Set<() => void>();

export const startedOnTabHash = () => hashTab() !== null;

export function setTab(id: TabId) {
  if (id === current) return;
  current = id;
  try { history.replaceState(null, "", `#${id}`); } catch { /* ignore */ }
  subs.forEach((f) => f());
}

export function useTab(): TabId {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => { subs.delete(cb); }; },
    () => current,
    () => "about" as TabId
  );
}

export function scrollToId(id: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/** Go to a tab (and bring the panel into view) or to a plain section id. */
export function goTo(id: string) {
  if (isTabId(id)) { setTab(id); scrollToId("work"); } else scrollToId(id);
}
