/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-brand variant.
 * Base block: hero
 * Source: https://www.abercrombie.com/
 * Section 5: YPB Active - .tout-with-picture with background image, brand logo, and CTAs
 * Hero table: Row 1 = background image, Row 2 = logo image + CTAs
 */
export default function parse(element, { document }) {
  // Use desktop version (data-hide-below="768")
  const desktop = element.querySelector('[data-hide-below="768"]') || element;

  // Find the main tout with picture
  const tout = desktop.querySelector('.tout.tout-with-picture');
  if (!tout) {
    element.replaceWith(document.createElement('div'));
    return;
  }

  // Row 1: Background image
  const bgImg = tout.querySelector('img.main-tout-image, picture.picture > img');
  const imageCell = [];
  if (bgImg) {
    const img = document.createElement('img');
    img.src = bgImg.src || bgImg.getAttribute('src');
    img.alt = bgImg.alt || '';
    imageCell.push(img);
  }

  // Row 2: Logo image + CTAs
  const contentCell = [];

  // YPB logo image (inside .lockup .image)
  const logoImg = tout.querySelector('.lockup .image img, .lockup picture img.picture-default');
  if (logoImg) {
    const img = document.createElement('img');
    img.src = logoImg.src || logoImg.getAttribute('src');
    img.alt = logoImg.alt || '';
    contentCell.push(img);
  }

  // Extract CTA buttons
  const ctaLinks = Array.from(tout.querySelectorAll('.button-group a.button'));
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
    name: 'hero-brand',
    cells,
  });
  element.replaceWith(block);
}
