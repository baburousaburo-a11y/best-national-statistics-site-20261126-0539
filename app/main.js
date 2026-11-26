// Boots the site: renders the current hash route into #view and
// re-renders whenever the route changes. All page content lives in
// views.js; this file only wires the router to the page.

import { render, wireControls } from './views.js';

const view = document.getElementById('view');

wireControls(view);
render(view);
window.addEventListener('hashchange', () => render(view));
