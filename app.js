const DATA_URL = 'data/cockpit.json';
const $ = (id) => document.getElementById(id);

const esc = (v = '') => String(v)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function tone(value = '') {
  const v = String(value).toLowerCase();
  if (v.includes('p0') || v.includes('open') || v.includes('failed')) return 'p0';
  if (v.includes('p1') || v.includes('paused') || v.includes('draft') || v.includes('candidate') || v.includes('watch')) return 'warn';
  if (v.includes('ok') || v.includes('active') || v.includes('ready')) return 'ok';
  return 'neutral';
}

function badge(text) { return `<span class="badge ${tone(text)}">${esc(text)}</span>`; }

function card(x) {
  return `<article class="card"><div>${badge(x.level || x.status || x.type || 'item')}</div><h3>${esc(x.title || x.name || x.type || x.label)}</h3><p>${esc(x.body || x.note || x.input || '')}</p>${x.next ? `<footer>Next: ${esc(x.next)}</footer>` : ''}</article>`;
}

function step(x, i) {
  return `<article class="step"><span>${String(i + 1).padStart(2, '0')}</span><h3>${esc(x.q)}</h3><p>${esc(x.a)}</p></article>`;
}

function metric(x) {
  return `<article class="metric ${tone(x.status)}"><small>${esc(x.label)}</small><strong>${esc(x.value)}</strong><p>${esc(x.note)}</p></article>`;
}

function command(x) {
  return `<article class="card command"><div>${badge(x.level)} ${badge(x.status)}</div><h3>${esc(x.name)}</h3><ul>${(x.steps || []).map(s => `<li>${esc(s)}</li>`).join('')}</ul></article>`;
}

async function boot() {
  const res = await fetch(DATA_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(DATA_URL);
  const data = await res.json();

  $('title').textContent = data.title;
  $('subtitle').textContent = data.subtitle;
  $('updated').textContent = `updated: ${data.updated}`;
  $('mode').textContent = data.mode;
  $('sideMode').textContent = data.mode;
  $('sideRoute').textContent = data.route.id;
  $('driver').textContent = data.design_driver;

  $('returnFlow').innerHTML = data.return_flow.map(step).join('');
  $('metrics').innerHTML = data.metrics.map(metric).join('');
  $('attentionList').innerHTML = data.attention.map(card).join('');
  $('commandsList').innerHTML = data.commands.map(command).join('');
  $('snapshotsList').innerHTML = data.snapshots.map(card).join('');
  $('sourcesList').innerHTML = data.sources.map(card).join('');
  $('scope').innerHTML = `<strong>Scope:</strong> ${esc(data.scope.text)}<br><strong>Authority:</strong> ${esc(data.scope.authority_level)}<br><strong>Expiry:</strong> ${esc(data.scope.expiry)}`;

  $('copyStatus').onclick = async () => {
    const text = [`${data.title} / ${data.updated}`, `mode: ${data.mode}`, `route: ${data.route.id}`, `driver: ${data.design_driver}`].join('\n');
    await navigator.clipboard.writeText(text);
    $('copyStatus').textContent = 'Скопировано';
    setTimeout(() => $('copyStatus').textContent = 'Скопировать статус', 1200);
  };

  $('search').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('section').forEach(s => s.classList.toggle('hidden', q && !s.innerText.toLowerCase().includes(q)));
  });
}

boot().catch(err => { document.querySelector('main').innerHTML = `<section class="panel"><h2>Load error</h2><p>${esc(err.message)}</p></section>`; });
