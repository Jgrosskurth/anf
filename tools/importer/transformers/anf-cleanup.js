/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Abercrombie & Fitch cleanup.
 * Selectors from captured DOM of https://www.abercrombie.com/shop/us
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove modals, overlays, sign-in prompts that may interfere with block parsing
    // Found in captured DOM: data-testid="uf-prompt", modal elements
    WebImporter.DOMUtils.remove(element, [
      '[data-testid="uf-prompt"]',
      '[data-testid="uf-prompt-close-button"]',
      '[class*="modal"]',
      '[class*="overlay"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable content (header, footer, nav)
    // Found in captured DOM: header.scope-1892, footer.catalog-footer-module__footer, nav[aria-label="Main menu"]
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      'iframe',
      'link',
      'noscript',
    ]);

    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-testid');
    });
  }
}
