/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-editorial variant.
 * Base block: cards
 * Source: https://www.abercrombie.com/
 * Section 2: Trend Edit Cards - .tout-group with image cards, labels, headings, CTAs
 * Cards table: 2 columns per row. Col1: image, Col2: text content
 */
export default function parse(element, { document }) {
  // Use desktop version (data-hide-below="768")
  const desktop = element.querySelector('[data-hide-below="768"]') || element;

  // Find tout-group content area with individual cards
  const toutGroupContent = desktop.querySelector('.tout-group-content') || desktop;
  const touts = Array.from(toutGroupContent.querySelectorAll(':scope > .tout.tout-with-picture'));

  if (touts.length === 0) {
    element.replaceWith(document.createElement('div'));
    return;
  }

  const cells = [];

  touts.forEach((tout) => {
    // Col 1: Image
    const img = tout.querySelector('img.main-tout-image, picture img');
    const imageCell = [];
    if (img) {
      const picture = document.createElement('img');
      picture.src = img.src || img.getAttribute('src');
      picture.alt = img.alt || '';
      imageCell.push(picture);
    }

    // Col 2: Text content (label, heading, CTA)
    const textCell = [];

    // Extract label (e.g., "TREND EDIT")
    const labelEl = tout.querySelector('.headline[data-variant="lead-in"]');
    if (labelEl && labelEl.textContent.trim()) {
      const label = document.createElement('p');
      label.textContent = labelEl.textContent.trim();
      textCell.push(label);
    }

    // Extract main heading (e.g., "Garden Grown" in <strong>)
    const headingSpans = Array.from(tout.querySelectorAll('.headline')).filter(
      (h) => !h.getAttribute('data-variant') && h.querySelector('strong')
    );
    if (headingSpans.length > 0) {
      const h3 = document.createElement('h3');
      const strong = document.createElement('strong');
      strong.textContent = headingSpans[0].textContent.trim();
      h3.appendChild(strong);
      textCell.push(h3);
    }

    // Extract CTA link
    const ctaLink = tout.querySelector('.button-group a.button');
    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      textCell.push(a);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-editorial',
    cells,
  });
  element.replaceWith(block);
}
