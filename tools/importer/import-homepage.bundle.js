var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const desktop = element.querySelector('[data-hide-below="768"]') || element;
    const banner = desktop.querySelector(".banner");
    if (!banner) {
      element.replaceWith(document.createElement("div"));
      return;
    }
    const headlines = Array.from(banner.querySelectorAll(".headline")).filter(
      (h) => h.textContent.trim().length > 0
    );
    const contentCell = [];
    headlines.forEach((hl, idx) => {
      const text = hl.textContent.trim();
      if (!text) return;
      const level = idx === 0 ? "h2" : "h3";
      const heading = document.createElement(level);
      const italic = hl.querySelector("i");
      if (italic) {
        const em = document.createElement("em");
        em.textContent = text;
        heading.appendChild(em);
      } else {
        heading.textContent = text;
      }
      contentCell.push(heading);
    });
    const ctaLinks = Array.from(banner.querySelectorAll(".banner-buttons a.button"));
    ctaLinks.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.textContent.trim();
      contentCell.push(a);
    });
    const cells = [contentCell];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-banner",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-editorial.js
  function parse2(element, { document }) {
    const desktop = element.querySelector('[data-hide-below="768"]') || element;
    const toutGroupContent = desktop.querySelector(".tout-group-content") || desktop;
    const touts = Array.from(toutGroupContent.querySelectorAll(":scope > .tout.tout-with-picture"));
    if (touts.length === 0) {
      element.replaceWith(document.createElement("div"));
      return;
    }
    const cells = [];
    touts.forEach((tout) => {
      const img = tout.querySelector("img.main-tout-image, picture img");
      const imageCell = [];
      if (img) {
        const picture = document.createElement("img");
        picture.src = img.src || img.getAttribute("src");
        picture.alt = img.alt || "";
        imageCell.push(picture);
      }
      const textCell = [];
      const labelEl = tout.querySelector('.headline[data-variant="lead-in"]');
      if (labelEl && labelEl.textContent.trim()) {
        const label = document.createElement("p");
        label.textContent = labelEl.textContent.trim();
        textCell.push(label);
      }
      const headingSpans = Array.from(tout.querySelectorAll(".headline")).filter(
        (h) => !h.getAttribute("data-variant") && h.querySelector("strong")
      );
      if (headingSpans.length > 0) {
        const h3 = document.createElement("h3");
        const strong = document.createElement("strong");
        strong.textContent = headingSpans[0].textContent.trim();
        h3.appendChild(strong);
        textCell.push(h3);
      }
      const ctaLink = tout.querySelector(".button-group a.button");
      if (ctaLink) {
        const a = document.createElement("a");
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        textCell.push(a);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-editorial",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero.js
  function parse3(element, { document }) {
    const desktop = element.querySelector('[data-hide-below="768"]') || element;
    const bgImg = desktop.querySelector(".tout.tout-with-picture img.main-tout-image, .tout.tout-with-picture picture img");
    const imageCell = [];
    if (bgImg) {
      const img = document.createElement("img");
      img.src = bgImg.src || bgImg.getAttribute("src");
      img.alt = bgImg.alt || "";
      imageCell.push(img);
    }
    const contentCell = [];
    const headingEl = desktop.querySelector(".tout .headline strong");
    if (headingEl) {
      const h2 = document.createElement("h2");
      const text = headingEl.innerHTML.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").trim();
      h2.textContent = text;
      contentCell.push(h2);
    }
    const descEl = desktop.querySelector('.banner .headline[data-variant="subcopy"]');
    if (descEl && descEl.textContent.trim()) {
      const p = document.createElement("p");
      const descText = descEl.innerHTML.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").trim();
      p.textContent = descText;
      contentCell.push(p);
    }
    const ctaLinks = Array.from(desktop.querySelectorAll(".banner-buttons a.button"));
    ctaLinks.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.textContent.trim();
      contentCell.push(a);
    });
    const cells = [];
    if (imageCell.length > 0) cells.push(imageCell);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-nfl.js
  function parse4(element, { document }) {
    const desktop = element.querySelector('[data-hide-below="768"]') || element;
    const carousel = desktop.querySelector(".carousel.js-carousel");
    if (!carousel) {
      element.replaceWith(document.createElement("div"));
      return;
    }
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    if (slides.length === 0) {
      element.replaceWith(document.createElement("div"));
      return;
    }
    const cells = [];
    slides.forEach((slide) => {
      const bgImg = slide.querySelector("img.main-tout-image, .tout picture img");
      const imageCell = [];
      if (bgImg) {
        const img = document.createElement("img");
        img.src = bgImg.src || bgImg.getAttribute("src");
        img.alt = bgImg.alt || "";
        imageCell.push(img);
      }
      const textCell = [];
      const headlines = Array.from(slide.querySelectorAll(".lockup .headline")).filter(
        (h) => h.textContent.trim().length > 0 && !h.querySelector("img")
      );
      headlines.forEach((hl, idx) => {
        const text = hl.textContent.trim();
        if (!text) return;
        const level = idx === 0 ? "h2" : "h3";
        const heading = document.createElement(level);
        heading.textContent = text;
        textCell.push(heading);
      });
      const logoImg = slide.querySelector(".lockup .image img, .lockup picture img.picture-default");
      if (logoImg) {
        const img = document.createElement("img");
        img.src = logoImg.src || logoImg.getAttribute("src");
        img.alt = logoImg.alt || "";
        textCell.push(img);
      }
      const ctaLink = slide.querySelector(".button-group a.button");
      if (ctaLink) {
        const a = document.createElement("a");
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        textCell.push(a);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-nfl",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-brand.js
  function parse5(element, { document }) {
    const desktop = element.querySelector('[data-hide-below="768"]') || element;
    const tout = desktop.querySelector(".tout.tout-with-picture");
    if (!tout) {
      element.replaceWith(document.createElement("div"));
      return;
    }
    const bgImg = tout.querySelector("img.main-tout-image, picture.picture > img");
    const imageCell = [];
    if (bgImg) {
      const img = document.createElement("img");
      img.src = bgImg.src || bgImg.getAttribute("src");
      img.alt = bgImg.alt || "";
      imageCell.push(img);
    }
    const contentCell = [];
    const logoImg = tout.querySelector(".lockup .image img, .lockup picture img.picture-default");
    if (logoImg) {
      const img = document.createElement("img");
      img.src = logoImg.src || logoImg.getAttribute("src");
      img.alt = logoImg.alt || "";
      contentCell.push(img);
    }
    const ctaLinks = Array.from(tout.querySelectorAll(".button-group a.button"));
    ctaLinks.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.textContent.trim();
      contentCell.push(a);
    });
    const cells = [];
    if (imageCell.length > 0) cells.push(imageCell);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-brand",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-services.js
  function parse6(element, { document }) {
    const desktop = element.querySelector('[data-hide-below="768"]') || element;
    const toutGroupContent = desktop.querySelector(".tout-group-content") || desktop;
    const touts = Array.from(toutGroupContent.querySelectorAll(":scope > .tout"));
    if (touts.length === 0) {
      element.replaceWith(document.createElement("div"));
      return;
    }
    const row = [];
    touts.forEach((tout) => {
      const colContent = [];
      const logoImg = tout.querySelector(".image img, picture img.picture-default");
      if (logoImg) {
        const img = document.createElement("img");
        img.src = logoImg.src || logoImg.getAttribute("src");
        img.alt = logoImg.alt || "";
        colContent.push(img);
      }
      const descEl = tout.querySelector('.headline[data-variant="subcopy"]');
      if (descEl && descEl.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = descEl.textContent.trim();
        colContent.push(p);
      }
      const ctaLink = tout.querySelector(".button-group a.button");
      const ctaButton = tout.querySelector(".button-group button.button");
      if (ctaLink) {
        const a = document.createElement("a");
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        colContent.push(a);
      } else if (ctaButton) {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = ctaButton.textContent.trim();
        colContent.push(a);
      }
      row.push(colContent);
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-services",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/anf-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        '[data-testid="uf-prompt"]',
        '[data-testid="uf-prompt-close-button"]',
        '[class*="modal"]',
        '[class*="overlay"]'
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-testid");
      });
    }
  }

  // tools/importer/transformers/anf-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "cards-editorial": parse2,
    "hero": parse3,
    "carousel-nfl": parse4,
    "hero-brand": parse5,
    "columns-services": parse6
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Abercrombie & Fitch main homepage with hero banners, product categories, and promotional content",
    urls: ["https://www.abercrombie.com/"],
    blocks: [
      {
        name: "hero-banner",
        instances: ["#fragment_f99f4c3"]
      },
      {
        name: "cards-editorial",
        instances: ["#fragment_cbdd111"]
      },
      {
        name: "hero",
        instances: ["#fragment_24f15da"]
      },
      {
        name: "carousel-nfl",
        instances: ["#fragment_4203fbe"]
      },
      {
        name: "hero-brand",
        instances: ["#fragment_f322246"]
      },
      {
        name: "columns-services",
        instances: ["#fragment_087e237"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Promo Banner",
        selector: "#fragment_f99f4c3",
        style: "red-promo",
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Trend Edit Cards",
        selector: "#fragment_cbdd111",
        style: null,
        blocks: ["cards-editorial"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Archive Collection Hero",
        selector: "#fragment_24f15da",
        style: "dark",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "NFL Partnership Carousel",
        selector: "#fragment_4203fbe",
        style: null,
        blocks: ["carousel-nfl"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "YPB Active Section",
        selector: "#fragment_f322246",
        style: null,
        blocks: ["hero-brand"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Membership & Services",
        selector: "#fragment_087e237",
        style: null,
        blocks: ["columns-services"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      let originalUrl = params.originalURL;
      const waybackMatch = originalUrl.match(/web\.archive\.org\/web\/\d+\/(https?:\/\/.+)/);
      if (waybackMatch) {
        originalUrl = waybackMatch[1];
      }
      let pathname = new URL(originalUrl).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      if (pathname === "/shop/us" || pathname === "") {
        pathname = "/index";
      }
      const path = WebImporter.FileUtils.sanitizePath(pathname);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
