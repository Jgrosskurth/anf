/**
 * Product Carousel — tabbed horizontal slider of product cards
 * Content model:
 *   Row 1: tab labels (each cell = one tab label)
 *   Rows 2+: product image | badge text | product name | product URL
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // First row is the tab labels
  const tabRow = rows.shift();
  const tabCells = [...tabRow.children];
  const tabs = document.createElement('div');
  tabs.className = 'product-carousel-tabs';

  tabCells.forEach((cell, i) => {
    const label = cell.textContent.trim();
    if (!label) return;
    const btn = document.createElement('button');
    btn.className = `product-carousel-tab${i === 0 ? ' active' : ''}`;
    btn.textContent = label;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.product-carousel-tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    });
    tabs.append(btn);
  });

  // Build product track
  const track = document.createElement('div');
  track.className = 'product-carousel-track';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 3) return;

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

    // Badge (col 1)
    const badgeText = cols[1]?.textContent?.trim();
    if (badgeText) {
      const badge = document.createElement('p');
      badge.className = 'product-card-badge';
      badge.textContent = badgeText;
      info.append(badge);
    }

    // Name (col 2)
    const name = document.createElement('p');
    name.className = 'product-card-name';
    name.textContent = cols[2]?.textContent?.trim() || '';
    info.append(name);

    card.append(info);

    // Wrap in link if URL in col 3
    const linkEl = cols[3]?.querySelector('a');
    const url = linkEl?.href || cols[3]?.textContent?.trim() || '';
    if (url && url !== '#') {
      const a = document.createElement('a');
      a.href = url;
      a.className = 'product-card-link';
      a.append(card);
      track.append(a);
    } else {
      track.append(card);
    }
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
  block.append(tabs, track, prevBtn, nextBtn);

  // Slider logic
  function updateArrows() {
    prevBtn.disabled = track.scrollLeft <= 0;
    const maxScroll = track.scrollWidth - track.clientWidth;
    nextBtn.disabled = track.scrollLeft >= maxScroll - 1;
  }

  const step = 280;

  prevBtn.addEventListener('click', () => {
    track.scrollTo({ left: Math.max(0, track.scrollLeft - step * 2), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    const max = track.scrollWidth - track.clientWidth;
    track.scrollTo({ left: Math.min(max, track.scrollLeft + step * 2), behavior: 'smooth' });
  });

  track.addEventListener('scroll', () => requestAnimationFrame(updateArrows));

  // Update arrows once the carousel is visible and laid out
  const observer = new ResizeObserver(() => {
    updateArrows();
    if (track.scrollWidth > track.clientWidth) observer.disconnect();
  });
  observer.observe(track);
}
