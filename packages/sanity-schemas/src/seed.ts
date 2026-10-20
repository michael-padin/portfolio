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
  /** Paths under apps/web/public. The seed script uploads them to Sanity. */
  cover?: SeedImage;
  gallery?: SeedImage[];
}

export interface SeedImage {
  src: string;
  alt: string;
  caption?: string;
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
    cover: {
      src: "/work/hermosa-glow/calendar.webp",
      alt: "Hermosa Glow staff calendar: a day of bookings across facial beds, the laser and body machines, with check-ins and a booking waiting for confirmation",
    },
    gallery: [
      {
        src: "/work/hermosa-glow/booking.webp",
        alt: "Online booking page with a treatment picked and the free times for the week",
        caption: "Online booking: pick a treatment, see the free times, done.",
      },
      {
        src: "/work/hermosa-glow/today.webp",
        alt: "Owner's today screen listing the day's visits and a to-do list",
        caption: "The owner's morning view: today's visits and what needs doing.",
      },
      {
        src: "/work/hermosa-glow/website.webp",
        alt: "Hermosa Glow public website homepage",
        caption: "The clinic's website, where bookings start.",
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
    cover: {
      src: "/work/mil/dashboard.webp",
      alt: "MIL dashboard with today's takings by payment method, best-selling designs and tasks that need doing",
    },
    gallery: [
      {
        src: "/work/mil/inventory.webp",
        alt: "Inventory list of shoe designs by colour, size and branch, with a low-stock flag",
        caption: "Stock by design, colour and size for every branch, with low-stock flags.",
      },
      {
        src: "/work/mil/payroll.webp",
        alt: "Payroll for a pay period with hours, overtime and net pay per employee",
        caption: "Payroll worked out from attendance, ready to approve.",
      },
      {
        src: "/work/mil/income-statement.webp",
        alt: "Monthly income statement with sales, cost of goods and operating expenses",
        caption: "The month's numbers without rebuilding a spreadsheet.",
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
    cover: {
      src: "/work/kasper-trucking/payroll.webp",
      alt: "Kasper Trucking pay week: net pay, deliveries and bags, and a payslip row for each crew member",
    },
    gallery: [
      {
        src: "/work/kasper-trucking/dashboard.webp",
        alt: "Overview of the week's deliveries, bags hauled and deliveries still without a receipt",
        caption: "The week at a glance, including what still needs a receipt.",
      },
      {
        src: "/work/kasper-trucking/billing.webp",
        alt: "Client billing statement with delivered kilos per route, VAT and withholding tax",
        caption: "A client statement with VAT and withholding worked out.",
      },
      {
        src: "/work/kasper-trucking/delivery.webp",
        alt: "One truck run with five drops, bag counts and the crew's pay",
        caption: "One run, five drops: bags, crew pay and the delivery receipt.",
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
