// Hand-drawn SVG charts. No chart library is vendored: each function
// takes plain data and returns an SVG string, so the charts are part
// of this site's own source and cost nothing extra to load.

function niceTicks(min, max, count) {
  const span = max - min || 1;
  const step = span / count;
  const mag = 10 ** Math.floor(Math.log10(step));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const start = Math.floor(min / s) * s;
  const ticks = [];
  for (let v = start; v <= max + s * 0.001; v += s) ticks.push(v);
  return ticks;
}

function fmt(v) {
  if (Math.abs(v) >= 1000) return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(1);
}

// A line chart with labelled axes, gridlines and a dot per year.
export function lineChart(series, { width = 640, height = 300, colour = '#0f766e', unit = '', highlightYear = null } = {}) {
  const padL = 56, padR = 14, padT = 18, padB = 34;
  const w = width - padL - padR, h = height - padT - padB;
  const vals = series.map((p) => p.value);
  let min = Math.min(...vals), max = Math.max(...vals);
  const pad = (max - min) * 0.12 || 1;
  min -= pad; max += pad;
  const x = (i) => padL + (i / (series.length - 1)) * w;
  const y = (v) => padT + (1 - (v - min) / (max - min)) * h;
  const ticks = niceTicks(min, max, 4);
  const pts = series.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${padL},${y(min)} ${pts} ${x(series.length - 1).toFixed(1)},${y(min)}`;
  let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Line chart">`;
  for (const t of ticks) {
    svg += `<line x1="${padL}" y1="${y(t)}" x2="${width - padR}" y2="${y(t)}" stroke="#e2e8f0" stroke-width="1"/>`;
    svg += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#64748b">${fmt(t)}${unit}</text>`;
  }
  svg += `<polygon points="${area}" fill="${colour}" fill-opacity="0.10"/>`;
  svg += `<polyline points="${pts}" fill="none" stroke="${colour}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  series.forEach((p, i) => {
    const hl = highlightYear === p.year;
    svg += `<circle cx="${x(i)}" cy="${y(p.value)}" r="${hl ? 5.5 : 3.5}" fill="${hl ? '#d97706' : '#ffffff'}" stroke="${colour}" stroke-width="2"/>`;
    if (i % 2 === 0 || i === series.length - 1 || hl) {
      svg += `<text x="${x(i)}" y="${height - 10}" text-anchor="middle" font-size="11" fill="#64748b">${p.year}</text>`;
    }
  });
  const last = series[series.length - 1];
  svg += `<text x="${x(series.length - 1) - 4}" y="${y(last.value) - 12}" text-anchor="end" font-size="13" font-weight="700" fill="${colour}">${fmt(last.value)}${unit}</text>`;
  return svg + '</svg>';
}

// A vertical bar chart; bars are labelled on top, years below.
export function barChart(series, { width = 640, height = 300, colour = '#0f766e', unit = '', negativeColour = '#b91c1c' } = {}) {
  const padL = 56, padR = 10, padT = 24, padB = 30;
  const w = width - padL - padR, h = height - padT - padB;
  const vals = series.map((p) => p.value);
  const min = Math.min(0, ...vals), max = Math.max(...vals);
  const y = (v) => padT + (1 - (v - min) / (max - min)) * h;
  const slot = w / series.length;
  const bw = Math.min(42, slot * 0.62);
  let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart">`;
  const ticks = niceTicks(min, max, 4);
  for (const t of ticks) {
    svg += `<line x1="${padL}" y1="${y(t)}" x2="${width - padR}" y2="${y(t)}" stroke="#e2e8f0"/>`;
    svg += `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#64748b">${fmt(t)}${unit}</text>`;
  }
  if (min < 0) svg += `<line x1="${padL}" y1="${y(0)}" x2="${width - padR}" y2="${y(0)}" stroke="#94a3b8"/>`;
  series.forEach((p, i) => {
    const bx = padL + i * slot + (slot - bw) / 2;
    const top = y(Math.max(p.value, 0)), bot = y(Math.min(p.value, 0));
    const fill = p.value < 0 ? negativeColour : colour;
    svg += `<rect x="${bx.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1, bot - top).toFixed(1)}" rx="3" fill="${fill}"/>`;
    svg += `<text x="${(bx + bw / 2).toFixed(1)}" y="${(top - 6).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">${fmt(p.value)}${unit}</text>`;
    svg += `<text x="${(bx + bw / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="#64748b">${p.year}</text>`;
  });
  return svg + '</svg>';
}

// Horizontal bars for ranked categories (sectors, provinces, islands).
export function hbarChart(items, { width = 640, rowH = 34, colour = '#0f766e', unit = '%', maxValue = null } = {}) {
  const max = maxValue ?? Math.max(...items.map((d) => d.value));
  const height = items.length * rowH + 12;
  const padL = 190, padR = 56;
  let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Ranked bar chart">`;
  items.forEach((d, i) => {
    const y = 8 + i * rowH;
    const bw = ((width - padL - padR) * d.value) / max;
    svg += `<text x="${padL - 10}" y="${y + 15}" text-anchor="end" font-size="12.5" fill="#1e293b">${d.label}</text>`;
    svg += `<rect x="${padL}" y="${y}" width="${Math.max(2, bw).toFixed(1)}" height="20" rx="4" fill="${d.colour || colour}"/>`;
    svg += `<text x="${padL + bw + 8}" y="${y + 15}" font-size="12.5" font-weight="700" fill="#0f766e">${fmt(d.value)}${unit}</text>`;
  });
  return svg + '</svg>';
}

// A donut: slices with a centre total and a legend underneath.
export function donutChart(items, { size = 260, centre = '' } = {}) {
  const total = items.reduce((s, d) => s + d.value, 0);
  const r = size / 2 - 14, cx = size / 2, cy = size / 2;
  let angle = -Math.PI / 2;
  let svg = `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Donut chart">`;
  for (const d of items) {
    const frac = d.value / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const ix0 = cx + (r - 34) * Math.cos(a0), iy0 = cy + (r - 34) * Math.sin(a0);
    const ix1 = cx + (r - 34) * Math.cos(a1), iy1 = cy + (r - 34) * Math.sin(a1);
    svg += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${ix1.toFixed(1)} ${iy1.toFixed(1)} A ${r - 34} ${r - 34} 0 ${large} 0 ${ix0.toFixed(1)} ${iy0.toFixed(1)} Z" fill="${d.colour}"/>`;
    angle = a1;
  }
  svg += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" font-weight="700" fill="#0f172a">${centre}</text>`;
  svg += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11.5" fill="#64748b">of GDP</text>`;
  return svg + '</svg>';
}
