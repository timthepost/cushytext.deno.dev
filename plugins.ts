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
import picture from "lume/plugins/picture.ts";
import transformImages from "lume/plugins/transform_images.ts";
import brotli from "lume/plugins/brotli.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import terser from "lume/plugins/terser.ts";
import purgecss from "lume/plugins/purgecss.ts";
import ogImages from "lume/plugins/og_images.ts";
import icons from "lume/plugins/icons.ts";
import checkUrls from "lume/plugins/check_urls.ts";
import sourceMaps from "lume/plugins/source_maps.ts";

import conductor from "./src/_plugins/site_conductor/mod.ts";

import "lume/types.ts";

import "npm:prismjs@1.29.0/components/prism-git.js";
import "npm:prismjs@1.29.0/components/prism-json.js";
import "npm:prismjs@1.29.0/components/prism-markdown.js";
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-yaml.js";
import "npm:prismjs@1.29.0/components/prism-bash.js";

/**
 * Some of this is from Simple Blog, by Óscar Otero.
 * https://lume.land/theme/simple-blog/ (Same License)
 */

export interface Options {
  sitemap?: Partial<SitemapOptions>;
  favicon?: Partial<FaviconOptions>;
}

export const defaults: Options = {
  favicon: {
    input: "uploads/_favicon.svg",
  },
};

export default function (userOptions?: Options) {
  const options = merge(defaults, userOptions);

  return (site: Lume.Site) => {
    site
      .use(nav())
      .use(conductor({
        toc_selector: "#toc",
        toc_container: ".toc-enabled",
        toc_heading_selectors: "h2, h3, h4, h5, h6",
        toc_link_class: "table-of-contents__link",
        toc_list_class: "table-of-contents padding-top--none",
      }))
      .use(postcss())
      .use(sourceMaps())
      .add([".css"])
      .use(feed({ 
          output: ["/feed.xml", "/feed.json"], 
          query: "waypoint=%blog%" 
        }),
      )
      .use(feed({
          output: ["/docs/feed.xml", "/docs/feed.json"],
          query: "waypoint=%docs%",
        }),
      )
      .use(mdx({ extensions: [".mdx"] }))
      .use(basePath())
      .use(purgecss())
      .use(minifyHTML())
      .use(terser({ options: { module: false }}))
      .use(brotli())
      .use(picture())
      .use(transformImages())
      .use(readingInfo({ extensions: [".mdx"] }))
      .use(redirects({ output: "json" }))
      .use(metas())
      .use(robots())
      .use(checkUrls({
        external: true,
        output: "_broken_links.json",
        ignore: ["/api"],
      }))
      .use(sitemap(options.sitemap))
      .use(favicon(options.favicon))
      .use(icons())
      .use(prism({
        theme: [
          {
            name: "tomorrow",
            cssFile: "css/prism.css",
          },
        ],
      }))
      .use(ogImages({ satori: { width: 1200, height: 630 }}))
      .add("_includes/js", "js")
      .add("_includes/css", "css")
      .add("uploads")
      .add("fonts")
      .add("script.js")
      // make {/* more */} work (MDX, JSX, TSX)
      .preprocess([".mdx", ".jsx", ".tsx"], (pages) => {
        for (const page of pages) {
          page.data.excerpt ??= (page.data.content as string).split(
            /{\/\*\s*more\s*\*\/}/i,
          )[0];
        }
      })
      // MD just uses XML style <!-- more -->
      .preprocess([".md"], (pages) => {
        for (const page of pages) {
          page.data.excerpt ??= (page.data.content as string).split(
            /<!--\s*more\s*-->/i,
          )[0];
        }
      });
  };
}
