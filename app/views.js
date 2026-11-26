// HTML for each page of Indonesia in Numbers, built from the data. Every value
// shown is escaped before it goes into the page. Charts come from charts.js.

import {
  YEARS, POPULATION, GDP_USD, GDP_PC, GROWTH, INFLATION, UNEMPLOYMENT, POVERTY,
  AGE_2024, SECTORS_2024, PROVINCES, ISLANDS, WAGES_2025, SOURCES,
} from './data.js';
import { barChart, lineChart } from './charts.js';

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const yearIndex = (year) => YEARS.indexOf(year);

function fmt(n, decimals = 1) {
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function money(n) {
  return Number(n).toLocaleString('en-US');
}

function yearOptions(selected) {
  return YEARS.map((y) => `<option value="${y}"${y === selected ? ' selected' : ''}>${y}</option>`).join('');
}

function chartToggle(state) {
  const bars = state.chart === 'bars';
  return `<span class="toggle" role="group" aria-label="Chart type">
    <button type="button" data-chart="bars" aria-pressed="${bars}">Bars</button>
    <button type="button" data-chart="line" aria-pressed="${!bars}">Line</button>
  </span>`;
}

function yearPicker(state) {
  return `<label>Year
    <select class="year-pick" aria-label="Year">${yearOptions(state.year)}</select>
  </label>`;
}

function kpi(label, value, unit, sub) {
  return `<div class="kpi"><div class="label">${escape(label)}</div>
    <div class="value">${value} <span class="unit">${escape(unit)}</span></div>
    <div class="sub">${escape(sub)}</div></div>`;
}

function chartFor(state, labels, values, opts) {
  return state.chart === 'bars'
    ? barChart(labels, values, { ...opts, highlight: yearIndex(state.year) })
    : lineChart(labels, values, { ...opts, highlight: yearIndex(state.year) });
}

function glanceRow(label, series, year, decimals, unit, invert = false) {
  const i = yearIndex(year);
  const first = series[0];
  const mid = series[yearIndex(2020)];
  const now = series[i];
  const change = now - first;
  const arrow = change > 0 ? '▲' : change < 0 ? '▼' : '—';
  return `<tr><td>${escape(label)}</td><td class="num">${fmt(first, decimals)}${unit}</td>
    <td class="num">${fmt(mid, decimals)}${unit}</td><td class="num">${fmt(now, decimals)}${unit}</td>
    <td class="num">${arrow} ${fmt(Math.abs(change), decimals)}${unit}</td></tr>`;
}

export function overviewPage(state) {
  const i = yearIndex(state.year);
  const years = YEARS.map(String);
  return `<h1>Indonesia in Numbers</h1>
<p class="lede">One place for the figures that describe Indonesia: how many people live here,
how the economy is doing, where people live and what things cost. Pick a year and the
whole page follows it.</p>
<div class="controls">${yearPicker(state)}${chartToggle(state)}</div>
<div class="kpis">
  ${kpi('Population', fmt(POPULATION[i]), 'million', `BPS, ${state.year}`)}
  ${kpi('GDP', '$' + money(GDP_USD[i]), 'billion', `World Bank, ${state.year}`)}
  ${kpi('GDP growth', fmt(GROWTH[i], 2), '%', `BPS, ${state.year}`)}
  ${kpi('Inflation', fmt(INFLATION[i], 2), '%', `BPS, ${state.year}`)}
  ${kpi('Unemployment', fmt(UNEMPLOYMENT[i], 2), '%', `BPS, August ${state.year}`)}
  ${kpi('Poverty rate', fmt(POVERTY[i], 2), '%', `BPS, ${state.year}`)}
</div>
<div class="card">
  <h2>Population, 2015–2025</h2>
  <div class="chart">${chartFor(state, years, POPULATION, { decimals: 1, unit: 'm' })}</div>
  <p class="src">Population in millions. BPS mid-year estimates; 2025 is a projection. The red bar is ${state.year}.</p>
</div>
<div class="highlights">
  <div class="highlight"><b>${fmt(POPULATION[i])} million</b><span>people lived in Indonesia in ${state.year} (BPS)</span></div>
  <div class="highlight"><b>${fmt(POVERTY[i], 2)}%</b><span>lived below the poverty line in ${state.year} (BPS)</span></div>
  <div class="highlight"><b>${fmt(GROWTH[i], 2)}%</b><span>real GDP growth in ${state.year} (BPS)</span></div>
</div>
<div class="card">
  <h2>At a glance — ${state.year} against 2015</h2>
  <div class="table-wrap"><table>
    <thead><tr><th>Indicator</th><th class="num">2015</th><th class="num">2020</th><th class="num">${state.year}</th><th class="num">Change since 2015</th></tr></thead>
    <tbody>
      ${glanceRow('Population (million)', POPULATION, state.year, 1, '')}
      ${glanceRow('GDP (US$ billion)', GDP_USD, state.year, 0, '')}
      ${glanceRow('GDP per capita (US$)', GDP_PC, state.year, 0, '')}
      ${glanceRow('GDP growth (%)', GROWTH, state.year, 2, '')}
      ${glanceRow('Inflation (%)', INFLATION, state.year, 2, '', true)}
      ${glanceRow('Unemployment (%)', UNEMPLOYMENT, state.year, 2, '', true)}
      ${glanceRow('Poverty rate (%)', POVERTY, state.year, 2, '', true)}
    </tbody>
  </table></div>
  <p class="src">Sources: BPS for population, growth, inflation, unemployment and poverty; World Bank for GDP. 2025 values are estimates.</p>
</div>
<div class="pages">
  <a href="#/people"><b>People</b><span>Population by year and age structure.</span></a>
  <a href="#/economy"><b>Economy</b><span>GDP, growth and the biggest sectors.</span></a>
  <a href="#/regions"><b>Regions</b><span>Provinces, islands and poverty by place.</span></a>
  <a href="#/prices"><b>Prices &amp; work</b><span>Inflation, jobs and minimum wages.</span></a>
  <a href="#/sources"><b>Sources</b><span>Where every figure comes from.</span></a>
</div>`;
}

export function peopleRowsHTML(state) {
  const rows = YEARS.map((y, i) => {
    const change = i === 0 ? null : POPULATION[i] - POPULATION[i - 1];
    return { year: y, pop: POPULATION[i], change };
  });
  const key = state.peopleSort;
  const dir = state.peopleDir;
  rows.sort((a, b) => {
    const av = a[key] === null ? -Infinity : a[key];
    const bv = b[key] === null ? -Infinity : b[key];
    return (av - bv) * dir;
  });
  return rows
    .map(
      (r) => `<tr><td>${r.year}</td><td class="num">${fmt(r.pop, 1)}</td>
      <td class="num">${r.change === null ? '—' : `+${fmt(r.change, 1)}`}</td></tr>`,
    )
    .join('');
}

function sortMark(state, column, sortKey, dirKey) {
  if (state[sortKey] !== column) return '';
  return state[dirKey] === 1 ? ' ▲' : ' ▼';
}

export function peoplePage(state) {
  const years = YEARS.map(String);
  return `<h1>People</h1>
<p class="lede">Indonesia is the world&rsquo;s fourth most populous country. The population grew
by about 29 million between 2015 and 2025, and more than two in three Indonesians are
of working age.</p>
<div class="card">
  <h2>Population, 2015–2025</h2>
  <div class="chart">${lineChart(years, POPULATION, { decimals: 1, unit: 'm', highlight: yearIndex(state.year) })}</div>
  <p class="src">Population in millions. BPS mid-year estimates; 2025 is a projection.</p>
</div>
<div class="card">
  <h2>Age structure, 2024</h2>
  ${AGE_2024.map(
    (a) => `<div class="meter"><span class="name">${escape(a.group)}</span>
      <span class="track"><span class="fill" style="width:${a.share}%"></span></span>
      <span class="val">${fmt(a.share, 1)}%</span></div>`,
  ).join('')}
  <p class="src">Median age 30.5 years (BPS, 2024). A young population: roughly a quarter are under 15.</p>
</div>
<div class="card">
  <h2>Population by year</h2>
  <p class="small">Click a column heading to sort.</p>
  <div class="table-wrap"><table>
    <thead><tr>
      <th class="sortable" data-sort="year">Year${sortMark(state, 'year', 'peopleSort', 'peopleDir')}</th>
      <th class="num sortable" data-sort="pop">Population (million)${sortMark(state, 'pop', 'peopleSort', 'peopleDir')}</th>
      <th class="num sortable" data-sort="change">Annual change (million)${sortMark(state, 'change', 'peopleSort', 'peopleDir')}</th>
    </tr></thead>
    <tbody id="people-rows">${peopleRowsHTML(state)}</tbody>
  </table></div>
  <p class="src">Source: BPS. 2020 is anchored on the population census; 2025 is a projection.</p>
</div>`;
}

export function economyPage(state) {
  const i = yearIndex(state.year);
  const years = YEARS.map(String);
  return `<h1>Economy</h1>
<p class="lede">Indonesia is the largest economy in Southeast Asia and the world&rsquo;s
16th largest by nominal GDP. Growth has run at about 5% a year, with one sharp
pandemic contraction in 2020.</p>
<div class="controls">${yearPicker(state)}${chartToggle(state)}</div>
<div class="kpis">
  ${kpi('GDP', '$' + money(GDP_USD[i]), 'billion', `World Bank, ${state.year}`)}
  ${kpi('GDP per capita', '$' + money(GDP_PC[i]), '', `World Bank, ${state.year}`)}
  ${kpi('GDP growth', fmt(GROWTH[i], 2), '%', `BPS, ${state.year}`)}
</div>
<div class="card">
  <h2>Nominal GDP, 2015–2025 (US$ billion)</h2>
  <div class="chart">${chartFor(state, years, GDP_USD, { decimals: 0, unit: '' })}</div>
  <p class="src">World Bank, current US dollars. 2025 is an IMF estimate. The red bar is ${state.year}.</p>
</div>
<div class="card">
  <h2>Real GDP growth, 2015–2025 (%)</h2>
  <div class="chart">${lineChart(years, GROWTH, { decimals: 2, unit: '%', highlight: i })}</div>
  <p class="src">BPS, year on year. The economy shrank 2.07% in 2020, then grew 5.31% in 2022.</p>
</div>
<div class="card">
  <h2>What the economy is made of, 2024</h2>
  ${SECTORS_2024.map(
    (s) => `<div class="meter"><span class="name">${escape(s.name)}</span>
      <span class="track"><span class="fill" style="width:${s.share}%"></span></span>
      <span class="val">${fmt(s.share, 1)}%</span></div>`,
  ).join('')}
  <p class="src">Share of GDP by sector (BPS, 2024). Manufacturing is the single largest sector.</p>
</div>
<div class="card">
  <h2>GDP and GDP per capita by year</h2>
  <div class="table-wrap"><table>
    <thead><tr><th>Year</th><th class="num">GDP (US$ bn)</th><th class="num">GDP per capita (US$)</th><th class="num">Growth (%)</th></tr></thead>
    <tbody>
      ${YEARS.map((y, j) => `<tr><td>${y}</td><td class="num">${money(GDP_USD[j])}</td>
        <td class="num">${money(GDP_PC[j])}</td><td class="num">${fmt(GROWTH[j], 2)}</td></tr>`).join('')}
    </tbody>
  </table></div>
  <p class="src">Sources: World Bank (GDP, GDP per capita), BPS (growth). 2025 GDP is an IMF estimate.</p>
</div>`;
}

export function filteredProvinces(state) {
  const q = state.query.trim().toLowerCase();
  let list = PROVINCES.filter((p) => (state.island === 'All' ? true : p.island === state.island));
  if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
  const key = state.provSort;
  const dir = state.provDir;
  return [...list].sort((a, b) => {
    if (key === 'name' || key === 'island') return a[key].localeCompare(b[key]) * dir;
    return (a[key] - b[key]) * dir;
  });
}

const SHORT = {
  'Jawa Barat': 'Jabar', 'Jawa Timur': 'Jatim', 'Jawa Tengah': 'Jateng',
  'Sumatera Utara': 'Sumut', 'Sulawesi Selatan': 'Sulsel', 'Sumatera Selatan': 'Sumsel',
  'Sumatera Barat': 'Sumbar', 'Kalimantan Barat': 'Kalbar', 'Nusa Tenggara Barat': 'NTB',
  'Nusa Tenggara Timur': 'NTT', 'Kalimantan Selatan': 'Kalsel', 'Kalimantan Timur': 'Kaltim',
  'DI Yogyakarta': 'DIY', 'DKI Jakarta': 'Jakarta',
};

function shortName(name) {
  return SHORT[name] || name;
}

export function regionsChartHTML(state) {
  const top = filteredProvinces(state).slice(0, 8);
  if (top.length === 0) return '<p>No provinces match the current filter.</p>';
  return barChart(
    top.map((p) => shortName(p.name)),
    top.map((p) => p.pop),
    { decimals: 1, unit: 'm' },
  );
}

export function provinceRowsHTML(state) {
  const list = filteredProvinces(state);
  if (list.length === 0) return '<tr><td colspan="4">No provinces match. Clear the search or pick another island.</td></tr>';
  return list
    .map(
      (p) => `<tr><td>${escape(p.name)}</td><td>${escape(p.island)}</td>
      <td class="num">${fmt(p.pop, 2)}</td><td class="num">${fmt(p.poverty, 2)}</td></tr>`,
    )
    .join('');
}

export function regionsPage(state) {
  const islands = ['All', ...new Set(PROVINCES.map((p) => p.island))];
  return `<h1>Regions</h1>
<p class="lede">More than half of Indonesia&rsquo;s people live on Jawa, an island about the size
of England. The table below lists the 20 largest provinces — filter by island, search
by name, or sort any column.</p>
<div class="controls">
  <label>Island
    <select id="island-filter" aria-label="Island">
      ${islands.map((n) => `<option value="${escape(n)}"${n === state.island ? ' selected' : ''}>${escape(n)}</option>`).join('')}
    </select>
  </label>
  <label>Search
    <input type="search" id="prov-search" placeholder="Type a province name" value="${escape(state.query)}" aria-label="Search provinces">
  </label>
</div>
<div class="card">
  <h2>Largest provinces by population, 2024</h2>
  <div class="chart" id="regions-chart">${regionsChartHTML(state)}</div>
  <p class="src">Population in millions (BPS, 2024). The chart follows the island filter and search.</p>
</div>
<div class="card">
  <h2>Provinces</h2>
  <p class="small"><span id="prov-count">${filteredProvinces(state).length}</span> of ${PROVINCES.length} provinces shown. Click a column heading to sort.</p>
  <div class="table-wrap"><table>
    <thead><tr>
      <th class="sortable" data-sort="name">Province${sortMark(state, 'name', 'provSort', 'provDir')}</th>
      <th class="sortable" data-sort="island">Island${sortMark(state, 'island', 'provSort', 'provDir')}</th>
      <th class="num sortable" data-sort="pop">Population 2024 (m)${sortMark(state, 'pop', 'provSort', 'provDir')}</th>
      <th class="num sortable" data-sort="poverty">Poverty 2024 (%)${sortMark(state, 'poverty', 'provSort', 'provDir')}</th>
    </tr></thead>
    <tbody id="prov-rows">${provinceRowsHTML(state)}</tbody>
  </table></div>
  <p class="src">Sources: BPS, mid-year population estimates and September 2024 poverty rates.</p>
</div>
<div class="card">
  <h2>Where people live, 2024</h2>
  ${ISLANDS.map(
    (g) => `<div class="meter"><span class="name">${escape(g.name)}</span>
      <span class="track"><span class="fill" style="width:${g.share}%"></span></span>
      <span class="val">${fmt(g.share, 1)}%</span></div>`,
  ).join('')}
  <p class="src">Share of the national population by island group (BPS, 2024). Jawa alone holds 55.7%.</p>
</div>`;
}

export function pricesPage(state) {
  const years = YEARS.map(String);
  return `<h1>Prices &amp; work</h1>
<p class="lede">Prices and jobs: inflation has stayed low outside the 2022 energy-price spike,
unemployment fell to 4.85% in August 2025, and poverty is at its lowest on record.</p>
<div class="card">
  <h2>Inflation, 2015–2025 (%)</h2>
  <div class="chart">${barChart(years, INFLATION, { decimals: 2, unit: '%', highlight: yearIndex(state.year) })}</div>
  <p class="src">Consumer price inflation, year on year (BPS). The 2022 spike to 5.51% followed fuel-subsidy cuts; 2025 is an estimate.</p>
</div>
<div class="card">
  <h2>Unemployment, 2015–2025 (%)</h2>
  <div class="chart">${lineChart(years, UNEMPLOYMENT, { decimals: 2, unit: '%', highlight: yearIndex(state.year) })}</div>
  <p class="src">Open unemployment rate, August survey (BPS). It peaked at 7.07% in 2020 and fell to 4.85% in 2025.</p>
</div>
<div class="card">
  <h2>Provincial minimum wage (UMP), 2025</h2>
  <div class="table-wrap"><table>
    <thead><tr><th>Province</th><th class="num">Rupiah per month</th></tr></thead>
    <tbody>
      ${WAGES_2025.map((w) => `<tr><td>${escape(w.province)}</td><td class="num">Rp ${money(w.wage)}</td></tr>`).join('')}
    </tbody>
  </table></div>
  <p class="src">Provincial government announcements for 2025. Jakarta&rsquo;s minimum wage is more than double Central Java&rsquo;s.</p>
</div>
<div class="card">
  <h2>Work in brief</h2>
  <ul class="tight">
    <li>Labour-force participation was 70.6% in August 2024 (BPS).</li>
    <li>Poverty fell from 11.22% in 2015 to 8.47% in March 2025 (BPS) — the lowest on record.</li>
    <li>Inflation averaged about 2.7% a year across 2015–2025, inside Bank Indonesia&rsquo;s target band.</li>
  </ul>
</div>`;
}

export function sourcesPage() {
  return `<h1>Sources</h1>
<p class="lede">Every figure on this site comes from one of the sources below. Nothing here is
estimated by this site itself, except where a source&rsquo;s own estimate is marked.</p>
<div class="card">
  <h2>Where the numbers come from</h2>
  <div class="table-wrap"><table>
    <thead><tr><th>Dataset</th><th>Source</th><th>Notes</th></tr></thead>
    <tbody>
      ${SOURCES.map((s) => `<tr><td>${escape(s.dataset)}</td><td>${escape(s.source)}</td><td>${escape(s.note)}</td></tr>`).join('')}
    </tbody>
  </table></div>
</div>
<div class="card">
  <h2>How to read this site</h2>
  <ul class="tight">
    <li>Figures are rounded to one or two decimals; small differences from other publications come from rounding and revisions.</li>
    <li>2025 values are estimates or projections where marked, because final releases were not yet out when this site was built.</li>
    <li>Poverty is the September survey each year, except 2025, which is the March survey.</li>
    <li>Unemployment is the August survey each year.</li>
    <li>Provincial populations are BPS mid-year estimates for 2024; the twenty provinces shown cover every island group.</li>
  </ul>
</div>`;
}

export function missingPage() {
  return `<h1>Not found</h1>
<p>There is no page at this address. <a href="#/">Back to the overview</a>.</p>`;
}
