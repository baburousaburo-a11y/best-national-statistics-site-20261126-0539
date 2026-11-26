// Hand-made SVG charts. No chart library: bars, lines, dots and labels are
// drawn here from the numbers, so the charts work with no network at all.
// SVG is written inline in the page, so no xmlns attribute is needed.

function scale(values) {
  let min = 0;
  let max = 0;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const pad = (max - min) * 0.12 || 1;
  // Bars start at zero, so never pad below zero; only pad below when a
  // series genuinely goes negative (GDP growth in 2020).
  return { min: min < 0 ? min - pad : 0, max: max + pad };
}

function fmt(n, decimals = 1) {
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function frame(w, h, inner) {
  return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Chart">${inner}</svg>`;
}

// Vertical bars, one per label. `highlight` is the index of the bar drawn in red.
export function barChart(labels, values, { highlight = -1, unit = '', decimals = 1, height = 260 } = {}) {
  const w = 720;
  const padL = 52;
  const padR = 10;
  const padT = 24;
  const padB = 26;
  const { min, max } = scale(values);
  const y = (v) => padT + ((max - v) / (max - min)) * (height - padT - padB);
  const step = (w - padL - padR) / labels.length;
  const barW = Math.min(44, step * 0.62);
  let s = '';
  for (let t = 0; t <= 4; t += 1) {
    const v = min + ((max - min) * t) / 4;
    const yy = y(v);
    s += `<line class="grid" x1="${padL}" y1="${yy.toFixed(1)}" x2="${w - padR}" y2="${yy.toFixed(1)}"/>`;
    s += `<text x="${padL - 8}" y="${(yy + 4).toFixed(1)}" text-anchor="end">${fmt(v, decimals)}${unit}</text>`;
  }
  s += `<line class="axis" x1="${padL}" y1="${y(0).toFixed(1)}" x2="${w - padR}" y2="${y(0).toFixed(1)}"/>`;
  labels.forEach((label, i) => {
    const v = values[i];
    const x = padL + i * step + (step - barW) / 2;
    const top = y(Math.max(v, 0));
    const bottom = y(Math.min(v, 0));
    const hot = i === highlight ? ' hot' : '';
    s += `<rect class="bar${hot}" x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(1, bottom - top).toFixed(1)}" rx="2"/>`;
    s += `<text x="${(x + barW / 2).toFixed(1)}" y="${(top - 6).toFixed(1)}" text-anchor="middle">${fmt(v, decimals)}</text>`;
    s += `<text x="${(x + barW / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle">${label}</text>`;
  });
  return frame(w, height, s);
}

// Line chart with a dot and a value label on every point.
export function lineChart(labels, values, { highlight = -1, unit = '', decimals = 1, height = 260 } = {}) {
  const w = 720;
  const padL = 52;
  const padR = 14;
  const padT = 26;
  const padB = 26;
  const { min, max } = scale(values);
  const x = (i) => padL + (i * (w - padL - padR)) / Math.max(1, labels.length - 1);
  const y = (v) => padT + ((max - v) / (max - min)) * (height - padT - padB);
  let s = '';
  for (let t = 0; t <= 4; t += 1) {
    const v = min + ((max - min) * t) / 4;
    const yy = y(v);
    s += `<line class="grid" x1="${padL}" y1="${yy.toFixed(1)}" x2="${w - padR}" y2="${yy.toFixed(1)}"/>`;
    s += `<text x="${padL - 8}" y="${(yy + 4).toFixed(1)}" text-anchor="end">${fmt(v, decimals)}${unit}</text>`;
  }
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  s += `<polyline class="line" points="${pts}"/>`;
  values.forEach((v, i) => {
    const hot = i === highlight;
    s += `<circle class="dot" cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="${hot ? 5.5 : 3.5}"/>`;
    s += `<text x="${x(i).toFixed(1)}" y="${(y(v) - 10).toFixed(1)}" text-anchor="middle">${fmt(v, decimals)}</text>`;
    s += `<text x="${x(i).toFixed(1)}" y="${height - 8}" text-anchor="middle">${labels[i]}</text>`;
  });
  return frame(w, height, s);
}
