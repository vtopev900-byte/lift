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
  if (v.includes('пауза') || v.includes('решить') || v.includes('требует')) return 'p0';
  if (v.includes('кандидат') || v.includes('черновик') || v.includes('не забыть') || v.includes('нужна')) return 'warn';
  if (v.includes('работает') || v.includes('актив') || v.includes('доступен') || v.includes('опор')) return 'ok';
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

function simpleCard(title, body, meta = '') {
  return `<article class="card"><div>${meta ? badge(meta) : ''}</div><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`;
}

function navigationCard(x) {
  return `<article class="card navcard">
    <div>${badge(x.status)} ${badge(x.system_id)}</div>
    <h3>${esc(x.name)}</h3>
    <p>${esc(x.purpose)}</p>
    <footer><strong>Сейчас:</strong> ${esc(x.now)}</footer>
    <footer><strong>Дальше:</strong> ${esc(x.next)}</footer>
    <footer><strong>Влияет на:</strong> ${esc(x.impact)}</footer>
    <footer><strong>Переход:</strong> ${esc(x.link)}</footer>
  </article>`;
}

function workCard(title, items) {
  return `<article class="card wide"><h3>${esc(title)}</h3><ul>${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></article>`;
}

function snapshotCard(x) {
  return `<article class="card"><div>${badge(x.status)} ${badge(x.system_id)}</div><h3>${esc(x.name)}</h3><p>${esc(x.purpose)}</p></article>`;
}

function glossaryCard(x) {
  return `<article class="card"><div>${badge(x.system)}</div><h3>${esc(x.ru)}</h3><p>${esc(x.meaning)}</p></article>`;
}

function techCard(x) {
  return `<article class="card"><div>${badge(x.status)}</div><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></article>`;
}

async function boot() {
  const res = await fetch(DATA_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(DATA_URL);
  const data = await res.json();
  const meta = data.meta;
  const orientation = data.orientation;

  $('title').textContent = meta.title;
  $('subtitle').textContent = meta.subtitle;
  $('updated').textContent = `обновлено: ${meta.updated}`;
  $('version').textContent = meta.version;
  $('mainLine').textContent = orientation.main_line;
  $('sideRoute').textContent = meta.route;
  $('sideStatus').textContent = `${meta.version} / ${meta.status}`;

  $('orientation').innerHTML = [
    simpleCard('Главный ориентир', orientation.north_star, 'ориентир'),
    simpleCard('Было', orientation.shift.before, 'точка А'),
    simpleCard('Стало', orientation.shift.after, 'точка Б'),
    simpleCard('Сейчас', orientation.now, 'работа'),
    simpleCard('Дальше', orientation.next, 'следующий шаг')
  ].join('');

  $('navigationList').innerHTML = data.navigation.map(navigationCard).join('');
  $('workList').innerHTML = [
    workCard('Сейчас', data.work.now),
    workCard('Дальше', data.work.next),
    workCard('Позже', data.work.later)
  ].join('');
  $('snapshotList').innerHTML = data.snapshots.map(snapshotCard).join('');
  $('glossaryList').innerHTML = data.glossary.map(glossaryCard).join('');
  $('technicalList').innerHTML = data.technical.map(techCard).join('');

  $('copyBrief').onclick = () => copyText([
    `${meta.title} / ${meta.version}`,
    `функция: ${meta.main_function}`,
    `результат: ${meta.result}`,
    `маршрут: ${meta.route}`,
    `сейчас: ${orientation.now}`,
    `дальше: ${orientation.next}`
  ].join('\n'));

  $('search').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('section').forEach(s => s.classList.toggle('hidden', q && !s.innerText.toLowerCase().includes(q)));
  });
}

boot().catch(err => {
  document.querySelector('main').innerHTML = `<section class="panel"><h2>Ошибка загрузки</h2><p>${esc(err.message)}</p></section>`;
});
