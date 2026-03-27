/**
 * Product Carousel — horizontal slider of product cards
 * Content model:
 *   Row 1: heading text (e.g. "The Linen-Blend Denim Collection")
 *   Rows 2+: product image | product name | original price | sale price | product URL
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // First row is the carousel heading
  const headingRow = rows.shift();
  const headingText = headingRow?.textContent?.trim();
  const heading = document.createElement('div');
  heading.className = 'product-carousel-heading';
  if (headingText) {
    const h2 = document.createElement('h2');
    h2.textContent = headingText;
    heading.append(h2);
  }

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
    if (pic) {
      imgWrap.append(pic.cloneNode(true));
    }

    // Info section
    const info = document.createElement('div');
    info.className = 'product-card-info';

    // Name (col 1)
    const name = document.createElement('p');
    name.className = 'product-card-name';
    name.textContent = cols[1]?.textContent?.trim() || '';

    // Prices (col 2 = original, col 3 = sale)
    const priceWrap = document.createElement('div');
    priceWrap.className = 'product-card-prices';

    const originalPrice = cols[2]?.textContent?.trim() || '';
    const salePrice = cols[3]?.textContent?.trim() || '';

    if (salePrice && salePrice !== originalPrice) {
      const origEl = document.createElement('span');
      origEl.className = 'price-original';
      origEl.textContent = originalPrice;
      const saleEl = document.createElement('span');
      saleEl.className = 'price-sale';
      saleEl.textContent = salePrice;
      const badge = document.createElement('span');
      badge.className = 'price-badge';
      badge.textContent = 'Sale Price';
      priceWrap.append(origEl, saleEl, badge);
    } else {
      const priceEl = document.createElement('span');
      priceEl.className = 'price-current';
      priceEl.textContent = originalPrice;
      priceWrap.append(priceEl);
    }

    // Link (col 4)
    const link = cols[4]?.querySelector('a') || cols[4];
    const url = link?.href || link?.querySelector?.('a')?.href || '#';

    info.append(name, priceWrap);
    card.append(imgWrap, info);

    // Wrap in link if URL available
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
  const nav = document.createElement('div');
  nav.className = 'product-carousel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-arrow carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous products');
  prevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 19l-7-7 7-7"/></svg>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-arrow carousel-next';
  nextBtn.setAttribute('aria-label', 'Next products');
  nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5l7 7-7 7"/></svg>';

  nav.append(prevBtn, nextBtn);

  // Clear block and rebuild
  block.textContent = '';
  block.append(heading, track, nav);

  // Slider logic
  let scrollPos = 0;
  const cardWidth = 260;
  const gap = 16;
  const step = cardWidth + gap;

  function updateArrows() {
    prevBtn.disabled = scrollPos <= 0;
    const maxScroll = track.scrollWidth - track.clientWidth;
    nextBtn.disabled = scrollPos >= maxScroll - 1;
  }

  prevBtn.addEventListener('click', () => {
    scrollPos = Math.max(0, track.scrollLeft - step * 2);
    track.scrollTo({ left: scrollPos, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    scrollPos = Math.min(track.scrollWidth - track.clientWidth, track.scrollLeft + step * 2);
    track.scrollTo({ left: scrollPos, behavior: 'smooth' });
  });

  track.addEventListener('scroll', () => {
    scrollPos = track.scrollLeft;
    updateArrows();
  });

  // Initial state
  requestAnimationFrame(updateArrows);
}
