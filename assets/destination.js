(function () {
  const D = window.SB, M = window.SB_DEST_MEDIA, C = window.SB_DEST;
  const id = document.body.dataset.dest;
  const d = D.destinations.find((x) => x.id === id);
  const media = M[id] || { images: [], videos: [] };
  const content = C[id] || { lead: d.vibe, facts: [], sections: [] };
  const root = "../";

  const ENGINES = {
    claude: { label: "Claude", base: "https://claude.ai/new?q=" },
    chatgpt: { label: "ChatGPT", base: "https://chatgpt.com/?q=" },
    perplexity: { label: "Perplexity", base: "https://www.perplexity.ai/search?q=" }
  };
  let engine = "claude";
  try { engine = localStorage.getItem("sb27-engine") || "claude"; } catch (e) {}
  if (!ENGINES[engine]) engine = "claude";
  const SUFFIX = " Cite every fact with a source link and publish date, and clearly flag anything not yet confirmed for 2027. Today's date matters, so search the web for the latest info.";
  // Same prompt as the destination card on the home page
  const prompt =
    `Give me the most up-to-date information for Spring Break 2027 in ${d.name}, ${d.state}. Include: ` +
    `(1) confirmed concerts, parties, pool parties and club events with artist names, dates, venues and ticket links; ` +
    `(2) 2027 packages from StudentCity, STS Travel, Inertia Tours and other college tour companies, with prices and what's included; ` +
    `(3) top student hotels and party venues; ` +
    `(4) local rules, curfews, age limits and entry/travel requirements; ` +
    `(5) the cheapest and busiest weeks to go.` + SUFFIX;
  const link = () => ENGINES[engine].base + encodeURIComponent(prompt);

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const STATUS = { confirmed: "2027 confirmed", partial: "Partly announced", tba: "TBA" };
  const srcLink = (key) => { const s = D.sources[key]; return s ? ` <a class="src" href="${s.url}" target="_blank" rel="noopener">source</a>` : ""; };

  // Popularity (same formula as the home page)
  const score = (x) => { const p = D.popularity[x]; return p ? Math.round(((p.v + p.b + p.c) / 15) * 100) : 0; };
  const ranked = [...D.destinations].sort((a, b) => score(b.id) - score(a.id));
  const rank = ranked.findIndex((x) => x.id === id) + 1;
  const s = score(id);
  const heat = s >= 85 ? ["Red-hot", "h5"] : s >= 70 ? ["Hot", "h4"] : s >= 55 ? ["Warm", "h3"] : s >= 40 ? ["Mild", "h2"] : ["Quiet", "h1"];
  const pop = D.popularity[id];
  const companyName = (cid) => (D.companies.find((c) => c.id === cid) || {}).name || cid;

  document.title = `${d.name} · Spring Break 2027`;
  const hero = media.images[0];

  const sectionHtml = (sec) => `
    <section class="art-sec">
      <h2>${esc(sec.h)}</h2>
      ${(sec.p || []).map((p) => `<p>${esc(p)}</p>`).join("")}
      ${sec.list ? `<ul>${sec.list.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>` : ""}
    </section>`;
  const videoHtml = (v) => `
    <figure class="video">
      <button class="yt" type="button" data-yt="${esc(v.id)}" aria-label="Play: ${esc(v.title)}">
        <img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" loading="lazy">
        <span class="play" aria-hidden="true"></span><span class="dur">${esc(v.length)}</span>
      </button>
      <figcaption><b>${esc(v.title)}</b><span>${esc(v.channel)} · <a href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener">YouTube ↗</a></span></figcaption>
    </figure>`;
  const photoHtml = (im) => `<figure class="photo"><img src="${root + im.src}" alt="${esc(im.alt)}" loading="lazy"><figcaption>${esc(im.alt).slice(0, 110)}</figcaption></figure>`;

  const sameRegion = D.destinations.filter((x) => x.region === d.region && x.id !== id);

  document.getElementById("dest").innerHTML = `
    <section class="t-hero" style="--hero-img:url('${hero ? root + hero.src : ""}')">
      <div class="t-hero-inner wrap">
        <a class="crumb" href="${root}index.html#destinations">← All destinations</a>
        <p class="kicker">${esc(d.state)} · ${esc(d.region)} · Spring Break 2027</p>
        <h1>${esc(d.name)}</h1>
        <p class="lede">${esc(content.lead)}</p>
        <div class="ask">
          <a class="btn btn-ask" id="ask" href="${link()}" target="_blank" rel="noopener"><span aria-hidden="true">✦</span> Get 2027 update <span class="engine-name">in ${ENGINES[engine].label}</span></a>
          <button class="btn btn-ghost btn-light" id="copy" type="button">Copy prompt</button>
        </div>
      </div>
    </section>

    ${content.facts.length ? `<div class="wrap"><dl class="facts-row">${content.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div>` : ""}

    <div class="wrap t-body">
      <article class="article">${content.sections.map(sectionHtml).join("")}</article>
      <aside class="t-side">
        ${pop ? `<div class="side-card pop ${heat[1]}">
          <div class="pop-top">
            <div class="pop-score"><b>${s}</b><span>/100</span></div>
            <div class="pop-meta"><strong>#${rank} · ${heat[0]}</strong><small>2026 popularity · ${pop.conf} confidence</small></div>
          </div>
          <ul class="side-ev">${pop.ev.map(([t, src]) => `<li>${esc(t)}${src ? srcLink(src) : ""}</li>`).join("")}</ul>
          <a class="ref" href="${root}index.html#popularity">How the rating works →</a>
        </div>` : ""}
        <div class="side-card">
          <h3>2027 at a glance <span class="badge badge-${d.status}">${STATUS[d.status]}</span></h3>
          ${d.events2027.length ? `<ul class="events">${d.events2027.map((e) => `<li><span class="dot dot-${e.status}" aria-hidden="true"></span><div><b>${esc(e.name)}</b><small>${esc(e.when)}${e.src ? srcLink(e.src) : ""}</small></div></li>`).join("")}</ul>` : "<p>No 2027 events announced yet.</p>"}
          ${d.operators.length ? `<p class="venues"><span>Tour operators</span> ${d.operators.map(companyName).map(esc).join(" · ")}</p>` : ""}
          ${d.note ? `<p class="note">${esc(d.note)}</p>` : ""}
          <a class="btn btn-ask" id="ask2" href="${link()}" target="_blank" rel="noopener">✦ Ask for the latest</a>
        </div>
      </aside>
    </div>

    ${media.videos.length ? `<section class="wrap section"><div class="section-head"><h2>Watch</h2><p>Clips from ${esc(d.name)}.</p></div><div class="video-grid">${media.videos.map(videoHtml).join("")}</div></section>` : ""}
    ${media.images.length > 1 ? `<section class="wrap section"><div class="section-head"><h2>Photos</h2></div><div class="photo-grid">${media.images.slice(1).map(photoHtml).join("")}</div></section>` : ""}

    <section class="wrap section">
      <div class="section-head"><h2>More in ${esc(d.region === "USA" ? "the USA" : d.region)}</h2></div>
      <div class="more">${sameRegion.map((o) => `<a class="chip" href="${o.id}.html">${esc(o.name)}</a>`).join("")}</div>
    </section>

    <section class="wrap section credits">
      <h2>Photo credits</h2>
      <ul>${media.images.map((im) => `<li><a href="${im.page}" target="_blank" rel="noopener">${esc(im.alt).slice(0, 80)}</a> by ${esc(im.credit)}, <a href="${im.licenseUrl || im.page}" target="_blank" rel="noopener">${esc(im.license)}</a>, via Wikimedia Commons</li>`).join("")}</ul>
    </section>`;

  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-yt]");
    if (b) {
      const f = document.createElement("iframe");
      f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0`;
      f.title = b.getAttribute("aria-label");
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      b.replaceWith(f);
      return;
    }
    if (e.target.closest("#copy")) {
      try { await navigator.clipboard.writeText(prompt); toast("Prompt copied"); } catch { toast("Copy blocked by browser"); }
    }
  });
  const sel = document.getElementById("engine");
  sel.value = engine;
  sel.addEventListener("change", () => {
    engine = sel.value;
    try { localStorage.setItem("sb27-engine", engine); } catch (err) {}
    ["ask", "ask2"].forEach((k) => (document.getElementById(k).href = link()));
    document.querySelector("#ask .engine-name").textContent = "in " + ENGINES[engine].label;
  });
  let tm;
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg; el.classList.add("show");
    clearTimeout(tm); tm = setTimeout(() => el.classList.remove("show"), 1800);
  }
})();
