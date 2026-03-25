/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsEditorialParser from './parsers/cards-editorial.js';
import heroParser from './parsers/hero.js';
import carouselNflParser from './parsers/carousel-nfl.js';
import heroBrandParser from './parsers/hero-brand.js';
import columnsServicesParser from './parsers/columns-services.js';

// TRANSFORMER IMPORTS
import anfCleanupTransformer from './transformers/anf-cleanup.js';
import anfSectionsTransformer from './transformers/anf-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-editorial': cardsEditorialParser,
  'hero': heroParser,
  'carousel-nfl': carouselNflParser,
  'hero-brand': heroBrandParser,
  'columns-services': columnsServicesParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Abercrombie & Fitch main homepage with hero banners, product categories, and promotional content',
  urls: ['https://www.abercrombie.com/'],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['#fragment_f99f4c3'],
    },
    {
      name: 'cards-editorial',
      instances: ['#fragment_cbdd111'],
    },
    {
      name: 'hero',
      instances: ['#fragment_24f15da'],
    },
    {
      name: 'carousel-nfl',
      instances: ['#fragment_4203fbe'],
    },
    {
      name: 'hero-brand',
      instances: ['#fragment_f322246'],
    },
    {
      name: 'columns-services',
      instances: ['#fragment_087e237'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Promo Banner',
      selector: '#fragment_f99f4c3',
      style: 'red-promo',
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Trend Edit Cards',
      selector: '#fragment_cbdd111',
      style: null,
      blocks: ['cards-editorial'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Archive Collection Hero',
      selector: '#fragment_24f15da',
      style: 'dark',
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'NFL Partnership Carousel',
      selector: '#fragment_4203fbe',
      style: null,
      blocks: ['carousel-nfl'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'YPB Active Section',
      selector: '#fragment_f322246',
      style: null,
      blocks: ['hero-brand'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Membership & Services',
      selector: '#fragment_087e237',
      style: null,
      blocks: ['columns-services'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  anfCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [anfSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    // Handle Wayback Machine URLs: extract original URL path
    let originalUrl = params.originalURL;
    const waybackMatch = originalUrl.match(/web\.archive\.org\/web\/\d+\/(https?:\/\/.+)/);
    if (waybackMatch) {
      originalUrl = waybackMatch[1];
    }
    let pathname = new URL(originalUrl).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    // Map /shop/us to homepage index
    if (pathname === '/shop/us' || pathname === '') {
      pathname = '/index';
    }
    const path = WebImporter.FileUtils.sanitizePath(pathname);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
