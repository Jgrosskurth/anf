/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero (vanilla) variant.
 * Base block: hero
 * Source: https://www.abercrombie.com/
 * Section 3: Archive Collection - .tout with background image + .banner with description and CTA
 * Hero table: Row 1 = background image, Row 2 = title + description + CTA
 */
export default function parse(element, { document }) {
  // Use desktop version (data-hide-below="768")
  const desktop = element.querySelector('[data-hide-below="768"]') || element;

  // Row 1: Background image from the .tout-with-picture
  const bgImg = desktop.querySelector('.tout.tout-with-picture img.main-tout-image, .tout.tout-with-picture picture img');
  const imageCell = [];
  if (bgImg) {
    const img = document.createElement('img');
    img.src = bgImg.src || bgImg.getAttribute('src');
    img.alt = bgImg.alt || '';
    imageCell.push(img);
  }

  // Row 2: Content - heading, description, CTA
  const contentCell = [];

  // Extract main heading from .tout .headline with <strong>
  const headingEl = desktop.querySelector('.tout .headline strong');
  if (headingEl) {
    const h2 = document.createElement('h2');
    // Convert <br> to space
    const text = headingEl.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim();
    h2.textContent = text;
    contentCell.push(h2);
  }

  // Extract description from .banner .headline[data-variant="subcopy"]
  const descEl = desktop.querySelector('.banner .headline[data-variant="subcopy"]');
  if (descEl && descEl.textContent.trim()) {
    const p = document.createElement('p');
    // Clean up <br> tags
    const descText = descEl.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim();
    p.textContent = descText;
    contentCell.push(p);
  }

  // Extract CTA from .banner-buttons
  const ctaLinks = Array.from(desktop.querySelectorAll('.banner-buttons a.button'));
  ctaLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent.trim();
    contentCell.push(a);
  });

  const cells = [];
  if (imageCell.length > 0) cells.push(imageCell);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero',
    cells,
  });
  element.replaceWith(block);
}
