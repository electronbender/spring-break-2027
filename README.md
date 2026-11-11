# Spring Break 2027

A static guide to Spring Break 2027. It follows springbreak.com's destinations and topics and adds 2027 information from the major college tour companies (StudentCity, STS Travel, Inertia Tours) and from festivals.

- 21 destinations, each with 2027 events, venues and tour operators
- A 2026 popularity rating (0–100) built from visitation, search/social buzz and spring-break crowd signals
- 70 pre-filled prompt links that open Claude, ChatGPT or Perplexity to look up the latest information

Research snapshot: November 11, 2026. Data is in `assets/data.js`.

## Editing and building

Content lives in `assets/*.js` (data, guides, media) and layout in `templates/*.html`. After editing, rebuild:

```bash
node build.mjs
```

The build pre-renders every page to static HTML so search engines and AI crawlers see the full text. It also writes page metadata, JSON-LD structured data, `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt` and a Markdown copy of each page. The GitHub Pages workflow runs the same build on every push. Set `SITE_URL` (an env var locally, or an Actions repository variable) when the site moves to its own domain.

## Run locally

```bash
python3 -m http.server 8427
```

Then open http://localhost:8427.
