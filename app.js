'use strict';

const KEY = 'fintrack:v1';
const THEME_KEY = 'fintrack:theme';
const PAGE = 200;
const NS = 'http://www.w3.org/2000/svg';

const CATS = {
  pemasukan: ['Gaji', 'Bonus', 'Freelance', 'Investasi', 'Lain-lain'],
  pengeluaran: ['Makanan', 'Transportasi', 'Tagihan', 'Belanja', 'Hiburan', 'Kesehatan', 'Lain-lain'],
};

// ramp satu keluarga warna: identitas segmen dibawa label, bukan warna acak
const RAMP = {
  light: ['#0B6B5D', '#2F8B7B', '#57A79A', '#86C3B7', '#B0D6CE', '#D3E7E2'],
  dark: ['#63C7B1', '#4FAE99', '#3E9080', '#33776A', '#2A5E55', '#234A42'],
};

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 });
const shortDate = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short' });
const monthName = new Intl.DateTimeFormat('id-ID', { month: 'short' });
const stamp = new Intl.DateTimeFormat('id-ID', { dateStyle: 'short', timeStyle: 'short' });

const $ = (id) => document.getElementById(id);
const fmt = (n) => rupiah.format(n).replace(/\u00a0/g, ' ');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let tx = [];
let savedAt = null;
let range = 'bulan';
let query = '';
let limit = PAGE;
let editId = null;
let storageError = '';
let undo = null;
let toastTimer = 0;

/* ---------- storage ---------- */

function clean(item) {
  if (!item || typeof item !== 'object') return null;
  const type = item.type === 'pemasukan' || item.type === 'pengeluaran' ? item.type : null;
  const amount = Number(item.amount);
  const date = typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) ? item.date : null;
  if (!type || !date || !Number.isFinite(amount) || amount <= 0) return null;
  const list = CATS[type];
  return {
    id: typeof item.id === 'string' && item.id ? item.id : uid(),
    type,
    amount: Math.round(amount * 100) / 100,
    category: list.includes(item.category) ? item.category : 'Lain-lain',
    date,
    note: typeof item.note === 'string' ? item.note.slice(0, 80) : '',
    createdAt: Number(item.createdAt) || Date.now(),
  };
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function load() {
  let raw = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch (e) {
    storageError = 'Browser memblokir penyimpanan lokal, jadi catatan tidak akan bertahan setelah halaman ditutup.';
    return;
  }
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    const list = Array.isArray(data) ? data : Array.isArray(data && data.tx) ? data.tx : null;
    if (!list) throw new Error('format');
    tx = list.map(clean).filter(Boolean);
    savedAt = data && Number(data.savedAt) ? data.savedAt : null;
  } catch (e) {
    storageError = 'Isi penyimpanan tidak bisa dibaca. Data lama dibiarkan utuh, catatan baru akan menimpa setelah kamu menyimpan.';
  }
}

function save() {
  if (storageError && !savedAt) return;
  try {
    savedAt = Date.now();
    localStorage.setItem(KEY, JSON.stringify({ v: 1, tx, savedAt }));
  } catch (e) {
    savedAt = null;
    storageError = 'Penyimpanan penuh atau diblokir. Catatan ini belum tersimpan permanen, unduh JSON untuk mengamankan.';
  }
}

/* ---------- helpers ---------- */

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function monthKey(dateStr) {
  return dateStr.slice(0, 7);
}

function currentMonth() {
  return today().slice(0, 7);
}

function totals(rows) {
  let income = 0;
  let expense = 0;
  for (const t of rows) {
    if (t.type === 'pemasukan') income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, net: income - expense };
}

function filtered() {
  const now = today();
  const thisMonth = currentMonth();
  const needle = query.trim().toLowerCase();
  return tx
    .filter((t) => {
      if (range === 'hari' && t.date !== now) return false;
      if (range === 'bulan' && monthKey(t.date) !== thisMonth) return false;
      if (needle && !`${t.note} ${t.category}`.toLowerCase().includes(needle)) return false;
      return true;
    })
    .sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1));
}

function announce(text) {
  $('announcer').textContent = text;
}

/* ---------- render ---------- */

function renderStorage() {
  const el = $('storage-status');
  const err = $('store-error');
  if (storageError) {
    el.dataset.state = 'error';
    el.textContent = 'Tidak tersimpan permanen';
    err.textContent = storageError;
    err.hidden = false;
  } else {
    el.dataset.state = 'ok';
    el.textContent = `${tx.length} catatan di perangkat ini${savedAt ? `, terakhir disimpan ${stamp.format(new Date(savedAt))}` : ''}`;
    err.hidden = true;
  }
}

function renderSummary() {
  const all = totals(tx);
  $('balance-value').textContent = fmt(all.net);
  $('total-income').textContent = fmt(all.income);
  $('total-expense').textContent = fmt(all.expense);
  $('total-count').textContent = String(tx.length);
}

function renderList() {
  const rows = filtered();
  const list = $('rows');
  const shown = rows.slice(0, limit);
  $('list-count').textContent = `${rows.length} catatan`;
  $('more').hidden = rows.length <= shown.length;
  $('more').textContent = `Muat ${Math.min(PAGE, rows.length - shown.length)} catatan lagi`;

  list.innerHTML = shown
    .map((t) => {
      const label = t.note || t.category;
      const sign = t.type === 'pemasukan' ? '+' : '-';
      return `<li class="row" data-id="${t.id}">
        <span class="row-date">${shortDate.format(new Date(t.date + 'T00:00:00'))}</span>
        <span class="row-main">
          <span class="row-note${t.note ? '' : ' is-empty'}">${t.note ? esc(t.note) : 'Tanpa catatan'}</span>
          <span class="row-cat">${esc(t.category)}</span>
        </span>
        <span class="row-amt" data-type="${t.type}">${sign}${fmt(t.amount)}</span>
        <span class="row-actions">
          <button type="button" class="icon-btn" data-act="edit" aria-label="Ubah catatan ${esc(label)}">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="M13.5 6.5 17.5 10.5"/></svg>
          </button>
          <button type="button" class="icon-btn" data-act="del" aria-label="Hapus catatan ${esc(label)}">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/><path d="M11 11v5M13 11v5"/></svg>
          </button>
        </span>
      </li>`;
    })
    .join('');

  const empty = $('empty');
  empty.hidden = rows.length > 0;
  if (!rows.length) {
    const hasAny = tx.length > 0;
    $('empty-text').textContent = hasAny
      ? query.trim()
        ? `Tidak ada catatan yang cocok dengan "${query.trim()}" di rentang ini.`
        : 'Rentang ini belum punya catatan. Coba pilih Semua.'
      : 'Belum ada catatan sama sekali. Mulai dari satu transaksi hari ini.';
    $('empty-cta').textContent = hasAny ? 'Ubah filter atau kata kunci di atas' : 'Catat transaksi pertama';
    $('empty-cta').setAttribute('href', hasAny ? '#riwayat' : '#catat');
  }
}

function renderCharts() {
  renderBar();
  renderDonut();
}

function plotGroup(id) {
  const svg = $(id);
  let g = svg.querySelector('g.plot');
  if (!g) {
    g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'plot');
    svg.appendChild(g);
  }
  g.textContent = '';
  return g;
}

function mk(tag, attrs, text) {
  const node = document.createElementNS(NS, tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  if (text != null) node.textContent = text;
  return node;
}

function renderBar() {
  const g = plotGroup('bar-chart');
  const baseY = 186;
  const topY = 14;
  const left = 42;
  const right = 512;
  const plotH = baseY - topY;

  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({ key, label: monthName.format(d), income: 0, expense: 0 });
  }
  const byKey = new Map(months.map((m) => [m.key, m]));
  for (const t of tx) {
    const m = byKey.get(monthKey(t.date));
    if (!m) continue;
    if (t.type === 'pemasukan') m.income += t.amount;
    else m.expense += t.amount;
  }

  const max = Math.max(1, ...months.map((m) => Math.max(m.income, m.expense)));
  const niceMax = Math.pow(10, Math.floor(Math.log10(max))) * (Math.ceil(max / Math.pow(10, Math.floor(Math.log10(max)))) || 1);

  for (let i = 0; i <= 3; i++) {
    const y = baseY - (plotH * i) / 3;
    g.appendChild(mk('line', { x1: left, x2: right, y1: y, y2: y, class: 'grid-line' }));
    g.appendChild(mk('text', { x: left - 8, y: y + 3.5, class: 'tick', 'text-anchor': 'end' }, compact.format((niceMax * i) / 3)));
  }

  const groupW = (right - left) / months.length;
  const barW = Math.min(16, groupW / 3.2);
  let hasData = false;

  months.forEach((m, i) => {
    const cx = left + groupW * (i + 0.5);
    if (m.income) hasData = true;
    if (m.expense) hasData = true;
    const bars = [
      { v: m.income, x: cx - barW - 2, cls: 'bar-in' },
      { v: m.expense, x: cx + 2, cls: 'bar-out' },
    ];
    for (const b of bars) {
      const h = Math.max(b.v ? 2 : 0, (b.v / niceMax) * plotH);
      if (!b.v) continue;
      g.appendChild(mk('rect', { x: b.x, y: baseY - h, width: barW, height: h, rx: 3, class: b.cls }));
    }
    g.appendChild(mk('text', { x: cx, y: baseY + 18, class: 'tick', 'text-anchor': 'middle' }, m.label));
  });

  g.appendChild(mk('line', { x1: left, x2: right, y1: baseY, y2: baseY, class: 'axis-line' }));

  if (!hasData) {
    g.appendChild(mk('text', { x: (left + right) / 2, y: baseY - plotH / 2, class: 'chart-note', 'text-anchor': 'middle' }, 'Belum ada catatan di 6 bulan ini'));
  }

  const tot = totals(tx.filter((t) => byKey.has(monthKey(t.date))));
  $('bar-desc').textContent = hasData
    ? `Enam bulan terakhir: pemasukan ${fmt(tot.income)}, pengeluaran ${fmt(tot.expense)}.`
    : 'Belum ada catatan pada enam bulan terakhir.';
}

function renderDonut() {
  const stack = plotGroup('donut-chart');
  const legend = $('donut-legend');
  const thisMonth = currentMonth();
  const rows = tx.filter((t) => t.type === 'pengeluaran' && monthKey(t.date) === thisMonth);

  const groups = new Map();
  for (const t of rows) groups.set(t.category, (groups.get(t.category) || 0) + t.amount);
  const entries = [...groups.entries()].sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, e) => s + e[1], 0);

  if (!total) {
    stack.appendChild(mk('circle', { cx: 90, cy: 90, r: 62, class: 'donut-track' }));
    stack.appendChild(mk('text', { x: 90, y: 94, class: 'chart-note', 'text-anchor': 'middle' }, 'Belum ada'));
    legend.innerHTML = '<li><span>Belum ada pengeluaran bulan ini.</span></li>';
    $('donut-desc').textContent = 'Belum ada pengeluaran bulan ini.';
    return;
  }

  const ramp = RAMP[document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'];
  const r = 62;
  const c = 2 * Math.PI * r;
  let offset = 0;

  stack.appendChild(mk('circle', { cx: 90, cy: 90, r, class: 'donut-track' }));
  entries.forEach(([name, val], i) => {
    const len = (val / total) * c;
    stack.appendChild(
      mk('circle', {
        cx: 90, cy: 90, r,
        fill: 'none',
        stroke: ramp[i % ramp.length],
        'stroke-width': 22,
        'stroke-dasharray': `${Math.max(len - 1.5, 0)} ${c - Math.max(len - 1.5, 0)}`,
        'stroke-dashoffset': -offset,
        transform: 'rotate(-90 90 90)',
      })
    );
    offset += len;
  });

  stack.appendChild(mk('text', { x: 90, y: 86, class: 'donut-total', 'text-anchor': 'middle' }, compact.format(total)));
  stack.appendChild(mk('text', { x: 90, y: 102, class: 'tick', 'text-anchor': 'middle' }, 'bulan ini'));

  legend.innerHTML = entries
    .map(([name, val], i) => {
      const pct = Math.round((val / total) * 100);
      return `<li><span class="sw" style="background:${ramp[i % ramp.length]}"></span>${esc(name)}<span class="v">${pct}%</span></li>`;
    })
    .join('');

  $('donut-desc').textContent = entries.map(([name, val]) => `${name} ${Math.round((val / total) * 100)} persen`).join(', ') + `. Total ${fmt(total)}.`;
}

function renderAll() {
  renderStorage();
  renderSummary();
  renderList();
  renderCharts();
}

/* ---------- form ---------- */

function fillCategories(type, selected) {
  const sel = $('category');
  sel.innerHTML = CATS[type].map((c) => `<option value="${c}">${c}</option>`).join('');
  if (selected && CATS[type].includes(selected)) sel.value = selected;
}

function currentType() {
  return document.querySelector('input[name="type"]:checked').value;
}

function resetForm() {
  editId = null;
  $('tx-form').reset();
  $('date').value = today();
  fillCategories(currentType());
  $('entry-mode').textContent = 'Baru';
  $('submit-btn').textContent = 'Simpan transaksi';
  $('cancel-edit').hidden = true;
  $('form-error').hidden = true;
}

function startEdit(id) {
  const t = tx.find((x) => x.id === id);
  if (!t) return;
  editId = id;
  document.querySelector(`input[name="type"][value="${t.type}"]`).checked = true;
  fillCategories(t.type, t.category);
  $('amount').value = t.amount;
  $('date').value = t.date;
  $('note').value = t.note;
  $('entry-mode').textContent = 'Mengubah catatan';
  $('submit-btn').textContent = 'Simpan perubahan';
  $('cancel-edit').hidden = false;
  $('form-error').hidden = true;
  location.hash = '#catat';
  $('amount').focus();
}

function onSubmit(ev) {
  ev.preventDefault();
  const err = $('form-error');
  const amount = Number($('amount').value);
  const date = $('date').value;

  if (!Number.isFinite(amount) || amount <= 0) {
    err.textContent = 'Nominal harus lebih dari 0.';
    err.hidden = false;
    $('amount').focus();
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    err.textContent = 'Tanggal belum diisi.';
    err.hidden = false;
    $('date').focus();
    return;
  }
  err.hidden = true;

  const base = {
    type: currentType(),
    amount: Math.round(amount * 100) / 100,
    category: $('category').value,
    date,
    note: $('note').value.trim().slice(0, 80),
  };

  if (editId) {
    const t = tx.find((x) => x.id === editId);
    if (t) Object.assign(t, base);
    announce('Catatan diperbarui.');
    resetForm();
  } else {
    tx.push({ id: uid(), createdAt: Date.now(), ...base });
    $('amount').value = '';
    $('note').value = '';
    $('amount').focus();
    announce('Catatan ditambahkan.');
  }
  range = 'semua';
  syncRange();
  save();
  renderAll();
}

function syncRange() {
  document.querySelectorAll('[data-range]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.range === range));
  });
}

/* ---------- list actions ---------- */

function removeTx(id) {
  const i = tx.findIndex((t) => t.id === id);
  if (i < 0) return;
  const [item] = tx.splice(i, 1);
  undo = { item, index: i };
  save();
  renderAll();
  announce('Catatan dihapus. Tombol urungkan tersedia.');
  showToast(`Catatan "${item.note || item.category}" dihapus.`, true);
}

function showToast(text, withUndo) {
  const el = $('toast');
  $('toast-text').textContent = text;
  $('toast-undo').hidden = !withUndo;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.hidden = true;
    $('toast-undo').hidden = true;
  }, 7000);
}

/* ---------- data portability ---------- */

function download(name, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportJson() {
  download(`fintrack-${today()}.json`, JSON.stringify({ v: 1, exportedAt: new Date().toISOString(), tx }, null, 2), 'application/json');
  note(`Cadangan JSON diunduh, ${tx.length} catatan.`, false);
}

function exportCsv() {
  const cell = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [['tanggal', 'jenis', 'kategori', 'catatan', 'nominal'].map(cell).join(',')];
  for (const t of [...tx].sort((a, b) => (a.date < b.date ? 1 : -1))) {
    lines.push([t.date, t.type, t.category, t.note, t.amount].map(cell).join(','));
  }
  download(`fintrack-${today()}.csv`, lines.join('\r\n'), 'text/csv');
  note(`CSV diunduh, ${tx.length} baris.`, false);
}

async function importJson(file) {
  try {
    const data = JSON.parse(await file.text());
    const list = Array.isArray(data) ? data : Array.isArray(data && data.tx) ? data.tx : null;
    if (!list) throw new Error('Berkas tidak berisi daftar transaksi FinTrack.');
    const known = new Set(tx.map((t) => t.id));
    let added = 0;
    let skipped = 0;
    for (const raw of list) {
      const item = clean(raw);
      if (!item) {
        skipped++;
        continue;
      }
      if (known.has(item.id)) {
        skipped++;
        continue;
      }
      known.add(item.id);
      tx.push(item);
      added++;
    }
    save();
    renderAll();
    note(`Impor selesai: ${added} catatan ditambahkan, ${skipped} dilewati (tidak valid atau sudah ada).`, false);
    announce(`${added} catatan diimpor.`);
  } catch (e) {
    note(e.message || 'Berkas tidak bisa dibaca.', true);
  }
}

function note(text, isError) {
  const el = $('data-note');
  el.textContent = text;
  el.hidden = false;
  el.classList.toggle('alert', Boolean(isError));
}

/* ---------- theme ---------- */

function applyTheme(name) {
  document.documentElement.dataset.theme = name;
  $('theme-btn').setAttribute('aria-pressed', String(name === 'dark'));
  $('theme-btn').querySelector('.sr-only').textContent = name === 'dark' ? 'Pakai tema terang' : 'Pakai tema gelap';
  try {
    localStorage.setItem(THEME_KEY, name);
  } catch (e) {
    /* tema tetap jalan tanpa penyimpanan */
  }
  renderDonut();
}

/* ---------- init ---------- */

function init() {
  load();

  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch (e) {
    /* biarkan terang */
  }
  document.documentElement.dataset.theme = savedTheme;
  $('theme-btn').setAttribute('aria-pressed', String(savedTheme === 'dark'));

  $('date').value = today();
  fillCategories('pengeluaran');
  syncRange();
  renderAll();

  $('theme-btn').addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    $('theme-btn').querySelector('.sr-only').textContent =
      document.documentElement.dataset.theme === 'dark' ? 'Pakai tema terang' : 'Pakai tema gelap';
  });

  document.querySelectorAll('input[name="type"]').forEach((r) =>
    r.addEventListener('change', () => fillCategories(currentType()))
  );

  $('tx-form').addEventListener('submit', onSubmit);
  $('cancel-edit').addEventListener('click', () => {
    resetForm();
    announce('Ubah catatan dibatalkan.');
  });

  document.querySelectorAll('[data-range]').forEach((b) =>
    b.addEventListener('click', () => {
      range = b.dataset.range;
      limit = PAGE;
      syncRange();
      renderList();
    })
  );

  let searchTimer = 0;
  $('q').addEventListener('input', (ev) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      query = ev.target.value;
      limit = PAGE;
      renderList();
    }, 150);
  });

  $('rows').addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-act]');
    if (!btn) return;
    const id = btn.closest('.row').dataset.id;
    if (btn.dataset.act === 'edit') startEdit(id);
    else removeTx(id);
  });

  $('more').addEventListener('click', () => {
    limit += PAGE;
    renderList();
  });

  $('toast-undo').addEventListener('click', () => {
    if (!undo) return;
    tx.splice(undo.index, 0, undo.item);
    undo = null;
    save();
    renderAll();
    $('toast').hidden = true;
    announce('Penghapusan dibatalkan.');
  });

  $('export-json').addEventListener('click', exportJson);
  $('export-csv').addEventListener('click', exportCsv);
  $('import-file').addEventListener('change', (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (file) importJson(file);
    ev.target.value = '';
  });

  const dialog = $('reset-dialog');
  $('reset-btn').addEventListener('click', () => dialog.showModal());
  $('reset-cancel').addEventListener('click', () => dialog.close());
  $('reset-confirm').addEventListener('click', () => {
    tx = [];
    savedAt = null;
    range = 'bulan';
    query = '';
    $('q').value = '';
    limit = PAGE;
    syncRange();
    resetForm();
    save();
    renderAll();
    dialog.close();
    note('Semua catatan dihapus dari browser ini.', false);
    announce('Semua catatan dihapus.');
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && editId) {
      resetForm();
      announce('Ubah catatan dibatalkan.');
    }
  });
}

function updateActiveTab() {
  const cur = location.hash || '#riwayat';
  document.querySelectorAll('.topnav .tab-link').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === cur);
  });
}
window.addEventListener('hashchange', updateActiveTab);
init();
updateActiveTab();
