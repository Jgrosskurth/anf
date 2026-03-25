/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-nfl variant.
 * Base block: carousel
 * Source: https://www.abercrombie.com/
 * Section 4: NFL Partnership Carousel - .carousel with 6 slides
 * Carousel table: 2 columns per row. Col1: image, Col2: text content (heading, subtext, logo, CTA)
 */
export default function parse(element, { document }) {
  // Use desktop version (data-hide-below="768")
  const desktop = element.querySelector('[data-hide-below="768"]') || element;

  // Find the carousel and its slides
  const carousel = desktop.querySelector('.carousel.js-carousel');
  if (!carousel) {
    element.replaceWith(document.createElement('div'));
    return;
  }

  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  if (slides.length === 0) {
    element.replaceWith(document.createElement('div'));
    return;
  }

  const cells = [];

  slides.forEach((slide) => {
    // Col 1: Slide background image
    const bgImg = slide.querySelector('img.main-tout-image, .tout picture img');
    const imageCell = [];
    if (bgImg) {
      const img = document.createElement('img');
      img.src = bgImg.src || bgImg.getAttribute('src');
      img.alt = bgImg.alt || '';
      imageCell.push(img);
    }

    // Col 2: Text content
    const textCell = [];

    // Extract headlines (skip empty ones)
    const headlines = Array.from(slide.querySelectorAll('.lockup .headline')).filter(
      (h) => h.textContent.trim().length > 0 && !h.querySelector('img')
    );

    headlines.forEach((hl, idx) => {
      const text = hl.textContent.trim();
      if (!text) return;
      // First headline as h2, second as h3
      const level = idx === 0 ? 'h2' : 'h3';
      const heading = document.createElement(level);
      heading.textContent = text;
      textCell.push(heading);
    });

    // Extract NFL logo image
    const logoImg = slide.querySelector('.lockup .image img, .lockup picture img.picture-default');
    if (logoImg) {
      const img = document.createElement('img');
      img.src = logoImg.src || logoImg.getAttribute('src');
      img.alt = logoImg.alt || '';
      textCell.push(img);
    }

    // Extract CTA link
    const ctaLink = slide.querySelector('.button-group a.button');
    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      textCell.push(a);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-nfl',
    cells,
  });
  element.replaceWith(block);
}
