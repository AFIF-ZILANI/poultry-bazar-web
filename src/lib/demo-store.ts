"use client";
// DEMO ONLY. Mock session and the user's local changes, kept in localStorage so the prototype feels
// real. Production uses an HttpOnly refresh cookie set by the API (docs/rules.md, Security).
import { useSyncExternalStore } from "react";
import type { Ad, AdFilters, WantedPost } from "./types";

export interface DemoUser {
  name: string;
  phone: string;
}

export interface SavedAlert {
  id: string;
  label: string;
  query: string;
  filters: AdFilters;
  sms: boolean;
  createdAt: string;
}

interface DemoState {
  user: DemoUser | null;
  /** Status changes the user made to their seeded listings, keyed by ad code. */
  overrides: Record<string, Partial<Ad>>;
  /** Listings posted through the sell wizard in this browser. */
  posted: Ad[];
  alerts: SavedAlert[];
  reported: string[];
  wanted: WantedPost[];
  /** Codes of listings the user deleted. */
  deleted: string[];
}

const KEY = "pb_demo_v2";
const EMPTY: DemoState = { user: null, overrides: {}, posted: [], alerts: [], reported: [], wanted: [], deleted: [] };
const listeners = new Set<() => void>();
let cache: DemoState | null = null;

function read(): DemoState {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

export function updateDemo(fn: (s: DemoState) => DemoState) {
  cache = fn(read());
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* storage blocked: state still lives in memory for this tab */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useDemo<T>(select: (s: DemoState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(read()),
    () => select(EMPTY),
  );
}

export const signIn = (user: DemoUser) => updateDemo((s) => ({ ...s, user }));
export const signOut = () => updateDemo((s) => ({ ...s, user: null }));
