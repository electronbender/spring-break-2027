(function () {
  const D = window.SB;

  // ---------- AI engines for pre-filled prompt links ----------
  const ENGINES = {
    claude: { label: "Claude", base: "https://claude.ai/new?q=" },
    chatgpt: { label: "ChatGPT", base: "https://chatgpt.com/?q=" },
    perplexity: { label: "Perplexity", base: "https://www.perplexity.ai/search?q=" }
  };
  let engine = "claude";
  try { engine = localStorage.getItem("sb27-engine") || "claude"; } catch (e) {}
  if (!ENGINES[engine]) engine = "claude";

  const SUFFIX =
    " Cite every fact with a source link and publish date, and clearly flag anything not yet confirmed for 2027. Today's date matters, so search the web for the latest info.";

  // ---------- Prompt builders ----------
  function destPrompt(d) {
    return (
      `Give me the most up-to-date information for Spring Break 2027 in ${d.name}, ${d.state}. Include: ` +
      `(1) confirmed concerts, parties, pool parties and club events with artist names, dates, venues and ticket links; ` +
      `(2) 2027 packages from StudentCity, STS Travel, Inertia Tours and other college tour companies, with prices and what's included; ` +
      `(3) top student hotels and party venues; ` +
      `(4) local rules, curfews, age limits and entry/travel requirements; ` +
      `(5) the cheapest and busiest weeks to go. Use springbreak.com (${d.sbUrl}) as a reference.` + SUFFIX
    );
  }
  function companyPrompt(c) {
    return (
      `What are ${c.name}'s Spring Break 2027 offerings? List every destination, hotel, departure city, price (with and without flights), ` +
      `party package / VIP pass contents, announced 2027 concerts or headliners, deposit and refund policy, booking deadlines, ` +
      `and recent customer reviews.` + SUFFIX
    );
  }
  function eventPrompt(k) {
    return `Give me the latest details on ${k.label} (${fmtRange(k)}): full lineup or schedule, ticket prices, venues, and related parties or after-parties for spring breakers.` + SUFFIX;
  }
  const topicPrompt = (t) => t.prompt + SUFFIX;

  const link = (prompt) => ENGINES[engine].base + encodeURIComponent(prompt);

  // ---------- Helpers ----------
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function fmt(iso) { const [y, m, d] = iso.split("-").map(Number); return `${MONTHS[m - 1]} ${d}`; }
  function fmtRange(k) { return k.end ? `${fmt(k.date)}–${fmt(k.end)}, 2027` : `${fmt(k.date)}, 2027`; }
  const STATUS = { confirmed: "2027 confirmed", partial: "Partly announced", tba: "TBA" };
  const badge = (s) => `<span class="badge badge-${s}">${STATUS[s]}</span>`;
  const srcLink = (key) => { const s = D.sources[key]; return s ? ` <a class="src" href="${s.url}" target="_blank" rel="noopener" title="${esc(s.label)}">source</a>` : ""; };

  function askButtons(prompt, label) {
    return `<div class="ask">
      <a class="btn btn-ask" data-prompt="${esc(prompt)}" href="${link(prompt)}" target="_blank" rel="noopener">
        <span aria-hidden="true">✦</span> ${esc(label || "Get 2027 update")} <span class="engine-name">in ${ENGINES[engine].label}</span>
      </a>
      <button class="btn btn-ghost btn-copy" type="button" data-prompt="${esc(prompt)}" aria-label="Copy prompt">Copy prompt</button>
    </div>`;
  }

  // ---------- Countdown ----------
  function renderCountdown() {
    const target = new Date("2027-03-06T00:00:00");
    const days = Math.max(0, Math.ceil((target - new Date()) / 86400000));
    document.getElementById("countdown").textContent = days;
  }

  // ---------- Key dates ----------
  function renderDates() {
    document.getElementById("dates-list").innerHTML = D.keyDates.map((k) => `
      <li class="date-item">
        <div class="date-chip"><span>${fmt(k.date).split(" ")[0]}</span><b>${fmt(k.date).split(" ")[1]}${k.end ? "–" + fmt(k.end).split(" ")[1] : ""}</b></div>
        <div class="date-body">
          <h3>${esc(k.label)}</h3>
          <p>${esc(k.note)}${k.src ? srcLink(k.src) : ""}</p>
          ${askButtons(eventPrompt(k), "Latest details")}
        </div>
      </li>`).join("");
  }

  // ---------- Companies ----------
  function renderCompanies() {
    document.getElementById("company-grid").innerHTML = D.companies.map((c) => `
      <article class="card company ${c.status === "tba" ? "card-muted" : ""}">
        <header class="card-head">
          <h3>${c.url ? `<a href="${c.url}" target="_blank" rel="noopener">${esc(c.name)}</a>` : esc(c.name)}</h3>
          ${badge(c.status)}
        </header>
        ${c.hq || c.phone ? `<p class="meta">${[c.hq, c.phone].filter(Boolean).map(esc).join(" · ")}</p>` : ""}
        ${c.focus.length ? `<div class="tags">${c.focus.map((f) => `<span class="tag">${esc(f)}</span>`).join("")}</div>` : ""}
        <ul class="facts">${c.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
        <p class="gap">${esc(c.gap)}</p>
        ${askButtons(companyPrompt(c), "2027 packages")}
      </article>`).join("");
  }

  // ---------- Popularity ----------
  const popScore = (id) => { const p = D.popularity[id]; return p ? Math.round(((p.v + p.b + p.c) / 15) * 100) : 0; };
  const ranked = [...D.destinations].sort((a, b) => popScore(b.id) - popScore(a.id));
  const popRank = (id) => ranked.findIndex((d) => d.id === id) + 1;
  function heat(score) {
    if (score >= 85) return { label: "Red-hot", cls: "h5" };
    if (score >= 70) return { label: "Hot", cls: "h4" };
    if (score >= 55) return { label: "Warm", cls: "h3" };
    if (score >= 40) return { label: "Mild", cls: "h2" };
    return { label: "Quiet", cls: "h1" };
  }
  function popPrompt(d) {
    return `How popular was ${d.name}, ${d.state} during Spring Break 2026 (March to early April 2026)? Give visitor/arrival numbers, airport traffic, hotel occupancy, year-over-year change, booking-platform rankings, and social media buzz (TikTok, Instagram, Google Trends), then compare with other top spring break destinations.` + SUFFIX;
  }
  function popBlock(d) {
    const p = D.popularity[d.id]; if (!p) return "";
    const s = popScore(d.id), h = heat(s);
    const bar = (k, label) => `<div class="sig"><span>${label}</span><i><b style="width:${(p[k] / 5) * 100}%"></b></i><em>${p[k]}</em></div>`;
    return `<div class="pop">
      <div class="pop-top">
        <div class="pop-score ${h.cls}"><b>${s}</b><span>/100</span></div>
        <div class="pop-meta"><strong>#${popRank(d.id)} · ${h.label}</strong><small>2026 popularity · ${p.conf} confidence</small></div>
      </div>
      <div class="sigs">${bar("v", "Visitation")}${bar("b", "Buzz")}${bar("c", "Spring-break crowd")}</div>
      <details><summary>Why this rating</summary><ul>${p.ev.map(([t, src]) => `<li>${esc(t)}${src ? srcLink(src) : ""}</li>`).join("")}</ul>
      <a class="pop-ask" href="${link(popPrompt(d))}" target="_blank" rel="noopener">✦ Check 2026 stats in ${ENGINES[engine].label} ↗</a></details>
    </div>`;
  }
  function renderPopularity() {
    document.getElementById("pop-signals").innerHTML = D.popularityMethod.signals.map((s) => `<li><b>${s.label}</b> ${esc(s.desc)}</li>`).join("");
    document.getElementById("pop-board").innerHTML = ranked.map((d, i) => {
      const s = popScore(d.id), h = heat(s);
      return `<li><a href="#dest-${d.id}" data-jump="${d.id}"><span class="rk">${i + 1}</span><span class="nm">${esc(d.name)}</span><i><b class="${h.cls}" style="width:${s}%"></b></i><span class="sc">${s}</span></a></li>`;
    }).join("");
  }

  // ---------- Destinations ----------
  let region = "All";
  let sort = "pop";
  function renderFilters() {
    const regions = ["All", ...new Set(D.destinations.map((d) => d.region))];
    document.getElementById("region-filter").innerHTML = regions.map((r) =>
      `<button type="button" role="tab" aria-selected="${r === region}" class="chip ${r === region ? "on" : ""}" data-region="${r}">${r}<span>${r === "All" ? D.destinations.length : D.destinations.filter((d) => d.region === r).length}</span></button>`
    ).join("") + `<label class="sort">Sort <select id="sort"><option value="pop" ${sort === "pop" ? "selected" : ""}>Most popular (2026)</option><option value="site" ${sort === "site" ? "selected" : ""}>By region</option></select></label>`;
  }
  function renderDestinations() {
    let list = D.destinations.filter((d) => region === "All" || d.region === region);
    if (sort === "pop") list = [...list].sort((a, b) => popScore(b.id) - popScore(a.id));
    const companyName = (id) => (D.companies.find((c) => c.id === id) || {}).name || id;
    document.getElementById("dest-grid").innerHTML = list.map((d) => `
      <article class="card dest" id="dest-${d.id}">
        <header class="card-head">
          <div><p class="eyebrow">${esc(d.state)} · ${esc(d.region)}</p><h3>${esc(d.name)}</h3></div>
          ${badge(d.status)}
        </header>
        <p class="vibe">${esc(d.vibe)}</p>
        ${popBlock(d)}
        ${d.events2027.length ? `<ul class="events">${d.events2027.map((e) => `
          <li><span class="dot dot-${e.status}" aria-hidden="true"></span><div><b>${esc(e.name)}</b><small>${esc(e.when)}${e.src ? srcLink(e.src) : ""}</small></div></li>`).join("")}</ul>` : ""}
        ${d.venues.length ? `<p class="venues"><span>Venues</span> ${d.venues.map(esc).join(" · ")}</p>` : ""}
        ${d.operators.length ? `<p class="venues"><span>Operators</span> ${d.operators.map(companyName).map(esc).join(" · ")}</p>` : ""}
        ${d.note ? `<p class="note">${esc(d.note)}</p>` : ""}
        <footer class="card-foot">
          ${askButtons(destPrompt(d))}
          <a class="ref" href="${d.sbUrl}" target="_blank" rel="noopener">${d.sbUrl === "https://www.springbreak.com/" ? "springbreak.com" : d.sbUrl.includes("springbreak.com") ? "springbreak.com page" : "Operator page"} ↗</a>
        </footer>
      </article>`).join("");
  }

  // ---------- Topics ----------
  function renderTopics() {
    const M = window.SB_MEDIA || {};
    document.getElementById("topic-grid").innerHTML = D.topics.map((t) => {
      const img = M[t.id] && M[t.id].images[0];
      const vids = M[t.id] ? M[t.id].videos.length : 0;
      return `
      <article class="card topic">
        <a class="topic-thumb" href="topics/${t.id}.html" tabindex="-1" aria-hidden="true">
          ${img ? `<img src="${img.src}" alt="" loading="lazy">` : ""}
          <span class="topic-icon">${t.icon}</span>
          ${vids ? `<span class="vid-count">▶ ${vids} videos</span>` : ""}
        </a>
        <h3><a href="topics/${t.id}.html">${esc(t.name)}</a></h3>
        <p>${esc(t.blurb)}</p>
        <a class="ref ref-guide" href="topics/${t.id}.html">Read the guide →</a>
        ${askButtons(topicPrompt(t), "Get update")}
      </article>`;
    }).join("");
  }

  // ---------- Full link index ----------
  function allLinks() {
    return [
      ...D.destinations.map((d) => ({ group: "Destination", name: d.name, prompt: destPrompt(d) })),
      ...ranked.map((d) => ({ group: "2026 popularity", name: d.name, prompt: popPrompt(d) })),
      ...D.topics.map((t) => ({ group: "Topic", name: t.name, prompt: topicPrompt(t) })),
      ...D.companies.map((c) => ({ group: "Tour company", name: c.name, prompt: companyPrompt(c) })),
      ...D.keyDates.map((k) => ({ group: "Event", name: k.label, prompt: eventPrompt(k) }))
    ];
  }
  function renderIndex() {
    document.getElementById("link-count").textContent = allLinks().length;
    document.getElementById("index-body").innerHTML = allLinks().map((l) => `
      <tr><td><span class="tag">${l.group}</span></td><td>${esc(l.name)}</td>
      <td><a href="${link(l.prompt)}" target="_blank" rel="noopener">Open in ${ENGINES[engine].label} ↗</a></td></tr>`).join("");
  }

  // ---------- Sources ----------
  function renderSources() {
    document.getElementById("source-list").innerHTML = Object.values(D.sources)
      .map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("");
  }

  function renderAll() {
    renderDates(); renderCompanies(); renderFilters(); renderDestinations(); renderTopics(); renderIndex(); renderPopularity();
    document.querySelectorAll(".engine-label").forEach((el) => (el.textContent = ENGINES[engine].label));
  }

  // ---------- Events ----------
  document.addEventListener("click", async (e) => {
    const chip = e.target.closest("[data-region]");
    if (chip) { region = chip.dataset.region; renderFilters(); renderDestinations(); return; }
    const copy = e.target.closest(".btn-copy");
    if (copy) {
      try { await navigator.clipboard.writeText(copy.dataset.prompt); toast("Prompt copied"); }
      catch { toast("Copy blocked by browser"); }
      return;
    }
    if (e.target.closest("#copy-all")) {
      const md = allLinks().map((l) => `- [${l.group}: ${l.name}](${link(l.prompt)})`).join("\n");
      try { await navigator.clipboard.writeText(md); toast(`${allLinks().length} links copied as Markdown`); }
      catch { toast("Copy blocked by browser"); }
    }
  });
  document.addEventListener("change", (e) => {
    if (e.target.id === "sort") { sort = e.target.value; renderFilters(); renderDestinations(); }
  });
  document.addEventListener("click", (e) => {
    const j = e.target.closest("[data-jump]");
    if (j && region !== "All") { region = "All"; renderFilters(); renderDestinations(); }
  }, true);
  document.getElementById("engine").addEventListener("change", (e) => {
    engine = e.target.value;
    try { localStorage.setItem("sb27-engine", engine); } catch (err) {}
    renderAll();
  });

  let toastTimer;
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  // ---------- Init ----------
  document.getElementById("engine").value = engine;
  document.querySelectorAll(".as-of").forEach((el) => (el.textContent = D.asOf));
  renderCountdown(); renderSources(); renderAll();
})();
