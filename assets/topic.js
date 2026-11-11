(function () {
  const D = window.SB, M = window.SB_MEDIA, C = window.SB_TOPICS;
  const id = document.body.dataset.topic;
  const t = D.topics.find((x) => x.id === id);
  const media = M[id] || { images: [], videos: [] };
  const content = C[id] || { lead: t.blurb, facts: [], sections: [] };
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
  const prompt = t.prompt + SUFFIX;
  const link = () => ENGINES[engine].base + encodeURIComponent(prompt);

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  document.title = `${t.name} · Spring Break 2027`;
  const hero = media.images[0];

  const sectionHtml = (s) => `
    <section class="art-sec">
      <h2>${esc(s.h)}</h2>
      ${(s.p || []).map((p) => `<p>${esc(p)}</p>`).join("")}
      ${s.list ? `<ul>${s.list.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>` : ""}
    </section>`;

  const videoHtml = (v) => `
    <figure class="video">
      <button class="yt" type="button" data-yt="${esc(v.id)}" aria-label="Play: ${esc(v.title)}">
        <img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" loading="lazy">
        <span class="play" aria-hidden="true"></span>
        <span class="dur">${esc(v.length)}</span>
      </button>
      <figcaption><b>${esc(v.title)}</b><span>${esc(v.channel)} · <a href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener">YouTube ↗</a></span></figcaption>
    </figure>`;

  const photoHtml = (im) => `
    <figure class="photo">
      <img src="${root + im.src}" alt="${esc(im.alt)}" loading="lazy">
      <figcaption>${esc(im.alt).slice(0, 110)}</figcaption>
    </figure>`;

  const others = D.topics.filter((x) => x.id !== id);

  document.getElementById("topic").innerHTML = `
    <section class="t-hero" style="--hero-img:url('${hero ? root + hero.src : ""}')">
      <div class="t-hero-inner wrap">
        <a class="crumb" href="${root}index.html#topics">← All topics</a>
        <p class="kicker">Spring Break 2027 guide</p>
        <h1><span aria-hidden="true">${t.icon}</span> ${esc(t.name)}</h1>
        <p class="lede">${esc(content.lead)}</p>
        <div class="ask">
          <a class="btn btn-ask" id="ask" href="${link()}" target="_blank" rel="noopener"><span aria-hidden="true">✦</span> Get the latest <span class="engine-name">in ${ENGINES[engine].label}</span></a>
          <button class="btn btn-ghost btn-light" id="copy" type="button">Copy prompt</button>
        </div>
      </div>
    </section>

    ${content.facts.length ? `<div class="wrap"><dl class="facts-row">${content.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div>` : ""}

    <div class="wrap t-body">
      <article class="article">${content.sections.map(sectionHtml).join("")}</article>
      <aside class="t-side">
        <div class="side-card">
          <h3>Ask for live updates</h3>
          <p>This prompt opens <b>${ENGINES[engine].label}</b> with the question filled in:</p>
          <blockquote>${esc(t.prompt)}</blockquote>
          <a class="btn btn-ask" id="ask2" href="${link()}" target="_blank" rel="noopener">✦ Open prompt</a>
        </div>
      </aside>
    </div>

    ${media.videos.length ? `<section class="wrap section"><div class="section-head"><h2>Watch</h2><p>Clips about ${esc(t.name.toLowerCase())}.</p></div><div class="video-grid">${media.videos.map(videoHtml).join("")}</div></section>` : ""}

    ${media.images.length > 1 ? `<section class="wrap section"><div class="section-head"><h2>Photos</h2></div><div class="photo-grid">${media.images.slice(1).map(photoHtml).join("")}</div></section>` : ""}

    <section class="wrap section">
      <div class="section-head"><h2>More guides</h2></div>
      <div class="more">${others.map((o) => `<a class="chip" href="${o.id}.html"><span aria-hidden="true">${o.icon}</span> ${esc(o.name)}</a>`).join("")}</div>
    </section>

    <section class="wrap section credits">
      <h2>Photo credits</h2>
      <ul>${media.images.map((im) => `<li><a href="${im.page}" target="_blank" rel="noopener">${esc(im.alt).slice(0, 80)}</a> by ${esc(im.credit)}, <a href="${im.licenseUrl || im.page}" target="_blank" rel="noopener">${esc(im.license)}</a>, via Wikimedia Commons</li>`).join("")}</ul>
    </section>`;

  // Click-to-load YouTube embeds (privacy-enhanced domain)
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
    document.querySelector(".side-card p b").textContent = ENGINES[engine].label;
  });

  let tm;
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg; el.classList.add("show");
    clearTimeout(tm); tm = setTimeout(() => el.classList.remove("show"), 1800);
  }
})();
