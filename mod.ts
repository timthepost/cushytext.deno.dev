import plugins, { Options } from "./plugins.ts";

import "lume/types.ts";

export type { Options } from "./plugins.ts";

export default function (options: Partial<Options> = {}) {
  return (site: Lume.Site) => {
    // Configure the site
    site.use(plugins(options));

    // Add remote files
    const files = [
        "_archetypes/blog.ts",
        "_archetypes/doc.ts",
        "_archetypes/page.ts",
        "_components/card.vto",
        "_components/hero.vto",
        "_components/latestBlog.vto",
        "_data/demo.yml",
        "_data/locale.yml",
        "_data/navbar.yml",
        "_includes/css/forms.css",
        "_includes/css/opendyslexic.css",
        "_includes/css/theme-variables.css",
        "_includes/css/theme.css",
        "_includes/js/infima/alerts.js",
        "_includes/js/infima/button-groups.js",
        "_includes/js/infima/dropdowns.js",
        "_includes/js/infima/menu.js",
        "_includes/js/infima/navbar.js",
        "_includes/js/infima/pills.js",
        "_includes/js/infima/radio-behavior.js",
        "_includes/js/infima/tabs.js",
        "_includes/js/main.js",
    ];

    for (const file of files) {
      site.remoteFile(file, import.meta.resolve(`./src/${file}`));
    }
  };
}