import postcss from "lume/plugins/postcss.ts";
import basePath from "lume/plugins/base_path.ts";
import metas from "lume/plugins/metas.ts";
import { Options as SitemapOptions, sitemap } from "lume/plugins/sitemap.ts";
import { favicon, Options as FaviconOptions } from "lume/plugins/favicon.ts";
import { merge } from "lume/core/utils/object.ts";
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
      .add(".css")
      .use(basePath())
      .use(toc())
      .use(metas())
      .use(mdx({ extensions: [".mdx"] }))
      .use(sitemap(options.sitemap))
      .use(favicon(options.favicon))
      .remoteFile(
          "_includes/css/theme-light.css",
            "https://cdn.jsdelivr.net/npm/infima@0.2.0-alpha.45/dist/css/default/default.css",
      )
      .remoteFile(
        "_includes/css/theme-dark.css",
        "https://cdn.jsdelivr.net/npm/infima@0.2.0-alpha.45/dist/css/default-dark/default-dark.css",
      )
      .add("uploads")
      .add("serve.ts")
      .add("main.js", ".")
      .add("_includes/js", "js")
      .add("_includes/css", "css")
  };
}
