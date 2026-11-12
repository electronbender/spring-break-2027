(function () {
  const D = window.SB, S = window.SB_SCHOOLS, M = window.SB_MEDIA || {};
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const toDate = (md) => new Date(Date.UTC(2027, +md.slice(0, 2) - 1, +md.slice(3, 5)));
  const fmt = (md) => `${MONTHS[+md.slice(0, 2) - 1]} ${+md.slice(3, 5)}`;
  const range = (a, b) => (a.slice(0, 2) === b.slice(0, 2) ? `${fmt(a)}–${+b.slice(3, 5)}` : `${fmt(a)}–${fmt(b)}`);
  const isoMd = (iso) => iso.slice(5);
  const day = 864e5;

  // Week a break belongs to: the Monday of the first weekday of the break
  const weekOf = (md) => {
    let d = toDate(md);
    const wd = d.getUTCDay();
    if (wd === 6) d = new Date(+d + 2 * day); else if (wd === 0) d = new Date(+d + day);
    const mon = new Date(+d - ((d.getUTCDay() + 6) % 7) * day);
    return `${String(mon.getUTCMonth() + 1).padStart(2, "0")}-${String(mon.getUTCDate()).padStart(2, "0")}`;
  };

  const STATE_NAMES = { AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", QC: "Quebec (Canada)", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming" };

  // ---------- U.S. rows ----------
  const us = S.us.map(([name, st, gs, ge, ss, se]) => {
    const start = gs || ss, end = gs ? ge : se;
    const differ = gs && ss && !(toDate(gs) >= new Date(+toDate(ss) - 2 * day) && toDate(gs) <= toDate(se));
    return { name, st, start, end, week: weekOf(start), gb: gs ? [gs, ge] : null, sts: ss ? [ss, se] : null, differ };
  });
  const weeks = {};
  us.forEach((r) => (weeks[r.week] = (weeks[r.week] || 0) + 1));
  const weekKeys = Object.keys(weeks).sort();
  const maxWeek = Math.max(...Object.values(weeks));
  const busiest = weekKeys.reduce((a, b) => (weeks[b] > weeks[a] ? b : a));
  const sundayAfter = (mon) => { const d = new Date(+toDate(mon) + 6 * day); return `${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`; };
  const weekLabel = (k) => `Week of ${fmt(k)}`;
  const states = [...new Set(us.map((r) => r.st))].sort((a, b) => (STATE_NAMES[a] || a).localeCompare(STATE_NAMES[b] || b));

  const usRow = (r) => {
    const src = r.gb && r.sts ? "Go Blue + STS" : r.gb ? "Go Blue" : "STS";
    const note = r.differ
      ? `<span class="warn">Sources differ: STS lists ${range(...r.sts)}. Check your school's calendar.</span>`
      : !r.gb ? `<span class="muted">Sat–Sat travel week</span>` : "";
    return `<tr data-name="${esc(r.name.toLowerCase())}" data-st="${r.st}" data-week="${r.week}">
      <th scope="row">${esc(r.name)}</th><td>${esc(r.st)}</td>
      <td class="when"><b>${range(r.start, r.end)}</b>${note ? `<small>${note}</small>` : ""}</td>
      <td class="src-col">${src}</td></tr>`;
  };

  // ---------- International rows ----------
  const STATUS = { confirmed: ["confirmed", "Confirmed"], expected: ["partial", "Expected"] };
  const intlRow = (r) => `<tr data-name="${esc(r.name.toLowerCase())}" data-st="${r.region}" data-week="${weekOf(isoMd(r.start))}">
      <th scope="row">${esc(r.name)}<small>${esc(r.country)}</small></th>
      <td class="when"><b>${range(isoMd(r.start), isoMd(r.end))}</b><small>${esc(r.kind)}</small></td>
      <td><span class="badge badge-${STATUS[r.status][0]}">${STATUS[r.status][1]}</span></td>
      <td class="intl-note">${esc(r.note)} <a href="${esc(r.src)}" target="_blank" rel="noopener">Official calendar ↗</a></td></tr>`;
  const eu = S.intl.filter((r) => r.region === "eu"), au = S.intl.filter((r) => r.region === "au");
  const intlTable = (rows, caption) => `<div class="table-scroll"><table class="sched sched-intl">
      <caption class="sr-only">${caption}</caption>
      <thead><tr><th scope="col">University</th><th scope="col">Break 2027</th><th scope="col">Status</th><th scope="col">Details</th></tr></thead>
      <tbody>${rows.map(intlRow).join("")}</tbody></table></div>`;

  // ---------- Prompt link ----------
  const ENGINES = {
    claude: { label: "Claude", base: "https://claude.ai/new?q=" },
    chatgpt: { label: "ChatGPT", base: "https://chatgpt.com/?q=" },
    perplexity: { label: "Perplexity", base: "https://www.perplexity.ai/search?q=" }
  };
  let engine = "claude";
  try { engine = localStorage.getItem("sb27-engine") || "claude"; } catch (e) {}
  if (!ENGINES[engine]) engine = "claude";
  const SUFFIX = " Cite the school's official academic calendar with a link, and flag anything not yet confirmed. Search the web for the latest info.";
  const promptFor = (q) => q
    ? `When is spring break 2027 at ${q}? Give the exact first and last day with no classes, the official academic calendar link, and the best Saturday-to-Saturday travel week for a spring break trip.` + SUFFIX
    : `List Spring Break 2027 dates for the 50 largest U.S. colleges and universities, grouped by week, and identify the busiest weeks in March 2027.` + SUFFIX;
  const link = (q) => ENGINES[engine].base + encodeURIComponent(promptFor(q));

  const hero = (M.dates && M.dates.images[0]) || null;
  const total = us.length + S.intl.length;
  const first = us.reduce((a, b) => (a.start < b.start ? a : b)), last = us.reduce((a, b) => (a.end > b.end ? a : b));
  const topDest = [...D.destinations].sort((a, b) => {
    const s = (x) => { const p = D.popularity[x.id]; return p ? p.v + p.b + p.c : 0; };
    return s(b) - s(a);
  }).slice(0, 8);

  const faq = [
    ["When is spring break 2027 for most colleges?", `Most U.S. colleges break between March 1 and March 26, 2027. The busiest week is the week of ${fmt(busiest)} (${weeks[busiest]} of the ${us.length} schools listed here), followed by the week of ${fmt(weekKeys.filter((k) => k !== busiest).reduce((a, b) => (weeks[b] > weeks[a] ? b : a)))}.`],
    ["How do I find my school's spring break dates?", "Search for your school in the list on this page. Because tour company lists sometimes disagree, always confirm with your school's official academic calendar (usually on the registrar's website) before you book flights or pay a deposit."],
    ["Why do the sources list different dates?", "Tour companies list either the days with no classes (usually Monday to Friday) or the Saturday-to-Saturday travel week around them. We show Go Blue Tours' class-free dates first and flag the schools where STS Travel lists a different week."],
    ["Do European and Australian universities have spring break?", "Not in the American sense. UK and Irish universities have a 3–6 week Easter vacation, most of continental Europe closes only for the Easter holidays, and Australian universities have a one-week mid-semester break, usually around Easter (Good Friday is March 26, 2027)."],
    ["When should I book my spring break trip?", "Book as soon as your dates are confirmed. The two busiest March weeks sell out first at the most popular hotels and party packages, and flight prices rise as the season approaches."]
  ];
  window.SB_PAGE_FAQ = faq;
  window.SB_SCHOOL_STATS = { us: us.length, intl: S.intl.length, busiest, busiestCount: weeks[busiest], weeks, rows: us };

  document.getElementById("schools").innerHTML = `
    <section class="t-hero" style="--hero-img:url('${hero ? "../" + hero.src : ""}')">
      <div class="t-hero-inner wrap">
        <a class="crumb" href="index.html#dates">← Key 2027 dates</a>
        <p class="kicker">College spring break 2027 dates</p>
        <h1>When Is My Spring Break?</h1>
        <p class="lede">Find your school, lock in your dates, then book the trip before your week sells out.</p>
        <p class="updated">Updated <time datetime="${D.asOfISO}">${esc(D.asOf)}</time> · ${us.length} U.S. schools · ${S.intl.length} universities in the UK, Europe and Australia</p>
        <div class="ask">
          <a class="btn btn-ask" id="ask" href="${link("")}" target="_blank" rel="nofollow noopener"><span aria-hidden="true">✦</span> <span id="ask-label">Check the latest dates</span> <span class="engine-name">in ${ENGINES[engine].label}</span></a>
        </div>
      </div>
    </section>

    <div class="wrap"><dl class="facts-row">
      <div><dt>Schools listed</dt><dd>${total}</dd></div>
      <div><dt>Busiest week</dt><dd>${fmt(busiest)}–${+sundayAfter(busiest).slice(3)} · ${weeks[busiest]} schools</dd></div>
      <div><dt>Season</dt><dd>${fmt(first.start)} – ${fmt(last.end)}</dd></div>
      <div><dt>Easter Sunday</dt><dd>Mar 28, 2027</dd></div>
    </dl></div>

    <section class="wrap section" id="weeks">
      <div class="section-head"><h2>Spring break 2027 by week</h2><p>How many U.S. schools on this page start their break each week. Pick a week to see its schools.</p></div>
      <div class="week-bars" role="group" aria-label="Filter schools by week">
        ${weekKeys.map((k) => `<button type="button" class="week-bar${k === busiest ? " peak" : ""}" data-week="${k}" aria-pressed="false">
          <span class="wb-fill" style="--h:${Math.max(4, Math.round((weeks[k] / maxWeek) * 100))}%"></span>
          <b>${weeks[k]}</b><span class="wb-label">${fmt(k)}</span></button>`).join("")}
      </div>
    </section>

    <section class="wrap section" id="find">
      <div class="section-head"><h2>Find your school</h2><p>Dates are the days with no classes. Confirm with your school's official calendar before booking.</p></div>
      <div class="finder">
        <label class="field grow"><span>School</span><input id="q" type="search" placeholder="Start typing your school's name" autocomplete="off"></label>
        <label class="field"><span>State</span><select id="state"><option value="">All states</option>${states.map((s) => `<option value="${s}">${esc(STATE_NAMES[s] || s)}</option>`).join("")}</select></label>
        <label class="field"><span>Week</span><select id="week"><option value="">Any week</option>${weekKeys.map((k) => `<option value="${k}">${weekLabel(k)} (${weeks[k]})</option>`).join("")}</select></label>
      </div>
      <p class="count" id="count" aria-live="polite">Showing all ${us.length} U.S. schools</p>
      <div class="table-scroll tall"><table class="sched" id="us-table">
        <caption class="sr-only">U.S. college spring break 2027 dates</caption>
        <thead><tr><th scope="col">School</th><th scope="col">State</th><th scope="col">Spring break 2027</th><th scope="col">Source</th></tr></thead>
        <tbody>${us.map(usRow).join("")}</tbody>
      </table></div>
      <p class="empty" id="empty" hidden>No school matches. Try a shorter name, or <a id="empty-ask" href="${link("")}" target="_blank" rel="nofollow noopener">ask an AI assistant</a> to look up your school's calendar.</p>
    </section>

    <section class="wrap section" id="europe">
      <div class="section-head"><h2>UK &amp; Europe</h2><p>European universities don't have an American-style spring break. UK and Irish schools take a long Easter vacation; most of the continent closes only for Easter weekend. Greece follows Orthodox Easter (May 2, 2027).</p></div>
      ${intlTable(eu, "UK and European university Easter breaks 2027")}
    </section>

    <section class="wrap section" id="australia">
      <div class="section-head"><h2>Australia</h2><p>Australian universities take a one-week mid-semester break in Semester 1, usually around Easter (Good Friday Mar 26 to Easter Monday Mar 29, 2027). Many haven't published 2027 dates yet; those are marked Expected.</p></div>
      ${intlTable(au, "Australian university mid-semester breaks 2027")}
    </section>

    <section class="wrap section" id="book">
      <div class="section-head"><h2>Got your week? Plan the trip</h2><p>The two busiest weeks sell out first. Compare destinations and packages now.</p></div>
      <div class="more">${topDest.map((d) => `<a class="chip" href="destinations/${d.id}.html">${esc(d.name)}</a>`).join("")}
        <a class="chip" href="topics/packages.html">Package types explained</a><a class="chip" href="index.html#companies">Tour companies</a><a class="chip" href="topics/dates.html">2027 week-by-week guide</a></div>
    </section>

    <section class="wrap section faq">
      <div class="section-head"><h2>Spring break dates FAQ</h2></div>
      ${faq.map(([q, a]) => `<details open><summary><h3>${esc(q)}</h3></summary><p>${esc(a)}</p></details>`).join("")}
    </section>

    <section class="wrap section credits">
      <h2>Sources</h2>
      <ul>${Object.values(S.sources).map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a>: ${esc(s.note)}.</li>`).join("")}
        <li>International dates: each university's official academic calendar, linked in the tables above.</li></ul>
    </section>`;

  // ---------- Filtering ----------
  const q = document.getElementById("q"), stSel = document.getElementById("state"), wkSel = document.getElementById("week");
  const rows = () => document.querySelectorAll("#us-table tbody tr");
  function apply() {
    const term = (q.value || "").trim().toLowerCase(), st = stSel.value, wk = wkSel.value;
    let n = 0, only = null;
    rows().forEach((tr) => {
      const ok = (!term || tr.dataset.name.includes(term)) && (!st || tr.dataset.st === st) && (!wk || tr.dataset.week === wk);
      tr.hidden = !ok; if (ok) { n++; only = tr; }
    });
    document.querySelectorAll(".sched-intl tbody tr").forEach((tr) => {
      tr.hidden = !!term && !tr.dataset.name.includes(term);
    });
    document.querySelectorAll(".week-bar").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.week === wk)));
    const filtered = term || st || wk;
    document.getElementById("count").textContent = filtered ? `Showing ${n} of ${us.length} U.S. schools` : `Showing all ${us.length} U.S. schools`;
    document.getElementById("empty").hidden = n > 0;
    const askQ = !term ? "" : n === 1 ? only.querySelector("th").textContent : q.value.trim();
    document.getElementById("ask").href = link(askQ);
    document.getElementById("empty-ask").href = link(askQ);
    document.getElementById("ask-label").textContent = askQ ? `Check ${askQ}'s dates` : "Check the latest dates";
  }
  q.addEventListener("input", apply);
  stSel.addEventListener("change", apply);
  wkSel.addEventListener("change", apply);
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".week-bar");
    if (!b) return;
    wkSel.value = wkSel.value === b.dataset.week ? "" : b.dataset.week;
    apply();
    document.getElementById("find").scrollIntoView({ behavior: "smooth" });
  });
  const sel = document.getElementById("engine");
  sel.value = engine;
  sel.addEventListener("change", () => {
    engine = sel.value;
    try { localStorage.setItem("sb27-engine", engine); } catch (err) {}
    document.querySelector("#ask .engine-name").textContent = "in " + ENGINES[engine].label;
    apply();
  });
  try { const p = new URLSearchParams(location.search).get("school"); if (p) { q.value = p; apply(); } } catch (e) {}
})();
