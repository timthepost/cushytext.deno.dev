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
      "_components/feedback/comp.vto",
      "_components/feedback/style.css",
      "_components/feedback/script.js",
      "_components/feedbackAdmin/comp.vto",
      "_components/feedbackAdmin/style.css",
      "_components/feedbackAdmin/script.js",
      // this needs to be "generified"
      "_data/demo.yml",
      "_data/locale.yml",
      // this needs to be "generified"
      "_data/navbar.yml",
      // this needs to be "generified"
      "_data/tagWiki.yml",
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
      "_includes/layouts/base.vto",
      "_includes/layouts/docs.vto",
      "_includes/layouts/error_404.vto",
      "_includes/layouts/homepage.vto",
      "_includes/layouts/og_images.jsx",
      "_includes/layouts/page.vto",
      "_includes/layouts/post-archive.vto",
      "_includes/layouts/post-index.vto",
      "_includes/layouts/post.vto",
      "_includes/partials/footer.vto",
      "_includes/partials/head.vto",
      // This needs to be generified
      "_includes/partials/nav.vto",
      "_includes/templates/docs-template.vto",
      "_includes/templates/post-archive-item.vto",
      "_includes/templates/post-archive-template.vto",
      "_includes/templates/post-index-item.vto",
      "_includes/templates/post-index-template.vto",
      "_includes/templates/post-template.vto",
      "_plugins/seo/mod.ts",
      "_plugins/toc/mod.ts",
      "fonts/OpenDyslexic-Bold.eot",
      "fonts/OpenDyslexic-Bold.otf",
      "fonts/OpenDyslexic-Bold.woff",
      "fonts/OpenDyslexic-Bold.woff2",
      "fonts/OpenDyslexic-Bold-Italic.eot",
      "fonts/OpenDyslexic-Bold-Italic.otf",
      "fonts/OpenDyslexic-Bold-Italic.woff",
      "fonts/OpenDyslexic-Bold-Italic.woff2",
      "fonts/OpenDyslexic-Regular.eot",
      "fonts/OpenDyslexic-Regular.otf",
      "fonts/OpenDyslexic-Regular.woff",
      "fonts/OpenDyslexic-Regular.woff2",
      "fonts/OpenDyslexic-Italic.eot",
      "fonts/OpenDyslexic-Italic.otf",
      "fonts/OpenDyslexic-Italic.woff",
      "fonts/OpenDyslexic-Italic.woff2",
      "generators/_data.yml",
      "generators/archive_result.page.js",
      "generators/archive_page.js",
      "uploads/_data.yml",
      "uploads/_favicon.svg",
      "docs/_data.yml", 
      "docs/archetypes.mdx",
      "docs/blog-system.mdx",
      "docs/index.mdx",
      "docs/middleware.mdx",
      "docs/navigation-generation.mdx",
      "docs/tag-wikis-tag-feeds.mdx",
      "docs/theme-plugins.mdx",
      "docs/theme-switchers.mdx",
      "blog/_data.yml",
      "blog/index.mdx",
      // this needs to be created and generified
      "blog/example-post.mdx",
      "features/index.mdx",
      "features/components.vto",
      "_data.yml",
      "_serve.ts",
      "_server_routes.ts",
      "404.md",
      "script.js",
      "style.css",
      "types.ts",
      "_cms.ts",
      "plugins.ts",
      "deno.json",
      "mod.ts",
      ".gitignore",
      "README.md"
    ];

    for (const file of files) {
      site.remoteFile(file, import.meta.resolve(`./src/${file}`));
    }
  };
}
