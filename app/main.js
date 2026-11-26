// Indonesia in Numbers — hash router and controls.
//
// Routes: #/ overview, #/people, #/economy, #/regions, #/prices, #/sources.
// The year picker and Bars/Line toggle re-render the page; the Regions search,
// island filter and column sorts update just the table and chart, so typing
// never loses focus. window.__shotReady tells a screenshot script when the
// page has finished rendering.

import {
  overviewPage, peoplePage, peopleRowsHTML, economyPage, regionsPage,
  regionsChartHTML, provinceRowsHTML, filteredProvinces, pricesPage,
  sourcesPage, missingPage,
} from './views.js';

const app = document.getElementById('app');

const state = {
  year: 2024,
  chart: 'bars',
  island: 'All',
  query: '',
  provSort: 'pop',
  provDir: -1,
  peopleSort: 'year',
  peopleDir: 1,
};

const ROUTES = {
  '': { title: 'Indonesia in Numbers', render: overviewPage },
  people: { title: 'People | Indonesia in Numbers', render: peoplePage },
  economy: { title: 'Economy | Indonesia in Numbers', render: economyPage },
  regions: { title: 'Regions | Indonesia in Numbers', render: regionsPage },
  prices: { title: 'Prices & work | Indonesia in Numbers', render: pricesPage },
  sources: { title: 'Sources | Indonesia in Numbers', render: sourcesPage },
};

function routeName() {
  const m = location.hash.match(/^#\/([a-z]+)/);
  return m ? m[1] : '';
}

function refreshRegions() {
  const rows = document.getElementById('prov-rows');
  const count = document.getElementById('prov-count');
  const chart = document.getElementById('regions-chart');
  if (rows) rows.innerHTML = provinceRowsHTML(state);
  if (count) count.textContent = String(filteredProvinces(state).length);
  if (chart) chart.innerHTML = regionsChartHTML(state);
}

function refreshPeople() {
  const rows = document.getElementById('people-rows');
  if (rows) rows.innerHTML = peopleRowsHTML(state);
}

function wire() {
  document.querySelectorAll('.year-pick').forEach((sel) => {
    sel.addEventListener('change', () => {
      state.year = Number(sel.value);
      render();
    });
  });
  document.querySelectorAll('[data-chart]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.chart = btn.dataset.chart;
      render();
    });
  });

  const island = document.getElementById('island-filter');
  if (island) {
    island.addEventListener('change', () => {
      state.island = island.value;
      refreshRegions();
    });
  }
  const search = document.getElementById('prov-search');
  if (search) {
    search.addEventListener('input', () => {
      state.query = search.value;
      refreshRegions();
    });
  }
  document.querySelectorAll('#prov-rows').forEach(() => {
    document.querySelectorAll('th[data-sort]').forEach((th) => {
      th.addEventListener('click', () => {
        const key = th.dataset.sort;
        if (state.provSort === key) {
          state.provDir = -state.provDir;
        } else {
          state.provSort = key;
          state.provDir = key === 'name' || key === 'island' ? 1 : -1;
        }
        refreshRegions();
        renderSortMarks();
      });
    });
  });
  document.querySelectorAll('#people-rows').forEach(() => {
    document.querySelectorAll('th[data-sort]').forEach((th) => {
      th.addEventListener('click', () => {
        const key = th.dataset.sort;
        if (state.peopleSort === key) {
          state.peopleDir = -state.peopleDir;
        } else {
          state.peopleSort = key;
          state.peopleDir = key === 'year' ? 1 : -1;
        }
        refreshPeople();
        renderSortMarks();
      });
    });
  });
}

// Re-render just the sort arrows after an in-place table update.
function renderSortMarks() {
  const route = routeName();
  const marks = {
    regions: { sort: state.provSort, dir: state.provDir },
    people: { sort: state.peopleSort, dir: state.peopleDir },
  };
  const m = marks[route];
  if (!m) return;
  document.querySelectorAll('th[data-sort]').forEach((th) => {
    const base = th.textContent.replace(/ [▲▼]$/, '');
    th.textContent = base + (th.dataset.sort === m.sort ? (m.dir === 1 ? ' ▲' : ' ▼') : '');
  });
}

function render() {
  window.__shotReady = false;
  const name = routeName();
  const route = ROUTES[name];
  document.title = route ? route.title : 'Not found | Indonesia in Numbers';
  app.innerHTML = route ? route.render(state) : missingPage();
  document.querySelectorAll('nav a').forEach((a) => {
    const on = a.dataset.route === (name === '' ? 'overview' : name);
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  wire();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
