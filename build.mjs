// Static site build: pre-renders every page to plain HTML (so search engines and AI crawlers
// see the full content without running JavaScript), adds SEO metadata + JSON-LD, and writes
// sitemap.xml, robots.txt, llms.txt, llms-full.txt and a Markdown copy of every page.
//
//   node build.mjs                      # uses the default SITE_URL below
//   SITE_URL=https://www.springbreak.com node build.mjs
//
// Edit content in assets/*.js and layout in templates/*.html, then rebuild.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const SITE_URL = (process.env.SITE_URL || "https://springbreak.com").replace(/\/$/, "");
const SITE_NAME = "Springbreak.com";
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const write = (p, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), s); };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)) + "…");
// Keep <title> within ~65 chars: try each variant with the site name, then without
const fit = (...v) => { for (const t of v) if ((t + " | " + SITE_NAME).length <= 65) return t + " | " + SITE_NAME; return v[v.length - 1]; };
const abs = (p) => `${SITE_URL}/${p.replace(/^\.\.\//, "").replace(/^\//, "")}`;

// ---------- 1. Image dimensions (width/height attributes prevent layout shift) ----------
function jpegSize(file) {
  const b = fs.readFileSync(file);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1], len = b.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}
for (const [file, global] of [["assets/topic-media.js", "SB_MEDIA"], ["assets/destination-media.js", "SB_DEST_MEDIA"]]) {
  const src = read(file);
  const start = src.indexOf(`window.${global} = `);
  const header = src.slice(0, start);
  const data = JSON.parse(src.slice(start + `window.${global} = `.length).trim().replace(/;$/, ""));
  for (const m of Object.values(data)) for (const im of m.images) {
    const sz = jpegSize(path.join(ROOT, im.src));
    if (sz) Object.assign(im, sz);
  }
  write(file, header + `window.${global} = ` + JSON.stringify(data, null, 1) + ";\n");
}

// ---------- 2. Run the browser renderers in a sandbox with a tiny DOM stub ----------
function render(scripts, dataset = {}) {
  const els = {};
  const el = (id) => (els[id] ||= {
    id, innerHTML: "", textContent: "", value: "", dataset: {}, href: "",
    style: { setProperty() {}, getPropertyValue: () => "" }, classList: { add() {}, remove() {} },
    addEventListener() {}, setAttribute() {}, getAttribute: () => "", appendChild() {}, replaceWith() {},
    querySelector: () => el("_q"), querySelectorAll: () => []
  });
  const ctx = {
    console, Date, Math, JSON, encodeURIComponent, setTimeout, clearTimeout, Promise,
    localStorage: { getItem: () => null, setItem() {} }, navigator: {},
    document: { getElementById: el, querySelector: () => el("_q"), querySelectorAll: () => [], addEventListener() {},
      createElement: () => el("_c"), body: { dataset }, title: "" }
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  for (const s of scripts) vm.runInContext(read(s), ctx, { filename: s });
  return { els, ctx };
}
function inject(html, els) {
  for (const [id, e] of Object.entries(els)) {
    const content = e.innerHTML || e.textContent;
    if (!content || id.startsWith("_")) continue;
    const re = new RegExp(`(<(\\w+)[^>]*\\sid="${id}"[^>]*>)[^<]*(</\\2>)`);
    html = html.replace(re, (_, open, tag, close) => open + content + close);
  }
  return html;
}

// ---------- 3. Load data (for metadata, JSON-LD and Markdown) ----------
const DATA_SCRIPTS = ["assets/data.js", "assets/topic-media.js", "assets/topic-content.js", "assets/destination-media.js", "assets/destination-content.js"];
const { ctx: G } = render(DATA_SCRIPTS);
const D = G.SB, TM = G.SB_MEDIA, TC = G.SB_TOPICS, DM = G.SB_DEST_MEDIA, DC = G.SB_DEST;
const MODIFIED = D.asOfISO;
const score = (id) => { const p = D.popularity[id]; return p ? Math.round(((p.v + p.b + p.c) / 15) * 100) : 0; };
const ranked = [...D.destinations].sort((a, b) => score(b.id) - score(a.id));
const srcUrl = (k) => (D.sources[k] || {}).url;

const PUBLISHER = { "@type": "Organization", name: SITE_NAME, url: SITE_URL + "/" };
function head({ title, description, url, image, type = "website", jsonld = [], preload }) {
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">`,
    `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" type="text/markdown" href="${url.replace(/\.html$/, ".md").replace(/\/$/, "/index.md")}" title="Markdown version">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${url}">`,
    image ? `<meta property="og:image" content="${image}">` : "",
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    image ? `<meta name="twitter:image" content="${image}">` : "",
    preload ? `<link rel="preload" as="image" href="${preload}">` : "",
    ...jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", ...j }).replace(/</g, "\\u003c")}</script>`)
  ].filter(Boolean).join("\n  ");
}
const crumbs = (items) => ({ "@type": "BreadcrumbList", itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: url })) });
const faqLd = (faq) => ({ "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });

// ---------- 4. Home page ----------
const homeFaq = [
  ["When is spring break 2027?", "Most U.S. college spring breaks in 2027 fall between March 6 and March 28. Easter is March 28, 2027, so the season is early and compressed. Texas schools usually share one mid-March week."],
  ["What are the most popular spring break destinations?", `Based on our Spring Break 2026 popularity rating, the top destinations are ${ranked.slice(0, 5).map((d) => `${d.name} (${score(d.id)}/100)`).join(", ")}.`],
  ["When is Ultra Music Festival 2027?", "Ultra Music Festival Miami runs March 26–28, 2027 at Bayfront Park, closing out Miami Music Week (March 22–28). Calvin Harris leads the Phase 1 lineup."],
  ["Which tour companies offer Spring Break 2027 trips?", "STS Travel (Cancun, Cabo, Punta Cana, Nassau, Montego Bay, Riviera Maya, Las Vegas and new Guanacaste, Costa Rica), StudentCity (Cancun, Punta Cana, Cabo, Nassau) and Inertia Tours (South Padre Island, Cancun, Cabo)."],
  ["What's new for Spring Break 2027?", "STS Travel added Guanacaste, Costa Rica as an adventure-focused destination, and named Cancun, Cabo, Punta Cana and Nassau its top 2027 picks."]
];
const homeFaqHtml = homeFaq.map(([q, a]) => `<details open><summary><h3>${esc(q)}</h3></summary><p>${esc(a)}</p></details>`).join("");
const EVENT_PLACES = {
  "Miami Music Week": { name: "Miami and Miami Beach", addressLocality: "Miami", addressRegion: "FL" },
  "Winter Music Conference": { name: "Kimpton EPIC Hotel", addressLocality: "Miami", addressRegion: "FL" },
  "Ultra Music Festival (27th edition)": { name: "Bayfront Park", addressLocality: "Miami", addressRegion: "FL" }
};
const events = D.keyDates.filter((k) => EVENT_PLACES[k.label]).map((k) => ({
  "@type": "Event", name: k.label.replace(" (27th edition)", " 2027"), startDate: k.date, endDate: k.end || k.date, description: k.note,
  eventStatus: "https://schema.org/EventScheduled", eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: { "@type": "Place", name: EVENT_PLACES[k.label].name, address: { "@type": "PostalAddress", addressLocality: EVENT_PLACES[k.label].addressLocality, addressRegion: EVENT_PLACES[k.label].addressRegion, addressCountry: "US" } },
  ...(srcUrl(k.src) ? { url: srcUrl(k.src) } : {})
}));
{
  const { els } = render([...DATA_SCRIPTS.slice(0, 2), "assets/app.js"]);
  els["home-faq"] = { innerHTML: homeFaqHtml };
  const title = "Spring Break 2027: Destinations, Concerts & Trips | Springbreak.com";
  const description = "Plan Spring Break 2027: 21 destinations ranked by 2026 popularity, 2027 dates, Ultra and beach concerts, StudentCity, STS and Inertia packages, and travel guides.";
  let html = read("templates/index.html").replace("<!--HEAD-->", head({
    title, description, url: SITE_URL + "/", image: abs(DM.cancun.images[0].src),
    jsonld: [
      { "@type": "WebSite", name: SITE_NAME, url: SITE_URL + "/", description, publisher: PUBLISHER },
      { "@type": "ItemList", name: "Spring Break 2027 destinations ranked by 2026 popularity", itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: ranked.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: d.name, url: abs(`destinations/${d.id}.html`) })) },
      ...events, faqLd(homeFaq)
    ]
  }));
  write("index.html", inject(html, els));
}

// ---------- 5. Topic pages ----------
for (const t of D.topics) {
  const { els } = render([...DATA_SCRIPTS.slice(0, 3), "assets/topic.js"], { topic: t.id });
  const c = TC[t.id], hero = TM[t.id].images[0];
  const url = abs(`topics/${t.id}.html`);
  const title = fit(`${t.name}: Spring Break 2027 Guide`, `${t.name}: Spring Break 2027`, `${t.name} Guide`);
  const description = clip(c.lead);
  let html = read("templates/topic.html").replace(/\{\{ID\}\}/g, t.id).replace("<!--HEAD-->", head({
    title, description, url, type: "article", image: abs(hero.src), preload: "../" + hero.src,
    jsonld: [
      { "@type": "Article", headline: `${t.name}: Spring Break 2027`, description: c.lead, image: abs(hero.src), url,
        datePublished: MODIFIED, dateModified: MODIFIED, author: PUBLISHER, publisher: PUBLISHER, mainEntityOfPage: url,
        about: { "@type": "Thing", name: "Spring break" } },
      crumbs([[SITE_NAME, SITE_URL + "/"], ["Guides", SITE_URL + "/#guides"], [t.name, url]])
    ]
  }));
  write(`topics/${t.id}.html`, inject(html, els));
}

// ---------- 6. Destination pages ----------
const COUNTRY = { USA: "United States", Mexico: "Mexico" };
const destFaq = {};
for (const d of D.destinations) {
  const { els, ctx } = render([...DATA_SCRIPTS.slice(0, 1), "assets/destination-media.js", "assets/destination-content.js", "assets/destination.js"], { dest: d.id });
  destFaq[d.id] = ctx.SB_PAGE_FAQ;
  const c = DC[d.id], hero = DM[d.id].images[0];
  const url = abs(`destinations/${d.id}.html`);
  const title = fit(`${d.name} Spring Break 2027: Clubs, Hotels & Tips`, `${d.name} Spring Break 2027 Guide`);
  const description = clip(c.lead);
  let html = read("templates/destination.html").replace(/\{\{ID\}\}/g, d.id).replace("<!--HEAD-->", head({
    title, description, url, type: "article", image: abs(hero.src), preload: "../" + hero.src,
    jsonld: [
      { "@type": "TouristDestination", name: d.name, description: c.lead, url, image: DM[d.id].images.map((i) => abs(i.src)),
        touristType: ["College students", "Spring breakers"],
        containedInPlace: { "@type": "Place", name: `${d.state}${COUNTRY[d.region] ? ", " + COUNTRY[d.region] : ""}` } },
      { "@type": "Article", headline: `${d.name} Spring Break 2027 Guide`, description: c.lead, image: abs(hero.src), url,
        datePublished: MODIFIED, dateModified: MODIFIED, author: PUBLISHER, publisher: PUBLISHER, mainEntityOfPage: url },
      crumbs([[SITE_NAME, SITE_URL + "/"], ["Destinations", SITE_URL + "/#destinations"], [d.name, url]]),
      faqLd(ctx.SB_PAGE_FAQ)
    ]
  }));
  write(`destinations/${d.id}.html`, inject(html, els));
}

// ---------- 6b. When Is My Spring Break? (school dates) ----------
const SCHOOL = (() => {
  const { els, ctx } = render([...DATA_SCRIPTS.slice(0, 2), "assets/school-dates.js", "assets/schools.js"], { page: "schools" });
  const st = ctx.SB_SCHOOL_STATS, faq = ctx.SB_PAGE_FAQ, S = ctx.SB_SCHOOLS;
  const url = abs("when-is-my-spring-break.html"), hero = TM.dates.images[0];
  const title = "When Is My Spring Break? College Dates 2027 | Springbreak.com";
  const description = `Spring break 2027 dates for ${st.us} U.S. colleges plus UK, European and Australian universities. Find your school's week, then book before it sells out.`;
  const html = read("templates/schools.html").replace("<!--HEAD-->", head({
    title, description, url, type: "article", image: abs(hero.src), preload: hero.src,
    jsonld: [
      { "@type": "Dataset", name: "College spring break 2027 dates", description, url, temporalCoverage: "2027-02/2027-05",
        spatialCoverage: ["United States", "United Kingdom", "Europe", "Australia"], dateModified: MODIFIED, creator: PUBLISHER,
        isBasedOn: Object.values(S.sources).map((x) => x.url), variableMeasured: ["School", "State or country", "Spring break start date", "Spring break end date"] },
      { "@type": "Article", headline: "When Is My Spring Break? College Spring Break 2027 Dates", description, image: abs(hero.src), url,
        datePublished: MODIFIED, dateModified: MODIFIED, author: PUBLISHER, publisher: PUBLISHER, mainEntityOfPage: url },
      crumbs([[SITE_NAME, SITE_URL + "/"], ["Key 2027 dates", SITE_URL + "/#dates"], ["When Is My Spring Break?", url]]),
      faqLd(faq)
    ]
  }));
  write("when-is-my-spring-break.html", inject(html, els));
  return { st, faq, S, url };
})();
// ---------- 7. Markdown copies + llms.txt / llms-full.txt ----------
const mdList = (arr) => arr.map((x) => `- ${x}`).join("\n");
const mdSections = (secs) => secs.map((s) => `## ${s.h}\n\n${(s.p || []).join("\n\n")}${s.p && s.list ? "\n\n" : ""}${s.list ? mdList(s.list) : ""}`).join("\n\n");
const company = (id) => (D.companies.find((c) => c.id === id) || {}).name || id;
const STATUS = { confirmed: "confirmed for 2027", partial: "partly announced", tba: "TBA" };

function destMd(d) {
  const c = DC[d.id], p = D.popularity[d.id], rank = ranked.findIndex((x) => x.id === d.id) + 1;
  return `# ${d.name} Spring Break 2027 Guide

> ${c.lead}

URL: ${abs(`destinations/${d.id}.html`)}
Location: ${d.state}, ${d.region}
Updated: ${MODIFIED}
2027 status: ${STATUS[d.status]}

## Key facts

${mdList(c.facts.map(([k, v]) => `${k}: ${v}`))}

## 2026 popularity rating

Score: ${score(d.id)}/100 (rank #${rank} of ${D.destinations.length}; visitation ${p.v}/5, search & social buzz ${p.b}/5, spring-break crowd ${p.c}/5; ${p.conf} confidence)

${mdList(p.ev.map(([t, s]) => t + (srcUrl(s) ? ` (source: ${srcUrl(s)})` : "")))}

## 2027 events and packages

${mdList(d.events2027.map((e) => `${e.name}: ${e.when} [${STATUS[e.status] || e.status}]${srcUrl(e.src) ? ` (source: ${srcUrl(e.src)})` : ""}`))}
${d.operators.length ? `\nTour operators: ${d.operators.map(company).join(", ")}\n` : ""}${d.note ? `\nNote: ${d.note}\n` : ""}
${mdSections(c.sections)}

## FAQ

${destFaq[d.id].map(([q, a]) => `### ${q}\n\n${a}`).join("\n\n")}

## Videos

${mdList(DM[d.id].videos.map((v) => `${v.title} (${v.channel}): https://www.youtube.com/watch?v=${v.id}`))}
`;
}
function topicMd(t) {
  const c = TC[t.id];
  return `# ${t.name}: Spring Break 2027 Guide

> ${c.lead}

URL: ${abs(`topics/${t.id}.html`)}
Updated: ${MODIFIED}

## Key facts

${mdList(c.facts.map(([k, v]) => `${k}: ${v}`))}

${mdSections(c.sections)}

## Videos

${mdList(TM[t.id].videos.map((v) => `${v.title} (${v.channel}): https://www.youtube.com/watch?v=${v.id}`))}
`;
}
const homeMd = `# Spring Break 2027 | ${SITE_NAME}

> Destinations, parties, concerts and tour packages for Spring Break 2027, with 2026 popularity ratings and 2027 announcements from the major college tour companies and festivals.

URL: ${SITE_URL}/
Updated: ${MODIFIED}

## Key 2027 dates

${mdList(D.keyDates.map((k) => (k.href ? `[${k.label}](${abs(k.href)})` : k.label) + `: ${k.date}${k.end ? " to " + k.end : ""}. ${k.note}${srcUrl(k.src) ? ` (source: ${srcUrl(k.src)})` : ""}`))}

## Destinations ranked by Spring Break 2026 popularity

Score = (visitation + search/social buzz + spring-break crowd) / 15 × 100, each signal rated 1–5 from public 2026 data.

| Rank | Destination | Region | Score | 2027 status |
|---|---|---|---|---|
${ranked.map((d, i) => `| ${i + 1} | [${d.name}](${abs(`destinations/${d.id}.html`)}) | ${d.region} | ${score(d.id)} | ${STATUS[d.status]} |`).join("\n")}

## Spring break and college tour companies

${D.companies.map((c) => `### ${c.name}\n\n${c.url ? `Website: ${c.url}\n` : ""}${c.phone ? `Phone: ${c.phone}\n` : ""}${c.focus.length ? `Destinations: ${c.focus.join(", ")}\n` : ""}\n${mdList(c.facts)}\n\nStill to be announced: ${c.gap}`).join("\n\n")}

## FAQ

${homeFaq.map(([q, a]) => `### ${q}\n\n${a}`).join("\n\n")}

## Sources

${mdList(Object.values(D.sources).map((s) => `${s.label}: ${s.url}`))}
`;
const mdDate = (md) => `2027-${md}`;
const schoolsMd = `# When Is My Spring Break? College Spring Break 2027 Dates

> Find your school, lock in your dates, then book the trip before your week sells out. ${SCHOOL.st.us} U.S. colleges plus ${SCHOOL.st.intl} universities in the UK, Europe and Australia.

URL: ${SCHOOL.url}
Updated: ${MODIFIED}

Dates are the days with no classes. U.S. rows merge Go Blue Tours (class-free dates, verified July 2026) and STS Travel (Saturday-to-Saturday travel weeks); where they disagreed, the school's official 2026–27 calendar was checked (${SCHOOL.st.verified} schools, marked in the Note column). Always confirm with your school's official academic calendar.

## U.S. schools by week

${Object.keys(SCHOOL.st.weeks).sort().map((k) => `- Week of 2027-${k}: ${SCHOOL.st.weeks[k]} schools`).join("\n")}

## U.S. colleges and universities

| School | State | Spring break 2027 | Note |
|---|---|---|---|
${SCHOOL.st.rows.map((r) => `| ${r.name} | ${r.st} | ${mdDate(r.start)} to ${mdDate(r.end)} | ${r.v ? `Checked with official calendar: ${r.v.src}` : r.differ ? `STS lists ${mdDate(r.sts[0])} to ${mdDate(r.sts[1])}; confirm with school` : r.gb ? "" : "STS travel week"} |`).join("\n")}

## UK and Europe

| University | Country | Break 2027 | Type | Status | Official calendar |
|---|---|---|---|---|---|
${SCHOOL.S.intl.filter((r) => r.region === "eu").map((r) => `| ${r.name} | ${r.country} | ${r.start} to ${r.end} | ${r.kind} | ${r.status} | ${r.src} |`).join("\n")}

## Australia

| University | Break 2027 | Type | Status | Official calendar |
|---|---|---|---|---|
${SCHOOL.S.intl.filter((r) => r.region === "au").map((r) => `| ${r.name} | ${r.start} to ${r.end} | ${r.kind} | ${r.status} | ${r.src} |`).join("\n")}

## FAQ

${SCHOOL.faq.map(([q, a]) => `### ${q}\n\n${a}`).join("\n\n")}

## Sources

${mdList(Object.values(SCHOOL.S.sources).map((x) => `${x.label}: ${x.url} (${x.note})`))}
`;

write("index.md", homeMd);
for (const d of D.destinations) write(`destinations/${d.id}.md`, destMd(d));
for (const t of D.topics) write(`topics/${t.id}.md`, topicMd(t));
write("when-is-my-spring-break.md", schoolsMd);

write("llms.txt", `# ${SITE_NAME}: Spring Break 2027

> The Springbreak.com guide to college spring break 2027: ${D.destinations.length} destinations ranked by Spring Break 2026 popularity, 2027 dates and festivals (Ultra Miami Mar 26–28, 2027), tour packages from StudentCity, STS Travel and Inertia Tours, and planning guides. Facts are current as of ${D.asOf}; 2027 items not yet announced are marked TBA.

Each page has a Markdown version at the same path with a .md extension. The full site in one file: ${SITE_URL}/llms-full.txt

## Overview

- [Home: dates, popularity ranking, tour companies](${SITE_URL}/index.md): key 2027 dates, ranked destinations and FAQ
- [When Is My Spring Break?](${SITE_URL}/when-is-my-spring-break.md): spring break 2027 dates for ${SCHOOL.st.us} U.S. colleges plus UK, European and Australian universities

## Destinations

${ranked.map((d) => `- [${d.name}](${abs(`destinations/${d.id}.md`)}): ${d.state}, ${d.region}. 2026 popularity ${score(d.id)}/100. ${d.vibe}`).join("\n")}

## Guides

${D.topics.map((t) => `- [${t.name}](${abs(`topics/${t.id}.md`)}): ${t.blurb}`).join("\n")}

## Optional

- [Full site text](${SITE_URL}/llms-full.txt): every page above in one Markdown file
`);
write("llms-full.txt", [homeMd, schoolsMd, ...ranked.map(destMd), ...D.topics.map(topicMd)].join("\n\n---\n\n"));

// ---------- 8. sitemap.xml + robots.txt ----------
const urls = [SITE_URL + "/", SCHOOL.url, ...D.destinations.map((d) => abs(`destinations/${d.id}.html`)), ...D.topics.map((t) => abs(`topics/${t.id}.html`))];
// Images per page (Google image sitemap extension) so photos can show in image search
const PAGE_IMAGES = {
  [SITE_URL + "/"]: [DM.cancun.images[0]],
  [SCHOOL.url]: [TM.dates.images[0]],
  ...Object.fromEntries(D.destinations.map((d) => [abs(`destinations/${d.id}.html`), DM[d.id].images])),
  ...Object.fromEntries(D.topics.map((t) => [abs(`topics/${t.id}.html`), TM[t.id].images]))
};
const xmlEsc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `  <url>
    <loc>${xmlEsc(u)}</loc>
    <lastmod>${MODIFIED}</lastmod>${(PAGE_IMAGES[u] || []).filter(Boolean).map((im) => `
    <image:image><image:loc>${xmlEsc(abs(im.src))}</image:loc></image:image>`).join("")}
  </url>`).join("\n")}
</urlset>
`);
write("robots.txt", `# Search engines and AI assistants are welcome to crawl and cite this site.
User-agent: *
Allow: /
Disallow: /templates/

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);

console.log(`Built ${urls.length} pages for ${SITE_URL}: index, ${D.destinations.length} destinations, ${D.topics.length} topics, sitemap.xml, robots.txt, llms.txt, llms-full.txt and ${urls.length} .md files.`);
