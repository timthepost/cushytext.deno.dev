/**
 * Finishing touches for content that are just too
 * small to keep in individual plugins. So, we have
 * a 'conductor' that manages and reports on them.
 */
import { merge } from "lume/core/utils/object.ts";
import { log } from "lume/core/utils/log.ts";
import type Site from "lume/core/site.ts";

interface Options {
  toc_selector?: string;
  toc_container?: string;
  toc_heading_selectors?: string;
}

export const defaults: Options = {
  toc_selector: "#toc",
  toc_container: ".toc-enabled",
  toc_heading_selectors: "h1, h2, h3, h4, h5, h6",
};

// Report warnings
const cachedWarnings = new Map<string, Set<string>>();

function cushyUpdate(msg: string): void {
  log.info(`☁️⠀⠀${msg}`);
}


export default function conductor(userOptions?: Options) {
  const options = merge(defaults, userOptions);

  cachedWarnings.clear();
  cushyUpdate("Starting up ...");

  function generateTOC(containerSelector: string, 
      tocSelector: string, headingSelectors: string, document: Document) {

    const container = document.querySelector(containerSelector);
    const toc = document.querySelector(tocSelector);
    if (!container || !toc) {
      return;
    }
    const headings = container.querySelectorAll(headingSelectors);
    if (headings.length === 0) {
      return;
    }
    const tocList = document.createElement('ul');
    headings.forEach((heading, index) => {
      const headingId = heading.id || `heading-${index}`;
      heading.id = headingId;
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${headingId}`;
      link.textContent = heading.textContent;
      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });
    toc.appendChild(tocList);
  }

  return (site: Site) => {
    site.process([".html"], (pages) => {
      for (const page of pages) {
      
        // generate a table of contents for blogs and docs
        generateTOC(options.toc_container, 
          options.toc_selector, 
          options.toc_heading_selectors, 
          page.document);
      }
    });
  };
}
