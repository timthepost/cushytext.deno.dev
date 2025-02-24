import { Options as SitemapOptions, sitemap } from "lume/plugins/sitemap.ts";
import { favicon, Options as FaviconOptions } from "lume/plugins/favicon.ts";
import { merge } from "lume/core/utils/object.ts";
import redirects from "lume/plugins/redirects.ts";
import postcss from "lume/plugins/postcss.ts";
import basePath from "lume/plugins/base_path.ts";
import metas from "lume/plugins/metas.ts";
import robots from "lume/plugins/robots.ts";
import mdx from "lume/plugins/mdx.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.1/toc.ts";

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
    site.use(postcss())
      .add([".css"])
      .use(basePath())
      .use(toc())
      .use(metas())
      .use(robots())
      .use(mdx({ extensions: [".mdx"] }))
      .use(redirects({ output: "json" }))
      .use(sitemap(options.sitemap))
      .use(favicon(options.favicon))
      .add("_includes/js", "js")
      .add("_includes/css", "css")
      .add("uploads");
  };
}
