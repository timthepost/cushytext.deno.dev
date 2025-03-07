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
  toc_list_class?: string;
  toc_link_class?: string;
}

export const defaults: Options = {
  toc_selector: "#toc",
  toc_container: ".toc-enabled",
  toc_heading_selectors: "h2, h3, h4, h5, h6",
  toc_link_class: "",
  toc_list_class: "",
};

// Report warnings
const cachedWarnings = new Map<string, Set<string>>();

function cushyUpdate(msg: string): void {
  log.info(`☁️⠀⠀${msg}`);
}

export default function conductor(userOptions?: Options) {
  const options = merge(defaults, userOptions);

  /**
   * A *very* basic TOC generator.
   * I'll take PRs that improve this.
   * 
   * @param containerSelector Content in this selector will be scanned for headings
   * @param tocSelector This is where the resulting list of links will be placed
   * @param headingSelectors A list of headings to include ("h1 h2 ... h6")
   * @param document Document object (e.g. from page.document)
   */
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
    let tocListHTML = `<ul class="${options.toc_list_class}">`;
    headings.forEach((heading, index) => {
      const headingId = heading.id || `heading-${index}`;
      heading.id = headingId;
      tocListHTML += `<li><a href="#${headingId}" class="${options.toc_link_class}">${heading.textContent}</a></li>`;
    });
    tocListHTML += '</ul>';
    toc.innerHTML = tocListHTML;
  }

  cachedWarnings.clear();
  cushyUpdate("Starting up ...");

  return (site: Site) => {
    // pre-render stuff
    site.addEventListener("beforeRender", () => { 
      site.process([".html"], (pages) => {
        for (const page of pages) {
          
          // Table Of Contents (Docs & Blogs)
          generateTOC(options.toc_container, 
            options.toc_selector, 
            options.toc_heading_selectors, 
            page.document);
        }
      });
    });

    // post-render stuff (like tag exports to json)

  };
}
