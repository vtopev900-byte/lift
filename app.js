const DATA_URL = 'data/admin-console.json';
const $ = (id) => document.getElementById(id);

const esc = (v = '') => String(v)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function tone(value = '') {
  const v = String(value).toLowerCase();
  if (v.includes('p0') || v.includes('risk') || v.includes('missing') || v.includes('blocked')) return 'p0';
  if (v.includes('p1') || v.includes('watch') || v.includes('candidate') || v.includes('partial') || v.includes('manual')) return 'warn';
  if (v.includes('ok') || v.includes('active') || v.includes('ready') || v.includes('available')) return 'ok';
  return 'neutral';
}

function badge(text) {
  return `<span class="badge ${tone(text)}">${esc(text)}</span>`;
}

function showToast(text = 'Скопировано') {
  const toast = $('toast');
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1300);
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
  showToast();
}

function card(x) {
  return `<article class="card">
    <div>${badge(x.level || x.status || x.role || x.scope || 'item')}</div>
    <h3>${esc(x.title || x.role || x.scope || x.type || x.id || x.label)}</h3>
    <p>${esc(x.body || x.job || x.purpose || x.note || '')}</p>
    ${x.open ? `<footer>Open: ${esc(x.open)}</footer>` : ''}
    ${x.next ? `<footer>Next: ${esc(x.next)}</footer>` : ''}
  </article>`;
}

function metric(x) {
  return `<article class="metric ${tone(x.tone || x.status || x.value)}">
    <small>${esc(x.label)}</small>
    <strong>${esc(x.value)}</strong>
    <p>${esc(x.note)}</p>
  </article>`;
}

function command(x) {
  const payload = JSON.stringify(x.payload, null, 2);
  return `<article class="commandcard">
    <div class="badges">${badge(x.level)} ${badge(x.status)}</div>
    <h3>${esc(x.title)}</h3>
    <p>${esc(x.description)}</p>
    <details><summary>Payload</summary><pre>${esc(payload)}</pre></details>
    <button data-copy="${esc(payload)}">Скопировать payload</button>
  </article>`;
}

function approval(x) {
  return `<article class="card approval">
    <div>${badge(x.scope)}</div>
    <h3>${esc(x.scope)}</h3>
    <p><strong>Можно:</strong> ${esc((x.allowed || []).join(', '))}</p>
    <p><strong>Нельзя:</strong> ${esc((x.blocked || []).join(', '))}</p>
  </article>`;
}

function runtime(x) {
  return `<article class="check ${tone(x.status)}">
    <span>${esc(x.status)}</span>
    <div><h3>${esc(x.check)}</h3><p>${esc(x.expected)}</p></div>
  </article>`;
}

function dataContract(data) {
  const rules = (data.public_projection_rules || []).map(x => `<li>${esc(x)}</li>`).join('');
  const files = (data.required_json_files || []).map(x => `<li><strong>${esc(x.file)}</strong> — ${esc(x.purpose)}</li>`).join('');
  const future = (data.future_tables || []).map(x => `<li><strong>${esc(x.name)}</strong> ${badge(x.status)}<br>${esc(x.purpose)}</li>`).join('');
  return `
    <article class="card wide"><h3>Projection rules</h3><ul>${rules}</ul></article>
    <article class="card wide"><h3>JSON files</h3><ul>${files}</ul></article>
    <article class="card wide"><h3>Future tables</h3><ul>${future}</ul></article>
  `;
}

async function boot() {
  const res = await fetch(DATA_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(DATA_URL);
  const data = await res.json();
  const meta = data.meta;

  $('title').textContent = meta.title;
  $('subtitle').textContent = meta.subtitle;
  $('updated').textContent = `updated: ${meta.updated}`;
  $('mode').textContent = meta.mode;
  $('driver').textContent = meta.design_driver;
  $('sideRoute').textContent = meta.route;
  $('sideStatus').textContent = `${meta.status} / ${meta.visibility}`;

  $('notice').innerHTML = `<h3>${esc(data.notice.title)}</h3><p>${esc(data.notice.body)}</p>`;
  $('ownerFlow').innerHTML = [
    {role: '1', title: 'Где я сейчас?', body: meta.design_driver, status: meta.mode},
    {role: '2', title: 'Что можно сделать?', body: 'Выбрать entry route, проверить state, скопировать command payload, пройти approval boundary.', status: 'console'},
    {role: '3', title: 'Что нельзя?', body: 'Нельзя считать статическую кнопку выполненным действием. Выполнение появится только через execution layer.', status: 'guard'},
    {role: '4', title: 'Что дальше?', body: 'Проверить, какие команды реально нужны первыми, затем подключать execution layer.', status: 'next'}
  ].map(card).join('');

  $('entryMap').innerHTML = data.entry_map.map(card).join('');
  $('stateGrid').innerHTML = data.state.map(metric).join('');
  $('attentionList').innerHTML = data.attention.map(card).join('');
  $('commandsList').innerHTML = data.commands.map(command).join('');
  $('approvalList').innerHTML = data.approval_center.map(approval).join('');
  $('runtimeList').innerHTML = data.runtime_test.map(runtime).join('');
  $('snapshotList').innerHTML = data.snapshots.map(card).join('');
  $('dataContract').innerHTML = dataContract(data.data_contract);
  $('notForget').innerHTML = data.not_forget.map(card).join('');

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => copyText(btn.getAttribute('data-copy')));
  });

  $('copyBrief').onclick = () => copyText([
    `${meta.title} / ${meta.updated}`,
    `route: ${meta.route}`,
    `status: ${meta.status}`,
    `document_token: ${meta.document_token}`,
    `object_id: ${meta.object_id}`,
    `driver: ${meta.design_driver}`
  ].join('\n'));

  $('search').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('section').forEach(s => s.classList.toggle('hidden', q && !s.innerText.toLowerCase().includes(q)));
  });
}

boot().catch(err => {
  document.querySelector('main').innerHTML = `<section class="panel"><h2>Load error</h2><p>${esc(err.message)}</p></section>`;
});
