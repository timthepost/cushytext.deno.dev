import {
  Element,
  HTMLDocument,
} from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import type Site from "lume/core/site.ts";
import { Page } from "lume/core/file.ts";

interface TocOptions {
  level?: number; // Maximum heading level to include (default: 5)
  headingSelector?: string; // Selector for headings (default: "h1, h2, h3, h4, h5")
  tocSelector?: string; // Selector for the TOC container (default: ".table-of-contents")
}

export default (options: TocOptions = {}) => {
  const level = options.level ?? 5;
  const headingSelector = options.headingSelector ?? `h1, h2, h3, h4, h5`;
  const tocSelector = options.tocSelector ?? ".table-of-contents";

  return (site: Site) => {
    site.process([".html"], (pages) => {
      for (const page of pages) {
        const document = page.document;

        if (!document) {
          return;
        }

        // Build TOC from the page content
        const toc = buildToc(document, headingSelector, level);
        if (toc.children.length === 0) return; // if no headings found, don't modify page

        // Find the TOC container
        const tocContainer = document.querySelector(tocSelector);

        if (tocContainer) {
          // Clear existing TOC content
          tocContainer.innerHTML = "";

          // Replace the TOC in the HTML
          tocContainer.appendChild(toc);
        }
      }
    });
  };
};

function buildToc(
  document: HTMLDocument,
  headingSelector: string,
  maxLevel: number,
) {
  const headings = document.querySelectorAll(headingSelector);
  const toc = document.createElement("ul");

  //Set the base class for the TOC
  toc.classList.add("table-of-contents", "thin-scrollbar", "margin-top--xs");

  // Map heading level to depth in the TOC (h1 -> 0, h2 -> 1, etc.)
  const levelMap: Record<string, number> = {
    h1: 0,
    h2: 1,
    h3: 2,
    h4: 3,
    h5: 4,
  };

  let currentLevel = -1;
  let currentList = toc;
  let parentLists: Element[] = []; // Keep track of parent UL elements for nested levels

  for (const heading of headings) {
    const level = levelMap[heading.tagName.toLowerCase()];
    if (level > maxLevel) continue;

    const id = heading.textContent
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    if (!id) continue; // skip if empty heading text
    heading.id = id;

    // Adjust nesting level in the TOC
    if (level > currentLevel) {
      // We are entering a deeper level, add a new nested UL
      const sublist = document.createElement("ul");
      currentList.lastElementChild?.appendChild(sublist);
      parentLists.push(currentList); // Remember our current parent
      currentList = sublist;
      currentLevel = level;
    } else if (level < currentLevel) {
      // We are going back up a level in the hierarchy
      // go to the correct parent ul
      let levelsToPop = currentLevel - level;
      while (levelsToPop > 0) {
        currentList = parentLists.pop()!;
        levelsToPop--;
      }
      currentLevel = level;
    }

    const li = document.createElement("li");
    const link = document.createElement("a");
    link.classList.add("table-of-contents__link");
    link.href = `#${id}`;
    link.textContent = heading.textContent;
    li.appendChild(link);
    currentList.appendChild(li);
  }

  return toc;
}
