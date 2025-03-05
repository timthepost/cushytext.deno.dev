import { Options as SitemapOptions, sitemap } from "lume/plugins/sitemap.ts";
import { favicon, Options as FaviconOptions } from "lume/plugins/favicon.ts";
import { merge } from "lume/core/utils/object.ts";
import redirects from "lume/plugins/redirects.ts";
import postcss from "lume/plugins/postcss.ts";
import basePath from "lume/plugins/base_path.ts";
import metas from "lume/plugins/metas.ts";
import robots from "lume/plugins/robots.ts";
import mdx from "lume/plugins/mdx.ts";
import nav from "lume/plugins/nav.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import feed from "lume/plugins/feed.ts";
import readingInfo from "lume/plugins/reading_info.ts";

// import your favorite language
import lang_javascript from "npm:highlight.js/lib/languages/javascript";
import lang_bash from "npm:highlight.js/lib/languages/bash";
import lang_xml from "npm:highlight.js/lib/languages/xml";
import lang_yaml from "npm:highlight.js/lib/languages/yaml";

import "lume/types.ts";

export interface Options {
  sitemap?: Partial<SitemapOptions>;
  favicon?: Partial<FaviconOptions>;
}

export const defaults: Options = {
  favicon: {
    input: "uploads/favicon.svg",
  },
};

/** Configure the site */
export default function (userOptions?: Options) {
  const options = merge(defaults, userOptions);

  return (site: Lume.Site) => {
    site
      .use(nav())
      .use(postcss())
      .add([".css"])
      .use(feed({ output: ["/feed.rss"], query: "%blog%" }))
      .use(feed({ output: ["/feed.json"], query: "%blog%" }))
      .use(code_highlight({
        languages: {
          javascript: lang_javascript,
          js: lang_javascript,
          bash: lang_bash,
          sh: lang_bash,
          xml: lang_xml,
          html: lang_xml,
          yaml: lang_yaml,
          yml: lang_yaml,
        },
        theme: {
          name: "an-old-hope", // The theme name to download
          cssFile: "/highlight.css",
        },
      }))
      .use(mdx({ extensions: [".mdx"] }))
      .use(basePath())
      .use(readingInfo({ extensions: [".mdx"] }))
      .use(redirects({ output: "json" }))
      .use(metas())
      .use(robots())
      .use(sitemap(options.sitemap))
      .use(favicon(options.favicon))
      .add("_includes/js", "js")
      .add("_includes/css", "css")
      .add("uploads")
      .preprocess([".mdx"], (pages) => {
        for (const page of pages) {
          page.data.excerpt ??= (page.data.content as string).split(
            /{\/\*more\*\/}/i,
          )[0];
        }
      });
  };
}
