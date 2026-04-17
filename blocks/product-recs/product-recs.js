export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 3) return;

  /* Row 0: Title */
  const titleRow = rows[0];
  titleRow.classList.add('product-recs-title');

  /* Row 1: Tabs */
  const tabRow = rows[1];
  tabRow.classList.add('product-recs-tabs');
  const tabCells = [...tabRow.children];
  const tabList = document.createElement('div');
  tabList.classList.add('product-recs-tablist');
  tabList.setAttribute('role', 'tablist');

  tabCells.forEach((cell, i) => {
    const btn = document.createElement('button');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.textContent = cell.textContent.trim();
    btn.addEventListener('click', () => {
      tabList.querySelectorAll('[role=tab]').forEach((t) => t.setAttribute('aria-selected', 'false'));
      btn.setAttribute('aria-selected', 'true');
    });
    tabList.append(btn);
  });

  tabRow.replaceChildren(tabList);

  /* Rows 2+: Product cards */
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('product-recs-cards');

  rows.slice(2).forEach((row) => {
    row.classList.add('product-recs-card');
    const cells = [...row.children];
    if (cells.length >= 2) {
      cells[0].classList.add('product-recs-card-image');
      cells[1].classList.add('product-recs-card-info');

      /* Parse info cell: badge, name (h3), price, promo, link */
      const paragraphs = [...cells[1].querySelectorAll('p')];
      if (paragraphs.length >= 1) paragraphs[0].classList.add('product-recs-badge');
      if (paragraphs.length >= 3) paragraphs[2].classList.add('product-recs-promo');
    }
    cardContainer.append(row);
  });

  block.append(cardContainer);
}
