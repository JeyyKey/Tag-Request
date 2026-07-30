// ============================================================
// Tag Request app
// Builds a queue of (store, tag, qty) line items and renders a
// live store x tag summary matrix, matching the source sheet.
// ============================================================

(function () {
  'use strict';

  const STORES = [
    'Ayala Abreeza',
    'SM Mall of Asia',
    'SM Aura',
    'SM Dasmarinas',
    'SM Megamall',
    'SM North EDSA',
    'SM Seaside',
    'One Ayala',
    'SM Iloilo',
    'SM Palawan Puerto Princesa',
    'SM Pampanga San Fernando',
    'SM Sucat',
    'SM Sta. Mesa',
    'SM Fairview',
    'Festival',
    'SM CDO',
    'SM Zamboanga'
  ];

  const TAGS = [
    'Osmo Action 6 + Osmo Action 4',
    'Osmo Action 6 + Osmo Action 5 Pro',
    'Nano + Osmo 360',
    'Mic 3 + Osmo Pocket 3',
    'Lito X1 + Lito 1',
    'AIR 3S',
    'Pocket 3 Price Drop + Mic 3',
    'Neo',
    'Mic 3 + Mic Mini 2',
    'AVATA 2 + AVATA 360',
    'Osmo 360 + Osmo Mobile 8',
    'Osmo Mobile 8 + MIC 2',
    'Neo 2 + Neo',
    'Pocket 3 + Pocket 3 Creator',
    'Mic 3',
    'Osmo Pocket 4 + Osmo Pocket 3',
    'Osmo Pocket 4 + Osmo Pocket 4 Pro',
    'Osmo Mobile 8 + MIC Mini 2',
    'Osmo Mobile 8 + MIC 3',
    'Mic Mini 3 + Osmo Pocket 3'
  ];

  /** @type {{id:number, store:string, tag:string, qty:number}[]} */
  let queue = [];
  let nextId = 1;

  // ---------- DOM refs ----------
  const storeSelect = document.getElementById('storeSelect');
  const tagGrid = document.getElementById('tagGrid');
  const form = document.getElementById('requestForm');
  const formError = document.getElementById('formError');

  const queueList = document.getElementById('queueList');
  const queueEmpty = document.getElementById('queueEmpty');

  const grandTotalEl = document.getElementById('grandTotal');
  const lineCountEl = document.getElementById('lineCount');

  const matrixHeadRow = document.getElementById('matrixHeadRow');
  const matrixBody = document.getElementById('matrixBody');
  const matrixFootRow = document.getElementById('matrixFootRow');

  const exportCsvBtn = document.getElementById('exportCsv');
  const printBtn = document.getElementById('printSheet');
  const clearAllBtn = document.getElementById('clearAll');

  // ---------- init store select ----------
  STORES.forEach((store) => {
    const opt = document.createElement('option');
    opt.value = store;
    opt.textContent = store;
    storeSelect.appendChild(opt);
  });

  // ---------- init bulk tag-quantity grid ----------
  // One row per tag, each with its own quantity input, so a whole
  // store's request can be filled in and submitted in one go.
  TAGS.forEach((tag, index) => {
    const row = document.createElement('div');
    row.className = 'tag-row';
    row.dataset.tag = tag;

    const inputId = `tagqty-${index}`;
    row.innerHTML = `
      <label class="tag-row__name" for="${inputId}">${escapeHtml(tag)}</label>
      <input type="number" id="${inputId}" class="tag-row__input" min="0" step="1" placeholder="0">
    `;

    const input = row.querySelector('input');
    input.addEventListener('input', () => {
      row.classList.toggle('has-qty', parseInt(input.value, 10) > 0);
    });

    tagGrid.appendChild(row);
  });

  function resetTagGrid() {
    tagGrid.querySelectorAll('.tag-row').forEach((row) => {
      row.querySelector('input').value = '';
      row.classList.remove('has-qty');
    });
  }

  // ---------- form submit (bulk, per store) ----------
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formError.textContent = '';

    const store = storeSelect.value;
    if (!store) {
      formError.textContent = 'Choose a store before adding.';
      return;
    }

    const rows = [...tagGrid.querySelectorAll('.tag-row')];
    const entries = rows
      .map((row) => ({
        tag: row.dataset.tag,
        qty: parseInt(row.querySelector('input').value, 10) || 0
      }))
      .filter((entry) => entry.qty > 0);

    if (entries.length === 0) {
      formError.textContent = 'Enter a quantity for at least one tag.';
      return;
    }

    entries.forEach(({ tag, qty }) => {
      const existing = queue.find((q) => q.store === store && q.tag === tag);
      if (existing) {
        existing.qty += qty;
      } else {
        queue.push({ id: nextId++, store, tag, qty });
      }
    });

    storeSelect.selectedIndex = 0;
    resetTagGrid();

    render();
  });

  clearAllBtn.addEventListener('click', () => {
    if (queue.length === 0) return;
    if (confirm('Clear all queued tag requests? This cannot be undone.')) {
      queue = [];
      render();
    }
  });

  // ---------- render: request summary (aggregated per tag) ----------
  function renderQueue() {
    queueList.innerHTML = '';

    if (queue.length === 0) {
      queueList.appendChild(queueEmpty);
      queueEmpty.style.display = 'block';
      return;
    }

    // Aggregate quantities per tag across every store, in TAGS order
    const totalsByTag = new Map();
    queue.forEach((item) => {
      totalsByTag.set(item.tag, (totalsByTag.get(item.tag) || 0) + item.qty);
    });

    let grandTotal = 0;
    TAGS.filter((tag) => totalsByTag.has(tag)).forEach((tag) => {
      const count = totalsByTag.get(tag);
      grandTotal += count;

      const row = document.createElement('div');
      row.className = 'summary-item';
      row.innerHTML = `
        <span class="summary-item__name">${escapeHtml(tag)}</span>
        <span class="summary-item__count">${count}</span>
      `;
      queueList.appendChild(row);
    });

    const totalRow = document.createElement('div');
    totalRow.className = 'summary-total';
    totalRow.innerHTML = `<span>Total tags requested</span><span>${grandTotal}</span>`;
    queueList.appendChild(totalRow);
  }

  // ---------- render: matrix ----------
  function renderMatrix() {
    // Header row: MODEL | store1 | store2 | ... | GRAND TOTAL
    matrixHeadRow.innerHTML = '<th class="matrix__corner">MODEL</th>';
    STORES.forEach((store) => {
      const th = document.createElement('th');
      th.textContent = store;
      matrixHeadRow.appendChild(th);
    });
    const grandTh = document.createElement('th');
    grandTh.textContent = 'GRAND TOTAL';
    grandTh.classList.add('grand-cell');
    matrixHeadRow.appendChild(grandTh);

    // Body: one row per tag that has at least one request, in TAGS order
    matrixBody.innerHTML = '';
    const activeTags = TAGS.filter((tag) => queue.some((q) => q.tag === tag));

    const storeColumnTotals = Object.fromEntries(STORES.map((s) => [s, 0]));
    let grandTotal = 0;

    activeTags.forEach((tag) => {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = tag;
      tr.appendChild(th);

      let rowTotal = 0;
      STORES.forEach((store) => {
        const match = queue.find((q) => q.store === store && q.tag === tag);
        const qty = match ? match.qty : 0;
        rowTotal += qty;
        storeColumnTotals[store] += qty;

        const td = document.createElement('td');
        if (qty > 0) {
          td.textContent = qty;
          td.classList.add('has-value');
        } else {
          td.textContent = '';
        }
        tr.appendChild(td);
      });

      grandTotal += rowTotal;

      const totalTd = document.createElement('td');
      totalTd.textContent = rowTotal;
      totalTd.classList.add('matrix-total');
      tr.appendChild(totalTd);

      matrixBody.appendChild(tr);
    });

    if (activeTags.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = STORES.length + 2;
      td.style.textAlign = 'center';
      td.style.color = '#9c927e';
      td.style.fontFamily = "'Inter', sans-serif";
      td.textContent = 'No tag requests queued yet — the summary will populate as you add them.';
      tr.appendChild(td);
      matrixBody.appendChild(tr);
    }

    // Footer: TOTAL PER STORE
    matrixFootRow.innerHTML = '<th>TOTAL PER STORE</th>';
    STORES.forEach((store) => {
      const td = document.createElement('td');
      td.textContent = storeColumnTotals[store];
      matrixFootRow.appendChild(td);
    });
    const grandFootTd = document.createElement('td');
    grandFootTd.textContent = grandTotal;
    grandFootTd.classList.add('grand-cell');
    matrixFootRow.appendChild(grandFootTd);

    grandTotalEl.textContent = grandTotal;
    lineCountEl.textContent = queue.length;
  }

  function render() {
    renderQueue();
    renderMatrix();
  }

  // ---------- CSV export ----------
  function exportCsv() {
    const rows = [];
    const activeTags = TAGS.filter((tag) => queue.some((q) => q.tag === tag));

    rows.push(['MODEL', ...STORES, 'GRAND TOTAL']);

    const storeColumnTotals = Object.fromEntries(STORES.map((s) => [s, 0]));
    let grandTotal = 0;

    activeTags.forEach((tag) => {
      const row = [tag];
      let rowTotal = 0;
      STORES.forEach((store) => {
        const match = queue.find((q) => q.store === store && q.tag === tag);
        const qty = match ? match.qty : 0;
        row.push(qty || '');
        rowTotal += qty;
        storeColumnTotals[store] += qty;
      });
      row.push(rowTotal);
      grandTotal += rowTotal;
      rows.push(row);
    });

    rows.push(['TOTAL PER STORE', ...STORES.map((s) => storeColumnTotals[s]), grandTotal]);

    const csvContent = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `tag-request-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  exportCsvBtn.addEventListener('click', () => {
    if (queue.length === 0) {
      formError.textContent = 'Add at least one tag request before exporting.';
      return;
    }
    exportCsv();
  });

  printBtn.addEventListener('click', () => window.print());

  // ---------- utils ----------
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // initial render
  render();
})();
