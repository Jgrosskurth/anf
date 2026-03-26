import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Group h4 + ul pairs into column divs for the link columns section
  const firstSection = footer.querySelector('.section:first-child');
  if (firstSection) {
    const headings = firstSection.querySelectorAll('h4');
    if (headings.length > 1) {
      const columns = [];
      headings.forEach((h4) => {
        const col = document.createElement('div');
        col.append(h4);
        const next = h4.nextElementSibling;
        if (next && next.tagName === 'UL') col.append(next);
        columns.push(col);
      });
      // Clear section content and rebuild with columns
      const wrapper = firstSection.querySelector('.default-content-wrapper');
      if (wrapper) {
        wrapper.textContent = '';
        columns.forEach((col) => wrapper.append(col));
      }
    }
  }

  block.append(footer);
}
