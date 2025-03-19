/**
 * Finishing touches for content that are just too
 * small to keep in individual plugins. So, we have
 * a 'conductor' that manages and reports on them.
 */
import { merge } from "lume/core/utils/object.ts";
import { log } from "lume/core/utils/log.ts";
import type Site from "lume/core/site.ts";
import yaml from "lume/core/loaders/yaml.ts";
import feed from "lume/plugins/feed.ts";
import { Data } from "lume/core/file.ts";

interface TagWikiData {
  [key: string]: Data;
}

interface Options {
  // TODO: Make this a string [] so multiple TOCs work
  toc_selector?: string;
  toc_container?: string;
  toc_heading_selectors?: string;
  toc_list_class?: string;
  toc_link_class?: string;
  tag_wiki_path?: string;
}

export const defaults: Options = {
  toc_selector: "#toc",
  toc_container: ".toc-enabled",
  toc_heading_selectors: "h2, h3, h4, h5, h6",
  toc_link_class: "",
  toc_list_class: "",
  tag_wiki_path: "./src/_data/tagWiki.yml",
};

function cushyUpdate(msg: string): void {
  log.info(`☁️⠀⠀${msg}`);
}

export default function conductor(userOptions?: Options) {
  const options = merge(defaults, userOptions);

  /**
   * A *very* basic TOC generator. I'll take PRs that improve this.
   * @param containerSelector Content in this selector will be scanned for headings
   * @param tocSelector This is where the resulting list of links will be placed
   * @param headingSelectors A list of headings to include ("h1 h2 ... h6")
   * @param document Document object (e.g. from page.document)
   */
  function generateTOC(
    containerSelector: string,
    tocSelector: string,
    headingSelectors: string,
    document: Document,
  ) {
    const container = document.querySelector(containerSelector);
    const toc = document.querySelector(tocSelector);
    if (!container || !toc) {
      return;
    }
    const headings = container.querySelectorAll(headingSelectors);
    if (headings.length === 0) {
      return;
    }
    // this only seems to work if you set the InnerHTML; I've tried other ways.
    let tocListHTML = `<ul class="${options.toc_list_class}">`;
    headings.forEach((heading, index) => {
      const headingId = heading.id || `heading-${index}`;
      heading.id = headingId;
      tocListHTML +=
        `<li><a href="#${headingId}" class="${options.toc_link_class}">${heading.textContent}</a></li>`;
    });
    tocListHTML += "</ul>";
    toc.innerHTML = tocListHTML;
  }

  cushyUpdate("Starting up.");

  return (site: Site) => {
    // TOC Generation should run pre-render
    site.addEventListener("beforeRender", () => {
      site.process([".html"], (pages) => {
        for (const page of pages) {
          generateTOC(
            options.toc_container,
            options.toc_selector,
            options.toc_heading_selectors,
            page.document,
          );
        }
      });
    });
    
    site.addEventListener("afterRender", async() => {
      const tagWiki : TagWikiData = await yaml(options.tag_wiki_path);
      for (const tagObject of site.search.values("tags")) {
        const tag = tagObject as string;
        if (tagWiki && tagWiki[tag].feed) {
          site.use(feed({
            output: [ `${tagWiki[tag].feed}feed.xml`, `${tagWiki[tag].feed}feed.json` ],
            query: `${tag}`,
            info: {
              title: `Tag feed for ${tag}`
            }
          }));
          cushyUpdate(`Set up tag feeds for tag: ${tag} in ${tagWiki[tag].feed}`);
        }
      }
    });
  };
}
