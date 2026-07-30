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
  const tagSelect = document.getElementById('tagSelect');
  const qtyInput = document.getElementById('qtyInput');
  const qtyUp = document.getElementById('qtyUp');
  const qtyDown = document.getElementById('qtyDown');
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

  // ---------- init selects ----------
  function populateSelect(selectEl, items, placeholder) {
    items.forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item;
      opt.textContent = item;
      selectEl.appendChild(opt);
    });
  }

  populateSelect(storeSelect, STORES);
  populateSelect(tagSelect, TAGS);

  // ---------- qty stepper ----------
  qtyUp.addEventListener('click', () => {
    qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 0) + 1);
  });
  qtyDown.addEventListener('click', () => {
    qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
  });

  // ---------- form submit ----------
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formError.textContent = '';

    const store = storeSelect.value;
    const tag = tagSelect.value;
    const qty = parseInt(qtyInput.value, 10);

    if (!store || !tag) {
      formError.textContent = 'Choose a store and a tag before adding.';
      return;
    }
    if (!qty || qty < 1) {
      formError.textContent = 'Quantity must be at least 1.';
      return;
    }

    // Merge into an existing line for the same store + tag, if present
    const existing = queue.find((q) => q.store === store && q.tag === tag);
    if (existing) {
      existing.qty += qty;
    } else {
      queue.push({ id: nextId++, store, tag, qty });
    }

    form.reset();
    storeSelect.selectedIndex = 0;
    tagSelect.selectedIndex = 0;
    qtyInput.value = 1;

    render();
  });

  // ---------- remove a line ----------
  function removeLine(id) {
    queue = queue.filter((q) => q.id !== id);
    render();
  }

  clearAllBtn.addEventListener('click', () => {
    if (queue.length === 0) return;
    if (confirm('Clear all queued tag requests? This cannot be undone.')) {
      queue = [];
      render();
    }
  });

  // ---------- render: queue list ----------
  function renderQueue() {
    queueList.innerHTML = '';

    if (queue.length === 0) {
      queueList.appendChild(queueEmpty);
      queueEmpty.style.display = 'block';
      return;
    }

    // newest first
    [...queue].reverse().forEach((item) => {
      const row = document.createElement('div');
      row.className = 'queue-item';
      row.innerHTML = `
        <div class="queue-item__info">
          <div class="queue-item__tag">${escapeHtml(item.tag)}</div>
          <div class="queue-item__store">${escapeHtml(item.store)}</div>
        </div>
        <span class="queue-item__qty">&times;${item.qty}</span>
        <button type="button" class="queue-item__remove" title="Remove" aria-label="Remove line">&times;</button>
        <span></span>
      `;
      row.querySelector('.queue-item__remove').addEventListener('click', () => removeLine(item.id));
      queueList.appendChild(row);
    });
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
