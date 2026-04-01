/**
 * Product Carousel — tabbed horizontal slider of product cards
 * Content model:
 *   Row 1: tab labels (each cell = one tab label)
 *   Separator rows: single cell matching a tab label (marks start of that tab's products)
 *   Product rows: image | product name | original price | sale price | link
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // First row is the tab labels
  const tabRow = rows.shift();
  const tabCells = [...tabRow.children];
  const tabLabels = tabCells.map((c) => c.textContent.trim()).filter(Boolean);

  // Group remaining rows by tab separator rows
  // A separator row has exactly 1 cell whose text matches a tab label
  const tabGroups = new Map();
  let currentTab = tabLabels[0] || '';
  tabGroups.set(currentTab, []);

  rows.forEach((row) => {
    const cols = [...row.children];
    const text = cols.length === 1 ? cols[0].textContent.trim() : '';
    if (cols.length === 1 && tabLabels.includes(text)) {
      currentTab = text;
      if (!tabGroups.has(currentTab)) tabGroups.set(currentTab, []);
    } else if (cols.length >= 3) {
      if (!tabGroups.has(currentTab)) tabGroups.set(currentTab, []);
      tabGroups.get(currentTab).push(cols);
    }
  });

  // Build tabs
  const tabs = document.createElement('div');
  tabs.className = 'product-carousel-tabs';

  // Build tracks (one per tab)
  const trackContainer = document.createElement('div');
  trackContainer.className = 'product-carousel-tracks';

  const tracks = [];

  tabLabels.forEach((label, i) => {
    // Tab button
    const btn = document.createElement('button');
    btn.className = `product-carousel-tab${i === 0 ? ' active' : ''}`;
    btn.textContent = label;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.dataset.tabIndex = i;
    tabs.append(btn);

    // Track for this tab
    const track = document.createElement('div');
    track.className = `product-carousel-track${i === 0 ? ' active' : ''}`;
    track.dataset.tabIndex = i;

    const products = tabGroups.get(label) || [];
    products.forEach((cols) => {
      const card = document.createElement('div');
      card.className = 'product-card';

      // Image (col 0)
      const imgWrap = document.createElement('div');
      imgWrap.className = 'product-card-image';
      const pic = cols[0]?.querySelector('picture') || cols[0]?.querySelector('img');
      if (pic) imgWrap.append(pic.cloneNode(true));
      card.append(imgWrap);

      // Info section
      const info = document.createElement('div');
      info.className = 'product-card-info';

      // Product name (col 1)
      const name = document.createElement('p');
      name.className = 'product-card-name';
      name.textContent = cols[1]?.textContent?.trim() || '';
      info.append(name);

      // Price row
      const priceRow = document.createElement('div');
      priceRow.className = 'product-card-prices';

      const origPrice = cols[2]?.textContent?.trim();
      const salePrice = cols[3]?.textContent?.trim();

      if (salePrice && origPrice && salePrice !== origPrice) {
        const orig = document.createElement('span');
        orig.className = 'product-card-price-original';
        orig.textContent = origPrice;
        priceRow.append(orig);

        const sale = document.createElement('span');
        sale.className = 'product-card-price-sale';
        sale.textContent = salePrice;
        priceRow.append(sale);
      } else if (origPrice) {
        const price = document.createElement('span');
        price.className = 'product-card-price';
        price.textContent = origPrice;
        priceRow.append(price);
      }

      info.append(priceRow);
      card.append(info);

      // Wrap in link (col 4)
      const linkEl = cols[4]?.querySelector('a');
      const url = linkEl?.href || '';
      if (url) {
        const a = document.createElement('a');
        a.href = url;
        a.className = 'product-card-link';
        a.append(card);
        track.append(a);
      } else {
        track.append(card);
      }
    });

    trackContainer.append(track);
    tracks.push(track);
  });

  // Navigation arrows
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-arrow carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous products');
  prevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 19l-7-7 7-7"/></svg>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-arrow carousel-next';
  nextBtn.setAttribute('aria-label', 'Next products');
  nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5l7 7-7 7"/></svg>';

  // Clear block and rebuild
  block.textContent = '';
  block.append(tabs, trackContainer, prevBtn, nextBtn);

  // Slider logic
  const step = 280;

  function getActiveTrack() {
    return trackContainer.querySelector('.product-carousel-track.active');
  }

  function updateArrows() {
    const track = getActiveTrack();
    if (!track) return;
    prevBtn.disabled = track.scrollLeft <= 0;
    const maxScroll = track.scrollWidth - track.clientWidth;
    nextBtn.disabled = track.scrollLeft >= maxScroll - 1;
  }

  // Tab click handler
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.product-carousel-tab');
    if (!btn) return;
    const idx = btn.dataset.tabIndex;

    tabs.querySelectorAll('.product-carousel-tab').forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    tracks.forEach((t) => {
      t.classList.toggle('active', t.dataset.tabIndex === idx);
      if (t.dataset.tabIndex === idx) t.scrollTo({ left: 0 });
    });

    updateArrows();
  });

  prevBtn.addEventListener('click', () => {
    const track = getActiveTrack();
    if (track) track.scrollTo({ left: Math.max(0, track.scrollLeft - step * 2), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    const track = getActiveTrack();
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    track.scrollTo({ left: Math.min(max, track.scrollLeft + step * 2), behavior: 'smooth' });
  });

  trackContainer.addEventListener('scroll', () => requestAnimationFrame(updateArrows), true);

  // Update arrows once the carousel is visible and laid out
  const observer = new ResizeObserver(() => {
    const track = getActiveTrack();
    updateArrows();
    if (track && track.scrollWidth > track.clientWidth) observer.disconnect();
  });
  observer.observe(trackContainer);
}
