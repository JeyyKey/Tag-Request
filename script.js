// ============================================================
// Tag Request app
// Lets staff mix & match any DJI products into a custom combo
// "tag" per store, stage several combos, then submit the store's
// request in one go. A live store x tag summary matrix and an
// aggregated request summary update as requests come in.
// ============================================================

(function () {
  'use strict';

  let STORES = [
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

  let PRODUCT_CATEGORIES = [
    {
      name: 'DRONES',
      items: [
        'DJI MAVIC 3 PRO CINE PREMIUM COMBO',
        'DJI MAVIC 3 PRO FLY MORE COMBO (RC PRO)',
        'DJI MAVIC 3 PRO FLY MORE COMBO (DJI RC)',
        'DJI MAVIC 3 PRO (DJI RC)',
        'DJI Mavic 4 Pro 512GB Greator Combo(DJI RC Pro2)',
        'DJI Mavic 4 Pro Fly More Combo(DJI RC 2)',
        'DJI Mavic 4 Pro',
        'DJI Air 3S Fly More Combo (DJI RC 2)',
        'DJI Air 3S Fly More Combo (DJI RC-N3)',
        'DJI Air 3S (DJI RC-N3)',
        'DJI Mini 5 Pro Fly More Combo Plus (DJI RC2)',
        'DJI Mini 5 Pro Fly More Combo (DJI RC2)',
        'DJI Mini 5 Pro Fly More Combo (DJI RC-N3)',
        'DJI Mini 5 Pro',
        'DJI Mini 4 Pro Fly More Combo Plus (DJI RC 2) (GL)',
        'DJI Mini 4 Pro Fly More Combo (DJI RC 2) (GL)',
        'DJI Mini 4 Pro (DJI RC 2) (GL)',
        'DJI Mini 4 Pro (GL)',
        'DJI Lito X1 Fly More Combo Plus (DJI RC 2)',
        'DJI Lito X1 Fly More Combo (DJI RC 2)',
        'DJI Lito X1 Fly More Combo (DJI RC-N3)',
        'DJI Lito X1',
        'DJI Lito 1 Fly More Combo (DJI RC-N3)',
        'DJI Lito 1',
        'DJI Mini 4k Fly More Combo (GL)',
        'DJI Mini 4K (GL)',
        'DJI MINI 3 FLY MORE COMBO (DJI RC GL)',
        'DJI MINI 3 (DJI RC) (GL)',
        'DJI MINI 3 (GL)',
        'DJI MINI 2 SE',
        'DJI Avata 360 (DJI RC 2)',
        'DJI Avata 360 Fly More Combo (DJI RC 2)',
        'DJI Avata 360 Motion Fly More Combo (DJI Goggles N3)',
        'DJI Avata 2 Fly More Combo (Single Battery)',
        'DJI Avata 2 Fly More Combo (Three Batteries)',
        'DJI Avata 2 Fly Smart Combo (Single Battery)',
        'DJI Avata 2 Fly Smart Combo (Three Battleries)',
        'DJI AVATA EXPLORER COMBO',
        'DJI AVATA PRO-VIEW COMBO (DJI RC MOTION 2)',
        'DJI AVATA PRO-VIEW COMBO (DJI GOGGLES 2)',
        'DJI AVATA FLY SMART COMBO (DJI FPV GOGGLES V2)',
        'NEO 2 MOTION FLY MORE COMBO',
        'DJI NEO 2 FLY MORE COMBO',
        'DJI Neo 2 Fly More Combo (Drone Only)',
        'DJI NEO 2',
        'NEO MOTION FLY MORE COMBO',
        'DJI NEO FLY MORE COMBO',
        'DJI NEO',
        'DJI NEO COMBO (GLOBAL)',
        'NEO MOTION FLY MORE COMBO (PROMOTION JULY 6-19)',
        'DJI NEO FLY MORE COMBO (PROMOTION JULY 6-19)',
        'DJI NEO (PROMOTION JULY 6-19)',
        'DJI NEO COMBO (GLOBAL) (PROMOTION JULY 6-19)',
        'DJI Flip Fly More Combo (DJI RC 2) (GL)',
        'DJI FLIP (No RC, Two Batteries)',
        'DJI Flip (DJI RC 2) (GL)',
        'DJI Flip (GL)',
        'DJI Robomaster S1',
        'DJI POWER 1000 Mini (PHI)',
        'DJI POWER 1000 Mini (PHI) (PROMOTION JULY 3-9)',
        'DJI POWER 1000 Mini (PHI) (PROMOTION JULY 15-17 AND 28-31)',
        'POWER 1000',
        'DJI Power 1000 V2',
        'DJI Power 2000 (CN)',
        'IBCPOWER 2000W Foldable Solar Panel (Non-CN)',
        'IBCPOWER 2000W Foldable Solar Panel (Non-CN) (PROMOTION JULY 3-9)',
        'IBCPOWER 1000W Foldable Solar Panel',
        'IBCPOWER 1000W Foldable Solar Panel (PROMOTION JULY 3-9)',
      ]
    },
    {
      name: 'HANDHELD',
      items: [
        'DJI Focus Pro All-in-One Combo',
        'DJI Focus Pro Creator Combo',
        'DJI RONIN 4D 6K COMBO',
        'RS 5 Combo',
        'RS 5',
        'DJI RS 4 Pro Combo 2026',
        'DJI RS 4 Pro Combo',
        'DJI RS 4 Pro',
        'DJI RS 4 Combo',
        'DJI RS 4',
        'DJI RS 4 MINI',
        'DJI RS 4 MINI COMBO',
        'DJI RS 3 PRO COMBO',
        'DJI RS 3 PRO',
        'DJI RS 3 MINI',
        'Osmo Pocket 4P Vlog Combo',
        'Osmo Pocket 4P Standard Combo',
        'Osmo Pocket 4 Creator Combo',
        'Osmo Pocket 4 Standard Combo',
        'Osmo Pocket 3 Creator Combo',
        'Osmo Pocket 3',
        'Osmo Pocket 3 Creator Combo (PROMOTION JULY 6-26)',
        'Osmo Pocket 3 (PROMOTION JULY 6-26)',
        'Osmo 360 Adventure Combo',
        'Osmo 360 Standard Combo',
        'Osmo 360 Adventure Combo (PROMOTION JULY 6-19)',
        'Osmo 360 Standard Combo (PROMOTION JULY 6-19)',
        'Osmo Action 6 Adventure Combo',
        'Osmo Action 6 Standard Combo',
        'Osmo Action 5 PRO Adventure Combo',
        'Osmo Action 5 PRO Standard Combo',
        'Osmo Action 5 PRO Adventure Combo (PROMOTION JULY 6-19)',
        'Osmo Action 5 PRO Standard Combo (PROMOTION JULY 6-19)',
        'Osmo Action 4 Adventure Combo',
        'Osmo Action 4 Standard Combo',
        'Osmo Action 4 Adventure Combo (PROMOTION JULY 6-19)',
        'Osmo Action 4 Standard Combo (PROMOTION JULY 6-19)',
        'DJI OSMO NANO (128GB)',
        'DJI OSMO NANO (64GB)',
        'Osmo Mobile 8P Standard Combo',
        'Osmo Mobile 8P AdvancedTracking Combo',
        'Osmo Mobile 8P Creator Combo',
        'DJI OSMO MOBILE 8',
        'DJI OSMO MOBILE 8 (Device Only)',
        'DJI Osmo Mobile 7P',
        'DJI OSMO MOBILE 7',
        'DJI Mic 2 (2 TX + 1 RX + Charging Case)（CE）',
        'DJI Mic 2 (1 TX + 1 RX)（CE）',
        'DJI Mic 3 (2 TX + 1 RX + Charging Case)',
        'DJI Mic 3 (1 TX + 1 RX)',
        'DJI Mic 3 (2 TX + 1 RX + Charging Case) (PROMOTION JULY 6-26)',
        'DJI Mic 3 (1 TX + 1 RX) (PROMOTION JULY 6-26)',
        'DJI MIC (2TX & 1 RX)',
        'DJI MIC (1TX & 1 RX)',
        'DJI Mic Mini 2 (2 TX + 1 RX + Charging Case)',
        'DJI Mic Mini 2 (2 TX + 1 Mobile RX + Charging Case)',
        'DJI Mic Mini 2 (1 TX + 1 Mobile RX + Charging Case)',
        'DJI Mic Mini 2 (1 TX + 1 RX)',
        'DJI Mic Mini (2 TX + 1 RX + Charging Case)',
        'DJI Mic Mini (1 TX + 1 RX)',
        'DJI Mic 3 Transmitter',
        'DJI Mic 3 Receiver',
        'DJI Mic 3 Transmitter (PROMOTION JULY 6-26)',
        'DJI Mic 3 Receiver (PROMOTION JULY 6-26)',
        'DJI Mic 3 Charging Case',
        'DJI Mic 2 Transmitter (Pearl White)',
        'DJI Mic 2 Transmitter (Shadow Black)',
        'DJI Mic Mini 2 Transmitter',
        'DJI Mic Mini Transmitter (Arctic White)',
        'DJI Mic Mini Transmitter (Infinity Black)',
      ]
    },
    {
      name: 'DJI NEO 2 ACCESSORIES',
      items: [
        'DJI Neo 2 Intelligent Flight Battery',
        'DJI NEO 2 PROPELLERS GUARD',
        'DJI NEO 2 PROPELLERS',
        'DJI NEO 2 TWO WAY CHARGING HUB',
        'DJI NEO 2 DIGITAL TRANSCEIVER',
      ]
    },
    {
      name: 'DJI NEO ACCESSORIES',
      items: [
        'DJI Neo Intelligent Flight Battery',
        'DJI NEO PROPELLERS GUARD',
        'DJI NEO PROPELLERS',
        'NEO TWO WAY CHARGING HUB',
      ]
    },
    {
      name: 'MAVIC 3 PRO ACCESSORIES',
      items: [
        'DJI Mavic 3 Intelligent Flight Battery',
        'DJI MAVIC 3 LOW-NOISE PROPELLERS',
      ]
    },
    {
      name: 'MAVIC 4 PRO ACCESSORIES',
      items: [
        'DJI Mavic 4 Pro Intelligent Flight Battery',
        'DJI Mavic 4 Pro Propellers',
        'DJI Mavic 4 Pro Parallel Charging Hub',
        'DJI Mavic 4 Pro Propeller Guard',
        'DJI Mavic 4 Pro Electronic ND Filter',
        'DJI RC Pro 2',
        'DJI 240W Power Adapter(EU)',
      ]
    },
    {
      name: 'DJI FLIP ACCESSORIES',
      items: [
        'DJI Flip Intelligent Flight Battery',
        'DJI Flip ND Filters Set (ND16/64/256)',
        'DJI Flip Propellers (Pair) (Screws Included)',
        'DJI Flip Parallel Charging Hub',
      ]
    },
    {
      name: 'AIR 3 ACCESSORIES',
      items: [
        'DJI Air 3 Gimbal Protector',
        'DJI Air 3 Intelligent Flight Battery',
        'DJI Air 3 Low-Noise Propellers (Pair)',
        'DJI Air 3 Battery Charging Hub',
        'DJI Air 3 Propeller Guard',
        'DJI Air 3 ND Filters Set (ND8/16/32/64)',
        'DJI Air 3 Wide-Angle Lens',
      ]
    },
    {
      name: 'AIR 3S ACCESSORIES',
      items: [
        'DJI Air 3S Intelligent Flight Battery',
        'DJI Air 3S Wide-Angle Lens',
      ]
    },
    {
      name: 'MINI 4 PRO ACCESSORIES',
      items: [
        'DJI Mini 4 Pro Intelligent Flight Battery',
        'DJI Mini 4 Pro ND Filters Set (ND 16/64/256)',
        'DJI Mini 4 Pro Wide-Angle Lens',
        'DJI Mini 4 Pro 360 Propeller Guard',
      ]
    },
    {
      name: 'MINI 5 PRO ACCESSORIES',
      items: [
        'DJI Mini 5 Pro Intelligent Flight Battery',
        'DJI Mini 5 Pro Intelligent Flight Battery Plus',
        'DJI Mini 5 Pro Propellers',
        'DJI Mini 5 Pro Two-Way Charging Hub',
        'DJI Mini 5 Pro Quick-Release 360° Propeller Guard (with Integrated Propellers)',
      ]
    },
    {
      name: 'AVATA ACCESSORIES',
      items: [
        'DJI Avata 360 Replacement Lens Kit With Tools',
        'DJI Avata 360 Replacement Lens Kit',
        'DJI Avata 360 Intelligent Flight Battery',
        'DJI Avata 360 Two-Way Charging Hub',
        'DJI Avata 360 Propellers',
        'DJI Goggles 3',
        'DJI RC Motion 3',
        'DJI FPV Remote Controller 3',
        'DJI Avata 2 Intelligent Flight Battery',
        'DJI Avata 2 Propellers',
        'DJI Avata 2 Battery Charging Hub',
        'DJI Avata Fly More Kit',
        'DJI RC Motion 2',
        'DJI Goggles 2',
        'DJI Avata Intelligent Flight Battery',
        'DJI AVATA ND FILTERS SET (ND8/16/32)',
        'DJI FPV Remote Controller 2',
      ]
    },
    {
      name: 'REMOTE CONTROLLER',
      items: [
        'DJI RC',
        'DJI RC Pro',
        'DJI RC 2',
      ]
    },
    {
      name: 'OSMO ACTION ACCESSORIES',
      items: [
        'Osmo Adjustable Quick-Release Adapter Mount',
        'Osmo Hanging Neck Mount Max',
        'Osmo 360 Transparent Lens Protectors',
        'Osmo 360 Battery Extension Rod',
        'Osmo Motorcycle Heavy-duty Mount',
        'Osmo Action Multifunctinal Charging Handle',
        'Osmo Action Cold Shoe Expantion Kit',
        'Osmo Action Helmet Chin Mount Clip',
        'Osmo Magnetic Headband',
        'Osmo action Extreme Battery Plus(1950mAh)',
        'Osmo Action Flexible Mount',
        'Osmo Action 5 Pro Glass lens Cover',
        'Osmo Action Road Cycling Accessory Kit',
        'Osmo Action Hanging Neck Mount',
        'Osmo Action ND Filter Kit',
        'Osmo Action Curved Adhesive Base Kit',
        'Osmo Action GPS Bluetooth Remote Controller',
        'Osmo Action Bike Seat Rail Mount',
        'Osmo Action 360° Wrist Strap',
        'Osmo Action Mini Handlebar Mount',
        'Osmo Action 4 Glass Lens Cover',
        'Osmo Action Bite Mount',
        'Osmo Action 3.5mm Audio Adapter',
        'DJI Action Mini Extension Rod',
        'DJI Floating Handle',
        'DJI OSMO Action 3 Handlebar Mount',
        'DJI OSMO ACTION SUCTION CUP MOUNT',
        'DJI OSMO Action 3 Chest Strap Mount',
        'Osmo Action Surfing Tether Kit',
        'Osmo Action Surfing Tethers',
        'DJI OSMO ACTION QUICK-RELEASE ADAPTER MOUNT',
        'DJI Osmo Action 3 Waterproof Case',
        'DJI OSMO ACTION 3 EXTREME BATTERY',
        'DJI OSMO ACTION 3 ADHESIVE BASE KIT',
        'DJI OSMO ACTION 3 1.5M EXTENSION ROD KIT',
        'DJI OSMO ACTION 3 MULTIFUNCTIONAL BATTERY CASE',
        'DJI OSMO ACTION 3 LENS PROTECTIVE COVER',
        'DJI OSMO ACTION BIKING ACCESSORY KIT',
        'DJI OSMO ACTION DIVING ACCESSORY KIT',
        'Osmo Backpack Strap Mount',
        'DJI OSMO ACTION HELMET CHIN MOUNT',
        'DJI-Osmo Magnetic Ball-Joint Adapter Mount',
        'DJI Osmo Action Floating Case CA2071',
        'OSMO ACTION FLOATING CASE',
        'DJI Osmo Action Protective Camera Decal (Blue Camo) AC0422',
        'DJI Osmo Action Protective Camera Decal (Celestial Gray) AC0412',
        'Osmo Action 5 Street Photography Grip Accessory Kit',
        'Osmo Action 6 Macro Lens',
        'Osmo Action 6 Glass Lens Cover',
        'Osmo Action 6 Diving Accessory Kit',
        'Osmo Action 6 ND Filter Set',
        'Osmo Action 6 Waterproof Case',
        'Osmo Action 6 FOV Boost Lens',
        'Osmo Action 6 Street Photography Grip Accessory Kit',
      ]
    },
    {
      name: 'OSMO POCKET ACCESSORIES',
      items: [
        'Osmo Pocket 3 Carrying Bag',
        'Osmo Pocket 3 Magnetic ND Filters Set',
        'Osmo Pocket 3 Black Mist Filter',
        'Osmo Pocket 3 Battery Handle',
        'Osmo Pocket 3 Wide-Angle Lens',
        'Osmo Pocket 3 Expansion Adapter',
        'Osmo Mini Tripod',
        'Osmo Pocket 4 Battery Handle(Black)',
        'Osmo Pocket 4 Fill Light',
      ]
    },
    {
      name: 'MIC MINI ACCESSORIES',
      items: [
        'DJI Mic Mini 2 Time Series Magnetic Front Cover',
        'DJI Mic Mini 2 Multi-Color Windscreens',
      ]
    },
    {
      name: 'SERVICES',
      items: [
        'DJI Care Refresh 2 Year Plan (DJI Mavic 4 Pro)',
        'DJI Care Refresh 2 Year Plan (DJI Air 3S)',
        'DJI Care Refresh 2 Year Plan (DJI Mini 5 Pro)',
        'DJI Care Refresh 2 Year Plan (DJI Avata 360)',
        'DJI Care Refresh 2 Year Plan (DJI Lito X1)',
        'DJI Care Refresh 2 Year Plan (DJI Flip)',
        'DJI Care Refresh 2 Year Plan (DJI Lito 1)',
        'DJI Care Refresh 2 Year Plan (DJI Neo 2)',
        'DJI Care Refresh 2 Year Plan (DJI Osmo Pocket 4P)',
        'DJI Care Refresh 2 Year Plan (DJI Osmo Pocket 4)',
        'DJI Care Refresh 2 Year Plan (DJI Osmo Pocket 3)',
        'DJI Care Refresh 2 Year Plan (DJI Action 6)',
        'DJI Care Refresh 2 Year Plan (DJI Osmo 360)',
        'DJI Care Refresh 2 Year Plan (DJI Osmo Action 5 Pro)',
        'DJI Care Refresh 2 Year Plan (DJI Osmo Nano)',
        'DJI Care Refresh 1 Year Plan (DJI Mavic 4 Pro)',
        'DJI Care Refresh 1 Year Plan (DJI Air 3S)',
        'DJI Care Refresh 1 Year Plan (DJI Mini 5 Pro)',
        'DJI Care Refresh 1 Year Plan (DJI Avata 360)',
        'DJI Care Refresh 1 Year Plan (DJI Lito X1)',
        'DJI Care Refresh 1 Year Plan (DJI Flip)',
        'DJI Care Refresh 1 Year Plan (DJI Lito 1)',
        'DJI Care Refresh 1 Year Plan (DJI Neo 2)',
        'DJI Care Refresh 1 Year Plan (DJI Osmo Pocket 4P)',
        'DJI Care Refresh 1 Year Plan (DJI Osmo Pocket 4)',
        'DJI Care Refresh 1 Year Plan (DJI Osmo Pocket 3)',
        'DJI Care Refresh 1 Year Plan (DJI Action 6)',
        'DJI Care Refresh 1 Year Plan (DJI Osmo 360)',
        'DJI Care Refresh 1 Year Plan (DJI Osmo Action 5 Pro)',
        'DJI Care Refresh 1 Year Plan (DJI Osmo Nano)',
      ]
    },
    {
      name: 'OTHERS',
      items: [
        'DJI MAVIC 3 CINE PREMIUM COMBO',
        'DJI SDR TRANSMISSION COMBO',
        'DJI SDR TRANSMISSION RECEIVER',
        'DJI SDR TRANSMISSION TRANSMITTER',
        'DJI - Robomaster S1 Part9 Gel Beads',
        'DJI RS L-Shaped Multi-Camera Control Cable (USB-C, 30 cm)',
      ]
    },
  ];

  // Flatten into a single searchable list: { name, category }
  let PRODUCTS = PRODUCT_CATEGORIES.flatMap((cat) =>
    cat.items.map((name) => ({ name, category: cat.name }))
  );

  /** @type {{id:number, store:string, tag:string, qty:number}[]} */
  let queue = [];
  let nextId = 1;
  let tagOrder = []; // preserves the order tags were first requested, for stable table rows

  // Combo currently being built (ordered list of product names)
  let comboProducts = [];

  // Combos staged for the currently selected store, not yet submitted
  /** @type {{tag:string, qty:number}[]} */
  let pending = [];

  // ---------- DOM refs ----------
  const storeList = document.getElementById('storeList');
  const storesSelectAll = document.getElementById('storesSelectAll');
  const productSearch = document.getElementById('productSearch');
  const categoryFilter = document.getElementById('categoryFilter');
  const productList = document.getElementById('productList');
  const productCount = document.getElementById('productCount');
  const productsSelectAll = document.getElementById('productsSelectAll');

  let selectedStores = new Set();

  const comboChips = document.getElementById('comboChips');
  const chipsEmpty = document.getElementById('chipsEmpty');

  const qtyInput = document.getElementById('qtyInput');
  const qtyUp = document.getElementById('qtyUp');
  const qtyDown = document.getElementById('qtyDown');

  const addComboBtn = document.getElementById('addComboBtn');
  const pendingList = document.getElementById('pendingList');
  const pendingEmpty = document.getElementById('pendingEmpty');

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

  const clearAllOpenBtn = document.getElementById('clearAllOpen');
  const clearConfirm = document.getElementById('clearConfirm');
  const clearConfirmInput = document.getElementById('clearConfirmInput');
  const clearConfirmBtn = document.getElementById('clearConfirmBtn');
  const clearConfirmCancel = document.getElementById('clearConfirmCancel');

  const manageStoreFilter = document.getElementById('manageStoreFilter');
  const manageList = document.getElementById('manageList');
  const manageEmpty = document.getElementById('manageEmpty');

  // ---------- init store choices (builder) ----------
  STORES.forEach((store) => {
    const row = document.createElement('label');
    row.className = 'store-row';
    row.innerHTML = `<input type="checkbox" value="${escapeHtml(store)}"> ${escapeHtml(store)}`;
    row.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) selectedStores.add(store);
      else selectedStores.delete(store);
    });
    storeList.appendChild(row);
  });

  storesSelectAll.addEventListener('click', () => {
    const checkboxes = [...storeList.querySelectorAll('input')];
    const allChecked = checkboxes.every((cb) => cb.checked);
    checkboxes.forEach((cb) => { cb.checked = !allChecked; });
    selectedStores = new Set(allChecked ? [] : STORES);
    storesSelectAll.textContent = allChecked ? 'Select all' : 'Deselect all';
  });

  // ---------- init manage store filter ----------
  STORES.forEach((store) => {
    const opt = document.createElement('option');
    opt.value = store;
    opt.textContent = store;
    manageStoreFilter.appendChild(opt);
  });

  // ---------- init category filter ----------
  PRODUCT_CATEGORIES.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat.name;
    opt.textContent = titleCase(cat.name);
    categoryFilter.appendChild(opt);
  });

  // ---------- admin: extend the catalog ----------
  const adminToggle = document.getElementById('adminToggle');
  const adminChevron = document.getElementById('adminChevron');
  const adminBody = document.getElementById('adminBody');

  const newProductName = document.getElementById('newProductName');
  const newProductCategory = document.getElementById('newProductCategory');
  const newCategoryField = document.getElementById('newCategoryField');
  const newCategoryName = document.getElementById('newCategoryName');
  const addProductBtn = document.getElementById('addProductBtn');
  const adminProductError = document.getElementById('adminProductError');

  const newStoreName = document.getElementById('newStoreName');
  const addStoreBtn = document.getElementById('addStoreBtn');
  const adminStoreError = document.getElementById('adminStoreError');

  adminToggle.addEventListener('click', () => {
    const expanded = adminToggle.getAttribute('aria-expanded') === 'true';
    adminToggle.setAttribute('aria-expanded', String(!expanded));
    adminBody.hidden = expanded;
  });

  function refreshCategorySelects() {
    const currentFilterValue = categoryFilter.value;
    categoryFilter.innerHTML = '<option value="">All categories</option>';
    PRODUCT_CATEGORIES.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat.name;
      opt.textContent = titleCase(cat.name);
      categoryFilter.appendChild(opt);
    });
    categoryFilter.value = currentFilterValue;

    newProductCategory.innerHTML = '<option value="__new__">+ New category&hellip;</option>';
    PRODUCT_CATEGORIES.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat.name;
      opt.textContent = titleCase(cat.name);
      newProductCategory.appendChild(opt);
    });
  }

  newProductCategory.addEventListener('change', () => {
    newCategoryField.style.display = newProductCategory.value === '__new__' ? 'flex' : 'none';
  });

  addProductBtn.addEventListener('click', () => {
    adminProductError.textContent = '';
    adminProductError.style.color = '';

    const name = newProductName.value.trim();
    if (!name) {
      adminProductError.textContent = 'Enter a product or tag name.';
      return;
    }
    if (PRODUCTS.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      adminProductError.textContent = 'That product name already exists.';
      return;
    }

    let categoryName = newProductCategory.value;
    if (categoryName === '__new__') {
      categoryName = newCategoryName.value.trim();
      if (!categoryName) {
        adminProductError.textContent = 'Enter a name for the new category.';
        return;
      }
      categoryName = categoryName.toUpperCase();
    }

    let cat = PRODUCT_CATEGORIES.find((c) => c.name === categoryName);
    if (!cat) {
      cat = { name: categoryName, items: [] };
      PRODUCT_CATEGORIES.push(cat);
    }
    cat.items.push(name);
    PRODUCTS = PRODUCT_CATEGORIES.flatMap((c) => c.items.map((n) => ({ name: n, category: c.name })));

    refreshCategorySelects();
    newProductCategory.value = categoryName;
    newCategoryField.style.display = 'none';
    newProductName.value = '';
    newCategoryName.value = '';
    renderProductList();

    adminProductError.style.color = 'var(--green)';
    adminProductError.textContent = `Added "${name}" to ${titleCase(categoryName)}.`;
    setTimeout(() => { adminProductError.textContent = ''; adminProductError.style.color = ''; }, 4000);
  });

  addStoreBtn.addEventListener('click', () => {
    adminStoreError.textContent = '';
    adminStoreError.style.color = '';

    const name = newStoreName.value.trim();
    if (!name) {
      adminStoreError.textContent = 'Enter a store name.';
      return;
    }
    if (STORES.some((s) => s.toLowerCase() === name.toLowerCase())) {
      adminStoreError.textContent = 'That store already exists.';
      return;
    }

    STORES.push(name);

    const storeRow = document.createElement('label');
    storeRow.className = 'store-row';
    storeRow.innerHTML = `<input type="checkbox" value="${escapeHtml(name)}"> ${escapeHtml(name)}`;
    storeRow.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) selectedStores.add(name);
      else selectedStores.delete(name);
    });
    storeList.appendChild(storeRow);

    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    manageStoreFilter.appendChild(opt);

    newStoreName.value = '';
    render();

    adminStoreError.style.color = 'var(--green)';
    adminStoreError.textContent = `Added "${name}" — it now appears in store choices and the summary table.`;
    setTimeout(() => { adminStoreError.textContent = ''; adminStoreError.style.color = ''; }, 4000);
  });

  // ---------- product search & filter ----------
  function renderProductList() {
    const term = productSearch.value.trim().toLowerCase();
    const category = categoryFilter.value;

    const matches = PRODUCTS.filter((p) => {
      const inCategory = !category || p.category === category;
      const inSearch = !term || p.name.toLowerCase().includes(term);
      return inCategory && inSearch;
    });

    productList.innerHTML = '';

    if (matches.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'product-list__empty';
      empty.textContent = 'No products match that search.';
      productList.appendChild(empty);
      productCount.textContent = '';
      return;
    }

    // Cap the rendered rows for performance; searching narrows it down
    const CAP = 150;
    const shown = matches.slice(0, CAP);

    shown.forEach((p) => {
      const row = document.createElement('label');
      row.className = 'product-row';
      const checked = comboProducts.includes(p.name);
      if (checked) row.classList.add('is-checked');

      row.innerHTML = `
        <input type="checkbox" ${checked ? 'checked' : ''}>
        <span class="product-row__text">
          <span class="product-row__name">${escapeHtml(p.name)}</span>
          <span class="product-row__cat">${escapeHtml(titleCase(p.category))}</span>
        </span>
      `;

      row.querySelector('input').addEventListener('change', (e) => {
        toggleProduct(p.name, e.target.checked);
      });

      productList.appendChild(row);
    });

    productCount.textContent = matches.length > CAP
      ? `Showing ${CAP} of ${matches.length} matches — refine your search to narrow this down.`
      : `${matches.length} product${matches.length === 1 ? '' : 's'} found`;
  }

  function toggleProduct(name, isChecked) {
    if (isChecked) {
      if (!comboProducts.includes(name)) comboProducts.push(name);
    } else {
      comboProducts = comboProducts.filter((n) => n !== name);
    }
    renderComboChips();
    renderProductList();
  }

  productSearch.addEventListener('input', renderProductList);
  categoryFilter.addEventListener('change', renderProductList);

  productsSelectAll.addEventListener('click', () => {
    const term = productSearch.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const shownNames = PRODUCTS.filter((p) => {
      const inCategory = !category || p.category === category;
      const inSearch = !term || p.name.toLowerCase().includes(term);
      return inCategory && inSearch;
    }).map((p) => p.name);

    if (shownNames.length === 0) return;
    const allSelected = shownNames.every((name) => comboProducts.includes(name));
    comboProducts = allSelected
      ? comboProducts.filter((name) => !shownNames.includes(name))
      : [...new Set([...comboProducts, ...shownNames])];
    productsSelectAll.textContent = allSelected ? 'Select all shown' : 'Deselect all shown';
    renderComboChips();
    renderProductList();
  });

  // ---------- combo chips ----------
  function renderComboChips() {
    comboChips.innerHTML = '';
    if (comboProducts.length === 0) {
      comboChips.appendChild(chipsEmpty);
      return;
    }
    comboProducts.forEach((name) => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.innerHTML = `${escapeHtml(name)} <button type="button" class="chip__remove" aria-label="Remove ${escapeHtml(name)}">&times;</button>`;
      chip.querySelector('.chip__remove').addEventListener('click', () => toggleProduct(name, false));
      comboChips.appendChild(chip);
    });
  }

  // ---------- qty stepper ----------
  qtyUp.addEventListener('click', () => {
    qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 0) + 1);
  });
  qtyDown.addEventListener('click', () => {
    qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
  });

  // ---------- stage a combo (applied to whichever stores are checked at submit time) ----------
  addComboBtn.addEventListener('click', () => {
    formError.textContent = '';

    if (comboProducts.length === 0) {
      formError.textContent = 'Select at least one product to build a combo.';
      return;
    }
    const qty = parseInt(qtyInput.value, 10) || 0;
    if (qty < 1) {
      formError.textContent = 'Quantity must be at least 1.';
      return;
    }

    const tag = comboProducts.join(' + ');
    const existing = pending.find((p) => p.tag === tag);
    if (existing) {
      existing.qty += qty;
    } else {
      pending.push({ tag, qty });
    }

    // reset the builder for the next combo
    comboProducts = [];
    qtyInput.value = 1;
    renderComboChips();
    renderProductList();
    renderPending();
  });

  // ---------- pending list (staged, not yet submitted) ----------
  function renderPending() {
    pendingList.innerHTML = '';
    if (pending.length === 0) {
      pendingList.appendChild(pendingEmpty);
      return;
    }
    pending.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'pending-item';
      row.innerHTML = `
        <span class="pending-item__tag">${escapeHtml(item.tag)}</span>
        <span class="pending-item__right">
          <span class="pending-item__qty">&times;${item.qty}</span>
          <button type="button" class="pending-item__remove" aria-label="Remove staged combo">&times;</button>
        </span>
      `;
      row.querySelector('.pending-item__remove').addEventListener('click', () => {
        pending.splice(idx, 1);
        renderPending();
      });
      pendingList.appendChild(row);
    });
  }

  // ---------- submit: commit staged combos into the main queue, for every selected store ----------
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formError.textContent = '';

    if (selectedStores.size === 0) {
      formError.textContent = 'Check at least one store before submitting.';
      return;
    }
    if (pending.length === 0) {
      formError.textContent = 'Stage at least one combo before submitting.';
      return;
    }

    pending.forEach(({ tag, qty }) => {
      if (!tagOrder.includes(tag)) tagOrder.push(tag);
      selectedStores.forEach((store) => {
        const existing = queue.find((q) => q.store === store && q.tag === tag);
        if (existing) {
          existing.qty += qty;
        } else {
          queue.push({ id: nextId++, store, tag, qty });
        }
      });
    });

    pending = [];
    renderPending();
    render();
  });

  // ---------- clear all: requires typing CLEAR, plus an undo window ----------
  clearAllOpenBtn.addEventListener('click', () => {
    if (queue.length === 0 && pending.length === 0) return;
    clearConfirm.hidden = false;
    clearConfirmInput.value = '';
    clearConfirmBtn.disabled = true;
    clearConfirmInput.focus();
  });

  clearConfirmCancel.addEventListener('click', () => {
    clearConfirm.hidden = true;
  });

  clearConfirmInput.addEventListener('input', () => {
    clearConfirmBtn.disabled = clearConfirmInput.value.trim().toUpperCase() !== 'CLEAR';
  });

  clearConfirmBtn.addEventListener('click', () => {
    if (clearConfirmInput.value.trim().toUpperCase() !== 'CLEAR') return;

    queue = [];
    pending = [];
    tagOrder = [];
    nextId = 1;

    clearConfirm.hidden = true;
    renderPending();
    render();
  });

  // ---------- render: request summary (aggregated per tag) ----------
  function renderQueue() {
    queueList.innerHTML = '';

    if (queue.length === 0) {
      queueList.appendChild(queueEmpty);
      queueEmpty.style.display = 'block';
      return;
    }

    const totalsByTag = new Map();
    queue.forEach((item) => {
      totalsByTag.set(item.tag, (totalsByTag.get(item.tag) || 0) + item.qty);
    });

    let grandTotal = 0;
    tagOrder.filter((tag) => totalsByTag.has(tag)).forEach((tag) => {
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
    matrixHeadRow.innerHTML = '<th class="matrix__corner">TAG</th>';
    STORES.forEach((store) => {
      const th = document.createElement('th');
      th.textContent = store;
      matrixHeadRow.appendChild(th);
    });
    const grandTh = document.createElement('th');
    grandTh.textContent = 'GRAND TOTAL';
    grandTh.classList.add('grand-cell');
    matrixHeadRow.appendChild(grandTh);

    matrixBody.innerHTML = '';
    const activeTags = tagOrder.filter((tag) => queue.some((q) => q.tag === tag));

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
      td.style.color = '#8a8a8a';
      td.style.fontFamily = "'Inter', sans-serif";
      td.textContent = 'No tag requests queued yet — the summary will populate as you add them.';
      tr.appendChild(td);
      matrixBody.appendChild(tr);
    }

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

  // ---------- manage requests per store ----------
  manageStoreFilter.addEventListener('change', renderManage);

  function updateLineQty(id, qty) {
    const line = queue.find((q) => q.id === id);
    if (!line) return;
    if (qty < 1) {
      queue = queue.filter((q) => q.id !== id);
    } else {
      line.qty = qty;
    }
    render();
  }

  function removeLine(id) {
    queue = queue.filter((q) => q.id !== id);
    render();
  }

  function clearStoreRequests(store) {
    if (!confirm(`Remove all requests for ${store}?`)) return;
    queue = queue.filter((q) => q.store !== store);
    render();
  }

  function renderManage() {
    manageList.innerHTML = '';

    const filterStore = manageStoreFilter.value;
    const storesWithData = STORES.filter((s) => queue.some((q) => q.store === s));
    const storesToShow = filterStore ? [filterStore] : storesWithData;
    const visibleStores = storesToShow.filter((s) => queue.some((q) => q.store === s));

    if (visibleStores.length === 0) {
      manageList.appendChild(manageEmpty);
      return;
    }

    visibleStores.forEach((store) => {
      const lines = queue.filter((q) => q.store === store);
      const storeTotal = lines.reduce((sum, l) => sum + l.qty, 0);

      const group = document.createElement('div');
      group.className = 'manage-group';

      const head = document.createElement('div');
      head.className = 'manage-group__head';
      head.innerHTML = `
        <span class="manage-group__title">${escapeHtml(store)}</span>
        <span class="manage-group__meta">
          <span class="manage-group__total">${lines.length} tag${lines.length === 1 ? '' : 's'} &middot; ${storeTotal} total</span>
          <button type="button" class="manage-group__remove">Remove store</button>
        </span>
      `;
      head.querySelector('.manage-group__remove').addEventListener('click', () => clearStoreRequests(store));
      group.appendChild(head);

      lines.forEach((line) => {
        const row = document.createElement('div');
        row.className = 'manage-row';
        row.innerHTML = `
          <span class="manage-row__tag">${escapeHtml(line.tag)}</span>
          <input type="number" min="0" value="${line.qty}">
          <button type="button" class="manage-row__remove" aria-label="Remove line">&times;</button>
        `;
        row.querySelector('input').addEventListener('change', (e) => {
          updateLineQty(line.id, parseInt(e.target.value, 10) || 0);
        });
        row.querySelector('.manage-row__remove').addEventListener('click', () => removeLine(line.id));
        group.appendChild(row);
      });

      manageList.appendChild(group);
    });
  }

  function render() {
    renderQueue();
    renderMatrix();
    renderManage();
  }

  // ---------- CSV export ----------
  function exportCsv() {
    const rows = [];
    const activeTags = tagOrder.filter((tag) => queue.some((q) => q.tag === tag));

    rows.push(['TAG', ...STORES, 'GRAND TOTAL']);

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

  function titleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
      .join(' ');
  }

  refreshCategorySelects();

  // initial render
  renderProductList();
  renderComboChips();
  renderPending();
  render();
})();
