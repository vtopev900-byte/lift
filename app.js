const files = {
  state: 'data/state.json',
  queues: 'data/queues.json',
  errors: 'data/errors.json',
  processes: 'data/processes.json',
  sources: 'data/sources.json',
  products: 'data/products.json'
};

const badgeClass = (value='') => {
  const v = String(value).toLowerCase();
  if (v.includes('p0') || v.includes('paused') || v.includes('blocked')) return 'badge p0';
  if (v.includes('warning') || v.includes('candidate') || v.includes('draft')) return 'badge warn';
  return 'badge ok';
};

function card(title, body, badge='') {
  return `<article class="card"><span class="${badgeClass(badge)}">${badge || 'status'}</span><h3>${title}</h3><p>${body}</p></article>`;
}

async function loadJson(path) {
  const res = await fetch(path, {cache: 'no-store'});
  if (!res.ok) throw new Error(path);
  return res.json();
}

async function boot() {
  const [state, queues, errors, processes, sources, products] = await Promise.all([
    loadJson(files.state), loadJson(files.queues), loadJson(files.errors), loadJson(files.processes), loadJson(files.sources), loadJson(files.products)
  ]);

  document.getElementById('updated').textContent = `Last updated: ${state.last_updated}`;

  document.getElementById('stateCards').innerHTML = [
    card('Current focus', state.current_focus, 'P0'),
    card('System mode', state.system_mode, state.health),
    card('Master snapshot', state.master_snapshot, state.master_snapshot),
    card('Write mode', state.write_mode, 'ok'),
    card('Open P0', state.open_p0.join('; '), 'P0'),
    card('Rules', state.rules.join('; '), 'guardrail')
  ].join('');

  document.getElementById('routeFlow').innerHTML = state.active_route.map(x => `<span>${x}</span>`).join('');
  document.getElementById('queuesList').innerHTML = queues.map(x => card(x.name, x.watch, `${x.priority} / ${x.status}`)).join('');
  document.getElementById('errorsList').innerHTML = errors.map(x => card(x.title, x.next, `${x.severity} / ${x.status}`)).join('');
  document.getElementById('processesList').innerHTML = processes.map(x => card(`${x.id} — ${x.name}`, x.role, x.status)).join('');
  document.getElementById('sourcesList').innerHTML = sources.map(x => card(x.name, `${x.role}. Look for: ${x.look_for}`, 'source')).join('');
  document.getElementById('commandsList').innerHTML = products.map(x => card(x.name, `Status: ${x.status}. Input: ${x.input}`, 'product')).join('');

  const search = document.getElementById('search');
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    document.querySelectorAll('.panel').forEach(el => {
      el.classList.toggle('hidden', q && !el.innerText.toLowerCase().includes(q));
    });
  });
}

boot().catch(err => {
  document.querySelector('main').innerHTML = `<section class="panel"><h2>Load error</h2><p>${err.message}</p></section>`;
});
