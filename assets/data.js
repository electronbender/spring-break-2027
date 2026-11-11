// Spring Break 2027 — site data
// Research snapshot: November 11, 2026.
// Structure (destinations + topics) mirrors springbreak.com's navigation.
// 2027 facts come from tour-company sites and event announcements (see `sources`).
// status: "confirmed" = announced for 2027 · "partial" = some 2027 info · "tba" = nothing announced yet

window.SB = {
  asOf: "November 11, 2026",

  keyDates: [
    { date: "2027-03-06", end: "2027-03-28", label: "Peak spring break window", note: "Easter is early in 2027 (Mar 28), so most college breaks fall between Mar 6 and Mar 28.", src: "floridarambler" },
    { date: "2027-03-22", end: "2027-03-28", label: "Miami Music Week", note: "A week of club and pool-party showcases across Miami and Miami Beach. Schedules not yet posted.", src: "mmw" },
    { date: "2027-03-24", end: "2027-03-26", label: "Winter Music Conference", note: "Kimpton EPIC Hotel, Miami.", src: "wmc" },
    { date: "2027-03-26", end: "2027-03-28", label: "Ultra Music Festival (27th edition)", note: "Bayfront Park, Miami. Phase 1 lineup announced; tickets on sale.", src: "ultra" },
    { date: "2027-03-28", label: "Easter Sunday", note: "Late-season breaks often key off Easter week." },
    { date: "2027-06-03", end: "2027-06-06", label: "Gulf Coast Jam, Panama City Beach", note: "This country festival comes after spring break season. Headliners: Luke Bryan, Jason Aldean, Bailey Zimmerman, Zach Top.", src: "gcj" }
  ],

  companies: [
    {
      id: "studentcity", name: "StudentCity", url: "https://www.studentcity.com/", phone: "1-888-777-4642",
      hq: "Woburn, MA", status: "partial",
      focus: ["Cancun", "Punta Cana", "Cabo San Lucas", "Nassau"],
      facts: [
        "Party Package unlocks headline events, booze cruises and club nights.",
        "Cancun venues it promotes: The City, Palazzo and Mandala.",
        "Punta Cana: transportation, beach events, open-bar parties and themed club nights are included.",
        "Past spring break headliners include Cardi B, Tiësto, Big Sean and Steve Aoki. These are past acts, not the 2027 lineup."
      ],
      gap: "No 2027 talent lineup or pricing published yet."
    },
    {
      id: "sts", name: "STS Travel", url: "https://www.ststravel.com/", phone: "800-648-4849",
      hq: "Ft. Lauderdale, FL", status: "confirmed",
      focus: ["Cancun", "Cabo San Lucas", "Punta Cana", "Nassau", "Montego Bay", "Riviera Maya", "Guanacaste (new)", "Las Vegas (hotel only)"],
      facts: [
        "Sept 2026: named Cancun, Cabo, Punta Cana and Nassau its top destinations for 2027.",
        "New for 2027: Guanacaste, Costa Rica, a trip built around adventure plus beach parties.",
        "Nassau trips start in early March 2027, based at Breezes Resort & Spa Bahamas.",
        "Punta Cana resorts it names: Riu Republica, Barceló Bávaro Palace and Occidental Caribe.",
        "Optional VIP Party Package. The 2026 Nassau schedule had Aura, Bond, Club Waterloo and a party cruise; 2027 venues are TBA."
      ],
      gap: "VIP event venues for 2027 not yet published."
    },
    {
      id: "inertia", name: "Inertia Tours", url: "https://www.inertiatours.com/", phone: "800-821-2176",
      hq: "Austin & South Padre Island, TX", status: "partial",
      focus: ["South Padre Island", "Cancun", "Cabo San Lucas"],
      facts: [
        "Specializes in South Padre Island, where it is based.",
        "Has a Spring Break 2027 page live, offering three levels of all-inclusive Cancun resorts (budget, party, upscale).",
        "Cabo hotels it lists: Corazón Cabo and RIU Santa Fe. Cabo pricing is from 2025: $899–$1,299 per person, flights extra.",
        "Says most Bahamas hotels are not student-friendly."
      ],
      gap: "No 2027 prices or dates published yet."
    },
    { id: "bahamasun", name: "BahamaSun", status: "tba", focus: ["Bahamas"], facts: ["Has run spring break trips in past seasons."], gap: "2027 offering not verified." },
    { id: "bestbreak", name: "Best Break", status: "tba", focus: [], facts: ["Has run spring break trips in past seasons."], gap: "2027 offering not verified." },
    { id: "paradise", name: "Paradise Parties", status: "tba", focus: [], facts: ["Has run spring break trips in past seasons."], gap: "2027 offering not verified." },
    { id: "bianchi", name: "Bianchi-Rossi Tours", status: "tba", focus: [], facts: ["Has run spring break trips in past seasons."], gap: "2027 offering not verified." }
  ],

  // Destinations exactly as springbreak.com organizes them, plus STS's new 2027 addition.
  destinations: [
    // ---------- USA ----------
    {
      id: "pcb", name: "Panama City Beach", region: "USA", state: "Florida", status: "partial",
      sbUrl: "https://www.springbreak.com/US_Cities/Panama_City/Panama_City.html",
      vibe: "27+ miles of beach and the biggest drive-to party in the Southeast.",
      venues: ["Harpoon Harry's", "Hammerhead Fred's", "Longboards", "Sharky's", "Coyote Ugly"],
      events2027: [
        { name: "Spring break concert series", when: "TBA", status: "tba" },
        { name: "Gulf Coast Jam (country festival, after the season)", when: "Jun 3–6, 2027", status: "confirmed", src: "gcj" }
      ],
      operators: [],
      note: "In past years the springbreak.com page ran foam parties and DJ sets at the Holiday Inn Resort. No 2027 spring break shows have been announced."
    },
    {
      id: "miami", name: "Miami & South Beach", region: "USA", state: "Florida", status: "confirmed",
      sbUrl: "https://www.springbreak.com/US_Cities/Miami/Miami.html",
      vibe: "Spring break meets Miami Music Week and Ultra.",
      venues: ["Clevelander", "National Hotel", "Sagamore", "Bayfront Park (Ultra)"],
      events2027: [
        { name: "Miami Music Week", when: "Mar 22–28, 2027", status: "confirmed", src: "mmw" },
        { name: "Winter Music Conference", when: "Mar 24–26, 2027", status: "confirmed", src: "wmc" },
        { name: "Ultra Music Festival: Calvin Harris, Armin van Buuren, Dom Dolla, Martin Garrix, Marshmello, Mau P, Indira Paganotto, Boys Noize, Sofi Tukker's Animal Talk, Drumcode", when: "Mar 26–28, 2027", status: "confirmed", src: "ultra" }
      ],
      operators: [],
      note: "Miami Beach eased its spring break crackdown in 2026 (no automatic curfew), but the city still says it has 'broken up' with spring break. 2027 rules are usually announced in February."
    },
    {
      id: "spi", name: "South Padre Island", region: "USA", state: "Texas", status: "partial",
      sbUrl: "https://www.springbreak.com/US_Cities/Padre_Island/Padre_Island.html",
      vibe: "Texas' spring break capital, with beach concerts and condo parties.",
      venues: ["Clayton's Beach Bar", "Louie's Backyard", "Isla Grand Beach Resort", "Tequila Frogs"],
      events2027: [{ name: "Clayton's spring break concert lineup", when: "TBA (usually announced Dec–Jan)", status: "tba" }],
      operators: ["inertia"],
      note: "Inertia Tours is based on the island. Past Clayton's headliners include Ice Spice (2025)."
    },
    {
      id: "ftl", name: "Ft. Lauderdale", region: "USA", state: "Florida", status: "tba",
      sbUrl: "https://www.springbreak.com/US_Cities/Lauderdale/Lauderdale.html",
      vibe: "The original spring break strip, now quieter.",
      venues: ["Elbo Room", "Rock Bar", "Cooley Hammock"],
      events2027: [{ name: "City events and rules", when: "TBA", status: "tba" }],
      operators: [],
      note: "The 2026 season brought more police on the beach and downtown, plus curfews for under-18s."
    },
    {
      id: "daytona", name: "Daytona Beach", region: "USA", state: "Florida", status: "tba",
      sbUrl: "https://www.springbreak.com/US_Cities/Daytona/Daytona.html",
      vibe: "Classic spring break spot whose city now discourages spring breakers.",
      venues: ["Bandshell", "Razzle's", "Ocean Deck", "Hawaiian Inn"],
      events2027: [{ name: "Bandshell concerts", when: "TBA", status: "tba" }],
      operators: [],
      note: "In 2026 Daytona's police chief said the city should no longer market itself as a spring break destination."
    },
    {
      id: "vegas", name: "Las Vegas", region: "USA", state: "Nevada", status: "partial",
      sbUrl: "https://www.springbreak.com/US_Cities/Las_Vegas/Las_Vegas.html",
      vibe: "Dayclubs, pool parties and EDM residencies, for travelers 21 and over.",
      venues: ["Drai's", "Wet Republic", "Marquee Dayclub"],
      events2027: [{ name: "STS Travel hotel-only package", when: "Spring 2027", status: "confirmed", src: "sts" }],
      operators: ["sts"],
      note: "Most clubs and dayclubs require guests to be 21+."
    },
    {
      id: "havasu", name: "Lake Havasu", region: "USA", state: "Arizona", status: "tba",
      sbUrl: "https://www.springbreak.com/",
      vibe: "The West's biggest spring break, centered on boats.",
      venues: ["Copper Canyon (by boat)", "London Bridge area bars"],
      events2027: [{ name: "Spring break calendar", when: "TBA", status: "tba" }],
      operators: [],
      note: "Official guide: havasuspringbreak.com. Boating is the main draw."
    },
    // ---------- MEXICO ----------
    {
      id: "cancun", name: "Cancun", region: "Mexico", state: "Quintana Roo", status: "confirmed",
      sbUrl: "https://www.springbreak.com/MX_Cities/Cancun/Cancun.html",
      vibe: "The #1 international spring break destination, with a hotel-zone club strip.",
      venues: ["Coco Bongo", "Mandala", "The City", "Palazzo", "Señor Frog's", "La Boom"],
      events2027: [
        { name: "STS Travel trips (named a top 2027 destination)", when: "Mar 2027", status: "confirmed", src: "sts" },
        { name: "Inertia Tours, 3 resort tiers", when: "2027 page live", status: "confirmed", src: "inertia" },
        { name: "StudentCity Party Package events", when: "TBA", status: "tba" }
      ],
      operators: ["studentcity", "sts", "inertia"],
      note: "Club open-bar nights are usually sold as a party package add-on."
    },
    {
      id: "cabo", name: "Cabo San Lucas", region: "Mexico", state: "Baja California Sur", status: "confirmed",
      sbUrl: "https://www.springbreak.com/",
      vibe: "Medano Beach days, boat parties and desert sunsets.",
      venues: ["Medano Beach", "RIU Santa Fe", "Corazón Cabo"],
      events2027: [
        { name: "STS Travel trips (named a top 2027 destination)", when: "Mar 2027", status: "confirmed", src: "sts" },
        { name: "Inertia Tours packages", when: "TBA pricing", status: "partial", src: "inertia" }
      ],
      operators: ["sts", "inertia", "studentcity"],
      note: "Inertia's 2025 Cabo prices were $899–$1,299 per person, flights extra. 2027 prices are TBA."
    },
    { id: "pv", name: "Puerto Vallarta", region: "Mexico", state: "Jalisco", status: "tba", sbUrl: "https://www.springbreak.com/puerto-vallarta", vibe: "Malecón nightlife on Banderas Bay.", venues: ["The Malecón"], events2027: [{ name: "Tour packages", when: "TBA", status: "tba" }], operators: [], note: "None of the major tour companies has confirmed a 2027 package here." },
    { id: "acapulco", name: "Acapulco", region: "Mexico", state: "Guerrero", status: "tba", sbUrl: "https://www.springbreak.com/", vibe: "Mexico's retro spring break original.", venues: [], events2027: [{ name: "Tour packages", when: "TBA", status: "tba" }], operators: [], note: "Check the U.S. State Dept travel advisory for Guerrero before booking." },
    { id: "rivmaya", name: "Riviera Maya", region: "Mexico", state: "Quintana Roo", status: "confirmed", sbUrl: "https://www.springbreak.com/", vibe: "A calmer, resort-based option south of Cancun.", venues: ["Playa del Carmen 5th Ave"], events2027: [{ name: "STS Travel trips", when: "Spring 2027", status: "confirmed", src: "sts" }], operators: ["sts"], note: "" },
    // ---------- CARIBBEAN ----------
    {
      id: "puntacana", name: "Punta Cana", region: "Caribbean", state: "Dominican Republic", status: "confirmed",
      sbUrl: "https://www.springbreak.com/",
      vibe: "All-inclusive resorts and the cave nightclub.",
      venues: ["Imagine (cave club)", "Oro", "Riu Republica", "Barceló Bávaro Palace", "Occidental Caribe"],
      events2027: [
        { name: "STS Travel trips (named a top 2027 destination)", when: "Mar 2027", status: "confirmed", src: "sts" },
        { name: "StudentCity open-bar beach events", when: "TBA", status: "tba" },
        { name: "Fox World Travel, 7-night all-inclusive", when: "Mar 21–28, 2027 · from $2,791 per person", status: "confirmed", src: "fox" }
      ],
      operators: ["sts", "studentcity"],
      note: ""
    },
    {
      id: "nassau", name: "Nassau / Bahamas", region: "Caribbean", state: "Bahamas", status: "confirmed",
      sbUrl: "https://www.springbreak.com/",
      vibe: "Short flight from the U.S. East Coast, with beach bashes and party cruises.",
      venues: ["Breezes Resort & Spa", "Aura", "Club Waterloo", "Bond"],
      events2027: [
        { name: "STS Travel Nassau trips (start early March)", when: "Mar 2027", status: "confirmed", src: "sts" },
        { name: "STS VIP Party Package events", when: "Venues TBA", status: "tba" }
      ],
      operators: ["sts", "studentcity"],
      note: "In 2026 STS ran a month-long 'Bahamas Beach Bash' at Breezes."
    },
    { id: "montego", name: "Montego Bay", region: "Caribbean", state: "Jamaica", status: "confirmed", sbUrl: "https://www.springbreak.com/", vibe: "Hip Strip nightlife and reggae.", venues: ["Hip Strip", "Pier 1"], events2027: [{ name: "STS Travel trips", when: "Spring 2027", status: "confirmed", src: "sts" }], operators: ["sts"], note: "" },
    { id: "negril", name: "Negril", region: "Caribbean", state: "Jamaica", status: "tba", sbUrl: "https://www.springbreak.com/", vibe: "Seven Mile Beach and cliff-jumping at Rick's Café.", venues: ["Rick's Café", "Seven Mile Beach"], events2027: [{ name: "Tour packages", when: "TBA", status: "tba" }], operators: [], note: "" },
    { id: "barbados", name: "Barbados", region: "Caribbean", state: "Barbados", status: "tba", sbUrl: "https://www.springbreak.com/", vibe: "St. Lawrence Gap nightlife.", venues: ["St. Lawrence Gap"], events2027: [{ name: "Tour packages", when: "TBA", status: "tba" }], operators: [], note: "" },
    { id: "cuba", name: "Cuba", region: "Caribbean", state: "Cuba", status: "tba", sbUrl: "https://www.springbreak.com/", vibe: "Havana culture trips, not party packages.", venues: [], events2027: [], operators: [], note: "Americans can visit only under OFAC's authorized travel categories, not as tourists." },
    // ---------- INTERNATIONAL ----------
    { id: "guanacaste", name: "Guanacaste", region: "International", state: "Costa Rica", status: "confirmed", sbUrl: "https://www.ststravel.com/spring-break/costa-rica/guanacaste", vibe: "New for 2027: ziplines, surfing and beach parties.", venues: [], events2027: [{ name: "STS Travel's newest destination", when: "Spring 2027", status: "confirmed", src: "sts" }], operators: ["sts"], note: "Not on springbreak.com. STS added it for 2027." },
    { id: "suncity", name: "Sun City", region: "International", state: "South Africa", status: "tba", sbUrl: "https://www.springbreak.com/", vibe: "South Africa's resort spring break.", venues: [], events2027: [], operators: [], note: "Listed on springbreak.com. No current U.S. operator offers trips." },
    { id: "zrce", name: "Zrće Beach", region: "International", state: "Croatia", status: "tba", sbUrl: "https://www.springbreak.com/", vibe: "Europe's party beach. Clubs open in summer, not spring.", venues: ["Papaya", "Aquarius", "Kalypso"], events2027: [], operators: [], note: "Its season runs June–August, so it's a summer break option rather than a spring one." }
  ],

  // Non-destination sections on springbreak.com, plus topics the 2027 research surfaced
  topics: [
    { id: "dates", name: "Spring Break 2027 Dates", icon: "📅", sbUrl: "https://www.springbreak.com/Spring_Break_Dates_2024.html", blurb: "Break dates by college, plus the peak weeks for Mar 2027.", prompt: "List Spring Break 2027 dates for the 50 largest U.S. colleges and universities (and major Canadian schools), grouped by week, and identify the peak weeks in March 2027." },
    { id: "concerts", name: "Concerts & Festivals", icon: "🎤", sbUrl: "https://www.springbreak.com/", blurb: "Ultra, Miami Music Week, beach concerts and pool-party lineups.", prompt: "List every announced concert, music festival, pool party and DJ event for Spring Break 2027 (Feb–Apr 2027) at Panama City Beach, South Padre Island, Miami, Cancun, Cabo, Punta Cana, Nassau and Las Vegas, with artist names, dates, venues and ticket links." },
    { id: "packages", name: "Spring Break 101: Packages", icon: "🎒", sbUrl: "https://www.springbreak.com/Tours/Spring_Break_101.html", blurb: "All-inclusive vs. value-added vs. party packages.", prompt: "Explain the 2027 spring break package types (all-inclusive, hotel-only, party packages, VIP passes) and compare what StudentCity, STS Travel and Inertia Tours each include, with current 2027 prices." },
    { id: "prices-us", name: "U.S. Price Guide", icon: "💵", sbUrl: "https://www.springbreak.com/", blurb: "What a week costs in PCB, SPI, Miami and Vegas.", prompt: "Build a Spring Break 2027 price guide for U.S. destinations (Panama City Beach, South Padre Island, Miami, Ft. Lauderdale, Daytona, Las Vegas, Lake Havasu): typical hotel/condo per night, party passes, concert tickets, food and total per-person cost for 5 nights." },
    { id: "prices-mx", name: "Mexico & Caribbean Price Guide", icon: "🌴", sbUrl: "https://www.springbreak.com/", blurb: "Package prices with and without flights.", prompt: "Build a Spring Break 2027 price guide for Cancun, Cabo, Puerto Vallarta, Punta Cana, Nassau and Jamaica: current tour-company package prices (StudentCity, STS Travel, Inertia Tours) with and without flights, party package add-ons, and typical extras." },
    { id: "passports", name: "Passports & Travel Docs", icon: "🛂", sbUrl: "https://www.springbreak.com/More/Passports.html", blurb: "Processing times and deadlines to travel in March 2027.", prompt: "What are the current U.S. passport processing times (routine and expedited), and what are the latest dates to apply to travel internationally for spring break in March 2027? Include REAL ID rules for domestic flights and entry requirements for Mexico, the Dominican Republic, the Bahamas, Jamaica and Costa Rica." },
    { id: "safety", name: "Safety & Local Rules", icon: "🛡️", sbUrl: "https://www.springbreak.com/", blurb: "Curfews, alcohol bans and travel advisories.", prompt: "Summarize Spring Break 2027 local rules and safety measures (curfews, beach alcohol bans, last-call times, parking/traffic restrictions) for Miami Beach, Ft. Lauderdale, Daytona Beach, Panama City Beach and South Padre Island, plus current U.S. State Department advisories for Mexico, the Dominican Republic, the Bahamas and Jamaica." },
    { id: "cruises", name: "Spring Break Cruises", icon: "🚢", sbUrl: "https://www.springbreak.com/News/Spring_Break_Cruises_2023.html", blurb: "Short Bahamas and Mexico sailings.", prompt: "List the best 3–5 night spring break cruises for March 2027 from Miami, Ft. Lauderdale, Port Canaveral, Galveston and Tampa, with current prices, ports of call and age policies for college students." },
    { id: "family", name: "Family Spring Break", icon: "👨‍👩‍👧", sbUrl: "https://www.springbreak.com/Family/", blurb: "Kid-friendly alternatives and deals.", prompt: "Recommend the best family-friendly Spring Break 2027 destinations and deals in the U.S., Mexico and the Caribbean, avoiding college party zones, with March 2027 events and current prices." },
    { id: "gear", name: "Packing & Gear", icon: "🕶️", sbUrl: "https://www.springbreak.com/Gear/gear.html", blurb: "What to pack for beach, boat and club.", prompt: "Create a Spring Break 2027 packing checklist for a 5-night beach trip (domestic and international), including documents, reef-safe sunscreen rules in Mexico/Caribbean, carry-on limits for budget airlines, and trending gear." },
    { id: "tours", name: "Tour Company Comparison", icon: "🧭", sbUrl: "https://www.springbreak.com/", blurb: "StudentCity vs. STS vs. Inertia and others.", prompt: "Compare the major spring break and college tour companies for 2027 (StudentCity, STS Travel, Inertia Tours, and any others still operating such as BahamaSun, Best Break, Paradise Parties or Bianchi-Rossi): destinations, 2027 prices, included parties/events, deposits, refund policies and recent reviews." },
    { id: "films", name: "Spring Break Films", icon: "🎬", sbUrl: "https://www.springbreak.com/", blurb: "The movies that built the myth.", prompt: "List the most iconic spring break movies and shows, plus any new spring break films, documentaries or series releasing in 2026–2027." },
    { id: "history", name: "History of Spring Break", icon: "📜", sbUrl: "https://www.springbreak.com/", blurb: "From Ft. Lauderdale 1930s to Cancun.", prompt: "Give a concise history of American spring break from the 1930s Ft. Lauderdale swim forums to today, including how destinations shifted and what's changing for 2027." },
    { id: "contests", name: "Contests & Sweepstakes", icon: "🎟️", sbUrl: "https://www.springbreak.com/", blurb: "Free trip giveaways and campus rep programs.", prompt: "List current Spring Break 2027 contests, sweepstakes, free-trip giveaways and campus rep / trip leader programs from tour companies and brands, with deadlines and official entry links." },
    { id: "news", name: "Spring Break News", icon: "📰", sbUrl: "https://www.springbreak.com/", blurb: "The latest headlines for the 2027 season.", prompt: "What are the latest news headlines about Spring Break 2027: destination announcements, city crackdowns, concert lineups, airline deals and travel advisories?" }
  ],

  // ---------- Popularity rating: Spring Break 2026 (roughly Mar 1 – Apr 5, 2026) ----------
  // Three signals, each scored 1–5 (half points allowed); score = sum / 15 × 100.
  //   v = Visitation: arrivals, airport traffic, visitor volume or booking rank during March 2026
  //   b = Social & search buzz: Google Trends spring break search study (Jan 2025–Jan 2026), trip-booking rankings, news coverage volume
  //   c = Spring-break crowd: how strongly college spring breakers specifically showed up (tour-operator focus, crowd/arrest reports)
  // conf = how solid the underlying 2026 data is (high / medium / low).
  popularityMethod: {
    window: "Spring break 2026 (about Mar 1 – Apr 5, 2026; Easter was Apr 5)",
    signals: [
      { key: "v", label: "Visitation", desc: "March 2026 arrivals, airport traffic, visitor volume and booking rankings (Allianz, AAA)." },
      { key: "b", label: "Social & search buzz", desc: "Google Trends spring break search study (Upgraded Points, Jan 2025–Jan 2026), trending lists and news coverage. No public dataset breaks out TikTok or Instagram by destination for these dates." },
      { key: "c", label: "Spring-break crowd", desc: "How heavily college spring breakers in particular showed up: tour-operator focus and reports on 2026 crowds and arrests." }
    ]
  },
  popularity: {
    cancun:     { v: 4.5, b: 5,   c: 5,   conf: "high",   ev: [["2.80M airport passengers in Mar 2026 (−4.6% YoY), with near-record flight days Mar 21 and Mar 29", "cancunAir"], ["#1 international spring break destination in Allianz's 1.3M-itinerary analysis", "allianz"], ["Top-searched international spring break spot in 13 states", "upgraded"]] },
    puntacana:  { v: 5,   b: 4.5, c: 4,   conf: "high",   ev: [["Dominican Republic hit a record 1.31M visitors in Mar 2026, with ~612K flying into Punta Cana", "drMarch"], ["Named a leading Caribbean spring break pick by Allianz", "allianzCarib"], ["Top international resort search in 12 states", "upgraded"]] },
    nassau:     { v: 5,   b: 3.5, c: 4,   conf: "high",   ev: [["Bahamas arrivals rose 15.7% to a record ~1.42M in Mar 2026", "bahamas"], ["Named a leading Caribbean spring break pick by Allianz", "allianzCarib"], ["STS ran a month-long Bahamas Beach Bash for college groups", "sts"]] },
    cabo:       { v: 4.5, b: 3.5, c: 4,   conf: "medium", ev: [["San José del Cabo ranked #2 international destination in Allianz's data", "allianz"], ["STS named it a top destination for 2027", "sts"]] },
    spi:        { v: 3.5, b: 4,   c: 4.5, conf: "medium", ev: [["Spring Break Texas Week ran Mar 14–22, 2026, with thousands of visitors reported on the beach", "spi"], ["Top domestic spring break search in 5 states", "upgraded"], ["One island restaurant reported business down 15–20% YoY", "spiDown"]] },
    vegas:      { v: 5,   b: 3.5, c: 2.5, conf: "high",   ev: [["3.45M visitors in Mar 2026 (+1.9% YoY), with 84.8% hotel occupancy", "vegas"], ["#3 domestic destination in Allianz's data, and on AAA's top 8", "allianz"], ["21+ nightlife limits the college crowd", null]] },
    miami:      { v: 4.5, b: 4,   c: 2.5, conf: "high",   ev: [["#3 domestic spring break booking on AAA's list", "aaa"], ["Arrests in the South Beach district fell ~24% and crowds were smaller than the post-pandemic years", "miamiCalm"], ["Miami Music Week and Ultra kept search buzz high", null]] },
    havasu:     { v: 3,   b: 3.5, c: 4,   conf: "low",    ev: [["Top-searched domestic spring break spot in Arizona, California and Nevada", "upgraded"], ["No official 2026 visitor count was published", null]] },
    pcb:        { v: 3,   b: 3,   c: 3.5, conf: "low",    ev: [["No verified 2026 bed-tax or visitor figures yet", null], ["Tourism marketing now targets families rather than college groups", "pcbFamily"], ["Was not a state leader in the 2026 Google search study", "upgraded"]] },
    ftl:        { v: 4,   b: 3,   c: 2.5, conf: "medium", ev: [["#2 domestic spring break booking on AAA's list, mostly families and general travelers", "aaa"], ["47 beach arrests reported early in the season, a modest number", "crackdown"]] },
    pv:         { v: 4,   b: 3,   c: 2.5, conf: "medium", ev: [["#6 international destination in Allianz's data", "allianz"], ["Little college tour-operator presence", null]] },
    rivmaya:    { v: 4,   b: 3,   c: 2.5, conf: "medium", ev: [["Shares Cancun's airport. Quintana Roo reported record Easter tourism", "qroo"], ["STS offers trips here", "sts"]] },
    montego:    { v: 3.5, b: 2.5, c: 3,   conf: "medium", ev: [["Jamaica topped 1M visitors in Q1 2026, but no March-only figure is available", "jamaica"], ["STS offers trips here", "sts"]] },
    daytona:    { v: 3,   b: 2.5, c: 3,   conf: "medium", ev: [["75 beachside arrests in one 2026 weekend, so crowds did turn up", "crackdown"], ["The city now discourages spring breakers", "floridarambler"]] },
    negril:     { v: 3,   b: 2,   c: 2.5, conf: "low",    ev: [["Counted in Jamaica's strong Q1 numbers, with no destination-level data", "jamaica"]] },
    guanacaste: { v: 2.5, b: 2,   c: 2,   conf: "low",    ev: [["STS only adds it for 2027, so it has no 2026 spring break history", "sts"]] },
    barbados:   { v: 2.5, b: 1.5, c: 1.5, conf: "low",    ev: [["Not on any 2026 spring break ranking", null]] },
    acapulco:   { v: 2,   b: 1.5, c: 1.5, conf: "low",    ev: [["No tour operators and a State Dept advisory for Guerrero", null]] },
    zrce:       { v: 1,   b: 1.5, c: 1,   conf: "low",    ev: [["Off-season in March. Its clubs open in June", null]] },
    cuba:       { v: 1,   b: 1,   c: 1,   conf: "low",    ev: [["U.S. tourist travel is restricted", null]] },
    suncity:    { v: 1,   b: 1,   c: 1,   conf: "low",    ev: [["No U.S. spring break operators", null]] }
  },

  sources: {
    allianz: { label: "Allianz Partners: 2026 spring break destinations", url: "https://www.allianzworldwidepartners.com/media-center/press-releases/Allianz-Partners-reveals-travelers-are-ready-for-beaches-cities-and-peace-of-mind-this-spring-break.html" },
    allianzCarib: { label: "Caribbean Journal: Punta Cana, Aruba, Nassau lead (Allianz)", url: "https://www.caribjournal.com/2026/03/18/aruba-punta-cana-nassau-spring-break/" },
    aaa: { label: "Lodging: AAA top spring break destinations", url: "https://lodgingmagazine.com/aaa-names-top-destinations-for-spring-break/" },
    upgraded: { label: "Upgraded Points: Top-searched spring break spots by state (2026)", url: "https://upgradedpoints.com/news/top-searched-spring-break-locations-2026/" },
    cancunAir: { label: "Caribbean Journal: Cancun air traffic, March 2026", url: "https://www.caribjournal.com/2026/04/07/cancun-air-traffic-decline-march/" },
    drMarch: { label: "DR1: Record 3.7M visitors in Q1 2026", url: "https://dr1.com/news/2026/04/14/dominican-republic-welcomes-record-3-7-million-visitors-in-q1-2026/" },
    bahamas: { label: "Central Bank of The Bahamas: March 2026 developments", url: "https://www.centralbankbahamas.com/news/general-news/monthly-economic-and-financial-developments-mefd-march-2026-1" },
    vegas: { label: "Action Network: Las Vegas March 2026 visitation", url: "https://www.actionnetwork.com/news/las-vegas-tourism-decline-shows-signs-of-reversal-in-march" },
    miamiCalm: { label: "Axios: Spring break went smoothly on South Beach (2026)", url: "https://www.axios.com/local/miami/2026/04/15/miami-beach-spring-break-business-arrests" },
    crackdown: { label: "Fox News: Crackdown cuts arrests, chaos spreads (Mar 2026)", url: "https://www.foxnews.com/us/spring-break-crackdown-cuts-arrests-hot-spot-while-chaos-spreads-other-party-hubs" },
    spi: { label: "KRGV: Thousands flock to South Padre for spring break", url: "https://www.krgv.com/news/visitors-notice-more-trash-on-the-beach-as-thousands-flock-to-south-padre-island-for-spring-break" },
    spiDown: { label: "KRGV: SPI restaurant sees fewer spring break customers", url: "https://www.krgv.com/news/south-padre-island-restaurant-sees-decrease-in-spring-break-customers" },
    pcbFamily: { label: "Yahoo: Tourism officials prepare for spring break (PCB)", url: "https://www.yahoo.com/news/tourism-officials-prepare-upcoming-spring-002412053.html" },
    qroo: { label: "Riviera Maya News: Quintana Roo Easter tourism records", url: "https://www.rivieramayanews.mx/quintana-roos-easter-holiday-season-deemed-successful/" },
    jamaica: { label: "Caribbean360: Caribbean tourism season 2026", url: "https://caribbean360.com/strong-looking-tourism-season-for-caribbean-but-few-dollars-are-retained" },

    ultra: { label: "Ultra Music Festival: 2027 tickets", url: "https://ultramusicfestival.com/tickets/miami/" },
    ultraLineup: { label: "Beatportal: Ultra Miami 2027 Phase One", url: "https://www.beatportal.com/articles/1678845-ultra-miami-unveils-2027-phase-one-lineup-calvin-harris-dom-dolla-indira-paganotto-more" },
    mmw: { label: "Miami & Beaches: Miami Music Week", url: "https://www.miamiandbeaches.com/events/miami-music-week-guide" },
    wmc: { label: "EDMTunes: WMC 2027 dates", url: "https://www.edmtunes.com/2026/06/winter-music-conference-announce-2027-dates/amp/" },
    gcj: { label: "TicketNews: Gulf Coast Jam 2027 lineup", url: "https://www.ticketnews.com/2026/10/gulf-coast-jam-reveals-full-2027-lineup-led-by-luke-bryan-jason-aldean-and-zach-top" },
    sts: { label: "TravelPulse: Top destinations for Spring Break 2027 (STS)", url: "https://www.travelpulse.com/news/destinations/caribbean-dominates-top-destinations-for-spring-break-2027" },
    inertia: { label: "Inertia Tours: Spring Break 2027", url: "https://www.inertiatours.com/cancun-spring-break-resorts" },
    studentcity: { label: "StudentCity FAQ", url: "https://www.studentcity.com/faq" },
    fox: { label: "Fox World Travel: Spring break deals", url: "https://www.foxworldtravel.com/vacation-type/spring-break-deals/" },
    miamibeach: { label: "WLRN: Miami Beach 'broken up' with spring break (2026)", url: "https://www.wlrn.org/government-politics/2026-02-24/miami-beach-spring-break-crackdown" },
    ftl: { label: "WLRN: Ft. Lauderdale readies for spring break (2026)", url: "https://www.wlrn.org/business/2026-02-20/fort-lauderdale-readies-itself-for-busy-spring-break-season" },
    floridarambler: { label: "Florida Rambler: Spring Break 2027", url: "https://www.floridarambler.com/beaches/2026-spring-break-florida/" },
    havasu: { label: "Go Lake Havasu: Spring break party", url: "https://golakehavasu.com/spring-break-party" },
    springbreak: { label: "SpringBreak.com (primary reference)", url: "https://www.springbreak.com/" }
  }
};
