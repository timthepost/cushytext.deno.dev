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
import feed from "lume/plugins/feed.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import prism from "lume/plugins/prism.ts";

import "lume/types.ts";

import "npm:prismjs@1.29.0/components/prism-less.js";
import "npm:prismjs@1.29.0/components/prism-git.js";
import "npm:prismjs@1.29.0/components/prism-json.js";
import "npm:prismjs@1.29.0/components/prism-markdown.js";
import "npm:prismjs@1.29.0/components/prism-sass.js";
import "npm:prismjs@1.29.0/components/prism-scss.js";
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-yaml.js";


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
      .use(feed({ output: ["/feed.xml"], query: "%blog%" }))
      .use(feed({ output: ["/feed.json"], query: "%blog%" }))
      .use(mdx({ extensions: [".mdx"] }))
      .use(basePath())
      .use(readingInfo({ extensions: [".mdx"] }))
      .use(redirects({ output: "json" }))
      .use(metas())
      .use(robots())
      .use(sitemap(options.sitemap))
      .use(favicon(options.favicon))
      .use(prism({
        theme: [
          {
            name: "tomorrow",
            cssFile: "css/prism.css",
          }
        ]
      }))
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
