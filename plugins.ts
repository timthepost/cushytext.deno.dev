import lightningcss from "lume/plugins/lightningcss.ts";
import basePath from "lume/plugins/base_path.ts";
import metas from "lume/plugins/metas.ts";
import { Options as SitemapOptions, sitemap } from "lume/plugins/sitemap.ts";
import { favicon, Options as FaviconOptions } from "lume/plugins/favicon.ts";
import { merge } from "lume/core/utils/object.ts";
import jsx from "lume/plugins/jsx_preact.ts";
import mdx from "lume/plugins/mdx.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.1/toc.ts";
import pagefind from "lume/plugins/pagefind.ts";

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
    site.use(lightningcss())
      .use(pagefind({
        ui: {
          containerId: "search",
          showImages: false,
          showEmptyFilters: true,
          resetStyles: true,
        },
      }))
      .use(basePath())
      .use(toc())
      .use(metas())
      .use(jsx())
      .use(mdx({ extensions: [".mdx"] }))
      .use(sitemap(options.sitemap))
      .use(favicon(options.favicon))
      .copy("uploads")
      .copy("serve.ts")
      .copy("_includes/js", "js")
      .copy("_includes/css", "infima-css");
  };
}
