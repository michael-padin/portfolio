/** Static mock of the Image Edits team calendar. Fictional data. */
const TEAMS = ["Team A · North", "Team B · North", "Team C · South", "Team D · South"];

type Block = { area: string; label: string; tone: "peach" | "sky" | "mint" | "travel" | "open" };

const BLOCKS: Block[] = [
  { area: "1/2/3/3", label: "Shoot · Indooroopilly", tone: "peach" },
  { area: "3/2/4/3", label: "Travel · 25 min", tone: "travel" },
  { area: "4/2/6/3", label: "Shoot · Toowong", tone: "peach" },
  { area: "2/3/4/4", label: "Drone · Ascot", tone: "sky" },
  { area: "5/3/7/4", label: "Open slot", tone: "open" },
  { area: "1/4/2/5", label: "Open slot", tone: "open" },
  { area: "2/4/5/5", label: "Shoot + floorplan · Sunnybank", tone: "mint" },
  { area: "1/5/3/6", label: "Video · Carindale", tone: "sky" },
  { area: "4/5/6/6", label: "Shoot · Wynnum", tone: "peach" },
];

const TONE: Record<Block["tone"], string> = {
  peach: "bg-peach font-semibold",
  sky: "bg-sky font-semibold",
  mint: "bg-mint font-semibold",
  travel: "bg-[oklch(95%_0.02_70)] text-[oklch(45%_0.02_50)]",
  open: "border-[1.5px] border-dashed border-[oklch(70%_0.1_160)] bg-white font-semibold text-[oklch(40%_0.08_160)]",
};

export function TeamCalendar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-tint flex h-full flex-col gap-2.5 rounded-[20px] p-3 text-[8px] sm:p-5 sm:text-[11px] ${className}`}
      role="img"
      aria-label="Example team calendar: four teams, jobs across Brisbane suburbs, travel time and open slots"
    >
      <div className="text-muted grid grid-cols-[32px_repeat(4,1fr)] gap-1.5 font-semibold sm:grid-cols-[44px_repeat(4,1fr)]">
        <span />
        {TEAMS.map((t) => (
          <span key={t} className="truncate">
            {t}
          </span>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-[32px_repeat(4,1fr)] grid-rows-[repeat(6,minmax(0,1fr))] gap-1.5 sm:grid-cols-[44px_repeat(4,1fr)]">
        {["8:00", "10:00", "12:00"].map((t, i) => (
          <span
            key={t}
            className="font-mono text-[oklch(50%_0.02_50)]"
            style={{ gridArea: `${i * 2 + 1}/1` }}
          >
            {t}
          </span>
        ))}
        {BLOCKS.map((b) => (
          <div
            key={b.area}
            className={`overflow-hidden rounded-lg px-1.5 py-1 leading-tight sm:px-2 sm:py-1.5 ${TONE[b.tone]}`}
            style={{ gridArea: b.area }}
          >
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
}
