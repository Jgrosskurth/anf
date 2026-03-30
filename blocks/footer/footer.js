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
      // Capture pairs before any DOM manipulation
      const pairs = [...headings].map((h4) => {
        const next = h4.nextElementSibling;
        return { h4, ul: next && next.tagName === 'UL' ? next : null };
      });

      // Build column divs
      const columns = pairs.map(({ h4, ul }) => {
        const col = document.createElement('div');
        const heading = h4.textContent.trim().toLowerCase();

        // Turn "Subscribe" column into an email form
        if (heading === 'subscribe') {
          col.className = 'footer-subscribe';
          col.append(h4);
          const form = document.createElement('form');
          form.className = 'footer-subscribe-form';
          form.setAttribute('action', '#');
          form.innerHTML = `
            <input type="email" placeholder="Email Address" aria-label="Email Address" required>
            <button type="submit">Join</button>
          `;
          col.append(form);
        } else {
          col.append(h4);
          if (ul) col.append(ul);
        }
        return col;
      });

      // Find or create .default-content-wrapper and rebuild
      let wrapper = firstSection.querySelector('.default-content-wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'default-content-wrapper';
      }
      wrapper.replaceChildren(...columns);
      firstSection.replaceChildren(wrapper);
    }
  }

  block.append(footer);
}
