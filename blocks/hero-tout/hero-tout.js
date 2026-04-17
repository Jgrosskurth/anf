export default async function decorate(block) {
  const rows = [...block.children];

  // Row 0: background image
  // Row 1: headline image (handwriting)
  // Row 2: subcopy text
  // Row 3: CTA links

  const bgRow = rows[0];
  const headlineRow = rows[1];
  const subcopyRow = rows[2];
  const ctaRow = rows[3];

  // Build background layer
  const bgDiv = document.createElement('div');
  bgDiv.className = 'hero-tout-bg';
  const bgImg = bgRow?.querySelector('img');
  if (bgImg) {
    bgDiv.appendChild(bgImg.cloneNode(true));
  }

  // Build overlay
  const overlay = document.createElement('div');
  overlay.className = 'hero-tout-overlay';

  // Headline image
  if (headlineRow) {
    const headlineDiv = document.createElement('div');
    headlineDiv.className = 'hero-tout-headline';
    const headlineImg = headlineRow.querySelector('img');
    if (headlineImg) {
      headlineDiv.appendChild(headlineImg.cloneNode(true));
    }
    overlay.appendChild(headlineDiv);
  }

  // Subcopy
  if (subcopyRow) {
    const subcopyDiv = document.createElement('div');
    subcopyDiv.className = 'hero-tout-subcopy';
    const subcopyText = subcopyRow.querySelector('p');
    if (subcopyText) {
      subcopyDiv.textContent = subcopyText.textContent;
    }
    overlay.appendChild(subcopyDiv);
  }

  // CTAs
  if (ctaRow) {
    const ctasDiv = document.createElement('div');
    ctasDiv.className = 'hero-tout-ctas';
    const links = ctaRow.querySelectorAll('a');
    links.forEach((link) => {
      const a = link.cloneNode(true);
      a.className = '';
      ctasDiv.appendChild(a);
    });
    overlay.appendChild(ctasDiv);
  }

  // Replace block content
  block.textContent = '';
  block.appendChild(bgDiv);
  block.appendChild(overlay);
}
