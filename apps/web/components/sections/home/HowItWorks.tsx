import type { Profile } from "@/lib/sanity";

export function HowItWorks({ steps }: { steps: Profile["steps"] }) {
  return (
    <section className="container-page pb-11 md:pb-24">
      <h2 className="mb-6 text-[30px] leading-[1.08] tracking-[-0.015em] md:mb-9 md:text-[44px]">
        How it works
      </h2>
      <ol className="border-ink grid gap-8 border-t-[1.5px] pt-6 md:auto-cols-fr md:grid-flow-col md:gap-10 md:pt-7">
        {steps.map((s, i) => (
          <li key={s.title} className="flex flex-col gap-2 md:gap-2.5">
            <span className="font-heading text-mango-deep text-[32px] leading-none md:text-[40px]">
              {i + 1}
            </span>
            <h3 className="font-sans text-[19px] font-semibold md:text-[20px]">{s.title}</h3>
            <p className="text-muted max-w-[34ch] text-[15px] leading-[1.55]">
              {s.body}{" "}
              {s.joke && (s.highlight ? <span className="highlight">{s.joke}</span> : s.joke)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
