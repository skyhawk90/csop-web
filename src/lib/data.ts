import { getCollection, type CollectionEntry } from "astro:content";

const TZ = "Europe/Prague";

// Datumy z frontmatteru jsou bez času (YYYY-MM-DD) → Zod je udělá jako půlnoc UTC.
// Proto je formátujeme v UTC, jinak by se na build serveru mohly posunout o den.
const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("cs-CZ", { timeZone: "UTC", ...opts });
const fmtLong = fmt({ day: "numeric", month: "long", year: "numeric" });
const fmtDayMonth = fmt({ day: "numeric", month: "long" });
const fmtWeekday = fmt({ weekday: "long" });
const fmtDay = fmt({ day: "numeric" });
const fmtMonthShort = fmt({ month: "short" });

export const formatDate = (d: Date) => fmtLong.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
export const weekday = (d: Date) => fmtWeekday.format(d);
export const dayNum = (d: Date) => fmtDay.format(d);
export const monthShort = (d: Date) => fmtMonthShort.format(d).replace(".", "");

export function formatRange(od: Date, doDne?: Date) {
  if (!doDne || isoDate(doDne) === isoDate(od)) return formatDate(od);
  if (od.getUTCFullYear() === doDne.getUTCFullYear()) return `${fmtDayMonth.format(od)} až ${formatDate(doDne)}`;
  return `${formatDate(od)} až ${formatDate(doDne)}`;
}

// Dnešek v Praze jako YYYY-MM-DD (build běží v UTC)
export const todayIso = () => new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(new Date());

const published = <T extends { data: { koncept: boolean } }>(e: T) => import.meta.env.DEV || !e.data.koncept;

export async function getAktuality() {
  return (await getCollection("aktuality", published)).sort((a, b) => b.data.datum.valueOf() - a.data.datum.valueOf());
}

export async function getGalerie() {
  return (await getCollection("galerie", published)).sort((a, b) => b.data.datum.valueOf() - a.data.datum.valueOf());
}

/** Akce rozdělené na nadcházející (vzestupně) a proběhlé (sestupně). Web se kvůli tomu přestavuje každou noc. */
export async function getAkce() {
  const all = await getCollection("akce", published);
  const today = todayIso();
  const konec = (e: CollectionEntry<"akce">) => isoDate(e.data.datum_do ?? e.data.datum);
  const upcoming = all.filter((e) => konec(e) >= today).sort((a, b) => a.data.datum.valueOf() - b.data.datum.valueOf());
  const past = all.filter((e) => konec(e) < today).sort((a, b) => b.data.datum.valueOf() - a.data.datum.valueOf());
  return { upcoming, past };
}
