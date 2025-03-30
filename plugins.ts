import { merge } from "lume/core/utils/object.ts";
import basePath from "lume/plugins/base_path.ts";
import brotli from "lume/plugins/brotli.ts";
import checkUrls from "lume/plugins/check_urls.ts";
import { favicon, Options as FaviconOptions } from "lume/plugins/favicon.ts";
import feed from "lume/plugins/feed.ts";
import icons from "lume/plugins/icons.ts";
import inline from "lume/plugins/inline.ts";
import lightningCss from "lume/plugins/lightningcss.ts";
import mdx from "lume/plugins/mdx.ts";
import metas from "lume/plugins/metas.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import nav from "lume/plugins/nav.ts";
import ogImages from "lume/plugins/og_images.ts";
import pagefind from "lume/plugins/pagefind.ts";
import picture from "lume/plugins/picture.ts";
import prism from "lume/plugins/prism.ts";
import purgecss from "lume/plugins/purgecss.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import redirects from "lume/plugins/redirects.ts";
import robots from "lume/plugins/robots.ts";
import { Options as SitemapOptions, sitemap } from "lume/plugins/sitemap.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import sourceMaps from "lume/plugins/source_maps.ts";
import terser from "lume/plugins/terser.ts";
import transformImages from "lume/plugins/transform_images.ts";
import seo from "./src/_plugins/seo/mod.ts";
import toc from "./src/_plugins/toc/mod.ts";

import "lume/types.ts";

import "npm:prismjs@1.29.0/components/prism-jsx.js";
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
      .use(toc({
        toc_selector: "#toc",
        toc_container: ".toc-enabled",
        toc_heading_selectors: "h2, h3, h4",
        toc_link_class: "table-of-contents__link",
        toc_list_class: "table-of-contents padding-top--none",
      }))
      .use(lightningCss())
      .add([".css"])
      .use(sourceMaps())
      .use(mdx({ extensions: [".mdx", ".jsx", ".tsx"] }))
      .use(basePath())
      .use(slugifyUrls({
        extensions: "*",
        lowercase: false, // Converts all characters to lowercase
        alphanumeric: true, // Replace non-alphanumeric characters with their equivalent. Example: ñ to n.
        separator: "-", // Character used as separator for words
        stopWords: ["and", "or", "the"], // A list of words not included in the slug
        replace: { // An object with individual character replacements
          "Ð": "D", // eth
          "ð": "d",
          "Đ": "D", // crossed D
          "đ": "d",
          "ø": "o",
          "ß": "ss",
          "æ": "ae",
          "œ": "oe",
        },
      }))
      .use(inline())
      .use(picture())
      .use(transformImages())
      .use(readingInfo({ extensions: [".mdx"] }))
      .use(redirects({ output: "json" }))
      .use(metas())
      .use(robots())
      .use(feed({
        output: ["/feed.xml", "/feed.json"],
        query: "waypoint=%blog%",
      }))
      .use(feed({
        output: ["/docs/feed.xml", "/docs/feed.json"],
        query: "waypoint=%theme-docs%",
      }))
      .use(feed(() => {
        const unknownTags = site.search.values("tags");
        const tags = unknownTags as string[];
        return tags.map((tag) => ({
          output: [`/feeds/tag/${tag}.xml`, `/feeds/tag/${tag}.json`],
          query: tag,
          info: {
            title: `Tag feed for ${tag}`,
          },
        }));
      }))
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
      .use(ogImages({ options: { width: 1200, height: 630 } }))
      .use(pagefind({
        ui: {
          containerId: "search",
          showImages: false,
          showEmptyFilters: false,
          resetStyles: true,
        },
      }))
      .use(purgecss())
      .use(minifyHTML({ extensions: [".html"] }))
      .use(terser({ options: { module: false } }))
      .use(brotli())
      .use(
        seo({
          output: "./_seo_report.json",
          ignore: ["/cushy-admin/", "/dev/", "/404.html"],
          lengthUnit: "character",
          lengthLocale: "en",
        }),
      )
      .add("_includes/js", "js")
      .add("_includes/css", "css")
      .add("uploads")
      .add("fonts")
      .add("script.js")
      .add("types.ts")
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
