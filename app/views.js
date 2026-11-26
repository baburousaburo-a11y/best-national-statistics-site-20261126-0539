// The pages of the site. Each route renders into #view from the
// figures in data.js and the SVG builders in charts.js; every link in
// the header is a hash route, and every control on a page re-renders
// that page with new state — nothing on a page is decorative.

import {
  COUNTRY, INDICATORS, POPULATION_SERIES, GDP_SERIES, GROWTH_SERIES,
  INFLATION_SERIES, SECTOR_SPLIT, TOP_INDUSTRIES, ISLAND_GDP,
  PROVINCES, EXPENDITURE, SOURCES,
} from './data.js';
import { lineChart, barChart, hbarChart, donutChart } from './charts.js';

const state = {
  popYear: 2025,
  econMode: 'bars',
  regionIsland: 'All',
  regionQuery: '',
  regionSort: 'pop',
};

function kpiCard(ind) {
  const shown = ind.value >= 1000
    ? ind.value.toLocaleString('en-US')
    : String(ind.value);
  return `<article class="kpi">
    <p class="kpi-label">${ind.label}</p>
    <p class="kpi-value">${shown}<span class="kpi-unit"> ${ind.unit}</span></p>
    <p class="kpi-note">${ind.note}</p>
    <p class="kpi-src">${ind.source}, ${ind.year}</p>
  </article>`;
}

function pageHead(title, intro, source) {
  return `<header class="page-head"><h1>${title}</h1><p>${intro}</p>`
    + (source ? `<p class="src-line">Source: ${source}</p>` : '') + '</header>';
}

function figureBox(title, chartHtml, caption) {
  return `<figure class="chart-box"><figcaption><strong>${title}</strong><span>${caption}</span></figcaption>${chartHtml}</figure>`;
}

function overview() {
  const cards = INDICATORS.map(kpiCard).join('');
  const pop = lineChart(POPULATION_SERIES, { unit: 'm' });
  const donut = donutChart(SECTOR_SPLIT.map((s) => ({ value: s.share, colour: s.colour })), { centre: '100%' });
  const legend = SECTOR_SPLIT.map((s) => `<li><span class="swatch" style="background:${s.colour}"></span>${s.name} — <strong>${s.share}%</strong></li>`).join('');
  const growth = barChart(GROWTH_SERIES, { unit: '%' });
  return pageHead(
    'Indonesia in numbers',
    'One country, 285.7 million people, 38 provinces and the world’s 17th-largest economy — the headline figures, the trends behind them, and where to dig deeper.',
    'World Bank WDI and BPS — Statistics Indonesia, latest values 2024–2025',
  )
  + `<section class="kpi-grid" aria-label="Key indicators">${cards}</section>`
  + `<section class="two-col">
      ${figureBox('Population, 2015–2025', pop, 'Millions of people. The 2020 census counted 270.2 million; the World Bank series runs a little higher.')}
      <div class="chart-box"><figcaption><strong>What the economy is made of</strong><span>Share of GDP, 2024</span></figcaption>
        <div class="donut-wrap">${donut}<ul class="legend">${legend}</ul></div></div>
    </section>`
  + figureBox('Real GDP growth, 2015–2025', growth, 'Percent per year. The 2020 pandemic contraction (−2.1%) is the only down year in the decade.')
  + `<section class="fact-strip">
      <div><strong>${COUNTRY.provinces}</strong><span>provinces</span></div>
      <div><strong>${COUNTRY.islands}</strong><span>islands</span></div>
      <div><strong>55.6%</strong><span>of people live on Java</span></div>
      <div><strong>57.0%</strong><span>of GDP is made on Java</span></div>
    </section>`
  + `<section class="link-cards">
      <a href="#/population"><strong>People</strong><span>Population growth, age and the provinces where everyone lives.</span></a>
      <a href="#/economy"><strong>Economy</strong><span>GDP, growth and which industries carry the economy.</span></a>
      <a href="#/regions"><strong>Regions</strong><span>Compare all 15 largest provinces, filterable by island.</span></a>
      <a href="#/prices"><strong>Prices &amp; work</strong><span>Inflation, jobs and poverty — what daily life costs.</span></a>
    </section>`;
}

function population() {
  const years = POPULATION_SERIES.map((p) => p.year);
  const selected = POPULATION_SERIES.find((p) => p.year === state.popYear);
  const prev = POPULATION_SERIES.find((p) => p.year === state.popYear - 1);
  const growth = prev ? (((selected.value - prev.value) / prev.value) * 100).toFixed(2) : '—';
  const buttons = years.map((y) => `<button type="button" data-year="${y}" class="${y === state.popYear ? 'active' : ''}" aria-pressed="${y === state.popYear}">${y}</button>`).join('');
  const java = PROVINCES.filter((p) => p.island === 'Java').reduce((s, p) => s + p.pop, 0);
  return pageHead(
    'People',
    'Indonesia is the world’s fourth most populous country. Growth has slowed to under 1% a year, and more than half the population lives on one island, Java.',
    'World Bank WDI (population series); BPS provincial estimates, mid-2024',
  )
  + figureBox('Population, 2015–2025', lineChart(POPULATION_SERIES, { unit: 'm', highlightYear: state.popYear }), 'Millions of people. Pick a year below to read it off the chart.')
  + `<div class="controls" role="group" aria-label="Choose a year">${buttons}</div>`
  + `<p class="readout">In <strong>${state.popYear}</strong> Indonesia had <strong>${selected.value.toFixed(1)} million</strong> people`
  + (prev ? ` — up <strong>${growth}%</strong> on ${prev.year} (${prev.value.toFixed(1)} million).` : '.') + '</p>'
  + `<section class="two-col">
      <div class="text-card"><h2>Where everyone lives</h2>
      <p>Java holds <strong>${java.toFixed(1)} million</strong> people — about 55.6% of the country — on 6.6% of its land. The three Javanese provinces of West, Central and East Java alone hold 130 million people, more than Japan.</p>
      <p>Jakarta, the capital, packs 10.7 million people into 661 km²: 16,165 people per km², one of the densest cities on earth. At the other end, East Kalimantan has 30 people per km².</p>
      <p><a href="#/regions">Compare the provinces →</a></p></div>
      <div class="text-card"><h2>A young, slowing population</h2>
      <p>Life expectancy is <strong>71.3 years</strong> (2024). The median Indonesian is about 30 years old, and the birth rate has fallen to 2.1 children per woman — replacement level.</p>
      <p>Population growth was 0.8% in 2025, down from about 1.3% a decade earlier. On current trends the population peaks near 320 million in the 2050s.</p>
      <p>Sources: World Bank WDI; BPS; UN World Population Prospects.</p></div>
    </section>`;
}

function economy() {
  const chart = state.econMode === 'bars'
    ? barChart(GDP_SERIES, { unit: '' })
    : lineChart(GDP_SERIES, { unit: '' });
  const industries = hbarChart(TOP_INDUSTRIES.map((i) => ({ label: i.name, value: i.share })), { unit: '%' });
  const islands = hbarChart(ISLAND_GDP.map((i) => ({ label: i.name, value: i.share })), { unit: '%' });
  const spend = EXPENDITURE.map((e) => `<li><span>${e.name}</span><strong>${e.share > 0 ? '+' : ''}${e.share}%</strong></li>`).join('');
  return pageHead(
    'Economy',
    'A US$1.45 trillion economy (2025) that has grown about 5% a year for a decade, powered by household spending and manufacturing — and concentrated on Java.',
    'World Bank WDI (GDP, growth); BPS (industry shares, expenditure, regional GDP)',
  )
  + `<div class="controls" role="group" aria-label="Chart type">
      <button type="button" data-mode="bars" class="${state.econMode === 'bars' ? 'active' : ''}" aria-pressed="${state.econMode === 'bars'}">Bars</button>
      <button type="button" data-mode="line" class="${state.econMode === 'line' ? 'active' : ''}" aria-pressed="${state.econMode === 'line'}">Line</button>
    </div>`
  + figureBox('Nominal GDP, 2015–2025', chart, 'US$ billion. GDP dipped in 2020 with the pandemic, then rose every year since.')
  + `<section class="two-col">
      ${figureBox('Biggest industries, 2023', industries, 'Share of GDP. Manufacturing alone is nearly a fifth of the economy.')}
      ${figureBox('Where GDP is made, 2024', islands, 'Share of national GDP by island group. Java: 57.0%, Sumatra: 22.1%.')}
    </section>`
  + `<section class="two-col">
      <div class="text-card"><h2>What Indonesians spend on</h2><ul class="spend">${spend}</ul>
      <p>Household consumption is more than half of GDP — the economy runs on what 285 million people buy. Investment is the second engine at 29.3%.</p></div>
      <div class="text-card"><h2>Growth, year by year</h2>
      <p>Real growth: <strong>5.3%</strong> in 2022, <strong>5.1%</strong> in 2023, <strong>5.0%</strong> in 2024, <strong>5.1%</strong> in 2025. The fastest-growing industries in 2024 were other services (+9.8%) and transport &amp; warehousing (+8.7%).</p>
      <p>GDP per person reached <strong>US$5,060</strong> in 2025 — up from US$4,925 in 2024.</p></div>
    </section>`;
}

function regions() {
  const islands = ['All', ...new Set(PROVINCES.map((p) => p.island))];
  const chips = islands.map((i) => `<button type="button" data-island="${i}" class="${state.regionIsland === i ? 'active' : ''}" aria-pressed="${state.regionIsland === i}">${i}</button>`).join('');
  let rows = PROVINCES.filter((p) => (state.regionIsland === 'All' || p.island === state.regionIsland)
    && p.name.toLowerCase().includes(state.regionQuery.toLowerCase()));
  const sorts = {
    pop: (a, b) => b.pop - a.pop,
    name: (a, b) => a.name.localeCompare(b.name),
    density: (a, b) => b.density - a.density,
  };
  rows = [...rows].sort(sorts[state.regionSort]);
  const tableRows = rows.map((p, i) => `<tr><td>${i + 1}</td><td><strong>${p.name}</strong></td><td>${p.capital}</td><td>${p.island}</td><td class="num">${p.pop.toFixed(2)}</td><td class="num">${p.density.toLocaleString('en-US')}</td><td class="num">${p.share.toFixed(1)}%</td></tr>`).join('');
  const top = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 8);
  const chart = hbarChart(top.map((p) => ({ label: p.name, value: p.pop })), { unit: 'm', maxValue: 55 });
  return pageHead(
    'Regions',
    'Fifteen largest provinces of 38 — home to most of the country. Filter by island, search by name, or sort the table.',
    'BPS provincial population estimates, mid-2024',
  )
  + figureBox('Largest provinces by population', chart, 'Millions of people, mid-2024. West Java alone has more people than Spain.')
  + `<div class="controls" role="group" aria-label="Filter by island">${chips}</div>`
  + `<div class="controls"><label class="search-label">Search province
      <input type="search" id="region-search" placeholder="e.g. Java, Bali…" value="${state.regionQuery}" aria-label="Search provinces"></label>
    <label class="search-label">Sort by
      <select id="region-sort" aria-label="Sort provinces">
        <option value="pop" ${state.regionSort === 'pop' ? 'selected' : ''}>Population (largest first)</option>
        <option value="name" ${state.regionSort === 'name' ? 'selected' : ''}>Name (A–Z)</option>
        <option value="density" ${state.regionSort === 'density' ? 'selected' : ''}>Density (densest first)</option>
      </select></label></div>`
  + `<p class="readout">Showing <strong>${rows.length}</strong> of ${PROVINCES.length} provinces listed${state.regionIsland !== 'All' ? ` on ${state.regionIsland}` : ''}${state.regionQuery ? ` matching “${state.regionQuery}”` : ''}.</p>`
  + `<div class="table-wrap"><table>
      <thead><tr><th>#</th><th>Province</th><th>Capital</th><th>Island</th><th class="num">Population (m)</th><th class="num">Density /km²</th><th class="num">Share</th></tr></thead>
      <tbody>${tableRows || '<tr><td colspan="7">No province matches that search.</td></tr>'}</tbody>
    </table></div>
    <p class="src-line">All 38 provinces: the 23 smaller ones (including the four new Papuan provinces, each under 1 million people) are not listed individually. Population: BPS mid-2024 estimates.</p>`;
}

function prices() {
  const infl = lineChart(INFLATION_SERIES, { unit: '%', colour: '#b45309' });
  const growth = barChart(GROWTH_SERIES, { unit: '%', colour: '#0f766e' });
  return pageHead(
    'Prices &amp; work',
    'What daily life costs and who has work: inflation is back near 2%, unemployment is under 5%, and poverty has fallen below 9% — but a quarter of workers are still in informal jobs.',
    'World Bank WDI (inflation); BPS (labour-force survey Feb 2025; poverty Mar 2025)',
  )
  + `<section class="kpi-grid" aria-label="Prices and work indicators">
      ${kpiCard(INDICATORS.find((i) => i.key === 'inflation'))}
      ${kpiCard(INDICATORS.find((i) => i.key === 'unemployment'))}
      ${kpiCard(INDICATORS.find((i) => i.key === 'poverty'))}
      ${kpiCard(INDICATORS.find((i) => i.key === 'life'))}
    </section>`
  + figureBox('Consumer-price inflation, 2015–2025', infl, 'Percent per year. Inflation peaked at 6.4% in 2015 and 4.2% in 2022; it was 1.9% in 2025.')
  + `<section class="two-col">
      ${figureBox('Real GDP growth, 2015–2025', growth, 'Percent per year — the growth that has kept jobs and incomes rising.')}
      <div class="text-card"><h2>Work in Indonesia</h2>
      <p>Open unemployment was <strong>4.8%</strong> in February 2025 (BPS labour-force survey), down from 4.9% a year earlier. The labour-force participation rate is about 68%.</p>
      <p>Agriculture still employs roughly a quarter of workers, even though it makes only 12.6% of GDP — the productivity gap that drives the move to cities and factories.</p>
      <p>Poverty fell to <strong>8.5%</strong> in March 2025, from 9.4% in March 2023 — about 24 million people below the national poverty line.</p></div>
    </section>`;
}

function sources() {
  const list = SOURCES.map((s) => `<li><strong>${s.short}</strong> — ${s.full}</li>`).join('');
  return pageHead(
    'Sources &amp; methods',
    'Every figure on this site names its source and year. Nothing here is estimated by us: the numbers are the publishers’ latest releases, rounded for display.',
    '',
  )
  + `<section class="text-card"><h2>Where the numbers come from</h2><ul class="sources">${list}</ul></section>`
  + `<section class="two-col">
      <div class="text-card"><h2>How to read this site</h2>
      <p><strong>Years matter.</strong> Each card and chart names the year its figure refers to — 2025 where the World Bank has published it, 2024 where that is the latest, and 2023 for the detailed industry split.</p>
      <p><strong>Population has two measures.</strong> The 2020 census counted 270.2 million people; the World Bank series used in the charts runs slightly higher (285.7 million in 2025) because it uses UN estimates. Both are shown and labelled.</p>
      <p><strong>Money is nominal unless stated.</strong> GDP in US dollars uses the year’s market exchange rate; “real growth” is adjusted for inflation.</p></div>
      <div class="text-card"><h2>About this site</h2>
      <p><strong>${COUNTRY.name} in Numbers</strong> is an independent statistics guide built for the make.fun national statistics bounty. It is not affiliated with BPS, the World Bank or the IMF, and it copies no other site’s design, text or images.</p>
      <p>Capital: ${COUNTRY.capital}. Currency: ${COUNTRY.currency}. Official language: ${COUNTRY.language}. Land area: ${COUNTRY.landAreaKm2.toLocaleString('en-US')} km². Provinces: ${COUNTRY.provinces}.</p>
      <p>All figures were checked against the sources above in November 2026. The site runs entirely offline — no network requests, no tracking.</p></div>
    </section>`;
}

const ROUTES = {
  '/': overview,
  '/population': population,
  '/economy': economy,
  '/regions': regions,
  '/prices': prices,
  '/sources': sources,
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return ROUTES[hash] ? hash : '/';
}

export function render(view, scroll = true) {
  const route = currentRoute();
  view.innerHTML = ROUTES[route]();
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${route}`);
    if (a.getAttribute('href') === `#${route}`) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (scroll) window.scrollTo(0, 0);
}

// One delegated listener for every control on every page.
export function wireControls(view) {
  view.addEventListener('click', (event) => {
    const yearBtn = event.target.closest('[data-year]');
    if (yearBtn) { state.popYear = Number(yearBtn.dataset.year); render(view, false); return; }
    const modeBtn = event.target.closest('[data-mode]');
    if (modeBtn) { state.econMode = modeBtn.dataset.mode; render(view, false); return; }
    const islandBtn = event.target.closest('[data-island]');
    if (islandBtn) { state.regionIsland = islandBtn.dataset.island; render(view, false); }
  });
  view.addEventListener('input', (event) => {
    if (event.target.id === 'region-search') {
      state.regionQuery = event.target.value;
      const pos = event.target.selectionStart;
      render(view, false);
      const again = document.getElementById('region-search');
      if (again) { again.focus(); again.setSelectionRange(pos, pos); }
    }
  });
  view.addEventListener('change', (event) => {
    if (event.target.id === 'region-sort') { state.regionSort = event.target.value; render(view, false); }
  });
}
