export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const row = rows[0];
  const cells = [...row.children];

  // cells: [0] = bg image, [1] = logo image, [2] = CTA links
  // Restructure: logo and CTAs share the overlay area at bottom-left
  // The CSS grid handles positioning via grid-area overlap
}
