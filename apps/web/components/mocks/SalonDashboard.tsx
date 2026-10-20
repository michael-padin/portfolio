/** Static mock of an example booking system ("Luna Salon"). Fictional data. */
const STATUS = {
  paid: { label: "Paid · GCash", className: "bg-[oklch(92%_0.05_160)] text-[oklch(35%_0.08_160)]" },
  conf: { label: "Confirmed", className: "bg-[oklch(92%_0.04_200)] text-[oklch(35%_0.07_200)]" },
  pend: { label: "Deposit due", className: "bg-[oklch(93%_0.05_70)] text-[oklch(42%_0.09_60)]" },
} as const;

const BOOKINGS: { time: string; name: string; svc: string; status: keyof typeof STATUS }[] = [
  { time: "9:00", name: "Andrea R.", svc: "Hair color · Jessa", status: "paid" },
  { time: "10:30", name: "Mark D.", svc: "Haircut · Rey", status: "conf" },
  { time: "11:00", name: "Kim L.", svc: "Rebond · Jessa", status: "pend" },
  { time: "1:00", name: "Joy S.", svc: "Manicure · Ana", status: "conf" },
  { time: "2:30", name: "Paolo T.", svc: "Haircut · Rey", status: "paid" },
];

const STATS = [
  { label: "Bookings today", value: "14" },
  { label: "Collected", value: "₱18,400" },
  { label: "No-shows this week", value: "0" },
];

const NAV = ["Today", "Calendar", "Orders", "Inventory", "Staff", "Reports"];

function Row({ b, compact }: { b: (typeof BOOKINGS)[number]; compact?: boolean }) {
  const s = STATUS[b.status];
  return (
    <div
      className={`grid items-center border-t border-[oklch(94%_0.01_70)] ${compact ? "grid-cols-[44px_1fr_auto] gap-2.5 pt-2" : "grid-cols-[56px_1fr_auto] gap-3 py-[9px]"}`}
    >
      <span
        className={`font-mono text-[oklch(45%_0.02_50)] ${compact ? "text-[11px]" : "text-[12px]"}`}
      >
        {b.time}
      </span>
      <div>
        <div className="font-semibold">{b.name}</div>
        <div className={`text-subtle ${compact ? "text-[11px]" : "text-[12px]"}`}>{b.svc}</div>
      </div>
      <span
        className={`rounded-full font-semibold whitespace-nowrap ${compact ? "px-2 py-[3px] text-[10px]" : "px-[9px] py-1 text-[11px]"} ${s.className}`}
      >
        {s.label}
      </span>
    </div>
  );
}

export function SalonDashboard() {
  return (
    <div
      role="img"
      aria-label="Example booking system for a fictional salon: today's bookings, payments collected and booking statuses"
    >
      {/* Mobile: a compact "today" card */}
      <div className="shadow-dashboard flex flex-col gap-2.5 rounded-2xl bg-white p-3.5 text-[12px] md:hidden">
        <div className="flex items-baseline justify-between">
          <span className="font-heading text-[14px]">Luna Salon · Today</span>
          <span className="font-mono text-[10px] text-[oklch(50%_0.02_50)]">example</span>
        </div>
        {BOOKINGS.slice(0, 3).map((b) => (
          <Row key={b.time} b={b} compact />
        ))}
      </div>

      {/* Desktop: the full dashboard with a floating notification */}
      <div className="relative hidden py-5 pl-5 md:block">
        <div className="shadow-dashboard overflow-hidden rounded-[18px] bg-white text-[13px]">
          <div className="flex items-center gap-2 border-b border-[oklch(93%_0.01_70)] px-4 py-3">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-[9px] rounded-full bg-[oklch(88%_0.02_70)]" />
            ))}
            <span className="ml-3 font-mono text-[12px] text-[oklch(55%_0.02_50)]">
              bookings.lunasalon.ph
            </span>
          </div>
          <div className="grid grid-cols-[150px_1fr] lg:grid-cols-[150px_1fr]">
            <div className="bg-ink flex flex-col gap-1 px-3.5 py-[18px] text-[oklch(90%_0.01_80)]">
              <div className="font-heading mb-3.5 text-[15px] text-white">Luna Salon</div>
              {NAV.map((n, i) => (
                <span
                  key={n}
                  className={`rounded-lg px-2.5 py-2 ${i === 0 ? "bg-ink-hover font-semibold text-white" : ""}`}
                >
                  {n}
                </span>
              ))}
            </div>
            <div className="flex min-w-0 flex-col gap-3.5 px-5 py-[18px]">
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-[16px] font-bold">Tuesday, 21 Oct</div>
                <span className="bg-mango rounded-full px-2.5 py-1.5 text-[12px] font-semibold whitespace-nowrap">
                  + New booking
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-[10px] bg-[oklch(96.5%_0.012_80)] px-3 py-2.5"
                  >
                    <div className="text-subtle text-[11px] leading-tight">{s.label}</div>
                    <div className="mt-0.5 text-[18px] font-bold">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                {BOOKINGS.map((b) => (
                  <Row key={b.time} b={b} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-8px] left-[-16px] flex items-center gap-2.5 rounded-[14px] bg-white px-3.5 py-3 text-[13px] shadow-[0_12px_30px_oklch(40%_0.05_60/0.2)]">
          <span className="bg-sky flex size-7 items-center justify-center rounded-full text-[13px]">
            ✓
          </span>
          <div>
            <div className="font-semibold">GCash deposit received</div>
            <div className="text-subtle">Andrea R. · ₱500 · just now</div>
          </div>
        </div>

        <div className="text-subtle bg-paper absolute top-0 right-0 rounded-md px-2 py-1 font-mono text-[11px]">
          example system
        </div>
      </div>
    </div>
  );
}
