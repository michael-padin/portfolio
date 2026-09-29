/**
 * Browser side of the Telegram visit feed (see app/api/notice/route.ts).
 *
 * The endpoint is named /api/notice rather than /api/track because blocker
 * filter lists carry generic rules for "track" paths.
 *
 * A visit is a run of activity with under 30 minutes idle. Its first event
 * creates the Telegram visitor card; the returned message id is kept here so
 * later page views and clicks thread under it as silent replies. Every later
 * event also carries how long the visitor has been on the site.
 *
 * Silence your own browser by opening the site once with ?notrack=1
 * (?notrack=0 turns it back on).
 */

const VISIT_KEY = "mp:visit";
const COUNT_KEY = "mp:visits";
const OPT_OUT_KEY = "mp:notrack";
const IDLE_MS = 30 * 60_000;
/** Ignore instant bounces, and re-report a departure only after this much more time. */
const LEAVE_FLOOR_S = 5;
const LEAVE_REPEAT_S = 30;

interface Visit {
  vid: string;
  mid: number | null;
  source: string | null;
  start: number;
  last: number;
}

export type TrackEvent =
  | { type: "pageview"; path: string }
  | { type: "click"; path: string; label: string; href?: string; area?: "footer" };

// In-memory copy for when localStorage is blocked; storage keeps it across reloads and tabs.
let visit: Visit | null = null;
// Events wait for the visit card so they can reply under it.
let queue: Promise<unknown> = Promise.resolve();
let lastPath: string | null = null;
// Seconds-into-visit of the last "left after" report, so tab switching can't spam it.
let leftAt: number | null = null;

function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage blocked — the in-memory copy still covers this tab
  }
}

function saveVisit(next: Visit) {
  visit = next;
  save(VISIT_KEY, next);
}

function activeVisit(): Visit | null {
  const current = load<Visit>(VISIT_KEY) ?? visit;
  return current && Date.now() - current.last < IDLE_MS ? current : null;
}

/** Seconds since the visit began. Undefined for records written before this was tracked. */
function secondsInto(current: Visit): number | undefined {
  return current.start ? Math.max(0, Math.round((Date.now() - current.start) / 1000)) : undefined;
}

function isOptedOut(): boolean {
  const flag = new URLSearchParams(location.search).get("notrack");
  if (flag !== null) save(OPT_OUT_KEY, flag !== "0");
  // Also skip automation and the Sanity Studio preview iframe.
  return load<boolean>(OPT_OUT_KEY) === true || navigator.webdriver || window.self !== window.top;
}

function post(body: object): Promise<Response | null> {
  return fetch("/api/notice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true, // survives the page unloading on outbound links
  }).catch(() => null);
}

function startVisit(path: string) {
  const now = Date.now();
  const started: Visit = {
    vid: crypto.randomUUID().replace(/-/g, "").slice(0, 8),
    mid: null,
    source: null,
    start: now,
    last: now,
  };
  const visitNo = (load<number>(COUNT_KEY) ?? 0) + 1;
  saveVisit(started);
  save(COUNT_KEY, visitNo);
  leftAt = null;

  const params = new URLSearchParams(location.search);
  const utm = (key: string) => params.get(`utm_${key}`)?.slice(0, 100);
  const referrer =
    document.referrer && new URL(document.referrer).host !== location.host
      ? document.referrer.slice(0, 500)
      : undefined;

  queue = post({
    type: "visit",
    vid: started.vid,
    path,
    referrer,
    utm: { source: utm("source"), medium: utm("medium"), campaign: utm("campaign") },
    visitNo,
  })
    .then((res) =>
      res?.ok ? (res.json() as Promise<{ mid: number | null; source: string }>) : null,
    )
    .then((card) => {
      const latest = load<Visit>(VISIT_KEY) ?? visit;
      if (card && latest?.vid === started.vid) {
        saveVisit({ ...latest, mid: card.mid, source: card.source });
      }
    })
    .catch(() => {});
}

export function track(event: TrackEvent) {
  if (isOptedOut()) return;

  if (event.type === "pageview") {
    if (event.path === lastPath) return; // StrictMode double effects
    lastPath = event.path;
  }

  const current = activeVisit();
  if (!current) {
    startVisit(event.type === "pageview" ? event.path : location.pathname);
    if (event.type === "pageview") return; // the visitor card covers the landing page
  } else {
    saveVisit({ ...current, last: Date.now() });
  }

  queue = queue.then(() => {
    const latest = load<Visit>(VISIT_KEY) ?? visit;
    if (!latest) return;
    return post({
      ...event,
      vid: latest.vid,
      mid: latest.mid ?? undefined,
      at: secondsInto(latest),
      source: event.type === "click" ? (latest.source ?? undefined) : undefined,
    });
  });
}

/**
 * Reports how long the visit lasted, on the way out. Called when the tab is
 * hidden or unloaded — which is also the only dwell figure we get for the last
 * page they were on.
 */
export function trackLeave() {
  if (isOptedOut()) return;

  const current = activeVisit();
  if (!current) return;

  const at = secondsInto(current);
  if (at === undefined || at < LEAVE_FLOOR_S) return;
  // They came back and kept reading; only re-report once the total has moved on.
  if (leftAt !== null && at - leftAt < LEAVE_REPEAT_S) return;
  leftAt = at;

  post({
    type: "leave",
    vid: current.vid,
    mid: current.mid ?? undefined,
    path: location.pathname,
    at,
  });
}

/** Id of the visit in progress, so chats and contact submissions can be tagged with it. */
export function currentVisitId(): string | undefined {
  return isOptedOut() ? undefined : activeVisit()?.vid;
}
