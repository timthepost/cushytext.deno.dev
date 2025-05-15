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
import mermaid from "https://deno.land/x/lume_mermaid@v0.1.4/mod.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import seo from "./src/_plugins/seo/mod.ts";
import simpleSEO from "./src/_plugins/seo/new_mod.ts";
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

export default function(userOptions?: Options) {
  const options = merge(defaults, userOptions);

  return (site: Lume.Site) => {
    site
      .use(readingInfo({ extensions: [".mdx"] }))
      .use(mdx({ extensions: [".mdx", ".jsx", ".tsx"] }))
      .use(metas())
      .use(nav())
      .use(pagefind({
        ui: {
          containerId: "search",
          showImages: false,
          showEmptyFilters: false,
          resetStyles: true,
        },
      }))
      .use(prism({
        theme: [
          {
            name: "tomorrow",
            cssFile: "css/prism.css",
          },
        ],
      }))
      .use(robots())
      .use(redirects({ output: "json" }))
      .use(toc({
        toc_selector: "#toc",
        toc_container: ".toc-enabled",
        toc_heading_selectors: "h2, h3, h4",
        toc_link_class: "table-of-contents__link",
        toc_list_class: "table-of-contents padding-top--none",
      }))
      .use(icons())
      .use(terser({ options: { module: false } }))
      .use(lightningCss())
      .add([".css"])
      .use(purgecss())
      .use(sourceMaps())
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
      .use(checkUrls({
        external: true,
        output: "_broken_links.json",
        ignore: ["/api"],
      }))
      .use(ogImages({ options: { width: 1200, height: 630 } }))
      .use(favicon(options.favicon))
      .use(picture())
      .use(transformImages())
      .use(inline())
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
      .use(sitemap(options.sitemap))
      .use(mermaid({
        theme: "dark"
      }))
      .use(minifyHTML({options: { keep_html_and_head_opening_tags: true } }))
      .use(brotli())
      .use(
        seo({
          output: "./_seo_report.json",
          ignore: ["/cushy-admin/", "/404.html"],
          lengthUnit: "character",
          lengthLocale: "en",
        }),
      )
      .use(simpleSEO({
        globalSettings: {
          ignore: ["/404.html"],
          ignorePatterns: ["/archive/", "/author/", "/dev/"],
          stateFile: null,
          reportFile: "./_seo_report.json",
          debug: true,
          defaultLengthUnit: "character",
        },
        lengthChecks: {
          title: "max 80 character",
          url: "max 45 character",
          metaDescription: "range 1 2 sentence",
          content: "range 900 5000 word",
          metaKeywordLength: "range 10 50 word",
        },
        mediaAttributeChecks: {
          imageAlt: "range 2 1500 character",
          imageTitle: false,
        },
      }))
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
