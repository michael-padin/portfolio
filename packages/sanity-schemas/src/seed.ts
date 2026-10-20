/**
 * Project copy shared by the site's no-Sanity fallback and the studio seed
 * script (`pnpm --filter @portfolio/studio seed:projects`).
 *
 * The problem / highlights copy is a draft: confirm it matches what happened
 * on each project before publishing.
 */

export type ProjectKind = "booking" | "web-app" | "website";

export interface SeedProject {
  slug: string;
  title: string;
  headline: string;
  tagline: string;
  kind: ProjectKind;
  client: string;
  builtAt: "client" | "employer";
  role: string;
  typeLabel: string;
  techStack: string[];
  liveUrl?: string;
  featured: boolean;
  order: number;
  problem: string;
  highlights: { title: string; body: string }[];
  localAngle?: { text: string; chips: string[] };
  coverMock?: "team-calendar" | "salon-dashboard";
}

export const SEED_PROJECTS: SeedProject[] = [
  {
    slug: "hermosa-glow",
    title: "Hermosa Glow",
    headline: "Online booking and a clinic system for a Carcar skin clinic",
    tagline:
      "Clients book a treatment in a few taps. Staff run the calendar, counter, packages and consent forms from one system.",
    kind: "booking",
    client: "Hermosa Glow by Nurse Guen · Carcar City, Cebu",
    builtAt: "client",
    role: "Design, build and support",
    typeLabel: "Booking website + clinic system",
    techStack: ["Next.js", "PostgreSQL", "Better Auth", "Cloudflare R2", "Vercel"],
    featured: true,
    order: 1,
    problem:
      "Most bookings came in through Facebook Messenger and were written down by hand. Consent forms were on paper, and package sessions (“pay for 4, get the 5th free”) were tracked from memory. With almost 90 services priced six different ways, the counter was slow and easy to get wrong.",
    highlights: [
      {
        title: "Online booking",
        body: "A public site with treatment pages and a short booking flow. Nurse Guen confirms every booking before it's final.",
      },
      {
        title: "Calendar by room",
        body: "A day view across rooms and machines, with follow-ups and “next session due” reminders, so nothing double-books.",
      },
      {
        title: "Counter and packages",
        body: "Sales with split payments, part-paid packages, discounts and a daily close. Sessions and balances are tracked for each client.",
      },
      {
        title: "Digital consent and records",
        body: "Thirteen paper consent forms became digital ones, signed and kept on the client's profile next to their session notes.",
      },
    ],
    localAngle: {
      text: "Any clinic, salon or spa that runs on Messenger bookings and paper forms can work this way. Clients book themselves, and staff stop retyping the same details.",
      chips: [
        "Skin clinics",
        "Salons & spas",
        "Dental clinics",
        "Physical therapy",
        "Nail studios",
      ],
    },
  },
  {
    slug: "mil",
    title: "MIL",
    headline: "Inventory, consignment and payroll for a Cebu shoe brand",
    tagline:
      "One system for stock across branches, consignment, staff payroll and the monthly numbers.",
    kind: "web-app",
    client: "MIL handcrafted footwear · Cebu City",
    builtAt: "client",
    role: "Design, build and support",
    typeLabel: "Inventory & payroll system",
    techStack: ["Next.js", "PostgreSQL", "Prisma", "Vercel"],
    featured: true,
    order: 2,
    problem:
      "Daily sales and inventory reports lived in spreadsheets that someone rebuilt by hand. Workshop job orders were on paper, and payroll was worked out by hand every pay period.",
    highlights: [
      {
        title: "Inventory across branches",
        body: "Stock movements, transfers between branches, purchase orders and blind stock counts, so the numbers match the shelves.",
      },
      {
        title: "Consignment",
        body: "Consignors, remittances and bazaar events tracked in one place.",
      },
      {
        title: "Payroll and attendance",
        body: "Attendance, holiday pay, SSS, PhilHealth and Pag-IBIG contributions, and payslips for every pay period.",
      },
      {
        title: "Monthly numbers",
        body: "A monthly income statement with revenue, costs and profit, and a drill-down into any single day.",
      },
    ],
    localAngle: {
      text: "Any shop juggling a stockroom, consignors and a staff payroll has the same headaches. That includes boutiques, hardware stores, pharmacies and bakeries with more than one branch.",
      chips: ["Boutiques", "Hardware stores", "Pharmacies", "Bakeries", "Multi-branch retail"],
    },
  },
  {
    slug: "kasper-trucking",
    title: "Kasper Trucking",
    headline: "Trips, delivery receipts and weekly crew pay for a Cebu hauler",
    tagline:
      "Each trip is logged once. Delivery receipts, crew payroll and client billing all come from it.",
    kind: "web-app",
    client: "Kasper Trucking Services · Cebu",
    builtAt: "client",
    role: "Design, build and support",
    typeLabel: "Operations, payroll & billing system",
    techStack: ["Next.js", "PostgreSQL", "Prisma", "React PDF", "Vercel"],
    liveUrl: "https://kaspertrucking.com",
    featured: true,
    order: 3,
    problem:
      "Every week, crew pay and client billing were typed into Excel from the same deliveries, twice. VAT and withholding sums were easy to get wrong, and a trip with several drops could pay the crew twice.",
    highlights: [
      {
        title: "Trip logging",
        body: "Each run records the truck, driver, helpers and up to five deliveries with bag counts.",
      },
      {
        title: "Delivery receipts",
        body: "A numbered receipt for every trip, printed as a PDF ready to hand to the feedmill.",
      },
      {
        title: "Weekly crew payroll",
        body: "Drivers get a set rate per trip and helpers share by bags carried. Cash advances are deducted, and paid weeks are locked.",
      },
      {
        title: "Client billing",
        body: "A weekly sales statement for each customer, with VAT and withholding tax worked out, exported to Excel and PDF.",
      },
    ],
    localAngle: {
      text: "Any business that moves goods and pays crews by the trip can run on this. That includes delivery services, water refilling stations, construction suppliers and LPG distributors.",
      chips: [
        "Delivery & logistics",
        "Water refilling",
        "Construction supply",
        "LPG distributors",
        "Farm produce",
      ],
    },
  },
  {
    slug: "jimdaisy",
    title: "JimDaisy.com",
    headline: "From word-of-mouth to inbound deals in under a month",
    tagline: "One site for two student-housing properties, built so searches turn into inquiries.",
    kind: "website",
    client: "JimDaisy.com · California",
    builtAt: "client",
    role: "Design, build and launch",
    typeLabel: "Lead-generation website",
    techStack: ["Next.js", "Cloudflare Workers", "Cloudflare R2"],
    liveUrl: "https://jimdaisy.com",
    featured: true,
    order: 4,
    problem:
      "A landlord with two student-housing properties had no web presence. Tenants found the rooms through word of mouth, or not at all.",
    highlights: [
      {
        title: "One site, two properties",
        body: "Each property gets its own pages, photos and details under one brand.",
      },
      {
        title: "Built to be found",
        body: "Fast pages, a Google Business Profile and a custom domain, so local searches land on the site.",
      },
      {
        title: "Inquiries that reach the owner",
        body: "A business email and inquiry form that go straight to the owner. The first online inquiries arrived within weeks.",
      },
    ],
    localAngle: {
      text: "Boarding houses, dorms and apartments near Cebu's universities get found the same way.",
      chips: ["Boarding houses", "Dorms", "Apartments", "Resorts", "Homestays"],
    },
  },
];
