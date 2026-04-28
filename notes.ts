import * as cheerio from "cheerio";
import { writeFileSync } from "fs";

interface JobListing {
  jobId: string;
  title: string;
  url: string;
  jobType: "Full Time" | "Part Time" | "Gig" | "Any" | string;
  employer?: string; // from <img alt> or text before "Posted on"
  posterName?: string; // person's name when no company logo
  postedAt?: string; // ISO from data-temp attribute
  postedAtRaw?: string; // raw "2026-04-27 10:52:45"
  salary?: string;
  snippet?: string;
  skills: string[];
  logoUrl?: string;
}

const BASE_URL = "https://www.onlinejobs.ph";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function buildSearchUrl(page = 1, keyword = "") {
  const params = new URLSearchParams({
    jobkeyword: keyword,
    skill_tags: "",
    gig: "on",
    partTime: "on",
    fullTime: "on",
    isFromJobsearchForm: "1",
  });
  if (page > 1) params.set("pageno", String(page));
  return `${BASE_URL}/jobseekers/jobsearch?${params.toString()}`;
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function parseListings(html: string): JobListing[] {
  const $ = cheerio.load(html);
  const jobs: JobListing[] = [];

  $(".jobpost-cat-box.latest-job-post").each((_, el) => {
    const $card = $(el);

    // ---- URL + jobId ----
    // Title link is the first /jobseekers/job/ anchor inside the card with letters in the slug
    const titleLink = $card
      .find('a[href*="/jobseekers/job/"]')
      .filter((_, a) => /\/job\/[A-Za-z]/.test($(a).attr("href") ?? ""))
      .first();
    const href = titleLink.attr("href");
    if (!href) return;

    const url = href.startsWith("http") ? href : `${BASE_URL}${href}`;
    const jobId = href.match(/-(\d+)(?:\/|$)/)?.[1];
    if (!jobId) return;

    // ---- Title + jobType (badge) ----
    const $h4 = $card.find("h4.fs-16.fw-700").first();
    const $badge = $h4.find("span.badge").first();
    const jobType = $badge.text().trim() || "Any";
    // Clone, remove badge, get clean title text
    const $titleClone = $h4.clone();
    $titleClone.find("span.badge").remove();
    const title = $titleClone.text().replace(/\s+/g, " ").trim();

    // ---- Posted date (ISO from data-temp) ----
    const $postedP = $card.find("p[data-temp]").first();
    const postedAtRaw = $postedP.attr("data-temp");
    // ISO conversion: "2026-04-27 10:52:45" -> "2026-04-27T10:52:45"
    const postedAt = postedAtRaw ? postedAtRaw.replace(" ", "T") : undefined;

    // ---- Employer / Poster name ----
    // Pattern A: card has logo with alt -> that's the employer
    // Pattern B: no logo, but text "Sherry • Posted on..." -> "Sherry" is poster
    // Pattern C: no logo, no name (just "Posted on...") -> nothing
    const $logo = $card.find("img.jobpost-cat-box-logo").first();
    const logoAlt = $logo.attr("alt")?.trim();
    const logoUrl = $logo.attr("src")?.trim();

    let employer: string | undefined;
    let posterName: string | undefined;

    if (logoAlt) {
      employer = logoAlt;
    } else {
      // Extract the text node before the <em>Posted on...</em>
      // The <p> looks like:  "    Sherry •    <em>Posted on 2026-...</em>"
      const pHtml = $postedP.html() ?? "";
      const beforeEm = pHtml.split(/<em>/i)[0] ?? "";
      const cleaned = cheerio
        .load(`<p>${beforeEm}</p>`)("p")
        .text()
        .replace(/[•·]/g, "")
        .trim();
      if (cleaned) posterName = cleaned;
    }

    // ---- Salary (the only <dd> in the dollar dl) ----
    // It's inside a <dl> that has the icon-round-dollar icon
    let salary: string | undefined;
    $card.find("dl").each((_, dl) => {
      const $dl = $(dl);
      if ($dl.find("i.icon-round-dollar").length === 0) return;
      const text = $dl.find("dd").text().trim();
      if (text) salary = text;
    });

    // ---- Snippet (description preview) ----
    const $desc = $card.find(".desc").first();
    // Remove the "See More" link, then collapse whitespace
    const $descClone = $desc.clone();
    $descClone.find('a[target="_blank"]').remove(); // strip "See More"
    // <ojfilter> tags wrap obfuscated email/phone — drop them too
    $descClone.find("ojfilter").remove();
    const snippet = $descClone.text().replace(/\s+/g, " ").trim() || undefined;

    // ---- Skills (job-tag badges) ----
    const skills: string[] = [];
    $card.find(".job-tag a.badge").each((_, a) => {
      const t = $(a).text().trim();
      if (t) skills.push(t);
    });

    jobs.push({
      jobId,
      title,
      url,
      jobType,
      employer,
      posterName,
      postedAt,
      postedAtRaw,
      salary: salary || undefined,
      snippet,
      skills,
      logoUrl,
    });
  });

  return jobs;
}

async function scrape(maxPages = 3, keyword = ""): Promise<JobListing[]> {
  const all: JobListing[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= maxPages; page++) {
    const url = buildSearchUrl(page, keyword);
    console.log(`[${page}/${maxPages}] ${url}`);

    let html: string;
    try {
      html = await fetchPage(url);
    } catch (err) {
      console.error(`  ✗ ${(err as Error).message}`);
      break;
    }

    const jobs = parseListings(html);
    if (jobs.length === 0) {
      console.log("  no listings parsed — end of results or selector mismatch");
      break;
    }

    let newCount = 0;
    for (const job of jobs) {
      if (seen.has(job.jobId)) continue;
      seen.add(job.jobId);
      all.push(job);
      newCount++;
    }
    console.log(`  +${newCount} (total ${all.length})`);
    if (newCount === 0) break;

    await sleep(2500);
  }

  return all;
}

scrape(3).then((jobs) => {
  writeFileSync("jobs.json", JSON.stringify(jobs, null, 2));
  const stats = {
    total: jobs.length,
    salary: jobs.filter((j) => j.salary).length,
    snippet: jobs.filter((j) => j.snippet).length,
    skills: jobs.filter((j) => j.skills.length > 0).length,
    employer: jobs.filter((j) => j.employer).length,
    posterName: jobs.filter((j) => j.posterName).length,
    postedAt: jobs.filter((j) => j.postedAt).length,
  };
  const pct = (n: number) => (stats.total ? Math.round((n / stats.total) * 100) : 0);
  console.log(`\n✓ Saved ${stats.total} jobs to jobs.json`);
  console.log(`  salary:     ${stats.salary}/${stats.total} (${pct(stats.salary)}%)`);
  console.log(`  snippet:    ${stats.snippet}/${stats.total} (${pct(stats.snippet)}%)`);
  console.log(`  skills:     ${stats.skills}/${stats.total} (${pct(stats.skills)}%)`);
  console.log(`  employer:   ${stats.employer}/${stats.total} (${pct(stats.employer)}%)`);
  console.log(`  posterName: ${stats.posterName}/${stats.total} (${pct(stats.posterName)}%)`);
  console.log(`  postedAt:   ${stats.postedAt}/${stats.total} (${pct(stats.postedAt)}%)`);
});
