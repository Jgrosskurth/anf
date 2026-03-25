/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner variant.
 * Base block: hero
 * Source: https://www.abercrombie.com/
 * Section 1: Promo Banner - .banner with headlines and CTA buttons on solid color background
 */
export default function parse(element, { document }) {
  // Use desktop version (data-hide-below="768")
  const desktop = element.querySelector('[data-hide-below="768"]') || element;

  // Find the banner element
  const banner = desktop.querySelector('.banner');
  if (!banner) {
    element.replaceWith(document.createElement('div'));
    return;
  }

  // Extract headlines - skip empty ones
  const headlines = Array.from(banner.querySelectorAll('.headline')).filter(
    (h) => h.textContent.trim().length > 0
  );

  // Build content cell with headings and CTAs
  const contentCell = [];

  // Convert headlines to proper heading elements
  headlines.forEach((hl, idx) => {
    const text = hl.textContent.trim();
    if (!text) return;

    // First headline becomes h2, second becomes h3
    const level = idx === 0 ? 'h2' : 'h3';
    const heading = document.createElement(level);

    // Preserve italic styling from source
    const italic = hl.querySelector('i');
    if (italic) {
      const em = document.createElement('em');
      em.textContent = text;
      heading.appendChild(em);
    } else {
      heading.textContent = text;
    }
    contentCell.push(heading);
  });

  // Extract CTA buttons
  const ctaLinks = Array.from(banner.querySelectorAll('.banner-buttons a.button'));
  ctaLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent.trim();
    contentCell.push(a);
  });

  // Hero block: no background image for this variant (solid color via section metadata)
  // Structure: single row with heading + CTAs
  const cells = [contentCell];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-banner',
    cells,
  });
  element.replaceWith(block);
}
