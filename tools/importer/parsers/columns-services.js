/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-services variant.
 * Base block: columns
 * Source: https://www.abercrombie.com/
 * Section 6: Membership & Services - .tout-group with 3 columns (loyalty, app, store finder)
 * Columns table: 1 row with 3 cells (one per column)
 */
export default function parse(element, { document }) {
  // Use desktop version (data-hide-below="768")
  const desktop = element.querySelector('[data-hide-below="768"]') || element;

  // Find tout-group content with individual column touts
  const toutGroupContent = desktop.querySelector('.tout-group-content') || desktop;
  const touts = Array.from(toutGroupContent.querySelectorAll(':scope > .tout'));

  if (touts.length === 0) {
    element.replaceWith(document.createElement('div'));
    return;
  }

  // Build one row with N columns
  const row = [];

  touts.forEach((tout) => {
    const colContent = [];

    // Extract icon/logo image
    const logoImg = tout.querySelector('.image img, picture img.picture-default');
    if (logoImg) {
      const img = document.createElement('img');
      img.src = logoImg.src || logoImg.getAttribute('src');
      img.alt = logoImg.alt || '';
      colContent.push(img);
    }

    // Extract description text from .headline[data-variant="subcopy"]
    const descEl = tout.querySelector('.headline[data-variant="subcopy"]');
    if (descEl && descEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      colContent.push(p);
    }

    // Extract CTA link (a.button) or button element
    const ctaLink = tout.querySelector('.button-group a.button');
    const ctaButton = tout.querySelector('.button-group button.button');
    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      colContent.push(a);
    } else if (ctaButton) {
      // Convert button to a link with placeholder href
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = ctaButton.textContent.trim();
      colContent.push(a);
    }

    row.push(colContent);
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-services',
    cells,
  });
  element.replaceWith(block);
}
