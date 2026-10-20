import type { Profile } from "@/lib/sanity";

export function StillRunning({ pains }: { pains: Profile["pains"] }) {
  return (
    <section className="bg-ink text-paper">
      <div className="container-page grid items-start gap-4 py-11 md:grid-cols-[1fr_2fr] md:gap-12 md:py-[72px]">
        <div>
          <h2 className="text-[30px] leading-[1.05] tracking-[-0.015em] md:text-[44px]">
            Still running on…
          </h2>
          <p className="text-dark-muted mt-3 max-w-[28ch] text-[15px] leading-normal md:mt-4 md:text-[16px]">
            No judgment, most Cebu businesses are. I build the system that retires them,{" "}
            <span className="text-dark-accent italic">gently.</span>
          </p>
        </div>
        <ul className="grid md:grid-cols-2 md:gap-x-8">
          {pains.map((p) => (
            <li
              key={p.text}
              className="border-dark-rule decoration-mango border-t-[1.5px] py-[13px] text-[17px] leading-[1.4] line-through decoration-2 md:py-[18px] md:text-[20px] md:leading-[1.35]"
            >
              {p.text}
              {p.joke && <span className="text-dark-accent italic"> {p.joke}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
